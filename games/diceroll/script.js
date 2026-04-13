const gameSfx = {
    roll1: new Audio("../assets/sfx/diceroll/dice-roll-1.mp3"),
    roll2: new Audio("../assets/sfx/diceroll/dice-roll-2.mp3"),
    roll3: new Audio("../assets/sfx/diceroll/dice-roll-3.mp3"),
    win: new Audio("../assets/sfx/diceroll/win.mp3"),
    lose: new Audio("../assets/sfx/diceroll/lose.mp3"),
    tie: new Audio("../assets/sfx/diceroll/tie.mp3"),
    upgrade: new Audio("../assets/sfx/diceroll/upgrade.mp3"),
}
const rollSfx = [gameSfx.roll1, gameSfx.roll2, gameSfx.roll3];
const dieSymbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const dieValues = [1, 2, 3, 4, 5, 6];
let rollCount = 0;
[playerRoll1, playerRoll2, computerRoll1, computerRoll2] = randomizeRolls();

let playerDie = document.querySelectorAll(".player-die");
let computerDie = document.querySelectorAll(".computer-die");
let playerScoreLabel = document.querySelector(".player-score");
let computerScoreLabel = document.querySelector(".computer-score");
let playerScore = 0;
let computerScore = 0;

let betAmountInput = document.querySelector(".bet-amount");
betAmountInput.value = getDiceDuelBetAmount();
betAmountInput.addEventListener("blur", () => {
    let betAmount = parseInt(betAmountInput.value);
    if (isNaN(betAmount) || betAmount < 1) {
        betAmountInput.value = getDiceDuelBetAmount();
    } else if (betAmount > 1000) {
        betAmountInput.value = 1000;
    }
    if (betAmount > getMoney()) {
        betAmountInput.value = getMoney();
    }
    setDiceDuelBetAmount(betAmountInput.value);
});
practiceModeToggle.addEventListener("click", () => {
    if (!practiceMode) {
        betAmountInput.value = getDiceDuelBetAmount();
        betAmountInput.disabled = false;
    } else {
        betAmountInput.value = "0";
        betAmountInput.disabled = true;
    }
    resetGame();
});
let rollBtn = document.querySelector(".roll-btn");
addSFX(rollBtn);

rollBtn.addEventListener("click", () => {
    if (!practiceMode && getMoney() < getDiceDuelBetAmount()) {
        alert("You don't have enough money to place this bet!");
        updateFooterDelay("Not enough money to place the bet!", 3000);
        return;
    }
    if (!practiceMode && rollCount === 0) {
        calcMoney(getDiceDuelBetAmount(), "-");
        updateMoneyLabel();
    }
    
    if (getDiceDuelCurrentGamemode() === "classic") {
        classicGameMode();
    } else if (getDiceDuelCurrentGamemode() === "pig") {
        pigGamemode();
    } else if (getDiceDuelCurrentGamemode() === "blackjack") {
        blackjackGamemode();
    } else if (getDiceDuelCurrentGamemode() === "race") {
        raceGamemode();
    }
});

function classicGameMode() {
    [playerRoll1, playerRoll2, computerRoll1, computerRoll2] = randomizeRolls();
    rollBtn.disabled = true;
    roll(false);

    setTimeout(() => {
        let alertMsg;
        if (playerScore > computerScore) {
            if (!practiceMode) {
                alertMsg = `You win! You earned ${moneyFormat(getDiceDuelBetAmount() * 2)}.`;
                calcMoney(getDiceDuelBetAmount() * 2, "+");
                updateMoneyLabel();
            } else {
                alertMsg = "You win!";
            }
            playSound(gameSfx.win);
        } else if (playerScore < computerScore) {
            alertMsg = "You lose!";
            playSound(gameSfx.lose);
        } else if (playerScore === computerScore) {
            if (!practiceMode) {
                alertMsg = "It's a tie! Your bet has been returned.";
                calcMoney(getDiceDuelBetAmount(), "+");
                updateMoneyLabel();
            } else {
                alertMsg = "It's a tie!";
            }
            playSound(gameSfx.tie);
        }
        if (!getAlertsDisabled()) {
            setTimeout(() => {
                alert(alertMsg);
            }, 150);
        }
        setTimeout(() => {
            updateFooterDelay(alertMsg, 3000);
            resetGame();
        }, 750);
    }, 2700);
}

