
export function warshallSteps(inputMatrix) {
  const n = inputMatrix.length;
  const reach = inputMatrix.map((row) => [...row]);
  const steps = [];

  steps.push({
    k: -1,
    matrix: reach.map((row) => [...row]),
    message: "Initial adjacency matrix",
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        reach[i][j] =
          reach[i][j] || (reach[i][k] && reach[k][j]) ? 1 : 0;
      }
    }

    steps.push({
      k,
      matrix: reach.map((row) => [...row]),
      message: `Using vertex ${k + 1} as an intermediate vertex`,
    });
  }

  return steps;
}

export const sampleAdjacencyMatrix = [
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
  [0, 0, 0, 0],
];
