"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { api, promoApi } from "@/lib/api";
import { Address } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MapPin, CreditCard, CheckCircle, Plus, ChevronRight, Lock, Package } from "lucide-react";

type Step = "address" | "payment" | "confirm";

const inp = {
  padding: "0.65rem 0.875rem",
  borderRadius: "0.5rem",
  border: "1px solid var(--border-color)",
  background: "var(--bg-primary)",
  color: "var(--text-primary)",
  fontSize: "0.875rem",
  width: "100%",
};

export default function CheckoutPage() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<Step>("address");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "Home", fullName: "", phone: "", street: "", city: "", country: "", isDefault: false });
  const [savingAddr, setSavingAddr] = useState(false);
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [processing, setProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoId, setPromoId] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [orderId, setOrderId] = useState("");

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    const result = await promoApi.validateCode(promoCode);
    if (result.valid) {
      setPromoDiscount(result.discount);
      setPromoId(result.promoId);
      showToast("Promo applied! " + result.discount + "% off", "success");
    } else {
      showToast("Invalid or expired promo code", "error");
    }
    setPromoLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    api.getAddresses(user.uid).then(list => {
      setAddresses(list);
      const def = list.find(a => a.isDefault) || list[0];
      if (def) setSelectedAddress(def);
    });
  }, [user]);

  if (cartItems.length === 0 && step !== "confirm") {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

  const subtotal = totalAmount;
  const shipping = subtotal > 99 ? 0 : 9.99;
  const discountAmount = promoDiscount > 0 ? Math.round(subtotal * (promoDiscount / 100) * 100) / 100 : 0;
  const total = Math.max(0, subtotal + shipping - discountAmount);

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingAddr(true);
    try {
      const id = await api.addAddress(user.uid, newAddr);
      const added = { ...newAddr, id };
      setAddresses(prev => [...prev, added]);
      setSelectedAddress(added);
      setShowAddForm(false);
      setNewAddr({ label: "Home", fullName: "", phone: "", street: "", city: "", country: "", isDefault: false });
    } catch {
      showToast("Failed to save address", "error");
    } finally {
      setSavingAddr(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress || !user) return;
    if (!card.number || !card.expiry || !card.cvv || !card.name) {
      showToast("Please fill in all card details", "error");
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    try {
      const addrStr = selectedAddress.fullName + ", " + selectedAddress.street + ", " + selectedAddress.city + ", " + selectedAddress.country;
      const sellerIds = Array.from(new Set(cartItems.map(i => i.sellerId)));
      const id = await api.createOrder({
        userId: user.uid,
        userEmail: user.email || "",
        sellerIds,
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          sellerId: item.sellerId,
          image: item.image,
        })),
        totalAmount: total,
        shippingAddress: addrStr,
        ...(promoId ? { promoCode, promoDiscount: discountAmount } : {}),
      });
      if (promoId) await promoApi.useCode(promoId);
      setOrderId(id);
      clearCart();
      setStep("confirm");
    } catch (err: unknown) {
      showToast((err as Error).message || "Order failed. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const formatCard = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };

  const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "address", label: "Address", icon: <MapPin size={16} /> },
    { id: "payment", label: "Payment", icon: <CreditCard size={16} /> },
    { id: "confirm", label: "Confirm", icon: <CheckCircle size={16} /> },
  ];

  return (
    <ProtectedRoute>
      <div className="container" style={{ maxWidth: "960px", padding: "2rem 1.5rem" }}>

        {/* Steps */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2.5rem" }}>
          {steps.map((s, i) => (
            <div key={s.id} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)", background: step === s.id ? "var(--accent-color)" : "var(--bg-secondary)", color: step === s.id ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                {s.icon} {s.label}
              </div>
              {i < steps.length - 1 && <div style={{ flex: 1, height: "1px", background: "var(--border-color)", margin: "0 0.5rem" }} />}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>

          {/* Left */}
          <div>
            {/* STEP 1: Address */}
            {step === "address" && (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Delivery Address</h2>
                  <button onClick={() => setShowAddForm(v => !v)} style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--accent-color)", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                    <Plus size={14} /> Add new
                  </button>
                </div>

                {showAddForm && (
                  <form onSubmit={handleSaveAddress} style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                    <div style={{ gridColumn: "span 2", display: "flex", gap: "0.5rem" }}>
                      {["Home", "Work", "Other"].map(l => (
                        <button key={l} type="button" onClick={() => setNewAddr(a => ({ ...a, label: l }))}
                          style={{ padding: "0.3rem 0.75rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: newAddr.label === l ? "var(--accent-color)" : "var(--bg-primary)", color: newAddr.label === l ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer" }}>
                          {l}
                        </button>
                      ))}
                    </div>
                    <div><label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Full Name *</label><input required style={inp} value={newAddr.fullName} onChange={e => setNewAddr(a => ({ ...a, fullName: e.target.value }))} placeholder="John Doe" /></div>
                    <div><label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Phone *</label><input required style={inp} value={newAddr.phone} onChange={e => setNewAddr(a => ({ ...a, phone: e.target.value }))} placeholder="+1 234 567 8900" /></div>
                    <div style={{ gridColumn: "span 2" }}><label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Street Address *</label><input required style={inp} value={newAddr.street} onChange={e => setNewAddr(a => ({ ...a, street: e.target.value }))} placeholder="123 Main St, Apt 4B" /></div>
                    <div><label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>City *</label><input required style={inp} value={newAddr.city} onChange={e => setNewAddr(a => ({ ...a, city: e.target.value }))} placeholder="New York" /></div>
                    <div><label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Country *</label><input required style={inp} value={newAddr.country} onChange={e => setNewAddr(a => ({ ...a, country: e.target.value }))} placeholder="USA" /></div>
                    <div style={{ gridColumn: "span 2", display: "flex", gap: "0.75rem" }}>
                      <button type="submit" disabled={savingAddr} style={{ padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 600, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>{savingAddr ? "Saving..." : "Save Address"}</button>
                      <button type="button" onClick={() => setShowAddForm(false)} style={{ padding: "0.6rem 1.25rem", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.875rem", border: "1px solid var(--border-color)", cursor: "pointer" }}>Cancel</button>
                    </div>
                  </form>
                )}

                <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {addresses.length === 0 && !showAddForm && (
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", padding: "1rem 0" }}>No saved addresses. Add one above.</p>
                  )}
                  {addresses.map(addr => (
                    <div key={addr.id} onClick={() => setSelectedAddress(addr)}
                      style={{ padding: "1rem", borderRadius: "var(--radius-md)", border: "2px solid " + (selectedAddress?.id === addr.id ? "var(--accent-color)" : "var(--border-color)"), cursor: "pointer", background: selectedAddress?.id === addr.id ? "var(--accent-soft)" : "var(--bg-primary)", transition: "all 0.15s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.2rem" }}>{addr.label} &mdash; {addr.fullName}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{addr.street}, {addr.city}, {addr.country}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-tertiary)" }}>{addr.phone}</p>
                        </div>
                        {addr.isDefault && <span style={{ fontSize: "0.7rem", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-pill)", background: "var(--bg-tertiary)", color: "var(--text-secondary)", fontWeight: 600 }}>Default</span>}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)" }}>
                  <button onClick={() => { if (!selectedAddress) { showToast("Please select or add an address", "error"); return; } setStep("payment"); }}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    Continue to Payment <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === "payment" && (
              <form onSubmit={handlePayment} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
                <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
                  <h2 style={{ fontWeight: 700, fontSize: "1rem" }}>Payment Details</h2>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "0.25rem" }}>This is a demo &mdash; no real payment is processed</p>
                </div>

                {/* Promo Code */}
                <div style={{ padding: "1.25rem 1.5rem 0" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Promo Code</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input value={promoCode} onChange={e => setPromoCode(e.target.value.toUpperCase())} placeholder="SAVE20" style={{ ...inp, flex: 1, fontFamily: "monospace", letterSpacing: "0.05em" }} />
                    <button type="button" onClick={applyPromo} disabled={promoLoading || !promoCode.trim()} style={{ padding: "0.65rem 1rem", borderRadius: "0.5rem", background: promoDiscount > 0 ? "var(--success)" : "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer", flexShrink: 0 }}>
                      {promoLoading ? "..." : promoDiscount > 0 ? promoDiscount + "% OFF" : "Apply"}
                    </button>
                  </div>
                  {promoDiscount > 0 && <p style={{ fontSize: "0.75rem", color: "var(--success)", marginTop: "0.3rem" }}>Promo applied! {promoDiscount}% discount (-${discountAmount.toFixed(2)})</p>}
                </div>

                {/* Fake card UI */}
                <div style={{ padding: "1.5rem", background: "var(--bg-secondary)", margin: "1.5rem", borderRadius: "var(--radius-lg)", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <div style={{ position: "absolute", bottom: "-30px", left: "30px", width: "80px", height: "80px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
                  <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginBottom: "1rem", letterSpacing: "0.1em" }}>CARD NUMBER</p>
                  <p style={{ fontFamily: "monospace", fontSize: "1.1rem", letterSpacing: "0.15em", marginBottom: "1.5rem", color: "var(--text-primary)" }}>
                    {card.number || "\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div><p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>CARD HOLDER</p><p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{card.name || "YOUR NAME"}</p></div>
                    <div><p style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", letterSpacing: "0.1em" }}>EXPIRES</p><p style={{ fontSize: "0.875rem", fontWeight: 600 }}>{card.expiry || "MM/YY"}</p></div>
                  </div>
                </div>

                <div style={{ padding: "0 1.5rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Card Number</label>
                    <input style={inp} value={card.number} onChange={e => setCard(c => ({ ...c, number: formatCard(e.target.value) }))} placeholder="1234 5678 9012 3456" maxLength={19} />
                  </div>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Cardholder Name</label>
                    <input style={inp} value={card.name} onChange={e => setCard(c => ({ ...c, name: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>Expiry Date</label>
                    <input style={inp} value={card.expiry} onChange={e => setCard(c => ({ ...c, expiry: formatExpiry(e.target.value) }))} placeholder="MM/YY" maxLength={5} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "0.3rem" }}>CVV</label>
                    <input style={inp} value={card.cvv} onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))} placeholder="\u2022\u2022\u2022" maxLength={3} type="password" />
                  </div>
                </div>

                <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.75rem" }}>
                  <button type="button" onClick={() => setStep("address")} style={{ padding: "0.75rem 1.25rem", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.875rem", border: "1px solid var(--border-color)", cursor: "pointer" }}>Back</button>
                  <button type="submit" disabled={processing} style={{ flex: 1, padding: "0.75rem", borderRadius: "var(--radius-md)", background: processing ? "var(--bg-tertiary)" : "var(--accent-color)", color: processing ? "var(--text-secondary)" : "var(--bg-primary)", fontWeight: 700, fontSize: "0.9rem", border: "none", cursor: processing ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <Lock size={15} />
                    {processing ? "Processing payment..." : "Pay $" + total.toFixed(2)}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Confirm */}
            {step === "confirm" && (
              <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)", textAlign: "center", padding: "3rem 2rem" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <CheckCircle size={32} color="#16a34a" />
                </div>
                <h2 style={{ fontWeight: 800, fontSize: "1.5rem", marginBottom: "0.5rem" }}>Order Placed!</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Your order has been confirmed and is being processed.</p>
                <p style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "var(--text-tertiary)", marginBottom: "2rem" }}>Order ID: #{orderId.slice(-10).toUpperCase()}</p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
                  <button onClick={() => router.push("/orders")} style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Package size={16} /> View Orders
                  </button>
                  <button onClick={() => router.push("/catalog")} style={{ padding: "0.75rem 1.5rem", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--text-secondary)", fontWeight: 500, fontSize: "0.875rem", border: "1px solid var(--border-color)", cursor: "pointer" }}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)", position: "sticky", top: "calc(var(--header-height) + 1rem)" }}>
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
              <h3 style={{ fontWeight: 700, fontSize: "0.9rem" }}>Order Summary</h3>
            </div>
            <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem", maxHeight: "300px", overflowY: "auto" }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "0.375rem", overflow: "hidden", flexShrink: 0, background: "var(--bg-secondary)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.8rem", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, flexShrink: 0 }}>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--text-secondary)" }}>Shipping</span>
                <span>{shipping === 0 ? "Free" : "$" + shipping.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--success)" }}>Discount ({promoDiscount}%)</span>
                  <span style={{ color: "var(--success)", fontWeight: 600 }}>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1rem", paddingTop: "0.5rem", borderTop: "1px solid var(--border-color)" }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              {shipping === 0 && <p style={{ fontSize: "0.7rem", color: "var(--success)", textAlign: "center" }}>Free shipping on orders over $99</p>}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
