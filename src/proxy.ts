import { NextRequest, NextResponse } from "next/server";
import { asLocale, type Locale } from "@/lib/i18n";

/**
 * Two jobs, in order:
 *
 * 1. Staging password gate — password only (no username). Enabled ONLY when
 *    STAGING_PASSWORD is set, so production (var unset) is never gated.
 *    Unauthenticated requests are redirected to /gate; /api/gate sets a cookie
 *    holding sha256(password) and this proxy lets the request through when the
 *    cookie matches.
 *
 * 2. Locale rewrite — every page lives under app/[locale]/, but public URLs
 *    stay clean. app.icelandeclipse.com (and any non-eclipse.is host) is
 *    always English; app.eclipse.is defaults to Icelandic unless the visitor's
 *    IP country (x-vercel-ip-country, set by Vercel's edge) is not IS. There
 *    is deliberately no user-facing toggle. The rewritten path is the CDN
 *    cache key, so per-locale caching needs no Vary handling.
 */
const GATE_COOKIE = "staging_gate";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function pickLocale(req: NextRequest): Locale {
  // Vercel overwrites x-vercel-ip-country on ALL its deployments (previews
  // included), so staging can't spoof the geo path with a header. Dev and
  // preview builds honor an explicit override instead; production never does.
  if (process.env.VERCEL_ENV !== "production") {
    const debug =
      req.nextUrl.searchParams.get("debug-locale") ??
      req.headers.get("x-debug-locale") ??
      req.cookies.get("debug_locale")?.value;
    if (debug === "en" || debug === "is") return debug;
  }
  const host = req.headers.get("host") ?? "";
  if (!(host === "eclipse.is" || host.endsWith(".eclipse.is"))) return "en";
  return asLocale(
    req.headers.get("x-vercel-ip-country") === "IS" ? "is" : "en"
  );
}

export async function proxy(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  const password = process.env.STAGING_PASSWORD;
  if (password && pathname !== "/gate" && pathname !== "/api/gate") {
    const cookie = req.cookies.get(GATE_COOKIE)?.value;
    if (!cookie || cookie !== (await sha256Hex(password))) {
      const url = req.nextUrl.clone();
      url.pathname = "/gate";
      url.search = `?next=${encodeURIComponent(pathname + req.nextUrl.search)}`;
      return NextResponse.redirect(url);
    }
  }

  // API routes live outside the locale tree.
  if (pathname.startsWith("/api")) return NextResponse.next();

  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  // Keep an explicit ?debug-locale= sticky across client navigations on
  // dev/preview (RSC fetches don't carry the query param).
  if (process.env.VERCEL_ENV !== "production") {
    const q = req.nextUrl.searchParams.get("debug-locale");
    if (q === "en" || q === "is") {
      res.cookies.set("debug_locale", q, { maxAge: 3600, sameSite: "lax" });
    }
  }
  return res;
}

export const config = {
  // Exclude _next internals, API routes, and anything with a file extension
  // (sw.js, manifest.webmanifest, favicon.ico, images, fonts) — those are real
  // files, not pages, and must never be locale-rewritten or gate-redirected.
  // NOTE: /gate is NOT excluded — it needs the locale rewrite to resolve to
  // app/[locale]/gate/ (a page outside [locale] would require a second root
  // layout, which Next forbids).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
