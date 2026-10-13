import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { DURATION_SEC, FPS, SEGS, wordAt } from "./timing";
import {
  Bubble,
  C,
  Card,
  FONT,
  Jacob,
  Label,
  Rod,
  Show,
  Son,
  Stamp,
  Strike,
  Words,
  ramp,
  useL,
  usePopAt,
  useSec,
} from "./kit";

const S = SEGS;

// Scene windows in seconds. Each scene is a hard cut, like the page's acts.
const SCENES = {
  hook: [0, 4.75],
  ads: [4.75, 8.1],
  feed: [8.1, 18.4],
  son: [18.4, 27.48],
  shift: [27.48, 32.5],
  demo: [32.5, 42.82],
  out: [42.82, 45.9],
  close: [45.9, DURATION_SEC],
} as const;

const BG: Record<keyof typeof SCENES, string> = {
  hook: C.grey,
  ads: C.ink,
  feed: C.paper,
  son: C.warm,
  shift: C.ink,
  demo: C.paper,
  out: C.ink,
  close: C.ink,
};

const In: React.FC<{
  scene: keyof typeof SCENES;
  children: React.ReactNode;
}> = ({ scene, children }) => {
  const sec = useSec();
  const [a, b] = SCENES[scene];
  if (sec < a || sec >= b) return null;
  return (
    <AbsoluteFill style={{ backgroundColor: BG[scene] }}>
      {children}
    </AbsoluteFill>
  );
};

