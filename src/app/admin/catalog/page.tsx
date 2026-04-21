"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Search, Eye, Trash2, Package, CheckCircle, XCircle } from "lucide-react";

export default function AdminCatalogPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    api.getProducts().then(p => { setProducts(p); setLoading(false); });
  }, []);

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category))).sort()];

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Delete " + name + "?")) return;
    setDeleting(id);
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast("Product deleted", "success");
    } catch { showToast("Failed to delete", "error"); }
    finally { setDeleting(null); }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "1200px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800 }}>Product Catalog</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{products.length} total products</p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.55rem 0.875rem", background: "var(--bg-secondary)", flex: 1, minWidth: "200px" }}>
            <Search size={15} color="var(--text-tertiary)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }} />
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            style={{ padding: "0.55rem 0.875rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "0.875rem", minWidth: "160px" }}>
            {categories.map(c => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", padding: "0.75rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Rating</span><span>Actions</span>
            </div>
            {filtered.map((p, i) => (
              <div key={p.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 80px", padding: "0.875rem 1.25rem", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-color)" : "none", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "0.375rem", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: "0.8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{p.brand}</p>
                  </div>
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{p.category}</span>
                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>${p.price}</span>
                <span style={{ fontSize: "0.875rem", color: p.stock === 0 ? "var(--error)" : p.stock < 5 ? "var(--warning)" : "var(--success)", fontWeight: 500 }}>{p.stock}</span>
                <span style={{ fontSize: "0.875rem" }}>{p.rating > 0 ? p.rating.toFixed(1) + " в…" : "вЂ”"}</span>
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <Link href={"/catalog/" + p.id} style={{ width: "30px", height: "30px", borderRadius: "0.375rem", background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent-color)" }}>
                    <Eye size={14} />
                  </Link>
                  <button onClick={() => handleDelete(p.id, p.name)} disabled={deleting === p.id}
                    style={{ width: "30px", height: "30px", borderRadius: "0.375rem", background: "var(--bg-tertiary)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--error)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}