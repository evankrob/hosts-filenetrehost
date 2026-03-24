import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { subject, content_html, content_text } = body;

    const updates: Record<string, string> = {};
    if (subject !== undefined) updates.subject = subject;
    if (content_html !== undefined) updates.content_html = content_html;
    if (content_text !== undefined) updates.content_text = content_text;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update." }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("newsletters")
      .update(updates)
      .eq("id", id)
      .eq("status", "draft") // Only allow editing drafts
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Failed to update draft." }, { status: 500 });
    }

    return NextResponse.json({ draft: data });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}
