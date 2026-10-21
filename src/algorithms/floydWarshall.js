
export function floydWarshallSteps(inputMatrix) {
  const n = inputMatrix.length;
  const dist = inputMatrix.map((row) => [...row]);
  const steps = [
    {
      k: -1,
      matrix: dist.map((row) => [...row]),
      message: "Initial distance matrix.",
    },
  ];

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (
          dist[i][k] !== Infinity &&
          dist[k][j] !== Infinity &&
          dist[i][k] + dist[k][j] < dist[i][j]
        ) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }

    steps.push({
      k,
      matrix: dist.map((row) => [...row]),
      message: `Using vertex ${k + 1} as an intermediate vertex.`,
    });
  }

  return steps;
}

export const sampleDistanceMatrix = [
  [0, 5, Infinity, 10],
  [Infinity, 0, 3, Infinity],
  [Infinity, Infinity, 0, 1],
  [Infinity, Infinity, Infinity, 0],
];
