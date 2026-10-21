
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  LayoutDashboard,
  RotateCcw,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { nQueensSteps } from "./algorithms/nQueens";
import "./NQueensVisualizer.css";

export default function NQueensVisualizer({ onBack }) {
  const [size, setSize] = useState(4);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(() => nQueensSteps(size), [size]);
  const current = steps[stepIndex];
  const finished = stepIndex === steps.length - 1;

  function changeSize(value) {
    setSize(Number(value));
    setStepIndex(0);
  }

  function reset() {
    setStepIndex(0);
  }

  return (
    <main className="nq-page">
      <header className="nq-header">
        <button className="nq-back" onClick={onBack}>
          <ArrowLeft size={17} /> Dashboard
        </button>
        <span className="nq-tag">RTU AOA LAB · EXPERIMENT 10</span>
      </header>

      <section className="nq-heading">
        <p className="nq-eyebrow">BACKTRACKING ALGORITHM</p>
        <h1>N-Queens Problem</h1>
        <p>
          Place N queens on an N × N chessboard so that no two queens
          attack each other. Follow the algorithm step by step.
        </p>
      </section>

      <section className="nq-layout">
        <div className="nq-board-card">
          <div className="nq-card-top">
            <div>
              <h2>Chessboard</h2>
              <p>Watch each placement and backtrack.</p>
            </div>
            <label className="nq-size-control">
              Board size
              <select
                value={size}
                onChange={(event) => changeSize(event.target.value)}
              >
                {[4, 5, 6, 7, 8].map((value) => (
                  <option key={value} value={value}>
                    {value} × {value}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            className="nq-board"
            style={{ "--board-size": size }}
            role="img"
            aria-label={`${size} by ${size} chessboard`}
          >
            {current.board.map((queenCol, row) =>
              Array.from({ length: size }, (_, col) => {
                const hasQueen = queenCol === col;
                const isCurrent =
                  current.row === row && current.col === col;
                const dark = (row + col) % 2 === 1;

                return (
                  <div
                    key={`${row}-${col}`}
                    className={[
                      "nq-square",
                      dark ? "dark" : "light",
                      hasQueen ? "has-queen" : "",
                      isCurrent ? `current ${current.status}` : "",
                    ].join(" ")}
                    title={`Row ${row + 1}, column ${col + 1}`}
                  >
                    {hasQueen && <span className="nq-queen">♛</span>}
                  </div>
                );
              })
            )}
          </div>

          <div className="nq-legend">
            <span><i className="nq-legend-queen">♛</i> Queen</span>
            <span><i className="nq-legend-box safe" /> Placed</span>
            <span><i className="nq-legend-box conflict" /> Conflict / Backtrack</span>
          </div>
        </div>

        <aside className="nq-info-card">
          <p className="nq-eyebrow">EXECUTION TRACE</p>
          <h2>
            {current.status === "solution"
              ? "Solution Found!"
              : current.status === "unsolved"
                ? "No Solution"
                : "Backtracking in Action"}
          </h2>

          <p className="nq-message">{current.message}</p>

          <div className="nq-stat">
            <span>Current step</span>
            <strong>{stepIndex + 1} / {steps.length}</strong>
          </div>
          <div className="nq-stat">
            <span>Board size</span>
            <strong>{size} × {size}</strong>
          </div>
          <div className="nq-stat">
            <span>Queens placed</span>
            <strong>{current.board.filter((col) => col !== -1).length} / {size}</strong>
          </div>

          <div className="nq-controls">
            <button
              onClick={() => setStepIndex((i) => Math.max(i - 1, 0))}
              disabled={stepIndex === 0}
              aria-label="Previous step"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              className="nq-next"
              onClick={() =>
                setStepIndex((i) => Math.min(i + 1, steps.length - 1))
              }
              disabled={finished}
            >
              <Play size={16} /> Next Step
            </button>

            <button onClick={reset} aria-label="Reset">
              <RotateCcw size={17} />
            </button>
          </div>

          <button className="nq-dashboard" onClick={onBack}>
            <LayoutDashboard size={16} /> Back to Dashboard
          </button>
        </aside>
      </section>

      <section className="nq-complexity">
        <div>
          <span>Time Complexity</span>
          <strong>O(N!)</strong>
        </div>
        <div>
          <span>Space Complexity</span>
          <strong>O(N)</strong>
        </div>
        <div>
          <span>Technique</span>
          <strong>Backtracking</strong>
        </div>
      </section>
    </main>
  );
}
