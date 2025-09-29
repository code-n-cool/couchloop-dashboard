import { MoodEntry, ProcessedPoint } from "../types";

/** simple moving (rolling) average over 'window' last days (inclusive) */
export function computeRollingAverage(entries: MoodEntry[], window = 7): ProcessedPoint[] {
  const res: ProcessedPoint[] = [];
  const scores: number[] = [];
  for (let i = 0; i < entries.length; i++) {
    scores.push(entries[i].score);
    const start = Math.max(0, i - window + 1);
    const windowSlice = scores.slice(start, i + 1);
    const sum = windowSlice.reduce((a, b) => a + b, 0);
    const avg = sum / windowSlice.length;
    res.push({
      date: entries[i].date,
      score: entries[i].score,
      rolling: Number(avg.toFixed(2)),
    });
  }
  return res;
}

/** simple anomaly detection: global z-score threshold */
export function flagAnomalies(points: ProcessedPoint[], zThresh = 2): ProcessedPoint[] {
  const scores = points.map((p) => p.score);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length;
  const sd = Math.sqrt(variance) || 1;
  return points.map((p) => ({ ...p, isAnomaly: Math.abs((p.score - mean) / sd) >= zThresh }));
}

/** compute weekly averages for compact summary
 * returns last N weeks averages (week ending date, avg)
 */
export function weeklyAverages(entries: MoodEntry[], weeks = 4) {
  // group by ISO week-ish: easiest: split by 7-day buckets from end
  const res: { weekEnd: string; avg: number }[] = [];
  for (let w = 0; w < weeks; w++) {
    const startIndex = Math.max(0, entries.length - (w + 1) * 7);
    const endIndex = entries.length - w * 7;
    const slice = entries.slice(startIndex, endIndex);
    if (slice.length === 0) break;
    const avg = slice.reduce((a, b) => a + b.score, 0) / slice.length;
    res.push({ weekEnd: slice[slice.length - 1].date, avg: Number(avg.toFixed(2)) });
  }
  return res.reverse(); // oldest -> newest
}

/** detect streaks >= threshold (e.g., score >= 4) */
export function detectStreaks(entries: MoodEntry[], threshold = 4) {
  const streaks: { start: string; end: string; length: number }[] = [];
  let currentStart: string | null = null;
  let currentLen = 0;
  for (const e of entries) {
    if (e.score >= threshold) {
      if (!currentStart) currentStart = e.date;
      currentLen++;
    } else {
      if (currentLen > 0 && currentStart) streaks.push({ start: currentStart, end: e.date, length: currentLen });
      currentStart = null;
      currentLen = 0;
    }
  }
  if (currentLen > 0 && currentStart) streaks.push({ start: currentStart, end: entries[entries.length - 1].date, length: currentLen });
  return streaks;
}
