"use client";

import { useState } from "react";
import { MapViewer } from "@/components/MapViewer";

interface MapOption {
  id: string;
  label: string;
  src: string;
  width: number;
  height: number;
}

export function MapSwitcher({ maps }: { maps: MapOption[] }) {
  const [activeId, setActiveId] = useState(maps[0].id);
  const active = maps.find((m) => m.id === activeId) ?? maps[0];

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 shrink-0 rounded-pill border border-moon-white/15 bg-eclipse-black/70 p-0.5 backdrop-blur">
        {maps.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setActiveId(m.id)}
            aria-pressed={activeId === m.id}
            className={`rounded-pill px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] transition-colors ${
              activeId === m.id
                ? "bg-moon-white text-eclipse-black"
                : "text-moon-white/60 hover:text-moon-white"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
      <MapViewer
        key={active.id}
        src={active.src}
        width={active.width}
        height={active.height}
      />
    </div>
  );
}
