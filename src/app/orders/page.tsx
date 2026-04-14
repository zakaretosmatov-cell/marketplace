"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, ChevronRight, Package, Clock, CheckCircle, Truck, XCircle, RefreshCw } from "lucide-react";

const STATUS_META: Record<Order["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "#92400e", bg: "#fef3c7", icon: <Clock size={13} /> },
  paid:       { label: "Paid",       color: "#1e40af", bg: "#dbeafe", icon: <CheckCircle size={13} /> },
  processing: { label: "Processing", color: "#5b21b6", bg: "#ede9fe", icon: <RefreshCw size={13} /> },
  shipped:    { label: "Shipped",    color: "#065f46", bg: "#d1fae5", icon: <Truck size={13} /> },
  delivered:  { label: "Delivered",  color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={13} /> },
  cancelled:  { label: "Cancelled",  color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={13} /> },
};

export default function OrdersPage() {
  const { user, role } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const fetch = role === "admin"
      ? api.getAllOrders()
      : api.getOrdersByUser(user.uid);
    fetch.then(data => { setOrders(data); setLoading(false); });
  }, [user, role]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (filterStatus !== "all") list = list.filter(o => o.status === filterStatus);
    if (search) list = list.filter(o =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress.toLowerCase().includes(search.toLowerCase())
    );
    return list;
  }, [orders, search, filterStatus]);

  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.totalAmount, 0);

  const inp = { padding: "0.6rem 0.9rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem" };

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "1100px" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
            {role === "admin" ? "All Orders" : "My Orders"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
            {orders.length} orders total
          </p>
        </div>

        {/* Stats row (admin only) */}
        {role === "admin" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { label: "Total Orders", value: orders.length },
              { label: "Revenue", value: "$" + totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 }) },
              { label: "Pending", value: orders.filter(o => o.status === "pending").length },
              { label: "Delivered", value: orders.filter(o => o.status === "delivered").length },
            ].map(s => (
              <div key={s.label} style={{ padding: "1.25rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem", background: "var(--bg-card)" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{s.label}</p>
                <p style={{ fontSize: "1.5rem", fontWeight: 700 }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "0.375rem", padding: "0.6rem 0.9rem", background: "var(--bg-primary)", flex: 1, minWidth: "200px" }}>
            <Search size={15} color="var(--text-tertiary)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or address..." style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }} />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ ...inp, minWidth: "150px" }}>
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading orders...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "0.5rem" }}>
            <Package size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No orders found.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", overflow: "hidden" }}>
            {/* Table head */}
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr 40px", padding: "0.75rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Order</span>
              <span>Date</span>
              <span>Items</span>
              <span>Total</span>
              <span>Status</span>
              <span></span>
            </div>
            {filtered.map((order, i) => {
              const meta = STATUS_META[order.status];
              const date = new Date(order.createdAt);
              return (
                <Link key={order.id} href={"/orders/" + order.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 0.8fr 40px", padding: "1rem 1.25rem", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-color)" : "none", alignItems: "center", transition: "background 0.15s", textDecoration: "none", color: "inherit" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem", fontFamily: "monospace" }}>#{order.id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>{order.shippingAddress}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.875rem" }}>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <p style={{ fontSize: "0.875rem" }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>${order.totalAmount.toFixed(2)}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600, background: meta.bg, color: meta.color }}>
                    {meta.icon}{meta.label}
                  </span>
                  <ChevronRight size={16} color="var(--text-tertiary)" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
