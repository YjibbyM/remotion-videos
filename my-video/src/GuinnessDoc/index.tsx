import React from "react";
import { AbsoluteFill, Audio, Sequence, spring, staticFile } from "remotion";
import { G_CAPTIONS, G_DURATION, G_END_OF_SPEECH, G_WORDS } from "./timing";
import {
  Cut,
  FONT,
  Marker,
  P,
  PaperBg,
  Stage,
  Stamp,
  Tag,
  at as atW,
  rand,
  ramp,
  sentT,
  torn,
  useFrameLayout,
  useSec,
  useStepFrame,
} from "./paper";
import {
  Bird,
  Book,
  Bubble,
  Bulb,
  Head,
  Magnifier,
  NailHand,
  Pint,
  PintTop,
  Polaroid,
  Portrait,
  QCard,
  Ruler,
  SpeedLines,
  Table,
  TallMan,
  Trophy,
} from "./illus";

const FPS = 30;
const END = 67.6;

const SCENES = {
  records: [0, sentT(3)],
  argument: [sentT(3), sentT(6)],
  book: [sentT(6), sentT(9)],
  table: [sentT(9), sentT(12)],
  lesson: [sentT(12), sentT(16)],
  inlaw: [sentT(16), sentT(17)],
  yours: [sentT(17), sentT(18)],
  bot: [sentT(18), END],
  end: [END, G_DURATION],
} as const;

const BG: Record<keyof typeof SCENES, string> = {
  records: P.paper,
  argument: P.paper2,
  book: P.paper,
  table: P.paper2,
  lesson: P.paper,
  inlaw: P.paper2,
  yours: P.mustard,
  bot: P.paper,
  end: P.paper2,
};

const Scene: React.FC<{
  name: keyof typeof SCENES;
  children: React.ReactNode;
}> = ({ name, children }) => {
  const sec = useSec();
  const [a, b] = SCENES[name];
  if (sec < a || sec >= b) return null;
  return (
    <AbsoluteFill>
      <PaperBg color={BG[name]} id={name} />
      <Stage>{children}</Stage>
    </AbsoluteFill>
  );
};

/* ---------------- 1 · Records ---------------- */
const Records: React.FC = () => {
  const s2 = sentT(2);
  return (
    <Scene name="records">
      <Cut x={190} y={560} at={0.05} from="up" seed={2} sticker={false}>
        <Ruler h={900} />
      </Cut>
      <Cut
        x={330}
        y={600}
        at={0.25}
        from="up"
        seed={3}
        move={{ at: s2, x: 200, scale: 0.8 }}
      >
        <TallMan h={880} />
      </Cut>
      <Cut
        x={790}
        y={520}
        at={sentT(1)}
        from="right"
        rot={-8}
        seed={4}
        move={{ at: s2, x: 900, scale: 0.75 }}
      >
        <NailHand w={460} />
      </Cut>
      <Cut x={560} y={560} at={s2 + 0.1} from="drop" seed={5} z={5}>
        <Pint h={560} />
      </Cut>
      <Marker
        at={atW(2, "involved")}
        d="M60 160 q -20 -120 70 -130 q 80 0 60 70 q -14 40 -60 50 l 0 40 M130 245 l 0 6"
        width={240}
        height={280}
        sw={14}
        style={{ left: 760, top: 160 }}
      />
    </Scene>
  );
};

