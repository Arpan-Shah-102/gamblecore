const gameSfx = {
    positiveDing: new Audio("../assets/sfx/lottery/positive-ding.mp3"),
    ballPicking: new Audio("../assets/sfx/lottery/ball-picking.mp3"),
    ding: new Audio("../assets/sfx/lottery/ding.mp3"),
    win: new Audio("../assets/sfx/lottery/win.mp3"),
    lose: new Audio("../assets/sfx/lottery/lose.mp3"),
    upgrade: new Audio("../assets/sfx/lottery/upgrade.mp3")
}

const mainBalls = document.querySelectorAll(".main-ball");
const ballSelectGridBalls = document.querySelectorAll(".ball-select-grid .ball.side-ball");
const ballResults = document.querySelectorAll(".result-ball");
const controlBtns = document.querySelectorAll(".option-btn");
const terminal = document.querySelector(".terminal");
let selectedNumbers = [];
let winningNumbers = [];
practiceModeToggle.addEventListener("click", updateBuyBtn);

function quickSelect() {
    clearSelection();
    while (selectedNumbers.length < 5) {
        const randomNumber = Math.ceil(Math.random() * 28);
        if (!selectedNumbers.includes(randomNumber)) {
            selectedNumbers.push(randomNumber);
            ballSelectGridBalls[randomNumber - 1].classList.add("selected");
        }
    }
    updateBalls();
    updateOptionBtns();
}
function clearSelection() {
    selectedNumbers = [];
    ballSelectGridBalls.forEach(ball => {
        ball.classList.remove("selected");
        ball.classList.remove("disabled");
    });
    updateBalls();
    updateOptionBtns();
}
function buyTicket() {
    if (!enoughMoney(100)) {
        if (!getAlertsDisabled()) alert("You don't have enough money to buy a ticket!");
        terminal.textContent = "Not enough money to buy a ticket!";
        return;
    }

    if (!practiceMode) {
        calcMoney(100, "-");
        updateMoneyLabel();
    }
    controlBtns.forEach(btn => btn.disabled = true);
    ballSelectGridBalls[0].parentElement.classList.remove("shown");
    ballResults[0].parentElement.classList.add("shown");
    terminal.textContent = "Drawing numbers...";

    while (winningNumbers.length < 5) {
        const randomNumber = Math.ceil(Math.random() * 28);
        if (!winningNumbers.includes(randomNumber)) {
            winningNumbers.push(randomNumber);
        }
    }
    function addWinningNumber(num) {
        if (winningNumbers.length < 5 && !winningNumbers.includes(selectedNumbers[num])) {
            winningNumbers.push(selectedNumbers[num]);
        }
    }
    if (getTotalLotteryPlays() == 0) {
        addWinningNumber(4);
        addWinningNumber(2);
        winningNumbers[0] = selectedNumbers[4];
        winningNumbers[4] = selectedNumbers[2];
    } else if (getTotalLotteryPlays() == 1 && Math.random() < 0.5) {
        addWinningNumber(3);
        addWinningNumber(1);
        winningNumbers[2] = selectedNumbers[3];
        winningNumbers[3] = selectedNumbers[1];
    } else if (getTotalLotteryPlays() == 2 && Math.random() < 0.25) {
        addWinningNumber(0);
        addWinningNumber(1);
        winningNumbers[1] = selectedNumbers[0];
        winningNumbers[3] = selectedNumbers[1];
    }
    incrementTotalLotteryPlays();

    ballResults.forEach((ball, index) => {
        setTimeout(() => {
            playSound(gameSfx.ballPicking);
            for (let i = 0; i <= 10; i++) {
                setTimeout(() => {
                    ball.textContent = Math.ceil(Math.random() * 28);
                }, 100 * i);
            }
            ball.classList.add("rolling");
            setTimeout(() => {
                playSound(gameSfx.ding);
                ball.textContent = winningNumbers[index];
                ball.classList.add("selected");
                ball.classList.remove("rolling");

                if (selectedNumbers.includes(winningNumbers[index])) {
                    playSound(gameSfx.positiveDing);
                    ball.classList.add("match");
                    mainBalls.forEach(b => {
                        if (parseInt(b.textContent) === winningNumbers[index]) {
                            b.classList.add("match");
                        }
                    });
                }
            }, 1000);
        }, 1500 * index);
    });
    setTimeout(() => {
        let matches = 0;
        mainBalls.forEach(ball => {
            if (ball.classList.contains("match")) {matches++};
        });
        let alertMsg;
        let winnings = 0;

        if (matches == 5 && getLotteryMatchesUnlocked().includes(5)) {
            winnings = 42700;
            alertMsg = "Jackpot! 5/5 Matching!" + (practiceMode ? "" : " You won $42,700!");
            playSound(gameSfx.win);
        } else if (matches >= 4 && getLotteryMatchesUnlocked().includes(4)) {
            winnings = 10800;
            alertMsg = "4/5 Matching!" + (practiceMode ? "" : " You won $10,800!");
            playSound(gameSfx.win);
        } else if (matches >= 3 && getLotteryMatchesUnlocked().includes(3)) {
            winnings = 2400;
            alertMsg = "3/5 Matching!" + (practiceMode ? "" : " You won $2,400!");
            playSound(gameSfx.win);
        } else if (matches >= 2 && getLotteryMatchesUnlocked().includes(2)) {
            winnings = 600;
            alertMsg = "2/5 Matching!" + (practiceMode ? "" : " You won $600!");
            playSound(gameSfx.win);
        } else if (matches >= 1 && getLotteryMatchesUnlocked().includes(1)) {
            winnings = 200;
            alertMsg = "1/5 Matching!" + (practiceMode ? "" : " You won $200!");
            playSound(gameSfx.win);
        } else {
            alertMsg = "No matches. Better luck next time!";
            playSound(gameSfx.lose);
        }
        if (!practiceMode) {
            calcMoney(winnings, "+");
            updateMoneyLabel();
            updateBuyBtn();
        }
        updateFooterDelay(alertMsg);
        terminal.textContent = alertMsg;
        if (!getAlertsDisabled()) {
            setTimeout(() => {
                alert(alertMsg)
                resetGame();
            }, 100);
        } else {
            setTimeout(() => {
                resetGame();
            }, 1000);
        }
    }, 8000);
}

