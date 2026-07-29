#updatedboard 
import { useState, useMemo } from "react";
import { Circle, CircleCheck, TriangleAlert, Clock, ChevronRight, ChevronDown } from "lucide-react";

const EPICS = [
  {
    id: "e1",
    rank: 1,
    title: "Mobile app redesign",
    tag: "priority-now",
    owner: "Priya",
    shipped: "Onboarding flow shipped to beta",
    decision: { for: "Sam", what: "Sign off on nav pattern" },
    milestone: { done: 4, total: 6 },
    tickets: [
      { id: "NIM-142", title: "New tab bar component", status: "in-progress", assignee: "Priya", due: null, staleDays: 3 },
      { id: "NIM-143", title: "Onboarding carousel", status: "review", assignee: "Alex", due: null, staleDays: 1 },
      { id: "NIM-144", title: "Push notification opt-in", status: "ready", assignee: null, due: "2026-08-04" },
      { id: "NIM-145", title: "Dark mode pass", status: "backlog", assignee: null, due: null },
    ],
  },
  {
    id: "e2",
    rank: 2,
    title: "Checkout latency",
    tag: "priority-now",
    owner: "Alex",
    shipped: "Cart cache layer live in prod",
    decision: null,
    milestone: { done: 1040, total: 2000, unit: "requests profiled" },
    tickets: [
      { id: "NIM-201", title: "Cache checkout session", status: "in-progress", assignee: "Alex", due: null, staleDays: 12 },
      { id: "NIM-202", title: "Trim payment webhook chain", status: "ready", assignee: null, due: "2026-07-25" },
      { id: "NIM-203", title: "Add p95 latency dashboard", status: "review", assignee: "Sam", due: null, staleDays: 2 },
    ],
  },
  {
    id: "e3",
    rank: 3,
    title: "Metrics framework",
    tag: "priority-now",
    owner: "Sam",
    shipped: "Dashboard v1 live",
    decision: { for: "Priya", what: "Approve event taxonomy" },
    milestone: { done: 3, total: 4 },
    tickets: [
      { id: "NIM-310", title: "Event taxonomy doc", status: "review", assignee: "Sam", due: null, staleDays: 4 },
      { id: "NIM-311", title: "Backfill historical events", status: "in-progress", assignee: "Jordan", due: null, staleDays: 6 },
    ],
  },
  {
    id: "e4",
    rank: 4,
    title: "Vendor onboarding",
    tag: "priority-watch",
    owner: "Priya",
    shipped: null,
    decision: { for: "Sam", what: "Approve third vendor contract" },
    milestone: { done: 2, total: 3 },
    tickets: [
      { id: "NIM-402", title: "Draft vendor SLA", status: "ready", assignee: null, due: "2026-08-01" },
      { id: "NIM-403", title: "Sandbox access for vendor 3", status: "backlog", assignee: null, due: null },
    ],
  },
  {
    id: "e5",
    rank: 5,
    title: "Support coverage rota",
    tag: "priority-watch",
    owner: "Jordan",
    shipped: null,
    decision: null,
    milestone: { done: 1, total: 1, label: "Rota holding" },
    tickets: [
      { id: "NIM-501", title: "Q3 rota schedule", status: "in-progress", assignee: "Jordan", due: null, staleDays: 1 },
    ],
  },
  {
    id: "e6",
    rank: 6,
    title: "Design system audit",
    tag: "priority-later",
    owner: "Alex",
    shipped: null,
    decision: null,
    milestone: { done: 0, total: 5 },
    tickets: [
      { id: "NIM-601", title: "Inventory existing components", status: "backlog", assignee: null, due: null },
    ],
  },
];

const STATUS_META = {
  backlog: { label: "Backlog", color: "var(--text-secondary)" },
  ready: { label: "Ready", color: "#2F5D8A" },
  "in-progress": { label: "In progress", color: "#C97F1E" },
  review: { label: "In review", color: "#7C6BA8" },
  done: { label: "Done", color: "#3F7D5C" },
};

const TAG_META = {
  "priority-now": { label: "Now", bg: "#2F5D8A", fg: "#ffffff" },
  "priority-watch": { label: "Watch", bg: "#C97F1E", fg: "#ffffff" },
  "priority-later": { label: "Later", bg: "#B4B2A9", fg: "#2C2C2A" },
};

function isAtRisk(ticket) {
  if (ticket.due && new Date(ticket.due) < new Date("2026-07-29")) return true;
  if (ticket.status === "in-progress" && ticket.staleDays > 10) return true;
  return false;
}

