let gameSfx = {
    ding: new Audio("../assets/sfx/betting/ding.mp3"),
    go: new Audio("../assets/sfx/betting/go.mp3"),
    neigh: new Audio("../assets/sfx/betting/horse-neigh.mp3"),
    clop: new Audio("../assets/sfx/betting/clop.mp3"),
    win: new Audio("../assets/sfx/betting/win.mp3"),
    lose: new Audio("../assets/sfx/betting/lose.mp3"),
}

let game = document.querySelector(".main-game");
let raceSection = document.querySelector('.game');
let preGame = document.querySelector(".pre-game");
let finishLine = document.querySelector(".finish-line");

let betButtons = document.querySelectorAll(".bet-btn");
let horses = document.querySelectorAll(".horse");
let winningPlaces = document.querySelectorAll(".winning-place");
let startingPlaces = document.querySelectorAll(".starting-place");
let horseNum = 0;
let raceInterval;

let betAmountInput = document.querySelector("input.bet-amount");
betAmountInput.addEventListener("input", () => {
    setTimeout(() => {
        let newBet = parseInt(betAmountInput.value);
        if (newBet < 1 || newBet > 1000 || isNaN(newBet)) {
            betAmountInput.value = getBettingBetAmount();
            return;
        }
        setBettingBetAmount(newBet);
    }, 1500);
});
betAmountInput.value = getBettingBetAmount();
practiceModeToggle.addEventListener("click", () => {
    betAmountInput.value = practiceMode ? "0" : getBettingBetAmount();
    betAmountInput.classList.toggle("opacity-50");
    betAmountInput.attributes["readonly"] ? betAmountInput.removeAttribute("readonly") : betAmountInput.setAttribute("readonly", true);
});

let startBtn = document.querySelector(".start");
let pauseBtn = document.querySelector(".pause");
let resetBtn = document.querySelector(".reset");
addSFX(startBtn); addSFX(pauseBtn); addSFX(resetBtn);

startBtn.addEventListener("click", () => {
    if (!raceStarted) {playSound(gameSfx.go);}
    raceStarted = true;
    startGame();
    startBtn.classList.add("disabled");
    pauseBtn.classList.remove("disabled");
});
pauseBtn.addEventListener("click", () => {
    clearInterval(raceInterval);
    raceInterval = null;
    startBtn.classList.remove("disabled");
    pauseBtn.classList.add("disabled");
});
resetBtn.addEventListener("click", resetGame);

betButtons.forEach((btn, index) => {
    addSFX(btn);
    btn.addEventListener("click", () => {
        horseNum = index;
        startingPlaces[index].classList.add("selected");
        preGame.style.display = "none";
        game.style.display = "flex";
        if (!practiceMode) {
            calcMoney(getBettingBetAmount(), "-");
            updateMoneyLabel();
        }
    });
});

function resetGame() {
    clearInterval(raceInterval);
    raceInterval = null;
    startingPlaces[horseNum].classList.remove("selected");
    horses.forEach(horse => horse.style.left = "0px");
    winningPlaces.forEach(place => place.classList.remove("shown"));
    allHorseSpeeds = shuffleInPlace(allHorseSpeeds);
    interval = 75;
    winners = [];
    raceStarted = false;
    raceIntervalCount = 0;

    startBtn.classList.remove("disabled");
    pauseBtn.classList.add("disabled");
    preGame.style.display = "flex";
    game.style.display = "none";
}

let horseSpeedA = [1, 2, 3, 4, 5, 6];
let horseSpeedB = [1, 2, 3, 4, 5, 6];
let horseSpeedC = [1, 2, 3, 4, 5, 6];
let horseSpeedD = [1, 2, 3, 4, 5, 6, 7];
let horseSpeedE = [1, 2, 3, 4, 5, 6, 7];
let horseSpeedF = [1, 2, 3, 4, 5, 6, 7, 8];

let allHorseSpeeds = [horseSpeedA, horseSpeedB, horseSpeedC, horseSpeedD, horseSpeedE, horseSpeedF];
function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}
allHorseSpeeds = shuffleInPlace(allHorseSpeeds);
let winners = [];
let finishLineLeft = parseInt(getComputedStyle(raceSection).width) - 225;
horses.forEach(h => { h.style.left = "0px"; });

