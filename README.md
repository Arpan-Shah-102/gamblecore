# Gamblecore

**Gamblecore** is a browser-based gambling game platform featuring multiple mini-games with a central hub. Players start with $1,000 and can unlock new games by earning money through gameplay.

## Features

- **9 Mini-Games**: Slot Machine, Coin Flip, Roulette, Blackjack, Poker, Scratch Cards, Bingo, Betting, and Lottery
- **Progressive Unlock System**: Locked games unlock as you earn more money
- **Sound Effects**: Hover and click audio feedback with mute toggle
- **Dark/Light Theme**: Switch between themes with persistent storage
- **Save/Load System**: Export and import game progress as JSON or TXT files
- **Responsive Design**: Grid-based layout (1-3 columns)
- **LocalStorage Persistence**: Money, owned games, theme, and mute settings are saved

## Project Structure

```
Gamblecore/
├────── index.html
├────── js/              # script.js, utils.js
├────── css/             # components.css, style.css
├────── assets/          # Icons (light/dark theme variants)
└── games/               # Individual game folders
    ├── slotmachine/
    ├── coinflip/
    ├── roulette/
    ├── blackjack/
    ├── poker/
    ├── scratchcards/
    ├── bingo/
    ├── betting/
    ├── lottery/
    ├── functions.js     # Shared game logic
    └── assets/          # Game images/icons
```

## How to Play

1. Open `https://arpan-shah-102.github.io/gamblecore/` in your browser
2. Click on unlocked games to play
3. Earn money to unlock locked games
4. Use settings to save progress, change theme, or mute audio

## Update Log

### Update 1.0 - 12/19/2025
1. Added Game Select Menu
2. Added Consistant Styling
3. Creating a varible/functions sharing system
4. Added settings
5. Added Theme changing
6. Added SFX
7. Added paths to games and main menu buttons
8. Created Consistant Money Label
9. Added icons to games
10. Added dynamic footer
11. Bug Fixes

### Update 1.05 - 12/19/2025
1. Made Compatiable with Github Pages
2. Bug Fixes
