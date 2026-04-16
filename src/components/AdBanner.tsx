"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { adApi } from "@/lib/api";
import { Ad } from "@/lib/types";
import { Megaphone, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdBanner() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    adApi.getActiveAds().then(setAds);
  }, []);

  if (ads.length === 0) return null;

  const ad = ads[current];

  return (
    <div style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", padding: "0.75rem 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0, fontSize: "0.7rem", fontWeight: 700, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          <Megaphone size={13} /> Sponsored
        </div>

        <Link href={`/catalog/${ad.productId}`} style={{ display: "flex", alignItems: "center", gap: "0.875rem", flex: 1, minWidth: 0, textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.productImage} alt={ad.productName} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "0.375rem", flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 600, fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ad.productName}</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>${ad.productPrice.toLocaleString()}</p>
          </div>
          <span style={{ marginLeft: "auto", padding: "0.35rem 0.875rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0 }}>
            Shop Now
          </span>
        </Link>

        {ads.length > 1 && (
          <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
            <button onClick={() => setCurrent(i => (i - 1 + ads.length) % ads.length)}
              style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--border-color)", background: "var(--bg-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronLeft size={12} />
            </button>
            <button onClick={() => setCurrent(i => (i + 1) % ads.length)}
              style={{ width: "24px", height: "24px", borderRadius: "50%", border: "1px solid var(--border-color)", background: "var(--bg-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
