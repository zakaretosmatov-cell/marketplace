"use client";
import { Bundle } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ShoppingCart, Tag } from "lucide-react";

export default function BundleCard({ bundle }: { bundle: Bundle }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddBundle = () => {
    // Add each product as a cart item with bundle price split
    const pricePerItem = bundle.bundlePrice / bundle.productIds.length;
    bundle.productIds.forEach((id, i) => {
      addToCart({
        id,
        name: bundle.productNames[i],
        price: Math.round(pricePerItem * 100) / 100,
        image: bundle.productImages[i],
        stock: bundle.stock,
        sellerId: bundle.sellerId,
        description: `Part of bundle: ${bundle.title}`,
        category: "Bundle",
      }, 1);
    });
    showToast(`Bundle "${bundle.title}" added to cart!`, "success");
  };

  return (
    <div style={{
      border: "2px solid var(--border-color)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      background: "var(--bg-card)",
      position: "relative",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}
    >
      {/* Discount badge */}
      <div style={{ position: "absolute", top: "12px", left: "12px", zIndex: 10, background: "#dc2626", color: "white", padding: "0.25rem 0.6rem", borderRadius: "var(--radius-sm)", fontSize: "0.75rem", fontWeight: 800 }}>
        -{bundle.discountPercent}% OFF
      </div>

      {/* Product images */}
      <div style={{ display: "flex", height: "160px", overflow: "hidden" }}>
        {bundle.productImages.slice(0, 3).map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={img} alt={bundle.productNames[i]}
            style={{ flex: 1, objectFit: "cover", borderRight: i < bundle.productImages.length - 1 ? "2px solid var(--bg-primary)" : "none" }} />
        ))}
      </div>

      <div style={{ padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.4rem" }}>
          <Tag size={14} color="var(--text-tertiary)" />
          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Bundle Deal</span>
        </div>

        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.3rem" }}>{bundle.title}</h3>
        {bundle.description && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{bundle.description}</p>}

        <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginBottom: "0.75rem" }}>
          {bundle.productNames.join(" + ")}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.75rem", borderTop: "1px solid var(--border-color)" }}>
          <div>
            <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", textDecoration: "line-through", marginRight: "0.5rem" }}>${bundle.originalPrice.toFixed(2)}</span>
            <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--success)" }}>${bundle.bundlePrice.toFixed(2)}</span>
          </div>
          <button onClick={handleAddBundle} disabled={bundle.stock === 0}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 0.875rem", borderRadius: "var(--radius-md)", background: bundle.stock === 0 ? "var(--bg-tertiary)" : "var(--accent-color)", color: bundle.stock === 0 ? "var(--text-tertiary)" : "var(--bg-primary)", fontSize: "0.8rem", fontWeight: 600, border: "none", cursor: bundle.stock === 0 ? "not-allowed" : "pointer" }}>
            <ShoppingCart size={14} /> Add Bundle
          </button>
        </div>
      </div>
    </div>
  );
}
