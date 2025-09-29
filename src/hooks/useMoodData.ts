import { useEffect, useState } from "react";
import { fetchMockMoodEntries } from "../api/mockApi";
import { computeRollingAverage, flagAnomalies } from "../utils/analysis";
import { MoodEntry, ProcessedPoint } from "../types";

export default function useMoodData(days = 180) {
  const [raw, setRaw] = useState<MoodEntry[] | null>(null);
  const [points, setPoints] = useState<ProcessedPoint[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchMockMoodEntries(days).then((data) => {
      if (!mounted) return;
      setRaw(data);
      const rolled = computeRollingAverage(data, 7);
      const flagged = flagAnomalies(rolled, 2);
      setPoints(flagged);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [days]);

  return { raw, points, loading };
}
