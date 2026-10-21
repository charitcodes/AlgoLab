
export function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const steps = [];

  while (queue.length) {
    const node = queue.shift();

    steps.push({
      current: node,
      visited: [...visited],
      queue: [...queue],
      message: `Visit vertex ${node}`,
    });

    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return steps;
}

export function dfs(graph, start) {
  const visited = new Set();
  const steps = [];

  function visit(node) {
    visited.add(node);

    steps.push({
      current: node,
      visited: [...visited],
      message: `Visit vertex ${node} using DFS`,
    });

    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visit(neighbor);
      }
    }
  }

  visit(start);
  return steps;
}

export function topologicalSort(graph) {
  const visited = new Set();
  const order = [];
  const steps = [];

  function visit(node) {
    visited.add(node);

    for (const neighbor of graph[node] ?? []) {
      if (!visited.has(neighbor)) {
        visit(neighbor);
      }
    }

    order.push(node);
    steps.push({
      current: node,
      order: [...order].reverse(),
      message: `Vertex ${node} added to the finishing order`,
    });
  }

  for (const node of Object.keys(graph)) {
    if (!visited.has(node)) visit(node);
  }

  return {
    order: order.reverse(),
    steps,
  };
}

export function dijkstra(graph, start) {
  const nodes = Object.keys(graph);
  const distances = Object.fromEntries(
    nodes.map((node) => [node, Infinity])
  );
  const visited = new Set();
  const steps = [];

  distances[start] = 0;

  while (visited.size < nodes.length) {
    let current = null;

    for (const node of nodes) {
      if (
        !visited.has(node) &&
        (current === null || distances[node] < distances[current])
      ) {
        current = node;
      }
    }

    if (current === null || distances[current] === Infinity) break;

    visited.add(current);

    steps.push({
      current,
      distances: { ...distances },
      visited: [...visited],
      message: `Process vertex ${current}, distance ${distances[current]}`,
    });

    for (const [neighbor, weight] of Object.entries(graph[current] ?? {})) {
      if (weight < 0) {
        throw new Error("Dijkstra requires non-negative edge weights.");
      }

      const candidate = distances[current] + weight;

      if (candidate < distances[neighbor]) {
        distances[neighbor] = candidate;

        steps.push({
          current,
          neighbor,
          distances: { ...distances },
          visited: [...visited],
          message: `Update distance to ${neighbor}: ${candidate}`,
        });
      }
    }
  }

  return { distances, steps };
}

export const sampleGraph = {
  A: { B: 4, C: 2 },
  B: { A: 4, C: 1, D: 5 },
  C: { A: 2, B: 1, D: 8, E: 10 },
  D: { B: 5, C: 8, E: 2 },
  E: { C: 10, D: 2 },
};

export const sampleDAG = {
  A: ["C"],
  B: ["C", "D"],
  C: ["E"],
  D: ["F"],
  E: ["F"],
  F: [],
};


export const sampleTraversalGraph = {
  A: ["B", "C"],
  B: ["A", "C", "D"],
  C: ["A", "B", "D", "E"],
  D: ["B", "C", "E"],
  E: ["C", "D"],
};
