const deafultSfx = {
    spin: new Audio("../assets/sfx/slotmachine/pull-lever.mp3"),
    win: new Audio("../assets/sfx/slotmachine/win.mp3"),
    slotSpinning: new Audio("../assets/sfx/slotmachine/slots-spinning.mp3"),
    slotLoad: new Audio("../assets/sfx/slotmachine/slot-load.mp3"),
}
const puspaSfx = {
    spin: new Audio("../assets/sfx/slotmachine/puspa/pull-lever.m4a"),
    win: new Audio("../assets/sfx/slotmachine/puspa/win.m4a"),
    slotSpinning: new Audio("../assets/sfx/slotmachine/puspa/slots-spinning.m4a"),
    slotLoad: new Audio("../assets/sfx/slotmachine/puspa/slot-load.m4a"),
}
const adarshaSfx = {
    spin: new Audio("../assets/sfx/slotmachine/adarsha/pull-lever.wav"),
    win: new Audio("../assets/sfx/slotmachine/adarsha/win.wav"),
    slotSpinning: new Audio("../assets/sfx/slotmachine/adarsha/slots-spinning.wav"),
    slotLoad: new Audio("../assets/sfx/slotmachine/adarsha/slot-load.wav"),
}
let slotSfx = {
    spin: deafultSfx.spin,
    win: deafultSfx.win,
    slotSpinning: deafultSfx.slotSpinning,
    slotLoad: deafultSfx.slotLoad,
}
function loadSfxProfile(newSfx = deafultSfx) {
    slotSfx.spin = newSfx.spin;
    slotSfx.win = newSfx.win;
    slotSfx.slotSpinning = newSfx.slotSpinning;
    slotSfx.slotLoad = newSfx.slotLoad;
}

let autospinEnabled = false;
let autospinUnlocked = getAutoSpinOwned();
let reward = getJackpotPrize();

let slotsDisplay = document.querySelectorAll(".reel > p");
let resultMessage = document.querySelector(".result-message p");
let spinLever = document.querySelector(".spin-lever");
spinLever.addEventListener("click", spin);

function spin() {
    if (!enoughMoney(2) && !practiceMode) {
        resultMessage.textContent = "Not enough money!";
        spinLever.classList.add("blocked");
        return;
    }
    if (!practiceMode) {
        calcMoney(2, "-");
        updateMoneyLabel();
    }
    spinLever.classList.remove("blocked");
    resultMessage.textContent = "Spinning...";
    playSound(slotSfx.spin);
    setTimeout(() => {playSound(slotSfx.slotSpinning);}, 100);
    spinLever.classList.add("spinning");
    spinLever.removeEventListener("click", spin);
    let finalSymbols = [randomSlotSymbol(), randomSlotSymbol(), randomSlotSymbol()];

    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            slotsDisplay[0].classList.add("spinning");
            slotsDisplay[1].classList.add("spinning");
            slotsDisplay[2].classList.add("spinning");
        
            slotsDisplay[0].textContent = i < 18 ? getSlotSymbols()[i % getSlotSymbols().length] : finalSymbols[0];
            slotsDisplay[1].textContent = i < 21 ? getSlotSymbols()[(i + 1) % getSlotSymbols().length] : finalSymbols[1];
            slotsDisplay[2].textContent = i < 24 ? getSlotSymbols()[(i + 2) % getSlotSymbols().length] : finalSymbols[2];

            if (i == 18 || i == 21 || i == 24) {
                playSound(slotSfx.slotLoad);
            }
            if (i >= 18) {slotsDisplay[0].classList.remove("spinning");}
            if (i >= 21) {slotsDisplay[1].classList.remove("spinning");}
            if (i == 24) {
                spinLever.classList.remove("spinning");
                if (!autospinEnabled) {spinLever.addEventListener("click", spin);}
                slotsDisplay[2].classList.remove("spinning");
            }
        }, i * 100);
    }
    setTimeout(() => {
        if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
            if (!practiceMode) {
                calcMoney(reward, "+");
                updateMoneyLabel();
                resultMessage.textContent = `CONGRATULATIONS! You won $${reward}!`;
                updateShopAndStats();
            } else if (practiceMode) {
                resultMessage.textContent = `JACKPOT!`;
            }
            playSound(slotSfx.win);
        } else {
            resultMessage.textContent = "Better luck next time!";
        }
        spinLever.classList.remove("spinning");

        if (getMoney() < 2 && !practiceMode) {
            autospinEnabled = false;
            spinLever.classList.add("blocked");
            gameOverCheck();
        } else {
            spinLever.classList.remove("blocked");
        }
    }, 2500);
}

