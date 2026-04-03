const symbols = ["💰", "💎", "🍀", "🎉", "7️⃣", "🔥"];
let betBtns = document.querySelectorAll(".buy-card-btn");
let scratchCardUnits = document.querySelectorAll(".unit");
let scratchCardBody = document.querySelector(".scratch-card-body");
let terminal = document.querySelector(".terminal");
let currentBet;
let totalScratched = 0;
let scrachedUnits = [];
let cardOptions = document.querySelector(".card-options");
let buyCardBtns = document.querySelectorAll(".buy-card-btn");

practiceModeToggle.addEventListener("click", () => {
    if (practiceMode) {
        buyCardBtns.forEach((btn, index) => {
            btn.textContent = `Free ${index + 1}!`;
        });
    } else {
        buyCardBtns.forEach(btn => {
            btn.textContent = `${moneyFormat(parseInt(btn.value))} Scratch Card`;
        });
    }
});

buyCardBtns.forEach(btn => {
    addSFX(btn);
    btn.addEventListener("click", () => {
        if (!practiceMode && !enoughMoney(parseInt(btn.value))) {
            alert("Not enough money!");
            return;
        }

        if (!practiceMode) {
            calcMoney(parseInt(btn.value), "-");
            updateMoneyLabel();
        }
        currentBet = parseInt(btn.value);
        if (currentBet == 100) {
            scratchCardBody.classList.add("l100");
            scratchCardBody.classList.remove("l500", "l1000", "l2000");
        } else if (currentBet == 500) {
            scratchCardBody.classList.add("l500");
            scratchCardBody.classList.remove("l100", "l1000", "l2000");
        } else if (currentBet == 1000) {
            scratchCardBody.classList.add("l1000");
            scratchCardBody.classList.remove("l100", "l500", "l2000");
        } else if (currentBet == 2000) {
            scratchCardBody.classList.add("l2000");
            scratchCardBody.classList.remove("l100", "l500", "l1000");
        }

        scratchCardBody.style.display = "flex";
        cardOptions.style.display = "none";
        terminal.textContent = "Click a Cell to Scratch!";
    });
});
scratchCardUnits.forEach(unit => {
    addSFX(unit);
    unit.addEventListener("click", () => {
        if (unit.classList.contains("scratched")) return;
        // playSound(sfx.scratch);

        unit.classList.add("scratched");
        unit.classList.remove("unscratched");
        let symbol = symbols[Math.floor(Math.random() * symbols.length)];
        unit.textContent = symbol;
        scrachedUnits.push(symbol);
        totalScratched++;

        if (totalScratched == 9) {
            setTimeout(() => {
                allUnitsScratched();
            }, 500);
        }
    });
});
function allUnitsScratched() {
    if (getPrizesUnlocked().includes("seven")) {
        if (scrachedUnits.filter(s => s === "7️⃣").length >= 3) {
            prizeWon("7️⃣", 10);
            return;
        }
    }
    if (getPrizesUnlocked().includes("clover")) {
        if (scrachedUnits.filter(s => s === "🍀").length >= 3) {
            prizeWon("🍀", 7.5);
            return;
        }
    }
    if (getPrizesUnlocked().includes("diamond")) {
        if (scrachedUnits.filter(s => s === "💎").length >= 3) {
            prizeWon("💎", 5);
            return;
        }
    }
    if (scrachedUnits.filter(s => s === "🔥").length >= 3) {
        prizeWon("🔥", 3);
        return;
    }
    if (scrachedUnits.filter(s => s === "💰").length >= 3) {
        prizeWon("💰", 2);
        return;
    }
    if (scrachedUnits.filter(s => s === "🎉").length >= 3) {
        prizeWon("🎉", 1.5);
        return;
    }
    setTimeout(() => {
        alert("Better luck next time!");
        resetGame();
    }, 100);
    terminal.textContent = "You lost!";
    // playSound(sfx.lose);
}
function prizeWon(symbol, multiplier) {
    // playSound(sfx.win);
    if (!practiceMode) {
        setTimeout(() => {
            alert(`Congratulations! You scratched at least 3 ${symbol}s and won ${multiplier}X (${moneyFormat(currentBet * multiplier)}) your bet!`);
            resetGame();
        }, 100);
        terminal.textContent = `You won ${moneyFormat(currentBet * multiplier)}!`;
        calcMoney(currentBet * multiplier, "+");
    } else {
        setTimeout(() => {
            alert(`Congratulations! You scratched at least 3 ${symbol}s!`);
            resetGame();
        }, 100);
        terminal.textContent = `You won!`;
    }
}

