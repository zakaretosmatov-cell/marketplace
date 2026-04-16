"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { api, adApi } from "@/lib/api";
import { Ad, Product } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Plus, Megaphone, Clock, CheckCircle, XCircle, Calendar } from "lucide-react";

const AD_PRICE_PER_DAY = 100;

const STATUS_META: Record<Ad["status"], { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending Review", color: "#92400e", bg: "#fef3c7", icon: <Clock size={13} /> },
  approved: { label: "Approved",       color: "#14532d", bg: "#bbf7d0", icon: <CheckCircle size={13} /> },
  rejected: { label: "Rejected",       color: "#7f1d1d", bg: "#fee2e2", icon: <XCircle size={13} /> },
  expired:  { label: "Expired",        color: "#374151", bg: "#f3f4f6", icon: <Calendar size={13} /> },
};

export default function SellerAdsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [ads, setAds] = useState<Ad[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ productId: "", startDate: today, endDate: today });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      adApi.getAdsBySeller(user.uid),
      api.getProductsBySeller(user.uid),
    ]).then(([a, p]) => { setAds(a); setProducts(p); setLoading(false); });
  }, [user]);

  const days = form.startDate && form.endDate
    ? Math.max(0, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000) + 1)
    : 0;
  const totalCost = days * AD_PRICE_PER_DAY;

  const selectedProduct = products.find(p => p.id === form.productId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedProduct) return;
    if (days < 1) { showToast("End date must be after start date", "error"); return; }
    if (form.startDate < today) { showToast("Start date cannot be in the past", "error"); return; }

    setSubmitting(true);
    try {
      await adApi.createAd({
        sellerId: user.uid,
        sellerEmail: user.email || "",
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        productImage: selectedProduct.image,
        productPrice: selectedProduct.price,
        startDate: form.startDate,
        endDate: form.endDate,
        days,
        totalCost,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      const updated = await adApi.getAdsBySeller(user.uid);
      setAds(updated);
      setShowForm(false);
      setForm({ productId: "", startDate: today, endDate: today });
      showToast("Ad request submitted! Awaiting admin approval.", "success");
    } catch {
      showToast("Failed to submit ad request", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inp = { padding: "0.65rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", width: "100%" };

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Advertising</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Promote your products on the homepage and catalog. ${AD_PRICE_PER_DAY}/day.
            </p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", background: showForm ? "var(--bg-tertiary)" : "var(--accent-color)", color: showForm ? "var(--text-primary)" : "var(--bg-primary)", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>
            <Plus size={16} /> {showForm ? "Cancel" : "New Ad"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{ border: "2px solid var(--accent-color)", borderRadius: "var(--radius-lg)", padding: "1.75rem", marginBottom: "2rem", background: "var(--bg-card)" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Megaphone size={18} /> Create Ad Campaign
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>

              <div style={{ gridColumn: "span 2" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Select Product *</label>
                <select required style={inp} value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}>
                  <option value="">— Choose a product —</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} (${p.price})</option>)}
                </select>
              </div>

              {selectedProduct && (
                <div style={{ gridColumn: "span 2", display: "flex", gap: "1rem", padding: "1rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", alignItems: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "0.375rem" }} />
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{selectedProduct.name}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{selectedProduct.brand} · ${selectedProduct.price}</p>
                  </div>
                </div>
              )}

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Start Date *</label>
                <input required type="date" min={today} style={inp} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>End Date *</label>
                <input required type="date" min={form.startDate || today} style={inp} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
              </div>

              {/* Cost calculator */}
              <div style={{ gridColumn: "span 2", padding: "1.25rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center" }}>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Duration</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>{days} <span style={{ fontSize: "0.875rem", fontWeight: 400 }}>day{days !== 1 ? "s" : ""}</span></p>
                  </div>
                  <div>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Rate</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 800 }}>${AD_PRICE_PER_DAY}<span style={{ fontSize: "0.875rem", fontWeight: 400 }}>/day</span></p>
                  </div>
                  <div style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: "1rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Total Cost</p>
                    <p style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--accent-color)" }}>${totalCost.toLocaleString()}</p>
                  </div>
                </div>
                {days > 0 && (
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", textAlign: "center", marginTop: "0.75rem" }}>
                    Your ad will run from {new Date(form.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} to {new Date(form.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                )}
              </div>

              <div style={{ gridColumn: "span 2", display: "flex", gap: "0.75rem" }}>
                <button type="submit" disabled={submitting || days < 1 || !form.productId}
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: submitting || days < 1 || !form.productId ? "not-allowed" : "pointer", opacity: submitting || days < 1 || !form.productId ? 0.6 : 1 }}>
                  {submitting ? "Submitting..." : `Submit for Review — $${totalCost.toLocaleString()}`}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.875rem" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Ads list */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : ads.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <Megaphone size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No ad campaigns yet. Create your first one!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ads.map(ad => {
              const meta = STATUS_META[ad.status];
              return (
                <div key={ad.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1.25rem", background: "var(--bg-card)", display: "flex", gap: "1rem", alignItems: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.productImage} alt={ad.productName} style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "0.5rem", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{ad.productName}</p>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600, background: meta.bg, color: meta.color, flexShrink: 0 }}>
                        {meta.icon} {meta.label}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                      <span>📅 {new Date(ad.startDate).toLocaleDateString()} — {new Date(ad.endDate).toLocaleDateString()}</span>
                      <span>⏱ {ad.days} day{ad.days !== 1 ? "s" : ""}</span>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>${ad.totalCost.toLocaleString()}</span>
                    </div>
                    {ad.adminNote && (
                      <p style={{ fontSize: "0.75rem", color: ad.status === "rejected" ? "var(--error)" : "var(--text-secondary)", marginTop: "0.3rem" }}>
                        Admin note: {ad.adminNote}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
