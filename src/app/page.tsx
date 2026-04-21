"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/types";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Headphones, ChevronRight, Clock, Star, Zap } from "lucide-react";

const CATEGORIES = [
  { label: "Smartphones", emoji: "рџ“±", id: "iOS", color: "#dbeafe", textColor: "#1e40af" },
  { label: "Laptops", emoji: "рџ’»", id: "Ultrabooks", color: "#dcfce7", textColor: "#166534" },
  { label: "TVs", emoji: "рџ“є", id: "OLED TVs", color: "#fef3c7", textColor: "#92400e" },
  { label: "Audio", emoji: "рџЋ§", id: "Headphones", color: "#fce7f3", textColor: "#9d174d" },
  { label: "Gaming", emoji: "рџЋ®", id: "Gaming Consoles", color: "#ede9fe", textColor: "#5b21b6" },
  { label: "Wearables", emoji: "вЊљ", id: "Smartwatches", color: "#d1fae5", textColor: "#065f46" },
  { label: "Tablets", emoji: "рџ“џ", id: "iPad", color: "#ffedd5", textColor: "#9a3412" },
  { label: "Trending", emoji: "рџ”Ґ", id: "Trending", color: "#fee2e2", textColor: "#991b1b" },
];

const FEATURES = [
  { icon: <Truck size={18} />, title: "Free Shipping", desc: "Orders over $99", color: "#dbeafe", iconColor: "#1e40af" },
  { icon: <ShieldCheck size={18} />, title: "Secure Payment", desc: "256-bit SSL", color: "#dcfce7", iconColor: "#166534" },
  { icon: <RefreshCw size={18} />, title: "Easy Returns", desc: "30-day policy", color: "#fef3c7", iconColor: "#92400e" },
  { icon: <Headphones size={18} />, title: "24/7 Support", desc: "Always here", color: "#ede9fe", iconColor: "#5b21b6" },
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
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div style={{ paddingBottom: "5rem" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)", borderBottom: "1px solid var(--border-color)", overflow: "hidden", position: "relative" }}>
        {/* Background decoration */}
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: "var(--accent-soft)", filter: "blur(80px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-50px", left: "-50px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(26,86,219,0.04)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", padding: "5rem 1.5rem", position: "relative" }}>
          <div style={{ animation: "fadeInUp 0.6s ease forwards" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "var(--accent-soft)", border: "1px solid var(--accent-light)", borderRadius: "var(--radius-pill)", padding: "0.35rem 0.875rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent-color)", marginBottom: "1.75rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--success)", display: "inline-block", animation: "pulse 2s infinite" }} />
              New arrivals every week
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", fontWeight: 800, lineHeight: 1.08, letterSpacing: "-0.04em", marginBottom: "1.5rem" }}>
              The best tech,<br />
              <span style={{ background: "linear-gradient(135deg, var(--accent-color), #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                all in one place.
              </span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", lineHeight: 1.75, marginBottom: "2.25rem", maxWidth: "400px" }}>
              Discover the latest smartphones, laptops, TVs and accessories. Premium quality, competitive prices.
            </p>
            <div style={{ display: "flex", gap: "0.875rem", flexWrap: "wrap" }}>
              <Link href="/catalog" className="btn-primary" style={{ padding: "0.875rem 1.75rem", fontSize: "0.9rem", borderRadius: "var(--radius-lg)" }}>
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link href="/catalog?sort=rating" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1.5rem", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontWeight: 500, fontSize: "0.9rem", transition: "all var(--transition-fast)" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-color)"; (e.currentTarget as HTMLElement).style.color = "var(--accent-color)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              >
                <Star size={15} fill="#f59e0b" color="#f59e0b" /> Top Rated
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: "1px solid var(--border-color)" }}>
              {[
                { value: "67+", label: "Products" },
                { value: "100%", label: "Verified" },
                { value: "24/7", label: "Support" },
              ].map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--accent-color)" }}>{s.value}</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero product card */}
          <div style={{ display: "flex", justifyContent: "center", animation: "fadeInUp 0.6s 0.15s ease both" }}>
            {hero && (
              <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
                {/* Floating badge */}
                <div style={{ position: "absolute", top: "-12px", right: "20px", zIndex: 10, background: "var(--accent-color)", color: "white", padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700, boxShadow: "var(--shadow-accent)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <Zap size={12} /> Featured
                </div>
                <div style={{ background: "var(--bg-card)", borderRadius: "var(--radius-2xl)", border: "1px solid var(--border-color)", overflow: "hidden", boxShadow: "var(--shadow-xl)", transition: "transform var(--transition-slow)" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-6px)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.image} alt={hero.name} style={{ width: "100%", height: "280px", objectFit: "cover" }} />
                  <div style={{ padding: "1.25rem" }}>
                    <p style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.3rem" }}>{hero.brand}</p>
                    <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.75rem" }}>{hero.name}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "var(--accent-color)" }}>${hero.price.toLocaleString()}</p>
                      <Link href={`/catalog/${hero.id}`} className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", borderRadius: "var(--radius-md)" }}>
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features strip */}
      <section style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-primary)" }}>
        <div className="container" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "0 1.5rem" }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "1.25rem 1rem", borderRight: i < 3 ? "1px solid var(--border-color)" : "none" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "var(--radius-md)", background: f.color, display: "flex", alignItems: "center", justifyContent: "center", color: f.iconColor, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.8rem" }}>{f.title}</p>
                <p style={{ color: "var(--text-tertiary)", fontSize: "0.72rem" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container" style={{ padding: "3.5rem 1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 className="section-title">Shop by Category</h2>
          <Link href="/catalog" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 500 }}>
            All <ChevronRight size={14} />
          </Link>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "0.75rem" }}>
          {CATEGORIES.map(cat => (
            <Link key={cat.id} href={`/catalog?cat=${cat.id}`}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", padding: "1.25rem 0.5rem", background: cat.color, border: "1px solid transparent", borderRadius: "var(--radius-xl)", transition: "all var(--transition-base)", textAlign: "center" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: "1.75rem", lineHeight: 1 }}>{cat.emoji}</span>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: cat.textColor }}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container" style={{ padding: "0 1.5rem 3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 className="section-title">Featured Products</h2>
          <Link href="/catalog" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 500 }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "320px", borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {featured.map((p, i) => (
              <div key={p.id} style={{ animation: `fadeInUp 0.4s ${i * 0.05}s ease both` }}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sale banner */}
      <section className="container" style={{ padding: "0 1.5rem 3.5rem" }}>
        <div style={{ background: "linear-gradient(135deg, var(--accent-color) 0%, #7c3aed 100%)", borderRadius: "var(--radius-2xl)", padding: "3rem 3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: "-40px", right: "200px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: "-60px", right: "80px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "relative" }}>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.875rem", marginBottom: "0.5rem", fontWeight: 500 }}>Limited time offer</p>
            <h2 style={{ fontFamily: "var(--font-display)", color: "white", fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.25rem", lineHeight: 1.1 }}>
              Up to 30% off<br />on selected items
            </h2>
            <Link href="/catalog" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "white", color: "var(--accent-color)", padding: "0.75rem 1.5rem", borderRadius: "var(--radius-lg)", fontWeight: 700, fontSize: "0.875rem", transition: "transform var(--transition-fast)" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              Shop the sale <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ fontSize: "7rem", opacity: 0.12, position: "relative", userSelect: "none" }}>рџ›ЌпёЏ</div>
        </div>
      </section>

      {/* Top Rated */}
      {topRated.length > 0 && (
        <section className="container" style={{ padding: "0 1.5rem 3.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Star size={20} fill="#f59e0b" color="#f59e0b" /> Top Rated
            </h2>
            <Link href="/catalog?sort=rating" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem", fontWeight: 500 }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {topRated.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="container" style={{ padding: "0 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 className="section-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
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