practiceModeToggle.addEventListener("click", () => {
    let spinCostLabel = document.querySelector(".spin-cost p");
    spinCostLabel.textContent = practiceMode ? "Cost: Free" : "Cost: $2";
});

let shopItems = document.querySelectorAll(".shop-item");
let shopBtns = document.querySelectorAll(".shop-btns");
let shopPriceLabels = document.querySelectorAll(".item-cost");

let shopPrices = getUpgradePrices();
let shopBtnsFunctions = [unlockAutoSpin, increaseJackpot, improveOdds];
let statItems = document.querySelectorAll(".stat-item");

shopBtns.forEach((btn, index) => {
    addSFX(btn);
    btn.addEventListener("click", () => {
        setTimeout(() => {
            shopBtnsFunctions[index]();
            updateShopAndStats();
        }, 150);
    });
});

function unlockAutoSpin() {
    if (autospinUnlocked) {
        alert("You have already unlocked Auto Spinning!");
        return;
    }
    if (enoughMoney(shopPrices[0])) {
        if (practiceMode) {
            choice = confirm("Are you sure you want to unlock? This will still take away from your total money.");
            if (!choice) {
                return;
            }
        }
        calcMoney(shopPrices[0], "-");
        if (practiceMode) {
            alert(`Money left: $${moneyFormat(getMoney())}`);
        } else {
            updateMoneyLabel();
        }
        setAutoSpinOwned(true);
        autospinUnlocked = true;
        let newLevel = getUpgradeLevels()[0] + 1;
        let newValue = true;

        setUpgradeLevel(0, newLevel);
        setUpgradeValue(0, newValue);
        let autoSpinBtn = statItems[0].querySelector("button");
        autoSpinBtn.textContent = "Off";
        playSound(sfx.gameBought);
    } else {
        alert("You do not have enough money to purchase this upgrade.");
    }
}
function increaseJackpot() {
    if (getUpgradeValues()[1] == getMaxUpgradeValues()[1]) {
        alert("Jackpot Prize is already at maximum level!");
        return;
    }
    if (enoughMoney(shopPrices[1])) {
        if (practiceMode) {
            choice = confirm("Are you sure you want to unlock? This will still take away from your total money.");
            if (!choice) {
                return;
            }
        }
        calcMoney(shopPrices[1], "-");
        if (practiceMode) {
            alert(`Money left: $${moneyFormat(getMoney())}`);
        } else {
            updateMoneyLabel();
        }
        let newLevel = getUpgradeLevels()[1] + 1;
        let newPrize = getUpgradeValues()[1] + 50;

        setUpgradeLevel(1, newLevel);
        setUpgradeValue(1, newPrize);
        setUpgradePrice(1, shopPrices[1] + 150);
        setJackpotPrize(newPrize);
        reward = newPrize;
        playSound(sfx.gameBought);
    } else {
        alert("You do not have enough money to purchase this upgrade.");
    }
}
function improveOdds() {
    if (getUpgradeValues()[2] == getMaxUpgradeValues()[2]) {
        alert("Odds Improvement is already at maximum level!");
        return;
    }
    if (enoughMoney(shopPrices[2])) {
        if (practiceMode) {
            choice = confirm("Are you sure you want to unlock? This will still take away from your total money.");
            if (!choice) {
                return;
            }
        }
        calcMoney(shopPrices[2], "-");
        if (practiceMode) {
            alert(`Money left: $${moneyFormat(getMoney())}`);
        } else {
            updateMoneyLabel();
        }
        let newLevel = getUpgradeLevels()[2] + 1;
        let newOdds = getUpgradeValues()[2] + 1;

        setUpgradeLevel(2, newLevel);
        setUpgradeValue(2, newOdds);
        setUpgradePrice(2, shopPrices[2] + 200);
        removeSlotSymbol();
        playSound(sfx.gameBought);
    } else {
        alert("You do not have enough money to purchase this upgrade.");
    }
}

