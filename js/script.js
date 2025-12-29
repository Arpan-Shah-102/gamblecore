const sfx = {
    hover: new Audio("./assets/hover.mp3"),
    click: new Audio("./assets/click.mp3"),
    startingClick: new Audio("./assets/starting-click.mp3"),
    endingClick: new Audio("./assets/ending-click.mp3"),
}

let sfxAbbr = document.querySelector(".mute-btn abbr");
let sfxSrc = document.querySelector(".mute-btn img");

let themeToggle = document.querySelector(".change-theme img");
addSFX(sfxSrc, true);
addSFX(themeToggle);

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
document.body.className = getCurrentTheme();
checkSFX();

let moneyLabel = document.querySelector(".money-label > p");
function updateMoneyLabel() {
    moneyLabel.textContent = moneyFormat(getMoney());
}
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
        sfxSrc.src = "./assets/sound-off.svg";
        sfxAbbr.setAttribute("title", "Sound is off");
    } else {
        sfxSrc.src = "./assets/sound-on.svg";
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

let gameBtns = document.querySelectorAll(".game");
let gamePrices = [0, 150, 400, 700, 900, 1500, 2250, 3500, 5000];

gameBtns.forEach((gameDiv, index) => {
    addSFX(gameDiv);
    updateGameButtons();
    gameDiv.addEventListener("click", () => {
        setTimeout(() => {
            if (gameDiv.classList.contains("locked")) {
                alert("You do not have enough money to unlock this game.");
            } else if (gameDiv.classList.contains("unlockable")) {
                let confirmUnlock = confirm(`Are you sure you want to unlock this game for ${moneyFormat(gamePrices[index])}?`);
                if (!confirmUnlock) return;
                calcMoney(gamePrices[index], "-");
                addGame(gameDiv.classList[1]);
                updateMoneyLabel();
                updateGameButtons();
                alert(`You have successfully unlocked ${gameDiv.classList[1]}!`);
                return;
            } else if (gameDiv.classList.contains("unlocked")) {
                    location.href = `../games/${gameDiv.classList[1]}/index.html`;
            };
        }, 150);
    });
});
function updateGameButtons() {
    let ownedGames = getOwnedGames();
    gameBtns.forEach((gameDiv, index) => {
        let gameName = gameDiv.classList[1];
        if (ownedGames.includes(gameName)) {
            gameDiv.classList.add("unlocked");
            gameDiv.classList.remove("unlockable");
            gameDiv.classList.remove("locked");
        }
        if (!ownedGames.includes(gameName) && enoughMoney(gamePrices[index])) {
            gameDiv.classList.add("unlockable");
            gameDiv.classList.remove("locked");
        }
        if (!ownedGames.includes(gameName) && !enoughMoney(gamePrices[index])) {
            gameDiv.classList.add("locked");
            gameDiv.classList.remove("unlockable");
        }
    });
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
            gameBtns.forEach(gameDiv => {
                gameDiv.style.backgroundImage = `url("./assets/${getCurrentTheme()}/${gameDiv.classList[1]}.png")`;
            });
        }
    });
});
observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['class']
});

let settingsBtn = document.querySelector(".settings-toggle img");
let closeSettingsBtn = document.querySelector(".settings-div .close-settings");
let clickOffSettings = document.querySelector(".click-off-settings");

addSFX(closeSettingsBtn);
addSFX(settingsBtn);
addSFX(clickOffSettings, false, false, false, true);

settingsBtn.addEventListener("click", () => {
    clickOffSettings.classList.toggle("active");
});
closeSettingsBtn.addEventListener("click", () => {
    clickOffSettings.classList.remove("active");
});
clickOffSettings.addEventListener("click", () => {
    clickOffSettings.classList.remove("active");
});

let settingButtons = document.querySelectorAll(".setting-btn");
settingButtons.forEach(btn => {
    addSFX(btn);
});

if (document.body.classList.contains("dark")) {
    gameBtns.forEach(gameDiv => {
        gameDiv.style.backgroundImage = `url("./assets/${getCurrentTheme()}/${gameDiv.classList[1]}.png")`;
    });
}

settingButtons[0].addEventListener("click", () => {
    setTimeout(() => {
        let choice = confirm("Are you sure you want to reset your game?");
        if (!choice) return;
        let choice2 = confirm("This action is irreversible. Are you REALLY sure?");
        if (!choice2) return;
        localStorage.clear();
        location.reload();
    }, 100);
});