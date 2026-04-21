"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { api, adminApi } from "@/lib/api";
import Link from "next/link";
import { TrendingUp, Package, ShoppingBag, DollarSign, Users, CheckCircle, RefreshCw, MessageSquare, Settings, Tag } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0, pendingOrders: 0, commission: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getProducts(), api.getAllOrders(), adminApi.getAllUsers()]).then(([products, orders, users]) => {
      const revenue = orders.filter(o => ["paid","processing","shipped","delivered"].includes(o.status)).reduce((s, o) => s + o.totalAmount, 0);
      setStats({ products: products.length, orders: orders.length, revenue: Math.round(revenue * 100) / 100, users: users.length, pendingOrders: orders.filter(o => o.status === "pending").length, commission: Math.round(revenue * 0.05 * 100) / 100 });
      setLoading(false);
    });
  }, []);

  const kpiCards = [
    { label: "GMV", value: "$" + stats.revenue.toLocaleString(), sub: "Gross Merchandise Volume", icon: <DollarSign size={20} />, color: "#059669", bg: "#dcfce7" },
    { label: "Platform Revenue", value: "$" + stats.commission.toLocaleString(), sub: "5% commission", icon: <TrendingUp size={20} />, color: "#2563eb", bg: "#dbeafe" },
    { label: "Total Orders", value: stats.orders, sub: stats.pendingOrders + " pending", icon: <ShoppingBag size={20} />, color: "#d97706", bg: "#fef3c7" },
    { label: "Users", value: stats.users, sub: "Registered accounts", icon: <Users size={20} />, color: "#7c3aed", bg: "#ede9fe" },
  ];

  const sections = [
    { title: "User Management", desc: "Buyers, sellers, roles", href: "/admin/users", icon: <Users size={18} />, color: "#2563eb" },
    { title: "Seller Verification", desc: "Review applications", href: "/admin/sellers", icon: <CheckCircle size={18} />, color: "#059669" },
    { title: "Product Catalog", desc: "Moderate listings", href: "/admin/catalog", icon: <Package size={18} />, color: "#d97706" },
    { title: "Orders & Finance", desc: "Monitor orders", href: "/orders", icon: <ShoppingBag size={18} />, color: "#0891b2" },
    { title: "Advertising", desc: "Approve ad campaigns", href: "/admin/ads", icon: <TrendingUp size={18} />, color: "#7c3aed" },
    { title: "Promo Codes", desc: "Discount codes", href: "/admin/promos", icon: <Tag size={18} />, color: "#dc2626" },
    { title: "Returns & Disputes", desc: "Handle returns", href: "/admin/returns", icon: <RefreshCw size={18} />, color: "#0f766e" },
    { title: "Support Tickets", desc: "Customer support", href: "/admin/tickets", icon: <MessageSquare size={18} />, color: "#9333ea" },
    { title: "Platform Settings", desc: "Commission, fees", href: "/admin/settings", icon: <Settings size={18} />, color: "#475569" },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "1200px" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>Admin Dashboard</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Platform overview</p>
        </div>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: "120px", borderRadius: "var(--radius-xl)" }} />)}
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
              {kpiCards.map(card => (
                <div key={card.label} style={{ padding: "1.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", background: "var(--bg-card)" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "var(--radius-lg)", background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", color: card.color, marginBottom: "1rem" }}>{card.icon}</div>
                  <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.3rem" }}>{card.label}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "0.2rem" }}>{card.value}</p>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>{card.sub}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-tertiary)", marginBottom: "1rem" }}>Management</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.875rem" }}>
              {sections.map(section => (
                <Link key={section.title} href={section.href}
                  style={{ padding: "1.25rem 1.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "1rem" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = section.color; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
                >
                  <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: "color-mix(in srgb, " + section.color + " 12%, transparent)", display: "flex", alignItems: "center", justifyContent: "center", color: section.color, flexShrink: 0 }}>{section.icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.15rem" }}>{section.title}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{section.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}