"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Package, ChevronRight, Clock, Truck, CheckCircle, XCircle, RefreshCw, CreditCard } from "lucide-react";

const STATUS_META: Record<Order["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "#92400e", bg: "#fef3c7", icon: <Clock size={13} /> },
  paid:       { label: "Paid",       color: "#1e40af", bg: "#dbeafe", icon: <CreditCard size={13} /> },
  processing: { label: "Processing", color: "#5b21b6", bg: "#ede9fe", icon: <RefreshCw size={13} /> },
  shipped:    { label: "Shipped",    color: "#065f46", bg: "#d1fae5", icon: <Truck size={13} /> },
  delivered:  { label: "Delivered",  color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={13} /> },
  cancelled:  { label: "Cancelled",  color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={13} /> },
};

export default function SellerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    // Get all orders and filter by sellerId on client side
    // (Firestore array-contains query requires composite index)
    api.getAllOrders().then(all => {
      const mine = all.filter(o => o.items.some(i => i.sellerId === user.uid) || (o.sellerIds || []).includes(user.uid));
      setOrders(mine);
      setLoading(false);
    });
  }, [user]);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => ["paid", "processing"].includes(o.status)).length,
    shipped: orders.filter(o => o.status === "shipped").length,
  };

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "1000px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Orders</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage orders from your customers</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {[
            { label: "Total", value: stats.total },
            { label: "Pending", value: stats.pending },
            { label: "In Progress", value: stats.processing },
            { label: "Shipped", value: stats.shipped },
          ].map(s => (
            <div key={s.label} style={{ padding: "1rem 1.25rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem", background: "var(--bg-card)" }}>
              <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{s.label}</p>
              <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === s ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === s ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === s ? 600 : 400, textTransform: "capitalize" }}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "0.5rem" }}>
            <Package size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No orders found.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr 36px", padding: "0.75rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Order</span><span>Customer</span><span>Items</span><span>Total</span><span>Status</span><span></span>
            </div>
            {filtered.map((order, i) => {
              const meta = STATUS_META[order.status];
              const myItems = order.items.filter(it => it.sellerId === user?.uid);
              const myTotal = myItems.reduce((s, it) => s + it.price * it.quantity, 0);
              return (
                <Link key={order.id} href={`/orders/${order.id}`}
                  style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr 36px", padding: "1rem 1.25rem", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-color)" : "none", alignItems: "center", color: "inherit", textDecoration: "none", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.8rem", fontFamily: "monospace" }}>#{order.id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.userEmail || order.userId.slice(0, 8)}</p>
                  <p style={{ fontSize: "0.875rem" }}>{myItems.length} item{myItems.length !== 1 ? "s" : ""}</p>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>${myTotal.toFixed(2)}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.7rem", fontWeight: 600, background: meta.bg, color: meta.color }}>
                    {meta.icon}{meta.label}
                  </span>
                  <ChevronRight size={14} color="var(--text-tertiary)" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