/* ---------------- 1 · Jacob doesn't fish ---------------- */
const Hook: React.FC = () => {
  const { y, f } = useL();
  const sec = useSec();
  const day = Math.max(1, Math.round(ramp(sec, S[1].start, S[1].end) * 90));
  const receipt = usePopAt(S[2].start + 0.35);
  return (
    <In scene="hook">
      <Show
        a={0}
        b={S[1].start - 0.1}
        style={{ left: 70, right: 70, top: y(250) }}
      >
        <Words {...S[0]} size={f(150)} />
      </Show>
      <Show
        a={S[1].start}
        b={S[2].start - 0.05}
        style={{ left: 70, right: 70, top: y(230) }}
      >
        <div style={{ textAlign: "center", fontFamily: FONT }}>
          <Label size={f(30)}>Day</Label>
          <div
            style={{
              fontWeight: 900,
              fontSize: f(300),
              letterSpacing: "-0.06em",
              lineHeight: 0.85,
              color: C.ink,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {day}
          </div>
        </div>
      </Show>
      <Show a={S[2].start} b={99} style={{ left: 70, right: 70, top: y(250) }}>
        <Words
          {...S[2]}
          text="He bought a fishing rod."
          size={f(130)}
          accent={["rod."]}
        />
      </Show>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Jacob height={y(900)} />
      </div>
      <Bubble
        at={0.55}
        style={{
          left: 560,
          top: y(820),
          opacity: sec < S[2].start ? undefined : 0,
        }}
      >
        I don&rsquo;t fish.
      </Bubble>
      <div
        style={{
          position: "absolute",
          right: 70,
          top: y(760),
          opacity: receipt > 0.01 ? 1 : 0,
          transform: `translateY(${(1 - receipt) * 200}px) rotate(${4 - receipt * 2}deg)`,
        }}
      >
        <Card style={{ width: 380, padding: 28 }}>
          <Label size={f(20)}>Receipt &middot; Day 91</Label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginTop: 10,
            }}
          >
            <Rod size={f(90)} />
            <b
              style={{
                fontSize: f(40),
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Fishing rod
            </b>
          </div>
          <div style={{ marginTop: 14 }}>
            <Stamp at={S[2].start + 0.6} color={C.ok} size={f(26)}>
              Paid &#10003;
            </Stamp>
          </div>
        </Card>
      </div>
    </In>
  );
};

/* ---------------- 2 · Not a discount, not a better ad ---------------- */
const ADS = [
  { t: "20% OFF", bg: C.stamp, fg: C.paper, row: 360, dir: 1 },
  { t: "Best fishing rods of 2026", bg: C.card, fg: C.ink, row: 560, dir: -1 },
  { t: "5 tips for better fishing", bg: C.card, fg: C.ink, row: 1380, dir: 1 },
  {
    t: "Why our rod is different",
    bg: C.ink3,
    fg: C.paper,
    row: 1560,
    dir: -1,
  },
  { t: "New reel. New season.", bg: C.card, fg: C.ink, row: 1740, dir: 1 },
];
const Ads: React.FC = () => {
  const { y, f } = useL();
  const sec = useSec();
  const [a, b] = SCENES.ads;
  const u = (sec - a) / (b - a);
  return (
    <In scene="ads">
      {ADS.map((ad, i) => (
        <div
          key={ad.t}
          style={{
            position: "absolute",
            top: y(ad.row),
            left: "50%",
            whiteSpace: "nowrap",
            padding: "18px 30px",
            borderRadius: 14,
            background: ad.bg,
            color: ad.fg,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: f(64),
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            opacity: 0.35,
            transform: `translateX(calc(-50% + ${ad.dir * (900 - (u + i * 0.07) * 1500)}px))`,
          }}
        >
          {ad.t}
        </div>
      ))}
      <Show
        a={S[3].start}
        b={S[4].start - 0.1}
        style={{ left: 70, right: 70, top: y(780) }}
      >
        <div style={{ position: "relative" }}>
          <Words {...S[3]} size={f(120)} color={C.paper} />
          <Strike at={S[3].end - 0.1} />
        </div>
      </Show>
      <Show a={S[4].start} b={99} style={{ left: 70, right: 70, top: y(780) }}>
        <div style={{ position: "relative" }}>
          <Words {...S[4]} size={f(120)} color={C.paper} />
          <Strike at={S[4].end - 0.1} />
        </div>
      </Show>
    </In>
  );
};

/* ---------------- 3 · His feed, day by day ---------------- */
const POSTS = [
  { seg: 6, label: "Day 12 · Fear", bg: C.ink, fg: C.paper },
  { seg: 7, label: "Day 38 · Enemy", bg: C.teal, fg: C.paper },
  { seg: 8, label: "Day 67 · Aspiration", bg: C.lemon, fg: C.ink },
];
const Feed: React.FC = () => {
  const { y, f } = useL();
  const sec = useSec();
  const shown = POSTS.filter((p) => sec >= S[p.seg].start).length;
  return (
    <In scene="feed">
      <Show
        a={S[5].start}
        b={S[6].start - 0.15}
        style={{ left: 70, right: 70, top: y(560) }}
      >
        <Words
          {...S[5]}
          text="For 90 days, his feed changed what fishing meant."
          size={f(128)}
          accent={["fishing", "meant."]}
        />
      </Show>
      <Show
        a={S[6].start - 0.1}
        b={99}
        style={{ left: 70, right: 70, top: y(220) }}
      >
        <div style={{ textAlign: "center" }}>
          <Label size={f(30)}>Jacob&rsquo;s feed</Label>
        </div>
      </Show>
      {POSTS.map((p, i) => {
        const s = S[p.seg];
        if (sec < s.start - 0.05) return null;
        const depth = shown - 1 - i; // 0 = newest
        const pop = Math.min(1, (sec - s.start) / 0.3);
        const ease = 1 - Math.pow(1 - Math.max(0, pop), 3);
        return (
          <div
            key={p.label}
            style={{
              position: "absolute",
              left: 140,
              top: y(360),
              width: 800,
              height: y(1000),
              borderRadius: 26,
              background: p.bg,
              color: p.fg,
              padding: 60,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "0 60px 100px -50px rgba(17,17,15,.6)",
              transform: `translateY(${(1 - ease) * y(1200) - depth * y(70)}px) scale(${1 - depth * 0.07}) rotate(${(i - 1) * 2.5}deg)`,
              opacity: depth > 1 ? 0.5 : 1,
              zIndex: 10 + i,
            }}
          >
            <Label
              size={f(28)}
              color={p.fg === C.ink ? C.ink : "rgba(244,241,234,.7)"}
            >
              {p.label}
            </Label>
            <Words {...s} size={f(118)} color={p.fg} align="left" />
            <div
              style={{
                display: "flex",
                gap: 30,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: f(30),
                opacity: 0.7,
              }}
            >
              <span>&#9829; Like</span>
              <span>&#8599; Share</span>
              <span>&#9873; Save</span>
            </div>
          </div>
        );
      })}
    </In>
  );
};

/* ---------------- 4 · Fishing means time with his son ---------------- */
const SonScene: React.FC = () => {
  const { y, f } = useL();
  const sec = useSec();
  const son = ramp(sec, S[11].start + 0.6, S[11].start + 1.1);
  const rod = usePopAt(S[12].start + 0.2);
  const rodOut = ramp(sec, S[13].start - 0.15, S[13].start + 0.1);
  return (
    <In scene="son">
      <Show
        a={S[9].start}
        b={S[10].start - 0.1}
        style={{ left: 70, right: 70, top: y(300) }}
      >
        <Words {...S[9]} text="By day 90," size={f(170)} />
      </Show>
      <Show
        a={S[10].start}
        b={S[11].start - 0.1}
        style={{ left: 70, right: 70, top: y(280) }}
      >
        <Words
          {...S[10]}
          text="Fishing stopped meaning fishing."
          size={f(140)}
          accent={["meaning"]}
        />
      </Show>
      <Show
        a={S[11].start}
        b={S[12].start - 0.1}
        style={{ left: 70, right: 70, top: y(250) }}
      >
        <Words {...S[11]} size={f(112)} accent={["with", "his", "son."]} />
      </Show>
      <Show
        a={S[12].start}
        b={S[13].start - 0.1}
        style={{ left: 70, right: 70, top: y(260) }}
      >
        <Words {...S[12]} size={f(140)} accent={["rod."]} />
      </Show>
      <Show a={S[13].start} b={99} style={{ left: 70, right: 70, top: y(250) }}>
        <Words {...S[13]} size={f(124)} accent={["his", "idea."]} />
      </Show>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: `translateX(calc(-50% - ${son * 170}px))`,
        }}
      >
        <Jacob height={y(820)} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          opacity: son,
          transform: `translateX(${170 + (1 - son) * 300}px)`,
        }}
      >
        <Son height={y(460)} />
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: y(700),
          opacity: (rod > 0.01 ? 1 : 0) * (1 - rodOut),
          transform: `scale(${0.6 + rod * 0.4}) rotate(4deg)`,
          transformOrigin: "80% 0",
        }}
      >
        <Card style={{ width: 380, padding: 26, textAlign: "center" }}>
          <Rod size={f(220)} />
          <Label size={f(20)}>Day 91 &middot; Only now: the rod</Label>
        </Card>
      </div>
      <Bubble
        at={S[13].start + 0.15}
        style={{ left: 300, top: y(760), width: 520 }}
      >
        Son. Do you want to go fishing?
      </Bubble>
    </In>
  );
};

