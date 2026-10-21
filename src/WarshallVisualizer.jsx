
import { useMemo, useState } from "react";
import { LayoutDashboard, RotateCcw, ChevronRight } from "lucide-react";
import {
  warshallSteps,
  sampleAdjacencyMatrix,
} from "./algorithms/warshall";
import "./WarshallVisualizer.css";

export default function WarshallVisualizer({ onBack }) {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(
    () => warshallSteps(sampleAdjacencyMatrix),
    []
  );

  const current = steps[stepIndex];

  function reset() {
    setStepIndex(0);
  }

  return (
    <main className="warshall-page">
      <header className="warshall-header">
        <button className="warshall-back" onClick={onBack}>
          ← Dashboard
        </button>
        <div>
          <p className="graph-eyebrow">AOA LAB / EXPERIMENT 03b</p>
          <h1>Warshall's <span>Algorithm</span></h1>
          <p className="graph-subtitle">
            Explore transitive closure using reachability matrices.
          </p>
        </div>
      </header>

      <section className="warshall-toolbar">
        <div>
          <span className="warshall-label">INTERMEDIATE VERTEX</span>
          <h2>
            {current.k < 0
              ? "Initial matrix"
              : `Vertex ${current.k + 1}`}
          </h2>
        </div>
        <div className="graph-actions">
          <button onClick={reset}>
            <RotateCcw size={15} /> Reset
          </button>
          <button
            className="graph-primary"
            onClick={() =>
              setStepIndex((value) =>
                Math.min(value + 1, steps.length - 1)
              )
            }
            disabled={stepIndex === steps.length - 1}
          >
            Next step <ChevronRight size={16} />
          </button>
        </div>
      </section>

      <section className="warshall-layout">
        <article className="graph-panel warshall-matrix-panel">
          <div className="graph-panel-heading">
            <div>
              <h2>Reachability matrix</h2>
              <p>Rows represent source vertices; columns represent destinations.</p>
            </div>
            <span className="graph-live"><i /> Live trace</span>
          </div>

          <div className="warshall-matrix-wrap">
            <table className="warshall-matrix">
              <thead>
                <tr>
                  <th>i \ j</th>
                  {current.matrix.map((_, j) => (
                    <th key={j}>V{j + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.matrix.map((row, i) => (
                  <tr key={i}>
                    <th>V{i + 1}</th>
                    {row.map((value, j) => (
                      <td key={j}>
                        <span className={value ? "matrix-one" : "matrix-zero"}>
                          {value}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="warshall-legend">
            <span><i className="matrix-legend-one" /> Path exists (1)</span>
            <span><i className="matrix-legend-zero" /> No path (0)</span>
          </div>
        </article>

        <article className="graph-panel warshall-status">
          <p className="graph-eyebrow">EXECUTION STATUS</p>
          <h2>Algorithm trace</h2>

          <div className="graph-step-count">
            <span>Current step</span>
            <strong>{stepIndex + 1}<small> / {steps.length}</small></strong>
          </div>

          <div className="graph-message">{current.message}</div>

          <div className="traversal-box">
            <h3>Intermediate vertex</h3>
            <div className="traversal-chips">
              <span>{current.k < 0 ? "Initial" : `V${current.k + 1}`}</span>
            </div>
          </div>

          <div className="warshall-formula">
            <span>WARSHALL UPDATE RULE</span>
            <strong>R[i][j] = R[i][j] OR (R[i][k] AND R[k][j])</strong>
          </div>

          {stepIndex === steps.length - 1 && (
            <p className="warshall-complete">
              ✓ Transitive closure calculated.
            </p>
          )}
        </article>
      </section>

      <section className="graph-complexity">
        <div><span>Algorithm</span><strong>Warshall</strong></div>
        <div><span>Vertices</span><strong>{current.matrix.length}</strong></div>
        <div><span>Time complexity</span><strong>O(V³)</strong></div>
        <div>
          <span>Progress</span>
          <strong>{Math.round((stepIndex / (steps.length - 1)) * 100)}%</strong>
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
