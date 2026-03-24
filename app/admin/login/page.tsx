"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data.error || "Incorrect password. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <div style={{
      backgroundColor: "#FFFDF7",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid #e8e0d0",
        borderRadius: "16px",
        padding: "48px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 style={{
            fontFamily: "'Lora', Georgia, serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "#1a1a1a",
            marginBottom: "8px",
          }}>
            Admin Login
          </h1>
          <p style={{ color: "#888", fontSize: "15px" }}>What You Missed — Admin Area</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password" style={{ display: "block", fontSize: "16px", fontWeight: 500, marginBottom: "8px", color: "#333" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "17px",
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
              <p style={{ color: "#991b1b", fontSize: "15px", margin: 0 }}>{errorMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "18px",
              fontWeight: 600,
              backgroundColor: status === "loading" ? "#f59e0b" : "#D97706",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              fontFamily: "'Lora', Georgia, serif",
            }}
          >
            {status === "loading" ? "Logging in\u2026" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
