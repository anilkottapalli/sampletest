const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let board = Array(9).fill('');
let current = 'X';
let ended = false;

const wins = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function checkWinner(cells) {
  return wins.find((line) => line.every((i) => cells[i] && cells[i] === cells[line[0]]));
}

function render() {
  boardEl.innerHTML = '';
  board.forEach((value, i) => {
    const btn = document.createElement('button');
    btn.className = 'cell';
    btn.textContent = value;
    btn.onclick = () => play(i);
    boardEl.appendChild(btn);
  });
}

function play(i) {
  if (board[i] || ended) return;
  board[i] = current;
  const line = checkWinner(board);
  if (line) {
    ended = true;
    statusEl.textContent = `Winner: ${current}`;
  } else if (board.every(Boolean)) {
    ended = true;
    statusEl.textContent = 'Draw game';
  } else {
    current = current === 'X' ? 'O' : 'X';
    statusEl.textContent = `Current turn: ${current}`;
  }
  render();
}

resetBtn.onclick = () => {
  board = Array(9).fill('');
  current = 'X';
  ended = false;
  statusEl.textContent = 'Current turn: X';
  render();
};

render();
