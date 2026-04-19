"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { sellerApi } from "@/lib/api";
import { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { TrendingUp, Package, ShoppingBag, DollarSign, ArrowLeft } from "lucide-react";

export default function SellerAnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalProducts: 0, recentOrders: [] as Order[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    sellerApi.getSellerStats(user.uid).then(s => { setStats(s); setLoading(false); });
  }, [user]);

  const statCards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, color: "var(--success)" },
    { label: "Total Orders", value: stats.totalOrders, icon: <ShoppingBag size={20} />, color: "var(--blue)" },
    { label: "Products Listed", value: stats.totalProducts, icon: <Package size={20} />, color: "var(--warning)" },
    { label: "Avg Order Value", value: stats.totalOrders ? `$${(stats.totalRevenue / stats.totalOrders).toFixed(2)}` : "$0", icon: <TrendingUp size={20} />, color: "var(--accent-color)" },
  ];

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <Link href="/seller" style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Analytics</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Your store performance</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {statCards.map(s => (
                <div key={s.label} style={{ padding: "1.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{s.label}</p>
                      <p style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>{s.value}</p>
                    </div>
                    <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: `color-mix(in srgb, ${s.color} 12%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", color: s.color }}>
                      {s.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mini bar chart — orders by status */}
            {stats.recentOrders.length > 0 && (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "1.5rem", background: "var(--bg-card)" }}>
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)", marginBottom: "1.25rem" }}>Revenue Overview</h2>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "0.5rem", height: "80px" }}>
                  {["pending","paid","processing","shipped","delivered","cancelled"].map(status => {
                    const count = stats.recentOrders.filter(o => o.status === status).length;
                    const max = Math.max(...["pending","paid","processing","shipped","delivered","cancelled"].map(s => stats.recentOrders.filter(o => o.status === s).length), 1);
                    const colors: Record<string, string> = { pending: "#f59e0b", paid: "#3b82f6", processing: "#8b5cf6", shipped: "#06b6d4", delivered: "#10b981", cancelled: "#ef4444" };
                    return (
                      <div key={status} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                        <div style={{ width: "100%", height: `${(count / max) * 60 + 4}px`, background: colors[status], borderRadius: "0.25rem 0.25rem 0 0", minHeight: "4px", transition: "height 0.3s" }} />
                        <span style={{ fontSize: "0.6rem", color: "var(--text-tertiary)", textTransform: "capitalize" }}>{status.slice(0,4)}</span>
                        <span style={{ fontSize: "0.7rem", fontWeight: 700 }}>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
              <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}>
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-secondary)" }}>Recent Orders</h2>
              </div>
              {stats.recentOrders.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>No orders yet.</div>
              ) : (
                stats.recentOrders.map((order, i) => (
                  <Link key={order.id} href={`/orders/${order.id}`}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: i < stats.recentOrders.length - 1 ? "1px solid var(--border-color)" : "none", color: "inherit", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem", fontFamily: "monospace" }}>#{order.id.slice(-8).toUpperCase()}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontWeight: 700 }}>${order.totalAmount.toFixed(2)}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "capitalize" }}>{order.status}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
