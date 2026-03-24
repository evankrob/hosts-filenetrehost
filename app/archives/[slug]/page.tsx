import { getSupabaseAdmin } from "@/lib/supabase";
import NewsletterTemplate from "@/components/NewsletterTemplate";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsletterArchivePage({ params }: SlugPageProps) {
  const { slug } = await params;
  const supabase = getSupabaseAdmin();

  const { data: newsletter, error } = await supabase
    .from("newsletters")
    .select("*")
    .eq("slug", slug)
    .eq("status", "sent")
    .single();

  if (error || !newsletter) {
    notFound();
  }

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

      <div style={{ padding: "32px 24px 0", maxWidth: "700px", margin: "0 auto" }}>
        <Link href="/archives" style={{ color: "#D97706", textDecoration: "none", fontSize: "16px" }}>
          &larr; All issues
        </Link>
        {newsletter.sent_at && (
          <p style={{ color: "#888", fontSize: "15px", marginTop: "8px", marginBottom: "0" }}>
            Sent on {formatDate(newsletter.sent_at)}
          </p>
        )}
      </div>

      <div style={{ paddingBottom: "64px" }}>
        <NewsletterTemplate
          subject={newsletter.subject || "What You Missed"}
          contentHtml={newsletter.content_html || "<p>This issue has no content.</p>"}
        />
      </div>

      {/* Subscribe CTA */}
      <div style={{
        backgroundColor: "#D97706",
        padding: "48px 24px",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "'Lora', Georgia, serif",
          fontSize: "28px",
          fontWeight: 700,
          color: "#fff",
          marginBottom: "12px",
        }}>
          Enjoyed this issue?
        </h2>
        <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.9)", marginBottom: "28px" }}>
          Get it in your inbox every Monday — free.
        </p>
        <Link href="/" style={{
          backgroundColor: "#fff",
          color: "#D97706",
          textDecoration: "none",
          padding: "16px 36px",
          borderRadius: "10px",
          fontSize: "20px",
          fontWeight: 700,
          fontFamily: "'Lora', Georgia, serif",
          display: "inline-block",
        }}>
          Subscribe for free
        </Link>
      </div>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid #e8e0d0",
        padding: "32px 24px",
        textAlign: "center",
        color: "#888",
        fontSize: "15px",
        backgroundColor: "#FFFDF7",
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
