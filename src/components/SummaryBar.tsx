import React from "react";

type Props = {
  weekly: { weekEnd: string; avg: number }[];
  anomaliesCount?: number;
};

export default function SummaryBar({ weekly, anomaliesCount = 0 }: Props) {
  return (
    <div className="summary-bar" role="region" aria-label="Weekly summary">
      <div>
        <strong>Weekly averages</strong>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {weekly.map((w) => (
            <div key={w.weekEnd} style={{ minWidth: 80 }}>
              <div style={{ fontSize: 12 }}>{w.weekEnd}</div>
              <div style={{ fontSize: 20 }}>{w.avg}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right" }}>
        <div><strong>Anomalies</strong></div>
        <div aria-live="polite" style={{ fontSize: 20 }}>{anomaliesCount}</div>
      </div>
    </div>
  );
}
