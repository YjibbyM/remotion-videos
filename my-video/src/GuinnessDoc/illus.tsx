import React from "react";
import { FONT, P, halftone } from "./paper";

// Flat paper cut-outs. Generic stand-ins: no real trademarks or likenesses.

export const TallMan: React.FC<{ h: number }> = ({ h }) => (
  <svg height={h} viewBox="0 0 120 520">
    <rect x="34" y="0" width="52" height="16" rx="4" fill={P.ink} />
    <rect x="44" y="-28" width="32" height="32" rx="4" fill={P.ink} />
    <circle cx="60" cy="44" r="28" fill={P.skin} />
    <path
      d="M26 82 h68 l10 210 h-22 l-6 -150 l-4 150 h-24 l-4 -150 l-6 150 h-22z"
      fill={P.teal}
    />
    <rect x="34" y="290" width="22" height="210" fill={P.ink} />
    <rect x="64" y="290" width="22" height="210" fill={P.ink} />
    <rect x="26" y="498" width="34" height="14" rx="6" fill={P.ink} />
    <rect x="62" y="498" width="34" height="14" rx="6" fill={P.ink} />
  </svg>
);

export const Ruler: React.FC<{ h: number }> = ({ h }) => (
  <div
    style={{
      position: "relative",
      width: 70,
      height: h,
      background: P.mustard,
    }}
  >
    {Array.from({ length: 24 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: 0,
          top: (i / 24) * h,
          width: i % 4 === 0 ? 38 : 20,
          height: 4,
          background: P.ink,
        }}
      />
    ))}
  </div>
);

export const NailHand: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} viewBox="0 0 360 300">
    <path
      d="M40 300 L60 170 Q70 130 110 130 L250 130 Q290 130 290 170 L300 300z"
      fill={P.skin}
    />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect
          x={84 + i * 48}
          y={50}
          width={38}
          height={110}
          rx={18}
          fill={P.skin}
        />
        <path
          d={`M${88 + i * 48} 56 q ${-30 - i * 6} -40 ${-6 + i * 10} -${60 + i * 6} q 40 -10 ${30 - i * 4} 30`}
          fill="none"
          stroke={P.red}
          strokeWidth={14}
          strokeLinecap="round"
        />
      </g>
    ))}
    <path
      d="M60 190 q -40 -10 -50 -60"
      fill="none"
      stroke={P.skin}
      strokeWidth={40}
      strokeLinecap="round"
    />
  </svg>
);

// A generic stout: dark body, cream head. No branding.
export const Pint: React.FC<{ h: number }> = ({ h }) => (
  <svg height={h} viewBox="0 0 200 340">
    <path
      d="M20 20 h160 l-18 300 q -2 16 -18 16 h-88 q -16 0 -18 -16z"
      fill={P.stout}
    />
    <path d="M20 20 h160 l-4 52 h-152z" fill={P.head} />
    <path
      d="M40 90 l10 220"
      stroke="rgba(255,255,255,.25)"
      strokeWidth={10}
      strokeLinecap="round"
    />
  </svg>
);

export const PintTop: React.FC<{ d: number }> = ({ d }) => (
  <svg width={d} height={d} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill={P.stout} />
    <circle cx="50" cy="50" r="40" fill={P.head} />
    <circle cx="40" cy="42" r="8" fill="rgba(255,255,255,.5)" />
  </svg>
);

export const Bubble: React.FC<{
  text: string;
  color?: string;
  w?: number;
  flip?: boolean;
}> = ({ text, color = P.card, w = 300, flip }) => (
  <div style={{ position: "relative", width: w }}>
    <div
      style={{
        background: color,
        borderRadius: "50%",
        padding: "48px 30px",
        textAlign: "center",
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: w * 0.22,
        lineHeight: 1,
        color: P.ink,
      }}
    >
      {text}
    </div>
    <svg
      width="70"
      height="60"
      viewBox="0 0 70 60"
      style={{
        position: "absolute",
        bottom: -40,
        [flip ? "right" : "left"]: 50,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      <path d="M0 0 L20 60 L60 0z" fill={color} />
    </svg>
  </div>
);

// Vintage oval portrait with an anonymous silhouette.
export const Portrait: React.FC<{ w: number }> = ({ w }) => (
  <div
    style={{
      width: w,
      height: w * 1.25,
      borderRadius: "50%",
      border: `${w * 0.05}px solid ${P.gold}`,
      background: "#d8c29a",
      overflow: "hidden",
      position: "relative",
      ...halftone("rgba(80,50,10,.18)", 9),
    }}
  >
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 250"
      style={{ position: "absolute" }}
    >
      <circle cx="100" cy="100" r="42" fill="#3b2a1d" />
      <path d="M20 250 q 10 -90 80 -95 q 70 5 80 95z" fill="#3b2a1d" />
      <path d="M86 162 l14 30 l14 -30z" fill="#efe6d2" />
    </svg>
  </div>
);

export const Bird: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} viewBox="0 0 300 140">
    <path
      d="M10 80 q 60 -10 110 -6 q 40 -70 120 -64 q -60 30 -70 70 q 60 6 120 -8 q -40 40 -120 44 q -40 26 -100 20 q 20 -20 30 -34 q -50 2 -90 -22z"
      fill="#6b5435"
    />
    <circle cx="210" cy="72" r="5" fill={P.card} />
    <path d="M222 80 l26 -2 l-24 10z" fill={P.mustard} />
  </svg>
);

export const SpeedLines: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} viewBox="0 0 300 140">
    {[30, 60, 90, 115].map((y, i) => (
      <rect
        key={y}
        x={i * 20}
        y={y}
        width={200 - i * 30}
        height={8}
        rx={4}
        fill={P.ink}
        opacity={0.5}
      />
    ))}
  </svg>
);

