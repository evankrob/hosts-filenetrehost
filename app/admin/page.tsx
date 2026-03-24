import { getSession } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/admin/login");
  }

  const supabase = getSupabaseAdmin();

  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: totalSubscribers },
    { data: latestDraft },
    { count: sentCount },
  ] = await Promise.all([
    supabase.from("topics").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("topics").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("topics").select("*", { count: "exact", head: true }),
    supabase.from("newsletters").select("id, subject, status, created_at").eq("status", "draft").order("created_at", { ascending: false }).limit(1),
    supabase.from("newsletters").select("*", { count: "exact", head: true }).eq("status", "sent"),
  ]);

  const hasDraft = latestDraft && latestDraft.length > 0;

  const statCard = (label: string, value: number | null | undefined, color: string) => (
    <div style={{
      backgroundColor: "#fff",
      border: "1px solid #e8e0d0",
      borderRadius: "12px",
      padding: "24px 28px",
      flex: "1",
      minWidth: "160px",
    }}>
      <div style={{ fontSize: "36px", fontWeight: 700, color, fontFamily: "'Lora', Georgia, serif" }}>{value ?? 0}</div>
      <div style={{ fontSize: "16px", color: "#666", marginTop: "4px" }}>{label}</div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#FFFDF7", minHeight: "100vh", color: "#1a1a1a" }}>
      <nav style={{
        borderBottom: "1px solid #e8e0d0",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
      }}>
        <div style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, fontSize: "20px" }}>
          WYM Admin
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <Link href="/" style={{ color: "#D97706", textDecoration: "none", fontSize: "14px" }}>View Site</Link>
          <Link href="/admin/topics" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Topics</Link>
          <Link href="/admin/draft" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Draft</Link>
          <Link href="/admin/send" style={{ color: "#555", textDecoration: "none", fontSize: "14px" }}>Send</Link>
        </div>
      </nav>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>
          Dashboard
        </h1>
        <p style={{ color: "#666", fontSize: "16px", marginBottom: "40px" }}>
          Welcome back. Here&apos;s what needs your attention.
        </p>

        {/* Stats Row */}
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "40px" }}>
          {statCard("Pending Topics", pendingCount, "#D97706")}
          {statCard("Approved Topics", approvedCount, "#16a34a")}
          {statCard("Issues Sent", sentCount, "#2563eb")}
        </div>

        {/* Actions */}
        <h2 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "22px", fontWeight: 700, marginBottom: "20px" }}>
          What to do next
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Step 1: Review Topics */}
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderRadius: "12px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <div>
              <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "18px", fontWeight: 700, margin: "0 0 4px" }}>
                1. Review Topics
              </h3>
              <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
                {(pendingCount ?? 0) > 0
                  ? `${pendingCount} topic${(pendingCount ?? 0) === 1 ? "" : "s"} waiting for your review`
                  : "No pending topics right now"}
              </p>
            </div>
            <Link href="/admin/topics" style={{
              backgroundColor: "#D97706",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              Review Topics &rarr;
            </Link>
          </div>

          {/* Step 2: Generate Draft */}
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderRadius: "12px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <div>
              <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "18px", fontWeight: 700, margin: "0 0 4px" }}>
                2. Generate & Edit Draft
              </h3>
              <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
                {hasDraft
                  ? `Draft ready: "${latestDraft![0].subject || "Untitled"}"`
                  : `${(approvedCount ?? 0)} approved topic${(approvedCount ?? 0) === 1 ? "" : "s"} ready to generate from`}
              </p>
            </div>
            <Link href="/admin/draft" style={{
              backgroundColor: hasDraft ? "#16a34a" : "#555",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              {hasDraft ? "Edit Draft →" : "Create Draft →"}
            </Link>
          </div>

          {/* Step 3: Send */}
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderRadius: "12px",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}>
            <div>
              <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "18px", fontWeight: 700, margin: "0 0 4px" }}>
                3. Send Newsletter
              </h3>
              <p style={{ fontSize: "15px", color: "#666", margin: 0 }}>
                {hasDraft ? "A draft is ready to send to subscribers" : "Create and approve a draft first"}
              </p>
            </div>
            <Link href="/admin/send" style={{
              backgroundColor: hasDraft ? "#2563eb" : "#ccc",
              color: "#fff",
              textDecoration: "none",
              padding: "10px 24px",
              borderRadius: "8px",
              fontSize: "15px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              pointerEvents: hasDraft ? "auto" : "none",
            }}>
              Send Issue &rarr;
            </Link>
          </div>
        </div>

        {/* Curation info */}
        <div style={{
          marginTop: "40px",
          backgroundColor: "#fff",
          border: "1px solid #e8e0d0",
          borderRadius: "12px",
          padding: "24px 28px",
        }}>
          <h3 style={{ fontFamily: "'Lora', Georgia, serif", fontSize: "18px", fontWeight: 700, margin: "0 0 8px" }}>
            Automatic Curation
          </h3>
          <p style={{ fontSize: "15px", color: "#666", margin: "0 0 8px" }}>
            Topics are automatically fetched every Monday at 9am UTC from Hacker News, Reddit, and BBC News.
          </p>
          <p style={{ fontSize: "14px", color: "#999", margin: 0 }}>
            You can also trigger curation manually by calling <code style={{ backgroundColor: "#f5f5f5", padding: "2px 6px", borderRadius: "4px" }}>GET /api/cron/curate</code> with the CRON_SECRET header.
          </p>
        </div>
      </main>
    </div>
  );
}
