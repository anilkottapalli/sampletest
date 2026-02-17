const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
const historyElement = document.getElementById('history');
const modeElement = document.getElementById('mode');
const newRoundButton = document.getElementById('new-round');
const themeToggleButton = document.getElementById('theme-toggle');

const lines = [
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
let history = [];

function checkState(state) {
  for (const line of lines) {
    const [a, b, c] = line;
    if (state[a] && state[a] === state[b] && state[b] === state[c]) {
      return { winner: state[a], line };
    }
  }
  if (state.every(Boolean)) {
    return { winner: 'draw', line: [] };
  }
  return null;
}

function minimax(state, player) {
  const outcome = checkState(state);
  if (outcome?.winner === 'O') return { score: 1 };
  if (outcome?.winner === 'X') return { score: -1 };
  if (outcome?.winner === 'draw') return { score: 0 };

  const moves = [];
  for (let i = 0; i < state.length; i += 1) {
    if (!state[i]) {
      const next = [...state];
      next[i] = player;
      const result = minimax(next, player === 'O' ? 'X' : 'O');
      moves.push({ index: i, score: result.score });
    }
  }

  if (player === 'O') {
    return moves.reduce((best, move) => (move.score > best.score ? move : best));
  }
  return moves.reduce((best, move) => (move.score < best.score ? move : best));
}

function render() {
  boardElement.innerHTML = '';
  board.forEach((value, i) => {
    const cell = document.createElement('button');
    cell.className = 'cell';
    if (winningLine.includes(i)) {
      cell.classList.add('win');
    }
    cell.textContent = value;
    cell.disabled = !active || Boolean(value);
    cell.addEventListener('click', () => play(i));
    boardElement.appendChild(cell);
  });

  historyElement.innerHTML = history
    .map((entry) => `<li>${entry}</li>`)
    .join('');
}

function finishIfNeeded() {
  const result = checkState(board);
  if (!result) return false;

  active = false;
  winningLine = result.line;
  statusElement.textContent = result.winner === 'draw'
    ? 'Game finished: draw.'
    : `Game finished: ${result.winner} wins.`;
  return true;
}

function pushHistory(player, index) {
  history.push(`${player} -> cell ${index + 1}`);
}

function play(index) {
  if (!active || board[index]) return;

  board[index] = currentPlayer;
  pushHistory(currentPlayer, index);

  if (finishIfNeeded()) {
    render();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusElement.textContent = `Turn: ${currentPlayer}`;
  render();

  if (modeElement.value === 'ai' && currentPlayer === 'O') {
    const bestMove = minimax(board, 'O').index;
    if (bestMove !== undefined) {
      play(bestMove);
    }
  }
}

function resetRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  active = true;
  winningLine = [];
  history = [];
  statusElement.textContent = 'Turn: X';
  render();
}

modeElement.addEventListener('change', resetRound);
newRoundButton.addEventListener('click', resetRound);
themeToggleButton.addEventListener('click', () => {
  const html = document.documentElement;
  const nextTheme = html.dataset.theme === 'light' ? 'dark' : 'light';
  html.dataset.theme = nextTheme;
});

render();
