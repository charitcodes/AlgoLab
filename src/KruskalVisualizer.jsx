
import { useMemo, useState } from "react";
import { LayoutDashboard, RotateCcw, ChevronRight } from "lucide-react";
import {
  kruskalSteps,
  sampleKruskalNodes,
  sampleKruskalEdges,
} from "./algorithms/kruskal";
import "./KruskalVisualizer.css";

const positions = {
  A: { x: 65, y: 130 },
  B: { x: 220, y: 55 },
  C: { x: 220, y: 205 },
  D: { x: 405, y: 55 },
  E: { x: 405, y: 205 },
};

export default function KruskalVisualizer({ onBack }) {
  const [stepIndex, setStepIndex] = useState(0);

  const result = useMemo(
    () => kruskalSteps(sampleKruskalNodes, sampleKruskalEdges),
    []
  );

  const current = result.steps[stepIndex];
  const selected = current?.selected ?? [];
  const selectedKeys = new Set(
    selected.map((edge) => `${edge.from}-${edge.to}`)
  );

  const selectedWeight = selected.reduce(
    (sum, edge) => sum + edge.weight,
    0
  );

  function reset() {
    setStepIndex(0);
  }

  return (
    <main className="kruskal-page">
      <header className="graph-header">
        <button className="graph-back" onClick={onBack}>
          ← Dashboard
        </button>
        <div>
          <p className="graph-eyebrow">AOA LAB / EXPERIMENT 06</p>
          <h1>Kruskal's <span>Algorithm</span></h1>
          <p className="graph-subtitle">
            Build a minimum spanning tree by selecting the lowest-weight edges.
          </p>
        </div>
      </header>

      <section className="kruskal-summary">
        <div><span>VERTICES</span><strong>{sampleKruskalNodes.length}</strong></div>
        <div><span>EDGES CHECKED</span><strong>{stepIndex + 1} / {result.steps.length}</strong></div>
        <div><span>MST TOTAL WEIGHT</span><strong>{selectedWeight}</strong></div>
      </section>

      <section className="graph-layout">
        <article className="graph-panel">
          <div className="graph-panel-heading">
            <div>
              <h2>Minimum spanning tree</h2>
              <p>Green edges belong to the current MST.</p>
            </div>
            <span className="graph-live"><i /> Live trace</span>
          </div>

          <svg className="graph-canvas" viewBox="0 0 480 270" role="img" aria-label="Kruskal graph">
            {sampleKruskalEdges.map((edge) => {
              const a = positions[edge.from];
              const b = positions[edge.to];
              const key = `${edge.from}-${edge.to}`;
              const accepted = selectedKeys.has(key);
              const active =
                current?.edge.from === edge.from &&
                current?.edge.to === edge.to;

              return (
                <g key={key}>
                  <line
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    className={`kruskal-edge ${accepted ? "mst-edge" : ""} ${active ? "active-edge" : ""}`}
                  />
                  <text
                    x={(a.x + b.x) / 2}
                    y={(a.y + b.y) / 2 - 9}
                    className="graph-weight"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {sampleKruskalNodes.map((node) => {
              const point = positions[node];
              return (
                <g className="graph-node" key={node}>
                  <circle cx={point.x} cy={point.y} r="23" />
                  <text x={point.x} y={point.y + 5}>{node}</text>
                </g>
              );
            })}
          </svg>

          <div className="graph-legend">
            <span><i className="kruskal-legend-mst" /> Selected MST edge</span>
            <span><i className="kruskal-legend-normal" /> Other edge</span>
          </div>
        </article>

        <article className="graph-panel">
          <p className="graph-eyebrow">EXECUTION STATUS</p>
          <h2>Algorithm trace</h2>

          <div className="graph-step-count">
            <span>Current step</span>
            <strong>{stepIndex + 1}<small> / {result.steps.length}</small></strong>
          </div>

          <div className="graph-message">
            {current?.message ?? "All edges processed."}
          </div>

          <div className="traversal-box">
            <h3>Selected MST edges</h3>
            <div className="kruskal-selected-list">
              {selected.length ? selected.map((edge) => (
                <div key={`${edge.from}-${edge.to}`}>
                  <span>{edge.from} — {edge.to}</span>
                  <strong>{edge.weight}</strong>
                </div>
              )) : <small>No edges selected yet.</small>}
            </div>
          </div>

          <div className="kruskal-total">
            <span>Current total weight</span>
            <strong>{selectedWeight}</strong>
          </div>

          <div className="graph-actions kruskal-actions">
            <button onClick={reset}><RotateCcw size={15} /> Reset</button>
            <button
              className="graph-primary"
              onClick={() => setStepIndex((value) => Math.min(value + 1, result.steps.length - 1))}
              disabled={stepIndex >= result.steps.length - 1}
            >
              Next step <ChevronRight size={16} />
            </button>
          </div>
        </article>
      </section>

      <section className="graph-complexity">
        <div><span>Algorithm</span><strong>Kruskal's MST</strong></div>
        <div><span>Time complexity</span><strong>O(E log E)</strong></div>
        <div><span>MST edges</span><strong>{selected.length}</strong></div>
        <div><span>Final weight</span><strong>{stepIndex === result.steps.length - 1 ? result.totalWeight : "—"}</strong></div>
      </section>

      <button className="floating-dashboard" onClick={onBack} title="Back to Dashboard">
        <LayoutDashboard size={19} />
        <span>Dashboard</span>
      </button>
    </main>
  );
}
