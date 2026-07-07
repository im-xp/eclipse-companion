"use client";

import { useEffect, useState } from "react";

// Registers the offline service worker and surfaces a gentle refresh prompt
// when a newer build is waiting (so a changed schedule can't silently stick
// to a stale cache once the user is back online).
export function ServiceWorkerRegister() {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        if (reg.waiting) setWaiting(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const next = reg.installing;
          if (!next) return;
          next.addEventListener("statechange", () => {
            if (next.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(next);
            }
          });
        });
      })
      .catch(() => {
        // Offline / unsupported — the app still works, just not cached.
      });
  }, []);

  if (!waiting) return null;

  return (
    <div className="fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-sm items-center justify-between gap-3 rounded-pill border border-signal-yellow/60 bg-deep-space/95 px-4 py-2.5 shadow-lg backdrop-blur">
      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-moon-white">
        Schedule updated
      </span>
      <button
        type="button"
        onClick={() => waiting.postMessage("SKIP_WAITING")}
        className="shrink-0 rounded-pill bg-signal-yellow px-4 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-eclipse-black transition-colors hover:bg-solar-corona"
      >
        Refresh
      </button>
    </div>
  );
}
