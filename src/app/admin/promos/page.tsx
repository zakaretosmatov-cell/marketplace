"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { promoApi } from "@/lib/api";
import { PromoCode } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Plus, Trash2, Tag } from "lucide-react";

export default function AdminPromosPage() {
  const { showToast } = useToast();
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discountPercent: 10, maxUses: 100, expiresAt: "" });
  const [submitting, setSubmitting] = useState(false);

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  useEffect(() => {
    promoApi.getAllCodes().then(p => { setPromos(p); setLoading(false); });
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await promoApi.createCode({
        code: form.code.toUpperCase().trim(),
        discountPercent: form.discountPercent,
        maxUses: form.maxUses,
        usedCount: 0,
        expiresAt: new Date(form.expiresAt).toISOString(),
        active: true,
        createdAt: new Date().toISOString(),
      });
      const updated = await promoApi.getAllCodes();
      setPromos(updated);
      setShowForm(false);
      setForm({ code: "", discountPercent: 10, maxUses: 100, expiresAt: "" });
      showToast("Promo code created!", "success");
    } catch {
      showToast("Failed to create promo code", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await promoApi.deleteCode(id);
    setPromos(prev => prev.filter(p => p.id !== id));
    showToast("Promo code deleted", "success");
  };

  const inp = { padding: "0.65rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", width: "100%" };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "800px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>Promo Codes</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Manage discount codes for customers</p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", background: showForm ? "var(--bg-tertiary)" : "var(--accent-color)", color: showForm ? "var(--text-primary)" : "var(--bg-primary)", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>
            <Plus size={16} /> {showForm ? "Cancel" : "New Code"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={{ border: "2px solid var(--accent-color)", borderRadius: "var(--radius-lg)", padding: "1.5rem", marginBottom: "2rem", background: "var(--bg-card)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Code *</label>
              <input required style={{ ...inp, textTransform: "uppercase", fontFamily: "monospace", fontWeight: 700, letterSpacing: "0.1em" }} value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="SAVE20" />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Discount %</label>
              <input required type="number" min="1" max="90" style={inp} value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: parseInt(e.target.value) }))} />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Max Uses</label>
              <input required type="number" min="1" style={inp} value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: parseInt(e.target.value) }))} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Expires At *</label>
              <input required type="date" min={tomorrow} style={inp} value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <button type="submit" disabled={submitting} style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>
                {submitting ? "Creating..." : "Create Promo Code"}
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : promos.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <Tag size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No promo codes yet.</p>
          </div>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 40px", padding: "0.75rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Code</span><span>Discount</span><span>Uses</span><span>Expires</span><span>Status</span><span></span>
            </div>
            {promos.map((p, i) => {
              const expired = new Date(p.expiresAt) < new Date();
              const exhausted = p.usedCount >= p.maxUses;
              return (
                <div key={p.id} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 40px", padding: "0.875rem 1.25rem", borderBottom: i < promos.length - 1 ? "1px solid var(--border-color)" : "none", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em" }}>{p.code}</span>
                  <span style={{ fontWeight: 600, color: "var(--success)" }}>{p.discountPercent}%</span>
                  <span style={{ fontSize: "0.875rem" }}>{p.usedCount}/{p.maxUses}</span>
                  <span style={{ fontSize: "0.8rem", color: expired ? "var(--error)" : "var(--text-secondary)" }}>{new Date(p.expiresAt).toLocaleDateString()}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: expired || exhausted ? "var(--error)" : "var(--success)" }}>
                    {expired ? "Expired" : exhausted ? "Exhausted" : "Active"}
                  </span>
                  <button onClick={() => handleDelete(p.id)} style={{ width: "32px", height: "32px", borderRadius: "0.375rem", background: "var(--bg-tertiary)", border: "none", cursor: "pointer", color: "var(--error)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
