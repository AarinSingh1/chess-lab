# Chess Lab ♟️

A browser chess game built from scratch in vanilla JavaScript — no libraries, no build step. Each day adds a new feature, delivered as a pull request.

## Run it

Serve the folder with any static server (ES modules don't load from `file://`):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Roadmap

| Day | Feature | Status |
|-----|---------|--------|
| 0 | Board, piece movement, legal-move filtering, check indicator | ✅ |
| 1 | Checkmate & stalemate detection, game-over banner | ✅ |
| 2 | Special moves: castling, en passant, pawn promotion | ⏳ |
| 3 | Move history panel with algebraic notation + undo | ⏳ |
| 4 | Unit tests for move generation (perft) with Node's test runner + CI | ⏳ |
| 5 | Computer opponent: minimax with material evaluation | ⏳ |
| 6 | Stronger AI: alpha-beta pruning + piece-square tables | ⏳ |
| 7 | Polish: board flip, FEN/PGN import-export, captured pieces | ⏳ |

## How a game ends

After every move the engine checks whether the side to move has any legal moves left:

- **Checkmate** — no legal moves and the king is in check. The banner announces the winner.
- **Stalemate** — no legal moves and the king is *not* in check. The game is a draw.

The king's square glows red while it's in check. Once the game is over the board is locked; click **Play again** (or **New game**) to start over.

## Project layout

- `src/engine.js` — rules: board representation, move generation, check/checkmate/stalemate detection (`gameStatus`)
- `src/ui.js` — rendering and click handling
- `style.css` — board styling
