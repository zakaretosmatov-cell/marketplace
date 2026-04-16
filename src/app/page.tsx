"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, ChevronRight, Clock } from "lucide-react";

const CATEGORIES = [
  { label: "Smartphones", icon: "рџ“±", id: "iOS" },
  { label: "Laptops", icon: "рџ’»", id: "Ultrabooks" },
  { label: "TVs", icon: "рџ“є", id: "OLED TVs" },
  { label: "Audio", icon: "рџЋ§", id: "Headphones" },
  { label: "Gaming", icon: "рџЋ®", id: "Gaming Consoles" },
  { label: "Wearables", icon: "вЊљ", id: "Smartwatches" },
  { label: "Tablets", icon: "рџ“џ", id: "iPad" },
  { label: "Trending", icon: "рџ”Ґ", id: "Trending" },
];

const FEATURES = [
  { icon: <Truck size={20} />, title: "Free Shipping", desc: "On orders over $99" },
  { icon: <ShieldCheck size={20} />, title: "Secure Payment", desc: "256-bit SSL encryption" },
  { icon: <RefreshCw size={20} />, title: "Easy Returns", desc: "30-day return policy" },
  { icon: <Headphones size={20} />, title: "24/7 Support", desc: "Always here to help" },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { items: recentlyViewed } = useRecentlyViewed();

  useEffect(() => {
    api.getProducts().then(data => { setProducts(data); setLoading(false); });
  }, []);

  const featured = products.slice(0, 8);
  const hero = products.find(p => p.category === "iOS" || p.brand === "Apple") || products[0];

  return (
    <div style={{ paddingBottom: "4rem" }}>

      {/* Hero */}
      <section style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", padding: "4rem 1.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-pill)", padding: "0.3rem 0.75rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block" }} />
              New arrivals every week
            </div>
            <h1 style={{ fontSize: "3.25rem", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: "1.25rem" }}>
              The best tech,<br />
              <span style={{ color: "var(--text-tertiary)" }}>all in one place.</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "420px" }}>
              Discover the latest smartphones, laptops, TVs and accessories. Premium quality, competitive prices.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <Link href="/catalog" className="btn-primary" style={{ padding: "0.75rem 1.5rem", fontSize: "0.9rem" }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/catalog" className="btn-secondary" style={{ padding: "0.75rem 1.5rem", fontSize: "0.9rem" }}>
                View Catalog
              </Link>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {hero && (
              <div style={{ position: "relative", width: "100%", maxWidth: "420px" }}>
                <div style={{ background: "var(--bg-primary)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-color)", overflow: "hidden", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-lg)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.image} alt={hero.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", background: "var(--glass-bg)", backdropFilter: "blur(12px)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>{hero.name}</p>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{hero.brand}</p>
                  </div>
                  <p style={{ fontWeight: 800, fontSize: "1rem" }}>${hero.price.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ borderBottom: "1px solid var(--border-color)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0", padding: "0 1.5rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "1.25rem 1rem", borderRight: i < 3 ? "1px solid var(--border-color)" : "none" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{f.title}</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ padding: "3rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Shop by Category</h2>
          <Link href="/catalog" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            All categories <ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "0.75rem" }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/catalog?cat=${cat.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1rem 0.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", transition: "all 0.15s", textAlign: "center" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--text-tertiary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; }}
            >
              <span style={{ fontSize: "1.75rem" }}>{cat.icon}</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--text-secondary)" }}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ padding: "0 1.5rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Featured Products</h2>
          <Link href="/catalog" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: "320px", borderRadius: "var(--radius-lg)", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="container" style={{ padding: "0 1.5rem" }}>
        <div style={{ background: "var(--accent-color)", borderRadius: "var(--radius-xl)", padding: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: "0.5rem" }}>Limited time offer</p>
            <h2 style={{ color: "white", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1rem" }}>Up to 30% off<br />on selected items</h2>
            <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "white", color: "var(--accent-color)", padding: "0.625rem 1.25rem", borderRadius: "var(--radius-md)", fontWeight: 700, fontSize: "0.875rem" }}>
              Shop the sale <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ fontSize: "8rem", opacity: 0.15 }}>рџ›ЌпёЏ</div>
        </div>
      </section>
      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="container" style={{ padding: "3rem 1.5rem 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Clock size={18} color="var(--text-tertiary)" /> Recently Viewed
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {recentlyViewed.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
