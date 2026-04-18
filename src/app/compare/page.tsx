"use client";
import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { X, ShoppingCart, Star } from "lucide-react";

const SPECS = [
  { key: "brand", label: "Brand" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price", format: (v: unknown) => `$${Number(v).toLocaleString()}` },
  { key: "rating", label: "Rating", format: (v: unknown) => `${v} ★` },
  { key: "reviewsCount", label: "Reviews" },
  { key: "stock", label: "Stock" },
  { key: "condition", label: "Condition", format: (v: unknown) => v ? String(v) : "New" },
];

export default function ComparePage() {
  const { items, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚖️</p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>No products to compare</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Add products to compare by clicking the compare button on product cards.</p>
        <Link href="/catalog" className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>Browse Catalog</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Compare Products</h1>
        <button onClick={clearCompare} style={{ fontSize: "0.875rem", color: "var(--text-secondary)", background: "none", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.4rem 0.875rem", cursor: "pointer" }}>
          Clear all
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          {/* Product headers */}
          <thead>
            <tr>
              <th style={{ width: "160px", padding: "0.75rem", textAlign: "left", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid var(--border-color)" }}>
                Spec
              </th>
              {items.map(p => (
                <th key={p.id} style={{ padding: "0.75rem", borderBottom: "1px solid var(--border-color)", verticalAlign: "top" }}>
                  <div style={{ position: "relative" }}>
                    <button onClick={() => removeFromCompare(p.id)} style={{ position: "absolute", top: 0, right: 0, background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)" }}>
                      <X size={14} />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "var(--radius-md)", marginBottom: "0.75rem" }} />
                    <Link href={`/catalog/${p.id}`} style={{ fontWeight: 700, fontSize: "0.875rem", display: "block", marginBottom: "0.5rem" }}>{p.name}</Link>
                    <button onClick={() => { addToCart(p, 1); showToast("Added to cart", "success"); }} disabled={p.stock === 0}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", padding: "0.5rem", borderRadius: "var(--radius-md)", background: p.stock === 0 ? "var(--bg-tertiary)" : "var(--accent-color)", color: p.stock === 0 ? "var(--text-tertiary)" : "var(--bg-primary)", fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: p.stock === 0 ? "not-allowed" : "pointer" }}>
                      <ShoppingCart size={13} /> Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SPECS.map((spec, si) => (
              <tr key={spec.key} style={{ background: si % 2 === 0 ? "var(--bg-secondary)" : "transparent" }}>
                <td style={{ padding: "0.75rem", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", borderBottom: "1px solid var(--border-color)" }}>
                  {spec.label}
                </td>
                {items.map(p => {
                  const val = (p as unknown as Record<string, unknown>)[spec.key];
                  const display = spec.format ? spec.format(val) : String(val ?? "—");
                  // Highlight best value for price (lowest) and rating (highest)
                  const allVals = items.map(x => Number((x as unknown as Record<string, unknown>)[spec.key]) || 0);
                  const isBest = spec.key === "price"
                    ? Number(val) === Math.min(...allVals)
                    : spec.key === "rating"
                    ? Number(val) === Math.max(...allVals)
                    : false;
                  return (
                    <td key={p.id} style={{ padding: "0.75rem", fontSize: "0.875rem", textAlign: "center", borderBottom: "1px solid var(--border-color)", fontWeight: isBest ? 700 : 400, color: isBest ? "var(--success)" : "var(--text-primary)" }}>
                      {display}
                      {isBest && spec.key === "price" && <span style={{ fontSize: "0.65rem", marginLeft: "0.3rem", color: "var(--success)" }}>Best</span>}
                      {isBest && spec.key === "rating" && <span style={{ fontSize: "0.65rem", marginLeft: "0.3rem", color: "var(--success)" }}>Top</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
