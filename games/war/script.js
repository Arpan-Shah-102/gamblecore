const gameSfx = {
    flipCard: new Audio("../assets/sfx/war/flip-card.mp3"),
    win: new Audio("../assets/sfx/war/win.mp3"),
    lose: new Audio("../assets/sfx/war/lose.mp3"),
    tie: new Audio("../assets/sfx/war/tie.mp3"),
    upgrade: new Audio("../assets/sfx/war/upgrade.mp3"),
}

const cards = [
    "🂢","🂣","🂤","🂥","🂦","🂧","🂨","🂩","🂪","🂫","🂭","🂮","🂡",
    "🂲","🂳","🂴","🂵","🂶","🂷","🂸","🂹","🂺","🂻","🂽","🂾","🂱",
    "🃂","🃃","🃄","🃅","🃆","🃇","🃈","🃉","🃊","🃋","🃍","🃎","🃁",
    "🃒","🃓","🃔","🃕","🃖","🃗","🃘","🃙","🃚","🃛","🃝","🃞","🃑",
];
const cardValues = {
    "🂡": 14, "🂱": 14, "🃁": 14, "🃑": 14,
    "🂢": 2, "🂲": 2, "🃂": 2, "🃒": 2,
    "🂣": 3, "🂳": 3, "🃃": 3, "🃓": 3,
    "🂤": 4, "🂴": 4, "🃄": 4, "🃔": 4,
    "🂥": 5, "🂵": 5, "🃅": 5, "🃕": 5,
    "🂦": 6, "🂶": 6, "🃆": 6, "🃖": 6,
    "🂧": 7, "🂷": 7, "🃇": 7, "🃗": 7,
    "🂨": 8, "🂸": 8, "🃈": 8, "🃘": 8,
    "🂩": 9, "🂹": 9, "🃉": 9, "🃙": 9,
    "🂪": 10, "🂺": 10, "🃊": 10, "🃚": 10,
    "🂫": 11, "🂻": 11, "🃋": 11, "🃛": 11,
    "🂭": 12, "🂽": 12, "🃍": 12, "🃝": 12,
    "🂮": 13, "🂾": 13, "🃎": 13, "🃞": 13,
};
const cardSuits = {
    "🂢": "♤", "🂣": "♤", "🂤": "♤", "🂥": "♤", "🂦": "♤", "🂧": "♤", "🂨": "♤", "🂩": "♤", "🂪": "♤", "🂫": "♤", "🂭": "♤", "🂮": "♤", "🂡": "♤",
    "🂲": "♡", "🂳": "♡", "🂴": "♡", "🂵": "♡", "🂶": "♡", "🂷": "♡", "🂸": "♡", "🂹": "♡", "🂺": "♡", "🂻": "♡", "🂽": "♡", "🂾": "♡", "🂱": "♡",
    "🃂": "♢", "🃃": "♢", "🃄": "♢", "🃅": "♢", "🃆": "♢", "🃇": "♢", "🃈": "♢", "🃉": "♢", "🃊": "♢", "🃋": "♢", "🃍": "♢", "🃎": "♢", "🃁": "♢",
    "🃒": "♧", "🃓": "♧", "🃔": "♧", "🃕": "♧", "🃖": "♧", "🃗": "♧", "🃘": "♧", "🃙": "♧", "🃚": "♧", "🃛": "♧", "🃝": "♧", "🃞": "♧", "🃑": "♧",
}
let cardsDisplays = document.querySelectorAll(".card");
let [playerCard, computerCard] = cardsDisplays;
let betInput = document.querySelector(".bet-amount");
let drawCardBtn = document.querySelector(".draw");

addSFX(drawCardBtn);
betInput.value = getWarBetAmount();
betInput.addEventListener("blur", () => {
    let betAmount = parseInt(betInput.value);
    if (isNaN(betAmount) || betAmount < 1) {
        betInput.value = getWarBetAmount();
    } else if (betAmount > 1000) {
        betInput.value = 1000;
    }
    if (betAmount > getMoney()) {
        betInput.value = getMoney();
    }
    setWarBetAmount(betInput.value);
});
practiceModeToggle.addEventListener("click", () => {
    if (!practiceMode) {
        betInput.value = getWarBetAmount();
        betInput.disabled = false;
    } else {
        betInput.value = "0";
        betInput.disabled = true;
    }
});

