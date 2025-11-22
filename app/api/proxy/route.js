import { NextResponse } from "next/server";
import { rewriteCss } from "../../../lib/rewrite";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }
  let upstream;
  try {
    upstream = await fetch(target, {
      cache: "no-store",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; WebCloner/1.0; +https://agentic-1275c1cf.vercel.app)"
      }
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "";

  // If HTML, redirect to /clone for proper rewriting
  if (contentType.includes("text/html")) {
    const location = `/clone?url=${encodeURIComponent(target)}`;
    return NextResponse.redirect(new URL(location, request.url));
  }

  // Handle CSS url(...) rewrites
  if (contentType.includes("text/css")) {
    const css = await upstream.text();
    const rewritten = rewriteCss(css, target);
    return new NextResponse(rewritten, {
      status: upstream.status,
      headers: {
        "content-type": "text/css; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }

  // Stream all other content types through
  const blob = await upstream.arrayBuffer();
  const headers = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "content-encoding") return; // avoid double encoding issues
    headers.set(key, value);
  });
  headers.set("cache-control", "no-store");
  return new NextResponse(blob, {
    status: upstream.status,
    headers
  });
}