let interval = 75;
let raceStarted = false;
let raceIntervalCount = 0;
function startGame() {
    if (raceInterval) return;

    raceInterval = setInterval(() => {
        raceIntervalCount++;
        if (Math.random() < 0.025) {playSound(gameSfx.neigh);}
        if (raceIntervalCount % 4 == 0) {playSound(gameSfx.clop);}

        horses.forEach((horse, index) => {
            if (winners.includes(index)) return;
            const randomIndex = Math.floor(Math.random() * allHorseSpeeds[index].length);
            let currentLeft = parseInt(horse.style.left);
            let newLeft = currentLeft + allHorseSpeeds[index][randomIndex];
            horse.style.left = newLeft + "px";

            if (newLeft >= finishLineLeft) {
                winners.push(index);
                winningPlaces[index].classList.add("shown");
                winningPlaces[index].textContent = `${winners.length}${winners.length == 1 ? "st" : winners.length == 2 ? "nd" : winners.length == 3 ? "rd" : "th"}`;
                interval -= 10;
                playSound(gameSfx.ding);

                if (winners.length == 6) {
                    playSound(winners[0] == horseNum || winners[1] == horseNum ? gameSfx.win : gameSfx.lose);
                    setTimeout(() => {
                        alert(`Results:\n1st: Horse ${winners[0] + 1}\n2nd: Horse ${winners[1] + 1}\n3rd: Horse ${winners[2] + 1}\n4th: Horse ${winners[3] + 1}\n5th: Horse ${winners[4] + 1}\n6th: Horse ${winners[5] + 1}`);
                        if (winners[0] == horseNum) {
                            if (!practiceMode) {
                                alert(`Congratulations! You won 1st!\nBet Prize: ${moneyFormat(getBettingBetAmount() * 6)}!`);
                                calcMoney(getBettingBetAmount() * 6, "+");
                                updateMoneyLabel();
                            } else {
                                alert("Congratulations! You won 1st!");
                            }
                        } else if (winners[1] == horseNum) {
                            if (!practiceMode) {
                                alert(`Congratulations! You won 2nd!\nBet Prize: ${moneyFormat(getBettingBetAmount() * 2)}!`);
                                calcMoney(getBettingBetAmount() * 2, "+");
                                updateMoneyLabel();
                            } else {
                                alert("Congratulations! You won 2nd!");
                            }
                        } else {
                            const winnerNum = winners.indexOf(horseNum) + 1;
                            alert(`You came in ${winnerNum}${winnerNum == 3 ? 'rd' : 'th'} place.\nBetter luck next time!`);
                        }
                        resetGame();
                    }, 250);
                }
            }
        });
    }, interval);
}

function specialGuest(itemIndex, remove = false) {
    if (remove) {
        betButtons[itemIndex].classList.remove('sg');
        horses[itemIndex].classList.remove('sg');
    } else {
        betButtons[itemIndex].classList.add('sg');
        horses[itemIndex].classList.add('sg');
    }
}
footerText.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        originalText = footerText.textContent.toLocaleLowerCase().trim();
        text = footerText.textContent.toLocaleLowerCase().trim().split(/\s+/);
        e.preventDefault();
        footerText.blur();
        check2 = false;

        if (originalText == "h" || originalText == "help") {
            footerText.innerHTML = defaultFooterText;
            playSound(sfx.gameBought);
            setTimeout(() => {alert("Available Commands:\n\n1. special-guest: [1/2/3/4/5/6/a] or sg [1/2/3/4/5/6/a]\n2. return-special-guest: [1/2/3/4/5/6/a] or rsg [1/2/3/4/5/6/a]");}, 150);
            return;
        }
        if (["special-guest", "sg"].includes(text[0])) {
            if (text[1] == "1") {
                specialGuest(0);
            } else if (text[1] == "2") {
                specialGuest(1);
            } else if (text[1] == "3") {
                specialGuest(2);
            } else if (text[1] == "4") {
                specialGuest(3);
            } else if (text[1] == "5") {
                specialGuest(4);
            } else if (text[1] == "6") {
                specialGuest(5);
            } else if (text[1] == "a" || text[1] == "all") {
                for (let i = 0; i < 6; i++) {
                    specialGuest(i);
                }
            } else {
                wrongFooterCommand();
                return;
            }
            playSound(sfx.cheat);
            footerText.textContent = "Special Guest Invited!";
            setTimeout(() => {
                if (footerText.textContent !== "Special Guest Invited!") return;
                footerText.innerHTML = defaultFooterText;
            }, 7500);
        } else if (["return-special-guest", "rsg"].includes(text[0])) {
            if (text[1] == "1") {
                specialGuest(0, true);
            } else if (text[1] == "2") {
                specialGuest(1, true);
            } else if (text[1] == "3") {
                specialGuest(2, true);
            } else if (text[1] == "4") {
                specialGuest(3, true);
            } else if (text[1] == "5") {
                specialGuest(4, true);
            } else if (text[1] == "6") {
                specialGuest(5, true);
            } else if (text[1] == "a" || text[1] == "all") {
                for (let i = 0; i < 6; i++) {
                    specialGuest(i, true);
                }
            } else {
                wrongFooterCommand();
                return;
            }
            playSound(sfx.cheat);
            footerText.textContent = "Special Guest Returned!";
            setTimeout(() => {
                if (footerText.textContent !== "Special Guest Returned!") return;
                footerText.innerHTML = defaultFooterText;
            }, 7500);
        } else {
            check2 = true;
            wrongFooterCommand();
        }
    }
});
