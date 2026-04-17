let coinSfx = {
    flip: new Audio("../assets/sfx/coinflip/coin-flip.mp3"),
    win: new Audio("../assets/sfx/coinflip/win.mp3"),
    lose: new Audio("../assets/sfx/coinflip/lose.mp3"),
}
const coinImgs = {
    heads: "./assets/heads.svg",
    tails: "./assets/tails.svg",
}

let coin = document.querySelector(".coin");
let coinImg = document.querySelector(".coin img");
let coinResult = document.querySelector(".coin p");

let betAmountInput = document.querySelector("input.bet-amount");
let selectSideBtns = document.querySelectorAll(".bet-btns");
let selectedSideAndBet = getSelectedSideAndBet();

let chance = getCoinChance();
coin.addEventListener("click", flipCoin);

function flipCoin() {
    if (enoughMoney(selectedSideAndBet.bet)) {
        if (!practiceMode) {
            calcMoney(selectedSideAndBet.bet, "-");
            updateMoneyLabel();
        }
        chance = getCoinChance();
        coin.classList.add("flipping");
        coinResult.textContent = "";
        playSound(coinSfx.flip);
        coin.removeEventListener("click", flipCoin);

        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                coin.classList.toggle("heads");
                coin.classList.toggle("tails");
                coinImg.src = coin.classList.contains("heads") ? coinImgs.heads : coinImgs.tails;
            }, 100 * i);
        }
        setTimeout(() => {
            let flipResult = Math.random() < (chance / 100) ? "heads" : "tails";
            coin.classList.remove("flipping");
            coin.classList.remove("heads");
            coin.classList.remove("tails");

            coin.classList.add(flipResult);
            coinImg.src = flipResult === "heads" ? coinImgs.heads : coinImgs.tails;

            if (flipResult === selectedSideAndBet.side) {
                coinResult.textContent = `You won${practiceMode ? "!" : ` ${moneyFormat(selectedSideAndBet.bet * 2)}`}`;
                updateFooterDelay("You won!");
                playSound(coinSfx.win);
                if (!practiceMode) {
                    calcMoney(selectedSideAndBet.bet * 2, "+");
                }
            } else if (flipResult !== selectedSideAndBet.side) {
                coinResult.textContent = `You lost${practiceMode ? "!" : ` ${moneyFormat(selectedSideAndBet.bet)}`}`;
                playSound(coinSfx.lose);
                updateFooterDelay("You lost!");
            }
            if (!practiceMode) {updateThings();}
            coin.addEventListener("click", flipCoin);
        }, 2000);
    }
}

practiceModeToggle.addEventListener("click", () => {
    betAmountInput.value = practiceMode ? "0" : selectedSideAndBet.bet;
    betAmountInput.classList.toggle("opacity-50");
    betAmountInput.attributes["readonly"] ? betAmountInput.removeAttribute("readonly") : betAmountInput.setAttribute("readonly", true);
});

betAmountInput.addEventListener("blur", () => {
    let betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount < 1) {
        betAmountInput.value = selectedSideAndBet.bet;
    } else if (betAmount > 1000) {
        betAmountInput.value = 1000;
    }
    if (betAmount > getMoney() && betAmount <= 1000) {
        betAmountInput.value = getMoney();
    }
    setSelectedSideAndBet(selectedSideAndBet.side, betAmountInput.value);
});

selectSideBtns.forEach(element => {
    addSFX(element);
    element.addEventListener("click", () => {switchBet(element);});
});

function switchBet(btn) {
    console.log(btn.classList);
    let newSide = btn.classList.contains("heads-btn") ? "heads" : "tails";
    setSelectedSideAndBet(newSide, selectedSideAndBet.bet);
    selectedSideAndBet = getSelectedSideAndBet();
    updateThings();
}

let upgradeContainers = document.querySelectorAll(".upgrades");
let upgradeChances = document.querySelectorAll(".upgrades .chance");
let upgradeLevels = document.querySelectorAll(".upgrades .level");
let upgradeButtons = document.querySelectorAll(".upgrades .upgrade-btn");

