"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { adApi } from "@/lib/api";
import { Ad } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CheckCircle, XCircle, Clock, Calendar, Megaphone } from "lucide-react";

const STATUS_META: Record<Ad["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending",  color: "#92400e", bg: "#fef3c7", icon: <Clock size={13} /> },
  approved: { label: "Approved", color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={13} /> },
  rejected: { label: "Rejected", color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={13} /> },
  expired:  { label: "Expired",  color: "#374151", bg: "#f3f4f6", icon: <Calendar size={13} /> },
};

export default function AdminAdsPage() {
  const { showToast } = useToast();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Ad["status"] | "all">("pending");
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    adApi.getAllAds().then(data => { setAds(data); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? ads : ads.filter(a => a.status === filter);

  const handleAction = async (id: string, status: "approved" | "rejected") => {
    setProcessing(id);
    try {
      await adApi.updateAdStatus(id, status, noteInputs[id]);
      setAds(prev => prev.map(a => a.id === id ? { ...a, status, adminNote: noteInputs[id] } : a));
      showToast(`Ad ${status}`, "success");
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessing(null);
    }
  };

  const stats = {
    pending: ads.filter(a => a.status === "pending").length,
    approved: ads.filter(a => a.status === "approved").length,
    rejected: ads.filter(a => a.status === "rejected").length,
    revenue: ads.filter(a => a.status === "approved").reduce((s, a) => s + a.totalCost, 0),
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "1000px" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Ad Campaigns</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Review and approve seller advertising requests</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Pending", value: stats.pending, color: "#92400e" },
            { label: "Approved", value: stats.approved, color: "#14532d" },
            { label: "Rejected", value: stats.rejected, color: "#7f1d1d" },
            { label: "Ad Revenue", value: `$${stats.revenue.toLocaleString()}`, color: "var(--accent-color)" },
          ].map(s => (
            <div key={s.label} style={{ padding: "1rem 1.25rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem", background: "var(--bg-card)" }}>
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{s.label}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["all", "pending", "approved", "rejected", "expired"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === f ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === f ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize" }}>
              {f === "all" ? "All" : f} {f !== "all" && `(${ads.filter(a => a.status === f).length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <Megaphone size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No {filter !== "all" ? filter : ""} ad requests.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(ad => {
              const meta = STATUS_META[ad.status];
              return (
                <div key={ad.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
                  <div style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ad.productImage} alt={ad.productName} style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "0.5rem", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{ad.productName}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{ad.sellerEmail}</p>
                        </div>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600, background: meta.bg, color: meta.color, flexShrink: 0 }}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
                        <span>📅 {new Date(ad.startDate).toLocaleDateString()} — {new Date(ad.endDate).toLocaleDateString()}</span>
                        <span>⏱ {ad.days} day{ad.days !== 1 ? "s" : ""}</span>
                        <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>${ad.totalCost.toLocaleString()}</span>
                        <span>Submitted: {new Date(ad.createdAt).toLocaleDateString()}</span>
                      </div>
                      {ad.adminNote && (
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.4rem", fontStyle: "italic" }}>Note: {ad.adminNote}</p>
                      )}
                    </div>
                  </div>

                  {/* Action panel — only for pending */}
                  {ad.status === "pending" && (
                    <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-secondary)", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <input
                        value={noteInputs[ad.id] || ""}
                        onChange={e => setNoteInputs(prev => ({ ...prev, [ad.id]: e.target.value }))}
                        placeholder="Optional note to seller..."
                        style={{ flex: 1, padding: "0.5rem 0.75rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "0.8rem" }}
                      />
                      <button onClick={() => handleAction(ad.id, "approved")} disabled={processing === ad.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", background: "#16a34a", color: "white", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: processing === ad.id ? "not-allowed" : "pointer" }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleAction(ad.id, "rejected")} disabled={processing === ad.id}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", background: "#dc2626", color: "white", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: processing === ad.id ? "not-allowed" : "pointer" }}>
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
