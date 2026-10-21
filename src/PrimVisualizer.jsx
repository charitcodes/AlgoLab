
import { useMemo, useState } from "react";
import { ArrowLeft, LayoutDashboard, Play, RotateCcw } from "lucide-react";
import {
  primSteps,
  samplePrimNodes,
  samplePrimEdges,
} from "./algorithms/prim";
import "./PrimVisualizer.css";

const positions = {
  A: { x: 100, y: 100 },
  B: { x: 300, y: 55 },
  C: { x: 200, y: 200 },
  D: { x: 400, y: 200 },
  E: { x: 500, y: 100 },
};

export default function PrimVisualizer({ onBack }) {
  const result = useMemo(
    () => primSteps(samplePrimNodes, samplePrimEdges, "A"),
    []
  );

  const [stepIndex, setStepIndex] = useState(0);
  const current = result.steps[stepIndex];
  const selected = current?.selected ?? [];
  const visited = current?.visited ?? ["A"];
  const totalWeight = current?.totalWeight ?? 0;
  const finished = stepIndex === result.steps.length - 1;

  function reset() {
    setStepIndex(0);
  }

  return (
    <main className="prim-page">
      <header className="prim-header">
        <button className="prim-back" onClick={onBack}>
          <ArrowLeft size={17} /> Dashboard
        </button>
        <span className="prim-tag">AOA LAB · MST</span>
      </header>

      <section className="prim-heading">
        <p className="prim-eyebrow">GREEDY ALGORITHM</p>
        <h1>Prim’s Algorithm</h1>
        <p>
          Build a Minimum Spanning Tree by repeatedly choosing the
          lowest-weight edge connected to the visited vertices.
        </p>
      </section>

      <section className="prim-layout">
        <div className="prim-graph-card">
          <div className="prim-card-heading">
            <div>
              <h2>Graph Visualization</h2>
              <p>Starting vertex: A</p>
            </div>
            <span className="prim-counter">
              {stepIndex + 1} / {result.steps.length}
            </span>
          </div>

          <svg viewBox="0 0 600 270" className="prim-svg">
            {samplePrimEdges.map((edge) => {
              const a = positions[edge.from];
              const b = positions[edge.to];
              const isSelected = selected.some(
                (item) =>
                  item.from === edge.from && item.to === edge.to
              );

              return (
                <g key={`${edge.from}-${edge.to}`}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={
                      isSelected ? "prim-edge selected" : "prim-edge"
                    }
                  />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 9}
                    className="prim-weight"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {samplePrimNodes.map((node) => {
              const p = positions[node];
              const isVisited = visited.includes(node);

              return (
                <g key={node}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="23"
                    className={
                      isVisited ? "prim-node visited" : "prim-node"
                    }
                  />
                  <text
                    x={p.x}
                    y={p.y + 5}
                    textAnchor="middle"
                    className="prim-node-label"
                  >
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="prim-legend">
            <span><i className="prim-dot active" /> MST edge</span>
            <span><i className="prim-dot" /> Unselected edge</span>
          </div>
        </div>

        <aside className="prim-info-card">
          <p className="prim-eyebrow">CURRENT PROGRESS</p>
          <h2>{finished ? "MST Completed!" : "Growing the MST"}</h2>
          <p className="prim-message">
            {current?.message ??
              "Start from vertex A and find the minimum connecting edge."}
          </p>

          <div className="prim-stat">
            <span>Selected edges</span>
            <strong>{selected.length} / {samplePrimNodes.length - 1}</strong>
          </div>
          <div className="prim-stat">
            <span>Visited vertices</span>
            <strong>{visited.length} / {samplePrimNodes.length}</strong>
          </div>
          <div className="prim-total">
            <span>Total MST Weight</span>
            <strong>{totalWeight}</strong>
          </div>

          <div className="prim-actions">
            <button
              onClick={() =>
                setStepIndex((i) => Math.min(i + 1, result.steps.length - 1))
              }
              disabled={finished}
            >
              <Play size={16} /> Next Step
            </button>
            <button className="prim-reset" onClick={reset}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <button className="prim-dashboard" onClick={onBack}>
            <LayoutDashboard size={16} /> Back to Dashboard
          </button>
        </aside>
      </section>

      <section className="prim-complexity">
        <div><span>Time Complexity</span><strong>O(E log V)</strong></div>
        <div><span>Space Complexity</span><strong>O(V + E)</strong></div>
        <div><span>Technique</span><strong>Greedy</strong></div>
      </section>
    </main>
  );
}
