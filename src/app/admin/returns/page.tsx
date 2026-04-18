"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { returnApi } from "@/lib/api";
import { ReturnRequest } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

const STATUS_META: Record<ReturnRequest["status"], { label: string; color: string; bg: string }> = {
  pending:   { label: "Pending",   color: "#92400e", bg: "#fef3c7" },
  approved:  { label: "Approved",  color: "#14532d", bg: "#bbf7d0" },
  rejected:  { label: "Rejected",  color: "#7f1d1d", bg: "#fee2e2" },
  completed: { label: "Completed", color: "#1e3a5f", bg: "#dbeafe" },
};

export default function AdminReturnsPage() {
  const { showToast } = useToast();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ReturnRequest["status"] | "all">("pending");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    returnApi.getAllReturns().then(r => { setReturns(r); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? returns : returns.filter(r => r.status === filter);

  const handleAction = async (id: string, status: ReturnRequest["status"]) => {
    setProcessing(id);
    try {
      await returnApi.updateReturnStatus(id, status, noteInputs[id]);
      setReturns(prev => prev.map(r => r.id === id ? { ...r, status, adminNote: noteInputs[id] } : r));
      showToast(`Return ${status}`, "success");
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Return Requests</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage customer return requests</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["all", "pending", "approved", "rejected", "completed"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === f ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === f ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize" }}>
              {f} ({f === "all" ? returns.length : returns.filter(r => r.status === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <RefreshCw size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No {filter} return requests.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(ret => {
              const meta = STATUS_META[ret.status];
              return (
                <div key={ret.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
                  <div style={{ padding: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", fontFamily: "monospace" }}>Order #{ret.orderId.slice(-8).toUpperCase()}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{ret.userEmail} · {new Date(ret.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span style={{ padding: "0.2rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600, background: meta.bg, color: meta.color }}>{meta.label}</span>
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Reason: {ret.reason}</p>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
                      {ret.items.map((item, i) => <span key={i}>{item.productName} (x{item.quantity}){i < ret.items.length - 1 ? ", " : ""}</span>)}
                    </div>
                    {ret.adminNote && <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.5rem", fontStyle: "italic" }}>Note: {ret.adminNote}</p>}
                  </div>
                  {ret.status === "pending" && (
                    <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-secondary)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input value={noteInputs[ret.id] || ""} onChange={e => setNoteInputs(p => ({ ...p, [ret.id]: e.target.value }))} placeholder="Optional note..." style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "0.8rem" }} />
                      <button onClick={() => handleAction(ret.id, "approved")} disabled={processing === ret.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", background: "#16a34a", color: "white", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleAction(ret.id, "rejected")} disabled={processing === ret.id} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", background: "#dc2626", color: "white", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
                        <XCircle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
