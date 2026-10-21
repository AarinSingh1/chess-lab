import { START_FEN, parseFen, legalMoves, makeMove, gameStatus, colorOf } from './engine.js';

const GLYPHS = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟',
};

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const bannerEl = document.getElementById('banner');
const bannerTextEl = document.getElementById('banner-text');
const bannerBtn = document.getElementById('banner-new');

let state = parseFen(START_FEN);
let selected = null;
let targets = [];
let status = gameStatus(state);

const sideName = (color) => (color === 'w' ? 'White' : 'Black');

function statusText() {
  if (status.result === 'checkmate') return `Checkmate — ${sideName(status.winner)} wins!`;
  if (status.result === 'stalemate') return 'Stalemate — draw.';
  return `${sideName(state.turn)} to move${status.check ? ' — check!' : ''}`;
}

function render() {
  boardEl.innerHTML = '';
  const checkedKing = status.check ? (state.turn === 'w' ? 'K' : 'k') : null;
  for (let sq = 0; sq < 64; sq++) {
    const cell = document.createElement('button');
    const dark = (Math.floor(sq / 8) + (sq % 8)) % 2 === 1;
    cell.className = 'square ' + (dark ? 'dark' : 'light');
    if (sq === selected) cell.classList.add('selected');
    if (targets.some((m) => m.to === sq)) cell.classList.add('target');
    const piece = state.board[sq];
    if (piece && piece === checkedKing) cell.classList.add('in-check');
    if (piece) {
      cell.textContent = GLYPHS[piece];
      cell.classList.add(colorOf(piece) === 'w' ? 'white-piece' : 'black-piece');
    }
    cell.addEventListener('click', () => onSquare(sq));
    boardEl.appendChild(cell);
  }
  statusEl.textContent = statusText();
  boardEl.classList.toggle('game-over', status.over);
  bannerEl.hidden = !status.over;
  if (status.over) bannerTextEl.textContent = statusText();
}

function onSquare(sq) {
  if (status.over) return;
  const move = targets.find((m) => m.to === sq);
  if (move) {
    state = makeMove(state, move);
    status = gameStatus(state);
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

function newGame() {
  state = parseFen(START_FEN);
  status = gameStatus(state);
  selected = null;
  targets = [];
  render();
}

resetBtn.addEventListener('click', newGame);
bannerBtn.addEventListener('click', newGame);

render();
