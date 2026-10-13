// VO: public/vo/bsm-jacob-vo.mp3 (ElevenLabs, 49.55s).
// Segment boundaries were measured from the audio's pauses
// (ffmpeg silencedetect, -35dB, 0.25s) and matched 1:1 to the script lines.
export const FPS = 30;
export const DURATION_SEC = 52.5;

export type Seg = { start: number; end: number; text: string };

export const SEGS: Seg[] = [
  { start: 0.0, end: 1.54, text: "Jacob doesn't fish." },
  { start: 2.33, end: 3.26, text: "Ninety days later," },
  { start: 3.56, end: 4.48, text: "he bought a fishing rod." },
  { start: 4.95, end: 6.12, text: "Not because of a discount." },
  { start: 6.54, end: 7.84, text: "Not because of a better ad." },
  {
    start: 8.31,
    end: 11.45,
    text: "For ninety days, his feed changed what fishing meant.",
  },
  { start: 12.25, end: 13.56, text: "How fast kids grow up." },
  { start: 14.36, end: 15.62, text: "How easy it is to miss it." },
  {
    start: 16.21,
    end: 18.1,
    text: "What it means to be the dad they remember.",
  },
  { start: 18.69, end: 19.44, text: "By day ninety," },
  { start: 19.72, end: 21.27, text: "fishing stopped meaning fishing." },
  { start: 21.9, end: 23.92, text: "It meant time he still has with his son." },
  { start: 24.42, end: 25.59, text: "Then he saw the rod." },
  { start: 26.0, end: 27.28, text: "And he thought it was his idea." },
  { start: 27.68, end: 29.0, text: "That's a belief shift." },
  {
    start: 29.34,
    end: 32.35,
    text: "And BSM Bot 2.0 builds one for your business.",
  },
  {
    start: 32.64,
    end: 34.61,
    text: "You type one sentence about what you sell.",
  },
  {
    start: 34.93,
    end: 38.04,
    text: "It researches your market and finds the belief nobody owns yet.",
  },
  {
    start: 38.31,
    end: 42.66,
    text: "Then it builds the strategy, the 90-day campaign, and every script and caption.",
  },
  {
    start: 42.96,
    end: 45.72,
    text: "One sentence in. An entire campaign out.",
  },
  {
    start: 46.03,
    end: 48.21,
    text: "Your social media shouldn't wait for buyers.",
  },
  { start: 48.46, end: 49.55, text: "It should create them!" },
];

// Estimated start time of each word inside a segment, weighted by word length.
// Without a word-level transcript this keeps word pops close to the delivery.
export const wordTimes = (text: string, start: number, end: number) => {
  const words = text.split(/\s+/).filter(Boolean);
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  // Segment ends include the voice's decay tail, so spread words over the
  // first ~80% and lead each pop slightly so it lands with the syllable.
  const span = (end - start) * 0.8;
  let acc = 0;
  return words.map((w, i) => {
    const t = Math.max(0, start - 0.04 + (acc / total) * span);
    acc += weights[i];
    return { word: w, t };
  });
};

// Start time of word `index` of segment `seg`, as spoken.
export const wordAt = (seg: number, index: number) => {
  const s = SEGS[seg];
  return wordTimes(s.text, s.start, s.end)[index].t;
};
