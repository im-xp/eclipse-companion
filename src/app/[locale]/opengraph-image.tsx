import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Social share card (Open Graph + Twitter): the event wordmark over an eclipse
// glow with the "Festival Guide" label, so a shared link previews on-brand.
export const alt = "Iceland Eclipse — Festival Guide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Montserrat 800 is the app's display face. Pull just the glyphs we render
// (Google returns a truetype subset for &text=, which satori can parse).
async function loadDisplayFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Montserrat:wght@800&text=${encodeURIComponent(
      text
    )}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((https:\/\/[^)]+)\)/);
    if (!src) return null;
    return await (await fetch(src[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const eyebrow = "SNÆFELLSNES PENINSULA · 11–15 AUGUST 2026";
  const title = "FESTIVAL GUIDE";

  const [logo, font] = await Promise.all([
    readFile(join(process.cwd(), "public/iceland-eclipse-logo.png")),
    loadDisplayFont(eyebrow + title),
  ]);
  const logoSrc = `data:image/png;base64,${Buffer.from(logo).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#03040a",
          backgroundImage:
            "radial-gradient(115% 115% at 50% 34%, rgba(255,200,90,0.18), rgba(110,74,168,0.10) 40%, rgba(31,224,208,0.05) 58%, rgba(3,4,10,0) 72%)",
        }}
      >
        <img
          src={logoSrc}
          width={760}
          height={Math.round((760 * 1787) / 4607)}
          style={{ objectFit: "contain" }}
          alt=""
        />
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontFamily: font ? "Montserrat" : "sans-serif",
            fontWeight: 800,
            fontSize: 104,
            letterSpacing: "-0.02em",
            color: "#f7f4ea",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontFamily: font ? "Montserrat" : "sans-serif",
            fontWeight: 800,
            fontSize: 25,
            letterSpacing: "0.26em",
            color: "#ffc85a",
          }}
        >
          {eyebrow}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Montserrat", data: font, weight: 800, style: "normal" }]
        : undefined,
    }
  );
}
