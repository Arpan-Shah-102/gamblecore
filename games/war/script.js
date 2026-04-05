const cards = [
    "🂡","🂢","🂣","🂤","🂥","🂦","🂧","🂨","🂩","🂪","🂫","🂭","🂮",
    "🂱","🂲","🂳","🂴","🂵","🂶","🂷","🂸","🂹","🂺","🂻","🂽","🂾",
    "🃁","🃂","🃃","🃄","🃅","🃆","🃇","🃈","🃉","🃊","🃋","🃍","🃎",
    "🃑","🃒","🃓","🃔","🃕","🃖","🃗","🃘","🃙","🃚","🃛","🃝","🃞"
];
const cardValues = {
    "🂡": 14, "🂱": 14, "🃁": 14, "🃑": 14,
    "🂢": 2, "🂲": 2, "🃂": 2, "🃒": 2,
    "🂣": 3, "🂳": 3, "🃃": 3, "🃓": 3,
    "🂤": 4, "🂴": 4, "🃄": 4, "🃔": 4,
    "🂥": 5, "🂵": 5, "🃅": 5, "🃕": 5,
    "🂦": 6, "🂶": 6, "🃆": 6, "🃖": 6,
    "🂧": 7, "🂷": 7, "🃇": 7, "🃗": 7,
    "🂨": 8, "🂸": 8, "🃈": 8, "🃘": 8,
    "🂩": 9, "🂹": 9, "🃉": 9, "🃙": 9,
    "🂪": 10, "🂺": 10, "🃊": 10, "🃚": 10,
    "🂫": 11, "🂻": 11, "🃋": 11, "🃛": 11,
    "🂭": 12, "🂽": 12, "🃍": 12, "🃝": 12
};
let cardsDisplays = document.querySelectorAll(".card");
let [playerCard, computerCard] = cardsDisplays;
let betInput = document.querySelector(".bet-amount");
let drawCardBtn = document.querySelector(".draw");

addSFX(drawCardBtn);
betInput.value = getWarBetAmount();
betInput.addEventListener("blur", () => {
    let betAmount = parseInt(betInput.value);
    if (isNaN(betAmount) || betAmount < 1) {
        betInput.value = getWarBetAmount();
    } else if (betAmount > 1000) {
        betInput.value = 1000;
    }
    setWarBetAmount(betInput.value);
});

drawCardBtn.addEventListener("click", () => {
    let betAmount = getWarBetAmount();
    if (betAmount > getMoney() && !practiceMode) {
        alert("You do not have enough money to make this bet.");
        return;
    }
    if (!practiceMode) {calcMoney(betAmount, "-"); updateMoneyLabel();}

    drawCardBtn.classList.add("disabled");
    playerCard.classList.add("draw");
    setTimeout(() => {
        const idx = Math.floor(Math.random() * cards.length);
        playerCard.textContent = cards[idx];
        if (idx >= 13 && idx <= 38) {
            playerCard.classList.add("r");
        }
    }, 500);
    setTimeout(() => {
        playerCard.classList.remove("draw");
    }, 1050);

    setTimeout(() => {
        computerCard.classList.add("draw");
    }, 1500);
    setTimeout(() => {
        const idx = Math.floor(Math.random() * cards.length);
        computerCard.textContent = cards[idx];
        if (idx >= 13 && idx <= 38) {
            computerCard.classList.add("r");
        }
    }, 2000);
    setTimeout(() => {
        computerCard.classList.remove("draw");
    }, 2550);

    setTimeout(() => {
        let playerValue = cardValues[playerCard.textContent];
        let computerValue = cardValues[computerCard.textContent];
        if (playerValue > computerValue) {
            if (!practiceMode) {
                calcMoney(betAmount * 2, "+"); updateMoneyLabel();
                alert(`You win! You earned ${moneyFormat(betAmount * 2)}.`);
            } else {
                alert("You win! Great job!");
            }
        } else if (playerValue < computerValue) {
            alert("You lose! Better luck next time.");
        } else {
            if (!practiceMode) {
                calcMoney(betAmount, "+"); updateMoneyLabel();
                alert("It's a tie! Your bet has been returned.");
            } else {
                alert("It's a tie! Nice try.");
            }
        }
        drawCardBtn.classList.remove("disabled");
        playerCard.textContent = "🂠";
        computerCard.textContent = "🂠";
        playerCard.classList.remove("r");
        computerCard.classList.remove("r");
    }, 2750);
});