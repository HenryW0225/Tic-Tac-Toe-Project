const board = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');

let currentPlayer = 'X';
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Winning combinations
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle cell click
board.forEach(cell => {
    cell.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        if (gameBoard[index] === "" && gameActive) {
            gameBoard[index] = currentPlayer;
            this.textContent = currentPlayer;
            checkWinner();
            currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
            statusText.textContent = `Player ${currentPlayer}'s turn`;
        }
    });
});

// Check for a winner
function checkWinner() {
    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            statusText.textContent = `Player ${gameBoard[a]} wins!`;
            gameActive = false;
            return;
        }
    }

    if (!gameBoard.includes("")) {
        statusText.textContent = "It's a tie!";
        gameActive = false;
    }
}

// Restart game
restartBtn.addEventListener('click', () => {
    gameBoard = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = "Player X's turn";
    board.forEach(cell => cell.textContent = "");
});
