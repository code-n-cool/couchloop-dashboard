import React, { useMemo, useState } from "react";
import useMoodData from "./hooks/useMoodData";
import RechartsMoodChart from "./components/RechartsMoodChart";
import D3MoodChart from "./components/D3MoodChart";
import SummaryBar from "./components/SummaryBar";
import DateRangePicker from "./components/DateRangePicker";
import { weeklyAverages } from "./utils/analysis";
import "./App.css";

function App() {
  const { raw, points, loading } = useMoodData(180);
  const [from, setFrom] = useState<string>(""); // yyyy-mm-dd
  const [to, setTo] = useState<string>("");

  const filteredPoints = useMemo(() => {
    if (!points) return null;
    if (!from && !to) return points;
    return points.filter(p => {
      if (from && p.date < from) return false;
      if (to && p.date > to) return false;
      return true;
    });
  }, [points, from, to]);

  const weekly = raw ? weeklyAverages(raw, 4) : [];

  if (loading || !points || !raw) return <div>Loading...</div>;

  // quick anomaly count
  const anomaliesCount = filteredPoints?.filter(p=>p.isAnomaly).length ?? 0;

  return (
    <div className="App" style={{ padding: 20 }}>
      <h1>Clinician: Emotion Trend Dashboard</h1>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <DateRangePicker from={from} to={to} onChange={(f,t)=>{ setFrom(f); setTo(t); }} />
      </div>

      <SummaryBar weekly={weekly} anomaliesCount={anomaliesCount} />

      <h2>Recharts view</h2>
      {filteredPoints && <RechartsMoodChart data={filteredPoints} />}

      <h2>D3 view (bespoke)</h2>
      {filteredPoints && <D3MoodChart data={filteredPoints} />}
    </div>
  );
}

export default App;
