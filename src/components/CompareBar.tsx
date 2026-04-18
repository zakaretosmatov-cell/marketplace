"use client";
import { useCompare } from "@/context/CompareContext";
import Link from "next/link";
import { X, GitCompare } from "lucide-react";

export default function CompareBar() {
  const { items, removeFromCompare, clearCompare } = useCompare();
  if (items.length === 0) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 998,
      background: "var(--bg-primary)", borderTop: "2px solid var(--accent-color)",
      padding: "0.75rem 1.5rem",
      display: "flex", alignItems: "center", gap: "1rem",
      boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--accent-color)", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
        <GitCompare size={16} /> Compare ({items.length}/3)
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flex: 1, overflowX: "auto" }}>
        {items.map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.6rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-secondary)", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.image} alt={p.name} style={{ width: "28px", height: "28px", objectFit: "cover", borderRadius: "0.25rem" }} />
            <span style={{ fontSize: "0.8rem", fontWeight: 500, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
            <button onClick={() => removeFromCompare(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-tertiary)", display: "flex", padding: 0 }}>
              <X size={13} />
            </button>
          </div>
        ))}
        {Array.from({ length: 3 - items.length }).map((_, i) => (
          <div key={i} style={{ width: "120px", height: "36px", borderRadius: "var(--radius-md)", border: "2px dashed var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>+ Add</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button onClick={clearCompare} style={{ padding: "0.4rem 0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "transparent", color: "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer" }}>
          Clear
        </button>
        <Link href="/compare" style={{ padding: "0.4rem 1rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontSize: "0.8rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <GitCompare size={14} /> Compare Now
        </Link>
      </div>
    </div>
  );
}
