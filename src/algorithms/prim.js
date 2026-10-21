
export function primSteps(nodes, edges, startNode = nodes[0]) {
  const visited = new Set([startNode]);
  const selected = [];
  const steps = [];

  while (visited.size < nodes.length) {
    const candidates = edges
      .filter(
        (edge) =>
          (visited.has(edge.from) && !visited.has(edge.to)) ||
          (visited.has(edge.to) && !visited.has(edge.from))
      )
      .sort((a, b) => a.weight - b.weight);

    if (candidates.length === 0) break;

    const edge = candidates[0];
    selected.push(edge);

    const nextNode = visited.has(edge.from)
      ? edge.to
      : edge.from;

    visited.add(nextNode);

    steps.push({
      edge,
      selected: [...selected],
      visited: [...visited],
      totalWeight: selected.reduce(
        (sum, item) => sum + item.weight,
        0
      ),
      message: `Select edge ${edge.from}–${edge.to} (weight ${edge.weight}).`,
    });
  }

  return {
    steps,
    selected,
    totalWeight: selected.reduce(
      (sum, edge) => sum + edge.weight,
      0
    ),
  };
}

export const samplePrimNodes = ["A", "B", "C", "D", "E"];

export const samplePrimEdges = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "B", to: "C", weight: 1 },
  { from: "B", to: "D", weight: 5 },
  { from: "C", to: "D", weight: 8 },
  { from: "C", to: "E", weight: 10 },
  { from: "D", to: "E", weight: 2 },
];
