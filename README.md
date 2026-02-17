# Tic-Tac-Toe Samples (Multiple Versions)

This repository contains **three progressively enhanced Tic-Tac-Toe versions** so you can compare features and complexity.

## Versions

1. **v1-basic**
   - Local two-player game (X vs O)
   - Win and draw detection
   - Restart button

2. **v2-enhanced**
   - Everything from v1
   - Scoreboard (tracks X wins, O wins, draws)
   - Undo last move
   - Active-player indicator

3. **v3-ai**
   - Human (X) vs Computer (O)
   - Computer uses minimax for optimal play
   - Difficulty mode toggle (Easy / Hard)
   - Theme switch (light/dark)

## Run locally

You can open each `index.html` file directly, or run a small static server from repository root:

```bash
python3 -m http.server 8000
```

Then open:
- `http://localhost:8000/versions/v1-basic/`
- `http://localhost:8000/versions/v2-enhanced/`
- `http://localhost:8000/versions/v3-ai/`
