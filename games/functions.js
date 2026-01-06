const sfx = {
    click: new Audio("../../assets/click.mp3"),
    hover: new Audio("../../assets/hover.mp3"),
    startingClick: new Audio("../../assets/starting-click.mp3"),
    endingClick: new Audio("../../assets/ending-click.mp3"),
    gameBought: new Audio("../../assets/game-bought.mp3"),
    cheat: new Audio("../../assets/cheat.mp3"),
}

let sfxAbbr = document.querySelector(".mute-btn abbr");
let sfxSrc = document.querySelector(".mute-btn img");
let menuBtn = document.querySelector(".menu-btn > p");

let themeToggle = document.querySelector(".change-theme img");
let practiceModeToggle = document.querySelector(".practice-mode img");
let practiceModeAbbr = document.querySelector(".practice-mode abbr");
let practiceMode = false;

addSFX(sfxSrc, true);
addSFX(themeToggle);
addSFX(practiceModeToggle);

practiceModeToggle.addEventListener("click", () => {
    practiceMode = !practiceMode;
    let moneyLabel = document.querySelector(".money-label > p");

    if (practiceMode) {
        practiceModeToggle.src = "../../assets/practice-mode-on.svg";
        practiceModeAbbr.setAttribute("title", "Practice mode is on");
        moneyLabel.textContent = "Practice";
    } else {
        practiceModeToggle.src = "../../assets/practice-mode-off.svg";
        practiceModeAbbr.setAttribute("title", "Practice mode is off");
        updateMoneyLabel();
    }
});

sfxSrc.addEventListener("click", () => {
    toggleMute();
    checkSFX();
});
themeToggle.addEventListener("click", () => {
    if (getCurrentTheme() === "light") {
        document.body.classList.replace("light", "dark");
        setCurrentTheme("dark");
    } else {
        document.body.classList.replace("dark", "light");
        setCurrentTheme("light");
    }
});
menuBtn.addEventListener("click", () => {
    setTimeout(() => {
        location.href = `../../`;
    }, 150);
});

let gameLockedOverlay = document.querySelector(".game-locked");
let closeLockedBtn = document.querySelector(".close-locked-btn");
let unlockWithLockedBtn = document.querySelector(".unlock-game-with-locked");

let gamePrices = [0, 150, 400, 700, 900, 1500, 2250, 3500, 5000];
let games = ["slotmachine", "coinflip", "roulette", "blackjack", "poker", "scratchcards", "bingo", "betting", "lottery"];
const currentGamePrice = gamePrices[games.indexOf(gameLockedOverlay.classList[1])];

if (!gameOwned(gameLockedOverlay.classList[1])) {
    gameLockedOverlay.classList.add("shown");
}
closeLockedBtn.addEventListener("click", () => {
    setTimeout(() => {
        location.href = `../../`;
    }, 150);
});
unlockWithLockedBtn.addEventListener("click", () => {
    setTimeout(() => {
        if (enoughMoney(currentGamePrice)) {
            let confirmUnlock = confirm(`Are you sure you want to unlock ${gameLockedOverlay.classList[1]} for ${moneyFormat(currentGamePrice)}?`);
            if (!confirmUnlock) return;
            calcMoney(currentGamePrice, "-");
            addGame(gameLockedOverlay.classList[1]);
            gameLockedOverlay.classList.remove("shown");
            updateMoneyLabel();
            playSound(sfx.gameBought);
        } else {
            alert("You do not have enough money to unlock this game.");
        }
    }, 150);
});
if (currentGamePrice <= getMoney()) {
    closeLockedBtn.classList.remove("green");
    unlockWithLockedBtn.classList.add("green");
    unlockWithLockedBtn.classList.remove("red");
}

const currentYear = new Date().getFullYear();
document.body.className = getCurrentTheme();
checkSFX();
addSFX(menuBtn);
addSFX(closeLockedBtn);
addSFX(unlockWithLockedBtn);
updateMoneyLabel();

function addSFX(element, muteOverride = false, muteOverride2 = false, soundOverride = false, soundOverride2 = false) {
    if (!soundOverride2) {
        element.addEventListener("mouseenter", (e) => {
            if (e.target !== element) return;
            playSound(sfx.hover, muteOverride2);
        });
    }
    if (!soundOverride) {
        element.addEventListener("mousedown", (e) => {
            if (e.target !== element) return;
            playSound(sfx.startingClick, muteOverride);
        });
        element.addEventListener("mouseup", (e) => {
            if (e.target !== element) return;
            playSound(sfx.endingClick, muteOverride);
        });
    }
}
function checkSFX() {
    if (isMuted()) {
        sfxSrc.src = "../../assets/sound-off.svg";
        sfxAbbr.setAttribute("title", "Sound is off");
    } else {
        sfxSrc.src = "../../assets/sound-on.svg";
        sfxAbbr.setAttribute("title", "Sound is on");
    }
}
function playSound(sound, muteOveride = false) {
    if (isMuted() && !muteOveride) return;
    s = sound.cloneNode();
    s.play();
    s.addEventListener('ended', () => {
        s.remove();
    });
}