function pigGamemode() {
    [playerRoll1, playerRoll2, computerRoll1, computerRoll2] = randomizeRolls();
    betAmountInput.disabled = true;
    roll(false);

    setTimeout(() => {
        let alertMsg;
        if (playerScore === 2 || computerScore === 2) {
            if (playerScore === 2 && computerScore === 2) {
                alertMsg = "It's a tie! Both you and the computer rolled a 2.";
                playSound(gameSfx.tie);
                if (!practiceMode) {
                    calcMoney(getDiceDuelBetAmount(), "+");
                    updateMoneyLabel();
                }
            } else if (playerScore === 2) {
                alertMsg = "You rolled a 2! You lose.";
                playSound(gameSfx.lose);
            } else {
                if (!practiceMode) {
                    alertMsg = `Computer rolled a 2! You lose! You earned ${moneyFormat(Math.round(getDiceDuelBetAmount() * 2.5))}.`;
                    calcMoney(Math.round(getDiceDuelBetAmount() * 2.5), "+");
                    updateMoneyLabel();
                } else {
                    alertMsg = "Computer rolled a 2! You win!";
                }
                playSound(gameSfx.win);
            }
                if (!getAlertsDisabled()) {
                    setTimeout(() => {
                        alert(alertMsg);
                    }, 150);
                }
            setTimeout(() => {
                updateFooterDelay(alertMsg, 3000);
                resetGame();
            }, 750);
        }
    }, 2700);
}

function blackjackGamemode() {
    [playerRoll1, playerRoll2, computerRoll1, computerRoll2] = randomizeRolls();
    betAmountInput.disabled = true;
    roll();

    setTimeout(() => {
        let alertMsg;
        if (playerScore >= 21 || computerScore >= 21) {
            if (Math.abs(21 - playerScore) < Math.abs(21 - computerScore)) {
                if (!practiceMode) {
                    alertMsg = `You win! You earned ${moneyFormat(Math.round(getDiceDuelBetAmount() * 2.5))}.\nYou were ${Math.abs(21 - playerScore)} away from 21, while the computer was ${Math.abs(21 - computerScore)} away.`;
                    calcMoney(Math.round(getDiceDuelBetAmount() * 2.5), "+");
                    updateMoneyLabel();
                } else {
                    alertMsg = "You win!"+`\nYou were ${Math.abs(21 - playerScore)} away from 21, while the computer was ${Math.abs(21 - computerScore)} away.`;
                }
                playSound(gameSfx.win);
            } else if (Math.abs(21 - playerScore) > Math.abs(21 - computerScore)) {
                alertMsg = "You lose!"+`\nYou were ${Math.abs(21 - playerScore)} away from 21, while the computer was ${Math.abs(21 - computerScore)} away.`;
                playSound(gameSfx.lose);
            } else if (Math.abs(21 - playerScore) === Math.abs(21 - computerScore)) {
                if (!practiceMode) {
                    alertMsg = "It's a tie! Your bet has been returned."+`\nYou both were ${Math.abs(21 - playerScore)} away from 21.`;
                    calcMoney(getDiceDuelBetAmount(), "+");
                    updateMoneyLabel();
                } else {
                    alertMsg = "It's a tie!"+`\nYou both were ${Math.abs(21 - playerScore)} away from 21.`;
                }
                playSound(gameSfx.tie);
            }
            if (!getAlertsDisabled()) {
                setTimeout(() => {
                    alert(alertMsg);
                }, 150);
            }
            setTimeout(() => {
                updateFooterDelay(alertMsg, 3000);
                resetGame();
            }, 750);
        }
    }, 2700);
}

function raceGamemode() {
    [playerRoll1, playerRoll2, computerRoll1, computerRoll2] = randomizeRolls();
    betAmountInput.disabled = true;
    roll();

    setTimeout(() => {
        if (playerScore >= 100 || computerScore >= 100) {
            let alertMsg;
            if (playerScore >= 100 && computerScore >= 100) {
                alertMsg = "It's a tie!";
                playSound(gameSfx.tie);
                if (!practiceMode) {
                    calcMoney(getDiceDuelBetAmount(), "+");
                    updateMoneyLabel();
                }
            } else if (playerScore >= 100) {
                if (!practiceMode) {
                    alertMsg = `You win! You earned ${moneyFormat(getDiceDuelBetAmount() * 5)}.`;
                    calcMoney(Math.round(getDiceDuelBetAmount() * 5), "+");
                    updateMoneyLabel();
                } else {
                    alertMsg = "You win!";
                }
                playSound(gameSfx.win);
            } else if (computerScore >= 100) {
                alertMsg = "You lose!";
                playSound(gameSfx.lose);
            }
            if (!getAlertsDisabled()) {
                setTimeout(() => {
                    alert(alertMsg);
                }, 150);
            }
            setTimeout(() => {
                updateFooterDelay(alertMsg, 3000);
                resetGame();
            }, 750);
        }
    }, 2700);
}

