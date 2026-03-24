"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("You're in! Check your inbox for a welcome message.");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div style={{ backgroundColor: "#FFFDF7", minHeight: "100vh", color: "#1a1a1a" }}>
      {/* Navigation */}
      <nav style={{
        borderBottom: "1px solid #e8e0d0",
        padding: "20px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <div style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, fontSize: "22px", color: "#1a1a1a" }}>
          What You Missed
        </div>
        <Link href="/archives" style={{
          color: "#D97706",
          textDecoration: "none",
          fontSize: "18px",
          fontWeight: 500,
        }}>
          Past Issues
        </Link>
      </nav>

      {/* Hero Section */}
      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 40px" }}>
        <h1 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "clamp(36px, 6vw, 54px)",
          fontWeight: 700,
          lineHeight: 1.2,
          color: "#1a1a1a",
          marginBottom: "24px",
        }}>
          The week&apos;s big stories,<br />
          <span style={{ color: "#D97706" }}>explained simply.</span>
        </h1>

        <p style={{
          fontSize: "20px",
          lineHeight: 1.7,
          color: "#444",
          marginBottom: "16px",
          maxWidth: "580px",
        }}>
          Every week, we pick the most-talked-about topics and explain them in plain, friendly English — no jargon, no assumptions, no confusion.
        </p>

        <p style={{
          fontSize: "18px",
          lineHeight: 1.7,
          color: "#555",
          marginBottom: "48px",
          maxWidth: "580px",
        }}>
          Think of it as a letter from a smart friend who keeps up with the news and translates it just for you.
        </p>

        {/* Signup Form */}
        <div style={{
          backgroundColor: "#fff",
          border: "2px solid #e8e0d0",
          borderRadius: "16px",
          padding: "40px",
          marginBottom: "64px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}>
          <h2 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "26px",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: "8px",
          }}>
            Get it in your inbox, free
          </h2>
          <p style={{ fontSize: "17px", color: "#666", marginBottom: "28px" }}>
            Delivered every Monday morning. Unsubscribe anytime with one click.
          </p>

          {status === "success" ? (
            <div style={{
              backgroundColor: "#f0fdf4",
              border: "2px solid #86efac",
              borderRadius: "12px",
              padding: "24px",
              textAlign: "center",
            }}>
              <p style={{ fontSize: "20px", color: "#166534", fontWeight: 600, margin: 0 }}>
                {message}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label htmlFor="name" style={{ display: "block", fontSize: "17px", fontWeight: 500, marginBottom: "8px", color: "#333" }}>
                  Your first name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Margaret"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: "18px",
                    border: "2px solid #d1c9b8",
                    borderRadius: "8px",
                    backgroundColor: "#FFFDF7",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label htmlFor="email" style={{ display: "block", fontSize: "17px", fontWeight: 500, marginBottom: "8px", color: "#333" }}>
                  Your email address <span style={{ color: "#D97706" }}>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    fontSize: "18px",
                    border: "2px solid #d1c9b8",
                    borderRadius: "8px",
                    backgroundColor: "#FFFDF7",
                    color: "#1a1a1a",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              {status === "error" && (
                <div style={{
                  backgroundColor: "#fff1f2",
                  border: "1px solid #fecaca",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "16px",
                }}>
                  <p style={{ color: "#991b1b", fontSize: "16px", margin: 0 }}>{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "20px",
                  fontWeight: 600,
                  backgroundColor: status === "loading" ? "#f59e0b" : "#D97706",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s",
                  fontFamily: "'Lora', Georgia, serif",
                }}
              >
                {status === "loading" ? "Signing you up\u2026" : "Yes, send me the newsletter!"}
              </button>

              <p style={{ fontSize: "14px", color: "#888", marginTop: "12px", textAlign: "center" }}>
                No spam. Just one friendly email per week.
              </p>
            </form>
          )}
        </div>

        {/* Example Explainer */}
        <div style={{ marginBottom: "64px" }}>
          <h2 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "28px",
            fontWeight: 600,
            color: "#1a1a1a",
            marginBottom: "8px",
          }}>
            Here&apos;s what it sounds like
          </h2>
          <p style={{ fontSize: "17px", color: "#666", marginBottom: "28px" }}>
            A real snippet from a past issue — this is the kind of writing you&apos;ll get every week.
          </p>

          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderLeft: "4px solid #D97706",
            borderRadius: "0 12px 12px 0",
            padding: "32px",
            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{
              fontFamily: "'Lora', Georgia, serif",
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a1a1a",
              marginBottom: "16px",
            }}>
              Why everyone is talking about &ldquo;AI&rdquo;
            </h3>
            <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#333", marginBottom: "16px" }}>
              You&apos;ve probably heard the word &ldquo;artificial intelligence&rdquo; a lot lately — maybe on the news, from your grandkids, or your doctor&apos;s office. It can sound frightening or confusing. But here&apos;s the simple version: AI is just a very clever computer program that has learned to do things we used to think only humans could do.
            </p>
            <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#333", marginBottom: "16px" }}>
              Think of it like a very fast, very well-read assistant who has read every book ever written. You can ask it questions, and it gives you an answer. It can write a letter for you, help plan a trip, or even talk through a recipe. It doesn&apos;t think or feel — it just matches patterns, very quickly.
            </p>
            <p style={{ fontSize: "18px", lineHeight: 1.8, color: "#333" }}>
              Why does it matter to you? More and more services you use — your bank, your phone, your doctor&apos;s office — are quietly using AI to help answer questions and sort through information. Knowing what it is means you won&apos;t be caught off guard when someone mentions it.
            </p>
          </div>
        </div>

        {/* Trust signals */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "64px",
          justifyContent: "center",
        }}>
          {[
            { icon: "📬", text: "Delivered every Monday" },
            { icon: "✅", text: "No tech jargon, ever" },
            { icon: "🔒", text: "We never sell your email" },
            { icon: "👋", text: "Unsubscribe any time" },
          ].map((item) => (
            <div key={item.text} style={{
              backgroundColor: "#fff",
              border: "1px solid #e8e0d0",
              borderRadius: "10px",
              padding: "16px 24px",
              fontSize: "17px",
              color: "#444",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #e8e0d0",
        padding: "32px 24px",
        textAlign: "center",
        color: "#888",
        fontSize: "15px",
      }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ marginBottom: "8px" }}>
            <strong style={{ color: "#1a1a1a", fontFamily: "'Lora', Georgia, serif" }}>What You Missed</strong>
            {" "}— a weekly newsletter for real people
          </p>
          <p>
            <Link href="/archives" style={{ color: "#D97706", textDecoration: "none" }}>Past Issues</Link>
            {" · "}
            <a href="mailto:hello@whatyoumissed.online" style={{ color: "#D97706", textDecoration: "none" }}>Contact</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
