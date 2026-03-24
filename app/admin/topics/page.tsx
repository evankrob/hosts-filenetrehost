"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Topic = {
  id: string;
  title: string;
  summary: string | null;
  source_url: string | null;
  source_name: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type StatusFilter = "pending" | "approved" | "rejected" | "all";

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [filter, setFilter] = useState<StatusFilter>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const url = filter === "all" ? "/api/admin/topics" : `/api/admin/topics?status=${filter}`;
      const res = await fetch(url);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch topics");
      const data = await res.json();
      setTopics(data.topics || []);
    } catch {
      setError("Failed to load topics. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  async function updateStatus(id: string, newStatus: "approved" | "rejected" | "pending") {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to update");
      setTopics((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    } catch {
      alert("Failed to update topic status. Please try again.");
    } finally {
      setUpdating(null);
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      pending: { bg: "#fef3c7", color: "#92400e" },
      approved: { bg: "#dcfce7", color: "#166534" },
      rejected: { bg: "#fee2e2", color: "#991b1b" },
    };
    const c = colors[status] || { bg: "#f3f4f6", color: "#374151" };
    return (
      <span style={{
        backgroundColor: c.bg,
        color: c.color,
        padding: "3px 10px",
        borderRadius: "12px",
        fontSize: "13px",
        fontWeight: 600,
        textTransform: "capitalize" as const,
      }}>
        {status}
      </span>
    );
  };

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
          <Link href="/admin/topics" style={{ color: "#D97706", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Topics</Link>
          <Link href="/admin/draft" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Draft</Link>
          <Link href="/admin/send" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Send</Link>
        </div>
      </nav>

      <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "30px", fontWeight: 700, marginBottom: "6px" }}>
              Curated Topics
            </h1>
            <p style={{ color: "#666", fontSize: "15px" }}>
              Review and approve topics for this week&apos;s newsletter.
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
          {(["pending", "approved", "rejected", "all"] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "8px 20px",
                borderRadius: "20px",
                border: "2px solid",
                borderColor: filter === f ? "#D97706" : "#e8e0d0",
                backgroundColor: filter === f ? "#D97706" : "#fff",
                color: filter === f ? "#fff" : "#555",
                fontSize: "15px",
                fontWeight: filter === f ? 600 : 400,
                cursor: "pointer",
                textTransform: "capitalize" as const,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {error && (
          <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
            <p style={{ color: "#991b1b", margin: 0 }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>Loading topics&hellip;</div>
        ) : topics.length === 0 ? (
          <div style={{ backgroundColor: "#fff", border: "1px solid #e8e0d0", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "18px", margin: 0 }}>
              No {filter === "all" ? "" : filter} topics found.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {topics.map((topic) => (
              <div
                key={topic.id}
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e8e0d0",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  opacity: updating === topic.id ? 0.6 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px", flexWrap: "wrap" }}>
                      {statusBadge(topic.status)}
                      {topic.source_name && (
                        <span style={{ fontSize: "13px", color: "#888" }}>{topic.source_name}</span>
                      )}
                      <span style={{ fontSize: "13px", color: "#bbb" }}>{formatDate(topic.created_at)}</span>
                    </div>
                    <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 6px" }}>
                      {topic.title}
                    </h3>
                    {topic.summary && (
                      <p style={{ fontSize: "15px", color: "#555", margin: "0 0 8px", lineHeight: 1.6 }}>
                        {topic.summary}
                      </p>
                    )}
                    {topic.source_url && (
                      <a
                        href={topic.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: "13px", color: "#D97706", textDecoration: "none" }}
                      >
                        View source &rarr;
                      </a>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                    {topic.status !== "approved" && (
                      <button
                        onClick={() => updateStatus(topic.id, "approved")}
                        disabled={updating === topic.id}
                        style={{
                          padding: "8px 18px",
                          backgroundColor: "#16a34a",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Approve
                      </button>
                    )}
                    {topic.status !== "rejected" && (
                      <button
                        onClick={() => updateStatus(topic.id, "rejected")}
                        disabled={updating === topic.id}
                        style={{
                          padding: "8px 18px",
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          fontSize: "14px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        Reject
                      </button>
                    )}
                    {topic.status !== "pending" && (
                      <button
                        onClick={() => updateStatus(topic.id, "pending")}
                        disabled={updating === topic.id}
                        style={{
                          padding: "8px 18px",
                          backgroundColor: "#f5f5f5",
                          color: "#555",
                          border: "1px solid #d1c9b8",
                          borderRadius: "8px",
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
