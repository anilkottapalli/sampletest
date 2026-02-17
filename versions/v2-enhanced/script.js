const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const xScoreEl = document.getElementById('xScore');
const oScoreEl = document.getElementById('oScore');
const drawScoreEl = document.getElementById('drawScore');
const undoBtn = document.getElementById('undoBtn');
const restartBtn = document.getElementById('restartBtn');
const resetAllBtn = document.getElementById('resetAllBtn');

let board = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let history = [];

const scores = { X: 0, O: 0, draws: 0 };

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
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function updateScoreUI() {
  xScoreEl.textContent = `X: ${scores.X}`;
  oScoreEl.textContent = `O: ${scores.O}`;
  drawScoreEl.textContent = `Draws: ${scores.draws}`;
}

function handleMove(index) {
  if (gameOver || board[index]) return;

  history.push({ board: [...board], currentPlayer, gameOver, status: statusEl.textContent });
  board[index] = currentPlayer;

  const winner = checkWinner();
  if (winner) {
    scores[winner] += 1;
    statusEl.textContent = `Winner: ${winner}`;
    gameOver = true;
  } else if (board.every((cell) => cell !== '')) {
    scores.draws += 1;
    statusEl.textContent = 'Draw game!';
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusEl.textContent = `Current player: ${currentPlayer}`;
  }

  updateScoreUI();
  renderBoard();
}

function undoMove() {
  if (!history.length) return;
  const previous = history.pop();
  board = previous.board;
  currentPlayer = previous.currentPlayer;
  gameOver = previous.gameOver;
  statusEl.textContent = previous.status;
  renderBoard();
}

function restartRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  gameOver = false;
  history = [];
  statusEl.textContent = 'Current player: X';
  renderBoard();
}

function resetAllScores() {
  scores.X = 0;
  scores.O = 0;
  scores.draws = 0;
  updateScoreUI();
  restartRound();
}

undoBtn.addEventListener('click', undoMove);
restartBtn.addEventListener('click', restartRound);
resetAllBtn.addEventListener('click', resetAllScores);

updateScoreUI();
renderBoard();