upgradeButtons.forEach(btn => {addSFX(btn);});
upgradeButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        let side = index === 0 ? "heads" : "tails";
        let sideLevels = getSideLevels();
        let currentLevel = sideLevels[side];
        let cost = getSideCosts()[Math.abs(currentLevel) - (currentLevel < 0 ? 1 : 0)];

        if (currentLevel == getMinMaxSideLevel().max) {
            alert("This side is already at max level.");
            return;
        };
        if (enoughMoney(cost)) {
            if (practiceMode) {
                choice = confirm("Are you sure you want to unlock? This will still take away from your total money.");
                if (!choice) {
                    return;
                }
            }
            calcMoney(cost, "-");
            if (practiceMode) {
                alert(`Money left: $${moneyFormat(getMoney())}`);
            } else {
                updateMoneyLabel();
            }
            if (currentLevel < 0) {
                setSideLevel(side, currentLevel + 1);
                setSideLevel(index == 0 ? "tails" : "heads", getSideLevels()[index == 0 ? "tails" : "heads"] - 1);
            } else {
                setSideLevel(side, currentLevel + 1);
                setSideLevel(index == 0 ? "tails" : "heads", getSideLevels()[index == 0 ? "tails" : "heads"] - 1);
            }
            updateFooterDelay("Upgrade successful!");
            updateUpgradeContainers();
        } else {
            alert("You do not have enough money to upgrade this."); 
            updateFooterDelay("Not enough money.");
        }
    });
});

function updateUpgradeContainers() {
    upgradeContainers.forEach((side, index) => {
        upgradeChances[index].textContent = 50 + getSideLevels()[index === 0 ? "heads" : "tails"];
        upgradeLevels[index].textContent = getSideLevels()[index === 0 ? "heads" : "tails"];
        
        if (getSideLevels()[index === 0 ? "heads" : "tails"] === getMinMaxSideLevel().max) {
            upgradeButtons[index].textContent = "Max Level";
            upgradeButtons[index].classList.remove("red", "green");
        } else if (getSideLevels()[index === 0 ? "heads" : "tails"] == getMinMaxSideLevel().min) {
            upgradeButtons[index].textContent = `Upgrade: ${moneyFormat(getSideCosts()[Math.abs(getSideLevels()[index === 0 ? "heads" : "tails"]) - 1])}`;
        } else if (getSideLevels()[index === 0 ? "heads" : "tails"] < 0) {
            upgradeButtons[index].textContent = `Upgrade: ${moneyFormat(getSideCosts()[Math.abs(getSideLevels()[index === 0 ? "heads" : "tails"]) - 1])}`;
        } else {
            upgradeButtons[index].textContent = `Upgrade: ${moneyFormat(getSideCosts()[Math.abs(getSideLevels()[index === 0 ? "heads" : "tails"])])}`;
        }

        if (getSideLevels()[index === 0 ? "heads" : "tails"] === getMinMaxSideLevel().max) {
            upgradeButtons[index].classList.remove("red");
            upgradeButtons[index].classList.remove("green");
        } else if (getMoney() >= getSideCosts()[Math.abs(getSideLevels()[index === 0 ? "heads" : "tails"]) - (getSideLevels()[index === 0 ? "heads" : "tails"] < 0 ? 1 : 0)]) {
            upgradeButtons[index].classList.add("green");
            upgradeButtons[index].classList.remove("red");
        } else if (getMoney() < getSideCosts()[Math.abs(getSideLevels()[index === 0 ? "heads" : "tails"]) - (getSideLevels()[index === 0 ? "heads" : "tails"] < 0 ? 1 : 0)]) {
            upgradeButtons[index].classList.add("red");
            upgradeButtons[index].classList.remove("green");
        }
    });
}
function updateThings() {
    betAmountInput.value = selectedSideAndBet.bet;
    if (selectedSideAndBet.side === "heads") {
        selectSideBtns[0].classList.add("selected");
        selectSideBtns[1].classList.remove("selected");
    } else {
        selectSideBtns[1].classList.add("selected");
        selectSideBtns[0].classList.remove("selected");
    }
    updateMoneyLabel();
    updateUpgradeContainers();
}
updateThings();

footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        check2 = true;
        wrongFooterCommand();
    }
});