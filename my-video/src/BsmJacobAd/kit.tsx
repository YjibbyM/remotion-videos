import React from "react";
import {
  continueRender,
  delayRender,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";
import { FPS, wordTimes } from "./timing";

// Palette and type follow the BSM Bot 2.0 landing page.
export const C = {
  paper: "#f4f1ea",
  paper2: "#ebe7dd",
  card: "#fffdf8",
  ink: "#11110f",
  ink2: "#1a1a17",
  ink3: "#24241f",
  muted: "#77736b",
  mutedInv: "rgba(244,241,234,.52)",
  accent: "#d2f24b",
  lemon: "#f2c641",
  gold: "#b0851c",
  teal: "#2b6f69",
  stamp: "#c2362f",
  grey: "#d9dbd8",
  warm: "#f0e2c4",
  ok: "#1f7a4d",
};

export const FONT = "Archivo";
const fontHandle = delayRender("Loading Archivo");
loadFont({
  family: FONT,
  url: staticFile("fonts/Archivo-Variable-latin.woff2"),
  weight: "100 900",
}).then(() => continueRender(fontHandle));

// Layout was designed at 1080x1920. Other heights (e.g. 4:5 at 1080x1350)
// compress vertical positions fully and type a little less, since the width stays.
export const useL = () => {
  const k = useVideoConfig().height / 1920;
  const fk = k === 1 ? 1 : 0.4 + 0.57 * k;
  return {
    y: (n: number) => n * k,
    f: (n: number) => Math.round(n * fk),
    // Position given as [9:16 design value, 4:5 design value].
    pick: (tall: number, short: number) => (k === 1 ? tall : short) * k,
  };
};

export const useSec = () => useCurrentFrame() / FPS;

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const ramp = (sec: number, a: number, b: number) =>
  clamp01((sec - a) / (b - a));

// Spring that starts at `t` seconds.
export const usePopAt = (t: number, stiffness = 240) => {
  const frame = useCurrentFrame();
  return spring({
    frame: frame - Math.round(t * FPS),
    fps: FPS,
    config: { damping: 15, stiffness, mass: 0.5 },
  });
};

// Fades in at `a`, out at `b` (seconds), with a small lift.
export const Show: React.FC<{
  a: number;
  b: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  lift?: number;
}> = ({ a, b, children, style, lift = 40 }) => {
  const sec = useSec();
  if (sec < a - 0.05 || sec > b + 0.3) return null;
  const inn = ramp(sec, a, a + 0.25);
  const out = ramp(sec, b, b + 0.2);
  return (
    <div
      style={{
        position: "absolute",
        opacity: Math.min(inn, 1 - out),
        transform: `translateY(${(1 - inn) * lift - out * lift}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Headline whose words pop in as the VO says them.
export const Words: React.FC<{
  text: string;
  start: number;
  end: number;
  size: number;
  color?: string;
  accent?: string[];
  accentColor?: string;
  weight?: number;
  upper?: boolean;
  align?: "center" | "left";
}> = ({
  text,
  start,
  end,
  size,
  color = C.ink,
  accent = [],
  accentColor = C.gold,
  weight = 900,
  upper = true,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const words = wordTimes(text, start, end);
  const acc = new Set(accent.map((w) => w.toLowerCase()));
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: "0.24em",
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 0.92,
        letterSpacing: upper ? "-0.05em" : "-0.025em",
        textTransform: upper ? "uppercase" : "none",
        textAlign: align,
        color,
      }}
    >
      {words.map(({ word, t }, i) => {
        const p = spring({
          frame: frame - Math.round(t * FPS),
          fps: FPS,
          config: { damping: 15, stiffness: 260, mass: 0.5 },
        });
        const key = word.toLowerCase().replace(/[^a-z0-9'.]/g, "");
        const isAcc =
          acc.has(word.toLowerCase()) || acc.has(key) || acc.has(String(i));
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              paddingBottom: "0.08em",
              opacity: interpolate(p, [0, 0.3], [0, 1], {
                extrapolateRight: "clamp",
              }),
              transform: `translateY(${(1 - p) * 0.45 * size}px)`,
              color: isAcc ? accentColor : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

export const Label: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
}> = ({ children, color = C.muted, size = 26 }) => (
  <span
    style={{
      display: "block",
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color,
    }}
  >
    {children}
  </span>
);

// The red rubber stamp used across the landing page.
export const Stamp: React.FC<{
  children: React.ReactNode;
  at: number;
  color?: string;
  size?: number;
  rotate?: number;
}> = ({ children, at, color = C.stamp, size = 30, rotate = -6 }) => {
  const p = usePopAt(at, 320);
  return (
    <span
      style={{
        display: "inline-block",
        padding: "6px 16px",
        border: `5px solid ${color}`,
        borderRadius: 6,
        color,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        background: C.card,
        opacity: p > 0.01 ? 1 : 0,
        transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`,
      }}
    >
      {children}
    </span>
  );
};

// A red line drawn across whatever sits under it.
export const Strike: React.FC<{ at: number }> = ({ at }) => {
  const sec = useSec();
  const w = ramp(sec, at, at + 0.25);
  return (
    <div
      style={{
        position: "absolute",
        left: "-4%",
        top: "48%",
        width: "108%",
        height: 14,
        borderRadius: 7,
        background: C.stamp,
        transformOrigin: "left center",
        transform: `scaleX(${w}) rotate(-4deg)`,
      }}
    />
  );
};

export const Card: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  dark?: boolean;
}> = ({ children, style, dark }) => (
  <div
    style={{
      background: dark ? C.ink : C.card,
      color: dark ? C.paper : C.ink,
      borderRadius: 22,
      padding: 36,
      boxShadow: "0 50px 90px -40px rgba(17,17,15,.55)",
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Bubble: React.FC<{
  children: React.ReactNode;
  at: number;
  style?: React.CSSProperties;
}> = ({ children, at, style }) => {
  const p = usePopAt(at, 280);
  const { f } = useL();
  return (
    <div
      style={{
        position: "absolute",
        padding: "24px 30px",
        borderRadius: 28,
        border: `5px solid ${C.ink}`,
        background: "#fff",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: f(44),
        lineHeight: 1.1,
        letterSpacing: "-0.02em",
        color: C.ink,
        transformOrigin: "20% 100%",
        opacity: p > 0.01 ? 1 : 0,
        transform: `scale(${p})`,
        ...style,
      }}
    >
      {children}
      <svg
        width="60"
        height="44"
        viewBox="0 0 60 44"
        style={{ position: "absolute", left: 50, bottom: -40 }}
      >
        <path
          d="M2 0 L18 40 L44 0"
          fill="#fff"
          stroke={C.ink}
          strokeWidth={5}
        />
        <rect x="0" y="0" width="60" height="5" fill="#fff" />
      </svg>
    </div>
  );
};

/* -------- Stand-in line drawings (swap for the site's PNGs when available) -------- */

export const Jacob: React.FC<{ height: number }> = ({ height }) => (
  <svg height={height} viewBox="0 0 220 400" style={{ overflow: "visible" }}>
    <g
      fill="none"
      stroke={C.ink}
      strokeWidth={7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="110" cy="78" r="50" fill="#fff" />
      <path d="M64 62q46-52 92 0" strokeWidth={8} />
      <path d="M92 106q18 10 36 0" />
      <path d="M110 128v130" />
      <path d="M110 158l-48 70" />
      <path d="M110 158l48 70" />
      <path d="M110 258l-34 104" />
      <path d="M110 258l34 104" />
    </g>
    <g fill="#fff" stroke={C.ink} strokeWidth={6}>
      <ellipse cx="60" cy="234" rx="10" ry="12" />
      <ellipse cx="160" cy="234" rx="10" ry="12" />
      <ellipse cx="68" cy="368" rx="20" ry="10" />
      <ellipse cx="152" cy="368" rx="20" ry="10" />
    </g>
    <g fill={C.ink}>
      <ellipse cx="94" cy="76" rx="4.5" ry="6" />
      <ellipse cx="126" cy="76" rx="4.5" ry="6" />
    </g>
  </svg>
);

// The son, as drawn on the landing page.
export const Son: React.FC<{ height: number }> = ({ height }) => (
  <svg height={height} viewBox="0 0 160 240" style={{ overflow: "visible" }}>
    <g
      fill="none"
      stroke={C.ink}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="80" cy="60" r="34" fill="#fff" />
      <path d="M68 70q12 10 24 0" />
      <path d="M80 94v66" />
      <path d="M80 112l-30 36" />
      <path d="M80 112l30 -32" />
      <path d="M80 160l-18 52" />
      <path d="M80 160l18 52" />
      <path d="M48 36q32 -28 64 0" strokeWidth={6} />
      <path d="M110 37l18 4" />
    </g>
    <g fill="#fff" stroke={C.ink} strokeWidth={4}>
      <ellipse cx="48" cy="152" rx="6" ry="8" />
      <ellipse cx="112" cy="76" rx="6" ry="8" />
      <ellipse cx="56" cy="218" rx="11" ry="6" />
      <ellipse cx="104" cy="218" rx="11" ry="6" />
    </g>
    <g fill={C.ink}>
      <ellipse cx="69" cy="55" rx="3.2" ry="4.5" />
      <ellipse cx="91" cy="55" rx="3.2" ry="4.5" />
    </g>
  </svg>
);

export const Rod: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 200 200">
    <g fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round">
      <path d="M30 180 L170 20" />
      <path d="M170 20 Q190 90 160 150" strokeWidth={3} />
      <circle cx="62" cy="144" r="16" fill={C.lemon} />
    </g>
    <path d="M150 150 q10 12 0 22" fill="none" stroke={C.ink} strokeWidth={4} />
  </svg>
);
