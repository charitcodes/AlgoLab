
export function knapsackSteps(weights, values, capacity) {
  const n = weights.length;

  if (n !== values.length) {
    throw new Error("Weights and values must have the same length.");
  }

  if (
    !Number.isInteger(capacity) ||
    capacity < 0 ||
    weights.some((w) => !Number.isInteger(w) || w < 0) ||
    values.some((v) => !Number.isInteger(v) || v < 0)
  ) {
    throw new Error("Use non-negative integer weights, values and capacity.");
  }

  const dp = Array.from(
    { length: n + 1 },
    () => Array(capacity + 1).fill(0)
  );

  const steps = [{
    item: 0,
    dp: dp.map((row) => [...row]),
    message: "Initialize the DP table with zeros.",
  }];

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          values[i - 1] + dp[i - 1][w - weights[i - 1]],
          dp[i - 1][w]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }

    steps.push({
      item: i,
      dp: dp.map((row) => [...row]),
      message: `Processed item ${i}: weight ${weights[i - 1]}, value ${values[i - 1]}.`,
    });
  }

  return {
    steps,
    maxValue: dp[n][capacity],
  };
}

export const sampleWeights = [2, 3, 4, 5];
export const sampleValues = [3, 4, 5, 6];
export const sampleCapacity = 5;
