
import { useState } from "react";
import {
  Activity, BarChart3, BookOpen, BrainCircuit, ChevronDown,
  CircleHelp, Clock3, Code2, GitBranch, Gauge, GraduationCap,
  LayoutDashboard, Menu, Network, Search, Settings2, ShieldCheck,
  Sparkles, Workflow, Zap
} from "lucide-react";

import SortingVisualizer from "./SortingVisualizer";
import GraphVisualizer from "./GraphVisualizer";
import WarshallVisualizer from "./WarshallVisualizer";
import KnapsackVisualizer from "./KnapsackVisualizer";
import KruskalVisualizer from "./KruskalVisualizer";
import PrimVisualizer from "./PrimVisualizer";
import FloydWarshallVisualizer from "./FloydWarshallVisualizer";
import NQueensVisualizer from "./NQueensVisualizer";
import "./App.css";

const algorithms = [
  { name: "Quick Sort", category: "Sorting", exp: "01", complexity: "O(n²)", icon: BarChart3, color: "purple", desc: "Divide and conquer sorting" },
  { name: "Merge Sort", category: "Sorting", exp: "02", complexity: "O(n log n)", icon: Workflow, color: "blue", desc: "Divide, sort and merge" },
  { name: "Topological Sort", category: "Graph", exp: "03a", complexity: "O(V + E)", icon: Network, color: "cyan", desc: "Order vertices in a DAG" },
  { name: "Warshall's Algorithm", category: "Graph", exp: "03b", complexity: "O(V³)", icon: GitBranch, color: "pink", desc: "Calculate graph reachability" },
  { name: "0/1 Knapsack", category: "Dynamic Programming", exp: "04", complexity: "O(nW)", icon: BrainCircuit, color: "orange", desc: "Maximize value within capacity" },
  { name: "Dijkstra's Algorithm", category: "Graph", exp: "05", complexity: "O((V+E) log V)", icon: Network, color: "green", desc: "Find shortest paths" },
  { name: "Kruskal's Algorithm", category: "Graph", exp: "06", complexity: "O(E log E)", icon: GitBranch, color: "blue", desc: "Minimum spanning tree" },
  { name: "BFS Traversal", category: "Graph", exp: "07a", complexity: "O(V + E)", icon: Network, color: "cyan", desc: "Explore graph level by level" },
  { name: "DFS Connectivity", category: "Graph", exp: "07b", complexity: "O(V + E)", icon: GitBranch, color: "purple", desc: "Check graph connectivity" },
  { name: "Prim's Algorithm", category: "Graph", exp: "08", complexity: "O(E log V)", icon: Workflow, color: "green", desc: "Build a minimum spanning tree" },
  { name: "Floyd–Warshall", category: "Graph", exp: "09", complexity: "O(V³)", icon: Network, color: "pink", desc: "All-pairs shortest paths" },
  { name: "N-Queens", category: "Backtracking", exp: "10", complexity: "O(N!)", icon: BrainCircuit, color: "orange", desc: "Solve the queen placement puzzle" }
];

const filters = [
  "All Algorithms",
  "Sorting",
  "Graph",
  "Dynamic Programming",
  "Backtracking"
];

