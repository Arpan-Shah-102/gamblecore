const sfx = {
    hover: new Audio("../assets/hover.mp3"),
    click: new Audio("../assets/click.mp3"),
    startingClick: new Audio("../assets/starting-click.mp3"),
    endingClick: new Audio("../assets/ending-click.mp3"),
}

let sfxAbbr = document.querySelector(".mute-btn abbr");
let sfxSrc = document.querySelector(".mute-btn img");
let menuBtn = document.querySelector(".menu-btn > p");

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
menuBtn.addEventListener("click", () => {
    setTimeout(() => {
        location.href = ``;
    }, 150);
});
document.body.className = getCurrentTheme();
checkSFX();
addSFX(menuBtn);

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
        sfxSrc.src = "../assets/sound-off.svg";
        sfxAbbr.setAttribute("title", "Sound is off");
    } else {
        sfxSrc.src = "../assets/sound-on.svg";
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