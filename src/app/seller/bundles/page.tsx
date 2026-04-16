"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { api, bundleApi } from "@/lib/api";
import { Bundle, Product } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Plus, Package, Trash2, ToggleLeft, ToggleRight, Tag } from "lucide-react";

export default function SellerBundlesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    selectedIds: [] as string[],
    discountPercent: 10,
    stock: 10,
  });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      bundleApi.getBundlesBySeller(user.uid),
      api.getProductsBySeller(user.uid),
    ]).then(([b, p]) => { setBundles(b); setProducts(p); setLoading(false); });
  }, [user]);

  const selectedProducts = products.filter(p => form.selectedIds.includes(p.id));
  const originalPrice = selectedProducts.reduce((s, p) => s + p.price, 0);
  const bundlePrice = originalPrice * (1 - form.discountPercent / 100);
  const savings = originalPrice - bundlePrice;

  const toggleProduct = (id: string) => {
    setForm(f => ({
      ...f,
      selectedIds: f.selectedIds.includes(id)
        ? f.selectedIds.filter(x => x !== id)
        : [...f.selectedIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (form.selectedIds.length < 2) { showToast("Select at least 2 products", "error"); return; }

    setSubmitting(true);
    try {
      await bundleApi.createBundle({
        sellerId: user.uid,
        title: form.title,
        description: form.description,
        productIds: form.selectedIds,
        productNames: selectedProducts.map(p => p.name),
        productImages: selectedProducts.map(p => p.image),
        originalPrice,
        bundlePrice: Math.round(bundlePrice * 100) / 100,
        discountPercent: form.discountPercent,
        stock: form.stock,
        active: true,
        createdAt: new Date().toISOString(),
      });
      const updated = await bundleApi.getBundlesBySeller(user.uid);
      setBundles(updated);
      setShowForm(false);
      setForm({ title: "", description: "", selectedIds: [], discountPercent: 10, stock: 10 });
      showToast("Bundle created!", "success");
    } catch {
      showToast("Failed to create bundle", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (bundle: Bundle) => {
    await bundleApi.updateBundle(bundle.id, { active: !bundle.active });
    setBundles(prev => prev.map(b => b.id === bundle.id ? { ...b, active: !b.active } : b));
  };

  const handleDelete = async (id: string) => {
    await bundleApi.deleteBundle(id);
    setBundles(prev => prev.filter(b => b.id !== id));
    showToast("Bundle deleted", "success");
  };

  const inp = { padding: "0.65rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", width: "100%" };

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Bundle Deals</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
              Group 2+ products together with a discount to boost sales.
            </p>
          </div>
          <button onClick={() => setShowForm(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.65rem 1.25rem", borderRadius: "var(--radius-md)", background: showForm ? "var(--bg-tertiary)" : "var(--accent-color)", color: showForm ? "var(--text-primary)" : "var(--bg-primary)", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>
            <Plus size={16} /> {showForm ? "Cancel" : "New Bundle"}
          </button>
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{ border: "2px solid var(--accent-color)", borderRadius: "var(--radius-lg)", padding: "1.75rem", marginBottom: "2rem", background: "var(--bg-card)" }}>
            <h2 style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Tag size={18} /> Create Bundle
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Bundle Title *</label>
                  <input required style={inp} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Gaming Setup Bundle" />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Stock *</label>
                  <input required type="number" min="1" style={inp} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) }))} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Description</label>
                <textarea style={{ ...inp, minHeight: "70px", resize: "vertical" }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe what's included..." />
              </div>

              {/* Product selector */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
                  Select Products * <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}>(min 2)</span>
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", maxHeight: "280px", overflowY: "auto", padding: "0.25rem" }}>
                  {products.map(p => {
                    const selected = form.selectedIds.includes(p.id);
                    return (
                      <div key={p.id} onClick={() => toggleProduct(p.id)}
                        style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", borderRadius: "var(--radius-md)", border: `2px solid ${selected ? "var(--accent-color)" : "var(--border-color)"}`, background: selected ? "var(--accent-soft)" : "var(--bg-secondary)", cursor: "pointer", transition: "all 0.15s" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.image} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "0.375rem", flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "0.8rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                          <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>${p.price}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discount */}
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>
                  Discount: <span style={{ color: "var(--accent-color)" }}>{form.discountPercent}%</span>
                </label>
                <input type="range" min="5" max="50" step="5" value={form.discountPercent}
                  onChange={e => setForm(f => ({ ...f, discountPercent: parseInt(e.target.value) }))}
                  style={{ width: "100%", accentColor: "var(--accent-color)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text-tertiary)" }}>
                  <span>5%</span><span>50%</span>
                </div>
              </div>

              {/* Price preview */}
              {form.selectedIds.length >= 2 && (
                <div style={{ padding: "1.25rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", textAlign: "center" }}>
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Original</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: 700, textDecoration: "line-through", color: "var(--text-tertiary)" }}>${originalPrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Bundle Price</p>
                      <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--success)" }}>${bundlePrice.toFixed(2)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>Customer Saves</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--error)" }}>-${savings.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="submit" disabled={submitting || form.selectedIds.length < 2}
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: submitting || form.selectedIds.length < 2 ? "not-allowed" : "pointer", opacity: form.selectedIds.length < 2 ? 0.6 : 1 }}>
                  {submitting ? "Creating..." : "Create Bundle"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontSize: "0.875rem" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bundles list */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : bundles.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <Package size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No bundles yet. Create your first bundle deal!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {bundles.map(bundle => (
              <div key={bundle.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1.25rem", background: "var(--bg-card)", opacity: bundle.active ? 1 : 0.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{bundle.title}</p>
                      <span style={{ padding: "0.15rem 0.5rem", borderRadius: "var(--radius-pill)", background: "#fee2e2", color: "#991b1b", fontSize: "0.7rem", fontWeight: 700 }}>
                        -{bundle.discountPercent}%
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{bundle.description}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button onClick={() => toggleActive(bundle)} style={{ background: "none", border: "none", cursor: "pointer", color: bundle.active ? "var(--success)" : "var(--text-tertiary)" }}>
                      {bundle.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                    <button onClick={() => handleDelete(bundle.id)} style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "var(--bg-tertiary)", border: "none", cursor: "pointer", color: "var(--error)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {bundle.productImages.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt={bundle.productNames[i]} title={bundle.productNames[i]}
                      style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "0.375rem", border: "1px solid var(--border-color)" }} />
                  ))}
                </div>

                <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                  <span style={{ textDecoration: "line-through" }}>${bundle.originalPrice.toFixed(2)}</span>
                  <span style={{ fontWeight: 700, color: "var(--success)", fontSize: "0.9rem" }}>${bundle.bundlePrice.toFixed(2)}</span>
                  <span>Stock: {bundle.stock}</span>
                  <span style={{ color: bundle.active ? "var(--success)" : "var(--text-tertiary)" }}>{bundle.active ? "Active" : "Inactive"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