/* ---------------- 2 · The argument ---------------- */
const Argument: React.FC = () => {
  const s3 = sentT(3);
  const s4 = sentT(4);
  const clash = atW(3, "argument");
  const sec = useSec();
  const shake = sec > clash && sec < clash + 0.4 ? Math.sin(sec * 90) * 10 : 0;
  const tDebate = atW(4, "debating");
  const tBird = atW(4, "fastest");
  const birdX = 60 + ramp(sec, tBird, tBird + 1.4) * 560;
  return (
    <Scene name="argument">
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${shake}px)`,
        }}
      >
        <Cut
          x={330}
          y={480}
          at={s3 + 0.05}
          out={s4 - 0.2}
          from="left"
          seed={6}
          rot={-6}
        >
          <Bubble text="It's this!" w={380} />
        </Cut>
        <Cut
          x={760}
          y={600}
          at={s3 + 0.35}
          out={s4 - 0.2}
          from="right"
          seed={7}
          rot={7}
        >
          <Bubble text="No, that!" w={380} flip color={P.mustard} />
        </Cut>
      </div>

      <Cut
        x={540}
        y={420}
        at={s4 + 0.05}
        from="pop"
        seed={8}
        move={{ at: tDebate, x: 260, y: 300, scale: 0.7 }}
      >
        <Portrait w={420} />
      </Cut>
      <Cut
        x={540}
        y={770}
        at={atW(4, "managing")}
        from="up"
        seed={9}
        rot={-2}
        move={{ at: tDebate, x: 300, y: 560, scale: 0.75 }}
      >
        <Tag size={30} seed={11}>
          Sir Hugh Beaver · Guinness
        </Tag>
      </Cut>
      {sec >= tBird && (
        <div
          style={{
            position: "absolute",
            left: birdX,
            top: 780,
            transform: "translate(-50%,-50%)",
            filter:
              "drop-shadow(4px 0 0 #fff) drop-shadow(-4px 0 0 #fff) drop-shadow(0 4px 0 #fff) drop-shadow(0 -4px 0 #fff)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <SpeedLines w={260} />
          <Bird w={380} />
        </div>
      )}
      <Cut x={770} y={460} at={atW(4, "Europe")} from="pop" seed={12} rot={3}>
        <div style={{ position: "relative" }}>
          <Tag size={36} seed={13} bg={P.card}>
            Fastest game bird
            <br />
            in Europe?
          </Tag>
          <Marker
            at={atW(5, "specific")}
            d="M20 100 C 0 20, 200 -10, 380 20 S 440 170, 220 190 S 10 170, 40 90"
            width={440}
            height={200}
            sw={10}
            style={{ left: -20, top: -20 }}
          />
          <div style={{ position: "absolute", right: -40, bottom: -70 }}>
            <Stamp at={atW(5, "there")} size={34} rot={-10}>
              Noted.
            </Stamp>
          </div>
        </div>
      </Cut>
    </Scene>
  );
};

/* ---------------- 3 · The book ---------------- */
const BookScene: React.FC = () => {
  const sec = useSec();
  const tIdea = atW(6, "sparked");
  const tBook = atW(6, "book");
  const glow = 0.6 + 0.4 * Math.sin(sec * 8);
  const open = ramp(sec, atW(8, "open"), atW(8, "open") + 0.6);
  return (
    <Scene name="book">
      <Cut
        x={540}
        y={460}
        at={tIdea}
        from="pop"
        seed={14}
        move={{ at: tBook, x: 870, y: 170, scale: 0.45 }}
      >
        <Bulb h={420} glow={glow} />
      </Cut>
      <Cut x={520} y={600} at={tBook} from="drop" seed={15} z={3}>
        <Book w={460} open={open} />
      </Cut>
      {[
        { t: "Fastest bird?", x: 200, y: 260, s: 16 },
        { t: "Tallest man?", x: 860, y: 420, s: 17 },
        { t: "Biggest pint?", x: 210, y: 900, s: 18 },
      ].map((q, i) => {
        const t0 = atW(6, "questions") + i * 0.25;
        const fly = ramp(
          sec,
          atW(6, "pubs") + i * 0.12,
          atW(6, "pubs") + 0.5 + i * 0.12,
        );
        return (
          <div
            key={q.t}
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${(520 - q.x) * fly}px, ${(600 - q.y) * fly}px) scale(${1 - fly * 0.7})`,
              opacity: 1 - fly,
              transformOrigin: `${q.x}px ${q.y}px`,
            }}
          >
            <Cut
              x={q.x}
              y={q.y}
              at={t0}
              from="pop"
              seed={q.s}
              rot={(i - 1) * 6}
            >
              <QCard text={q.t} />
            </Cut>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 650, top: 250, zIndex: 6 }}>
        <Stamp at={atW(7, "1955")} size={64} rot={-14} round>
          1955
        </Stamp>
      </div>
      <Cut
        x={540}
        y={1020}
        at={atW(8, "promotion")}
        from="up"
        seed={19}
        rot={-2}
      >
        <Tag size={36} seed={20} bg={P.red} color={P.card}>
          A beer promotion
        </Tag>
      </Cut>
    </Scene>
  );
};

