"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Draft = {
  id: string;
  subject: string | null;
  content_html: string | null;
  status: string;
  created_at: string;
};

export default function AdminSendPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sentSlug, setSentSlug] = useState("");
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchDraft();
  }, []);

  async function fetchDraft() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/draft");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setDraft(data.draft || null);
    } catch {
      setError("Failed to load draft.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    if (!confirmed) {
      setError("Please check the confirmation box before sending.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/send", { method: "POST" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send. Please try again.");
        return;
      }
      setSent(true);
      setSentSlug(data.slug || "");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ backgroundColor: "#FFFDF7", minHeight: "100vh" }}>
      <nav style={{
        borderBottom: "1px solid #e8e0d0",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
      }}>
        <Link href="/admin" style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, fontSize: "20px", color: "#1a1a1a", textDecoration: "none" }}>
          WYM Admin
        </Link>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link href="/admin" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Dashboard</Link>
          <Link href="/admin/topics" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Topics</Link>
          <Link href="/admin/draft" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Draft</Link>
          <Link href="/admin/send" style={{ color: "#D97706", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Send</Link>
        </div>
      </nav>

      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "30px", fontWeight: 700, marginBottom: "8px" }}>
          Send Newsletter
        </h1>
        <p style={{ color: "#666", fontSize: "15px", marginBottom: "32px" }}>
          Final review before sending to all subscribers.
        </p>

        {sent ? (
          <div style={{
            backgroundColor: "#f0fdf4",
            border: "2px solid #86efac",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#166534", marginBottom: "12px" }}>
              Newsletter sent successfully!
            </h2>
            <p style={{ color: "#166534", fontSize: "16px", marginBottom: "24px" }}>
              Your newsletter is on its way to all subscribers.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              {sentSlug && (
                <Link href={`/archives/${sentSlug}`} style={{
                  padding: "12px 24px",
                  backgroundColor: "#D97706",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: 600,
                }}>
                  View in Archives &rarr;
                </Link>
              )}
              <Link href="/admin" style={{
                padding: "12px 24px",
                backgroundColor: "#1a1a1a",
                color: "#fff",
                textDecoration: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: 600,
              }}>
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading&hellip;</div>
        ) : !draft ? (
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderRadius: "12px",
            padding: "48px",
            textAlign: "center",
          }}>
            <p style={{ color: "#888", fontSize: "18px", marginBottom: "24px" }}>
              No draft found. Please create and save a draft first.
            </p>
            <Link href="/admin/draft" style={{
              padding: "12px 24px",
              backgroundColor: "#D97706",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
            }}>
              Go to Draft Editor
            </Link>
          </div>
        ) : (
          <div>
            {error && (
              <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
                <p style={{ color: "#991b1b", margin: 0 }}>{error}</p>
              </div>
            )}

            {/* Preview Card */}
            <div style={{
              backgroundColor: "#fff",
              border: "1px solid #e8e0d0",
              borderRadius: "12px",
              padding: "28px",
              marginBottom: "24px",
            }}>
              <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>
                Draft Preview
              </h2>
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "13px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Subject</span>
                <p style={{ fontSize: "20px", fontFamily: "'Lora', Georgia, serif", fontWeight: 700, color: "#1a1a1a", marginTop: "4px", marginBottom: 0 }}>
                  {draft.subject || "(No subject)"}
                </p>
              </div>
              <div style={{ borderTop: "1px solid #f0e8d8", paddingTop: "16px" }}>
                <span style={{ fontSize: "13px", color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>Content Preview</span>
                <div
                  style={{ marginTop: "8px", fontSize: "14px", color: "#555", lineHeight: 1.7, maxHeight: "200px", overflow: "hidden", position: "relative" }}
                  dangerouslySetInnerHTML={{ __html: draft.content_html || "(No content)" }}
                />
                <div style={{ marginTop: "8px" }}>
                  <Link href="/admin/draft" style={{ fontSize: "14px", color: "#D97706", textDecoration: "none" }}>
                    Edit draft &rarr;
                  </Link>
                </div>
              </div>
            </div>

            {/* Confirmation and Send */}
            <div style={{
              backgroundColor: "#fff",
              border: "2px solid #fca5a5",
              borderRadius: "12px",
              padding: "28px",
            }}>
              <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#991b1b", marginBottom: "12px" }}>
                Ready to send?
              </h2>
              <p style={{ color: "#555", fontSize: "15px", marginBottom: "20px" }}>
                This will immediately send the newsletter to <strong>all active subscribers</strong> via Buttondown. This action cannot be undone.
              </p>

              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", marginBottom: "24px" }}>
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
                />
                <span style={{ fontSize: "16px", color: "#333" }}>
                  I have reviewed the draft and I am ready to send it to all subscribers.
                </span>
              </label>

              <button
                onClick={handleSend}
                disabled={sending || !confirmed}
                style={{
                  padding: "14px 36px",
                  backgroundColor: sending ? "#9ca3af" : (!confirmed ? "#d1d5db" : "#dc2626"),
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: 700,
                  cursor: (sending || !confirmed) ? "not-allowed" : "pointer",
                  fontFamily: "'Lora', Georgia, serif",
                }}
              >
                {sending ? "Sending\u2026" : "Send to All Subscribers"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
