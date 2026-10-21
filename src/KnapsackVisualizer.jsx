
import { useMemo, useState } from "react";
import { LayoutDashboard, RotateCcw, ChevronRight } from "lucide-react";
import {
  knapsackSteps,
  sampleWeights,
  sampleValues,
  sampleCapacity,
} from "./algorithms/knapsack";
import "./KnapsackVisualizer.css";

export default function KnapsackVisualizer({ onBack }) {
  const [stepIndex, setStepIndex] = useState(0);

  const result = useMemo(
    () => knapsackSteps(sampleWeights, sampleValues, sampleCapacity),
    []
  );

  const current = result.steps[stepIndex];

  function reset() {
    setStepIndex(0);
  }

  return (
    <main className="knapsack-page">
      <header className="knapsack-header">
        <button className="graph-back" onClick={onBack}>
          ← Dashboard
        </button>
        <div>
          <p className="graph-eyebrow">AOA LAB / EXPERIMENT 04</p>
          <h1>0/1 Knapsack <span>Visualizer</span></h1>
          <p className="graph-subtitle">
            See how dynamic programming finds the maximum value.
          </p>
        </div>
      </header>

      <section className="knapsack-summary">
        <div>
          <span>KNAPSACK CAPACITY</span>
          <strong>{sampleCapacity}</strong>
        </div>
        <div>
          <span>ITEMS</span>
          <strong>{sampleWeights.length}</strong>
        </div>
        <div>
          <span>MAXIMUM VALUE</span>
          <strong>{stepIndex === result.steps.length - 1 ? result.maxValue : "—"}</strong>
        </div>
      </section>

      <section className="graph-panel knapsack-panel">
        <div className="graph-panel-heading">
          <div>
            <h2>Dynamic programming table</h2>
            <p>Rows represent items; columns represent available capacity.</p>
          </div>
          <span className="graph-live"><i /> Live trace</span>
        </div>

        <div className="knapsack-items">
          {sampleWeights.map((weight, index) => (
            <div className="knapsack-item" key={index}>
              <span>Item {index + 1}</span>
              <strong>Weight {weight}</strong>
              <strong>Value {sampleValues[index]}</strong>
            </div>
          ))}
        </div>

        <div className="knapsack-table-wrap">
          <table className="knapsack-table">
            <thead>
              <tr>
                <th>Item / Capacity</th>
                {current.dp[0].map((_, capacity) => (
                  <th key={capacity}>{capacity}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {current.dp.map((row, item) => (
                <tr key={item}>
                  <th>{item === 0 ? "No items" : `Item ${item}`}</th>
                  {row.map((value, capacity) => (
                    <td key={capacity}>
                      <span className={item === current.item ? "knapsack-active-cell" : ""}>
                        {value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="graph-layout knapsack-bottom">
        <article className="graph-panel">
          <p className="graph-eyebrow">EXECUTION STATUS</p>
          <h2>Algorithm trace</h2>
          <div className="graph-step-count">
            <span>Current step</span>
            <strong>{stepIndex + 1}<small> / {result.steps.length}</small></strong>
          </div>
          <div className="graph-message">{current.message}</div>
          <div className="knapsack-formula">
            <span>DP TRANSITION</span>
            <strong>
              dp[i][w] = max(value[i] + dp[i−1][w−weight[i]], dp[i−1][w])
            </strong>
          </div>
        </article>

        <article className="graph-panel">
          <p className="graph-eyebrow">CONTROLS</p>
          <h2>Explore each item</h2>
          <p className="graph-subtitle">
            Move through the table one item at a time.
          </p>
          <div className="graph-actions knapsack-actions">
            <button onClick={reset}>
              <RotateCcw size={15} /> Reset
            </button>
            <button
              className="graph-primary"
              onClick={() => setStepIndex((value) => Math.min(value + 1, result.steps.length - 1))}
              disabled={stepIndex === result.steps.length - 1}
            >
              Next step <ChevronRight size={16} />
            </button>
          </div>
          {stepIndex === result.steps.length - 1 && (
            <p className="knapsack-success">
              ✓ Maximum value: {result.maxValue}
            </p>
          )}
        </article>
      </section>

      <section className="graph-complexity">
        <div><span>Algorithm</span><strong>0/1 Knapsack</strong></div>
        <div><span>Time complexity</span><strong>O(nW)</strong></div>
        <div><span>Space complexity</span><strong>O(nW)</strong></div>
        <div><span>Progress</span><strong>{Math.round((stepIndex / (result.steps.length - 1)) * 100)}%</strong></div>
      </section>

      <button className="floating-dashboard" onClick={onBack} title="Back to Dashboard">
        <LayoutDashboard size={19} />
        <span>Dashboard</span>
      </button>
    </main>
  );
}
