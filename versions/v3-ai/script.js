const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
const difficultyEl = document.getElementById('difficulty');
const themeBtn = document.getElementById('themeBtn');

const HUMAN = 'X';
const AI = 'O';

let board = Array(9).fill('');
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
    cell.addEventListener('click', () => handleHumanMove(index));
    boardEl.appendChild(cell);
  });
}

function checkWinner(state) {
  for (const [a, b, c] of winPatterns) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) return state[a];
  }
  return null;
}

function isDraw(state) {
  return state.every((cell) => cell !== '');
}

function setGameOver(message) {
  gameOver = true;
  statusEl.textContent = message;
}

function handleHumanMove(index) {
  if (gameOver || board[index]) return;

  board[index] = HUMAN;
  renderBoard();

  const winner = checkWinner(board);
  if (winner === HUMAN) return setGameOver('You win!');
  if (isDraw(board)) return setGameOver('Draw game!');

  statusEl.textContent = 'Computer thinking...';
  setTimeout(handleComputerMove, 250);
}

function handleComputerMove() {
  if (gameOver) return;

  const difficulty = difficultyEl.value;
  const move = difficulty === 'easy' ? getRandomMove(board) : getBestMove(board);
  if (move === -1) return;

  board[move] = AI;
  renderBoard();

  const winner = checkWinner(board);
  if (winner === AI) return setGameOver('Computer wins!');
  if (isDraw(board)) return setGameOver('Draw game!');

  statusEl.textContent = 'Your turn (X)';
}

function getRandomMove(state) {
  const options = state
    .map((value, index) => (value === '' ? index : -1))
    .filter((index) => index !== -1);
  if (!options.length) return -1;
  return options[Math.floor(Math.random() * options.length)];
}

function minimax(state, isMaximizing) {
  const winner = checkWinner(state);
  if (winner === AI) return 10;
  if (winner === HUMAN) return -10;
  if (isDraw(state)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < state.length; i += 1) {
      if (state[i] === '') {
        state[i] = AI;
        const score = minimax(state, false);
        state[i] = '';
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  }

  let bestScore = Infinity;
  for (let i = 0; i < state.length; i += 1) {
    if (state[i] === '') {
      state[i] = HUMAN;
      const score = minimax(state, true);
      state[i] = '';
      bestScore = Math.min(score, bestScore);
    }
  }
  return bestScore;
}

function getBestMove(state) {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < state.length; i += 1) {
    if (state[i] === '') {
      state[i] = AI;
      const score = minimax(state, false);
      state[i] = '';
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function restartGame() {
  board = Array(9).fill('');
  gameOver = false;
  statusEl.textContent = 'Your turn (X)';
  renderBoard();
}

themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

restartBtn.addEventListener('click', restartGame);
renderBoard();
