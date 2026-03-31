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
├── index.html
├── js/              # script.js, utils.js
├── css/             # components.css, style.css
├── assets/          # Icons (light/dark theme variants)
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

### Update 3.2 - 3/30/2026
1. Created Basic UI for scratch cards
2. UI Updates
3. Bug Fixes

### Update 3.1 - 3/25/2026
1. Fixed UI Scaling Bugs
2. Added Abilities in Betting game
3. Made abilities free if practice mode enabled
4. Bug Fixes

### Update 3.0 - 3/23/2026
1. Fixed UI scaling bugs on games
2. Added UI scaling to betting
3. Added shadows to elements without shadows
4. Added new SFX to betting
5. Added special-guest all to invite all special guests (also added return varient)
6. Fixed footer unkown command bug
7. Fixed sg / lsp bug in footer
8. Bug Fixes

### Update 2.9 - 3/22/2026
1. Finished basic betting gameplay (Still no upgrades or UI scaling support)
2. Added SBR reference
3. Added secret footer commands to betting
4. Fixed footer wrong command not clearing
5. Bug Fixes

### Update 2.7 - 3/21/2026
1. Fixed Scaling Issues
2. Finished Coinflip Upgrades
3. Fully implemented practice mode support in coinflip
4. Started work on betting game
5. Added Refrences SFX to every game
6. Bug fixes

### Update 2.4 - 1/25/2026
1. Fixed Scaling issues with everything
2. Fixed practice mode in coinflip
3. Added Upgrades to coinflip
4. Fixed dark mode bugs
5. Bug fixes

### Update 2.1 - 1/19/2026
1. Added ability to change coinflip side and bet
2. Updated large screen UI scaling
3. Fixed coin flipping while aleady flipping
4. Bug fixes

### Update 2.05 - 1/7/2025
1. Added Coinflip Mechanism (Changing bet and bet side doesn't work)
2. Added New SFX
3. Bug fixes

### Update 2.0 - 1/6/2025
1. Added Sfx for Jacob
2. Improved UI scaling for smaller devices
3. Added UI scaling for larger devices
4. Bug fixes

### Update 1.9 - 1/5/2025
1. Added Help Menu for sfx footer command by typing "h" or "help"
2. Added new Sfx (d), victrin
3. Improved mobile UI scaleing
4. Worked on coinflip game UI
5. Added Coinflip light mode and darkmode popup to the menu
6. Bug Fixes

### Update 1.7 - 1/3/2026
1. Added ability to buy games from blocked screen
2. Added Slot Machine functionality
3. Added Secret Sfx through codes
4. Added Practice mode that doesn't use money
5. Added Icons for made games in menu
6. Added more sound effects
7. Updated Alerts
8. Added secret to get $1,000,000 for devs
8. Bug fixes

### Update 1.2 - 12/30/2025
1. Blocked access to games if not owned
2. Bug fixes

### Update 1.05 - 12/29/2025
1. Made Compatiable with Github Pages
2. Bug Fixes

### Update 1.0 - 12/29/2025
1. Added Game Select Menu
2. Added Consistant Styling
3. Creating a varible/functions sharing system
4. Added settings
5. Added Theme changing
6. Added SFX
7. Added paths to games and main menu buttons
8. Created Consistant Money Label
9. Added icons to games
10. Added dynamic footer year
11. Bug Fixes
