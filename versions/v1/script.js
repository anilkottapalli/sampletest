const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const resetButton = document.getElementById('reset');

const winningCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;

function renderBoard() {
  boardElement.innerHTML = '';

  board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    cell.textContent = value;
    cell.disabled = !gameActive || Boolean(value);
    cell.addEventListener('click', () => makeMove(index));
    boardElement.appendChild(cell);
  });
}

function checkWinner() {
  for (const [a, b, c] of winningCombos) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  if (board.every(Boolean)) {
    return 'draw';
  }

  return null;
}

function makeMove(index) {
  if (!gameActive || board[index]) {
    return;
  }

  board[index] = currentPlayer;
  const result = checkWinner();

  if (result === 'draw') {
    gameActive = false;
    statusElement.textContent = 'It\'s a draw!';
  } else if (result) {
    gameActive = false;
    statusElement.textContent = `Winner: ${result}`;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Current player: ${currentPlayer}`;
  }

  renderBoard();
}

function resetGame() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameActive = true;
  statusElement.textContent = 'Current player: X';
  renderBoard();
}

resetButton.addEventListener('click', resetGame);
renderBoard();