/* ---------------- 4 · The table ---------------- */
const HEADS = [
  { a: -90, hair: P.ink },
  { a: -30, hair: "#7a4b25" },
  { a: 30, hair: P.mustard },
  { a: 90, hair: "#b5532c" },
  { a: 150, hair: P.ink },
  { a: 210, hair: "#5a3a22" },
];
const PubTable: React.FC<{ headsAt: number; talkAt: number }> = ({
  headsAt,
  talkAt,
}) => (
  <>
    <Cut x={540} y={560} at={0} from="up" seed={21} sticker={false}>
      <Table d={620} />
    </Cut>
    <Cut x={540} y={560} at={0.1} from="drop" seed={22} z={3}>
      <PintTop d={150} />
    </Cut>
    {HEADS.map((h, i) => {
      const r = 400;
      const x = 540 + Math.cos((h.a * Math.PI) / 180) * r;
      const y = 560 + Math.sin((h.a * Math.PI) / 180) * r;
      return (
        <Cut
          key={i}
          x={x}
          y={y}
          at={headsAt + i * 0.18}
          from="pop"
          seed={30 + i}
          z={4}
        >
          <Head d={150} hair={h.hair} rot={h.a + 90} />
        </Cut>
      );
    })}
    {["Never!", "Prove it.", "Look it up!"].map((t, i) => (
      <Cut
        key={t}
        x={[250, 820, 560][i]}
        y={[230, 260, 960][i]}
        at={talkAt + i * 0.2}
        from="pop"
        seed={40 + i}
        rot={(i - 1) * 5}
        z={6}
      >
        <Bubble
          text={t}
          w={250}
          flip={i === 1}
          color={i === 2 ? P.mustard : P.card}
        />
      </Cut>
    ))}
  </>
);

const TableScene: React.FC = () => {
  const start = sentT(9);
  return (
    <Scene name="table">
      <div style={{ position: "absolute", inset: 0 }}>
        <Shifted by={start}>
          <PubTable
            headsAt={atW(10, "reason") - start}
            talkAt={atW(10, "talking") - start}
          />
        </Shifted>
      </div>
      <Marker
        at={atW(9, "more")}
        d="M640 520 C 760 420, 860 380, 980 300 M940 290 l 44 6 l -14 40"
        width={1080}
        height={1150}
        sw={12}
        style={{ left: 0, top: 0 }}
      />
      <Cut
        x={850}
        y={900}
        at={atW(11, "achievement")}
        from="drop"
        seed={50}
        rot={8}
        z={8}
      >
        <Trophy h={240} />
      </Cut>
    </Scene>
  );
};

// Renders children on a clock that starts at `by` seconds.
const Shifted: React.FC<{ by: number; children: React.ReactNode }> = ({
  by,
  children,
}) => (
  <Sequence from={Math.round(by * FPS)} layout="none">
    {children}
  </Sequence>
);

