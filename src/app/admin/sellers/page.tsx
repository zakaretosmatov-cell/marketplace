"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { sellerApi } from "@/lib/api";
import { SellerProfile } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { CheckCircle, XCircle, Clock, Store } from "lucide-react";

export default function AdminSellersPage() {
  const { showToast } = useToast();
  const [sellers, setSellers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    sellerApi.getAllSellerApplications().then(s => { setSellers(s); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? sellers : sellers.filter(s => s.verificationStatus === filter);

  const handleAction = async (uid: string, status: "approved" | "rejected") => {
    setProcessing(uid);
    try {
      await sellerApi.updateSellerStatus(uid, status);
      setSellers(prev => prev.map(s => s.uid === uid ? { ...s, verificationStatus: status } : s));
      showToast(`Seller ${status}`, "success");
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessing(null);
    }
  };

  const STATUS = {
    pending:  { label: "Pending",  color: "#92400e", bg: "#fef3c7", icon: <Clock size={13} /> },
    approved: { label: "Approved", color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={13} /> },
    rejected: { label: "Rejected", color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={13} /> },
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Seller Applications</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Review and approve seller applications</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === f ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === f ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize" }}>
              {f} ({f === "all" ? sellers.length : sellers.filter(s => s.verificationStatus === f).length})
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <Store size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No {filter} applications.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(seller => {
              const meta = STATUS[seller.verificationStatus];
              return (
                <div key={seller.uid} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
                  <div style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
                        <p style={{ fontWeight: 700 }}>{seller.businessName || "No business name"}</p>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600, background: meta.bg, color: meta.color }}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{seller.email}</p>
                      {seller.phone && <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{seller.phone}</p>}
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>Applied: {new Date(seller.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {seller.verificationStatus === "pending" && (
                    <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-color)", background: "var(--bg-secondary)", display: "flex", gap: "0.75rem" }}>
                      <button onClick={() => handleAction(seller.uid, "approved")} disabled={processing === seller.uid}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", background: "#16a34a", color: "white", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleAction(seller.uid, "rejected")} disabled={processing === seller.uid}
                        style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", borderRadius: "0.375rem", background: "#dc2626", color: "white", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer" }}>
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
