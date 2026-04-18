"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/context/ToastContext";
import { adminApi } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Users, Shield, ShieldOff, Search } from "lucide-react";

type UserRow = { uid: string; email: string; role: string; createdAt: string; blocked?: boolean };

export default function AdminUsersPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getAllUsers().then(u => { setUsers(u); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = async (uid: string, blocked: boolean) => {
    setProcessing(uid);
    try {
      await adminApi.blockUser(uid, blocked);
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, blocked } : u));
      showToast(blocked ? "User blocked" : "User unblocked", "success");
    } catch {
      showToast("Action failed", "error");
    } finally {
      setProcessing(null);
    }
  };

  const handleRoleChange = async (uid: string, role: string) => {
    try {
      await adminApi.setUserRole(uid, role);
      setUsers(prev => prev.map(u => u.uid === uid ? { ...u, role } : u));
      showToast("Role updated", "success");
    } catch {
      showToast("Failed to update role", "error");
    }
  };

  const ROLE_COLORS: Record<string, string> = { admin: "#7c3aed", seller: "#d97706", client: "#2563eb" };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "1000px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>User Management</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>{users.length} total users</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "0.55rem 0.875rem", background: "var(--bg-secondary)", marginBottom: "1.5rem", maxWidth: "360px" }}>
          <Search size={15} color="var(--text-tertiary)" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by email or role..." style={{ background: "none", border: "none", color: "var(--text-primary)", width: "100%", fontSize: "0.875rem" }} />
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : (
          <div style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "0.75rem 1.25rem", background: "var(--bg-secondary)", borderBottom: "1px solid var(--border-color)", fontSize: "0.7rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <span>User</span><span>Role</span><span>Status</span><span>Actions</span>
            </div>
            {filtered.map((u, i) => (
              <div key={u.uid} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "0.875rem 1.25rem", borderBottom: i < filtered.length - 1 ? "1px solid var(--border-color)" : "none", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 500, fontSize: "0.875rem" }}>{u.email}</p>
                  <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", fontFamily: "monospace" }}>{u.uid.slice(0, 12)}...</p>
                </div>
                <select value={u.role} onChange={e => handleRoleChange(u.uid, e.target.value)}
                  style={{ padding: "0.3rem 0.5rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "0.8rem", color: ROLE_COLORS[u.role] || "var(--text-primary)", fontWeight: 600, cursor: "pointer" }}>
                  <option value="client">Client</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, color: u.blocked ? "var(--error)" : "var(--success)" }}>
                  {u.blocked ? "Blocked" : "Active"}
                </span>
                <button onClick={() => handleBlock(u.uid, !u.blocked)} disabled={processing === u.uid}
                  style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.4rem 0.75rem", borderRadius: "0.375rem", border: "1px solid var(--border-color)", background: u.blocked ? "var(--bg-secondary)" : "#fff5f5", color: u.blocked ? "var(--success)" : "var(--error)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>
                  {u.blocked ? <><Shield size={13} /> Unblock</> : <><ShieldOff size={13} /> Block</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
