"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Draft = {
  id: string;
  subject: string | null;
  content_html: string | null;
  content_text: string | null;
  status: string;
  created_at: string;
};

export default function AdminDraftPage() {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editContent, setEditContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchDraft();
  }, []);

  async function fetchDraft() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/draft");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch draft");
      const data = await res.json();
      if (data.draft) {
        setDraft(data.draft);
        setEditSubject(data.draft.subject || "");
        setEditContent(data.draft.content_html || "");
      } else {
        setDraft(null);
      }
    } catch {
      setError("Failed to load draft. Please refresh.");
    } finally {
      setLoading(false);
    }
  }

  async function generateDraft() {
    setGenerating(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/generate", { method: "POST" });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Generation failed. Please try again.");
        return;
      }
      setDraft(data.draft);
      setEditSubject(data.draft.subject || "");
      setEditContent(data.draft.content_html || "");
      setSuccessMsg("Draft generated successfully! Review and edit it below.");
    } catch {
      setError("Failed to generate draft. Please check that you have approved topics and try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/draft/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: editSubject, content_html: editContent }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save. Please try again.");
        return;
      }
      setDraft(data.draft);
      setSuccessMsg("Draft saved successfully.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
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
          <Link href="/admin/draft" style={{ color: "#D97706", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Draft</Link>
          <Link href="/admin/send" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Send</Link>
        </div>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "30px", fontWeight: 700, marginBottom: "8px" }}>
          Newsletter Draft
        </h1>
        <p style={{ color: "#666", fontSize: "15px", marginBottom: "32px" }}>
          Generate this week&apos;s newsletter from approved topics, then edit before sending.
        </p>

        {error && (
          <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ color: "#991b1b", margin: 0 }}>{error}</p>
          </div>
        )}
        {successMsg && (
          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
            <p style={{ color: "#166534", margin: 0 }}>{successMsg}</p>
          </div>
        )}

        {/* Generate Button */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid #e8e0d0",
          borderRadius: "12px",
          padding: "28px",
          marginBottom: "28px",
        }}>
          <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
            {draft ? "Regenerate draft" : "Generate this week's draft"}
          </h2>
          <p style={{ color: "#666", fontSize: "15px", marginBottom: "20px" }}>
            This will use Claude AI to write the newsletter from your approved topics.
            {draft && " Warning: this will replace the current draft."}
          </p>
          <button
            onClick={generateDraft}
            disabled={generating}
            style={{
              padding: "12px 28px",
              backgroundColor: generating ? "#f59e0b" : "#D97706",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: 600,
              cursor: generating ? "not-allowed" : "pointer",
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            {generating ? "Generating with Claude\u2026 (this may take 30-60 seconds)" : "Generate Draft with Claude AI"}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading&hellip;</div>
        ) : !draft ? (
          <div style={{
            backgroundColor: "#fff",
            border: "1px dashed #d1c9b8",
            borderRadius: "12px",
            padding: "48px",
            textAlign: "center",
          }}>
            <p style={{ color: "#888", fontSize: "18px", margin: 0 }}>
              No draft yet. Click &ldquo;Generate Draft&rdquo; above to create one from your approved topics.
            </p>
          </div>
        ) : (
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderRadius: "12px",
            padding: "28px",
          }}>
            <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
              Edit Draft
            </h2>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", fontSize: "15px", fontWeight: 600, marginBottom: "8px", color: "#333" }}>
                Subject Line
              </label>
              <input
                type="text"
                value={editSubject}
                onChange={(e) => setEditSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "16px",
                  border: "2px solid #d1c9b8",
                  borderRadius: "8px",
                  backgroundColor: "#FFFDF7",
                  color: "#1a1a1a",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "15px", fontWeight: 600, marginBottom: "8px", color: "#333" }}>
                Content (HTML)
              </label>
              <p style={{ fontSize: "13px", color: "#888", marginBottom: "8px" }}>
                You can edit the HTML directly. Use &lt;h2&gt; for section headings, &lt;p&gt; for paragraphs.
              </p>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={30}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "14px",
                  fontFamily: "monospace",
                  border: "2px solid #d1c9b8",
                  borderRadius: "8px",
                  backgroundColor: "#FFFDF7",
                  color: "#1a1a1a",
                  outline: "none",
                  boxSizing: "border-box",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={saveDraft}
                disabled={saving}
                style={{
                  padding: "12px 28px",
                  backgroundColor: saving ? "#9ca3af" : "#1a1a1a",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  cursor: saving ? "not-allowed" : "pointer",
                }}
              >
                {saving ? "Saving\u2026" : "Save Changes"}
              </button>

              <Link
                href="/admin/send"
                style={{
                  padding: "12px 28px",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  fontWeight: 600,
                  display: "inline-block",
                }}
              >
                Proceed to Send &rarr;
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
