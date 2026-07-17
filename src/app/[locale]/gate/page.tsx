import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enter password — Iceland Eclipse",
};

export default async function GatePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;

  return (
    <div className="container-page flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <p className="eyebrow text-aurora-cyan">Staging preview</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-moon-white">
          Enter password
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-moon-white/65">
          This is a private preview of the Iceland Eclipse companion app.
        </p>
        <form action="/api/gate" method="POST" className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="next" value={next ?? "/"} />
          <input
            type="password"
            name="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            className="w-full rounded-pill border border-moon-white/20 bg-deep-space/60 px-5 py-3.5 text-moon-white placeholder:text-moon-white/35 focus:border-aurora-cyan focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-pill border border-signal-yellow bg-signal-yellow px-7 py-3.5 font-mono text-[12px] font-bold uppercase tracking-[0.08em] text-eclipse-black transition-all duration-200 hover:-translate-y-0.5 hover:border-solar-corona hover:bg-solar-corona"
          >
            Enter
          </button>
        </form>
        {error && (
          <p className="mt-4 text-sm text-eclipse-orange">
            Wrong password — try again.
          </p>
        )}
      </div>
    </div>
  );
}
