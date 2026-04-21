"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product, Review } from "@/lib/types";
import { api, qaApi } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import ProductCard from "@/components/ProductCard";
import { ShoppingCart, Heart, Star, ChevronRight, Truck, ShieldCheck, RefreshCw, Send, Lock } from "lucide-react";
import StockAlert from "@/components/StockAlert";

function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button"
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{ background: "none", border: "none", cursor: onChange ? "pointer" : "default", padding: "1px" }}
        >
          <Star size={size} fill={(hover || value) >= i ? "#f59e0b" : "none"} color={(hover || value) >= i ? "#f59e0b" : "#d1d5db"} />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addItem: addRecentlyViewed } = useRecentlyViewed();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [questions, setQuestions] = useState<{ id: string; userId: string; userName: string; question: string; answer?: string; createdAt: string }[]>([]);
  const [qaInput, setQaInput] = useState("");
  const [qaSubmitting, setQaSubmitting] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const productId = Array.isArray(params?.id) ? params.id[0] : params?.id as string;

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    Promise.all([
      api.getProductById(productId),
      api.getReviewsByProductId(productId),
      api.getProducts(),
    ]).then(([p, r, all]) => {
      if (!p) { router.push("/catalog"); return; }
      setProduct(p);
      setReviews(r);
      if (p.colors?.length) setSelectedColor(p.colors[0]);
      if (p.sizes?.length) setSelectedSize(p.sizes[0]);
      setRelated(all.filter(x => x.id !== p.id && x.category === p.category).slice(0, 4));
      setLoading(false);
    });
  }, [productId, router]);

  useEffect(() => {
    if (!user || !productId) return;
    api.hasPurchasedProduct(user.uid, productId).then(setHasPurchased);
  }, [user, productId]);

  useEffect(() => {
    if (!user || reviews.length === 0) return;
    setAlreadyReviewed(reviews.some(r => r.userId === user.uid));
  }, [user, reviews]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, qty);
    showToast("Added to cart", "success");
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, qty);
    router.push("/checkout");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !product) return;
    if (!reviewText.trim()) { showToast("Please write a comment", "error"); return; }
    setSubmitting(true);
    try {
      await api.addReview({
        productId: product.id,
        productName: product.name,
        sellerId: product.sellerId,
        userId: user.uid,
        userName: user.displayName || user.email?.split("@")[0] || "User",
        rating: reviewRating,
        comment: reviewText.trim(),
        createdAt: new Date().toISOString(),
      });
      const updated = await api.getReviewsByProductId(product.id);
      setReviews(updated);
      const updatedProduct = await api.getProductById(product.id);
      if (updatedProduct) setProduct(updatedProduct);
      setReviewText("");
      setReviewRating(5);
      setAlreadyReviewed(true);
      showToast("Review submitted!", "success");
    } catch {
      showToast("Failed to submit review", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div style={{ width: "36px", height: "36px", border: "3px solid var(--border-color)", borderTopColor: "var(--accent-color)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!product) return null;

  const isLiked = isInWishlist(product.id);
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : product.rating;
  const ratingDist = [5, 4, 3, 2, 1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }));

  return (
    <div className="container" style={{ padding: "2rem 1.5rem" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "1.5rem", fontSize: "0.8rem", color: "var(--text-tertiary)" }}>
        <Link href="/" style={{ color: "var(--text-tertiary)" }}>Home</Link>
        <ChevronRight size={12} />
        <Link href="/catalog" style={{ color: "var(--text-tertiary)" }}>Catalog</Link>
        <ChevronRight size={12} />
        <span style={{ color: "var(--text-secondary)" }}>{product.name}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>

        <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-secondary)", aspectRatio: "1" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>{product.brand} В· {product.category}</p>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "0.75rem" }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <StarRating value={Math.round(avgRating)} />
              <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
            </div>
          </div>

          <span style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em" }}>${product.price.toLocaleString()}</span>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>Color: <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>{selectedColor}</span></p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)} title={c}
                    style={{ width: "28px", height: "28px", borderRadius: "50%", background: c, border: selectedColor === c ? "3px solid var(--accent-color)" : "2px solid var(--border-color)", cursor: "pointer", outline: selectedColor === c ? "2px solid var(--bg-primary)" : "none", outlineOffset: "1px" }} />
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.5rem" }}>Size: <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>{selectedSize}</span></p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    style={{ padding: "0.35rem 0.75rem", borderRadius: "var(--radius-sm)", border: selectedSize === s ? "2px solid var(--accent-color)" : "1px solid var(--border-color)", background: selectedSize === s ? "var(--accent-soft)" : "var(--bg-primary)", cursor: "pointer", fontSize: "0.8rem", fontWeight: selectedSize === s ? 600 : 400 }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: product.stock > 0 ? "var(--success)" : "var(--error)" }} />
            <span style={{ color: product.stock > 0 ? "var(--success)" : "var(--error)", fontWeight: 500 }}>
              {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ padding: "0.6rem 0.875rem", background: "var(--bg-secondary)", border: "none", cursor: "pointer", fontSize: "1rem" }}>-</button>
              <span style={{ padding: "0.6rem 1rem", fontWeight: 600, minWidth: "40px", textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} disabled={product.stock === 0} style={{ padding: "0.6rem 0.875rem", background: "var(--bg-secondary)", border: "none", cursor: "pointer", fontSize: "1rem" }}>+</button>
            </div>
            {/* Share */}
          {typeof navigator !== "undefined" && navigator.share && (
            <button onClick={() => navigator.share({ title: product.name, text: product.description, url: window.location.href })}
              style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-tertiary)", flexShrink: 0 }}
              title="Share">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          )}
          <button onClick={() => isLiked ? removeFromWishlist(product.id) : addToWishlist(product)}
              style={{ width: "42px", height: "42px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: isLiked ? "var(--error)" : "var(--text-tertiary)", flexShrink: 0 }}>
              <Heart size={18} fill={isLiked ? "var(--error)" : "none"} />
            </button>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.875rem", cursor: product.stock === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button onClick={handleBuyNow} disabled={product.stock === 0}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-md)", border: "none", background: product.stock === 0 ? "var(--bg-tertiary)" : "var(--accent-color)", color: product.stock === 0 ? "var(--text-tertiary)" : "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", cursor: product.stock === 0 ? "not-allowed" : "pointer" }}>
              Buy Now
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border-color)" }}>
            {[
              { icon: <Truck size={16} />, text: "Free shipping over $99" },
              { icon: <ShieldCheck size={16} />, text: "2-year warranty" },
              { icon: <RefreshCw size={16} />, text: "30-day returns" },
            ].map((f, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", textAlign: "center" }}>
                <span style={{ color: "var(--text-secondary)" }}>{f.icon}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "3rem", marginBottom: "4rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "2rem" }}>Reviews & Ratings</h2>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "3rem", alignItems: "start" }}>

          <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1.5rem", background: "var(--bg-card)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "3rem", fontWeight: 800, letterSpacing: "-0.04em" }}>{avgRating.toFixed(1)}</p>
              <StarRating value={Math.round(avgRating)} size={18} />
              <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>{reviews.length} reviews</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {ratingDist.map(({ n, count }) => (
                <div key={n} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem" }}>
                  <span style={{ width: "8px", color: "var(--text-tertiary)" }}>{n}</span>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  <div style={{ flex: 1, height: "6px", borderRadius: "3px", background: "var(--bg-tertiary)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: reviews.length ? `${(count / reviews.length) * 100}%` : "0%", background: "#f59e0b", borderRadius: "3px" }} />
                  </div>
                  <span style={{ width: "20px", color: "var(--text-tertiary)", textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Review form вЂ” only for verified buyers */}
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", padding: "1.25rem", background: "var(--bg-card)" }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: "1rem" }}>Write a Review</h3>
              {!user ? (
                <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <Link href="/login" style={{ color: "var(--accent-color)", fontWeight: 600 }}>Sign in</Link> to leave a review.
                </p>
              ) : alreadyReviewed ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", background: "#f0fdf4", borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: "#16a34a" }}>
                  <Star size={16} fill="#16a34a" color="#16a34a" />
                  You have already reviewed this product.
                </div>
              ) : !hasPurchased ? (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <Lock size={15} />
                  Only verified buyers can leave a review. Purchase this product first.
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                  <div>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.4rem" }}>Your rating</p>
                    <StarRating value={reviewRating} onChange={setReviewRating} size={22} />
                  </div>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience with this product..."
                    style={{ padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", resize: "vertical", minHeight: "90px", width: "100%" }} />
                  <button type="submit" disabled={submitting}
                    style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}>
                    <Send size={14} /> {submitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}
            </div>

            {reviews.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>No reviews yet. Be the first verified buyer!</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: "1.25rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--accent-color)", color: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0 }}>
                          {r.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{r.userName}</p>
                            <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.4rem", borderRadius: "var(--radius-pill)", background: "#dbeafe", color: "#1e40af", fontWeight: 600 }}>Verified Buyer</span>
                          </div>
                          <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{new Date(r.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                        </div>
                      </div>
                      <StarRating value={r.rating} size={14} />
                    </div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "3rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>You Might Also Like</h2>
            <Link href="/catalog" style={{ fontSize: "0.875rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              View all <ChevronRight size={14} />
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}