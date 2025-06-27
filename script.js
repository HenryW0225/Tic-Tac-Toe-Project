const board = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const onePlayerBtn = document.getElementById('onePlayerBtn');
const playAsXBtn = document.getElementById('playAsXBtn');
const playAsOBtn = document.getElementById('playAsOBtn');
const playerChoiceDiv = document.getElementById('.player_choice');

let gameBoard = Array(9).fill("");
let gameActive = true;
let botActive = false;
let human = "X";
let ai = "O";
let current = "X";

const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

twoPlayerBtn.onclick = () => {
    if (botActive && gameBoard.every(c => c === "")) {
        botActive = false;
        playerChoiceDiv.style.display = "none";
        current = "X";
        statusText.textContent = "Player X's turn";
    }
};

onePlayerBtn.onclick = () => {
    if (!botActive && gameBoard.every(c => c === "")) {
        botActive = true;
        playerChoiceDiv.style.display = "block";
        human = "X";
        ai = "O";
        current = "X";
        statusText.textContent = "You are X. Your turn.";
    }
};

playAsXBtn.onclick = () => {
    if (botActive && gameBoard.every(c => c === "")) {
        human = "X";
        ai = "O";
        current = "X";
        statusText.textContent = "You are X. Your turn.";
    }
};

playAsOBtn.onclick = () => {
    if (botActive && gameBoard.every(c => c === "")) {
        human = "O";
        ai = "X";
        current = "X";
        statusText.textContent = "You are O. Bot goes first.";
        botMove();
    }
};

restartBtn.onclick = reset;

board.forEach(cell => cell.onclick = () => {
    let i = +cell.dataset.index;
    if (gameBoard[i] === "" && gameActive && (!botActive || current === human)) {
        play(i, current);
        if (checkWin() || checkTie()) return;
        current = current === "X" ? "O" : "X";
        statusText.textContent = botActive
            ? (current === human ? "Your turn." : "Bot's turn.")
            : `Player ${current}'s turn`;
        if (botActive && current === ai) botMove();
    }
});

function play(i, player) {
    gameBoard[i] = player;
    board[i].textContent = player;
}

function checkWin() {
    for (let [a,b,c] of wins) {
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            statusText.textContent = (botActive && gameBoard[a] === ai) ? "Bot wins!" : `Player ${gameBoard[a]} wins!`;
            gameActive = false;
            return true;
        }
    }
    return false;
}

function checkTie() {
    if (gameBoard.every(c => c !== "")) {
        statusText.textContent = "It's a tie!";
        gameActive = false;
        return true;
    }
    return false;
}

function botMove() {
    setTimeout(() => {
        let move = bestMove();
        play(move, ai);
        if (checkWin() || checkTie()) return;
        current = human;
        statusText.textContent = "Your turn.";
    }, 1000);
}

function bestMove() {
    let bestScore = -Infinity;
    let move = -1;
    for (let i=0; i<gameBoard.length; i++) {
        if (gameBoard[i] === "") {
            gameBoard[i] = ai;
            let score = minimax(gameBoard, false);
            gameBoard[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, isMaximizing) {
    if (checkWinState(board, ai)) return 1;
    if (checkWinState(board, human)) return -1;
    if (board.every(c => c !== "")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i=0; i<board.length; i++) {
            if (board[i] === "") {
                board[i] = ai;
                let score = minimax(board, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i=0; i<board.length; i++) {
            if (board[i] === "") {
                board[i] = human;
                let score = minimax(board, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinState(board, player) {
    return wins.some(([a,b,c]) => board[a] === player && board[b] === player && board[c] === player);
}

function reset() {
    gameBoard.fill("");
    gameActive = true;
    current = "X";
    board.forEach(cell => cell.textContent = "");
    statusText.textContent = botActive && human === "O" ? "Bot's turn." : "Player X's turn";
    if (botActive && human === "O") botMove();
}
