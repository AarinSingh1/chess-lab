import { START_FEN, parseFen, legalMoves, makeMove, inCheck, colorOf } from './engine.js';

const GLYPHS = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');

let state = parseFen(START_FEN);
let selected = null;
let targets = [];

function render() {
  boardEl.innerHTML = '';
  for (let sq = 0; sq < 64; sq++) {
    const cell = document.createElement('button');
    const dark = (Math.floor(sq / 8) + (sq % 8)) % 2 === 1;
    cell.className = 'square ' + (dark ? 'dark' : 'light');
    if (sq === selected) cell.classList.add('selected');
    if (targets.some((m) => m.to === sq)) cell.classList.add('target');
    const piece = state.board[sq];
    if (piece) {
      cell.textContent = GLYPHS[piece];
      cell.classList.add(colorOf(piece) === 'w' ? 'white-piece' : 'black-piece');
    }
    cell.addEventListener('click', () => onSquare(sq));
    boardEl.appendChild(cell);
  }
  const side = state.turn === 'w' ? 'White' : 'Black';
  statusEl.textContent = `${side} to move${inCheck(state.board, state.turn) ? ' — check!' : ''}`;
}

function onSquare(sq) {
  const move = targets.find((m) => m.to === sq);
  if (move) {
    state = makeMove(state, move);
    selected = null;
    targets = [];
  } else if (colorOf(state.board[sq]) === state.turn) {
    selected = sq;
    targets = legalMoves(state, sq);
  } else {
    selected = null;
    targets = [];
  }
  render();
}

resetBtn.addEventListener('click', () => {
  state = parseFen(START_FEN);
  selected = null;
  targets = [];
  render();
});

render();
