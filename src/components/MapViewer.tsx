"use client";

import { useCallback, useEffect, useRef } from "react";

interface MapViewerProps {
  src: string;
  width: number;
  height: number;
}

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 6;

export function MapViewer({ src, width, height }: MapViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const transform = useRef<Transform>({ x: 0, y: 0, scale: 1 });
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const lastTap = useRef(0);

  const baseFit = useRef<{ scale: number; x: number; y: number }>({
    scale: 1,
    x: 0,
    y: 0,
  });

  const apply = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const { x, y, scale } = transform.current;
    const base = baseFit.current;
    img.style.transform = `translate(${x}px, ${y}px) scale(${base.scale * scale})`;
  }, []);

  const recenter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const fit = Math.min(cw / width, ch / height);
    baseFit.current = { scale: fit, x: 0, y: 0 };
    transform.current = {
      x: (cw - width * fit) / 2,
      y: (ch - height * fit) / 2,
      scale: 1,
    };
    apply();
  }, [apply, width, height]);

  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;
      const t = transform.current;
      const prev = t.scale;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
      const ratio = next / prev;
      t.x = px - (px - t.x) * ratio;
      t.y = py - (py - t.y) * ratio;
      t.scale = next;
      apply();
    },
    [apply]
  );

  useEffect(() => {
    recenter();
    const onResize = () => recenter();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recenter]);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        scale: transform.current.scale,
      };
    }
    if (pointers.current.size === 1) {
      const now = Date.now();
      if (now - lastTap.current < 300) {
        const factor = transform.current.scale > 1.5 ? 0.01 : 2.4;
        if (factor < 1) {
          recenter();
        } else {
          zoomAt(e.clientX, e.clientY, factor);
        }
        lastTap.current = 0;
      } else {
        lastTap.current = now;
      }
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const curr = { x: e.clientX, y: e.clientY };

    if (pointers.current.size === 2 && pinchStart.current) {
      pointers.current.set(e.pointerId, curr);
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      const targetScale =
        (pinchStart.current.scale * dist) / pinchStart.current.dist;
      const factor = targetScale / transform.current.scale;
      zoomAt(midX, midY, factor);
    } else if (pointers.current.size === 1) {
      transform.current.x += curr.x - prev.x;
      transform.current.y += curr.y - prev.y;
      pointers.current.set(e.pointerId, curr);
      apply();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  };

  const onWheel = (e: React.WheelEvent) => {
    const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
    zoomAt(e.clientX, e.clientY, factor);
  };

  return (
    <div
      ref={containerRef}
      className="relative size-full touch-none select-none overflow-hidden"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt="Iceland Eclipse festival map, Snæfellsnes Peninsula"
        width={width}
        height={height}
        draggable={false}
        className="absolute left-0 top-0 max-w-none origin-top-left will-change-transform"
      />
      <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-pill border border-moon-white/15 bg-eclipse-black/70 px-4 py-1.5 backdrop-blur-sm">
        <span className="eyebrow text-moon-white/70">
          Pinch or scroll to zoom · double-tap to reset
        </span>
      </div>
    </div>
  );
}
