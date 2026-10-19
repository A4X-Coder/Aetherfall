<div align="center">

# 💎 AETHERFALL

**Harmonize the Celestial Crystals**

A cosmic Match-3 puzzle game for your browser

*Swap. Shatter. Cascade. Chase the three-star resonance.*

### [▶ PLAY AETHERFALL NOW](https://a4x-coder.github.io/Aetherfall/)

![Genre](https://img.shields.io/badge/Genre-Match--3%20Puzzle-8a2be2)
![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20Desktop-00d9ff)
![Stack](https://img.shields.io/badge/Stack-HTML%20%7C%20CSS%20%7C%20JS-f7df1e?logo=javascript&logoColor=black)
![Dependencies](https://img.shields.io/badge/Dependencies-None-success)
![Hosting](https://img.shields.io/badge/Hosting-GitHub%20Pages-181717?logo=github)

</div>

<!-- Add a gameplay screenshot or GIF: save it as screenshot.png in the repo, then remove this comment markup.
<div align="center">

![Aetherfall gameplay](screenshot.png)

</div>
-->

---

## 🌌 About Aetherfall

Aetherfall is a browser-based Match-3 puzzle game set among drifting celestial spheres.

Swap neighbouring crystals to line up three or more, watch them shatter, and let the cascades ripple across the board. Build combos, forge special crystals, and clear each level's objective before your moves run out, all wrapped in soft, atmospheric audio and gentle ASMR-style chimes.

No downloads, no accounts, no frameworks. Just open the page and play.

## ✨ Features

- 💎 **Celestial Crystal Matching** — Six crystal types on an 8×8 board: Sapphire, Citrine, Amethyst, Emerald, Ruby, and Pearl.
- ⚡ **Special Crystals** — Line up four for a line crystal, or five or more for a board-clearing Supernova.
- 🔗 **Cascades & Combos** — Every chain reaction multiplies your score.
- 🌠 **30 Levels** — Grouped into six sectors of five, with star-based progression.
- 🎯 **Varied Objectives** — Reach a score, collect one crystal type, or collect two at once.
- 🎵 **Atmospheric Audio** — Layered ambience and ASMR chimes, with independent volume sliders.
- 📱 **Mobile-Friendly** — Touch and mouse controls through a single drag gesture, plus haptic feedback where supported.
- 🔀 **Smart Board** — The board reshuffles automatically when no valid moves remain.
- 💾 **Saved Progress** — Unlocked levels, stars, and high scores are stored in your browser.
- 📲 **PWA Ready** — Includes a web app manifest and service worker for installable, offline-friendly play.

## 🎮 How to Play

1. Press **Commence** on the title screen and pick a level from **Cosmic Spheres**.
2. **Drag a crystal** toward a neighbouring cell to swap them.
3. Match **three or more** of the same crystal in a row or column to shatter them.
4. Crystals fall, new ones fill in, and any new matches cascade automatically.
5. Complete the level's objective before you run out of moves.

An invalid swap simply slides back, and it doesn't cost you a move.

## 🕹️ Controls

| Action | Desktop | Android / Mobile |
|---|---|---|
| Swap crystals | Click and drag toward a neighbour | Swipe a crystal toward a neighbour |
| Pause | On-screen pause button | On-screen pause button |
| Adjust audio | Sliders in the pause menu | Sliders in the pause menu |

> A drag of about 22 px in one direction triggers the swap. A plain tap or click on its own does nothing.

## 💥 Special Crystals

| Match | Result | Effect |
|---|---|---|
| 3 in a row | Normal clear | Crystals shatter |
| 4 in a row | **Line crystal** | Clears its whole row or column, matching the direction of your match |
| 5+ in a row | **Supernova** | Clears every crystal of its type on the board |

Swapping with a Supernova is always a valid move, even without a match.

## 🎯 Objectives & Stars

Every level gives you a limited number of moves (roughly 17 to 28) and one of three goal types:

| Goal | What you do |
|---|---|
| **Score** | Reach a target score |
| **Collect** | Gather a set number of one crystal type |
| **Collect Dual** | Gather set numbers of two crystal types |

Each level also has three star thresholds. The first star is the target score, and the stars fill as the progress bar passes the 33%, 66%, and 100% markers.

Early levels use 4 crystal types, while later ones introduce all 6, so the board gets harder to read.

## 🏆 Scoring

Each cascade step awards:

```text
matches × 50 × combo
```

The combo counter grows with every chain reaction in a single move, so a long cascade is worth far more than several separate matches.

## 🔊 Audio

Open the pause menu to tune three independent sliders:

- **Master** — overall volume
- **ASMR Chimes** — sound effects
- **Atmosphere** — background music

## 🛠️ Built With

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and screens |
| CSS3 | Styling, layout, and visual effects |
| JavaScript (vanilla) | Gameplay, rendering, audio, and progress saving |
| localStorage | Saved progress and high scores |
| Web App Manifest + Service Worker | Installable, offline-friendly play |

There are no frameworks, no build step, and no external CDN dependencies.

## 📁 Project Structure

```text
Aetherfall/
├── index.html      # Screens: title, level select, HUD, pause, win/lose
├── style.css       # Styling and layout
├── game.js         # Game flow, input, scoring, objectives, save data
├── engine.js       # Board logic: matches, gravity, valid moves, reshuffle
├── renderer.js     # Drawing and animation
├── levels.js       # 30 level definitions
├── audio.js        # Music and sound effects
├── manifest.json   # Web app manifest
├── sw.js           # Service worker (offline caching)
└── README.md       # Project documentation
```

## 🚀 Play Online

### [💎 Launch Aetherfall](https://a4x-coder.github.io/Aetherfall/)

> **Recommended:** Use an up-to-date browser. Portrait orientation works best on phones.

## 💻 Run Locally

```bash
git clone https://github.com/A4X-Coder/Aetherfall.git
cd Aetherfall
```

Because the game uses a service worker and manifest, serve the folder instead of opening the file directly:

```bash
python -m http.server 8000
```

Then open <http://localhost:8000> in your browser.

## 🌐 Deployment

Aetherfall is hosted with GitHub Pages. To publish your own copy:

1. Push the project files to the root of your repository.
2. Open **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder.
5. Save, then wait for deployment to finish.

## 🗺️ Future Roadmap

- [ ] More levels and new sectors
- [ ] New goal types (obstacles, timed levels)
- [ ] Hints and manual shuffle boosters
- [ ] L- and T-shaped match bonuses
- [ ] Keyboard controls
- [ ] Online leaderboard

## 🤝 Feedback & Contributions

Found a bug or have an idea? Visit the [Aetherfall repository](https://github.com/A4X-Coder/Aetherfall) and open an issue. Please mention your device and browser.

## 📄 License

No license is specified in this repository unless a `LICENSE` file is added. Until then, reuse and redistribution permissions should not be assumed.

---

<div align="center">

Made by **A4X-Coder**

⭐ If you enjoyed Aetherfall, consider starring the repo!

</div>
