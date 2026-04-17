const gameSfx = {
    flipNumber: new Audio("../assets/sfx/higherorlower/reveal-number.mp3"),
    win: new Audio("../assets/sfx/higherorlower/win.mp3"),
    lose: new Audio("../assets/sfx/higherorlower/lose.mp3"),
    upgrade: new Audio("../assets/sfx/higherorlower/upgrade.mp3"),
}

let number1 = document.querySelector(".n1");
let number2 = document.querySelector(".n2");
const numberCards = [number1, number2];

let n1;
let n2;
let upgradeBtn = document.querySelector(".upgrade-btn");
addSFX(upgradeBtn);
let levelLabel = document.querySelector(".level");

let betAmountInput = document.querySelector(".bet-amount");
let halfBetBtn = document.querySelector(".bet-half");
addSFX(halfBetBtn);
betAmountInput.value = getHigherLowerBetAmount();

practiceModeToggle.addEventListener("click", () => {
    if (!practiceMode) {
        betAmountInput.value = getWarBetAmount();
        betAmountInput.disabled = false;
        halfBetBtn.disabled = false;
    } else {
        betAmountInput.value = "0";
        betAmountInput.disabled = true;
        halfBetBtn.disabled = true;
    }
});

betAmountInput.addEventListener("blur", () => {
    let betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount < 1) {
        betAmountInput.value = getHigherLowerBetAmount();
    } else if (betAmount > 1000) {
        betAmountInput.value = 1000;
    }
    if (betAmount > getMoney() && betAmount <= 1000) {
        betAmountInput.value = getMoney();
    }
    setHigherLowerBetAmount(betAmountInput.value);
});
halfBetBtn.addEventListener("click", () => {
    betAmountInput.value = Math.round(getMoney() / 2);
    if (betAmountInput.value > 1000) {
        betAmountInput.value = 1000;
    }
    setHigherLowerBetAmount(betAmountInput.value);
});

let betBtns = document.querySelectorAll(".bet-btn");
let betType;
betBtns.forEach(btn => {
    addSFX(btn);
    btn.addEventListener("click", () => {
        if (!enoughMoney(getHigherLowerBetAmount()) && !practiceMode) {
            alert("You do not have enough money to make that bet.");
            return;
        }
        const betAmount = getHigherLowerBetAmount();
        if (!practiceMode) {
            calcMoney(betAmount, "-");
            updateMoneyLabel();
        }
        betType = btn.classList.contains("higher-btn") ? "higher" : "lower";
        setTimeout(() => {
            playSound(gameSfx.flipNumber);
            number2.classList.add("flipping");
        }, 150);
        setTimeout(() => {
            number2.classList.remove("unknown");
            number2.textContent = n2;
        }, 650);
        setTimeout(() => {
            number2.classList.remove("flipping");
        }, 1200);
        setTimeout(() => {
            if (getHigherLowerUpgradeLevel() > 0) {
                if (betType == "higher") {
                    n2 += getHigherLowerUpgradeLevel();
                    if (n2 > 100) {n2 = 100;}
                    n1 -= getHigherLowerUpgradeLevel();
                    if (n1 < 1) {n1 = 1;}
                } else if (betType == "lower") {
                    n2 -= getHigherLowerUpgradeLevel();
                    if (n2 < 1) {n2 = 1;}
                    n1 += getHigherLowerUpgradeLevel();
                    if (n1 > 100) {n1 = 100;}
                }
            }

            let alertMessage;
            if (betType == "higher" && n2 > n1) {
                playSound(gameSfx.win);
                if (!practiceMode) {
                    alertMessage = `You win! ${n2} is higher than ${n1}. You won ${moneyFormat(Math.round(getHigherLowerBetAmount() * 1.5))}.`;
                    calcMoney(Math.round(betAmount * 1.5), "+");
                    updateMoneyLabel();
                } else {
                    alertMessage = `You guessed correctly! ${n2} is higher than ${n1}.`;
                }
            } else if (betType == "lower" && n2 < n1) {
                playSound(gameSfx.win);
                if (!practiceMode) {
                    alertMessage = `You win! ${n2} is lower than ${n1}. You won ${moneyFormat(Math.round(getHigherLowerBetAmount() * 1.5))}.`;
                    calcMoney(Math.round(betAmount * 1.5), "+");
                    updateMoneyLabel();
                } else {
                    alertMessage = `You guessed correctly! ${n2} is lower than ${n1}.`;
                }
            } else {
                playSound(gameSfx.lose);
                alertMessage = `You lose! ${n2} is not ${betType} than ${n1}.`;
            }
            if (!getAlertsDisabled()) {
                setTimeout(() => {
                    alert(alertMessage);
                }, 150);
            }
            updateFooterDelay(alertMessage);
            number2.classList.add("unknown");
            generateRandomNumbers();
        }, 1500);
    });
});

upgradeBtn.addEventListener("click", () => {
    setTimeout(() => {
        if (practiceMode) {
            if (!confirm(`Are you sure you want to upgrade? Upgrading in practice mode still uses money. Remaining funds: ${moneyFormat(getMoney())}`)) return;
        }
        if (!enoughMoney(getHigherLowerUpgradePrices()[getHigherLowerUpgradeLevel()])) {
            alert("You do not have enough money to upgrade.");
            return;
        }
        calcMoney(getHigherLowerUpgradePrices()[getHigherLowerUpgradeLevel()], "-");
        addHigherLowerUpgradeLevel();
        levelLabel.textContent = `Lvl ${getHigherLowerUpgradeLevel()}`;
        updateFooterDelay(`Upgraded to level ${getHigherLowerUpgradeLevel()}!`);
        playSound(gameSfx.upgrade);
        updateUpgradeLabel();
    }, 50);
});

function updateUpgradeLabel() {
    if (getMoney() >= getHigherLowerUpgradePrices()[getHigherLowerUpgradeLevel()]) {
        upgradeBtn.classList.remove("red");
        upgradeBtn.classList.add("green");
    } else if (getMoney() < getHigherLowerUpgradePrices()[getHigherLowerUpgradeLevel()]) {
        upgradeBtn.classList.remove("green");
        upgradeBtn.classList.add("red");
    }
    upgradeBtn.textContent = moneyFormat(getHigherLowerUpgradePrices()[getHigherLowerUpgradeLevel()]);
    levelLabel.textContent = `Lvl ${getHigherLowerUpgradeLevel()}`;
    if (!practiceMode) {updateMoneyLabel();}
}
updateUpgradeLabel();

function generateRandomNumbers() {
    n1 = Math.floor(Math.random() * 100) + 1;
    n2 = Math.floor(Math.random() * 100) + 1;
    if (n1 === n2) {n2 = (n2 % 100) + 1;}

    number1.textContent = n1;
    number2.textContent = "?";
}
generateRandomNumbers();

footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        check2 = true;
        wrongFooterCommand();
    }
});