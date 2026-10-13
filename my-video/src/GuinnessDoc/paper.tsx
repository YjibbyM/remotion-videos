import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { FONT } from "../BsmJacobAd/kit";
import { G_WORDS, G_SENTENCES } from "./timing";

export { FONT };

// Paper-cut documentary palette. Lime is reserved for the BSM moment.
export const P = {
  paper: "#efe6d2",
  paper2: "#e7dbc2",
  card: "#fbf7ee",
  ink: "#1d1b17",
  red: "#d0442a",
  mustard: "#e8b43b",
  teal: "#2f6f6a",
  green: "#1f4d3a",
  gold: "#c9a24a",
  stout: "#2a1a12",
  head: "#f1dfb2",
  skin: "#e7b18c",
  wood: "#9b6a3c",
  lime: "#d2f24b",
};

const FPS = 30;

export const useSec = () => useCurrentFrame() / FPS;

// Stop-motion: animation advances on twos, like hand-moved paper.
export const useStepFrame = () => Math.floor(useCurrentFrame() / 2) * 2;

export const rand = (seed: number) => {
  const x = Math.sin(seed * 99.13 + 7.7) * 43758.5453;
  return x - Math.floor(x);
};

export const ramp = (sec: number, a: number, b: number) =>
  Math.min(1, Math.max(0, (sec - a) / (b - a)));

/* ---------- timing helpers ---------- */
export const wordT = (i: number) => G_WORDS[i].t;
export const sentT = (k: number) => wordT(G_SENTENCES[k][0]);
// Time of the first word in sentence k that starts with `prefix`.
export const at = (k: number, prefix: string) => {
  const [a, b] = G_SENTENCES[k];
  for (let i = a; i <= b; i++) {
    if (G_WORDS[i].w.toLowerCase().startsWith(prefix.toLowerCase()))
      return wordT(i);
  }
  throw new Error(`"${prefix}" not in sentence ${k}`);
};

/* ---------- layout ---------- */
// Scenes are drawn on a 1080x1150 stage that scales to the frame height.
export const STAGE_H = 1150;
export const useFrameLayout = () => {
  const { height } = useVideoConfig();
  const tall = height >= 1900;
  const stageTop = height * (tall ? 0.07 : 0.04);
  const stageScale = Math.min(1, (height * (tall ? 0.58 : 0.62)) / STAGE_H);
  const captionTop = height * (tall ? 0.69 : 0.7);
  const captionSize = tall ? 62 : 52;
  return { height, tall, stageTop, stageScale, captionTop, captionSize };
};

export const Stage: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { stageTop, stageScale } = useFrameLayout();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: stageTop,
        width: 1080,
        height: STAGE_H,
        marginLeft: -540,
        transform: `scale(${stageScale})`,
        transformOrigin: "50% 0",
      }}
    >
      {children}
    </div>
  );
};

/* ---------- paper ---------- */
export const PaperBg: React.FC<{ color?: string; id: string }> = ({
  color = P.paper,
  id,
}) => (
  <AbsoluteFill style={{ backgroundColor: color }}>
    <svg width="100%" height="100%" style={{ position: "absolute" }}>
      <filter id={`fiber-${id}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves={3}
          seed={4}
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <filter id={`mottle-${id}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.004"
          numOctaves={2}
          seed={9}
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter={`url(#mottle-${id})`}
        opacity={0.18}
        style={{ mixBlendMode: "multiply" }}
      />
      <rect
        width="100%"
        height="100%"
        filter={`url(#fiber-${id})`}
        opacity={0.22}
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(60,40,10,.22) 100%)",
      }}
    />
  </AbsoluteFill>
);

// Jagged edge polygon for torn paper.
export const torn = (seed: number, amp = 2.2) => {
  const pts: string[] = [];
  const n = 18;
  for (let i = 0; i <= n; i++)
    pts.push(`${(i / n) * 100}% ${rand(seed + i) * amp}%`);
  for (let i = 0; i <= 6; i++)
    pts.push(`${100 - rand(seed + 40 + i) * 1.2}% ${(i / 6) * 100}%`);
  for (let i = n; i >= 0; i--)
    pts.push(`${(i / n) * 100}% ${100 - rand(seed + 80 + i) * amp}%`);
  for (let i = 6; i >= 0; i--)
    pts.push(`${rand(seed + 120 + i) * 1.2}% ${(i / 6) * 100}%`);
  return `polygon(${pts.join(",")})`;
};

// White sticker outline plus a lifted-paper shadow.
export const STICKER =
  "drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff) drop-shadow(8px 14px 0 rgba(40,25,5,.22))";
export const LIFT = "drop-shadow(8px 14px 0 rgba(40,25,5,.22))";

type From = "up" | "down" | "left" | "right" | "pop" | "drop";

