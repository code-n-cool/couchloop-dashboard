import { addDays, formatISO, subDays } from "date-fns";
import { MoodEntry } from "../types";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// helper to generate a note based on score
function generateNote(score: number) {
  if (score >= 4) return "Feeling good 😊";
  if (score >= 3) return "Neutral mood 😐";
  return "Feeling low ☔️";
}

export async function fetchMockMoodEntries(days = 180, latency = 400): Promise<MoodEntry[]> {
  // simulate network latency
  await new Promise((res) => setTimeout(res, latency));

  const today = new Date();
  const out: MoodEntry[] = [];

  for (let i = 0; i < days; i++) {
    const d = subDays(today, i);
    const weekly = Math.sin(i / 7) * 0.6;
    const base = 3 + weekly;
    const noise = rand(-0.9, 0.9);
    let score = Math.round(Math.max(1, Math.min(5, base + noise)));

    // occasional anomalies
    if (Math.random() < 0.02) score = Math.round(Math.random() < 0.5 ? 1 : 5);

    // assign a note to every entry
    const note = generateNote(score);

    out.push({
      id: `${formatISO(d, { representation: "date" })}`,
      date: formatISO(d, { representation: "date" }),
      score,
      note,
    });
  }

  return out.reverse(); // ascending order
}
