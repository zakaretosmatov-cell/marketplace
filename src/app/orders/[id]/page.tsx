"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, MapPin, Package, Clock, CheckCircle, Truck, XCircle, RefreshCw, CreditCard, Hash } from "lucide-react";

const ALL_STATUSES: Order["status"][] = ["pending", "paid", "processing", "shipped", "delivered"];

const STATUS_META: Record<Order["status"], { label: string; color: string; bg: string; icon: React.ReactNode; description: string }> = {
  pending:    { label: "Pending",    color: "#92400e", bg: "#fef3c7", icon: <Clock size={16} />,       description: "Order received, awaiting payment" },
  paid:       { label: "Paid",       color: "#1e40af", bg: "#dbeafe", icon: <CreditCard size={16} />,  description: "Payment confirmed" },
  processing: { label: "Processing", color: "#5b21b6", bg: "#ede9fe", icon: <RefreshCw size={16} />,   description: "Order is being prepared" },
  shipped:    { label: "Shipped",    color: "#065f46", bg: "#d1fae5", icon: <Truck size={16} />,       description: "Package is on the way" },
  delivered:  { label: "Delivered",  color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={16} />, description: "Order delivered successfully" },
  cancelled:  { label: "Cancelled",  color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={16} />,    description: "Order was cancelled" },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, role } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    if (!id) return;
    api.getOrderById(id as string).then(data => {
      setOrder(data || null);
      setLoading(false);
    });
  }, [id]);

  const handleStatusUpdate = async (newStatus: Order["status"]) => {
    if (!order) return;
    setUpdating(true);
    try {
      await api.updateOrderStatus(order.id, newStatus, noteInput || undefined);
      const updated = await api.getOrderById(order.id);
      setOrder(updated || null);
      setNoteInput("");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <ProtectedRoute>
      <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading order...</div>
    </ProtectedRoute>
  );

  if (!order) return (
    <ProtectedRoute>
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-secondary)" }}>Order not found.</p>
      </div>
    </ProtectedRoute>
  );

  const meta = STATUS_META[order.status];
  const createdDate = new Date(order.createdAt);
  const canManage = role === "admin" || role === "seller";
  const historyMap = new Map((order.statusHistory || []).map(e => [e.status, e]));
  const isCancelled = order.status === "cancelled";
  const inp = { padding: "0.6rem 0.9rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem" };

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>

        <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={16} /> Back to orders
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Hash size={20} color="var(--text-tertiary)" />
              {order.id.slice(-10).toUpperCase()}
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Placed on {createdDate.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at {createdDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.9rem", borderRadius: "0.375rem", fontSize: "0.875rem", fontWeight: 600, background: meta.bg, color: meta.color }}>
            {meta.icon} {meta.label}
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", padding: "1.5rem", background: "var(--bg-card)" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Order Timeline</h2>
              {isCancelled ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  {(order.statusHistory || []).map((event, i) => {
                    const m = STATUS_META[event.status];
                    return (
                      <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: m.bg, color: m.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m.icon}</div>
                        <div style={{ flex: 1, paddingTop: "0.3rem" }}>
                          <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{m.label}</p>
                          {event.note && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.15rem" }}>{event.note}</p>}
                          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.15rem" }}>{new Date(event.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {ALL_STATUSES.map((s, i) => {
                    const event = historyMap.get(s);
                    const isCompleted = !!event;
                    const isCurrent = order.status === s;
                    const m = STATUS_META[s];
                    const isLast = i === ALL_STATUSES.length - 1;
                    return (
                      <div key={s} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isCompleted ? m.bg : "var(--bg-tertiary)", color: isCompleted ? m.color : "var(--text-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: isCurrent ? "2px solid " + m.color : "2px solid transparent" }}>{m.icon}</div>
                          {!isLast && <div style={{ width: "2px", height: "32px", background: "var(--border-color)", margin: "2px 0" }} />}
                        </div>
                        <div style={{ flex: 1, paddingTop: "0.3rem", paddingBottom: isLast ? 0 : "1rem" }}>
                          <p style={{ fontWeight: isCurrent ? 700 : 500, fontSize: "0.875rem", color: isCompleted ? "var(--text-primary)" : "var(--text-tertiary)" }}>{m.label}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.1rem" }}>{m.description}</p>
                          {event && <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.15rem" }}>{new Date(event.timestamp).toLocaleString()}{event.note ? " вЂ” " + event.note : ""}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", overflow: "hidden", background: "var(--bg-card)" }}>
              <div style={{ padding: "0.875rem 1.25rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}>
                <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Items ({order.items.length})</h2>
              </div>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.875rem 1.25rem", borderBottom: i < order.items.length - 1 ? "1px solid var(--border-color)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "0.375rem", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={16} color="var(--text-tertiary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.productName}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div style={{ padding: "0.875rem 1.25rem", borderTop: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between" }}>
                <p style={{ fontWeight: 700 }}>Total</p>
                <p style={{ fontWeight: 700, fontSize: "1rem" }}>${order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", padding: "1.25rem", background: "var(--bg-card)" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Shipping Address</h2>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                <MapPin size={15} color="var(--text-tertiary)" style={{ marginTop: "0.2rem", flexShrink: 0 }} />
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6 }}>{order.shippingAddress}</p>
              </div>
              {order.trackingNumber && (
                <div style={{ marginTop: "0.75rem", padding: "0.5rem 0.75rem", background: "var(--bg-secondary)", borderRadius: "0.375rem", fontSize: "0.8rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Tracking: </span>
                  <span style={{ fontFamily: "monospace", fontWeight: 600 }}>{order.trackingNumber}</span>
                </div>
              )}
            </div>

            <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", padding: "1.25rem", background: "var(--bg-card)" }}>
              <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Summary</h2>
              {[
                { label: "Order ID", value: "#" + order.id.slice(-8).toUpperCase() },
                { label: "Date", value: createdDate.toLocaleDateString() },
                { label: "Status", value: meta.label },
                { label: "Items", value: order.items.length + " item(s)" },
                { label: "Total", value: "$" + order.totalAmount.toFixed(2) },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "0.45rem 0", borderBottom: "1px solid var(--border-color)", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--text-secondary)" }}>{row.label}</span>
                  <span style={{ fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}
            </div>

            {canManage && order.status !== "delivered" && order.status !== "cancelled" && (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "0.5rem", padding: "1.25rem", background: "var(--bg-card)" }}>
                <h2 style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Update Status</h2>
                <input value={noteInput} onChange={e => setNoteInput(e.target.value)} placeholder="Optional note..." style={{ ...inp, width: "100%", marginBottom: "0.75rem" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {ALL_STATUSES.filter(s => s !== order.status).map(s => {
                    const m = STATUS_META[s];
                    return (
                      <button key={s} onClick={() => handleStatusUpdate(s)} disabled={updating}
                        style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.9rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", cursor: updating ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500 }}
                        onMouseEnter={e => (e.currentTarget.style.background = m.bg)}
                        onMouseLeave={e => (e.currentTarget.style.background = "var(--bg-secondary)")}
                      >
                        <span style={{ color: m.color }}>{m.icon}</span> Mark as {m.label}
                      </button>
                    );
                  })}
                  <button onClick={() => handleStatusUpdate("cancelled")} disabled={updating}
                    style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.9rem", borderRadius: "0.375rem", border: "1px solid #fecaca", background: "#fff5f5", color: "#991b1b", cursor: updating ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 500 }}>
                    <XCircle size={16} /> Cancel Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}