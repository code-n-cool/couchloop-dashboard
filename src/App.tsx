import React, { useMemo, useState } from "react";
import { Container, Box, Typography, Paper } from "@mui/material";
import useMoodData from "./hooks/useMoodData"; // your hook
import SummaryCard from "./components/SummaryCard";
import MuiDateRangeFallback from "./components/MuiDateRange"; // use fallback or MuiDateRange
import RechartsMoodChartStyled from "./components/RechartsMoodChartStyled";
import D3MoodChartStyled from "./components/D3MoodChartStyled";
import { weeklyAverages } from "./utils/analysis";

export default function App() {
  const { raw, points, loading } = useMoodData(180);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const filtered = useMemo(() => {
    if (!points) return null;
    if (!from && !to) return points;
    return points.filter(p => {
      if (from && new Date(p.date) < from) return false;
      if (to && new Date(p.date) > to) return false;
      return true;
    });
  }, [points, from, to]);

  if (loading || !points || !raw) return <div>Loading...</div>;

  const weekly = weeklyAverages(raw, 4);
  const anomaliesCount = (filtered ?? points).filter(p => p.isAnomaly).length;
  const trendDelta = (weekly[weekly.length-1]?.avg ?? 0) - (weekly[0]?.avg ?? 0);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h1" gutterBottom>Clinician: Emotion Trend Dashboard</Typography>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <MuiDateRangeFallback from={from} to={to} onFromChange={setFrom} onToChange={setTo} />
      </Box>

      <SummaryCard weekly={weekly} trendDelta={trendDelta} anomalies={anomaliesCount} />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>Recharts view</Typography>
        <RechartsMoodChartStyled data={filtered ?? points} />
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h2" sx={{ mb: 1 }}>D3 view (bespoke)</Typography>
        <D3MoodChartStyled data={filtered ?? points} />
      </Paper>
    </Container>
  );
}
