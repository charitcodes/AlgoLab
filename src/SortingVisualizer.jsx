
import { useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import {
  ArrowLeft, CheckCircle2, ChevronRight, Code2, FastForward,
  Pause, Play, RotateCcw, Shuffle, SkipBack, SkipForward,
  Sparkles, Timer, Workflow
} from "lucide-react";
import { quickSortSteps, mergeSortSteps } from "./algorithms/sorting";
import "./SortingVisualizer.css";

const INITIAL = [72, 35, 91, 24, 58, 43, 84, 16, 65, 49, 30, 77];

export default function SortingVisualizer({ onBack }) {
  const [algorithm, setAlgorithm] = useState("quick");
  const [values, setValues] = useState(INITIAL);
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [custom, setCustom] = useState(INITIAL.join(", "));
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");

  const steps = useMemo(
    () => algorithm === "quick"
      ? quickSortSteps(values)
      : mergeSortSteps(values),
    [algorithm, values]
  );

  const current = steps[Math.min(stepIndex, steps.length - 1)];
  const finished = Boolean(current?.done);

  function reset() {
    setPlaying(false);
    setStepIndex(0);
  }

  function changeAlgorithm(value) {
    setAlgorithm(value);
    setStepIndex(0);
    setPlaying(false);
  }

  function shuffleArray() {
    const next = [...values];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setValues(next);
    setCustom(next.join(", "));
    setStepIndex(0);
    setPlaying(false);
    setError("");
  }

  function loadCustom() {
    const parsed = custom.split(/[\s,]+/).filter(Boolean).map(Number);

    if (
      parsed.length < 2 ||
      parsed.length > 30 ||
      parsed.some((n) => !Number.isFinite(n) || !Number.isInteger(n) || n < 1 || n > 999)
    ) {
      setError("Enter 2–30 whole numbers between 1 and 999.");
      return;
    }

    setValues(parsed);
    setStepIndex(0);
    setPlaying(false);
    setError("");
  }

  function nextStep() {
    setStepIndex((index) => Math.min(index + 1, steps.length - 1));
  }

  function previousStep() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  return (
    <div className="visualizer-page">
      <header className="viz-topbar">
        <button className="viz-back" onClick={onBack}>
          <ArrowLeft size={17}/> Dashboard
        </button>
        <span className="viz-breadcrumb">Algorithm Studio <ChevronRight size={14}/> Sorting</span>
        <span className="viz-status"><span/> Interactive mode</span>
      </header>

      <div className="viz-content">
        <div className="viz-eyebrow"><Sparkles size={14}/> AOA LAB · EXPERIMENTS 01–02</div>
        <h1>Sorting <span>Visualizer</span></h1>
        <p className="viz-intro">
          Watch sorting algorithms work, one operation at a time.
          Explore the logic behind every comparison and swap.
        </p>

        <div className="algorithm-switch">
          <button className={algorithm === "quick" ? "chosen" : ""} onClick={() => changeAlgorithm("quick")}>
            <Workflow size={17}/> Quick Sort <small>01</small>
          </button>
          <button className={algorithm === "merge" ? "chosen" : ""} onClick={() => changeAlgorithm("merge")}>
            <Code2 size={17}/> Merge Sort <small>02</small>
          </button>
        </div>

        <div className="viz-stats">
          <div><span>ARRAY SIZE</span><strong>{values.length} <small>elements</small></strong></div>
          <div><span>TIME COMPLEXITY</span><strong>{algorithm === "quick" ? "O(n²)" : "O(n log n)"}</strong></div>
          <div><span>CURRENT STEP</span><strong>{stepIndex + 1} <small>/ {steps.length}</small></strong></div>
          <div><span>STATUS</span><strong className={finished ? "done-text" : ""}>{finished ? "Completed" : "Ready to explore"}</strong></div>
        </div>

        <section className="viz-panel">
          <div className="viz-panel-heading">
            <div><h2>Array visualization</h2><p>Follow the highlighted elements as the algorithm runs.</p></div>
            <button className="viz-secondary" onClick={shuffleArray}><Shuffle size={15}/> Shuffle</button>
          </div>

          <div className="bar-chart" aria-label="Sorting array visualization">
            {current.array.map((value, index) => {
              const max = Math.max(...values);
              const active = current.active.includes(index);
              const pivot = algorithm === "quick" && current.pivot === index;
              const sorted = finished;

              return <div className="bar-column" key={`${index}-${values.length}`}>
                <div className="bar-value">{value}</div>
                <div
                  className={`bar ${active ? "bar-active" : ""} ${pivot ? "bar-pivot" : ""} ${sorted ? "bar-sorted" : ""}`}
                  style={{ height: `${Math.max(6, (value / max) * 100)}%`, animationDelay: `${index * 18}ms` }}
                  title={`Value: ${value}`}
                />
                <span className="bar-index">{index}</span>
              </div>;
            })}
          </div>

          <div className="bar-legend">
            <span><i className="legend-normal"/> Unprocessed</span>
            <span><i className="legend-active"/> Current operation</span>
            {algorithm === "quick" && <span><i className="legend-pivot"/> Pivot</span>}
          </div>

          <div className="operation-box">
            <div className="operation-icon">{finished ? <CheckCircle2 size={20}/> : <ActivityIcon/>}</div>
            <div><span>ALGORITHM TRACE · STEP {stepIndex + 1}</span><p>{current.message}</p></div>
            {finished && <CheckCircle2 className="operation-check" size={20}/>}
          </div>

          <div className="viz-controls">
            <button className="control-icon" title="Restart" onClick={reset}><RotateCcw size={17}/></button>
            <button className="control-icon" title="Previous step" onClick={previousStep} disabled={stepIndex === 0}><SkipBack size={17}/></button>
            <button className="viz-play" onClick={() => {
              if (finished) reset();
              else {
                setPlaying(false);
                nextStep();
              }
            }}>
              {finished ? <RotateCcw size={17}/> : <SkipForward size={17}/>}
              {finished ? "Restart run" : "Next step"}
            </button>
            <button className="control-icon" title="Next step" onClick={nextStep} disabled={finished}><FastForward size={17}/></button>
            <label className="speed-control">STEP SIZE
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
                <option value={1}>1 step</option>
                <option value={3}>3 steps</option>
                <option value={5}>5 steps</option>
              </select>
            </label>
          </div>
          {speed > 1 && <button className="viz-secondary" onClick={() => setStepIndex((i) => Math.min(i + speed, steps.length - 1))}>Advance {speed} steps</button>}
        </section>

        <section className="viz-panel input-panel">
          <div className="viz-panel-heading">
            <div><h2>Customize your input</h2><p>Enter integers separated by commas or spaces.</p></div>
          </div>
          <div className="custom-input-row">
            <input value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadCustom()} aria-label="Array values"/>
            <button className="viz-play" onClick={loadCustom}><Play size={15}/> Apply array</button>
          </div>
          {error && <p className="input-error">{error}</p>}
          <p className="input-hint">Allowed: 2–30 integers, each between 1 and 999.</p>
        </section>

        <section className="viz-panel theory-panel">
          <div className="viz-panel-heading"><div><h2>Algorithm notes</h2><p>From your RTU AOA laboratory syllabus.</p></div></div>
          {algorithm === "quick" ? (
            <ol>
              <li>Choose a pivot element from the array.</li>
              <li>Partition elements into values smaller than the pivot and values greater than or equal to it.</li>
              <li>Recursively sort the left and right partitions.</li>
            </ol>
          ) : (
            <ol>
              <li>Divide the array into two halves.</li>
              <li>Recursively sort each half.</li>
              <li>Merge the sorted halves into a single sorted array.</li>
            </ol>
          )}
          <div className="complexity-row"><span><Timer size={15}/> Average time</span><strong>{algorithm === "quick" ? "O(n log n)" : "O(n log n)"}</strong><span>Worst case</span><strong>{algorithm === "quick" ? "O(n²)" : "O(n log n)"}</strong></div>
        </section>

        <footer className="viz-footer">AlgoLab Studio · RTU CSE · Analysis of Algorithms</footer>
              <button
        className="floating-dashboard"
        onClick={onBack}
        title="Back to Dashboard"
      >
        <LayoutDashboard size={19} />
        <span>Dashboard</span>
      </button>
      </div>
    </div>
  );
}

function ActivityIcon() {
  return <Workflow size={20}/>;
}
