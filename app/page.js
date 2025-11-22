import Link from "next/link";
import { buildCloneUrl } from "../lib/rewrite";

function normalizeUrl(input) {
  try {
    const u = new URL(input);
    return u.toString();
  } catch {
    return new URL(`https://${input}`).toString();
  }
}

export default function Home() {
  return (
    <div className="container">
      <div className="card">
        <h1>Website Cloner</h1>
        <p className="muted">Enter a URL to clone and browse it through a proxy.</p>
        <form action="/clone" method="GET" style={{ marginTop: 16 }}>
          <div className="row">
            <input
              type="url"
              name="url"
              placeholder="https://example.com"
              required
              inputMode="url"
              defaultValue=""
            />
            <button type="submit">Clone</button>
          </div>
        </form>
        <div style={{ marginTop: 16 }}>
          <span className="muted">Examples: </span>
          {" "}
          <Link href={buildCloneUrl(normalizeUrl("https://example.com"))}>example.com</Link>
          {" ? "}
          <Link href={buildCloneUrl(normalizeUrl("https://wikipedia.org"))}>wikipedia.org</Link>
        </div>
      </div>
    </div>
  );
}

