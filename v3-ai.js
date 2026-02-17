const boardEl3 = document.getElementById('board');
const statusEl3 = document.getElementById('status');
const modeEl = document.getElementById('mode');
const undoBtn = document.getElementById('undo');

let board3 = Array(9).fill('');
let turn3 = 'X';
let end3 = false;
let moves = [];

const lines3 = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function whoWon(c) {
  const line = lines3.find((l) => l.every((i) => c[i] && c[i] === c[l[0]]));
  return line ? c[line[0]] : null;
}

function openSpots(cells) {
  return cells.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
}

function minimax(cells, player) {
  const winner = whoWon(cells);
  if (winner === 'O') return { score: 10 };
  if (winner === 'X') return { score: -10 };
  const avail = openSpots(cells);
  if (!avail.length) return { score: 0 };

  const plays = avail.map((idx) => {
    const next = cells.slice();
    next[idx] = player;
    const result = minimax(next, player === 'O' ? 'X' : 'O');
    return { idx, score: result.score };
  });

  return player === 'O'
    ? plays.reduce((best, p) => (p.score > best.score ? p : best))
    : plays.reduce((best, p) => (p.score < best.score ? p : best));
}

function render3() {
  boardEl3.innerHTML = '';
  board3.forEach((v, i) => {
    const b = document.createElement('button');
    b.className = 'cell';
    b.textContent = v;
    b.onclick = () => userMove(i);
    boardEl3.appendChild(b);
  });
}

function updateState() {
  const w = whoWon(board3);
  if (w) {
    end3 = true;
    statusEl3.textContent = `Winner: ${w}`;
    return true;
  }
  if (board3.every(Boolean)) {
    end3 = true;
    statusEl3.textContent = 'Draw game';
    return true;
  }
  return false;
}

function cpuMove() {
  if (end3) return;
  const mode = modeEl.value;
  const empties = openSpots(board3);
  if (!empties.length) return;

  const idx = mode === 'cpu-hard'
    ? minimax(board3, 'O').idx
    : empties[Math.floor(Math.random() * empties.length)];

  board3[idx] = 'O';
  moves.push(idx);
  if (!updateState()) {
    turn3 = 'X';
    statusEl3.textContent = 'Current turn: X';
  }
  render3();
}

function userMove(i) {
  if (board3[i] || end3) return;
  if (modeEl.value !== 'pvp' && turn3 === 'O') return;

  board3[i] = turn3;
  moves.push(i);
  if (updateState()) {
    render3();
    return;
  }

  turn3 = turn3 === 'X' ? 'O' : 'X';
  statusEl3.textContent = `Current turn: ${turn3}`;
  render3();

  if (modeEl.value !== 'pvp' && turn3 === 'O') {
    setTimeout(cpuMove, 200);
  }
}

function restart3() {
  board3 = Array(9).fill('');
  turn3 = 'X';
  end3 = false;
  moves = [];
  statusEl3.textContent = 'Current turn: X';
  render3();
}

document.getElementById('restart').onclick = restart3;
modeEl.onchange = restart3;
document.getElementById('theme').onclick = () => document.body.classList.toggle('dark');

undoBtn.onclick = () => {
  if (modeEl.value !== 'pvp' || !moves.length || end3) return;
  const last = moves.pop();
  board3[last] = '';
  turn3 = turn3 === 'X' ? 'O' : 'X';
  statusEl3.textContent = `Current turn: ${turn3}`;
  render3();
};

restart3();