export const Bulb: React.FC<{ h: number; glow: number }> = ({ h, glow }) => (
  <svg height={h} viewBox="0 0 200 300" style={{ overflow: "visible" }}>
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return (
        <rect
          key={i}
          x={96}
          y={-40}
          width={8}
          height={40 * glow}
          rx={4}
          fill={P.mustard}
          transform={`rotate(${(a * 180) / Math.PI} 100 100) translate(0 -${20 + glow * 20})`}
        />
      );
    })}
    <circle cx="100" cy="100" r="80" fill={P.mustard} />
    <rect x="62" y="170" width="76" height="70" rx="10" fill="#9b9b94" />
    <rect x="62" y="190" width="76" height="8" fill="#6f6f69" />
    <rect x="62" y="212" width="76" height="8" fill="#6f6f69" />
    <path
      d="M80 150 q 20 -40 40 0"
      fill="none"
      stroke="#fff6d8"
      strokeWidth={8}
    />
  </svg>
);

// Generic record book. Title is descriptive, not the real cover design.
export const Book: React.FC<{ w: number; open: number }> = ({ w, open }) => (
  <div
    style={{
      position: "relative",
      width: w,
      height: w * 1.32,
      perspective: 1600,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: P.card,
        borderRadius: 8,
        padding: w * 0.1,
        display: "grid",
        gap: w * 0.04,
        alignContent: "start",
      }}
    >
      {[0.9, 0.7, 0.85, 0.6, 0.8, 0.5, 0.75].map((k, i) => (
        <div
          key={i}
          style={{
            height: w * 0.03,
            width: `${k * 100}%`,
            background: "rgba(29,27,23,.25)",
            borderRadius: 4,
          }}
        />
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: P.green,
        borderRadius: 8,
        transformOrigin: "0% 50%",
        transform: `rotateY(${-open * 160}deg)`,
        backfaceVisibility: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: w * 0.05,
        color: P.gold,
        fontFamily: FONT,
        textAlign: "center",
        ...halftone("rgba(0,0,0,.18)", 8),
      }}
    >
      <div style={{ width: "70%", height: 4, background: P.gold }} />
      <div
        style={{
          fontWeight: 900,
          fontSize: w * 0.11,
          lineHeight: 0.95,
          letterSpacing: "-0.02em",
        }}
      >
        THE BOOK
        <br />
        OF RECORDS
      </div>
      <div
        style={{ fontWeight: 700, fontSize: w * 0.07, letterSpacing: "0.2em" }}
      >
        1955
      </div>
      <div style={{ width: "70%", height: 4, background: P.gold }} />
    </div>
  </div>
);

export const QCard: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      background: P.card,
      padding: "18px 24px",
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: 34,
      color: P.ink,
      whiteSpace: "nowrap",
      borderLeft: `10px solid ${P.red}`,
    }}
  >
    {text}
  </div>
);

export const Table: React.FC<{ d: number }> = ({ d }) => (
  <svg width={d} height={d} viewBox="0 0 200 200">
    <circle cx="100" cy="100" r="98" fill={P.wood} />
    {[30, 50, 70, 86].map((r) => (
      <circle
        key={r}
        cx="100"
        cy="100"
        r={r}
        fill="none"
        stroke="rgba(60,30,10,.25)"
        strokeWidth={2}
      />
    ))}
  </svg>
);

export const Head: React.FC<{
  d: number;
  hair: string;
  skin?: string;
  rot?: number;
}> = ({ d, hair, skin = P.skin, rot = 0 }) => (
  <svg
    width={d}
    height={d}
    viewBox="0 0 100 100"
    style={{ transform: `rotate(${rot}deg)` }}
  >
    <circle cx="50" cy="54" r="40" fill={skin} />
    <path
      d="M10 50 q 0 -42 40 -42 q 40 0 40 42 q -18 -18 -40 -16 q -22 -2 -40 16z"
      fill={hair}
    />
    <circle cx="36" cy="60" r="4.5" fill={P.ink} />
    <circle cx="64" cy="60" r="4.5" fill={P.ink} />
  </svg>
);

export const Trophy: React.FC<{ h: number }> = ({ h }) => (
  <svg height={h} viewBox="0 0 200 240">
    <path
      d="M40 20 h120 v50 q 0 70 -60 80 q -60 -10 -60 -80z"
      fill={P.mustard}
    />
    <path
      d="M40 40 q -36 0 -30 30 q 6 26 34 30"
      fill="none"
      stroke={P.mustard}
      strokeWidth={14}
    />
    <path
      d="M160 40 q 36 0 30 30 q -6 26 -34 30"
      fill="none"
      stroke={P.mustard}
      strokeWidth={14}
    />
    <rect x="86" y="148" width="28" height="40" fill={P.mustard} />
    <rect x="50" y="186" width="100" height="34" rx="6" fill={P.ink} />
  </svg>
);

export const Polaroid: React.FC<{ w: number; children: React.ReactNode }> = ({
  w,
  children,
}) => (
  <div
    style={{
      background: "#fff",
      padding: `${w * 0.06}px ${w * 0.06}px ${w * 0.2}px`,
    }}
  >
    <div
      style={{
        width: w * 0.88,
        height: w * 0.88,
        background: "#e7dcc8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

export const Magnifier: React.FC<{ d: number }> = ({ d }) => (
  <svg width={d} height={d} viewBox="0 0 200 200">
    <circle
      cx="80"
      cy="80"
      r="60"
      fill="rgba(255,255,255,.35)"
      stroke={P.ink}
      strokeWidth={18}
    />
    <rect
      x="128"
      y="120"
      width="26"
      height="80"
      rx="10"
      fill={P.ink}
      transform="rotate(-45 141 160)"
    />
  </svg>
);
