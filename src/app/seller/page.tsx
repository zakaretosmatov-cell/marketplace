"use client";
import { useState, useEffect, useMemo } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Search, Plus, Pencil, Trash2, X, Package, ChevronDown } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const CATEGORIES = ["Laptops", "Smartphones", "Tablets", "Wearables", "Audio", "TVs", "Other"];

const EMPTY: Partial<Product> = {
  name: "", description: "", price: 0, stock: 0,
  category: "Laptops", brand: "", image: "",
  colors: [], sizes: [],
};

type SortKey = "name" | "price" | "stock" | "category";

export default function SellerPage() {
  const { user, role } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>(EMPTY);
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortAsc, setSortAsc] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getProductsBySeller(user.uid);
      setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [user, role]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
    if (filterCat !== "All") list = list.filter(p => p.category === filterCat);
    list.sort((a, b) => {
      const av = a[sortKey] ?? "";
      const bv = b[sortKey] ?? "";
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [products, search, filterCat, sortKey, sortAsc]);

  const openAdd = () => { setForm(EMPTY); setColorInput(""); setSizeInput(""); setEditingId(null); setModalOpen(true); };
  const openEdit = (p: Product) => { setForm({ ...p }); setColorInput(""); setSizeInput(""); setEditingId(p.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const addTag = (field: "colors" | "sizes", val: string, setter: (v: string) => void) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    setForm(f => ({ ...f, [field]: [...(f[field] || []), trimmed] }));
    setter("");
  };
  const removeTag = (field: "colors" | "sizes", idx: number) => {
    setForm(f => ({ ...f, [field]: (f[field] || []).filter((_, i) => i !== idx) }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (editingId) {
        await api.updateProduct(editingId, form);
        showToast("Product updated", "success");
      } else {
        await api.addProduct({ ...form, sellerId: user.uid });
        showToast("Product added", "success");
      }
      closeModal();
      fetchProducts();
    } catch {
      showToast("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product deleted", "success");
    } catch {
      showToast("Failed to delete", "error");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  const inp = { padding: "0.7rem 0.9rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", width: "100%", fontSize: "0.9rem" };

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>My Products</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{products.length} total listings</p>
          </div>
          <button onClick={openAdd} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-pill)", padding: "0.4rem 1rem", border: "1px solid var(--border-color)" }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or brand..." style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }} />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)} style={{ ...inp, width: "auto", minWidth: "140px" }}>
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["name", "price", "stock"] as SortKey[]).map(k => (
              <button key={k} onClick={() => toggleSort(k)} style={{ padding: "0.4rem 0.9rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: sortKey === k ? "var(--accent-color)" : "var(--bg-secondary)", color: sortKey === k ? "white" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                {k.charAt(0).toUpperCase() + k.slice(1)}
                {sortKey === k && <ChevronDown size={12} style={{ transform: sortAsc ? "none" : "rotate(180deg)" }} />}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
            <Package size={48} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No products found. Add your first product.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
                <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", flex: 1 }}>{p.name}</p>
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--accent-soft)", color: "var(--accent-color)", whiteSpace: "nowrap", marginLeft: "0.5rem" }}>{p.category}</span>
                  </div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>{p.brand}</p>
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.description}</p>
                  {p.colors && p.colors.length > 0 && (
                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                      {p.colors.map(c => <span key={c} style={{ width: "16px", height: "16px", borderRadius: "50%", background: c, border: "1px solid var(--border-color)", display: "inline-block" }} title={c} />)}
                    </div>
                  )}
                  {p.sizes && p.sizes.length > 0 && (
                    <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" }}>
                      {p.sizes.map(s => <span key={s} style={{ fontSize: "0.7rem", padding: "0.1rem 0.4rem", border: "1px solid var(--border-color)", borderRadius: "0.25rem" }}>{s}</span>)}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>${p.price.toLocaleString()}</p>
                      <p style={{ fontSize: "0.75rem", color: p.stock > 0 ? "var(--success)" : "var(--error)" }}>Stock: {p.stock}</p>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button onClick={() => openEdit(p)} style={{ padding: "0.5rem", borderRadius: "0.4rem", background: "var(--bg-tertiary)", color: "var(--accent-color)", display: "flex", border: "none", cursor: "pointer" }}><Pencil size={16} /></button>
                      <button onClick={() => setDeleteId(p.id)} style={{ padding: "0.5rem", borderRadius: "0.4rem", background: "var(--bg-tertiary)", color: "var(--error)", display: "flex", border: "none", cursor: "pointer" }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {modalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }} onClick={closeModal}>
            <div className="card" style={{ width: "100%", maxWidth: "680px", maxHeight: "90vh", overflowY: "auto", padding: "2rem" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>{editingId ? "Edit Product" : "Add New Product"}</h2>
                <button onClick={closeModal} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Product Name *</label>
                  <input required style={inp} value={form.name || ""} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. iPhone 15 Pro" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Brand *</label>
                  <input required style={inp} value={form.brand || ""} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Apple" />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Description *</label>
                  <textarea required style={{ ...inp, minHeight: "90px", resize: "vertical" }} value={form.description || ""} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe your product..." />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Category *</label>
                  <select required style={inp} value={form.category || "Laptops"} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Product Image *</label>
                  <ImageUpload value={form.image || ""} onChange={(url) => setForm(f => ({ ...f, image: url }))} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Price ($) *</label>
                  <input required type="number" step="0.01" min="0" style={inp} value={form.price || 0} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Stock *</label>
                  <input required type="number" min="0" style={inp} value={form.stock || 0} onChange={e => setForm(f => ({ ...f, stock: parseInt(e.target.value) }))} />
                </div>

                {/* Colors */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Colors (optional)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input style={{ ...inp, flex: 1 }} value={colorInput} onChange={e => setColorInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag("colors", colorInput, setColorInput); }}} placeholder="e.g. #FF0000 or Red" />
                    <button type="button" onClick={() => addTag("colors", colorInput, setColorInput)} style={{ padding: "0.7rem 1rem", borderRadius: "0.5rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-primary)" }}>Add</button>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {(form.colors || []).map((c, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.8rem" }}>
                        <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: c, border: "1px solid var(--border-color)", display: "inline-block" }} />
                        {c}
                        <button type="button" onClick={() => removeTag("colors", i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>Г—</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600 }}>Sizes (optional)</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input style={{ ...inp, flex: 1 }} value={sizeInput} onChange={e => setSizeInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag("sizes", sizeInput, setSizeInput); }}} placeholder="e.g. S, M, L, XL or 42" />
                    <button type="button" onClick={() => addTag("sizes", sizeInput, setSizeInput)} style={{ padding: "0.7rem 1rem", borderRadius: "0.5rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", cursor: "pointer", color: "var(--text-primary)" }}>Add</button>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {(form.sizes || []).map((s, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.2rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.8rem" }}>
                        {s}
                        <button type="button" onClick={() => removeTag("sizes", i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>Г—</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ gridColumn: "span 2", display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  <button type="submit" disabled={saving} className="btn-primary" style={{ flex: 1 }}>{saving ? "Saving..." : editingId ? "Save Changes" : "Publish Product"}</button>
                  <button type="button" onClick={closeModal} style={{ flex: 1, padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteId && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <div className="card" style={{ padding: "2rem", maxWidth: "400px", width: "100%", textAlign: "center" }}>
              <Trash2 size={40} color="var(--error)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Delete Product?</h3>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>This action cannot be undone.</p>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button onClick={() => handleDelete(deleteId)} className="btn-primary" style={{ flex: 1, background: "var(--error)" }}>Delete</button>
                <button onClick={() => setDeleteId(null)} style={{ flex: 1, padding: "0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}



