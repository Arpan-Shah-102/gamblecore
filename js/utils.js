function getMoney() {
    return parseInt(localStorage.getItem("money")) || 1000;
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