"use client";
import { useEffect, useState, useMemo } from "react";
import { Product } from "@/lib/types";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import CategoryTree from "@/components/CategoryTree";
import { CATEGORY_TREE, getAllIds } from "@/lib/categories";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    api.getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let list = products;
    if (selectedCat) {
      // find the node and get all descendant ids
      const findNode = (nodes: typeof CATEGORY_TREE, id: string): typeof CATEGORY_TREE[0] | null => {
        for (const n of nodes) {
          if (n.id === id) return n;
          if (n.children) { const found = findNode(n.children, id); if (found) return found; }
        }
        return null;
      };
      const node = findNode(CATEGORY_TREE, selectedCat);
      const ids = node ? getAllIds(node) : [selectedCat];
      list = list.filter(p => ids.includes(p.category));
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }, [products, selectedCat, search]);

  const Sidebar = () => (
    <div style={{ width: "220px", flexShrink: 0 }}>
      <div style={{ position: "sticky", top: "calc(var(--header-height) + 1rem)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Categories</p>
          {selectedCat && (
            <button onClick={() => setSelectedCat(null)} style={{ fontSize: "0.75rem", color: "var(--accent-color)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>
        <div
          onClick={() => setSelectedCat(null)}
          style={{ padding: "0.4rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.875rem", cursor: "pointer", fontWeight: !selectedCat ? 600 : 400, color: !selectedCat ? "var(--accent-color)" : "var(--text-secondary)", backgroundColor: !selectedCat ? "var(--accent-soft)" : "transparent", marginBottom: "0.25rem" }}
        >
          All Products
        </div>
        <CategoryTree nodes={CATEGORY_TREE} selected={selectedCat} onSelect={setSelectedCat} />
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: "2rem 0" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Catalog</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.2rem" }}>
            {loading ? "Loading..." : filtered.length + " products" + (selectedCat ? " in " + selectedCat : "")}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem", padding: "0.6rem 1rem", background: "var(--bg-secondary)", minWidth: "260px" }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex" }}><X size={14} /></button>}
          </div>
          {/* Mobile filter toggle */}
          <button onClick={() => setSidebarOpen(o => !o)} style={{ display: "none", padding: "0.6rem", border: "1px solid var(--border-color)", borderRadius: "0.5rem", background: "var(--bg-secondary)", cursor: "pointer", color: "var(--text-primary)" }} className="mobile-filter-btn">
            <SlidersHorizontal size={18} />
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        {/* Sidebar desktop */}
        <div className="catalog-sidebar">
          <Sidebar />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }}>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} onClick={() => setSidebarOpen(false)} />
            <div style={{ width: "260px", background: "var(--bg-primary)", padding: "1.5rem", overflowY: "auto", borderLeft: "1px solid var(--border-color)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <p style={{ fontWeight: 700 }}>Categories</p>
                <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><X size={18} /></button>
              </div>
              <Sidebar />
            </div>
          </div>
        )}

        {/* Products grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ height: "360px", borderRadius: "1rem", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "0.5rem" }}>
              <p style={{ color: "var(--text-secondary)" }}>No products found{selectedCat ? " in this category" : ""}.</p>
              {(selectedCat || search) && (
                <button onClick={() => { setSelectedCat(null); setSearch(""); }} style={{ marginTop: "1rem", color: "var(--accent-color)", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem" }}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .catalog-sidebar { display: block; }
        .mobile-filter-btn { display: none !important; }
        @media (max-width: 768px) {
          .catalog-sidebar { display: none; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
