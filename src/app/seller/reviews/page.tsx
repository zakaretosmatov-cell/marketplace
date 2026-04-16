"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Review } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { Star, MessageSquare } from "lucide-react";

function Stars({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", gap: "1px" }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={13} fill={value >= i ? "#f59e0b" : "none"} color={value >= i ? "#f59e0b" : "#d1d5db"} />
      ))}
    </div>
  );
}

export default function SellerReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | "all">("all");

  useEffect(() => {
    if (!user) return;
    api.getReviewsBySeller(user.uid).then(data => {
      setReviews(data);
      setLoading(false);
    }).catch(() => {
      // fallback: get all products by seller, then get reviews
      api.getProductsBySeller(user.uid).then(async products => {
        const all: Review[] = [];
        for (const p of products) {
          const r = await api.getReviewsByProductId(p.id);
          all.push(...r);
        }
        all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(all);
        setLoading(false);
      });
    });
  }, [user]);

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.rating === filter);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [5,4,3,2,1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }));

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "900px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Reviews</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Customer feedback on your products</p>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem", marginBottom: "2rem", padding: "1.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}>
          <div style={{ textAlign: "center", borderRight: "1px solid var(--border-color)", paddingRight: "1.5rem" }}>
            <p style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em" }}>{avg.toFixed(1)}</p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.3rem" }}>
              <Stars value={Math.round(avg)} />
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{reviews.length} total reviews</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", justifyContent: "center" }}>
            {dist.map(({ n, count }) => (
              <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
                <span style={{ width: "8px", color: "var(--text-tertiary)" }}>{n}</span>
                <Star size={11} fill="#f59e0b" color="#f59e0b" />
                <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--bg-tertiary)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%", background: "#f59e0b", borderRadius: "3px" }} />
                </div>
                <span style={{ width: "24px", color: "var(--text-tertiary)", textAlign: "right" }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
          {(["all", 5, 4, 3, 2, 1] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === f ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === f ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === f ? 600 : 400, display: "flex", alignItems: "center", gap: "0.25rem" }}>
              {f === "all" ? "All" : <><Star size={11} fill="#f59e0b" color="#f59e0b" /> {f}</>}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading reviews...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "0.5rem" }}>
            <MessageSquare size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No reviews yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(r => (
              <div key={r.id} style={{ padding: "1.25rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--accent-color)", color: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.875rem", fontWeight: 700, flexShrink: 0 }}>
                      {r.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{r.userName}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                    </div>
                  </div>
                  <Stars value={r.rating} />
                </div>
                {r.productName && (
                  <Link href={`/catalog/${r.productId}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--accent-color)", fontWeight: 500, marginBottom: "0.5rem" }}>
                    {r.productName}
                  </Link>
                )}
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}