drawCardBtn.addEventListener("click", () => {
    let betAmount = getWarBetAmount();
    if (betAmount > getMoney() && !practiceMode) {
        alert("You do not have enough money to make this bet.");
        return;
    }
    if (!practiceMode) {
        calcMoney(betAmount, "-");
        updateMoneyLabel();
        updateUpgradeDisplays();
    }
    playSound(gameSfx.flipCard);

    drawCardBtn.classList.add("disabled");
    betInput.disabled = true;
    playerCard.classList.add("drawing");

    let playerCardIdx = Math.floor(Math.random() * cards.length);
    if (getWarUpgradeLevels().player > 0) {
        let playerCardValue = cardValues[cards[playerCardIdx]];
        playerCardValue += getWarUpgradeLevels().player;
        if (playerCardValue > 14) {
            playerCardValue = 14;
        }
        const playerCardSuit =
            playerCardIdx <= 12 ? "♤" :
            playerCardIdx <= 25 ? "♡" :
            playerCardIdx <= 38 ? "♢" :
            "♧";
        playerCardIdx = cards.findIndex(card => cardValues[card] == playerCardValue && cardSuits[card] == playerCardSuit);
    }

    let computerCardIdx = Math.floor(Math.random() * cards.length);
    if (getWarUpgradeLevels().computer > 0) {
        let computerCardValue = cardValues[cards[computerCardIdx]];
        computerCardValue -= getWarUpgradeLevels().computer;
        if (computerCardValue < 2) {
            computerCardValue = 2;
        }
        const computerCardSuit =
            computerCardIdx <= 12 ? "♤" :
            computerCardIdx <= 25 ? "♡" :
            computerCardIdx <= 38 ? "♢" :
            "♧";
        computerCardIdx = cards.findIndex(card => cardValues[card] == computerCardValue && cardSuits[card] == computerCardSuit);
    }

    setTimeout(() => {
        playerCard.textContent = cards[playerCardIdx];
        if (playerCardIdx >= 13 && playerCardIdx <= 38) {
            playerCard.classList.add("r");
        }
    }, 500);
    setTimeout(() => {
        playerCard.classList.remove("drawing");
    }, 1050);

    setTimeout(() => {
        computerCard.classList.add("drawing");
        playSound(gameSfx.flipCard);
    }, 1500);
    setTimeout(() => {
        computerCard.textContent = cards[computerCardIdx];
        if (computerCardIdx >= 13 && computerCardIdx <= 38) {
            computerCard.classList.add("r");
        }
    }, 2000);
    setTimeout(() => {
        computerCard.classList.remove("drawing");
    }, 2550);

    setTimeout(() => {
        let playerValue = cardValues[playerCard.textContent];
        let computerValue = cardValues[computerCard.textContent];
        let alertText = "";

        if (playerValue > computerValue) {
            if (!practiceMode) {
                calcMoney(betAmount * 2, "+"); updateMoneyLabel();
                alertText = `You win! You earned ${moneyFormat(betAmount * 2)}.`;
            } else {
                alertText = "You win! Great job!";
            }
            playSound(gameSfx.win);
        } else if (playerValue < computerValue) {
            alertText = "You lose! Better luck next time.";
            playSound(gameSfx.lose);
        } else {
            if (!practiceMode) {
                calcMoney(betAmount, "+"); updateMoneyLabel();
                alertText = "It's a tie! Your bet has been returned.";
            } else {
                alertText = "It's a tie! Nice try.";
            }
            playSound(gameSfx.tie);
        }
        updateFooterDelay(alertText);
        if (!getAlertsDisabled()) {
            setTimeout(() => {
                alert(alertText);
            }, 150);
        }

        updateUpgradeDisplays();
        drawCardBtn.classList.remove("disabled");
        betInput.disabled = !practiceMode ? false : true;
        playerCard.textContent = "🂠";
        computerCard.textContent = "🂠";
        playerCard.classList.remove("r");
        computerCard.classList.remove("r");
    }, 2750);
});

let playerLevel = document.querySelector(".level.player");
let playerUpgrade = document.querySelector(".upgrade.player");
let computerLevel = document.querySelector(".level.computer");
let computerUpgrade = document.querySelector(".upgrade.computer");
const upgradeBtns = [playerUpgrade, computerUpgrade];
const levelLabels = [playerLevel, computerLevel];

addSFX(playerUpgrade);
addSFX(computerUpgrade);

upgradeBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        const level = getWarUpgradeLevels()[index == 0 ? "player" : "computer"];
        if (level >= 3) return;
        const upgradeCost = getWarUpgradePrices()[level];
        if (getMoney() < upgradeCost) {
            if (!practiceMode) {
                alert("You do not have enough money to purchase this upgrade.");
            } else {
                alert("Buying upgrades in practice mode still takes your money. You do not have enough money to purchase this upgrade.");
            }
            return;
        }
        if (practiceMode) {
            if (!confirm("Buying upgrades in practice mode still takes your money. Are you sure you want to purchase this upgrade? Current Blance: " + moneyFormat(getMoney()))) {
                return;
            }
        }
        calcMoney(upgradeCost, "-");
        playSound(gameSfx.upgrade);
        setWarUpgradeLevel(index == 0 ? "player" : "computer", level + 1);
        updateUpgradeDisplays("Upgrade purchased!");
        if (!practiceMode) {
            updateMoneyLabel();
        } else {
            alert(`Upgrade purchased! Your remaining money is ${moneyFormat(getMoney())}.`);
        }
        updateUpgradeDisplays();
    });
});

function updateUpgradeDisplays() {
    upgradeBtns.forEach((btn, index) => {
        const level = getWarUpgradeLevels()[index == 0 ? "player" : "computer"];
        if (level < 3) {
            btn.textContent = moneyFormat(getWarUpgradePrices()[level]);
        } else {
            btn.textContent = "Max Level";
            btn.classList.add("disabled");
        }
        levelLabels[index].textContent = `Lvl ${level}`;

        if (getMoney() < getWarUpgradePrices()[level]) {
            btn.classList.remove("green");
            btn.classList.add("red");
        } else if (getMoney() >= getWarUpgradePrices()[level]) {
            btn.classList.remove("red");
            btn.classList.add("green");
        }

        if (level >= 3) {
            btn.classList.remove("green", "red");
        }
    });
}
updateUpgradeDisplays();

footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        check2 = true;
        wrongFooterCommand();
    }
});