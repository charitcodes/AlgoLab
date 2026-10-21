
import { useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import {
  bfs,
  dfs,
  dijkstra,
  sampleDAG,
  sampleGraph,
  sampleTraversalGraph,
  topologicalSort,
} from "./algorithms/graph";
import "./GraphVisualizer.css";

const weightedPositions = {
  A: { x: 90, y: 130 },
  B: { x: 240, y: 55 },
  C: { x: 240, y: 205 },
  D: { x: 410, y: 55 },
  E: { x: 410, y: 205 },
};

const dagPositions = {
  A: { x: 70, y: 65 },
  B: { x: 70, y: 205 },
  C: { x: 210, y: 65 },
  D: { x: 210, y: 205 },
  E: { x: 350, y: 65 },
  F: { x: 430, y: 135 },
};

const weightedEdges = [
  ["A", "B", 4],
  ["A", "C", 2],
  ["B", "C", 1],
  ["B", "D", 5],
  ["C", "D", 8],
  ["C", "E", 10],
  ["D", "E", 2],
];

const dagEdges = [
  ["A", "C"],
  ["B", "C"],
  ["B", "D"],
  ["C", "E"],
  ["D", "F"],
  ["E", "F"],
];

export default function GraphVisualizer({ algorithm = "BFS", onBack }) {
  const [start, setStart] = useState("A");
  const [stepIndex, setStepIndex] = useState(0);
  const [runId, setRunId] = useState(0);

  const isTopo = algorithm === "Topological Sort";
  const isDijkstra = algorithm === "Dijkstra";
  const positions = isTopo ? dagPositions : weightedPositions;
  const nodes = Object.keys(positions);
  const edges = isTopo ? dagEdges : weightedEdges;

  const result = useMemo(() => {
    try {
      if (algorithm === "BFS") {
        return { steps: bfs(sampleTraversalGraph, start) };
      }

      if (algorithm === "DFS") {
        return { steps: dfs(sampleTraversalGraph, start) };
      }

      if (algorithm === "Dijkstra") {
        return dijkstra(sampleGraph, start);
      }

      if (algorithm === "Topological Sort") {
        return topologicalSort(sampleDAG);
      }

      return { steps: [] };
    } catch (error) {
      return { steps: [], error: error.message };
    }
  }, [algorithm, start, runId]);

  const steps = result.steps ?? [];
  const safeIndex = Math.min(stepIndex, Math.max(steps.length - 1, 0));
  const currentStep = steps[safeIndex];

  const visited = currentStep?.visited ??
    (isTopo ? currentStep?.order ?? [] : []);

  const activeNode = currentStep?.current;

  const traversal = isTopo
    ? currentStep?.order ?? []
    : visited;

  function reset() {
    setStepIndex(0);
    setRunId((value) => value + 1);
  }

  function changeStart(event) {
    setStart(event.target.value);
    setStepIndex(0);
  }

  return (
    <main className="graph-page">
      <header className="graph-header">
        <button className="graph-back" onClick={onBack}>
          ← Dashboard
        </button>

        <div>
          <p className="graph-eyebrow">ALGORITHM LAB / GRAPH THEORY</p>
          <h1>
            {algorithm} <span>Visualizer</span>
          </h1>
          <p className="graph-subtitle">
            Explore how the algorithm processes vertices step by step.
          </p>
        </div>
      </header>

      <section className="graph-toolbar">
        <label>
          Starting vertex
          <select value={start} onChange={changeStart}>
            {(isTopo ? ["A", "B", "C", "D", "E", "F"] : nodes).map(
              (node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              )
            )}
          </select>
        </label>

        <div className="graph-actions">
          <button onClick={reset}>↻ Reset</button>
          <button
            className="graph-primary"
            onClick={() =>
              setStepIndex((value) =>
                Math.min(value + 1, steps.length - 1)
              )
            }
            disabled={!steps.length || stepIndex >= steps.length - 1}
          >
            Next step →
          </button>
        </div>
      </section>

      <section className="graph-layout">
        <article className="graph-panel">
          <div className="graph-panel-heading">
            <div>
              <h2>Graph canvas</h2>
              <p>
                {isTopo
                  ? "Directed acyclic graph · 6 vertices"
                  : "Weighted sample graph · 5 vertices"}
              </p>
            </div>
            <span className="graph-live"><i /> Interactive</span>
          </div>

          <svg
            className="graph-canvas"
            viewBox={isTopo ? "0 0 500 270" : "0 0 500 270"}
            role="img"
            aria-label={`${algorithm} graph`}
          >
            <defs>
              <marker
                id="graph-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L0,6 L6,3 z" fill="#8175ad" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const [from, to, weight] = edge;
              const a = positions[from];
              const b = positions[to];

              if (!a || !b) return null;

              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const length = Math.sqrt(dx * dx + dy * dy) || 1;
              const radius = 24;

              const x1 = a.x + (dx / length) * radius;
              const y1 = a.y + (dy / length) * radius;
              const x2 = b.x - (dx / length) * (radius + (isTopo ? 8 : 0));
              const y2 = b.y - (dy / length) * (radius + (isTopo ? 8 : 0));

              const middleX = (a.x + b.x) / 2;
              const middleY = (a.y + b.y) / 2;

              return (
                <g key={`${from}-${to}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className="graph-edge"
                    markerEnd={isTopo ? "url(#graph-arrow)" : undefined}
                  />

                  {!isTopo && (
                    <text
                      x={middleX}
                      y={middleY - 8}
                      className="graph-weight"
                    >
                      {weight}
                    </text>
                  )}
                </g>
              );
            })}

            {nodes.map((node) => {
              const point = positions[node];

              const nodeClass =
                node === activeNode
                  ? "graph-node active"
                  : visited.includes(node)
                    ? "graph-node visited"
                    : "graph-node";

              return (
                <g key={node} className={nodeClass}>
                  <circle cx={point.x} cy={point.y} r="23" />
                  <text x={point.x} y={point.y + 5}>
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="graph-legend">
            <span><i className="legend-active" /> Current vertex</span>
            <span><i className="legend-visited" /> Visited vertex</span>
            <span><i className="legend-unvisited" /> Unvisited</span>
          </div>
        </article>

        <article className="graph-panel graph-status-panel">
          <p className="graph-eyebrow">EXECUTION STATUS</p>
          <h2>Algorithm trace</h2>

          <div className="graph-step-count">
            <span>Current step</span>
            <strong>
              {steps.length ? safeIndex + 1 : 0}
              <small> / {steps.length}</small>
            </strong>
          </div>

          <div className="graph-message">
            {result.error ??
              currentStep?.message ??
              "No execution steps available."}
          </div>

          {isDijkstra && (
            <div className="distance-list">
              <h3>Shortest distances from {start}</h3>

              {Object.entries(
                currentStep?.distances ?? result.distances ?? {}
              ).map(([node, distance]) => (
                <div className="distance-row" key={node}>
                  <span>Vertex {node}</span>
                  <strong>
                    {Number.isFinite(distance) ? distance : "∞"}
                  </strong>
                </div>
              ))}
            </div>
          )}

          <div className="traversal-box">
            <h3>
              {isDijkstra
                ? "Visited vertices"
                : isTopo
                  ? "Topological order so far"
                  : "Traversal order"}
            </h3>

            <div className="traversal-chips">
              {traversal.length ? (
                traversal.map((node, index) => (
                  <span key={`${node}-${index}`}>{node}</span>
                ))
              ) : (
                <small>No vertices visited yet</small>
              )}
            </div>
          </div>

          {isTopo && (
            <p className="graph-subtitle">
              A valid order places every vertex before its outgoing neighbours.
            </p>
          )}
        </article>
      </section>

      <section className="graph-complexity">
        <div>
          <span>Algorithm</span>
          <strong>{algorithm}</strong>
        </div>
        <div>
          <span>Vertices</span>
          <strong>{nodes.length}</strong>
        </div>
        <div>
          <span>Edges</span>
          <strong>{edges.length}</strong>
        </div>
        <div>
          <span>Progress</span>
          <strong>
            {steps.length
              ? Math.round(((safeIndex + 1) / steps.length) * 100)
              : 0}%
          </strong>
        </div>
      </section>
      <button
  className="floating-dashboard"
  onClick={onBack}
  title="Back to Dashboard"
>
  <LayoutDashboard size={19} />
  <span>Dashboard</span>
</button>
    </main>
  );
}
