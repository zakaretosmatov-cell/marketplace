"use client";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product } from "@/lib/types";
import { api, bundleApi } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import BundleCard from "@/components/BundleCard";
import CategoryTree from "@/components/CategoryTree";
import { CATEGORY_TREE, getAllIds } from "@/lib/categories";
import { Search, SlidersHorizontal, X, ChevronDown, Star } from "lucide-react";

type SortKey = "newest" | "price-asc" | "price-desc" | "rating" | "name";

import { Bundle } from "@/lib/types";

function CatalogContent() {
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedCat, setSelectedCat] = useState<string | null>(searchParams.get("cat"));

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync with URL params when they change
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("cat");
    setSearch(q);
    setDebouncedSearch(q);
    if (cat) setSelectedCat(cat);
  }, [searchParams]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("newest");

  useEffect(() => {
    Promise.all([api.getProducts(), bundleApi.getActiveBundles()])
      .then(([p, b]) => { setProducts(p); setBundles(b); setLoading(false); });
  }, []);

  const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand))).sort(), [products]);

  const priceRange = useMemo(() => {
    if (!products.length) return { min: 0, max: 10000 };
    return { min: Math.floor(Math.min(...products.map(p => p.price))), max: Math.ceil(Math.max(...products.map(p => p.price))) };
  }, [products]);

  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedCat) {
      const findNode = (nodes: typeof CATEGORY_TREE, id: string): typeof CATEGORY_TREE[0] | null => {
        for (const n of nodes) {
          if (n.id === id) return n;
          if (n.children) { const f = findNode(n.children, id); if (f) return f; }
        }
        return null;
      };
      const node = findNode(CATEGORY_TREE, selectedCat);
      const ids = node ? getAllIds(node) : [selectedCat];
      list = list.filter(p => ids.includes(p.category));
    }

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    const min = parseFloat(priceMin);
    const max = parseFloat(priceMax);
    if (!isNaN(min)) list = list.filter(p => p.price >= min);
    if (!isNaN(max)) list = list.filter(p => p.price <= max);

    if (selectedBrands.size > 0) list = list.filter(p => selectedBrands.has(p.brand));
    if (minRating > 0) list = list.filter(p => p.rating >= minRating);
    if (inStockOnly) list = list.filter(p => p.stock > 0);

    switch (sortKey) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating": list.sort((a, b) => b.rating - a.rating); break;
      case "name": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    return list;
  }, [products, selectedCat, debouncedSearch, priceMin, priceMax, selectedBrands, minRating, inStockOnly, sortKey]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      const next = new Set(prev);
      next.has(brand) ? next.delete(brand) : next.add(brand);
      return next;
    });
  };

  const clearFilters = () => {
    setSearch(""); setSelectedCat(null); setPriceMin(""); setPriceMax("");
    setSelectedBrands(new Set()); setMinRating(0); setInStockOnly(false); setSortKey("newest");
    setPage(1);
  };

  const hasFilters = !!(search || selectedCat || priceMin || priceMax || selectedBrands.size > 0 || minRating > 0 || inStockOnly);
  const activeCount = [search, selectedCat, priceMin || priceMax, selectedBrands.size > 0, minRating > 0, inStockOnly].filter(Boolean).length;

  const paginated = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = filtered.length > page * PAGE_SIZE;

  const inp = { padding: "0.45rem 0.6rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.8rem", width: "100%" };

  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Categories */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Categories</p>
          {selectedCat && <button onClick={() => setSelectedCat(null)} style={{ fontSize: "0.7rem", color: "var(--accent-color)", background: "none", border: "none", cursor: "pointer" }}>Clear</button>}
        </div>
        <div onClick={() => setSelectedCat(null)} style={{ padding: "0.4rem 0.75rem", borderRadius: "0.375rem", fontSize: "0.8rem", cursor: "pointer", fontWeight: !selectedCat ? 600 : 400, color: !selectedCat ? "var(--accent-color)" : "var(--text-secondary)", background: !selectedCat ? "var(--accent-soft)" : "transparent", marginBottom: "0.25rem" }}>
          All Products
        </div>
        <CategoryTree nodes={CATEGORY_TREE} selected={selectedCat} onSelect={setSelectedCat} />
      </div>

      {/* Price */}
      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Price Range</p>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <input value={priceMin} onChange={e => setPriceMin(e.target.value)} placeholder={`$${priceRange.min}`} type="number" min="0" style={inp} />
          <span style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>—</span>
          <input value={priceMax} onChange={e => setPriceMax(e.target.value)} placeholder={`$${priceRange.max}`} type="number" min="0" style={inp} />
        </div>
      </div>

      {/* Rating */}
      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
        <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)", marginBottom: "0.75rem" }}>Min Rating</p>
        <div style={{ display: "flex", gap: "0.4rem" }}>
          {[0, 3, 4, 4.5].map(r => (
            <button key={r} onClick={() => setMinRating(r === minRating ? 0 : r)}
              style={{ padding: "0.3rem 0.6rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: minRating === r && r > 0 ? "var(--accent-color)" : "var(--bg-secondary)", color: minRating === r && r > 0 ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.2rem" }}>
              {r === 0 ? "Any" : <><Star size={10} fill="#f59e0b" color="#f59e0b" />{r}+</>}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-secondary)" }}>Brands</p>
          {selectedBrands.size > 0 && <button onClick={() => setSelectedBrands(new Set())} style={{ fontSize: "0.7rem", color: "var(--accent-color)", background: "none", border: "none", cursor: "pointer" }}>Clear</button>}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxHeight: "200px", overflowY: "auto" }}>
          {brands.map(b => (
            <label key={b} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.8rem", padding: "0.15rem 0" }}>
              <input type="checkbox" checked={selectedBrands.has(b)} onChange={() => toggleBrand(b)} style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "var(--accent-color)" }} />
              <span style={{ color: selectedBrands.has(b) ? "var(--text-primary)" : "var(--text-secondary)" }}>{b}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div style={{ paddingTop: "1rem", borderTop: "1px solid var(--border-color)" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.8rem" }}>
          <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} style={{ width: "14px", height: "14px", cursor: "pointer", accentColor: "var(--accent-color)" }} />
          <span>In stock only</span>
        </label>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} style={{ padding: "0.5rem 0.875rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer" }}>
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.4rem" }}>
            <a href="/" style={{ color: "var(--text-tertiary)" }}>Home</a>
            <span>›</span>
            <span style={{ color: "var(--text-secondary)" }}>Catalog</span>
            {selectedCat && <><span>›</span><span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{selectedCat}</span></>}
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Catalog</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "0.2rem" }}>
            {loading ? "Loading..." : `${filtered.length} products${selectedCat ? ` in ${selectedCat}` : ""}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.55rem 0.875rem", background: "var(--bg-secondary)", minWidth: "280px" }}>
            <Search size={15} color="var(--text-tertiary)" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, brand, category..." style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }} />
            {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex" }}><X size={14} /></button>}
          </div>
          <button onClick={() => setSidebarOpen(o => !o)} className="mobile-filter-btn"
            style={{ padding: "0.55rem 0.875rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", background: hasFilters ? "var(--accent-color)" : "var(--bg-secondary)", cursor: "pointer", color: hasFilters ? "var(--bg-primary)" : "var(--text-primary)", display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", fontWeight: 500 }}>
            <SlidersHorizontal size={16} />
            Filters {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>
      </div>

      {/* Active filter chips */}
      {hasFilters && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {search && <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}>Search: "{search}" <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>×</button></span>}
          {selectedCat && <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}>{selectedCat} <button onClick={() => setSelectedCat(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>×</button></span>}
          {(priceMin || priceMax) && <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}>${priceMin || "0"} — ${priceMax || "∞"} <button onClick={() => { setPriceMin(""); setPriceMax(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>×</button></span>}
          {Array.from(selectedBrands).map(b => <span key={b} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}>{b} <button onClick={() => toggleBrand(b)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>×</button></span>)}
          {minRating > 0 && <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}><Star size={10} fill="#f59e0b" color="#f59e0b" />{minRating}+ <button onClick={() => setMinRating(0)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>×</button></span>}
          {inStockOnly && <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", fontSize: "0.75rem", fontWeight: 500 }}>In stock <button onClick={() => setInStockOnly(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", lineHeight: 1 }}>×</button></span>}
          <button onClick={clearFilters} style={{ padding: "0.25rem 0.6rem", borderRadius: "var(--radius-pill)", background: "none", border: "1px solid var(--border-color)", fontSize: "0.75rem", cursor: "pointer", color: "var(--text-secondary)" }}>Clear all</button>
        </div>
      )}

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>

        {/* Desktop sidebar */}
        <div className="catalog-sidebar" style={{ width: "240px", flexShrink: 0 }}>
          <SidebarContent />
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 300, display: "flex" }} onClick={() => setSidebarOpen(false)}>
            <div style={{ flex: 1, background: "rgba(0,0,0,0.4)" }} />
            <div style={{ width: "300px", background: "var(--bg-primary)", padding: "1.5rem", overflowY: "auto", borderLeft: "1px solid var(--border-color)" }} onClick={e => e.stopPropagation()}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <p style={{ fontWeight: 700 }}>Filters {activeCount > 0 && `(${activeCount})`}</p>
                <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}><X size={18} /></button>
              </div>
              <SidebarContent />
            </div>
          </div>
        )}

        {/* Products */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
            <div style={{ position: "relative" }}>
              <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}
                style={{ padding: "0.4rem 2rem 0.4rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.8rem", cursor: "pointer", appearance: "none", fontWeight: 500 }}>
                <option value="newest">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="name">Name A–Z</option>
              </select>
              <ChevronDown size={13} color="var(--text-tertiary)" style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            </div>
          </div>

          {/* Bundles section */}
          {!loading && bundles.length > 0 && !debouncedSearch && !selectedCat && (
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                🎁 Bundle Deals
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
                {bundles.map(b => <BundleCard key={b.id} bundle={b} />)}
              </div>
            </div>
          )}

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{ height: "340px", borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
              <p style={{ color: "var(--text-secondary)", marginBottom: "1rem" }}>No products match your filters.</p>
              {hasFilters && <button onClick={clearFilters} style={{ padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>Clear all filters</button>}
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
                {paginated.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
              {hasMore && (
                <div style={{ textAlign: "center", marginTop: "2rem" }}>
                  <button onClick={() => setPage(p => p + 1)}
                    style={{ padding: "0.75rem 2rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.875rem", cursor: "pointer" }}>
                    Load more ({filtered.length - paginated.length} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        .catalog-sidebar { display: block; }
        .mobile-filter-btn { display: none !important; }
        @media (max-width: 768px) {
          .catalog-sidebar { display: none !important; }
          .mobile-filter-btn { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