// A cut-out that animates in on twos, idles with a little jitter, then leaves.
export const Cut: React.FC<{
  x: number;
  y: number;
  at: number;
  out?: number;
  from?: From;
  rot?: number;
  scale?: number;
  sticker?: boolean;
  seed?: number;
  z?: number;
  move?: { at: number; x?: number; y?: number; scale?: number; rot?: number };
  children: React.ReactNode;
}> = ({
  x,
  y,
  at: t0,
  out,
  from = "pop",
  rot = 0,
  scale = 1,
  sticker = true,
  seed = 1,
  z = 1,
  move,
  children,
}) => {
  const frame = useStepFrame();
  const sec = frame / FPS;
  if (sec < t0 - 0.02) return null;
  if (out !== undefined && sec > out + 0.35) return null;
  const p = spring({
    frame: frame - Math.round(t0 * FPS),
    fps: FPS,
    config: { damping: 13, stiffness: 170, mass: 0.7 },
  });
  const o =
    out === undefined
      ? 0
      : interpolate(sec, [out, out + 0.3], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
  const m = move
    ? spring({
        frame: frame - Math.round(move.at * FPS),
        fps: FPS,
        config: { damping: 15, stiffness: 140 },
      })
    : 0;
  const cx = x + (move?.x !== undefined ? (move.x - x) * m : 0);
  const cy = y + (move?.y !== undefined ? (move.y - y) * m : 0);
  const cs = scale + (move?.scale !== undefined ? (move.scale - scale) * m : 0);
  const cr = rot + (move?.rot !== undefined ? (move.rot - rot) * m : 0);
  const step = Math.floor(frame / 4);
  const jr = (rand(seed * 31 + step) - 0.5) * 1.1;
  const jx = (rand(seed * 17 + step) - 0.5) * 3;
  let dx = 0,
    dy = 0,
    s = 1;
  const q = 1 - p;
  if (from === "up") dy = q * 900;
  if (from === "down") dy = -q * 900;
  if (from === "left") dx = -q * 1200;
  if (from === "right") dx = q * 1200;
  if (from === "drop") {
    dy = -q * 300;
    s = 1 + q * 0.6;
  }
  if (from === "pop") s = p;
  dx += o * (out !== undefined ? 1300 * (seed % 2 ? 1 : -1) : 0);
  return (
    <div
      style={{
        position: "absolute",
        left: cx,
        top: cy,
        zIndex: z,
        transform: `translate(-50%,-50%) translate(${dx + jx}px,${dy}px) rotate(${cr + jr + q * 8}deg) scale(${cs * s})`,
        opacity: from === "drop" ? Math.min(1, p * 3) : 1,
        filter: sticker ? STICKER : LIFT,
      }}
    >
      {children}
    </div>
  );
};

// A torn paper label with typewriter-ish caps.
export const Tag: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  size?: number;
  seed?: number;
  pad?: string;
}> = ({ children, bg = P.card, color = P.ink, size = 34, seed = 3, pad }) => (
  <div
    style={{
      background: bg,
      color,
      clipPath: torn(seed, 6),
      padding: pad ?? `${size * 0.55}px ${size * 0.9}px`,
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </div>
);

// Red marker stroke that draws itself.
export const Marker: React.FC<{
  d: string;
  at: number;
  dur?: number;
  width?: number;
  height?: number;
  stroke?: string;
  sw?: number;
  style?: React.CSSProperties;
}> = ({
  d,
  at: t0,
  dur = 0.45,
  width = 400,
  height = 200,
  stroke = P.red,
  sw = 12,
  style,
}) => {
  const sec = useSec();
  if (sec < t0) return null;
  const p = ramp(sec, t0, t0 + dur);
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", overflow: "visible", ...style }}
    >
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - p}
        opacity={0.92}
      />
    </svg>
  );
};

// Rubber stamp that slams in.
export const Stamp: React.FC<{
  children: React.ReactNode;
  at: number;
  color?: string;
  size?: number;
  rot?: number;
  round?: boolean;
}> = ({ children, at: t0, color = P.red, size = 40, rot = -8, round }) => {
  const frame = useStepFrame();
  if (frame / FPS < t0) return null;
  const p = spring({
    frame: frame - Math.round(t0 * FPS),
    fps: FPS,
    config: { damping: 12, stiffness: 300 },
  });
  return (
    <div
      style={{
        display: "inline-block",
        padding: round ? size * 0.7 : `${size * 0.25}px ${size * 0.5}px`,
        border: `${Math.max(4, size / 7)}px solid ${color}`,
        borderRadius: round ? "50%" : 8,
        color,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        opacity: 0.88,
        mixBlendMode: "multiply",
        transform: `rotate(${rot}deg) scale(${interpolate(p, [0, 1], [2.4, 1])})`,
      }}
    >
      {children}
    </div>
  );
};

// Halftone dot overlay for a printed, archival feel.
export const halftone = (color = "rgba(0,0,0,.18)", size = 10) => ({
  backgroundImage: `radial-gradient(${color} 28%, transparent 30%)`,
  backgroundSize: `${size}px ${size}px`,
});
