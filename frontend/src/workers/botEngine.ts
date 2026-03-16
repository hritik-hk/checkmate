import { Chess } from 'chess.js';

// ---------- Material Weights (centipawns) ----------
const weights: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

// ---------- Piece-Square Tables (white's perspective, index 0 = a8) ----------
// For white:  pst[row * 8 + col]
// For black:  pst[(row * 8 + col) ^ 56]  (mirrors the board vertically)

const pawnPST: number[] = [
   0,  0,  0,  0,  0,  0,  0,  0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
   5,  5, 10, 25, 25, 10,  5,  5,
   0,  0,  0, 20, 20,  0,  0,  0,
   5, -5,-10,  0,  0,-10, -5,  5,
   5, 10, 10,-20,-20, 10, 10,  5,
   0,  0,  0,  0,  0,  0,  0,  0,
];

const knightPST: number[] = [
  -50,-40,-30,-30,-30,-30,-40,-50,
  -40,-20,  0,  0,  0,  0,-20,-40,
  -30,  0, 10, 15, 15, 10,  0,-30,
  -30,  5, 15, 20, 20, 15,  5,-30,
  -30,  0, 15, 20, 20, 15,  0,-30,
  -30,  5, 10, 15, 15, 10,  5,-30,
  -40,-20,  0,  5,  5,  0,-20,-40,
  -50,-40,-30,-30,-30,-30,-40,-50,
];

const bishopPST: number[] = [
  -20,-10,-10,-10,-10,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5, 10, 10,  5,  0,-10,
  -10,  5,  5, 10, 10,  5,  5,-10,
  -10,  0, 10, 10, 10, 10,  0,-10,
  -10, 10, 10, 10, 10, 10, 10,-10,
  -10,  5,  0,  0,  0,  0,  5,-10,
  -20,-10,-10,-10,-10,-10,-10,-20,
];

const rookPST: number[] = [
   0,  0,  0,  0,  0,  0,  0,  0,
   5, 10, 10, 10, 10, 10, 10,  5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
  -5,  0,  0,  0,  0,  0,  0, -5,
   0,  0,  0,  5,  5,  0,  0,  0,
];

const queenPST: number[] = [
  -20,-10,-10, -5, -5,-10,-10,-20,
  -10,  0,  0,  0,  0,  0,  0,-10,
  -10,  0,  5,  5,  5,  5,  0,-10,
   -5,  0,  5,  5,  5,  5,  0, -5,
    0,  0,  5,  5,  5,  5,  0, -5,
  -10,  5,  5,  5,  5,  5,  0,-10,
  -10,  0,  5,  0,  0,  0,  0,-10,
  -20,-10,-10, -5, -5,-10,-10,-20,
];

// King stays tucked in middlegame, marches to center in endgame
const kingMiddlePST: number[] = [
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -30,-40,-40,-50,-50,-40,-40,-30,
  -20,-30,-30,-40,-40,-30,-30,-20,
  -10,-20,-20,-20,-20,-20,-20,-10,
   20, 20,  0,  0,  0,  0, 20, 20,
   20, 30, 10,  0,  0, 10, 30, 20,
];

const kingEndgamePST: number[] = [
  -50,-40,-30,-20,-20,-30,-40,-50,
  -30,-20,-10,  0,  0,-10,-20,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 30, 40, 40, 30,-10,-30,
  -30,-10, 20, 30, 30, 20,-10,-30,
  -30,-30,  0,  0,  0,  0,-30,-30,
  -50,-30,-30,-30,-30,-30,-30,-50,
];

const pstMap: Record<string, number[]> = {
  p: pawnPST,
  n: knightPST,
  b: bishopPST,
  r: rookPST,
  q: queenPST,
};

// ---------- Endgame Detection ----------
// Endgame when total non-king material falls below threshold
function isEndgame(board: ReturnType<Chess['board']>): boolean {
  let material = 0;
  for (const row of board)
    for (const piece of row)
      if (piece && piece.type !== 'k')
        material += weights[piece.type];
  return material <= 1300;
}

// ---------- Evaluation ----------
function evaluate(game: Chess): number {
  const board = game.board();
  const endgame = isEndgame(board);
  let totalEvaluation = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (!piece) continue;

      const sq = row * 8 + col;
      // Mirror square vertically for black using XOR 56
      const pstIdx = piece.color === 'w' ? sq : sq ^ 56;

      let pst: number[];
      if (piece.type === 'k') {
        pst = endgame ? kingEndgamePST : kingMiddlePST;
      } else {
        pst = pstMap[piece.type];
      }

      const score = weights[piece.type] + pst[pstIdx];
      totalEvaluation += piece.color === 'w' ? score : -score;
    }
  }

  return totalEvaluation;
}

// ---------- Minimax ----------
function minimax(
  game: Chess,
  depth: number,
  isMaximizingPlayer: boolean,
  alpha: number,
  beta: number
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluate(game);
  }

  const moves = game.moves({ verbose: true });

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, false, alpha, beta);
      game.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // β-cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, true, alpha, beta);
      game.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // α-cutoff
    }
    return minEval;
  }
}

// ---------- Worker message handler ----------
self.onmessage = (event: MessageEvent<{ fen: string; depth: number }>) => {
  const { fen, depth } = event.data;

  const game = new Chess(fen);
  const moves = game.moves({ verbose: true });

  let bestMove = null;
  let bestEval = Infinity; // black is minimizing

  for (const move of moves) {
    game.move(move);
    const evaluation = minimax(game, depth - 1, true, -Infinity, Infinity);
    game.undo();

    if (evaluation <= bestEval) {
      bestEval = evaluation;
      bestMove = move;
    }
  }

  self.postMessage({ bestMove });
};
