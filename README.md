# Oberursel 2050

A two-lesson decision game for Year 9 Geography (Settlements). Each student plays as an urban planner deciding the future of Oberursel (Taunus): new homes, transport, energy, visitor attractions and a bigger sphere of influence. Every decision has winners and losers and must be justified. The teacher runs the rounds, draws event cards and marks justifications; a live leaderboard ranks the class.

- **Students:** no accounts or sign-in needed.
- **Data:** stored in a Google Sheet owned by the teacher.
- **Page:** hosted on GitHub Pages (`index.html`).
- **Data service:** a Google Apps Script attached to the Sheet (`apps-script/Code.gs`).

## One-time setup

### 1. Create the Google Sheet and data service
1. Create a new Google Sheet in your Drive, e.g. "Oberursel 2050 data".
2. Open **Extensions → Apps Script**.
3. Replace everything in `Code.gs` with the contents of [`apps-script/Code.gs`](apps-script/Code.gs).
4. Change `TEACHER_PASSWORD` near the top to your own password and save.
5. Click **Deploy → New deployment**, choose **Web app**, and set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy** and approve the permissions.
6. Copy the **Web app URL** (it ends in `/exec`).

### 2. Connect the page
1. In this repository, open `index.html` and click the pencil (edit) icon.
2. Find `const API_URL="PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";` near the top of the script and paste your Web app URL between the quotes.
3. Commit the change.

### 3. Turn on GitHub Pages
1. Go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
3. After a minute or two, the same page shows your site's address, something like `https://mrmroberts2010-a11y.github.io/Oberursel-2050/`.

## Classes
Four classes each have their own game, players, marks, leaderboard and results tab:

| Class | Student link (add to your Pages address) |
|---|---|
| Roberts – Class 1 | `?class=roberts-1` |
| Roberts – Class 2 | `?class=roberts-2` |
| Stothard | `?class=stothard` |
| Langellüddecke | `?class=langellueddecke` |

For example: `https://mrmroberts2010-a11y.github.io/Oberursel-2050/?class=stothard`. Students who open the plain address choose their class on the join screen.

To rename or add classes, edit `CLASSES` in both `index.html` and `apps-script/Code.gs` (the ids must match), then redeploy the Apps Script as a new version.

## Running the game
- **Students:** each teacher posts their class's student link in Canvas. No sign-in needed. If a shared iPad was used by someone else, the student taps **Not you?** to start fresh.
- **Teacher:** open the address with `?teacher=1` on the end and enter the teacher password. Choose your class; switch class at any time from the top bar. Two teachers can run different classes at the same time.
- At the end, **Save results to the Google Sheet** adds a results tab for that class. **Reset** clears only the selected class.

## Rounds
| Lesson | Round | Decisions |
|---|---|---|
| 1 | Map quiz | 6 auto-marked questions, grid references answered on the map |
| 1 | New homes | Site, affordable share, green space, residents' demand |
| 1 | Moving people | Transport investment, Altstadt traffic, night-train demand |
| 1 | Power the town | Energy source, how to pay, hiking club demand |
| 2 | Breaking news | Event card response |
| 2 | Sphere of influence | Flagship project, up to 2 visitor attractions (range and threshold check), land, youth council demand |
| 2 | Second shock | Event card response |
| 2 | Pitch | Written pitch, marked on 4 criteria |
| 2 | Results | Leaderboard and debrief |

## Updating
- Change the game: edit `index.html`.
- Change the data service: edit the script in Apps Script, then **Deploy → Manage deployments → Edit → New version** so the link stays the same.
