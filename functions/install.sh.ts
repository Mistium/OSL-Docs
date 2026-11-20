/* osl-lang.org/install.sh: the OSL installer, passed through from the
   compiler's repository so it is always the copy on main, the same file
   gosl.mistium.com serves. A Cloudflare Pages Function. */

const SCRIPT = "https://git.rotur.dev/osl/.go/raw/branch/main/install.sh";

const HEADERS = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-cache",
  "x-content-type-options": "nosniff",
};

export async function onRequest({ request }: { request: Request }): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed\n", {
      status: 405,
      headers: { ...HEADERS, allow: "GET, HEAD" },
    });
  }
  let upstream: Response;
  try {
    upstream = await fetch(SCRIPT);
  } catch {
    upstream = new Response(null, { status: 502 });
  }
  if (!upstream.ok) {
    // curl -f stops on the status, so sh never runs this; it's for a browser.
    const message = `The OSL installer couldn't be fetched from ${SCRIPT}. Try again in a minute.\n`;
    return new Response(message, { status: 502, headers: HEADERS });
  }
  return new Response(request.method === "HEAD" ? null : upstream.body, { headers: HEADERS });
}
