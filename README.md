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
| 1 | Checkmate & stalemate detection, game-over banner | ⏳ |
| 2 | Special moves: castling, en passant, pawn promotion | ⏳ |
| 3 | Move history panel with algebraic notation + undo | ⏳ |
| 4 | Unit tests for move generation (perft) with Node's test runner + CI | ⏳ |
| 5 | Computer opponent: minimax with material evaluation | ⏳ |
| 6 | Stronger AI: alpha-beta pruning + piece-square tables | ⏳ |
| 7 | Polish: board flip, FEN/PGN import-export, captured pieces | ⏳ |

## Project layout

- `src/engine.js` — rules: board representation, move generation, check detection
- `src/ui.js` — rendering and click handling
- `style.css` — board styling
