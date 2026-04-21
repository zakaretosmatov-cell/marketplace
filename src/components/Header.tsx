"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { Search, ShoppingCart, Heart, LogOut, X, Zap, Sun, Moon, Camera } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, role, logout, isLoading } = useAuth();
  const { cartItems } = useCart();
  const { isDark, setTheme } = useTheme();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visualSearching, setVisualSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleVisualSearch = async (file: File) => {
    setVisualSearching(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = (e.target?.result as string).split(',')[1];
        const mimeType = file.type;

        const res = await fetch('/api/visual-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType })
        });
        const data = await res.json();
        if (data.query) {
          setSearchQuery(data.query);
          router.push(`/catalog?q=${encodeURIComponent(data.query)}`);
        }
        setVisualSearching(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setVisualSearching(false);
    }
  };

  return (
    <header style={{
      height: "var(--header-height)",
      backgroundColor: "var(--glass-bg)",
      backdropFilter: "blur(16px)",
      WebkitBackdropFilter: "blur(16px)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      borderBottom: "1px solid var(--border-color)",
    }}>
      <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", gap: "1.5rem" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.03em", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TechNova" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
        </Link>

        {/* Nav links вЂ” desktop */}
        <nav style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
          {[
            { href: "/catalog", label: "Catalog" },
            { href: "/orders", label: "Orders" },
            { href: "/returns", label: "Returns" },
            ...(role === "admin" ? [{ href: "/admin", label: "Admin" }, { href: "/admin/ads", label: "Ads" }, { href: "/admin/sellers", label: "Sellers" }, { href: "/admin/users", label: "Users" }, { href: "/admin/promos", label: "Promos" }, { href: "/admin/returns", label: "Returns" }] : []),
            ...(role === "seller" ? [{ href: "/seller", label: "Seller" }, { href: "/seller/analytics", label: "Analytics" }, { href: "/seller/orders", label: "Orders" }, { href: "/seller/reviews", label: "Reviews" }, { href: "/seller/qa", label: "Q&A" }, { href: "/seller/ads", label: "Ads" }, { href: "/seller/bundles", label: "Bundles" }] : []),
          ].map(({ href, label }) => (
            <Link key={href} href={href} style={{ padding: "0.4rem 0.75rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >{label}</Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: "420px", margin: "0 auto", display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.45rem 0.875rem" }}>
          <Search size={15} color="var(--text-tertiary)" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }}
          />
          {searchQuery && (
            <button type="button" onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", padding: 0 }}>
              <X size={14} />
            </button>
          )}
          <button type="button" onClick={() => fileInputRef.current?.click()}
            title="Search by image"
            style={{ background: "none", border: "none", cursor: visualSearching ? "not-allowed" : "pointer", color: visualSearching ? "var(--accent-color)" : "var(--text-tertiary)", display: "flex", padding: 0, flexShrink: 0 }}>
            {visualSearching ? (
              <div style={{ width: "15px", height: "15px", border: "2px solid var(--border-color)", borderTopColor: "var(--accent-color)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            ) : (
              <Camera size={15} />
            )}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleVisualSearch(f); e.target.value = ''; }} />
        </form>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
          {/* Dark mode toggle */}
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
            style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)" }}
            title={isDark ? "Light mode" : "Dark mode"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link href="/wishlist" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
            <Heart size={17} />
          </Link>

          <Link href="/cart" style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", position: "relative" }}>
            <ShoppingCart size={17} />
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "var(--error)", color: "white", fontSize: "0.6rem", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, border: "2px solid var(--bg-primary)" }}>
                {totalItems}
              </span>
            )}
          </Link>

          {isLoading ? (
            <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", animation: "pulse 1.5s infinite" }} />
          ) : user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.75rem 0.3rem 0.3rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-pill)" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-color)", color: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>
                  {(user.displayName || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{user.displayName || "Account"}</span>
              </Link>
              <button onClick={logout} style={{ width: "36px", height: "36px", borderRadius: "var(--radius-md)", background: "var(--bg-secondary)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--error)" }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}
