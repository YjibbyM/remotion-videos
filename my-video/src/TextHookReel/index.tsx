import React from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/fonts";

// Anton is bundled in public/fonts so renders don't depend on network access.
const display = "Anton";
const fontHandle = delayRender("Loading Anton");
loadFont({
  family: display,
  url: staticFile("fonts/Anton-Regular.woff2"),
  weight: "400",
}).then(() => continueRender(fontHandle));

const BG = "#0A0A0C";
const INK = "#F5F5F0";
const ACCENT = "#FFD60A";

// Beat timings in frames (30fps, 300 frames = 10s).
const BEATS = {
  stop: { from: 0, dur: 85 },
  content: { from: 85, dur: 75 },
  forgettable: { from: 160, dur: 65 },
  fix: { from: 225, dur: 75 },
};

// Fast, slightly overshooting spring for slam-in words.
const usePop = (delay: number, stiffness = 220) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness, mass: 0.6 },
  });
};

// Every beat but the last whips upward out of frame in its final frames.
const BeatExit: React.FC<{
  dur: number;
  children: React.ReactNode;
  hold?: boolean;
}> = ({ dur, children, hold }) => {
  const frame = useCurrentFrame();
  const t = hold
    ? 0
    : interpolate(frame, [dur - 7, dur], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.in(Easing.cubic),
      });
  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        transform: `translateY(${-t * 500}px) scale(${1 + t * 0.15})`,
        opacity: 1 - t,
        filter: `blur(${t * 12}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Word: React.FC<{
  text: string;
  delay: number;
  size: number;
  color?: string;
  mode?: "slam" | "rise";
  style?: React.CSSProperties;
}> = ({ text, delay, size, color = INK, mode = "rise", style }) => {
  const p = usePop(delay);
  const transform =
    mode === "slam"
      ? `scale(${interpolate(p, [0, 1], [2.6, 1])})`
      : `translateY(${interpolate(p, [0, 1], [140, 0])}px) skewY(${interpolate(p, [0, 1], [8, 0])}deg)`;
  return (
    <div
      style={{
        fontFamily: display,
        fontSize: size,
        lineHeight: 0.92,
        color,
        textTransform: "uppercase",
        letterSpacing: "-0.01em",
        opacity: interpolate(p, [0, 0.25], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform,
        textAlign: "center",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

// Beat 1: "STOP" slams in with camera shake, "SCROLLING." rises under it.
const StopBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const decay = interpolate(frame, [3, 22], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 2.3) * 28 * decay;
  const shakeY = Math.cos(frame * 3.1) * 18 * decay;
  return (
    <BeatExit dur={BEATS.stop.dur}>
      <div style={{ transform: `translate(${shakeX}px, ${shakeY}px)` }}>
        <Word text="Stop" delay={0} size={430} mode="slam" />
        <Word text="scrolling." delay={30} size={210} color={ACCENT} />
      </div>
    </BeatExit>
  );
};

// Beat 2: word-by-word "YOUR CONTENT ISN'T BAD."
const ContentBeat: React.FC = () => {
  const words = ["Your", "content", "isn't", "bad."];
  return (
    <BeatExit dur={BEATS.content.dur}>
      <div>
        {words.map((w, i) => (
          <Word
            key={w}
            text={w}
            delay={i * 9}
            size={i === 3 ? 330 : 220}
            color={i === 3 ? ACCENT : INK}
            mode={i === 3 ? "slam" : "rise"}
          />
        ))}
      </div>
    </BeatExit>
  );
};

// Beat 3: "IT'S FORGETTABLE." with an accent bar wiping in behind it.
const ForgettableBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [14, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const tracking = interpolate(frame, [14, BEATS.forgettable.dur], [0, 0.03]);
  return (
    <BeatExit dur={BEATS.forgettable.dur}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Word text="It's" delay={0} size={200} style={{ marginBottom: 30 }} />
        <div style={{ position: "relative", padding: "16px 44px" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: ACCENT,
              transformOrigin: "left center",
              transform: `scaleX(${wipe}) rotate(-2deg)`,
            }}
          />
          <Word
            text="forgettable."
            delay={10}
            size={168}
            color={wipe > 0.5 ? BG : INK}
            style={{ position: "relative", letterSpacing: `${tracking}em` }}
          />
        </div>
      </div>
    </BeatExit>
  );
};

// Beat 4: "HERE'S THE FIX" + bouncing arrow. Holds to the end.
const FixBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const arrowIn = usePop(26, 160);
  const bounce = Math.abs(Math.sin((frame - 26) / 6)) * 40;
  return (
    <BeatExit dur={BEATS.fix.dur} hold>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Word text="Here's" delay={0} size={200} />
        <Word text="the fix" delay={8} size={330} color={ACCENT} mode="slam" />
        <svg
          width={150}
          height={190}
          viewBox="0 0 150 190"
          style={{
            marginTop: 70,
            opacity: arrowIn,
            transform: `translateY(${(1 - arrowIn) * -80 + bounce}px)`,
          }}
        >
          <path
            d="M75 10 V165 M15 110 L75 170 L135 110"
            fill="none"
            stroke={INK}
            strokeWidth={26}
            strokeLinecap="square"
          />
        </svg>
      </div>
    </BeatExit>
  );
};

// Background glow that pulses on each beat cut.
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const cuts = Object.values(BEATS).map((b) => b.from);
  const pulse = Math.max(
    ...cuts.map((c) =>
      interpolate(frame - c, [0, 4, 20], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }),
    ),
  );
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, rgba(255,214,10,${0.08 + pulse * 0.14}) 0%, ${BG} ${55 + pulse * 10}%)`,
      }}
    />
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: 12,
        width: `${(frame / (durationInFrames - 1)) * 100}%`,
        background: ACCENT,
      }}
    />
  );
};

export const TextHookReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <Backdrop />
      <Sequence from={BEATS.stop.from} durationInFrames={BEATS.stop.dur}>
        <StopBeat />
      </Sequence>
      <Sequence from={BEATS.content.from} durationInFrames={BEATS.content.dur}>
        <ContentBeat />
      </Sequence>
      <Sequence
        from={BEATS.forgettable.from}
        durationInFrames={BEATS.forgettable.dur}
      >
        <ForgettableBeat />
      </Sequence>
      <Sequence from={BEATS.fix.from} durationInFrames={BEATS.fix.dur}>
        <FixBeat />
      </Sequence>
      <ProgressBar />
    </AbsoluteFill>
  );
};
