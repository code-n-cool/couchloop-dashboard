import React, { useMemo, useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  Tooltip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { writeFile, utils as XLSXUtils } from "xlsx";

import { MoodEntry, ProcessedPoint } from "./types";
import { fetchMockMoodEntries } from "./api/mockApi";
import MuiDateRangeFallback from "./components/MuiDateRange";
import SummaryCard from "./components/SummaryCard";
import RechartsMoodChartStyled from "./components/RechartsMoodChartStyled";
import D3MoodChartStyled from "./components/D3MoodChartStyled";
import { weeklyAverages, processMoodEntries } from "./utils/analysis";

export default function App() {
  const [raw, setRaw] = useState<MoodEntry[]>([]);
  const [points, setPoints] = useState<ProcessedPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState<Date | null>(null);
  const [to, setTo] = useState<Date | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  // Fetch mock data
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const entries = await fetchMockMoodEntries(180);
      setRaw(entries);
      setPoints(processMoodEntries(entries));

      if (entries.length) {
        setFrom(new Date(entries[0].date));
        setTo(new Date(entries[entries.length - 1].date));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!points) return [];
    return points.filter((p) => {
      if (from && new Date(p.date) < from) return false;
      if (to && new Date(p.date) > to) return false;
      return true;
    });
  }, [points, from, to]);

  const weekly = weeklyAverages(raw, 4);
  const anomaliesCount = filtered.filter((p) => p.isAnomaly).length;
  const trendDelta =
    (weekly[weekly.length - 1]?.avg ?? 0) - (weekly[0]?.avg ?? 0);

  // Timestamped filename helper
  const formatTimestamp = (d: Date) =>
    `${d.getFullYear()}_${String(d.getMonth() + 1).padStart(2, "0")}_${String(
      d.getDate()
    ).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}_${String(
      d.getMinutes()
    ).padStart(2, "0")}_${String(d.getSeconds()).padStart(2, "0")}`;

  // CSV download with BOM for emojis
  const downloadCSV = () => {
    if (!filtered.length) return;
    setSnackbarMsg("Downloading CSV... please wait");
    setSnackbarOpen(true);

    const exportData = filtered.map((d) => ({
      Date: d.date,
      Score: d.score,
      RollingAverage: d.rolling ?? "",
      Anomaly: d.isAnomaly ? "Yes" : "No",
      Note: d.note ?? "",
    }));

    const headers = Object.keys(exportData[0]);
    const rows = exportData.map((row) => headers.map((h) => (row as any)[h]));
    const csvContent =
      "\uFEFF" + // UTF-8 BOM ensures emojis show correctly in Excel
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `mood_data_${formatTimestamp(new Date())}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setSnackbarOpen(false), 2000);
  };

  // Excel download
  const downloadExcel = () => {
    if (!filtered.length) return;
    setSnackbarMsg("Downloading Excel... please wait");
    setSnackbarOpen(true);

    const exportData = filtered.map((d) => ({
      Date: d.date,
      Score: d.score,
      RollingAverage: d.rolling ?? "",
      Anomaly: d.isAnomaly ? "Yes" : "No",
      Note: d.note ?? "",
    }));

    const ws = XLSXUtils.json_to_sheet(exportData);
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, "MoodData");
    writeFile(wb, `mood_data_${formatTimestamp(new Date())}.xlsx`);

    setTimeout(() => setSnackbarOpen(false), 2000);
  };

  if (loading) return <div>Loading...</div>;

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

        <Tooltip title="Download CSV">
          <Button
            variant="contained"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={downloadCSV}
          >
            CSV
          </Button>
        </Tooltip>

        <Tooltip title="Download Excel">
          <Button
            variant="contained"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={downloadExcel}
          >
            Excel
          </Button>
        </Tooltip>
      </Box>

      <SummaryCard
        weekly={weekly}
        trendDelta={trendDelta}
        anomalies={anomaliesCount}
      />

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

      <Snackbar
        open={snackbarOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
