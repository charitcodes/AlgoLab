
import { useState } from "react";
import { ArrowLeft, LayoutDashboard, RotateCcw, Play } from "lucide-react";
import {
  floydWarshallSteps,
  sampleDistanceMatrix,
} from "./algorithms/floydWarshall";
import "./FloydWarshallVisualizer.css";

const labels = ["A", "B", "C", "D"];

export default function FloydWarshallVisualizer({ onBack }) {
  const steps = floydWarshallSteps(sampleDistanceMatrix);
  const [stepIndex, setStepIndex] = useState(0);
  const current = steps[stepIndex];
  const finished = stepIndex === steps.length - 1;

  function formatDistance(value) {
    return value === Infinity ? "∞" : value;
  }

  return (
    <main className="fw-page">
      <header className="fw-header">
        <button className="fw-back" onClick={onBack}>
          <ArrowLeft size={17} /> Dashboard
        </button>
        <span className="fw-tag">AOA LAB · SHORTEST PATH</span>
      </header>

      <section className="fw-heading">
        <p className="fw-eyebrow">DYNAMIC PROGRAMMING</p>
        <h1>Floyd–Warshall Algorithm</h1>
        <p>
          Find shortest distances between every pair of vertices by
          allowing intermediate vertices one at a time.
        </p>
      </section>

      <section className="fw-layout">
        <div className="fw-card">
          <div className="fw-card-top">
            <div>
              <h2>Distance Matrix</h2>
              <p>{current.message}</p>
            </div>
            <span className="fw-counter">
              Step {stepIndex + 1} / {steps.length}
            </span>
          </div>

          <div className="fw-table-wrap">
            <table className="fw-table">
              <thead>
                <tr>
                  <th>From \ To</th>
                  {labels.map((label) => (
                    <th key={label}>{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {current.matrix.map((row, i) => (
                  <tr key={labels[i]}>
                    <th>{labels[i]}</th>
                    {row.map((value, j) => (
                      <td
                        key={`${i}-${j}`}
                        className={
                          i === j
                            ? "fw-diagonal"
                            : value !== Infinity
                              ? "fw-reachable"
                              : ""
                        }
                      >
                        {formatDistance(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="fw-note">
            {current.k === -1
              ? "Starting matrix: direct edge weights are shown."
              : `Intermediate vertex: ${labels[current.k]}. Shorter routes are updated when found.`}
          </div>
        </div>

        <aside className="fw-card fw-side">
          <p className="fw-eyebrow">ALGORITHM PROGRESS</p>
          <h2>{finished ? "All Pairs Completed!" : "Relaxing Paths"}</h2>
          <p className="fw-description">
            {finished
              ? "The matrix now contains the shortest distances between all reachable vertex pairs."
              : "Move forward to consider the next intermediate vertex."}
          </p>

          <div className="fw-stat">
            <span>Intermediate vertex</span>
            <strong>
              {current.k === -1 ? "None" : labels[current.k]}
            </strong>
          </div>
          <div className="fw-stat">
            <span>Vertices</span>
            <strong>{labels.length}</strong>
          </div>
          <div className="fw-stat">
            <span>Matrix size</span>
            <strong>{labels.length} × {labels.length}</strong>
          </div>

          <div className="fw-actions">
            <button
              onClick={() =>
                setStepIndex((index) =>
                  Math.min(index + 1, steps.length - 1)
                )
              }
              disabled={finished}
            >
              <Play size={16} /> Next Step
            </button>
            <button className="fw-reset" onClick={() => setStepIndex(0)}>
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          <button className="fw-dashboard" onClick={onBack}>
            <LayoutDashboard size={16} /> Back to Dashboard
          </button>
        </aside>
      </section>

      <section className="fw-complexity">
        <div>
          <span>Time Complexity</span>
          <strong>O(V³)</strong>
        </div>
        <div>
          <span>Space Complexity</span>
          <strong>O(V²)</strong>
        </div>
        <div>
          <span>Technique</span>
          <strong>Dynamic Programming</strong>
        </div>
      </section>
    </main>
  );
}
