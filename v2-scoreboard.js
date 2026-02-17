const boardEl2 = document.getElementById('board');
const statusEl2 = document.getElementById('status');
const xscoreEl = document.getElementById('xscore');
const oscoreEl = document.getElementById('oscore');
const dscoreEl = document.getElementById('dscore');
const historyEl = document.getElementById('history');

let board2 = Array(9).fill('');
let turn2 = 'X';
let ended2 = false;
let round = 1;
let scores = { X: 0, O: 0, D: 0 };

const wins2 = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function winner2(cells) {
  const line = wins2.find((l) => l.every((i) => cells[i] && cells[i] === cells[l[0]]));
  return line ? cells[line[0]] : null;
}

function syncScore() {
  xscoreEl.textContent = String(scores.X);
  oscoreEl.textContent = String(scores.O);
  dscoreEl.textContent = String(scores.D);
}

function drawBoard2() {
  boardEl2.innerHTML = '';
  board2.forEach((value, i) => {
    const b = document.createElement('button');
    b.className = 'cell';
    b.textContent = value;
    b.onclick = () => click2(i);
    boardEl2.appendChild(b);
  });
}

function finalize(result) {
  ended2 = true;
  if (result === 'D') {
    scores.D += 1;
    statusEl2.textContent = 'Round result: Draw';
    historyEl.insertAdjacentHTML('afterbegin', `<li>Round ${round}: Draw</li>`);
  } else {
    scores[result] += 1;
    statusEl2.textContent = `Round result: ${result} wins`;
    historyEl.insertAdjacentHTML('afterbegin', `<li>Round ${round}: ${result} wins</li>`);
  }
  syncScore();
}

function click2(i) {
  if (board2[i] || ended2) return;
  board2[i] = turn2;
  const w = winner2(board2);
  if (w) {
    finalize(w);
  } else if (board2.every(Boolean)) {
    finalize('D');
  } else {
    turn2 = turn2 === 'X' ? 'O' : 'X';
    statusEl2.textContent = `Current turn: ${turn2}`;
  }
  drawBoard2();
}

function nextRound() {
  board2 = Array(9).fill('');
  turn2 = 'X';
  ended2 = false;
  round += 1;
  statusEl2.textContent = 'Current turn: X';
  drawBoard2();
}

document.getElementById('next').onclick = nextRound;
document.getElementById('clear').onclick = () => {
  scores = { X: 0, O: 0, D: 0 };
  historyEl.innerHTML = '';
  round = 0;
  syncScore();
  nextRound();
};

syncScore();
drawBoard2();