let autoSpinBtn = statItems[0].querySelector("button");
function updateShopAndStats() {
    shopPrices = getUpgradePrices();
    shopBtns.forEach((btn, index) => {
        if (getMoney() >= shopPrices[index]) {
            btn.classList.remove("red");
            btn.classList.add("green");
        } else if (getMoney() < shopPrices[index]) {
            btn.classList.remove("green");
            btn.classList.add("red");
        }
        if (getUpgradeLevels()[index] == getMaxUpgradeLevels()[index]) {
            btn.classList.remove("green");
            btn.classList.remove("red");
            btn.textContent = index != 0 ? "Lvl 3 (Max)" : "Unlocked";
        }
        shopPriceLabels[index].textContent = `$${shopPrices[index]}`;
        if (index != 0) {
            statItems[index].querySelector(".status").textContent = getUpgradeValues()[index];
        } else if (index == 0) {
            autoSpinBtn.textContent = autospinUnlocked ? "Off" : "Locked";
            autoSpinBtn.classList.toggle("red", !autospinUnlocked);
        }
    });
}
addSFX(autoSpinBtn);
updateShopAndStats();

autoSpinBtn.addEventListener("click", () => {
    setTimeout(() => {
        if (autospinUnlocked) {
            toggleAutoSpin();
        } else {
            alert("You haven't unlocked Auto Spinning yet! Unlock for $200 in the shop!");
        }
    }, 150);
});
function toggleAutoSpin() {
    autospinEnabled = !autospinEnabled;
    autoSpinBtn.textContent = autospinEnabled ? "On" : "Off";
    autoSpinBtn.classList.toggle("green", autospinEnabled);
    
    if (autospinEnabled) {
        interval = 2750;
        setTimeout(spin, 150);
        autoSpinInterval = setInterval(() => {
            spin();
        }, interval);
        interval = 2600;
    } else {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
    }
}

let footerText = document.querySelector("footer p");
footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        text = footerText.textContent.toLocaleLowerCase();
        e.preventDefault();
        footerText.blur();

        if (["load-sound-profile: a", "lsp a", "loadsoundprofile(a)"].includes(text)) {
            loadSfxProfile(deafultSfx);
        } else if (["load-sound-profile: b", "lsp b", "loadsoundprofile(b)"].includes(text)) {
            loadSfxProfile(puspaSfx);
        } else if (["load-sound-profile: c", "lsp c", "loadsoundprofile(c)"].includes(text)) {
            loadSfxProfile(adarshaSfx);
        } else {
            footerText.textContent = "Wrong command!";
            footerText.contentEditable = "false";
            playSound(sfx.cheat);
            setTimeout(() => {
                const year = new Date().getFullYear();
                footerText.innerHTML = `&copy; ${year} Arpan Shah. All rights reserved.`;
                footerText.contentEditable = "true"; 
            }, 7500);
            return;
        }
        playSound(slotSfx.win);
        footerText.textContent = "SFX profile changed!";
        setTimeout(() => {
            if (footerText.textContent !== "SFX profile changed!") return;
            const year = new Date().getFullYear();
            footerText.innerHTML = `&copy; ${year} Arpan Shah. All rights reserved.`;
        }, 7500);
    }
});
