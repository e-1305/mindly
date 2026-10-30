/**
 * Privacy-by-design helpers.
 *
 * Self-reported mood, stress and mental load can reveal health information,
 * which GDPR (art. 9) treats as a special category of data. Managers and HR
 * therefore only ever see team-level aggregates, and only when enough
 * different people answered that no individual can be singled out.
 */

/** Minimum number of distinct respondents before any team data is shown. */
export const MIN_GROUP_SIZE = Number(process.env.MIN_GROUP_SIZE ?? 5);

/** Score (1–5) from which stress or mental load is counted as "high". */
const HIGH = 4;
/** Score (1–5) at or below which mood or energy is counted as "low". */
const LOW = 2;

type Entry = {
  userId: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  mentalLoad: number;
};

export type TeamAggregate =
  | { suppressed: true; reason: string; minGroupSize: number }
  | {
      suppressed: false;
      respondents: number;
      checkIns: number;
      averages: { mood: number; energy: number; stress: number; mentalLoad: number };
      /** How many respondents fall in each band (latest check-in per person). */
      bands: { highStress: number; highMentalLoad: number; lowMood: number; lowEnergy: number };
      /** Daily team averages, oldest first. Days with too few respondents are left out. */
      daily: { day: string; respondents: number; mood: number; stress: number }[];
    };

const round1 = (n: number) => Math.round(n * 10) / 10;
const mean = (xs: number[]) => (xs.length ? round1(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

export function aggregateTeam(entries: Entry[]): TeamAggregate {
  const people = new Set(entries.map((e) => e.userId));
  if (people.size < MIN_GROUP_SIZE) {
    return {
      suppressed: true,
      reason: "Not enough people checked in to show team data without identifying anyone.",
      minGroupSize: MIN_GROUP_SIZE,
    };
  }

  // Latest check-in per person drives the bands, so one person counts once.
  const latest = new Map<string, Entry>();
  for (const e of entries) {
    const prev = latest.get(e.userId);
    if (!prev || e.date > prev.date) latest.set(e.userId, e);
  }
  const current = [...latest.values()];

  const byDay = new Map<string, Entry[]>();
  for (const e of entries) {
    const day = e.date.slice(0, 10);
    byDay.set(day, [...(byDay.get(day) ?? []), e]);
  }
  const daily = [...byDay.entries()]
    .filter(([, es]) => new Set(es.map((e) => e.userId)).size >= MIN_GROUP_SIZE)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, es]) => ({
      day,
      respondents: new Set(es.map((e) => e.userId)).size,
      mood: mean(es.map((e) => e.mood)),
      stress: mean(es.map((e) => e.stress)),
    }));

  return {
    suppressed: false,
    respondents: people.size,
    checkIns: entries.length,
    averages: {
      mood: mean(entries.map((e) => e.mood)),
      energy: mean(entries.map((e) => e.energy)),
      stress: mean(entries.map((e) => e.stress)),
      mentalLoad: mean(entries.map((e) => e.mentalLoad)),
    },
    bands: {
      highStress: current.filter((e) => e.stress >= HIGH).length,
      highMentalLoad: current.filter((e) => e.mentalLoad >= HIGH).length,
      lowMood: current.filter((e) => e.mood <= LOW).length,
      lowEnergy: current.filter((e) => e.energy <= LOW).length,
    },
    daily,
  };
}