export default function PriorityBoard() {
  const [filter, setFilter] = useState("all");
  const [person, setPerson] = useState("Priya");
  const [expanded, setExpanded] = useState(() => new Set(EPICS.map((e) => e.id)));

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const visibleEpics = useMemo(() => {
    return EPICS.map((epic) => {
      let tickets = epic.tickets;
      if (filter === "mine") {
        tickets = tickets.filter((t) => t.assignee === person && t.status !== "done");
      } else if (filter === "grabs") {
        tickets = tickets.filter((t) => !t.assignee && (t.status === "ready" || t.status === "backlog"));
      } else if (filter === "risk") {
        tickets = tickets.filter(isAtRisk);
      }
      return { ...epic, tickets };
    }).filter((epic) => filter === "all" || epic.tickets.length > 0);
  }, [filter, person]);

  const shippedThisWeek = EPICS.filter((e) => e.shipped);
  const decisionsNeeded = EPICS.filter((e) => e.decision);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#FAFAF7", color: "#1E1E1C", minHeight: "100%", padding: "2rem", maxWidth: 980, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        .sg { font-family: 'Space Grotesk', sans-serif; }
        .filter-btn { border: 1px solid #D3D1C7; background: #fff; border-radius: 999px; padding: 6px 14px; font-size: 13px; font-weight: 500; cursor: pointer; color: #5F5E5A; transition: all .15s; }
        .filter-btn.active { background: #1E1E1C; color: #fff; border-color: #1E1E1C; }
        .filter-btn:hover:not(.active) { border-color: #888780; }
        .card { background: #fff; border: 1px solid #E4E2D9; border-radius: 12px; }
      `}</style>

      <header style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <h1 className="sg" style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Priority board</h1>
          <span style={{ fontSize: 13, color: "#888780" }}>Nimbus Studios · Cycle 2026-08</span>
        </div>
        <p style={{ color: "#5F5E5A", fontSize: 14, marginTop: 6, maxWidth: 560 }}>
          What should I pick up next — answered without asking a manager. Ranked top to bottom by current priority.
        </p>
      </header>

      <section style={{ display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {["all", "mine", "grabs", "risk"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" && "All work"}
            {f === "mine" && "My next pickup"}
            {f === "grabs" && "Up for grabs"}
            {f === "risk" && "At risk"}
          </button>
        ))}
        {filter === "mine" && (
          <select
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            style={{ borderRadius: 999, border: "1px solid #D3D1C7", padding: "6px 12px", fontSize: 13, background: "#fff" }}
          >
            {["Priya", "Alex", "Sam", "Jordan"].map((p) => <option key={p}>{p}</option>)}
          </select>
        )}
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <CircleCheck size={16} color="#3F7D5C" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Shipped this week</span>
          </div>
          {shippedThisWeek.length === 0 ? (
            <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>Nothing marked shipped yet.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#5F5E5A", lineHeight: 1.7 }}>
              {shippedThisWeek.map((e) => <li key={e.id}>{e.shipped}</li>)}
            </ul>
          )}
        </div>
        <div className="card" style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <TriangleAlert size={16} color="#C97F1E" />
            <span style={{ fontSize: 13, fontWeight: 600 }}>Decisions needed</span>
          </div>
          {decisionsNeeded.length === 0 ? (
            <p style={{ fontSize: 13, color: "#888780", margin: 0 }}>No open decisions.</p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "#5F5E5A", lineHeight: 1.7 }}>
              {decisionsNeeded.map((e) => (
                <li key={e.id}>{e.decision.what} — needs {e.decision.for}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {visibleEpics.map((epic) => {
          const isOpen = expanded.has(epic.id);
          const pct = Math.round((epic.milestone.done / epic.milestone.total) * 100);
          return (
            <div key={epic.id} className="card" style={{ overflow: "hidden" }}>
              <div
                onClick={() => toggle(epic.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", cursor: "pointer" }}
              >
                <span className="sg" style={{ fontSize: 26, fontWeight: 700, color: "#D3D1C7", minWidth: 32 }}>{epic.rank}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 15 }}>{epic.title}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: TAG_META[epic.tag].bg, color: TAG_META[epic.tag].fg }}>
                      {TAG_META[epic.tag].label}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#888780", marginTop: 2 }}>
                    Owner {epic.owner} · {epic.milestone.label || `${epic.milestone.done}/${epic.milestone.total}${epic.milestone.unit ? " " + epic.milestone.unit : ""}`} ({pct}%)
                  </div>
                </div>
                <div style={{ width: 60, height: 6, background: "#E4E2D9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#2F5D8A" }} />
                </div>
                {isOpen ? <ChevronDown size={16} color="#888780" /> : <ChevronRight size={16} color="#888780" />}
              </div>

              {isOpen && (
                <div style={{ borderTop: "1px solid #E4E2D9" }}>
                  {epic.tickets.length === 0 ? (
                    <p style={{ fontSize: 13, color: "#888780", padding: "12px 16px", margin: 0 }}>No tickets match this filter.</p>
                  ) : (
                    epic.tickets.map((t) => {
                      const risk = isAtRisk(t);
                      const meta = STATUS_META[t.status];
                      return (
                        <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 16px", borderTop: "1px solid #F0EEE6", fontSize: 13 }}>
                          <Circle size={8} fill={meta.color} color={meta.color} style={{ flexShrink: 0 }} />
                          <span style={{ color: "#888780", fontFamily: "monospace", fontSize: 12, minWidth: 62 }}>{t.id}</span>
                          <span style={{ flex: 1 }}>{t.title}</span>
                          <span style={{ color: meta.color, fontSize: 12, fontWeight: 500, minWidth: 78 }}>{meta.label}</span>
                          <span style={{ color: "#888780", fontSize: 12, minWidth: 70 }}>{t.assignee || "Unassigned"}</span>
                          {risk && (
                            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#C97F1E", fontSize: 12 }}>
                              <Clock size={12} /> at risk
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
        {visibleEpics.length === 0 && (
          <div className="card" style={{ padding: 24, textAlign: "center", color: "#888780", fontSize: 14 }}>
            Nothing matches this filter right now.
          </div>
        )}
      </section>
    </div>
  );
}
