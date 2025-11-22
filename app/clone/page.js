export const dynamic = "force-dynamic";

import { rewriteHtml } from "../../lib/rewrite";

async function fetchUpstreamHtml(targetUrl) {
  const res = await fetch(targetUrl, {
    // Must be server-side
    cache: "no-store",
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; WebCloner/1.0; +https://agentic-1275c1cf.vercel.app)"
    }
  });
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    // Redirect to proxy for non-HTML
    return {
      nonHtml: true
    };
  }
  const html = await res.text();
  return { html };
}

export default async function ClonePage({ searchParams }) {
  const target = searchParams?.url;
  if (!target) {
    return (
      <div className="container">
        <div className="card">
          <h2>Missing URL</h2>
          <p>Please provide a URL query parameter.</p>
        </div>
      </div>
    );
  }

  const decodedUrl = Array.isArray(target) ? target[0] : target;

  try {
    const res = await fetchUpstreamHtml(decodedUrl);
    if (res.nonHtml) {
      // Redirect using an anchor tag since we are in a server component
      return (
        <div className="container">
          <div className="card">
            <h2>Redirecting to asset</h2>
            <p>
              The requested URL is not HTML.{" "}
              <a href={`/api/proxy?url=${encodeURIComponent(decodedUrl)}`}>
                Open asset
              </a>
            </p>
          </div>
        </div>
      );
    }
    const rewritten = rewriteHtml(res.html, decodedUrl);
    return (
      <html lang="en">
        <head />
        <body dangerouslySetInnerHTML={{ __html: rewritten }} />
      </html>
    );
  } catch (e) {
    return (
      <div className="container">
        <div className="card">
          <h2>Failed to clone</h2>
          <p className="muted">{String(e)}</p>
        </div>
      </div>
    );
  }
}

