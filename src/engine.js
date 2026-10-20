// Core chess rules: board state, move generation, legality.
// Board is a 64-element array indexed 0 (a8) .. 63 (h1).
// Pieces are single chars: uppercase = white, lowercase = black, null = empty.

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w';

export const isWhite = (p) => p !== null && p === p.toUpperCase();
export const colorOf = (p) => (p === null ? null : isWhite(p) ? 'w' : 'b');
const rowOf = (sq) => Math.floor(sq / 8);
const colOf = (sq) => sq % 8;
const onBoard = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

export function squareName(sq) {
  return 'abcdefgh'[colOf(sq)] + (8 - rowOf(sq));
}

export function parseFen(fen) {
  const [placement, turn = 'w'] = fen.split(' ');
  const board = [];
  for (const ch of placement.replace(/\//g, '')) {
    if (/\d/.test(ch)) board.push(...Array(Number(ch)).fill(null));
    else board.push(ch);
  }
  return { board, turn };
}

const KNIGHT = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const KING = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const ROOK_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const BISHOP_DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

// Moves that follow piece movement rules, ignoring whether the king is left in check.
function pseudoMoves(board, from) {
  const piece = board[from];
  if (!piece) return [];
  const color = colorOf(piece);
  const r = rowOf(from);
  const c = colOf(from);
  const moves = [];

  const tryAdd = (tr, tc) => {
    if (!onBoard(tr, tc)) return false;
    const to = tr * 8 + tc;
    const target = board[to];
    if (target === null) {
      moves.push({ from, to });
      return true;
    }
    if (colorOf(target) !== color) moves.push({ from, to });
    return false;
  };

  const slide = (dirs) => {
    for (const [dr, dc] of dirs) {
      let tr = r + dr;
      let tc = c + dc;
      while (tryAdd(tr, tc)) {
        tr += dr;
        tc += dc;
      }
    }
  };

  switch (piece.toLowerCase()) {
    case 'p': {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      const one = (r + dir) * 8 + c;
      if (onBoard(r + dir, c) && board[one] === null) {
        moves.push({ from, to: one });
        const two = (r + 2 * dir) * 8 + c;
        if (r === startRow && board[two] === null) moves.push({ from, to: two });
      }
      for (const dc of [-1, 1]) {
        if (!onBoard(r + dir, c + dc)) continue;
        const to = (r + dir) * 8 + c + dc;
        if (board[to] !== null && colorOf(board[to]) !== color) moves.push({ from, to });
      }
      break;
    }
    case 'n':
      for (const [dr, dc] of KNIGHT) tryAdd(r + dr, c + dc);
      break;
    case 'b':
      slide(BISHOP_DIRS);
      break;
    case 'r':
      slide(ROOK_DIRS);
      break;
    case 'q':
      slide([...ROOK_DIRS, ...BISHOP_DIRS]);
      break;
    case 'k':
      for (const [dr, dc] of KING) tryAdd(r + dr, c + dc);
      break;
  }
  return moves;
}

export function isAttacked(board, sq, byColor) {
  for (let i = 0; i < 64; i++) {
    if (colorOf(board[i]) !== byColor) continue;
    if (pseudoMoves(board, i).some((m) => m.to === sq)) return true;
  }
  return false;
}

export function inCheck(board, color) {
  const king = board.findIndex((p) => p === (color === 'w' ? 'K' : 'k'));
  return king !== -1 && isAttacked(board, king, color === 'w' ? 'b' : 'w');
}

export function applyMove(board, move) {
  const next = board.slice();
  next[move.to] = next[move.from];
  next[move.from] = null;
  return next;
}

export function legalMoves(state, from) {
  const piece = state.board[from];
  if (!piece || colorOf(piece) !== state.turn) return [];
  return pseudoMoves(state.board, from).filter(
    (m) => !inCheck(applyMove(state.board, m), state.turn)
  );
}

export function makeMove(state, move) {
  return {
    board: applyMove(state.board, move),
    turn: state.turn === 'w' ? 'b' : 'w',
  };
}