function resetGame() {
    scratchCardBody.style.display = "none";
    cardOptions.style.display = "grid";
    terminal.textContent = "Buy a scratch card to play!";
    totalScratched = 0;
    scrachedUnits = [];
    if (!practiceMode) {updateMoneyLabel();}
    scratchCardUnits.forEach(unit => {
        unit.classList.remove("scratched");
        unit.classList.add("unscratched");
        unit.textContent = "💲";
    });
    updateThings();
}

let wholeUpgrades = document.querySelector(".upgrades");
let upgradeContainer = document.querySelector(".upgrade-cont");
let getUpgradeBtns = document.querySelectorAll(".upgrade-row .buy");
let prizeContainer = document.querySelector(".prize-cont");

getUpgradeBtns.forEach(btn => {
    addSFX(btn);
    btn.addEventListener("click", () => {
        if (getMoney() < parseInt(btn.dataset.price)) {
            alert("Not enough money!");
            return;
        }
        if (practiceMode) {
            if (!confirm("Are you sure you want to unlock this prize? It will still cost money in practice mode.")) {return;}
        }
        calcMoney(parseInt(btn.dataset.price), "-");
        if (!practiceMode) {
            updateMoneyLabel();
        } else {
            alert(`Prize unlocked! ${moneyFormat(getMoney())} remaining.`);
        }
        unlockPrize(btn.dataset.name);
        updateThings();
    });
});

function updateThings() {
    buyCardBtns.forEach(btn => {
        if (enoughMoney(parseInt(btn.value))) {
            btn.disabled = false;
            btn.classList.remove("red");
            btn.classList.add("green");
        } else {
            btn.disabled = true;
            btn.classList.remove("green");
            btn.classList.add("red");
        }
        if (practiceMode) {
            btn.textContent = "Free!";
        } else {
            btn.textContent = `${moneyFormat(parseInt(btn.value))} Scratch Card`;
        }
    });
    getUpgradeBtns.forEach(btn => {
        if (enoughMoney(parseInt(btn.dataset.price))) {
            btn.disabled = false;
            btn.classList.remove("red");
            btn.classList.add("green");
        } else {
            btn.disabled = true;
            btn.classList.remove("green");
            btn.classList.add("red");
        }

        if (getPrizesUnlocked().includes(btn.dataset.name) && document.querySelector(`.${btn.dataset.name}-row`) == null) {
            btn.parentElement.remove();
            let prizeRow = document.createElement("div");
            prizeRow.classList.add("prize-row", "basic-row", `${btn.dataset.name}-row`);

            let prizeName = document.createElement("h2");
            prizeName.textContent = btn.dataset.multiplier + "X";
            prizeRow.appendChild(prizeName);

            let prizeSymbols = document.createElement("div");

            let symbol1 = document.createElement("h2");
            symbol1.textContent = btn.value;
            symbol1.classList.add("scratch-bg");

            let symbol2 = document.createElement("h2");
            symbol2.textContent = btn.value;
            symbol2.classList.add("scratch-bg");

            let symbol3 = document.createElement("h2");
            symbol3.textContent = btn.value;
            symbol3.classList.add("scratch-bg");

            prizeSymbols.appendChild(symbol1);
            prizeSymbols.appendChild(symbol2);
            prizeSymbols.appendChild(symbol3);
            prizeRow.appendChild(prizeSymbols);

            prizeContainer.appendChild(prizeRow);
        }
        if (upgradeContainer.children.length == 0) {
            wholeUpgrades.style.display = "none";
        }
    });
}
updateThings();
