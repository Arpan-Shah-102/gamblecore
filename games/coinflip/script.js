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
        calcMoney(selectedSideAndBet.bet, "-");
        updateMoneyLabel();
        coin.classList.add("flipping");
        coinResult.textContent = "";
        playSound(coinSfx.flip);

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
                coinResult.textContent = `You won ${practiceMode ? 0 : moneyFormat(selectedSideAndBet.bet * (100 / chance))}`;
                playSound(coinSfx.win);
                calcMoney(selectedSideAndBet.bet * (100 / chance), "+");
            } else if (flipResult !== selectedSideAndBet.side) {
                coinResult.textContent = `You lost ${practiceMode ? 0 : moneyFormat(selectedSideAndBet.bet)}`;
                playSound(coinSfx.lose);
            }
            updateThings();
        }, 2000);
    }
}

function updateThings() {
    updateMoneyLabel();
}
updateThings();
