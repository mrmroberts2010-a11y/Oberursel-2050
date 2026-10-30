/**
 * Oberursel 2050 – planning decision game (Year 9 Settlements)
 * Google Apps Script data service for the GitHub Pages game. Data is stored in the Google Sheet
 * this script is attached to. Each class has its own game, players, marks and results.
 *
 * 1. Change TEACHER_PASSWORD below before you deploy.
 * 2. Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
 * 3. Paste the web app link into API_URL in index.html on GitHub. Students use the GitHub Pages link.
 */
const TEACHER_PASSWORD = 'change-me';

/* Class ids must match CLASSES in index.html. */
const CLASSES = {
  'roberts-1': 'Roberts – Class 1',
  'roberts-2': 'Roberts – Class 2',
  'stothard': 'Stothard',
  'langellueddecke': 'Langellüddecke'
};

/* ---------- web app ---------- */
function doGet() {
  return ContentService.createTextOutput('The Oberursel 2050 data service is running. Students use the GitHub Pages link, not this one.');
}
function doPost(e) {
  try {
    const req = JSON.parse(e.postData.contents);
    const actions = { checkKey: checkKey, getState: getState, savePlayer: savePlayer, setGame: setGame,
                      setMark: setMark, kick: kick, resetAll: resetAll, saveResults: saveResults };
    const fn = actions[req.fn];
    if (!fn) throw new Error('Unknown action.');
    return json_({ ok: true, result: fn.apply(null, req.args || []) });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------- storage helpers ---------- */
const PLAYER_HEADERS = ['id', 'name', 'class', 'last saved', 'homes', 'transport', 'energy', 'project', 'attractions', 'data (do not edit)'];
const DATA_COL = 10;
function ss_() { return SpreadsheetApp.getActiveSpreadsheet(); }
function sheet_(name, headers) {
  let sh = ss_().getSheetByName(name);
  if (!sh) {
    sh = ss_().insertSheet(name);
    sh.appendRow(headers);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
  }
  return sh;
}
function players_() { return sheet_('Players', PLAYER_HEADERS); }
function marks_() { return sheet_('Marks', ['id', 'name', 'class', 'data (do not edit)']); }
function game_() { return sheet_('Game', ['class', 'state']); }
function isTeacher_(key) { return typeof key === 'string' && key.length > 0 && key === TEACHER_PASSWORD; }
function requireTeacher_(key) { if (!isTeacher_(key)) throw new Error('Teacher password needed.'); }
function requireClass_(cls) { if (!CLASSES[cls]) throw new Error('Unknown class.'); }
function cache_() { return CacheService.getScriptCache(); }
function clearCache_() { cache_().remove('state'); }
function withLock_(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try { const r = fn(); clearCache_(); return r; } finally { lock.releaseLock(); }
}
function rowIndexById_(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return -1;
  const ids = sh.getRange(2, 1, last - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === id) return i + 2;
  return -1;
}
function readAll_() {
  const c = cache_().get('state');
  if (c) return JSON.parse(c);
  const state = { games: {}, players: {}, marks: {} };
  const g = game_().getDataRange().getValues();
  for (let i = 1; i < g.length; i++) if (g[i][0] && g[i][1]) { try { state.games[g[i][0]] = JSON.parse(g[i][1]); } catch (e) {} }
  const p = players_().getDataRange().getValues();
  for (let i = 1; i < p.length; i++) { if (!p[i][0]) continue; try { state.players[p[i][0]] = JSON.parse(p[i][DATA_COL - 1]); } catch (e) {} }
  const m = marks_().getDataRange().getValues();
  for (let i = 1; i < m.length; i++) { if (!m[i][0]) continue; try { state.marks[m[i][0]] = JSON.parse(m[i][3]); } catch (e) {} }
  const json = JSON.stringify(state);
  if (json.length < 95000) cache_().put('state', json, 3);
  return state;
}

/* ---------- API called from the page ---------- */
function checkKey(key) { return isTeacher_(key); }

/** Everyone polls this for one class. Other students' written justifications are only sent to the teacher. */
function getState(key, myId, cls) {
  requireClass_(cls);
  const all = readAll_();
  const teacher = isTeacher_(key);
  const out = { cls: cls, game: all.games[cls] || null, players: {}, marks: {} };
  Object.keys(all.players).forEach(function (id) {
    const p = all.players[id];
    if (!p || p.cls !== cls) return;
    if (!teacher && id !== myId) { p.why = undefined; delete p.why; }
    out.players[id] = p;
    if (all.marks[id]) out.marks[id] = all.marks[id];
  });
  return out;
}

function savePlayer(id, data) {
  if (!/^[a-z0-9]{8,40}$/.test(String(id))) throw new Error('Bad player id.');
  data = data || {};
  requireClass_(data.cls);
  const json = JSON.stringify(data);
  if (json.length > 40000) throw new Error('Too much text.');
  const name = String(data.name || '').slice(0, 40);
  if (!name) throw new Error('Name missing.');
  return withLock_(function () {
    const sh = players_();
    const row = [id, name, CLASSES[data.cls], new Date(), data.r1 || '', data.r2 || '', data.en || '', data.r3 || '', (data.attr || []).join(', '), json];
    const r = rowIndexById_(sh, id);
    if (r > 0) sh.getRange(r, 1, 1, row.length).setValues([row]); else sh.appendRow(row);
    return true;
  });
}

function setGame(key, cls, game) {
  requireTeacher_(key); requireClass_(cls);
  return withLock_(function () {
    const sh = game_();
    const r = rowIndexById_(sh, cls);
    const v = JSON.stringify(game || {});
    if (r > 0) sh.getRange(r, 2).setValue(v); else sh.appendRow([cls, v]);
    return true;
  });
}

function setMark(key, id, mark) {
  requireTeacher_(key);
  return withLock_(function () {
    const sh = marks_();
    const p = rowIndexById_(players_(), id);
    const name = p > 0 ? players_().getRange(p, 2).getValue() : '';
    const cls = p > 0 ? players_().getRange(p, 3).getValue() : '';
    const row = [id, name, cls, JSON.stringify(mark || {})];
    const r = rowIndexById_(sh, id);
    if (r > 0) sh.getRange(r, 1, 1, 4).setValues([row]); else sh.appendRow(row);
    return true;
  });
}

function deleteIds_(ids) {
  [players_(), marks_()].forEach(function (sh) {
    (ids || []).forEach(function (id) { const r = rowIndexById_(sh, id); if (r > 0) sh.deleteRow(r); });
  });
}

function kick(key, ids) {
  requireTeacher_(key);
  return withLock_(function () { deleteIds_(ids); return true; });
}

/** Clears one class only: its players, marks and game state. */
function resetAll(key, cls) {
  requireTeacher_(key); requireClass_(cls);
  return withLock_(function () {
    const p = players_().getDataRange().getValues();
    const ids = [];
    for (let i = 1; i < p.length; i++) {
      if (!p[i][0]) continue;
      try { if (JSON.parse(p[i][DATA_COL - 1]).cls === cls) ids.push(String(p[i][0])); } catch (e) {}
    }
    deleteIds_(ids);
    const g = rowIndexById_(game_(), cls);
    if (g > 0) game_().deleteRow(g);
    return ids.length;
  });
}

/** Writes one class's final results table to a new tab so it can go into a gradebook. */
function saveResults(key, cls, header, rows) {
  requireTeacher_(key); requireClass_(cls);
  const name = CLASSES[cls] + ' ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH-mm');
  const sh = ss_().insertSheet(name.replace(/[^\w äöüÄÖÜß–-]/g, ''));
  sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
  if (rows.length) sh.getRange(2, 1, rows.length, header.length).setValues(rows);
  sh.setFrozenRows(1);
  return sh.getName();
}
