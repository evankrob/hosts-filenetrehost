import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/session";
import { getSupabaseAdmin } from "@/lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

export async function POST() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch approved topics
  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(10);

  if (topicsError) {
    return NextResponse.json({ error: "Failed to fetch approved topics." }, { status: 500 });
  }

  if (!topics || topics.length === 0) {
    return NextResponse.json(
      { error: "No approved topics found. Please approve at least 2 topics before generating a draft." },
      { status: 400 }
    );
  }

  const client = new Anthropic();

  const topicsList = topics.map((t, i) =>
    `${i + 1}. Title: ${t.title}\n   Summary: ${t.summary || "No summary available."}\n   Source: ${t.source_name || "Unknown"}`
  ).join("\n\n");

  const prompt = `You are writing a weekly newsletter called "What You Missed" for older adults who are not tech-savvy. Your tone is warm, friendly, and conversational — like a smart friend writing you a letter, not a news website or tech blog.

Here are this week's approved topics:

${topicsList}

Please write a complete newsletter with:

1. A warm, friendly subject line (not clickbait — just honest and inviting)
2. A short personal opening paragraph (2-3 sentences) greeting readers warmly and setting up the week's stories
3. For each topic, write an "explainer" section with:
   - A plain-English headline (no jargon)
   - 2-3 short paragraphs explaining the topic simply, using everyday analogies
   - A clear "Why does this matter to you?" closing sentence
4. A warm sign-off paragraph (2-3 sentences)

IMPORTANT RULES:
- Write for people aged 65+ who are not comfortable with technology or jargon
- Short sentences. Short paragraphs. Plenty of white space.
- No acronyms without spelling them out first
- Use analogies to everyday life (cooking, gardening, talking to a neighbor, etc.)
- Avoid words like: "algorithm", "AI" without explanation, "platform", "disruptive", "leverage"
- Tone: warm, patient, never condescending, never panicked about technology
- Cover 4-6 topics total (skip any that feel too technical or not relevant to everyday people)

Format your response as JSON with this exact structure:
{
  "subject": "The subject line here",
  "content_html": "The full HTML content here"
}

For the content_html, use this HTML structure:
- Opening paragraph: <p>...</p>
- Each topic section: <div class="topic-section"><h2>Topic headline</h2><p>...</p><p>...</p><p><strong>Why this matters to you:</strong> ...</p></div>
- Sign-off: <p class="signoff">...</p>

Only return valid JSON. No markdown code blocks. No extra text outside the JSON.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = message.content[0].type === "text" ? message.content[0].text : "";

    let parsed: { subject: string; content_html: string };
    try {
      // Strip any possible markdown code fences
      const cleaned = responseText.replace(/^```json\s*/, "").replace(/```\s*$/, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Claude returned an unexpected format. Please try again." },
        { status: 500 }
      );
    }

    if (!parsed.subject || !parsed.content_html) {
      return NextResponse.json(
        { error: "Claude response was incomplete. Please try again." },
        { status: 500 }
      );
    }

    // Save draft to database
    const { data: draft, error: saveError } = await supabase
      .from("newsletters")
      .insert({
        subject: parsed.subject,
        content_html: parsed.content_html,
        status: "draft",
      })
      .select()
      .single();

    if (saveError) {
      return NextResponse.json({ error: "Generated content but failed to save draft." }, { status: 500 });
    }

    // Link topics to newsletter
    const topicLinks = topics.map((t) => ({
      newsletter_id: draft.id,
      topic_id: t.id,
    }));

    await supabase.from("newsletter_topics").insert(topicLinks);

    return NextResponse.json({ draft });
  } catch (err) {
    console.error("Claude generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate newsletter. Please check your Anthropic API key and try again." },
      { status: 500 }
    );
  }
}
