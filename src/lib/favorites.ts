"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ScheduleEvent } from "@/lib/schedule";

const STORAGE_KEY = "ie:schedule:favorites";
const SYNC_URL = "/api/profile/favorites";
const PUSH_DEBOUNCE_MS = 2000;

// start is included to disambiguate repeat slots (10 collisions without it,
// 3 with); the tradeoff is a heart drops if a set's start time changes when
// the schedule is regenerated from the ROS sheet.
export function eventKey(e: ScheduleEvent): string {
  return `${e.date}|${e.stage}|${e.start}|${e.artist}`;
}

interface StoredFavorites {
  v: 1;
  ids: string[];
}

function readStored(): Set<string> {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return new Set();
  try {
    const parsed = JSON.parse(raw) as Partial<StoredFavorites>;
    if (parsed.v === 1 && Array.isArray(parsed.ids)) {
      return new Set(parsed.ids.filter((id) => typeof id === "string"));
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  return new Set();
}

function writeStored(ids: ReadonlySet<string>): void {
  const payload: StoredFavorites = { v: 1, ids: [...ids] };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

/**
 * Hearted schedule events. localStorage is the instant, offline-tolerant
 * source of truth; when the visitor has a live session the set also syncs
 * to their IMXP record (union-merged on load, so hearts survive cleared
 * browser storage and follow them across devices).
 */
export function useFavorites(): {
  favorites: ReadonlySet<string>;
  toggleFavorite: (key: string) => void;
} {
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const syncedRef = useRef(false);
  const pushTimerRef = useRef<number | null>(null);
  const pendingRef = useRef<ReadonlySet<string> | null>(null);

  useEffect(() => {
    // localStorage isn't available during SSR so this can't be a useState initializer.
    const local = readStored();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFavorites(local);

    let cancelled = false;
    void (async () => {
      let server: Set<string> | null = null;
      try {
        const res = await fetch(SYNC_URL, { cache: "no-store" });
        if (!res.ok) return;
        const body = (await res.json()) as { synced?: boolean; ids?: unknown };
        if (!body.synced || !Array.isArray(body.ids)) return;
        server = new Set(body.ids.filter((id): id is string => typeof id === "string"));
      } catch {
        return;
      }
      if (cancelled) return;
      syncedRef.current = true;
      // Union covers both directions: a new device gains this account's
      // hearts, and hearts made here while logged out reach the account.
      const merged = new Set([...readStored(), ...server]);
      writeStored(merged);
      setFavorites(merged);
      if ([...merged].some((id) => !server.has(id))) {
        void fetch(SYNC_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [...merged] }),
        }).catch(() => undefined);
      }
    })();

    const flush = () => {
      if (!pendingRef.current || !syncedRef.current) return;
      const blob = new Blob([JSON.stringify({ ids: [...pendingRef.current] })], {
        type: "application/json",
      });
      navigator.sendBeacon(SYNC_URL, blob);
      pendingRef.current = null;
    };
    window.addEventListener("pagehide", flush);
    return () => {
      cancelled = true;
      window.removeEventListener("pagehide", flush);
      if (pushTimerRef.current !== null) window.clearTimeout(pushTimerRef.current);
    };
  }, []);

  const toggleFavorite = useCallback((key: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      writeStored(next);
      if (syncedRef.current) {
        pendingRef.current = next;
        if (pushTimerRef.current !== null) window.clearTimeout(pushTimerRef.current);
        pushTimerRef.current = window.setTimeout(() => {
          const ids = pendingRef.current;
          pendingRef.current = null;
          if (!ids) return;
          void fetch(SYNC_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: [...ids] }),
          }).catch(() => undefined);
        }, PUSH_DEBOUNCE_MS);
      }
      return next;
    });
  }, []);

  return { favorites, toggleFavorite };
}
