import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceDot,
  CartesianGrid,
} from "recharts";
import { ProcessedPoint } from "../types";
import { format, parseISO } from "date-fns";

type Props = {
  data: ProcessedPoint[];
};

export default function RechartsMoodChart({ data }: Props) {
  const mapped = data.map(d => ({
    ...d,
    // x label
    label: format(parseISO(d.date), "MMM d")
  }));

  return (
    <div style={{ width: "100%", height: 360 }} role="img" aria-label="Mood over time chart">
      <ResponsiveContainer>
        <LineChart data={mapped}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" minTickGap={20} />
          <YAxis domain={[1,5]} allowDecimals={false} />
          <Tooltip formatter={(value: any) => value} labelFormatter={(l)=>`Date: ${l}`} />
          <Line type="monotone" dataKey="score" stroke="#1f77b4" dot={{ r: 2 }} name="Mood score" />
          <Line type="monotone" dataKey="rolling" stroke="#ff7f0e" dot={false} strokeWidth={2} name="7-day avg" />
          {mapped.map((p, i) => p.isAnomaly && (
            <ReferenceDot key={p.date} x={p.label} y={p.score} r={4} fill="red" stroke="none" aria-hidden />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