/* ---------------- 5 · That's a belief shift. BSM Bot 2.0 ---------------- */
const Shift: React.FC = () => {
  const { y, f } = useL();
  const name = usePopAt(wordAt(15, 1), 200);
  return (
    <In scene="shift">
      <Show
        a={S[14].start}
        b={S[15].start - 0.1}
        style={{ left: 70, right: 70, top: y(700) }}
      >
        <Words
          {...S[14]}
          size={f(170)}
          color={C.paper}
          accent={["belief", "shift."]}
          accentColor={C.accent}
        />
      </Show>
      <Show a={S[15].start} b={99} style={{ left: 60, right: 60, top: y(560) }}>
        <div style={{ textAlign: "center" }}>
          <Label size={f(30)} color={C.mutedInv}>
            Introducing
          </Label>
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: f(150),
              lineHeight: 0.85,
              letterSpacing: "-0.06em",
              textTransform: "uppercase",
              color: C.paper,
              whiteSpace: "nowrap",
              transform: `scale(${0.7 + name * 0.3})`,
              opacity: name,
            }}
          >
            BSM Bot 2.0
          </div>
          <div style={{ marginTop: y(70) }}>
            <Words
              text="Builds one for your business."
              start={wordAt(15, 4)}
              end={S[15].end}
              size={f(84)}
              color={C.mutedInv}
              accent={["business."]}
              accentColor={C.accent}
            />
          </div>
        </div>
      </Show>
    </In>
  );
};

