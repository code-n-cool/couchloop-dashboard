import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

type Week = { weekEnd: string; avg: number };

function emojiForScore(s: number) {
  if (s >= 4) return "😊";
  if (s >= 3) return "😐";
  return "☔️";
}

export default function SummaryCard({ weekly, trendDelta, anomalies }: { weekly: Week[]; trendDelta: number; anomalies: number; }) {
  const trendIcon = trendDelta > 0 ? <ArrowUpwardIcon sx={{ color: "success.main" }} /> : <ArrowDownwardIcon sx={{ color: "warning.main" }} />;
  return (
    <Card elevation={1} sx={{ mb: 2 }}>
      <CardContent sx={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Box>
          <Typography variant="subtitle2">Weekly averages</Typography>
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            {weekly.map(w => (
              <Box key={w.weekEnd} sx={{ textAlign: "center", minWidth: 80 }}>
                <Typography variant="caption">{w.weekEnd}</Typography>
                <Typography variant="h6">{w.avg} {emojiForScore(w.avg)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ marginLeft: "auto", textAlign: "right" }}>
          <Typography variant="subtitle2">Trend</Typography>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1 }}>
            {trendIcon}
            <Typography variant="h6">{trendDelta > 0 ? `+${trendDelta.toFixed(2)}` : trendDelta.toFixed(2)}</Typography>
          </Box>

          <Typography variant="subtitle2" sx={{ mt: 1 }}>Anomalies</Typography>
          <Typography variant="h6">{anomalies}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
