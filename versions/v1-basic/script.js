const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;

const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function renderBoard() {
  boardEl.innerHTML = '';
  board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.textContent = value;
    cell.disabled = gameOver || value !== '';
    cell.addEventListener('click', () => handleMove(index));
    boardEl.appendChild(cell);
  });
}

function checkWinner() {
  for (const [a, b, c] of winPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

function handleMove(index) {
  if (gameOver || board[index]) return;

  board[index] = currentPlayer;
  const winner = checkWinner();

  if (winner) {
    statusEl.textContent = `Winner: ${winner}`;
    gameOver = true;
  } else if (board.every((cell) => cell !== '')) {
    statusEl.textContent = 'Draw game!';
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Current player: ${currentPlayer}`;
  }

  renderBoard();
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  statusEl.textContent = 'Current player: X';
  renderBoard();
}

restartBtn.addEventListener('click', resetGame);
renderBoard();