/* ---------------- 6 · The demo ---------------- */
const TYPED = "We sell handmade jewellery.";
const RESEARCH = [
  "What competitors promise",
  "Why people aren’t buying",
  "Existing demand",
  "Market saturation",
];
const Demo: React.FC = () => {
  const { y, f, pick } = useL();
  const sec = useSec();
  const frame = useCurrentFrame();
  const typed = TYPED.slice(
    0,
    Math.round(ramp(sec, S[16].start + 0.3, S[16].end - 0.2) * TYPED.length),
  );
  const tBelief = wordAt(17, 7);
  const tStrategy = wordAt(18, 4);
  const tCampaign = wordAt(18, 6);
  const tScript = wordAt(18, 9);
  const count = Math.max(1, Math.round(ramp(sec, tCampaign, tScript) * 90));
  const caret = Math.floor(frame / 15) % 2 === 0;
  return (
    <In scene="demo">
      {[16, 17, 18].map((i, k) => (
        <Show
          key={i}
          a={S[i].start}
          b={k < 2 ? S[i + 1].start - 0.1 : 99}
          style={{ left: 70, right: 70, top: y(230) }}
        >
          <Words
            {...S[i]}
            size={i === 18 ? 84 : 96}
            accent={i === 17 ? ["belief", "nobody", "owns", "yet."] : []}
          />
        </Show>
      ))}

      {/* one sentence in */}
      <Show
        a={S[16].start}
        b={S[17].start - 0.1}
        style={{ left: 70, right: 70, top: y(860) }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "34px 30px 34px 40px",
            borderRadius: 26,
            border: `4px solid ${C.ink}`,
            background: C.card,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: f(52),
            letterSpacing: "-0.03em",
          }}
        >
          <span>{typed}</span>
          <span
            style={{
              width: 4,
              height: 56,
              marginLeft: 4,
              background: C.ink,
              opacity: caret ? 1 : 0,
            }}
          />
          <span
            style={{
              marginLeft: "auto",
              padding: "12px 18px",
              borderRadius: 12,
              background: sec > S[16].end - 0.15 ? C.accent : C.paper2,
              fontSize: f(24),
              fontWeight: 900,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Enter &#8629;
          </span>
        </div>
      </Show>

      {/* research and the opening */}
      <Show
        a={S[17].start}
        b={S[18].start - 0.1}
        style={{ left: 70, right: 70, top: pick(780, 950) }}
      >
        <Card dark style={{ padding: 44 }}>
          <Label size={f(24)} color={C.mutedInv}>
            Market research &middot; running
          </Label>
          <div style={{ marginTop: 26, display: "grid", gap: 26 }}>
            {RESEARCH.map((r, i) => {
              const a = S[17].start + 0.15 + i * 0.4;
              const fill = ramp(sec, a, a + 0.35);
              return (
                <div
                  key={r}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 220px 40px",
                    alignItems: "center",
                    gap: 20,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: f(36),
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {r}
                  </span>
                  <i
                    style={{
                      height: 14,
                      borderRadius: 7,
                      background: "rgba(244,241,234,.14)",
                      overflow: "hidden",
                    }}
                  >
                    <i
                      style={{
                        display: "block",
                        height: "100%",
                        width: `${fill * 100}%`,
                        background: C.paper,
                      }}
                    />
                  </i>
                  <b
                    style={{
                      color: C.lemon,
                      fontSize: f(36),
                      opacity: fill >= 1 ? 1 : 0,
                    }}
                  >
                    &#10003;
                  </b>
                </div>
              );
            })}
          </div>
          <div
            style={{
              marginTop: 34,
              padding: "22px 26px",
              borderRadius: 14,
              background: C.paper,
              color: C.ink,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              opacity: sec >= tBelief - 0.1 ? 1 : 0,
            }}
          >
            <b
              style={{
                fontWeight: 900,
                fontSize: f(42),
                letterSpacing: "-0.03em",
              }}
            >
              A belief nobody owns yet
            </b>
            <Stamp at={tBelief + 0.1} color={C.ok} size={f(26)}>
              Open
            </Stamp>
          </div>
        </Card>
      </Show>

      {/* strategy, campaign, scripts */}
      <Show
        a={tStrategy - 0.1}
        b={99}
        style={{ left: 70, right: 70, top: pick(780, 950) }}
      >
        <Card
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "34px 40px",
          }}
        >
          <div>
            <Label size={f(22)}>Master strategy</Label>
            <b
              style={{
                display: "block",
                marginTop: 8,
                fontSize: f(48),
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              Belief today &#8594; belief to build
            </b>
          </div>
        </Card>
        <div style={{ position: "absolute", right: 30, top: -26 }}>
          <Stamp at={tStrategy + 0.35} color={C.ok} size={f(24)}>
            Approved &#10003;
          </Stamp>
        </div>
      </Show>
      <Show
        a={tCampaign - 0.1}
        b={99}
        style={{ left: 70, right: 70, top: pick(1040, 1200) }}
      >
        <Card
          dark
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 20,
            padding: "30px 40px",
          }}
        >
          <Label size={f(22)} color={C.mutedInv}>
            90-day campaign &middot; post
          </Label>
          <b
            style={{
              marginLeft: "auto",
              fontSize: f(120),
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {String(count).padStart(2, "0")}
          </b>
          <span style={{ fontSize: f(40), fontWeight: 900, color: C.mutedInv }}>
            / 90
          </span>
        </Card>
      </Show>
      <Show
        a={tScript - 0.1}
        b={99}
        style={{ left: 70, right: 70, top: pick(1290, 1440) }}
      >
        <Card style={{ padding: "30px 40px", background: "#f7e5a8" }}>
          <Label size={f(22)} color={C.gold}>
            Post #6 &middot; Script &amp; caption
          </Label>
          <b
            style={{
              display: "block",
              marginTop: 8,
              fontSize: f(46),
              fontWeight: 900,
              letterSpacing: "-0.03em",
            }}
          >
            Shot 1 &mdash; A sticky note: &ldquo;Next week.&rdquo;
          </b>
          {[0.9, 0.75, 0.55].map((w, i) => (
            <i
              key={i}
              style={{
                display: "block",
                height: 12,
                marginTop: 16,
                borderRadius: 6,
                width: `${w * 100 * ramp(sec, tScript + 0.2 + i * 0.2, tScript + 0.5 + i * 0.2)}%`,
                background: "rgba(17,17,15,.18)",
              }}
            />
          ))}
        </Card>
      </Show>
    </In>
  );
};

/* ---------------- 7 · One sentence in ---------------- */
const Out: React.FC = () => {
  const { y, f } = useL();
  const split = wordAt(19, 3);
  return (
    <In scene="out">
      <div style={{ position: "absolute", left: 70, right: 70, top: y(640) }}>
        <Words
          text="One sentence in."
          start={S[19].start}
          end={split}
          size={f(160)}
          color={C.paper}
        />
        <div style={{ height: 30 }} />
        <Words
          text="An entire campaign out."
          start={split}
          end={S[19].end}
          size={f(160)}
          color={C.mutedInv}
        />
      </div>
    </In>
  );
};

/* ---------------- 8 · Close and CTA ---------------- */
const Close: React.FC = () => {
  const { y, f } = useL();
  const cta = usePopAt(S[21].end - 0.1, 200);
  return (
    <In scene="close">
      <div
        style={{
          position: "absolute",
          left: 70,
          right: 70,
          top: y(260),
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: f(200),
            lineHeight: 0.6,
            color: C.accent,
          }}
        >
          &ldquo;
        </div>
        <Words {...S[20]} size={f(120)} color={C.paper} />
        <div style={{ height: 40 }} />
        <Words
          {...S[21]}
          text="It should create them."
          size={f(140)}
          color={C.accent}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: y(1450),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
          opacity: cta > 0.01 ? 1 : 0,
          transform: `translateY(${(1 - cta) * 80}px)`,
        }}
      >
        <div
          style={{
            padding: "34px 56px",
            borderRadius: 999,
            background: C.accent,
            color: C.ink,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: f(52),
            letterSpacing: "-0.01em",
            boxShadow: "0 30px 60px -24px rgba(210,242,75,.6)",
          }}
        >
          Get BSM Bot 2.0 &#8594;
        </div>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: f(30),
            color: C.mutedInv,
          }}
        >
          $100 once &middot; ChatGPT or Claude &middot; 7-day guarantee
        </span>
      </div>
    </In>
  );
};

// Thin lime progress line, like the landing page header.
const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        height: 10,
        width: `${interpolate(frame, [0, DURATION_SEC * FPS - 1], [0, 100])}%`,
        background: C.accent,
      }}
    />
  );
};

export const BSM_JACOB_FRAMES = Math.round(DURATION_SEC * FPS);

export const BsmJacobAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Audio src={staticFile("vo/bsm-jacob-vo.mp3")} volume={1.4} />
      <Hook />
      <Ads />
      <Feed />
      <SonScene />
      <Shift />
      <Demo />
      <Out />
      <Close />
      <Progress />
    </AbsoluteFill>
  );
};
