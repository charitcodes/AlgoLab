
export function nQueensSteps(size = 4) {
  if (!Number.isInteger(size) || size < 1 || size > 10) {
    throw new Error("Board size must be between 1 and 10.");
  }

  const board = Array(size).fill(-1);
  const steps = [];

  function isSafe(row, col) {
    for (let previousRow = 0; previousRow < row; previousRow++) {
      const previousCol = board[previousRow];

      if (previousCol === col) return false;

      if (
        Math.abs(previousCol - col) ===
        Math.abs(previousRow - row)
      ) {
        return false;
      }
    }

    return true;
  }

  function snapshot(row, col, status, message) {
    steps.push({
      board: [...board],
      row,
      col,
      status,
      message,
    });
  }

  function solve(row) {
    if (row === size) {
      snapshot(
        size - 1,
        board[size - 1],
        "solution",
        `Solution found: all ${size} queens are safely placed.`
      );
      return true;
    }

    for (let col = 0; col < size; col++) {
      snapshot(
        row,
        col,
        "trying",
        `Trying row ${row + 1}, column ${col + 1}.`
      );

      if (isSafe(row, col)) {
        board[row] = col;

        snapshot(
          row,
          col,
          "placed",
          `Queen placed at row ${row + 1}, column ${col + 1}.`
        );

        if (solve(row + 1)) return true;

        board[row] = -1;

        snapshot(
          row,
          col,
          "backtrack",
          `Backtracking from row ${row + 1}, column ${col + 1}.`
        );
      } else {
        snapshot(
          row,
          col,
          "conflict",
          `Conflict detected at row ${row + 1}, column ${col + 1}.`
        );
      }
    }

    return false;
  }

  const solved = solve(0);

  if (!solved) {
    steps.push({
      board: [...board],
      row: -1,
      col: -1,
      status: "unsolved",
      message: `No solution exists for a ${size} × ${size} board.`,
    });
  }

  return steps;
}
