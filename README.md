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

## Running the game
- **Students:** post your GitHub Pages address in Canvas.
- **Teacher:** open the same link with `?teacher=1` on the end and enter your password.
- At the end, **Save results to the Google Sheet** adds a results tab. **Reset for the next class** clears the players.

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
