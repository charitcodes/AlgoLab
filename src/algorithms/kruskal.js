
export function kruskalSteps(nodes, edges) {
  const parent = Object.fromEntries(nodes.map((node) => [node, node]));
  const rank = Object.fromEntries(nodes.map((node) => [node, 0]));
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
  const selected = [];
  const steps = [];

  function find(node) {
    if (parent[node] !== node) {
      parent[node] = find(parent[node]);
    }
    return parent[node];
  }

  function union(a, b) {
    let rootA = find(a);
    let rootB = find(b);

    if (rootA === rootB) return false;

    if (rank[rootA] < rank[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }

    parent[rootB] = rootA;

    if (rank[rootA] === rank[rootB]) {
      rank[rootA]++;
    }

    return true;
  }

  for (const edge of sortedEdges) {
    const accepted = union(edge.from, edge.to);

    if (accepted) {
      selected.push(edge);
    }

    steps.push({
      edge,
      accepted,
      selected: [...selected],
      totalWeight: selected.reduce((sum, item) => sum + item.weight, 0),
      message: accepted
        ? `Accept edge ${edge.from}–${edge.to} (weight ${edge.weight}).`
        : `Reject edge ${edge.from}–${edge.to}: it would create a cycle.`,
    });

    if (selected.length === nodes.length - 1) break;
  }

  return { steps, selected, totalWeight: selected.reduce((sum, edge) => sum + edge.weight, 0) };
}

export const sampleKruskalNodes = ["A", "B", "C", "D", "E"];

export const sampleKruskalEdges = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "C", weight: 2 },
  { from: "B", to: "C", weight: 1 },
  { from: "B", to: "D", weight: 5 },
  { from: "C", to: "D", weight: 8 },
  { from: "C", to: "E", weight: 10 },
  { from: "D", to: "E", weight: 2 },
];