/* ---------------- 5 · The lesson ---------------- */
const Lesson: React.FC = () => {
  const sec = useSec();
  const tWorld = atW(13, "world");
  const z = ramp(sec, tWorld, tWorld + 0.6);
  return (
    <Scene name="lesson">
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: z,
          transform: `scale(${0.9 + z * 0.1})`,
        }}
      >
        {sec >= tWorld && (
          <Shifted by={tWorld}>
            <PubTable headsAt={0.1} talkAt={0.5} />
          </Shifted>
        )}
      </div>
      <Cut
        x={540}
        y={520}
        at={sentT(12) + 0.05}
        from="drop"
        seed={51}
        rot={-3}
        z={9}
        move={{ at: tWorld, x: 540, y: 560, scale: 0.32, rot: 0 }}
      >
        <Polaroid w={460}>
          <Pint h={330} />
        </Polaroid>
      </Cut>
      <Cut
        x={540}
        y={1000}
        at={atW(12, "product")}
        out={tWorld - 0.1}
        from="up"
        seed={52}
      >
        <Tag size={40} seed={53}>
          The product
        </Tag>
      </Cut>
      <Cut
        x={540}
        y={90}
        at={tWorld + 0.2}
        from="down"
        seed={54}
        rot={-2}
        z={10}
      >
        <Tag size={44} seed={55} bg={P.ink} color={P.card}>
          The world it lives in
        </Tag>
      </Cut>
      <Cut
        x={300}
        y={1060}
        at={atW(14, "pub")}
        from="up"
        seed={56}
        rot={-4}
        z={10}
      >
        <Tag size={34} seed={57} bg={P.red} color={P.card}>
          The pub argument
        </Tag>
      </Cut>
      <Cut
        x={800}
        y={1060}
        at={atW(15, "Curiosity")}
        from="up"
        seed={58}
        rot={4}
        z={10}
      >
        <Tag size={34} seed={59} bg={P.mustard}>
          Curiosity
        </Tag>
      </Cut>
    </Scene>
  );
};

/* ---------------- 6 · The brother-in-law ---------------- */
const InLaw: React.FC = () => {
  const s = sentT(16);
  return (
    <Scene name="inlaw">
      <Cut x={320} y={560} at={s} from="left" seed={60}>
        <Head d={380} hair={P.ink} />
      </Cut>
      <Cut x={770} y={560} at={s + 0.15} from="right" seed={61}>
        <Head d={380} hair="#b5532c" />
      </Cut>
      <div style={{ position: "absolute", left: 210, top: 260 }}>
        <Stamp at={atW(16, "right")} size={52} color={P.teal} rot={-8}>
          Right ✓
        </Stamp>
      </div>
      <div style={{ position: "absolute", left: 660, top: 820 }}>
        <Stamp at={atW(16, "isn")} size={52} rot={6}>
          Wrong ✗
        </Stamp>
      </div>
      <Cut x={770} y={260} at={atW(16, "brother")} from="pop" seed={62} rot={3}>
        <Tag size={30} seed={63}>
          Brother-in-law
        </Tag>
      </Cut>
    </Scene>
  );
};

