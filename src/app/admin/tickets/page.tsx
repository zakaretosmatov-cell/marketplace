"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc, query, orderBy } from "firebase/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MessageSquare, Clock, CheckCircle, AlertCircle, XCircle } from "lucide-react";

type Ticket = {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  adminNote?: string;
  createdAt: string;
};

const STATUS_META: Record<Ticket["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  open:        { label: "Open",        color: "#2563eb", bg: "#dbeafe", icon: <Clock size={13} /> },
  in_progress: { label: "In Progress", color: "#d97706", bg: "#fef3c7", icon: <AlertCircle size={13} /> },
  resolved:    { label: "Resolved",    color: "#059669", bg: "#dcfce7", icon: <CheckCircle size={13} /> },
  closed:      { label: "Closed",      color: "#6b7280", bg: "#f3f4f6", icon: <XCircle size={13} /> },
};

const PRIORITY_COLORS: Record<Ticket["priority"], string> = {
  low: "#6b7280", medium: "#d97706", high: "#dc2626", urgent: "#7c3aed"
};

export default function AdminTicketsPage() {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Ticket["status"] | "all">("open");
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    try {
      const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
      getDocs(q).then(snap => {
        setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })) as Ticket[]);
        setLoading(false);
      }).catch(() => setLoading(false));
    } catch {
      setLoading(false);
    }
  }, []);

  const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

  const handleUpdate = async (id: string, status: Ticket["status"]) => {
    setProcessing(true);
    try {
      await updateDoc(doc(db, "tickets", id), {
        status,
        updatedAt: new Date().toISOString(),
        ...(reply.trim() ? { adminNote: reply.trim() } : {}),
      });
      setTickets(prev => prev.map(t => t.id === id ? { ...t, status, adminNote: reply.trim() || t.adminNote } : t));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
      setReply("");
      showToast("Ticket updated", "success");
    } catch {
      showToast("Failed to update ticket", "error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "1200px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800 }}>Support Tickets</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            Customer support and dispute arbitration
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {(["all", "open", "in_progress", "resolved", "closed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === f ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === f ? "white" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize" }}>
              {f.replace("_", " ")} ({f === "all" ? tickets.length : tickets.filter(t => t.status === f).length})
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
          <div>
            {loading ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
                <MessageSquare size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
                <p style={{ color: "var(--text-secondary)" }}>No {filter !== "all" ? filter.replace("_", " ") : ""} tickets.</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: "0.5rem" }}>
                  Tickets are created when customers submit support requests.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {filtered.map(ticket => {
                  const meta = STATUS_META[ticket.status];
                  return (
                    <div key={ticket.id} onClick={() => setSelected(ticket)}
                      style={{ padding: "1.25rem", border: "1px solid " + (selected?.id === ticket.id ? "var(--accent-color)" : "var(--border-color)"), borderRadius: "var(--radius-lg)", background: selected?.id === ticket.id ? "var(--accent-soft)" : "var(--bg-card)", cursor: "pointer", transition: "all 0.15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{ticket.subject}</p>
                        <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                          <span style={{ padding: "0.15rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.7rem", fontWeight: 700, background: meta.bg, color: meta.color, display: "flex", alignItems: "center", gap: "0.2rem" }}>
                            {meta.icon} {meta.label}
                          </span>
                          <span style={{ padding: "0.15rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.7rem", fontWeight: 700, background: "color-mix(in srgb, " + PRIORITY_COLORS[ticket.priority] + " 12%, transparent)", color: PRIORITY_COLORS[ticket.priority], textTransform: "capitalize" }}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ticket.message}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.4rem" }}>{ticket.userEmail} В· {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selected && (
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--bg-card)", height: "fit-content", position: "sticky", top: "calc(var(--header-height) + 1rem)" }}>
              <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontWeight: 700, fontSize: "0.9rem" }}>Ticket Detail</h2>
                <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", fontSize: "1.2rem" }}>x</button>
              </div>
              <div style={{ padding: "1.5rem" }}>
                <p style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{selected.subject}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "1rem" }}>{selected.userEmail} В· {new Date(selected.createdAt).toLocaleDateString()}</p>
                <div style={{ padding: "1rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  {selected.message}
                </div>
                {selected.adminNote && (
                  <div style={{ padding: "0.875rem", background: "var(--accent-soft)", borderRadius: "var(--radius-md)", marginBottom: "1.25rem", borderLeft: "3px solid var(--accent-color)" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-color)", marginBottom: "0.25rem" }}>Admin Note</p>
                    <p style={{ fontSize: "0.8rem" }}>{selected.adminNote}</p>
                  </div>
                )}
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Reply / Note</label>
                  <textarea value={reply} onChange={e => setReply(e.target.value)} placeholder="Write a note or reply..."
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "0.875rem", minHeight: "80px", resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  {(["in_progress", "resolved", "closed"] as Ticket["status"][]).map(s => (
                    <button key={s} onClick={() => handleUpdate(selected.id, s)} disabled={processing}
                      style={{ padding: "0.5rem 0.875rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontSize: "0.8rem", fontWeight: 500, cursor: processing ? "not-allowed" : "pointer", textTransform: "capitalize" }}>
                      Mark {s.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}