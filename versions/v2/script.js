const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const scoreX = document.getElementById('score-x');
const scoreO = document.getElementById('score-o');
const scoreDraw = document.getElementById('score-draw');
const nextRoundButton = document.getElementById('next-round');
const fullResetButton = document.getElementById('full-reset');

const combos = [
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
let active = true;
let winningLine = [];
const score = { X: 0, O: 0, draw: 0 };

function updateScoreboard() {
  scoreX.textContent = score.X;
  scoreO.textContent = score.O;
  scoreDraw.textContent = score.draw;
}

function render() {
  boardElement.innerHTML = '';

  board.forEach((value, index) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    if (winningLine.includes(index)) {
      cell.classList.add('win');
    }
    cell.textContent = value;
    cell.disabled = !active || Boolean(value);
    cell.addEventListener('click', () => play(index));
    boardElement.appendChild(cell);
  });
}

function findResult() {
  for (const line of combos) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line };
    }
  }
  if (board.every(Boolean)) {
    return { winner: 'draw', line: [] };
  }
  return null;
}

function play(index) {
  if (!active || board[index]) return;

  board[index] = currentPlayer;
  const result = findResult();

  if (result?.winner === 'draw') {
    active = false;
    score.draw += 1;
    statusElement.textContent = 'Round ended in a draw.';
  } else if (result?.winner) {
    active = false;
    winningLine = result.line;
    score[result.winner] += 1;
    statusElement.textContent = `Round winner: ${result.winner}`;
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.textContent = `Turn: ${currentPlayer}`;
  }

  updateScoreboard();
  render();
}

function resetRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  active = true;
  winningLine = [];
  statusElement.textContent = 'Turn: X';
  render();
}

function resetMatch() {
  score.X = 0;
  score.O = 0;
  score.draw = 0;
  updateScoreboard();
  resetRound();
}

nextRoundButton.addEventListener('click', resetRound);
fullResetButton.addEventListener('click', resetMatch);

updateScoreboard();
render();