/* ---------------- 7 · Your business ---------------- */
const Yours: React.FC = () => {
  const sec = useSec();
  const t = atW(17, "welcome");
  const pulse = sec > t ? 1 + Math.sin((sec - t) * 10) * 0.04 : 1;
  return (
    <Scene name="yours">
      <Cut x={540} y={520} at={sentT(17)} from="drop" seed={70}>
        <div
          style={{
            width: 560,
            height: 560,
            border: `10px dashed ${P.ink}`,
            borderRadius: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${pulse})`,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 380,
            color: P.ink,
            background: "rgba(255,255,255,.35)",
          }}
        >
          ?
        </div>
      </Cut>
      <Cut
        x={540}
        y={930}
        at={atW(17, "business")}
        from="up"
        seed={71}
        rot={-3}
      >
        <Tag size={48} seed={72} bg={P.ink} color={P.card}>
          Your business
        </Tag>
      </Cut>
    </Scene>
  );
};

/* ---------------- 8 · BSM Bot ---------------- */
const TYPED = "We run a neighbourhood bakery.";
const ChatWindow: React.FC = () => {
  const sec = useSec();
  const tType = atW(20, "Tell");
  const typed = TYPED.slice(
    0,
    Math.round(ramp(sec, tType, tType + 0.9) * TYPED.length),
  );
  const tRes = atW(21, "researches");
  const tBelief = atW(21, "belief");
  const tCamp = atW(21, "builds");
  const tScripts = atW(21, "scripts");
  const filled = Math.round(ramp(sec, tCamp, tScripts) * 90);
  return (
    <div
      style={{
        width: 860,
        background: P.card,
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "20px 26px",
          background: P.ink,
          color: P.card,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 32,
        }}
      >
        <span
          style={{ width: 18, height: 18, borderRadius: 9, background: P.lime }}
        />
        BSM Bot 2.0
        <span
          style={{
            marginLeft: "auto",
            fontWeight: 700,
            fontSize: 22,
            opacity: 0.6,
            letterSpacing: "0.12em",
          }}
        >
          AI STRATEGIST
        </span>
      </div>
      <div
        style={{
          padding: 30,
          display: "grid",
          gap: 20,
          fontFamily: FONT,
          minHeight: 520,
        }}
      >
        <div
          style={{
            justifySelf: "end",
            padding: "16px 22px",
            borderRadius: "20px 20px 4px 20px",
            background: P.ink,
            color: P.card,
            fontWeight: 700,
            fontSize: 30,
            opacity: sec >= tType ? 1 : 0,
          }}
        >
          {typed || " "}
        </div>
        {[
          { t: tRes, label: "Researching your market…" },
          { t: tBelief, label: "Belief to shift: found" },
        ].map((r) => (
          <div
            key={r.label}
            style={{
              justifySelf: "start",
              padding: "14px 20px",
              borderRadius: 14,
              background: P.paper2,
              fontWeight: 800,
              fontSize: 28,
              opacity: sec >= r.t ? 1 : 0,
            }}
          >
            {r.label}
          </div>
        ))}
        <div style={{ opacity: sec >= tCamp ? 1 : 0 }}>
          <div
            style={{
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: "0.12em",
              marginBottom: 10,
            }}
          >
            90-DAY CAMPAIGN · {filled}/90
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(18, 1fr)",
              gap: 5,
            }}
          >
            {Array.from({ length: 90 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 26,
                  borderRadius: 4,
                  background: i < filled ? P.lime : "rgba(29,27,23,.12)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Bot: React.FC = () => {
  const sec = useSec();
  const tRes = atW(21, "researches");
  const sweep = ramp(sec, tRes, tRes + 1.2);
  return (
    <Scene name="bot">
      <Cut
        x={540}
        y={470}
        at={sentT(18) + 0.05}
        from="drop"
        seed={80}
        rot={-1.5}
      >
        <ChatWindow />
      </Cut>
      <Cut x={260} y={960} at={atW(19, "ChatGPT")} from="up" seed={81} rot={-5}>
        <Tag size={40} seed={82}>
          ChatGPT
        </Tag>
      </Cut>
      <Cut x={800} y={960} at={atW(19, "Claude")} from="up" seed={83} rot={5}>
        <Tag size={40} seed={84}>
          Claude
        </Tag>
      </Cut>
      {sec >= tRes && sweep < 1 && (
        <div
          style={{
            position: "absolute",
            left: 200 + sweep * 620,
            top: 360 + Math.sin(sweep * Math.PI * 2) * 60,
            zIndex: 9,
            filter: "drop-shadow(8px 14px 0 rgba(40,25,5,.22))",
          }}
        >
          <Magnifier d={240} />
        </div>
      )}
      <Cut
        x={540}
        y={80}
        at={atW(21, "belief")}
        from="down"
        seed={85}
        rot={-2}
        z={9}
      >
        <Tag size={40} seed={86} bg={P.lime}>
          The belief to shift
        </Tag>
      </Cut>
      <Cut
        x={740}
        y={830}
        at={atW(21, "scripts")}
        from="right"
        seed={87}
        rot={6}
        z={9}
      >
        <Tag size={34} seed={88} bg={P.ink} color={P.card}>
          + scripts &amp; captions
        </Tag>
      </Cut>
    </Scene>
  );
};

/* ---------------- 9 · End card ---------------- */
const EndCard: React.FC = () => {
  const t = END;
  return (
    <Scene name="end">
      <Cut x={540} y={330} at={t} from="drop" seed={90} rot={-2}>
        <Tag size={110} seed={91} bg={P.ink} color={P.card} pad="40px 60px">
          BSM Bot 2.0
        </Tag>
      </Cut>
      <Cut x={540} y={560} at={t + 0.25} from="up" seed={92} rot={1.5}>
        <Tag size={38} seed={93}>
          Your AI strategist in ChatGPT or Claude
        </Tag>
      </Cut>
      <Cut x={540} y={790} at={t + 0.6} from="pop" seed={94}>
        <div
          style={{
            padding: "34px 60px",
            borderRadius: 999,
            background: P.lime,
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 56,
            color: P.ink,
            whiteSpace: "nowrap",
          }}
        >
          Get BSM Bot 2.0 →
        </div>
      </Cut>
      <Cut x={540} y={960} at={t + 0.9} from="up" seed={95} sticker={false}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 32,
            color: P.ink,
          }}
        >
          $100 once · 7-day guarantee
        </div>
      </Cut>
    </Scene>
  );
};

/* ---------------- captions ---------------- */
const MARK = new Set([
  "tallest",
  "longest",
  "beer",
  "argument.",
  "beaver,",
  "fastest",
  "specific",
  "idea:",
  "book",
  "1955,",
  "records",
  "wanted",
  "more",
  "talking.",
  "brewery.",
  "product.",
  "world",
  "pub",
  "curiosity.",
  "right",
  "welcome",
  "bsm",
  "chatgpt",
  "claude.",
  "sell.",
  "belief",
  "90-day",
]);
const Captions: React.FC = () => {
  const frame = useStepFrame();
  const sec = frame / FPS;
  const { captionTop, captionSize } = useFrameLayout();
  if (sec > G_END_OF_SPEECH + 0.15) return null;
  let u = -1;
  for (let k = 0; k < G_CAPTIONS.length; k++)
    if (G_WORDS[G_CAPTIONS[k][0]].t <= sec + 0.05) u = k;
  if (u < 0) return null;
  const [a, b] = G_CAPTIONS[u];
  const t0 = G_WORDS[a].t;
  const p = spring({
    frame: frame - Math.round(t0 * FPS),
    fps: FPS,
    config: { damping: 14, stiffness: 260 },
  });
  const words = G_WORDS.slice(a, b + 1);
  return (
    <div
      style={{
        position: "absolute",
        left: 50,
        right: 50,
        top: captionTop,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          background: P.card,
          clipPath: torn(u * 7 + 3, 4),
          padding: `${captionSize * 0.45}px ${captionSize * 0.6}px`,
          transform: `rotate(${(rand(u) - 0.5) * 3}deg) scale(${0.85 + p * 0.15})`,
          filter: "drop-shadow(8px 12px 0 rgba(40,25,5,.25))",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          columnGap: "0.25em",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: captionSize,
          lineHeight: 1.08,
          letterSpacing: "-0.02em",
          textTransform: "uppercase",
          color: P.ink,
        }}
      >
        {words.map((w, i) => {
          const on = sec >= w.t - 0.02;
          const key = w.w.toLowerCase();
          const mark = MARK.has(key);
          return (
            <span
              key={i}
              style={{
                opacity: on ? 1 : 0,
                padding: "0 0.06em",
                background: mark && on ? P.mustard : "transparent",
                transform: on ? undefined : "translateY(10px)",
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const GUINNESS_FRAMES = Math.round(G_DURATION * FPS);

export const GuinnessDoc: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: P.paper }}>
      <Audio src={staticFile("vo/guinness-vo.wav")} volume={1.33} />
      <Records />
      <Argument />
      <BookScene />
      <TableScene />
      <Lesson />
      <InLaw />
      <Yours />
      <Bot />
      <EndCard />
      <Captions />
    </AbsoluteFill>
  );
};
