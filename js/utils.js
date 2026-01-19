function getMoney() {
    return parseInt(localStorage.getItem("money") ?? 1000);
}
function moneyFormat(amount) {
    return amount.toLocaleString( "en-US", { style: "currency", currency: "USD" } );
}
function calcMoney(amount, operation) {
    const currentMoney = getMoney();
    if (operation === "+") {
        localStorage.setItem("money", currentMoney + amount);
    } else if (operation === "-") {
        localStorage.setItem("money", currentMoney - amount);
    } else if (operation == "*") {
        localStorage.setItem("money", currentMoney * amount);
    } else if (operation == "/") {
        localStorage.setItem("money", currentMoney / amount);
    }
}
function setMoney(amount) {
    localStorage.setItem("money", amount);
}
function enoughMoney(amount) {
    return getMoney() >= amount;
}
function updateMoneyLabel() {
    let moneyLabel = document.querySelector(".money-label > p");
    moneyLabel.textContent = moneyFormat(getMoney());
}

function getOwnedGames() {
    return JSON.parse(localStorage.getItem("ownedGames")) || [];
}
function addGame(gameID) {
    const ownedGames = getOwnedGames();
    if (!ownedGames.includes(gameID)) {
        ownedGames.push(gameID);
        localStorage.setItem("ownedGames", JSON.stringify(ownedGames));
    }
}
function gameOwned(gameID) {
    const ownedGames = getOwnedGames();
    return ownedGames.includes(gameID);
}

function isMuted() {
    return localStorage.getItem("muted") === "true";
}
function toggleMute() {
    const muted = isMuted();
    localStorage.setItem("muted", !muted);
}

function getCurrentTheme() {
    return localStorage.getItem("theme") || "light";
}
function setCurrentTheme(theme) {
    localStorage.setItem("theme", theme);
}

// getMoney(): moneyFormat(amount), calcMoney(amount, operation), setMoney(amount), enoughMoney(amount), updateMoneyLabel()
// getOwnedGames(): addGame(gameID), gameOwned(gameID)
// isMuted(): toggleMute()
// getCurrentTheme(): setCurrentTheme(theme)

function gameOverCheck() {

}

function getSlotSymbols() {
    return JSON.parse(localStorage.getItem("slotSymbols")) || ["7️⃣", "🍒", "💎", "⭐", "🍉", "🍊"];
}
function randomSlotSymbol() {
    return getSlotSymbols()[Math.floor(Math.random() * getSlotSymbols().length)];
}
function removeSlotSymbol() {
    let symbols = getSlotSymbols();
    symbols.pop();
    localStorage.setItem("slotSymbols", JSON.stringify(symbols));
}

function getAutoSpinOwned() {
    return localStorage.getItem("autoSpinOwned") === "true";
}
function setAutoSpinOwned(value) {
    localStorage.setItem("autoSpinOwned", value ? "true" : "false");
}

function getJackpotPrize() {
    return parseInt(localStorage.getItem("jackpotPrize")) || 50;
}
function setJackpotPrize(amount) {
    localStorage.setItem("jackpotPrize", amount);
}

function getUpgradePrices() {
    return JSON.parse(localStorage.getItem("upgradePrices")) || [200, 300, 400];
}
function setUpgradePrice(index, price) {
    let prices = getUpgradePrices();
    prices[index] = price;
    localStorage.setItem("upgradePrices", JSON.stringify(prices));
}
function getUpgradeLevels() {
    return JSON.parse(localStorage.getItem("upgradeLevels")) || [0, 1, 0];
}
function setUpgradeLevel(index, level) {
    let levels = getUpgradeLevels();
    levels[index] = level;
    localStorage.setItem("upgradeLevels", JSON.stringify(levels));
}
function getMaxUpgradeLevels() {
    return [1, 3, 3];
}
function getUpgradeValues() {
    return JSON.parse(localStorage.getItem("upgradeValues")) || [getAutoSpinOwned(), 50, 0];
}
function setUpgradeValue(index, value) {
    let values = getUpgradeValues();
    values[index] = value;
    localStorage.setItem("upgradeValues", JSON.stringify(values));
}
function getMaxUpgradeValues() {
    return [true, 150, 3];
}

// getSlotSymbols(): randomSlotSymbol(), removeSlotSymbol()
// getAutoSpinOwned(): setAutoSpinOwned(value)
// getJackpotPrize(): setJackpotPrize(amount)
// getUpgradePrices(): setUpgradePrice(index, price), getUpgradeLevels(), setUpgradeLevel(index, level), getMaxUpgradeLevels(), getUpgradeValues(), setUpgradeValue(index, value), getMaxUpgradeValues()

function getCoinChance(side = "heads") {
    return parseInt(localStorage.getItem(`${side}Chance`)) || 50;
}
function getSelectedSideAndBet() {
    let selectedSide = localStorage.getItem("selectedCoinSide") || "heads";
    let betAmount = parseInt(localStorage.getItem("coinBetAmount")) || 10;
    return {side: selectedSide, bet: betAmount};
}
function setSelectedSideAndBet(side, bet) {
    localStorage.setItem("selectedCoinSide", side);
    localStorage.setItem("coinBetAmount", bet);
}
