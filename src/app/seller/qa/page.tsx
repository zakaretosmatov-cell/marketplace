"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { qaApi } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { MessageCircle, Send, CheckCircle } from "lucide-react";

type QA = { id: string; productId: string; userId: string; userName: string; question: string; answer?: string; answeredAt?: string; createdAt: string; productName?: string };

export default function SellerQAPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<QA[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unanswered">("unanswered");

  useEffect(() => {
    if (!user) return;
    qaApi.getSellerQuestions(user.uid).then(q => { setQuestions(q); setLoading(false); });
  }, [user]);

  const handleAnswer = async (id: string) => {
    if (!answers[id]?.trim()) return;
    setSubmitting(id);
    try {
      await qaApi.answerQuestion(id, answers[id].trim());
      setQuestions(prev => prev.map(q => q.id === id ? { ...q, answer: answers[id].trim(), answeredAt: new Date().toISOString() } : q));
      setAnswers(prev => ({ ...prev, [id]: "" }));
      showToast("Answer submitted!", "success");
    } catch {
      showToast("Failed to submit answer", "error");
    } finally {
      setSubmitting(null);
    }
  };

  const filtered = filter === "unanswered" ? questions.filter(q => !q.answer) : questions;

  return (
    <ProtectedRoute allowedRoles={["seller", "admin"]}>
      <div className="container" style={{ padding: "2rem 0", maxWidth: "800px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Q&A</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginTop: "0.25rem" }}>Answer customer questions about your products</p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["unanswered", "all"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "0.35rem 0.875rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-color)", background: filter === f ? "var(--accent-color)" : "var(--bg-secondary)", color: filter === f ? "var(--bg-primary)" : "var(--text-secondary)", fontSize: "0.8rem", cursor: "pointer", fontWeight: filter === f ? 600 : 400, textTransform: "capitalize" }}>
              {f === "unanswered" ? `Unanswered (${questions.filter(q => !q.answer).length})` : `All (${questions.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center", border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)" }}>
            <MessageCircle size={40} color="var(--text-tertiary)" style={{ margin: "0 auto 1rem" }} />
            <p style={{ color: "var(--text-secondary)" }}>No {filter === "unanswered" ? "unanswered " : ""}questions yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtered.map(q => (
              <div key={q.id} style={{ border: "1px solid var(--border-color)", borderRadius: "var(--radius-lg)", overflow: "hidden", background: "var(--bg-card)" }}>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>{q.userName}</p>
                      <p style={{ fontSize: "0.7rem", color: "var(--text-tertiary)" }}>{new Date(q.createdAt).toLocaleDateString()}</p>
                    </div>
                    {q.productId && (
                      <Link href={`/catalog/${q.productId}`} style={{ fontSize: "0.75rem", color: "var(--accent-color)", fontWeight: 500 }}>
                        View product
                      </Link>
                    )}
                  </div>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, marginBottom: "0.75rem" }}>❓ {q.question}</p>

                  {q.answer ? (
                    <div style={{ padding: "0.75rem", background: "#f0fdf4", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--success)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                        <CheckCircle size={13} color="var(--success)" />
                        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--success)" }}>Your answer</span>
                      </div>
                      <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{q.answer}</p>
                    </div>
                  ) : (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input value={answers[q.id] || ""} onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                        placeholder="Write your answer..." onKeyDown={e => e.key === "Enter" && handleAnswer(q.id)}
                        style={{ flex: 1, padding: "0.6rem 0.875rem", borderRadius: "0.5rem", border: "1px solid var(--border-color)", background: "var(--bg-primary)", fontSize: "0.875rem" }} />
                      <button onClick={() => handleAnswer(q.id)} disabled={submitting === q.id || !answers[q.id]?.trim()}
                        style={{ padding: "0.6rem 1rem", borderRadius: "0.5rem", background: "var(--accent-color)", color: "var(--bg-primary)", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Send size={14} /> {submitting === q.id ? "..." : "Answer"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
