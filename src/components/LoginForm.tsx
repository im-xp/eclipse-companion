"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AuthMode } from "@/lib/profile";

export function LoginForm({
  mode,
  notFoundEmail,
  notice,
}: {
  mode: AuthMode;
  notFoundEmail?: string;
  notice?: string;
}) {
  const submitLabel =
    mode === "live"
      ? "Email me a login code"
      : mode === "magic"
        ? "Email me a login link"
        : "View my profile";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code" | "sent">("email");
  const [error, setError] = useState<string | null>(
    notFoundEmail
      ? `No participant found for ${notFoundEmail}.`
      : (notice ?? null)
  );
  const [busy, setBusy] = useState(false);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        const body = (await res.json()) as {
          codeSent?: boolean;
          linkSent?: boolean;
        };
        if (body.linkSent) {
          setStep("sent");
        } else if (body.codeSent) {
          setStep("code");
        } else {
          router.refresh();
        }
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(
        body.error === "not_found"
          ? "We couldn't find a participant with that email."
          : body.error === "invalid_email"
            ? "That doesn't look like an email address."
            : "Something went wrong. Try again."
      );
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(
        body.error === "invalid_code"
          ? "That code didn't match — check the email and try again."
          : "Something went wrong. Try again."
      );
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-aurora-cyan">Participant access</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-moon-white">
          Your Eclipse Profile
        </h1>

        {step === "email" && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-moon-white/65">
              Enter the email you registered with to see your participation
              profile, ticket details and check-in code.
            </p>
            {mode === "demo" && (
              <p className="mt-3 rounded-soft border border-solar-corona/30 bg-solar-corona/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-solar-corona">
                Demo mode — any email signs in with a sample profile
              </p>
            )}
            <form onSubmit={submitEmail} className="mt-6 flex flex-col gap-3">
              <input
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-pill border border-moon-white/20 bg-deep-space/60 px-5 py-3.5 text-moon-white placeholder:text-moon-white/35 focus:border-aurora-cyan focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-pill border border-signal-yellow bg-signal-yellow px-7 py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-eclipse-black transition-all duration-200 hover:-translate-y-0.5 hover:border-solar-corona hover:bg-solar-corona disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Working…" : submitLabel}
              </button>
            </form>
          </>
        )}

        {step === "sent" && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-moon-white/65">
              If <span className="text-moon-white">{email}</span> is registered,
              we just emailed a sign-in link. Open it on this device to view your
              profile — it expires in 15 minutes and works once.
            </p>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setError(null);
              }}
              className="mt-6 font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/50 transition-colors hover:text-moon-white"
            >
              Use a different email
            </button>
          </>
        )}

        {step === "code" && (
          <>
            <p className="mt-3 text-sm leading-relaxed text-moon-white/65">
              We emailed a 6-digit code to{" "}
              <span className="text-moon-white">{email}</span>. Enter it below.
            </p>
            <form onSubmit={submitCode} className="mt-6 flex flex-col gap-3">
              <input
                type="text"
                required
                autoComplete="one-time-code"
                inputMode="numeric"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-pill border border-moon-white/20 bg-deep-space/60 px-5 py-3.5 text-center font-mono text-lg tracking-[0.3em] text-moon-white placeholder:text-moon-white/35 focus:border-aurora-cyan focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy}
                className="rounded-pill border border-signal-yellow bg-signal-yellow px-7 py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-eclipse-black transition-all duration-200 hover:-translate-y-0.5 hover:border-solar-corona hover:bg-solar-corona disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Verifying…" : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setError(null);
                }}
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-moon-white/50 transition-colors hover:text-moon-white"
              >
                Use a different email
              </button>
            </form>
          </>
        )}

        {error && <p className="mt-4 text-sm text-eclipse-orange">{error}</p>}
      </div>
    </div>
  );
}