const controlBtnFunctions = [quickSelect, clearSelection, buyTicket];
controlBtns.forEach((btn, index) => {
    addSFX(btn);
    btn.addEventListener("click", controlBtnFunctions[index]);
});

ballSelectGridBalls.forEach((ball) => {
    addSFX(ball);
    ball.addEventListener("click", () => {
        const number = parseInt(ball.textContent);
        if (selectedNumbers.includes(number)) {
            selectedNumbers = selectedNumbers.filter(num => num !== number);
            ball.classList.remove("selected");
            updateBalls();
        } else {
            selectedNumbers.push(number);
            ball.classList.add("selected");
            updateBalls();
        }
        updateOptionBtns();
    });
});

function updateBalls() {
    ballSelectGridBalls.forEach(b => {
        if (!b.classList.contains("selected") && selectedNumbers.length >= 5) {
            b.classList.add("disabled");
        } else {
            b.classList.remove("disabled");
        }
    });
    selectedNumbers.forEach((num, index) => {
        mainBalls[index].textContent = num;
        mainBalls[index].classList.add("selected");
    });
    if (selectedNumbers.length != 5) {
        mainBalls.forEach((ball, index) => {
            if (index >= selectedNumbers.length) {
                ball.textContent = "?";
                ball.classList.remove("selected");
            }
        });
    }
}
function updateOptionBtns() {
    if (selectedNumbers.length > 0) {
        controlBtns[1].disabled = false;
    } else {
        controlBtns[1].disabled = true;
    }

    if (selectedNumbers.length === 5) {
        controlBtns[2].disabled = false;
    } else {
        controlBtns[2].disabled = true;
    }
}
const buyMatches = document.querySelectorAll(".match-row:has(button.buy)");
const buyMatchesBtns = document.querySelectorAll(".match-row:has(button.buy) > button.buy");
buyMatchesBtns.forEach((btn, index) => {
    addSFX(btn);
    btn.addEventListener("click", () => {
        const price = parseInt(btn.dataset.price);
        if (practiceMode) {
            if (!confirm(`Are you sure you want to buy this match? This will still take money even in practice mode. Current Balance: ${moneyFormat(getMoney())}`)) return;
        }
        if (!enoughMoney(price)) {
            alert("You don't have enough money to buy this match!");
            return;
        }
        playSound(gameSfx.upgrade);
        calcMoney(price, "-");
        if (!practiceMode) {updateMoneyLabel();}
        addLotteryMatchesUnlocked(parseInt(btn.value));
        btn.classList.remove("green");
        btn.classList.remove("red");
        btn.classList.add("bought");
        btn.textContent = "Unlocked!";

        if (!getAlertsDisabled()) setTimeout(() => {alert(`You have unlocked the ${btn.value}/5 match prize!`);}, 150);
        updateFooterDelay(`You have unlocked the ${btn.value}/5 match prize!`);
    });
});
function updateBuyBtn() {
    if (getMoney() >= 100) {
        controlBtns[2].classList.remove("red");
        controlBtns[2].classList.add("green");
    } else {
        controlBtns[2].classList.remove("green");
        controlBtns[2].classList.add("red");
    }

    buyMatchesBtns.forEach(btn => {
        if (getMoney() >= btn.dataset.price) {
            btn.classList.remove("red");
            btn.classList.add("green");
        } else if (getMoney() < btn.dataset.price) {
            btn.classList.remove("green");
            btn.classList.add("red");
        }

        if (getLotteryMatchesUnlocked().includes(parseInt(btn.value))) {
            btn.classList.remove("green");
            btn.classList.remove("red");
            btn.classList.add("bought");
            btn.textContent = "Unlocked!";
        }
    });
}
updateBuyBtn();

function resetGame() {
    selectedNumbers = [];
    winningNumbers = [];
    mainBalls.forEach(ball => {
        ball.textContent = "?";
        ball.classList.remove("selected", "match");
    });
    ballResults.forEach(ball => {
        ball.textContent = "?";
        ball.classList.remove("selected", "match");
    });
    ballSelectGridBalls.forEach(ball => {
        ball.classList.remove("selected", "disabled");
    });
    controlBtns[0].disabled = false;
    updateOptionBtns();
    updateBalls();
    setTimeout(() => {
        terminal.textContent = "Select your numbers and buy a ticket!";
    }, 2500);
    ballSelectGridBalls[0].parentElement.classList.add("shown");
    ballResults[0].parentElement.classList.remove("shown");
}



footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        check2 = true;
        wrongFooterCommand();
    }
});