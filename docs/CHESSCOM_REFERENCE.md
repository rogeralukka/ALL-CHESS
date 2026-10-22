# Chess.com UI Reference for ALL-CHESS

Study notes for building our own Duskboard / Dawnboard frontend. Collected 22-23 Oct 2026 by browsing Chess.com in a signed-in free account (a brand-new account with no games) and reading the live page styles.

**Purpose:** match Chess.com's *behaviour, hierarchy and information density*, but ship our own colors, icons, names, pieces and coach art. Nothing here should be copied pixel-for-pixel or reuse their assets (coach art, piece sets, icons, sounds, audio, copy text).

**Legend:** **[M]** = measured from the live page (computed style, stylesheet or CSS variable). **[O]** = observed visually in screenshots. **[I]** = inferred / approximate.

## 0. What was and wasn't covered

Covered: Home, Play Bots, Play Coach (lobby, in-game, game over), Puzzles (rated flow), Learn (path + lesson player), Analysis, Game Review (summary + move-by-move), Choose Your Coach, Settings (Board & Pieces, Gameplay, Coach), public Stats pages, design tokens, motion tokens, breakpoints.

Not covered / limits:
- Free account: only one Game Review could be run, so the **Game Rating and phase grades (Opening/Middlegame/Endgame)** never showed. The loading skeleton had rows for them, so they exist but were hidden for this account or this short game.
- The automated browser emulates **prefers-reduced-motion**, so live animation timings read as 0.0001s. Motion values below come from CSS variables and stylesheet rules. **Piece-slide timing is JavaScript-driven and was not measurable.**
- Phone layout could not be viewed (window would not resize). Breakpoints were read from the CSS instead.
- Not visited: Friends, Profile, Puzzle Rush, Openings explorer, Club, Watch.

## 1. App shell and layout

- **Page background [M]:** `#302e2b`.
- **Left sidebar [M]:** 170px wide, full height, background black at 20% over the page (≈ `#262522` [I]). Logo top-left. Items are 154x40 "ghost" buttons: 14px / 600, text white at 72%, radius 5px, padding 8px, 24px colorful icon. Items: Play, Puzzles, Learn, More (chevron), then a "Free Trial" item in light blue with a diamond. Bottom: Search, username row, and a row of four icon buttons (friends, messages with red count badge, notifications, settings).
- **Three-zone play layout [O]:** sidebar, large square board, and a fixed right "mode panel" about 450px wide. The mode panel changes per mode (Play Coach, Puzzles, Learn, Game Review, Analysis) but always has the same skeleton: header bar, coach portrait + bubble, mode content, action row.
- **Board size [M]:** 896px at a 1707x932 viewport (it fills the available height). Board radius 3px.
- **Eval bar [O]:** a slim vertical bar left of the board, white fill rising from the bottom, dark fill on top, with the numeric score printed at the end of the leading color (bottom for White ahead, top for Black ahead).
- **Player rows [O]:** name + rating + flag above and below the board, small avatar, and a captured-material tally (a piece icon and "+1", "+2") beside the leading side.
- **Right-side ad column [O]:** ignore.

## 2. Color tokens (resolved from their CSS variables) [M]

| Token | Value | Use |
|---|---|---|
| gray-800 | `#312E2B` | text on light bubbles, page tone |
| gray-700 | `#4B4847` | opaque "Black ahead" eval chip bg |
| gray-100 / 75 | `#F1F1F1` / `#F8F8F8` | light chip / text on dark chip |
| green-300 | `#81B64C` | brand green, Best/Excellent, primary buttons |
| green gradient end | `#5D9948` | primary button bottom |
| aqua-300 | `#26C2A3` | Brilliant |
| slate-300 | `#749BBF` | Great |
| skin-300 | `#D5A47D` | Book |
| gold-200 | `#F7C631` | Inaccuracy |
| orange-200 | `#FFA459` | Mistake |
| red-300 | `#FA412D` | Blunder |
| Miss | `#FF7769` | Miss |
| Good | `#95B776` | Good |
| blue-300 | `#008CD1` | skill / links / Remove Ads |
| purple-300 | `#7A66F4` | "tricky" tag |
| Board light / dark | `#EBECD0` / `#739552` | classic green board image (1600x1600 PNG, one image for the whole board) |
| Last-move highlight | `#FFFF33` at 50% opacity | both from and to square |
| Arrow green | `rgba(159,207,63,.64)` | best / hint |
| Arrow red | `rgba(248,85,63,.64)` | threats / refutations |
| Arrow blue | `rgba(72,193,249,.64)` | |
| Arrow orange | `rgba(255,170,0,.64)` | |

