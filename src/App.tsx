import React, { useMemo, useState, useEffect } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import SummaryCard from "./components/SummaryCard";
import MuiDateRangeFallback from "./components/MuiDateRange";
import RechartsMoodChartStyled from "./components/RechartsMoodChartStyled";
import D3MoodChartStyled from "./components/D3MoodChartStyled";
import { fetchMockMoodEntries } from "./api/mockApi";
import { MoodEntry, ProcessedPoint } from "./types";
import { processMoodEntries, weeklyAverages } from "./utils/analysis";

export default function App() {
  const [raw, setRaw] = useState<MoodEntry[]>([]);
  const [points, setPoints] = useState<ProcessedPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  // Fetch mock data on mount
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const entries = await fetchMockMoodEntries(180);
      setRaw(entries);
      setPoints(processMoodEntries(entries)); // compute rolling averages & anomalies
      setLoading(false);

      // Set initial date range to full dataset
      if (entries.length) {
        setFrom(new Date(entries[0].date));
        setTo(new Date(entries[entries.length - 1].date));
      }
    }
    fetchData();
  }, []);

  // Filter points based on selected date range
  const filtered = useMemo(() => {
    if (!points) return [];
    return points.filter(p => {
      if (from && new Date(p.date) < from) return false;
      if (to && new Date(p.date) > to) return false;
      return true;
    });
  }, [points, from, to]);

  if (loading || !points.length || !raw.length) return <div>Loading...</div>;

  // Compute weekly summaries
  const weekly = weeklyAverages(raw, 4);
  const anomaliesCount = filtered.filter(p => p.isAnomaly).length;
  const trendDelta = (weekly[weekly.length - 1]?.avg ?? 0) - (weekly[0]?.avg ?? 0);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h1" gutterBottom>
        Clinician: Emotion Trend Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <MuiDateRangeFallback
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
        />
      </Box>

      <SummaryCard weekly={weekly} trendDelta={trendDelta} anomalies={anomaliesCount} />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          Recharts view
        </Typography>
        <RechartsMoodChartStyled data={filtered} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
          D3 view (bespoke)
        </Typography>
        <D3MoodChartStyled data={filtered} />
      </Paper>
    </Container>
  );
}
