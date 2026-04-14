"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ShoppingBag, Store, Shield, Check, LogOut } from "lucide-react";

const ROLES = [
  {
    value: "client",
    label: "Buyer",
    description: "Browse products, add to cart, place orders and manage wishlist.",
    color: "var(--accent-color)",
  },
  {
    value: "seller",
    label: "Seller",
    description: "List products, manage inventory and track your orders.",
    color: "var(--warning)",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full access: manage users, products, orders and platform settings.",
    color: "var(--success)",
  },
];

export default function ProfilePage() {
  const { user, role, logout, switchRole } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);

  const handleSwitch = async (newRole: Role) => {
    if (newRole === role || switching) return;
    setSwitching(true);
    try {
      await switchRole(newRole);
      showToast("Switched to " + newRole + " role", "success");
    } catch {
      showToast("Failed to switch role", "error");
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const roleColor = role === "admin" ? "var(--success)" : role === "seller" ? "var(--warning)" : "var(--accent-color)";
  const roleBg = role === "admin" ? "rgba(34,197,94,0.15)" : role === "seller" ? "rgba(234,179,8,0.15)" : "rgba(99,102,241,0.15)";

  return (
    <ProtectedRoute>
      <div className="container" style={{ padding: "3rem 1rem", maxWidth: "600px", margin: "0 auto" }}>
        <div className="card" style={{ padding: "2rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--accent-color)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: 800, flexShrink: 0 }}>
            {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>{user?.displayName || "User"}</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{user?.email}</p>
            <span style={{ display: "inline-block", marginTop: "0.4rem", padding: "0.2rem 0.75rem", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", backgroundColor: roleBg, color: roleColor }}>
              {role || "client"}
            </span>
          </div>
          <button onClick={handleLogout} style={{ padding: "0.6rem", borderRadius: "50%", backgroundColor: "var(--bg-tertiary)", color: "var(--error)", display: "flex" }} title="Logout">
            <LogOut size={18} />
          </button>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Switch Role</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            Choose how you want to use the platform. Changes take effect immediately.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {ROLES.map((r) => {
              const isActive = role === r.value;
              return (
                <button
                  key={r.value}
                  onClick={() => handleSwitch(r.value)}
                  disabled={switching}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem 1.5rem", borderRadius: "0.75rem", textAlign: "left", border: "2px solid " + (isActive ? r.color : "var(--border-color)"), backgroundColor: isActive ? "color-mix(in srgb, " + r.color + " 10%, transparent)" : "var(--bg-secondary)", cursor: switching ? "not-allowed" : "pointer", transition: "all 0.2s", opacity: switching && !isActive ? 0.6 : 1, width: "100%" }}
                >
                  <div style={{ color: isActive ? r.color : "var(--text-secondary)", flexShrink: 0 }}>
                    {r.value === "client" && <ShoppingBag size={24} />}
                    {r.value === "seller" && <Store size={24} />}
                    {r.value === "admin" && <Shield size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, color: isActive ? r.color : "var(--text-primary)", marginBottom: "0.2rem" }}>{r.label}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{r.description}</p>
                  </div>
                  {isActive && (
                    <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: r.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

