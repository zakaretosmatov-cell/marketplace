"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { api, returnApi } from "@/lib/api";
import { Order } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ArrowLeft, RefreshCw } from "lucide-react";

function ReturnContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    api.getOrderById(orderId).then(o => { setOrder(o || null); setLoading(false); });
  }, [orderId]);

  const toggleItem = (productId: string) => {
    setSelectedItems(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !order) return;
    if (selectedItems.length === 0) { showToast("Select at least one item", "error"); return; }
    if (!reason.trim()) { showToast("Please provide a reason", "error"); return; }

    setSubmitting(true);
    try {
      await returnApi.createReturn({
        orderId: order.id,
        userId: user.uid,
        userEmail: user.email || "",
        items: order.items.filter(i => selectedItems.includes(i.productId)).map(i => ({
          productId: i.productId, productName: i.productName, quantity: i.quantity, price: i.price
        })),
        reason: reason.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      showToast("Return request submitted!", "success");
      router.push("/orders");
    } catch {
      showToast("Failed to submit return request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "600px" }}>
        <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <RefreshCw size={20} color="var(--text-secondary)" />
          </div>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Request Return</h1>
            {order && <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Order #{order.id.slice(-8).toUpperCase()}</p>}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : !order ? (
          <p style={{ color: "var(--text-secondary)" }}>Order not found.</p>
        ) : order.status !== "delivered" ? (
          <div style={{ padding: "2rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)" }}>Returns are only available for delivered orders.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
              <div style={{ padding: "0.875rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Select Items to Return
              </div>
              {order.items.map(item => (
                <label key={item.productId} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", borderBottom: "1px solid var(--border-color)", cursor: "pointer" }}>
                  <input type="checkbox" checked={selectedItems.includes(item.productId)} onChange={() => toggleItem(item.productId)} style={{ width: "16px", height: "16px", accentColor: "var(--accent-color)" }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{item.productName}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Qty: {item.quantity} · ${item.price.toFixed(2)}</p>
                  </div>
                </label>
              ))}
            </div>

            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Reason for Return *</label>
              <textarea required value={reason} onChange={e => setReason(e.target.value)} placeholder="Describe why you want to return this item..." style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", minHeight: "100px", resize: "vertical" }} />
            </div>

            <button type="submit" disabled={submitting}
              style={{ padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Submitting..." : "Submit Return Request"}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}

export default function ReturnPage() {
  return <Suspense><ReturnContent /></Suspense>;
}
