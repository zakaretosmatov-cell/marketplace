"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { sellerApi } from "@/lib/api";
import { SellerProfile } from "@/lib/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Store, Clock, CheckCircle, XCircle } from "lucide-react";

export default function SellerApplyPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ businessName: "", phone: "" });

  useEffect(() => {
    if (!user) return;
    sellerApi.getSellerProfile(user.uid).then(p => { setProfile(p || null); setLoading(false); });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await sellerApi.applyForSeller({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || "",
        businessName: form.businessName,
        phone: form.phone,
        createdAt: new Date().toISOString(),
      });
      setProfile({ uid: user.uid, email: user.email || "", verificationStatus: "pending", ...form, createdAt: new Date().toISOString() });
      showToast("Application submitted! Admin will review it.", "success");
    } catch {
      showToast("Failed to submit application", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inp = { padding: "0.65rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", width: "100%" };

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: "3rem 1.5rem", maxWidth: "560px" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <Store size={28} color="var(--accent-color)" />
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Become a Seller</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
            Apply to sell your products on TechNova. Admin will review your application.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : profile ? (
          <div style={{ padding: "2rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", textAlign: "center" }}>
            {profile.verificationStatus === "pending" && (
              <>
                <Clock size={40} color="var(--warning)" style={{ margin: "0 auto 1rem" }} />
                <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Application Pending</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Your application is under review. We'll notify you soon.</p>
              </>
            )}
            {profile.verificationStatus === "approved" && (
              <>
                <CheckCircle size={40} color="var(--success)" style={{ margin: "0 auto 1rem" }} />
                <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Application Approved!</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>You are now a verified seller. Switch to Seller role in your profile.</p>
              </>
            )}
            {profile.verificationStatus === "rejected" && (
              <>
                <XCircle size={40} color="var(--error)" style={{ margin: "0 auto 1rem" }} />
                <h2 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>Application Rejected</h2>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Your application was not approved. Contact support for more info.</p>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", padding: "2rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", background: "var(--bg-card)" }}>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Business Name *</label>
              <input required style={inp} value={form.businessName} onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))} placeholder="Your store name" />
            </div>
            <div>
              <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>Phone Number *</label>
              <input required style={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+998 90 123 45 67" />
            </div>
            <button type="submit" disabled={submitting}
              style={{ padding: "0.75rem", borderRadius: "var(--radius-md)", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: submitting ? "not-allowed" : "pointer" }}>
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </div>
    </ProtectedRoute>
  );
}
