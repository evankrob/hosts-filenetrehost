import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendNewsletter } from "@/lib/buttondown";
import { generateSlug } from "@/lib/slug";
import { renderNewsletterToHtml } from "@/components/NewsletterTemplate";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch the latest draft
  const { data: draft, error: draftError } = await supabase
    .from("newsletters")
    .select("*")
    .eq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (draftError || !draft) {
    return NextResponse.json({ error: "No draft found to send." }, { status: 400 });
  }

  if (!draft.subject || !draft.content_html) {
    return NextResponse.json(
      { error: "Draft is missing subject or content. Please edit the draft before sending." },
      { status: 400 }
    );
  }

  // Generate full email HTML using the template
  const emailHtml = renderNewsletterToHtml(draft.subject, draft.content_html);

  // Send via Buttondown
  const result = await sendNewsletter(draft.subject, emailHtml);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to send via Buttondown." },
      { status: 500 }
    );
  }

  // Generate slug and mark as sent
  const slug = generateSlug(draft.subject);
  const now = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("newsletters")
    .update({
      status: "sent",
      sent_at: now,
      slug,
    })
    .eq("id", draft.id)
    .select()
    .single();

  if (updateError) {
    // Email was sent but DB update failed — log it but still return success
    console.error("Failed to update newsletter status after sending:", updateError);
    return NextResponse.json({ success: true, slug, warning: "Sent but failed to update database status." });
  }

  return NextResponse.json({ success: true, slug: updated.slug, newsletter: updated });
}
