"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { returnApi } from "@/lib/api";
import { ReturnRequest } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { RefreshCw, Clock, CheckCircle, XCircle, Package } from "lucide-react";

const STATUS_META: Record<ReturnRequest["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending Review", color: "#92400e", bg: "#fef3c7", icon: <Clock size={13} /> },
  approved:  { label: "Approved",       color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={13} /> },
  rejected:  { label: "Rejected",       color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={13} /> },
  completed: { label: "Completed",      color: "#1e3a5f", bg: "#dbeafe", icon: <CheckCircle size={13} /> },
};

export default function MyReturnsPage() {
  const { user } = useAuth();
  const [returns, setReturns] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    returnApi.getReturnsByUser(user.uid).then(r => { setReturns(r); setLoading(false); });
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "800px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>My Returns</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Track your return requests</p>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : returns.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <RefreshCw size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>No return requests yet.</p>
            <Link href="/orders" style={{ color: "var(--accent-color)", fontSize: "0.875rem" }}>View your orders</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {returns.map(ret => {
              const meta = STATUS_META[ret.status];
              return (
                <div key={ret.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1.25rem", background: "var(--bg-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <Link href={`/orders/${ret.orderId}`} style={{ fontWeight: 600, fontSize: "0.875rem", fontFamily: "monospace", color: "var(--accent-color)" }}>
                        Order #{ret.orderId.slice(-8).toUpperCase()}
                      </Link>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.15rem" }}>
                        Submitted: {new Date(ret.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600, background: meta.bg, color: meta.color }}>
                      {meta.icon} {meta.label}
                    </span>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                    {ret.items.map((item, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.6rem", borderRadius: "var(--radius-sm)", background: "var(--bg-secondary)", fontSize: "0.8rem" }}>
                        <Package size={12} color="var(--text-tertiary)" />
                        {item.productName} ×{item.quantity}
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span style={{ fontWeight: 600 }}>Reason:</span> {ret.reason}
                  </p>

                  {ret.adminNote && (
                    <div style={{ marginTop: "0.75rem", padding: "0.625rem 0.875rem", borderRadius: "var(--radius-sm)", background: ret.status === "rejected" ? "#fff5f5" : "#f0fdf4", borderLeft: `3px solid ${ret.status === "rejected" ? "var(--error)" : "var(--success)"}` }}>
                      <p style={{ fontSize: "0.8rem", color: ret.status === "rejected" ? "var(--error)" : "var(--success)" }}>
                        <span style={{ fontWeight: 600 }}>Admin note:</span> {ret.adminNote}
                      </p>
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
