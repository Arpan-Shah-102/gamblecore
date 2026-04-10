const gameSfx = {
    roll1: new Audio("../assets/sfx/diceroll/dice-roll-1.mp3"),
    roll2: new Audio("../assets/sfx/diceroll/dice-roll-2.mp3"),
    roll3: new Audio("../assets/sfx/diceroll/dice-roll-3.mp3"),
    win: new Audio("../assets/sfx/diceroll/win.mp3"),
    lose: new Audio("../assets/sfx/diceroll/lose.mp3"),
    tie: new Audio("../assets/sfx/diceroll/tie.mp3"),
}
const rollSfx = [gameSfx.roll1, gameSfx.roll2, gameSfx.roll3];
const dieSymbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
const dieValues = [1, 2, 3, 4, 5, 6];

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
        betAmountInput.value = getWarBetAmount();
        betAmountInput.disabled = false;
    } else {
        betAmountInput.value = "0";
        betAmountInput.disabled = true;
    }
});
let rollBtn = document.querySelector(".roll-btn");
addSFX(rollBtn);

rollBtn.addEventListener("click", () => {
    if (!practiceMode && getMoney() < getDiceDuelBetAmount()) {
        alert("You don't have enough money to place this bet!");
        updateFooterDelay("Not enough money to place the bet!", 3000);
        return;
    }
    if (!practiceMode) {
        calcMoney(getDiceDuelBetAmount(), "-");
        updateMoneyLabel();
    }
    let playerRoll1 = Math.floor(Math.random() * 6);
    let playerRoll2 = Math.floor(Math.random() * 6);
    let computerRoll1 = Math.floor(Math.random() * 6);
    let computerRoll2 = Math.floor(Math.random() * 6);
    rollBtn.disabled = true;
    betAmountInput.disabled = true;

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

        playerScore = playerRoll1 + playerRoll2 + 2;
        playerScoreLabel.textContent = `${playerScore < 10 ? "0" : ""}${playerScore}`;
        updateFooterDelay(`You rolled ${playerScore}!`, 1500);
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

        computerScore = computerRoll1 + computerRoll2 + 2;
        computerScoreLabel.textContent = `${computerScore < 10 ? "0" : ""}${computerScore}`;
        updateFooterDelay(`Computer rolled ${computerScore}!`);
    }, 2600);
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
            alert(alertMsg);
        }
        setTimeout(() => {
            updateFooterDelay(alertMsg, 3000);
            resetGame();
        }, 750);
    }, 2750);
});

function resetGame() {
    rollBtn.disabled = false;
    betAmountInput.disabled = practiceMode ? true : false;
    playerScoreLabel.textContent = "00";
    computerScoreLabel.textContent = "00";
}

footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        check2 = true;
        wrongFooterCommand();
    }
});