**Text on dark [M]:** primary `rgba(255,255,255,.85)`, secondary `rgba(255,255,255,.72)`.
**Panel surfaces [M]:** built from **black at 14% to 20%** over the page color, not separate hex values. Progress track: white at 10%, radius 10px.

**Eval chips [M]:** White ahead: background white 95% / text gray-800. Black ahead: background `#4B4847` / text `#F8F8F8`. Draw: white 25% / white text. Chip shape: radius 3px, padding 1px 5px, 15px bold (observed on a light `#E7E6E5` chip with `#312E2B` text).

## 3. Typography [M]

- **Body:** system stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, Helvetica, Arial, sans-serif`).
- **Display / headings:** a custom face called "Chess Sans". Page titles around 31px, weight 800.
- Buttons: 17px / 600 (large), 14px / 600 (nav/small).
- Bubble: 15px / line-height 21.45px, header row weight 500, body weight 400.
- Timer text 18px / 400. Rating/score numbers are bold and large.
- Section headings in cards: ~17-20px / 700 [I].

**Ours:** keep a system stack for body and pick one distinct display face (do not use Chess Sans).

## 4. Buttons [M]

All buttons share: **radius 10px** (large) or 5px (small/nav), semi-bold text, subtle bevel from inset highlights plus a soft drop shadow.

**Primary (green), large = 48px tall:**
- Background: `linear-gradient(180deg, #81B64C 0%, #5D9948 100%)`
- Shadows (in order): `inset 0 1px 0 #B2E068 @40%`, `inset 0 -1px 0 #45753C`, `inset 0 2px 4px #B2E068 @50%`, `inset 0 -2px 4px #45753C @50%`, `0 1px 2px black @14%`, `0 2px 4px black @10%`
- Text white. **Hover:** a light-green gradient (`#B2E068` at 50% fading to transparent) is layered over the base.

**Secondary, large = 48px tall:**
- Background: `linear-gradient(180deg, white 10%, white 5%)`
- Shadows: `inset 0 1px 0 white @8%`, `0 1px 2px black @14%`, `0 2px 4px black @10%`
- Text white at 85%.

**Ghost (nav):** transparent, text white 72%, 5px radius.
**Highlighted action:** during coach games the lightbulb (hint) button is filled green while resign and takeback are secondary.
**Danger:** the resign confirm popover has a gray Cancel and a red Resign.
**Toggles [O]:** green pill with a white round knob. Segmented controls use a dark rounded track with a lighter selected segment.

## 5. Radii, spacing, shadows

- Radius scale (rem-based) [M]: `radius-2 .2rem`, `radius-3 .3rem`, `radius-5 .5rem`, `radius-10 1rem`, `radius-20 2rem`, `circular 50%`. Observed computed radii: 2px (portrait), 3px (chips, board), 5px (nav), 10px (bubbles, buttons, progress).
- Panels are flat translucent blocks with no visible borders; separation comes from tone, not lines.
- Shadows are tiny and layered (1px + 2px blur), never large glows. Exceptions: celebration overlays.

## 6. The board

- **Web component** `wc-chess-board`; squares are addressed as `square-XY` (e.g. `square-88` = h8 in file-rank digits). Pieces are absolutely positioned `div.piece` elements with per-piece PNG images (about 150px each) from a theme CDN.
- **Coordinates:** drawn *inside* the board by default on the edge squares, in the *opposite* square color (settings allow Outside).
- **Last move:** both squares tinted yellow (`#FFFF33` @ 50%).
- **Legal-move hints:** small dots on target squares. Illegal-move attempts in coach play show the legal squares in blue.
- **Arrows:** semi-transparent (64%) with a rounded tail and triangular head; green = best, red = threat/refutation.
- **Move badges (Game Review):** a circle badge about one third of a square wide at the **top-right corner of the destination square**. The from and destination squares are highlighted in the classification color:
  - Blunder: from-square salmon, destination orange-yellow, red arrow for the refutation, red `??` badge. The king being hit also gets a red tint.
  - Best: destination green-tinted with a green star badge.
  - Excellent: green thumbs-up badge. Good: muted green check badge. Book: tan highlight with an open-book badge.
- **Capture/material and promotion [O]:** captured-piece tally by the player name; end-of-game badges sit on the kings (green crown on the winner, red resign flag on the loser).
- **Puzzle points [O]:** a floating "+5" in a dark circle at the top-right of the destination square.

**Themes (Settings -> Board & Pieces):** four tabs, **Boards (37), Pieces (41), Background (about 29), Presets (about 40)**. Full lists with colors are in section 6b. Layout: a scrollable 5-column tile grid on the left, a live 3x3 preview board on the right, Cancel / Save under the grid. Nothing is applied until Save.

## 6b. Board, piece, background and preset themes

Method: tile names were read from the page; board colors were **sampled from each preview image** (light square / dark square; textured themes such as Wood or Marble are averages, so treat as approximate **[M-sampled]**).

**UI pattern [O]:**
- **Boards:** 5-column grid of 2x2 mini boards (light/dark checker); selected tile has a green outline and a green circular check badge.
- **Pieces:** 5-column grid where each tile shows **that set's knight** on a dark tile; same selected treatment.
- **Background:** a **vertical list of wide rows**, each row shows the background as its own strip with the name on top (Standard, Game Room = green felt, Classic = dark gradient, Light = gray, then wood and others); selected row has a green outline and a check on the right.
- **Presets:** **2-column tiles**, each a 2x2 mini board **with pieces on it**, and a name under it (selected = green outline + green label). A preset sets board + pieces (+ background) together.
- Live preview is a 3x3 crop showing coordinates and a bishop/queen/pawn/knight/king/rook mix, so users see both colors and piece style.

**Board themes (37):**

| Theme | Light | Dark | Theme | Light | Dark |
|---|---|---|---|---|---|
| Green | `#ebecd0` | `#739552` | Dark Blue | `#ececd7` | `#4d6d92` |
| Wood | `#c9ac7b` | `#815a38` | Bubblegum | `#fff3f3` | `#f9cdd3` |
| Glass | `#717b8e` | `#29303e` | Checkers | `#c64d52` | `#333333` |
| Brown | `#f0d9b5` | `#b58863` | Graffiti | `#919191` | `#a9865e` |
| Icy Sea | `#d2dde4` | `#7d9eb3` | Light | `#dcdcdc` | `#ababab` |
| Newspaper | `#d0cfc6` | `#a9a8a1` | Neon | `#c9caca` | `#685f5c` |
| Walnut | `#b99c78` | `#71513a` | Orange | `#fce4b2` | `#d08b18` |
| Sky | `#efefef` | `#c2d7e3` | Overlay | `#efefef` | `#ababab` |
| Lolz | `#ced2d4` | `#b2b4b2` | Parchment | `#dbd6b9` | `#b59c64` |
| Stone | `#8c8a85` | `#444340` | Red | `#f0d8bf` | `#ba5546` |
| Bases | `#efc99d` | `#c7703d` | Sand | `#d3c4b6` | `#c3ae9a` |
| 8-Bit | `#f3f3f4` | `#6a9b41` | Tan | `#edc9a2` | `#d3a36a` |
| Marble | `#c5bfa9` | `#69645f` | Blue | `#f2f6fa` | `#5596f2` |
| Purple | `#efefef` | `#8877b7` | Pink | `#f5f0f1` | `#ec94a4` |
| Translucent | `#efefef` | `#ababab` | Chess The Musical | `#d7d4d4` | `#807b76` |
| Metal | `#d9d9d9` | `#737372` | Event: Naroditsky Memorial | `#fbfae9` | `#cea861` |
| Tournament | `#eaeae8` | `#32674b` | Event: Esports World Cup 2026 | `#f7f7f7` | `#ccaa6c` |
| Dash | `#bf935a` | `#653524` | Sky and Sea | `#a3ccd7` | `#3f7995` |
| Burled Wood | `#edc395` | `#793521` | | | |

Notes: **"Brown" is the classic chess-diagram brown** (`#f0d9b5` / `#b58863`), very close to your sand-and-clay mockup board. "Green" is the default. Event and bot-family themes are limited-time or tied to special content (a "Special Themes" toggle controls them). Boards are one **1600x1600 image** per theme (not per-square CSS), so themes can have texture.

**Piece sets (41):** Neo, Neo Angle, Game Room, Wood, Glass, Gothic, Classic, Metal, Bases, Neo-Wood, Icy Sea, Club, Ocean, Newspaper, Blindfold, Space, Cases, Condal, 3D - ChessKid, 8-Bit, Marble, Book, Alpha, Bubblegum, Dash, Graffiti, Light, Lolz, Luca, Maya, Modern, Nature, Neon, Sky, Tigers, Tournament, Vintage, 3D - Wood, 3D - Staunton, 3D - Plastic, Real 3D.
Observations: a mix of flat 2D sets (Neo, Classic, Alpha, Modern, Light), textured/novelty sets (Wood, Glass, Marble, Metal, Neon, Graffiti, Bubblegum, Tigers, 8-Bit) and 3D rendered sets (3D - Wood/Staunton/Plastic, Real 3D). "Blindfold" hides the pieces. One PNG per piece (about 150px), not an SVG sprite.

**Backgrounds (Standard + 28):** Standard (default), Game Room, Classic, Light, Wood, Glass, Tournament, Staunton, Newspaper, Tigers, Nature, Sky, Cosmos, Ocean, Metal, Gothic, Marble, Neon, Graffiti, Bubblegum, Lolz, 8-Bit, Bases, Blues, Dash, Icy Sea, Walnut, Chess The Musical, Bots - Martin's Family. These re-skin the **area behind the board and panels** as a full-page image/gradient.

**Presets (about 40):** Green, Wood, Green Angle, Wood Angle, Blue, Pink, Blue Angle, Pink Angle, Game Room, Classic, Light, Dark Wood, Glass, Tournament, Staunton, Newspaper, Tigers, Nature, Bluesky, Cosmos, Ocean, Metal, Gothic, Marble, Neon, Graffiti, Bubblegum, Lolz, 8-Bit, Bases, Blues, Dash, Icy Sea, Walnut, Checkers, Blindfold Pieces, Events (Naroditsky Memorial, Esports World Cup 2026), Chess The Musical, plus bot-family presets. "Angle" presets use the angled (Neo Angle) piece style.

**Related settings [O]:** Show coordinates (Inside/Outside), Highlight Last Move, Board Effects (opponent theme showcase, game-result animations, special themes), Win Celebration (None / Confetti), Piece Animations (speed Slow / Medium default / Fast; style Natural / Arcade / Dynamic), Sound themes (15, including Default, Nature, Metal, Marble, Space, Beat, Silly, Newspaper, Pebbles).

## 7. Move classifications [M] + [O]

Order in the full list (10 rows): Brilliant, Great, Book, Best, Excellent, Good, Inaccuracy, Mistake, Miss, Blunder.

| Label | Color | Icon glyph (circle badge) |
|---|---|---|
| Brilliant | `#26C2A3` | `!!` |
| Great | `#749BBF` | `!` |
| Book | `#D5A47D` | open book |
| Best | `#81B64C` | star |
| Excellent | `#81B64C` | thumbs-up |
| Good | `#95B776` | check mark |
| Inaccuracy | `#F7C631` | `?!` |
| Mistake | `#FFA459` | `?` |
| Miss | `#FF7769` | X |
| Blunder | `#FA412D` | `??` |

Also exist as tokens: forced (green), skill (blue), tricky (purple).

**Where they appear [O]:** (1) on the destination square, (2) inline before the move in the move list (and the move text itself is tinted in the label color for bad moves), (3) in the coach bubble header, (4) as colored dots on the mini eval graph, (5) as the color of the eval-graph cursor line (red on blunder, green on good). A user setting toggles icons in the move list.

## 8. Game Review flow

**Entry:** Analysis page -> load a PGN -> "Review" button (bottom bar: New / Save / Review / more). Game Over modal also has a big green **Game Review** button.

**Loading [O]:** the panel shows the coach portrait with a quote typing in the bubble (an unrelated famous quote, not a chess tip), a progress bar with a percentage, and a skeleton of the summary table with empty placeholder boxes and zero counts.

**Summary screen [O]:**
1. Coach bubble: "Okay, so, a quick look at how this game went."
2. Mini eval graph with colored dots on the key swings.
3. Players row (White, Black) with avatars.
4. Accuracy chips (a white chip for White, a dark chip for Black).
5. Move-quality table. Collapsed view shows only rows that are non-zero for either side, with a chevron to expand all 10. Layout per row: left count, centered colored icon, right count. Row text left-aligned. Counts are colored in the label color.
6. Big green **Start Review** button pinned at the bottom of the panel (the table above scrolls).
7. (Not seen on a free account) Game Rating and phase grades.

**Move-by-move [O]:**
- Coach bubble with a header (label icon + figurine piece + move text, e.g. "Bxf7+ is a blunder") and the eval chip right-aligned; a one or two sentence plain-language reason below.
- Buttons under the bubble: **Explain** (lightbulb), **Best** (star), **Next** (green). Good moves hide Explain and keep Best + Next. Book moves: Explain + Next. After tapping Best the buttons become Explain + **Resume**.
- **Explain** plays the refutation on the board as an inserted variation (indented sub-line in the move list with a left rule) and the buttons become back / forward arrows and a green **Got it!**.
- Move list below the buttons, two columns, figurine notation, the current move highlighted with a soft rounded box; a **Highlights** back button below it returns to the summary.
- Mini eval graph pinned at the bottom with a vertical cursor, then a row of transport controls: first, previous, **Play/Pause** (center), next, last.
- The eval bar and the graph cursor update on every step; arrow keys step moves.
- Tooltip on hover (e.g. "Play / Pause").

**Best-move example (matches our mockup):** after the Bxf7+ blunder, Best showed `c3 is best +0.28` with a green star badge.

## 9. The coach system

**Facts [M]:**
- Each coach is **one static transparent PNG** (a bust, shown at 96x96px, 2px radius). It does **not** change expression, animate, blink or gesture, in any mode. The same image appears in lobby, game, review, puzzles and lessons.
- The portrait is clickable and opens the **Choose Your Coach** modal.
- Voice: **every coach line has a pre-recorded (AI-generated, per Settings) MP3** fetched per line, keyed by a hash of the text, stored per coach and per locale. A speaker icon in the panel header mutes it. Settings has a Voice toggle.

**Bubble [M]:** background white, **radius 10px**, text `#312E2B`, 15px/21.45px; header row weight 500 with a 24px icon; about 360px wide and about 97px tall for two lines; a small tail points at the portrait. Portrait left, bubble right, top of the panel.

**Typing [M]/[I]:** text is revealed progressively (word-sized bursts, roughly 20-25 characters per second; header first, then the body). Multiple bubbles can **stack** vertically in a game (the opening-name comment, then a reply, older ones stay).

**Behaviours [O]:**
- Illegal move: coach says it is not legal and highlights the legal squares.
- Game start line, "Let's dive back in, shall we?" when resuming an unfinished game.
- Comments on both the bot's and the user's moves, with a thumbs-up badge on good moves.
- Live **opening name** label above the move list, and a book/compass pair of small icons at its right.
- Game over: coach says a closing line in the bubble.
- Persistent toast for achievements (bottom-right card with an icon, title and subtitle, close X).

**Choose Your Coach [O]:** a grid of 20 coaches (4 per row in the first-run page, 5 per row in Settings), each a rounded square portrait over a name; selected = green outline + green name; the selected coach speaks an intro line in a bubble on top; a green **Choose Coach** button at the bottom (modal) or "Continue" (onboarding).

**Coach settings [O]:** Enable Coach (appears after games), Reminders (practice/review), Voice, Skills (highlight strengths/weaknesses), Auto-save coach games; Puzzles: Show Puzzle Goals, Show Mistake Feedback, Show Chat Hints.

## 10. Play Coach lobby and in-game

- Lobby: top-of-panel coach with a welcome bubble. A collapsed section header "Casual v" opens three level cards: **Casual** ("an easier game so you can focus on learning"), **Balanced** ("an even match"), **Challenging** ("a hard game that pushes you"); a **Show All Levels** link; **Play As** icon toggle (White / Random / Black); a big green **Play** button.
- Play Bots lobby: category list (New to Chess, Beginner, Intermediate, Advanced, Master, Adaptive, Athletes, Musicians, Creators, Top Players, Personalities, Visualization, Engine) with counts; **Options**: timer presets (No Timer, Bullet, Blitz, Rapid, Standard) and toggles: **Bot Chat, Evaluation Bar, Threat Arrows, Suggestion Arrows, Move Feedback**. Large avatar + rating at the top.
- In-game action row: resign (flag), **hint (lightbulb, highlighted green)**, takeback (undo arrow). Below: share, download PGN, settings.
- **Resign:** a small popover anchored above the buttons: "Are you sure you want to resign?" with Cancel and a red Resign.
- **Game over [O]:** a modal over the board: title "X Won" with "by resignation" underneath, share + sound icons, a close X, a large portrait of the winner, big green **Game Review**, secondary **New Game**. Crown and flag badges on the kings. Coach line in the panel.

## 11. Puzzles

- Pre-start: intro modal with three bullets and a green **Ok**; panel shows the coach, a stone-path map and a green **Solve Puzzles** + list button.
- In puzzle [O]: header (level-stone icon with level number, "Puzzles", sound, options), coach bubble with a **checkbox-style "White to move"** header line plus the puzzle's goal in one sentence, a points counter with a progress bar toward the next stone, a running timer with clock icon, a **Hint** button, small settings and prev/next arrows.
- **Solved sequence [O], three beats:**
  1. Immediately: a "+5" bubble on the destination square; the coach bubble turns to **Solved - "Bingo! You got it."**; "+45" appears green beside the points counter; the footer buttons become Retry, Analysis and a big green **Next**.
  2. After about a second: the panel switches to the **level map**: an isometric forest path of numbered tree-stone tiles (1-16), completed tiles show a check, an avatar chip hops to the new tile.
  3. After about 4 seconds: the board **dims** and a celebration appears over it: a large wooden puzzle-stone with the level number and radiating light rays and the words "You Completed Level N!".
- Failing: red feedback, coach explains the mistake (setting "Show Mistake Feedback").
- Difficulty (Settings): Standard / Hard / Extra hard / Random, "Classic Mode" (rating only) vs puzzle points, Always Show Rating, Show Timer.

## 12. Learn

- Panel shows an **isometric diamond-tile path** (teal for lessons) scrolling bottom to top, with decorative 3D chess pieces beside the tiles, a small **"Next" tooltip** pointer above the next tile, the section name ("Learn To Play" / "Beginner" / "Intermediate" / "Advanced") above a list button and a big green **Next Lesson**.
- Lesson player: header with back arrow, lesson title, sound; coach + bubble; step text; the **single big green button at the bottom** changes label per step ("Let's Start!", "Continue"). On the board, only the pieces relevant to the lesson are shown; lesson aids are drawn as translucent green arrows radiating from the piece, or highlighted target squares.
- Sign-up wall and "save progress" modal appear for guests (we will not have this).

## 13. Analysis page

- Panel header "Analysis", three tabs: **Analysis, Games, Explore**.
- Paste box "Paste a PGN, FEN, or study link..." with a "+" and a **Load** button; a vertical menu of cards below: Set Up Position, New Analysis, Game Collections, Game Search, Explore, Saved Analysis, Classroom, each with a colorful icon, a title and a one-line subtitle.
- After loading: an **engine line header** ("depth=24 | Stockfish 19 Lite" with a settings gear), a toggle, and the **top 3 lines**, each with an eval chip and a collapsible arrow; then the game title row and the two-column move list; transport buttons; New / Save / Review.
- **Explore tab:** the current move path as a breadcrumb with left/right arrows, a source filter ("All Chess.com Games"), tabs for "Recommended Courses" and "Notable Games".

## 14. Home

- Header row: username and flag at left, **day-streak** flame counter at right.
- Big "Play Online" card: time presets (10 min, 5 min, 3 days; selected has a green outline), green **Start Game**, then four secondary buttons with colorful icons (Play Online, Tournaments, Play Coach/Bots, Play a Friend).
- Three entry cards side by side, each with a **mini board preview**, an icon + title + progress bar, and one secondary button: Puzzles ("Play to Solve" + level stone), Lessons (next lesson title + "Start"), Bots/Coach ("Coach Vishy" + "Play Coach").
- **Game History** card with an empty state (icon, "No Game History", sub-line, green "Play Chess").
- Right rail: **Daily Puzzle** (mini board, "solved by N players", Solve button, a week strip with day letters for the streak), Friends card with "Add Friends", Live on ChessTV.

## 15. Stats (public profile -> Stats tab)

- Profile header with avatar, name, title badge, flag, joined date, followers, online dot; tabs: Overview, Games, **Stats**, Awards, Clubs.
- Two dropdowns above the chart: time class (e.g. Rapid) and range (e.g. 90 days).
- Left sub-nav: **Overview, Openings, Tactics, Strategy, Endgames, Brilliant Moves.**
- Overview: title + current rating with delta arrow; an area line chart with a date x-axis; three stats (Global Rank, Friends Rank, Percentile); **All Games / White / Black** segmented toggle; four tiles (Games, Wins %, Draws %, Losses %); a **Show Detailed Stats** link; an **Advanced Stats** list of rows (Openings, Tactics, Strategy, Endgames, Brilliant Moves), each with an icon, a rating-like score, an up/down delta in green or red and a chevron.
- Openings page: opening rating chart, then an **Opening Stats table** with columns Stat | Grade | Member | Peers (grade is a colored star or check; examples: avg opening mistakes, opening accuracy, avg book moves) and expandable rows.

## 16. Settings inventory (read-only)

Left list: Board & Pieces, Gameplay, Profile, Interface, Social, Coach, Notifications, Account, Membership, Accessibility, plus a search box. Content area is a rounded card with sections, descriptive one-line helper text under every toggle, and a Save / Cancel button pair inside the section.

Worth copying as options for us:
- **Board:** boards, pieces, background, presets; show coordinates (inside/outside); highlight last move; **move method** (drag or click / click squares / drag pieces / both); **piece animation speed (Slow, Medium default, Fast) and style (Natural, Arcade, Dynamic)**; win celebration (None / Confetti); sound theme list (15 themes).
- **Gameplay:** always promote to queen (hold Alt to override), confirm resign/draw, show legal moves, focus mode, white always on bottom, castling method, premoves, confirm move.
- **Analysis:** engine evaluation at game end, post-game coach recap, show move timestamps, show classification icons in the move list.
- **Puzzles:** difficulty, points vs classic mode, always show rating, goals, mistake feedback, chat hints, show timer; reset buttons under "Training / Bots / Lessons history".

## 17. Motion

**Motion tokens [M]:** `instant 0ms`, `snappy 50ms`, `faster 100ms`, `fast 150ms`, `standard 200ms`, `moderate 250ms`, `steady 300ms`, `slow 400ms`, `slower 500ms`, `crawl 800ms`, `linger 5s`.
**Easings [M]:** `linear`, `ease-in-gentle cubic-bezier(.4,0,1,1)`, `ease-in-strong (.8,0,1,1)`, `ease-in-dramatic (.55,0,1,.45)`, `ease-out-gentle cubic-bezier(0,0,.2,1)` (the most-used out curve).
**Known [M]:** modal open fade `0.3s ease-out-gentle` (backdrop too), modal close `0.1s`; toasts have enter / leave / early-leave keyframes; streak popover has circle-grow and checkbox-entry keyframes; nav items have a selected-icon animation; there is a chess-themed **loader** built from four "move sequence" keyframes plus a spinner.
**Observed [O]:** typewriter bubble text; badge pop on the square; arrows drawn on the board; the eval bar and graph cursor update in step; reward cascade (points bubble -> map advance -> full-board celebration); game-over modal over the board.
**Not measurable:** piece slide duration and easing (JavaScript-driven; reduced-motion emulation active).

## 18. Responsive breakpoints [M] (em at 16px)

`20.6em / 25em / 30em / 34.4em / 40em (640) / 48em (768) / 60em (960) / 64em (1024) / 78.1em (1250)`. Most rules key off 48em (768px, the tablet cut), then 60em (960px). The play layout collapses the sidebar and moves the mode panel under the board on narrow screens [I].

## 19. Mapping to ALL-CHESS (what to copy, what to change)

**Copy the behaviours:**
- Fixed three-zone play layout: nav, board, mode panel; same panel skeleton in every mode (header, coach + bubble, content, action row, one primary green/amber button at the bottom).
- Badge on the destination square; classification color drives square tint, arrow, move-list icon, bubble header, graph dot and graph cursor.
- Review loop: bubble -> Explain / Best / Next -> variation in the move list -> Got it / Resume.
- Summary: collapsed non-zero table with an expander, accuracy chips, mini graph, one big Start Review button.
- Reward cascade for puzzles and lessons; achievement toast; illegal-move teaching moment; resume line for unfinished games.
- Settings depth (helper text under each toggle, Save per section).

**Change to make it ours:**
- Palette: use Duskboard (`#141312` page, `#1e1d1b` cards, amber `#f59e0b` accent) and Dawnboard (`#faf8f5`, `#ffffff`, border `#e8e4df`, text `#1e1b18`); our amber replaces their green for primary buttons. Keep the classification colors recognisable but slightly shifted (do not reuse their exact hexes if you want distance).
- Board: our sand and clay squares as the default; use an open-licence piece set (Chess.com's sets are proprietary). **Themes for v1:** structure ours the same way (Boards, Pieces, Background, Presets) but ship a small set, e.g. 8 boards (Sand-and-Clay default, Classic Green, Brown, Icy Sea, Walnut, Slate/Glass for Duskboard, Light/Paper for Dawnboard, Blue), 3 to 4 open-licence piece sets, 3 backgrounds, and 6 presets. Model a board theme as `{light, dark}` colors (optional texture image) so adding themes is just data; store the choice in settings and per-theme preview tiles (2x2). Add a live 3x3 preview and "nothing applies until Save".
- Coach: **we have 6 expression PNGs; they have one static image.** Use them: cross-fade 150ms on swap (+ a 2-3% scale settle in 300ms with ease-out-gentle), 96px bust crop in the bubble, full-body art for hero cards. Expression map: neutral = idle/balanced, thumbs-up = Best/Excellent/Good, finger-gun = Brilliant/Great/win, embarrassed = Mistake/Miss/Blunder, thoughtful = Explain/analysing/Inaccuracy, waving = greeting/resume/welcome.
- Bubble: keep white (Duskboard) / near-white card (Dawnboard), radius 10px, 15px text, header row with icon + move + eval chip, tail toward the portrait, typewriter at 25-40 cps with tap-to-skip and **no animation under prefers-reduced-motion**.
- Voice: optional. Use the browser's built-in speech (free) behind a Settings toggle, or skip entirely.
- Motion scale: reuse the same named scale (50 / 100 / 150 / 200 / 300 / 400 ms) and `cubic-bezier(0,0,.2,1)`; offer piece-animation speed Off / Fast / Medium / Slow.
- Ours-only additions already planned: clickable eval graph, "why" beside each alternate line, phase grades on every game, friends/scout, roadmap with XP.

## 20. Suggested next captures

1. Phone layout of these screens (needs a real device or emulation).
2. A paid-tier Game Review summary (Game Rating + phase grades).
3. Friends and Profile pages, Puzzle Rush, Openings explorer.
4. Frame-by-frame capture of piece slides (needs a browser without reduced-motion emulation).