function App() {
  const [active, setActive] = useState("All Algorithms");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState("dashboard");
  const [graphAlgorithm, setGraphAlgorithm] = useState("BFS");

  if (view === "sorting") {
    return <SortingVisualizer onBack={() => setView("dashboard")} />;
  }

  if (view === "graph") {
    return (
      <GraphVisualizer
        key={graphAlgorithm}
        algorithm={graphAlgorithm}
        onBack={() => setView("dashboard")}
      />
    );
  }

  if (view === "warshall") {
    return <WarshallVisualizer onBack={() => setView("dashboard")} />;
  }

  if (view === "knapsack") {
    return <KnapsackVisualizer onBack={() => setView("dashboard")} />;
  }

  if (view === "kruskal") {
    return <KruskalVisualizer onBack={() => setView("dashboard")} />;
  }

  if (view === "prim") {
    return <PrimVisualizer onBack={() => setView("dashboard")} />;
  }

  if (view === "floyd") {
    return <FloydWarshallVisualizer onBack={() => setView("dashboard")} />;
  }
  if (view === "nqueens") {
  return <NQueensVisualizer onBack={() => setView("dashboard")} />;
}

  const shown = algorithms.filter(
    (a) =>
      (active === "All Algorithms" || a.category === active) &&
      `${a.name} ${a.desc}`.toLowerCase().includes(search.toLowerCase())
  );

  function openAlgorithm(algo) {
    setSelected(null);

    if (algo.name === "Quick Sort" || algo.name === "Merge Sort") {
      setView("sorting");
      return;
    }

    if (algo.name === "Warshall's Algorithm") {
      setView("warshall");
      return;
    }

    if (algo.name === "0/1 Knapsack") {
      setView("knapsack");
      return;
    }

    if (algo.name === "Kruskal's Algorithm") {
      setView("kruskal");
      return;
    }

    if (algo.name === "Prim's Algorithm") {
      setView("prim");
      return;
    }

    // IMPORTANT: Match the exact name used in the algorithms array.
    if (algo.name === "Floyd–Warshall") {
      setView("floyd");
      return;
    }

    if (algo.name === "N-Queens") {
  setView("nqueens");
  return;
}

    const graphModules = {
      "Topological Sort": "Topological Sort",
      "Dijkstra's Algorithm": "Dijkstra",
      "BFS Traversal": "BFS",
      "DFS Connectivity": "DFS"
    };

    if (graphModules[algo.name]) {
      setGraphAlgorithm(graphModules[algo.name]);
      setView("graph");
      return;
    }

    setSelected(algo);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={25} /></div>
          <div>
            <strong>Algo<span>Lab</span></strong>
            <small>ALGORITHM STUDIO</small>
          </div>
          <button className="mobile-close" onClick={() => setSidebarOpen(false)}>×</button>
        </div>

        <div className="side-label">WORKSPACE</div>

        <button
          className="nav-link active"
          onClick={() => {
            setView("dashboard");
            setSidebarOpen(false);
          }}
        >
          <LayoutDashboard size={18} /> Dashboard
        </button>

        <button
          className="nav-link"
          onClick={() => {
            setActive("All Algorithms");
            setSearch("");
            setView("dashboard");
            setSidebarOpen(false);
          }}
        >
          <Workflow size={18} /> Algorithm Library
          <span className="nav-count">12</span>
        </button>

        <div className="side-label">CATEGORIES</div>

        {filters.slice(1).map((filter) => (
          <button
            key={filter}
            className={`nav-link ${active === filter ? "active" : ""}`}
            onClick={() => {
              setActive(filter);
              setSidebarOpen(false);
            }}
          >
            {filter === "Sorting" ? (
              <BarChart3 size={18} />
            ) : filter === "Graph" ? (
              <Network size={18} />
            ) : filter === "Dynamic Programming" ? (
              <BrainCircuit size={18} />
            ) : (
              <GitBranch size={18} />
            )}
            {filter}
          </button>
        ))}

        <div className="sidebar-spacer" />

        <div className="course-card">
          <div className="course-icon"><GraduationCap size={20} /></div>
          <div>
            <strong>RTU · CSE</strong>
            <small>Semester V · AOA Lab</small>
          </div>
          <ShieldCheck size={17} className="verified" />
          <p>Learn algorithms visually. Master the logic behind every line of code.</p>
          <div className="course-progress"><span /></div>
          <small>YOUR ALGORITHM JOURNEY</small>
        </div>

        <div className="profile">
          <div className="avatar">C</div>
          <div>
            <strong>Charit Singhal</strong>
            <small>CSE · Third Year</small>
          </div>
          <Settings2 size={18} />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>Dashboard</strong>
          </div>
          <div className="top-actions">
            <div className="status"><span /> All systems operational</div>
            <button className="icon-btn" title="Help"><CircleHelp size={19} /></button>
            <div className="top-avatar">C</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <Sparkles size={14} /> YOUR INTERACTIVE LEARNING SPACE
              </div>
              <h1>
                Understand algorithms.<br />
                <span>See the logic unfold.</span>
              </h1>
              <p>
                Explore, execute and visualize the algorithms from your RTU AOA laboratory syllabus.
              </p>
            </div>

            <div className="hero-art">
              <div className="orbit orbit-one" />
              <div className="orbit orbit-two" />
              <div className="hero-core"><BrainCircuit size={61} /></div>
              <div className="float-chip chip-one"><Activity size={16} /> Live execution</div>
              <div className="float-chip chip-two"><Code2 size={16} /> C++ concepts</div>
              <div className="float-dot dot-one" />
              <div className="float-dot dot-two" />
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple"><Workflow /></div>
              <div className="stat-label">LAB EXPERIMENTS</div>
              <div className="stat-value">10 <span>syllabus experiments</span></div>
              <div className="stat-foot"><span className="positive">✓</span> Based on RTU practical file</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon blue"><Code2 /></div>
              <div className="stat-label">ALGORITHM TOPICS</div>
              <div className="stat-value">12 <span>interactive modules</span></div>
              <div className="stat-foot">Sorting, graphs, DP & backtracking</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green"><Gauge /></div>
              <div className="stat-label">LEARNING MODE</div>
              <div className="stat-value">Visual <span>step by step</span></div>
              <div className="stat-foot"><Zap size={14} /> Understand each algorithm</div>
            </div>
          </section>

          <section className="library-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">THE TOOLKIT</div>
                <h2>
                  Algorithm library <span className="total-pill">{shown.length}</span>
                </h2>
                <p>Choose a module to explore its logic and implementation.</p>
              </div>

              <div className="search-box">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search algorithms..."
                  aria-label="Search algorithms"
                />
                <kbd>⌘ K</kbd>
              </div>
            </div>

            <div className="filter-row">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActive(filter)}
                  className={`filter-chip ${active === filter ? "selected" : ""}`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="algorithm-grid">
              {shown.map((algo) => {
                const Icon = algo.icon;

                return (
                  <button
                    key={algo.name}
                    className="algorithm-card"
                    onClick={() => openAlgorithm(algo)}
                  >
                    <div className="algo-card-top">
                      <div className={`algo-icon ${algo.color}`}>
                        <Icon size={21} />
                      </div>
                      <span className="experiment-tag">EXP {algo.exp}</span>
                    </div>
                    <h3>{algo.name}</h3>
                    <p>{algo.desc}</p>
                    <div className="algo-card-bottom">
                      <span><Clock3 size={14} /> {algo.complexity}</span>
                      <span className="open-arrow">↗</span>
                    </div>
                  </button>
                );
              })}

              {shown.length === 0 && (
                <div className="empty-state">
                  No matching algorithms. Try another search.
                </div>
              )}
            </div>
          </section>

          <footer>
            <span>© 2026 AlgoLab Studio</span>
            <span><BookOpen size={14} /> RTU CSE · Analysis of Algorithms · 5CS4-23</span>
            <span>Built for curious minds <span className="heart">♥</span></span>
          </footer>
        </div>
      </main>

      {sidebarOpen && (
        <button
          className="backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu"
        />
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="algo-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            <div className="eyebrow">RTU AOA LAB · EXPERIMENT {selected.exp}</div>
            <h2>{selected.name}</h2>
            <p>{selected.desc}</p>
            <div className="modal-detail">
              <span>Time complexity</span>
              <strong>{selected.complexity}</strong>
            </div>
            <div className="modal-note">
              <BookOpen size={19} />
              <span>
                This module is based on the corresponding experiment in your RTU AOA practical file.
                We'll implement its interactive execution next.
              </span>
            </div>
            <button
              className="primary-btn"
              onClick={() => {
                const algorithm = selected;
                setSelected(null);
                if (algorithm) openAlgorithm(algorithm);
              }}
            >
              Launch Algorithm <ChevronDown size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