function roll(accumulate = true) {
    rollCount++;
    rollBtn.disabled = true;
    playSound(rollSfx[Math.floor(Math.random() * rollSfx.length)]);
    playerDie[0].parentElement.classList.add("rolling");
    for (let i = 0; i < 24; i++) {
        setTimeout(() => {
            playerDie[0].textContent = dieSymbols[Math.floor(Math.random() * 6)];
            playerDie[1].textContent = dieSymbols[Math.floor(Math.random() * 6)];
        }, i * 50);
    }
    setTimeout(() => {
        playerDie[0].textContent = dieSymbols[playerRoll1];
        playerDie[1].textContent = dieSymbols[playerRoll2];
        playerDie[0].parentElement.classList.remove("rolling");

        if (accumulate) {
            playerScore += playerRoll1 + playerRoll2 + 2;
        } else {
            playerScore = playerRoll1 + playerRoll2 + 2;
        }
        playerScoreLabel.textContent = `${playerScore < 10 ? "0" : ""}${playerScore}`;
        updateFooterDelay(`You rolled ${playerRoll1 + playerRoll2 + 2}!`, 3000);
    }, 1250);
    setTimeout(() => {
        playSound(rollSfx[Math.floor(Math.random() * rollSfx.length)]);
        computerDie[0].parentElement.classList.add("rolling");
        for (let i = 0; i < 24; i++) {
            setTimeout(() => {
                computerDie[0].textContent = dieSymbols[Math.floor(Math.random() * 6)];
                computerDie[1].textContent = dieSymbols[Math.floor(Math.random() * 6)];
            }, i * 50);
        }
    }, 1350);
    setTimeout(() => {
        computerDie[0].textContent = dieSymbols[computerRoll1];
        computerDie[1].textContent = dieSymbols[computerRoll2];
        computerDie[0].parentElement.classList.remove("rolling");
        
        if (accumulate) {
            computerScore += computerRoll1 + computerRoll2 + 2;
        } else {
            computerScore = computerRoll1 + computerRoll2 + 2;
        }
        computerScoreLabel.textContent = `${computerScore < 10 ? "0" : ""}${computerScore}`;
        updateFooterDelay(`Computer rolled ${computerRoll1 + computerRoll2 + 2}!`, 1500);
        rollBtn.disabled = false;
    }, 2600);
}
function randomizeRolls() {
    return [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6), Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)];
}
function resetGame() {
    rollBtn.disabled = false;
    betAmountInput.disabled = practiceMode ? true : false;
    playerScoreLabel.textContent = "00";
    computerScoreLabel.textContent = "00";
    playerScore = 0;
    computerScore = 0;
    [playerRoll1, playerRoll2, computerRoll1, computerRoll2] = randomizeRolls();
    rollCount = 0;
}

let switchGamemode = document.querySelector(".gamemode-select");
switchGamemode.value = getDiceDuelCurrentGamemode();
switchGamemode.addEventListener("change", () => {
    setDiceDuelCurrentGamemode(switchGamemode.value);
    resetGame();
});
let diceGames = document.querySelectorAll(".gamemode-row");
diceGames.forEach(game => {
    let btn = game.querySelector(" button");
    addSFX(btn);
    btn.addEventListener("click", () => {
        if (practiceMode) {
            let choice = confirm("Buying a gamemode in practice mode will still use money. Are you sure you want to buy this? Current Balance: " + moneyFormat(getMoney()));
            if (!choice) return;
        }
        if (getMoney() < parseInt(btn.dataset.price)) {
            alert("You don't have enough money to buy this gamemode!");
            updateFooterDelay("Not enough money to buy this gamemode!", 3000);
            return;
        }

        playSound(gameSfx.upgrade);
        calcMoney(parseInt(btn.dataset.price), "-");
        unlockDiceDuelGamemode(btn.value);
        updateThings();
        if (!practiceMode) {
            updateMoneyLabel();
        }
    });
});
function updateThings() {
    diceGames.forEach((game, index) => {
        let btn = game.querySelector(" button");
        if (getMoney() >= parseInt(btn.dataset.price)) {
            btn.classList.add("green");
            btn.classList.remove("red");
        } else if (getMoney() < parseInt(btn.dataset.price)) {
            btn.classList.remove("green");
            btn.classList.add("red");
        }

        if (getDiceDuelGamemodesUnlocked().includes(btn.value)) {
            game.remove();
            switchGamemode.options[btn.dataset.index].disabled = false;
        }
    });
}
updateThings();

footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        check2 = true;
        wrongFooterCommand();
    }
});