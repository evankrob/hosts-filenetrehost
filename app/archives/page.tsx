import { getSupabaseAdmin } from "@/lib/supabase";
import Link from "next/link";
import type { Newsletter } from "@/lib/supabase";

const PAGE_SIZE = 10;

export const dynamic = "force-dynamic";

interface ArchivesPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ArchivesPage({ searchParams }: ArchivesPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = getSupabaseAdmin();
  const { data: newsletters, error, count } = await supabase
    .from("newsletters")
    .select("*", { count: "exact" })
    .eq("status", "sent")
    .order("sent_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <Link href="/" style={{ fontFamily: "'Lora', Georgia, serif", fontWeight: 700, fontSize: "22px", color: "#1a1a1a", textDecoration: "none" }}>
          What You Missed
        </Link>
        <Link href="/archives" style={{ color: "#D97706", textDecoration: "none", fontSize: "18px", fontWeight: 500 }}>
          Past Issues
        </Link>
      </nav>

      <main style={{ maxWidth: "700px", margin: "0 auto", padding: "60px 24px 80px" }}>
        <h1 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "40px",
          fontWeight: 700,
          color: "#1a1a1a",
          marginBottom: "12px",
        }}>
          Past Issues
        </h1>
        <p style={{ fontSize: "18px", color: "#666", marginBottom: "48px" }}>
          Every edition, explained in plain English. Browse the archive below.
        </p>

        {error && (
          <div style={{ backgroundColor: "#fff1f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
            <p style={{ color: "#991b1b", margin: 0 }}>Unable to load newsletters right now. Please try again soon.</p>
          </div>
        )}

        {!error && (!newsletters || newsletters.length === 0) && (
          <div style={{
            backgroundColor: "#fff",
            border: "1px solid #e8e0d0",
            borderRadius: "12px",
            padding: "48px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "20px", color: "#666", margin: "0 0 12px" }}>No newsletters yet!</p>
            <p style={{ fontSize: "17px", color: "#888", margin: 0 }}>Check back soon — the first edition is coming.</p>
            <div style={{ marginTop: "32px" }}>
              <Link href="/" style={{
                backgroundColor: "#D97706",
                color: "#fff",
                textDecoration: "none",
                padding: "14px 28px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: 600,
                fontFamily: "'Lora', Georgia, serif",
              }}>
                Subscribe to get notified
              </Link>
            </div>
          </div>
        )}

        {newsletters && newsletters.length > 0 && (
          <div>
            {newsletters.map((newsletter: Newsletter) => (
              <Link
                key={newsletter.id}
                href={`/archives/${newsletter.slug}`}
                style={{ textDecoration: "none", display: "block", marginBottom: "20px" }}
              >
                <div style={{
                  backgroundColor: "#fff",
                  border: "1px solid #e8e0d0",
                  borderRadius: "12px",
                  padding: "28px 32px",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                  cursor: "pointer",
                }}>
                  <p style={{ fontSize: "14px", color: "#D97706", fontWeight: 500, margin: "0 0 8px", letterSpacing: "0.5px" }}>
                    {formatDate(newsletter.sent_at)}
                  </p>
                  <h2 style={{
                    fontFamily: "'Lora', Georgia, serif",
                    fontSize: "22px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    margin: "0 0 8px",
                    lineHeight: 1.4,
                  }}>
                    {newsletter.subject || "Untitled Issue"}
                  </h2>
                  <p style={{ fontSize: "16px", color: "#888", margin: 0 }}>
                    Read this issue &rarr;
                  </p>
                </div>
              </Link>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "40px" }}>
                {page > 1 && (
                  <Link
                    href={`/archives?page=${page - 1}`}
                    style={{
                      padding: "12px 24px",
                      border: "2px solid #D97706",
                      borderRadius: "8px",
                      color: "#D97706",
                      textDecoration: "none",
                      fontSize: "17px",
                      fontWeight: 500,
                    }}
                  >
                    &larr; Newer
                  </Link>
                )}
                <span style={{
                  padding: "12px 20px",
                  fontSize: "16px",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                }}>
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/archives?page=${page + 1}`}
                    style={{
                      padding: "12px 24px",
                      border: "2px solid #D97706",
                      borderRadius: "8px",
                      color: "#D97706",
                      textDecoration: "none",
                      fontSize: "17px",
                      fontWeight: 500,
                    }}
                  >
                    Older &rarr;
                  </Link>
                )}
              </div>
            )}
          </div>
        )}
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
            <Link href="/" style={{ color: "#D97706", textDecoration: "none" }}>Subscribe</Link>
            {" · "}
            <a href="mailto:hello@whatyoumissed.online" style={{ color: "#D97706", textDecoration: "none" }}>Contact</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
