import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import Parser from "rss-parser";

interface RawItem {
  title?: string;
  summary?: string;
  contentSnippet?: string;
  link?: string;
  isoDate?: string;
  pubDate?: string;
}

interface TopicCandidate {
  title: string;
  summary: string;
  source_url: string;
  source_name: string;
}

const parser = new Parser();

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();

  // Fetch topics from last 14 days for deduplication
  const since = new Date();
  since.setDate(since.getDate() - 14);

  const { data: recentTopics } = await supabase
    .from("topics")
    .select("title")
    .gte("created_at", since.toISOString());

  const recentTitles = (recentTopics || []).map((t: { title: string }) => t.title.toLowerCase().split(" ").slice(0, 5).join(" "));

  function isDuplicate(title: string): boolean {
    const firstFiveWords = title.toLowerCase().split(" ").slice(0, 5).join(" ");
    return recentTitles.some((existing) => existing === firstFiveWords);
  }

  const candidates: TopicCandidate[] = [];

  // --- Hacker News ---
  try {
    const hnRes = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json", {
      headers: { "User-Agent": "WhatYouMissed/1.0" },
      next: { revalidate: 0 },
    });
    const storyIds: number[] = await hnRes.json();
    const top20 = storyIds.slice(0, 20);

    const stories = await Promise.allSettled(
      top20.map((id) =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then((r) => r.json())
      )
    );

    for (const result of stories) {
      if (result.status === "fulfilled" && result.value) {
        const item = result.value;
        if (item.title && item.url && !isDuplicate(item.title)) {
          candidates.push({
            title: item.title,
            summary: `Score: ${item.score || 0} points on Hacker News. ${item.descendants || 0} comments.`,
            source_url: item.url,
            source_name: "Hacker News",
          });
        }
      }
    }
  } catch (err) {
    console.error("HN fetch error:", err);
  }

  // --- Reddit r/technology ---
  try {
    const redditRes = await fetch(
      "https://www.reddit.com/r/technology/top.json?t=day&limit=10",
      {
        headers: {
          "User-Agent": "WhatYouMissed/1.0 (newsletter curation bot)",
        },
        next: { revalidate: 0 },
      }
    );
    const redditData = await redditRes.json();
    const posts = redditData?.data?.children || [];

    for (const post of posts) {
      const p = post.data;
      if (p.title && p.url && !p.is_self && !isDuplicate(p.title)) {
        candidates.push({
          title: p.title,
          summary: p.selftext
            ? p.selftext.slice(0, 200)
            : `${p.ups || 0} upvotes on Reddit r/technology.`,
          source_url: `https://reddit.com${p.permalink}`,
          source_name: "Reddit r/technology",
        });
      }
    }
  } catch (err) {
    console.error("Reddit fetch error:", err);
  }

  // --- BBC RSS ---
  try {
    const bbcFeed = await parser.parseURL("http://feeds.bbci.co.uk/news/rss.xml");

    for (const item of (bbcFeed.items || []).slice(0, 15)) {
      const rawItem = item as RawItem;
      if (rawItem.title && !isDuplicate(rawItem.title)) {
        candidates.push({
          title: rawItem.title,
          summary: rawItem.contentSnippet || rawItem.summary || "",
          source_url: rawItem.link || "",
          source_name: "BBC News",
        });
      }
    }
  } catch (err) {
    console.error("BBC RSS fetch error:", err);
  }

  // Limit to 15 unique candidates
  const uniqueCandidates = candidates.slice(0, 15);

  if (uniqueCandidates.length === 0) {
    return NextResponse.json({ message: "No new topics to add.", added: 0 });
  }

  // Insert into database
  const { data: inserted, error: insertError } = await supabase
    .from("topics")
    .insert(
      uniqueCandidates.map((c) => ({
        title: c.title,
        summary: c.summary,
        source_url: c.source_url,
        source_name: c.source_name,
        status: "pending",
      }))
    )
    .select();

  if (insertError) {
    console.error("DB insert error:", insertError);
    return NextResponse.json({ error: "Failed to save topics to database." }, { status: 500 });
  }

  return NextResponse.json({
    message: `Successfully curated ${inserted?.length || 0} topics.`,
    added: inserted?.length || 0,
    topics: inserted,
  });
}
