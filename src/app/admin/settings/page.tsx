"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Save, AlertTriangle } from "lucide-react";

export default function AdminSettingsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    commissionPercent: 5,
    sellerSubscriptionFee: 0,
    freeShippingThreshold: 99,
    maintenanceMode: false,
    platformName: "TechNova",
    supportEmail: "support@technova.com",
    maxProductsPerSeller: 100,
    requireSellerVerification: true,
    allowGuestCheckout: false,
  });

  useEffect(() => {
    getDoc(doc(db, "platform", "settings")).then(snap => {
      if (snap.exists()) setSettings(prev => ({ ...prev, ...snap.data() }));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, "platform", "settings"), { ...settings, updatedAt: new Date().toISOString() });
      showToast("Settings saved!", "success");
    } catch { showToast("Failed to save", "error"); }
    finally { setSaving(false); }
  };

  const inp = { padding: "0.65rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", color: "var(--text-primary)", fontSize: "0.875rem", width: "100%" };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", fontWeight: 800 }}>Platform Settings</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Configure global platform parameters</p>
          </div>
          <button onClick={handleSave} disabled={saving || loading}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", borderRadius: "var(--radius-lg)", background: "var(--accent-color)", color: "white", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer" }}>
            <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        {loading ? <div style={{ padding: "3rem", textAlign: "center" }}>Loading...</div> : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { title: "General", fields: [
                { key: "platformName", label: "Platform Name", type: "text" },
                { key: "supportEmail", label: "Support Email", type: "email" },
              ]},
              { title: "Financial", fields: [
                { key: "commissionPercent", label: "Commission (%)", type: "number", hint: "Percentage taken from each sale" },
                { key: "sellerSubscriptionFee", label: "Seller Subscription Fee ($)", type: "number" },
                { key: "freeShippingThreshold", label: "Free Shipping Threshold ($)", type: "number" },
                { key: "maxProductsPerSeller", label: "Max Products per Seller", type: "number" },
              ]},
            ].map(section => (
              <div key={section.title} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--bg-card)" }}>
                <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}>
                  <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>{section.title}</h2>
                </div>
                <div style={{ padding: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                  {section.fields.map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: "0.8rem", fontWeight: 600, display: "block", marginBottom: "0.4rem" }}>{f.label}</label>
                      <input type={f.type} style={inp} value={(settings as Record<string, unknown>)[f.key] as string | number} onChange={e => setSettings(s => ({ ...s, [f.key]: f.type === "number" ? parseFloat(e.target.value) : e.target.value }))} />
                      {(f as { hint?: string }).hint && <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", marginTop: "0.3rem" }}>{(f as { hint?: string }).hint}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--bg-card)" }}>
              <div style={{ padding: "1rem 1.5rem", borderBottom: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}>
                <h2 style={{ fontSize: "0.875rem", fontWeight: 700 }}>Access Control</h2>
              </div>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                {[
                  { key: "requireSellerVerification", label: "Require seller verification", desc: "Sellers must be approved before listing products" },
                  { key: "allowGuestCheckout", label: "Allow guest checkout", desc: "Users can purchase without an account" },
                  { key: "maintenanceMode", label: "Maintenance Mode", desc: "Temporarily disable the platform", danger: true },
                ].map(opt => (
                  <label key={opt.key} style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "1rem", borderRadius: "var(--radius-md)", border: "1px solid " + (opt.danger && (settings as Record<string, unknown>)[opt.key] ? "var(--error)" : "var(--border-color)"), background: opt.danger && (settings as Record<string, unknown>)[opt.key] ? "var(--error-soft)" : "var(--bg-secondary)", cursor: "pointer" }}>
                    <input type="checkbox" checked={(settings as Record<string, unknown>)[opt.key] as boolean} onChange={e => setSettings(s => ({ ...s, [opt.key]: e.target.checked }))} style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: opt.danger ? "var(--error)" : "var(--accent-color)", flexShrink: 0 }} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        {opt.danger && <AlertTriangle size={14} color="var(--error)" />}
                        <p style={{ fontWeight: 600, fontSize: "0.875rem", color: opt.danger ? "var(--error)" : "var(--text-primary)" }}>{opt.label}</p>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "0.2rem" }}>{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}