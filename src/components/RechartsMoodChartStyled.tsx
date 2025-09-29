import React from "react";
import {
  ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea, ReferenceDot
} from "recharts";
import { ProcessedPoint } from "../types";
import { format, parseISO } from "date-fns";

const softPrimary = "#3AAFA9"; // teal
const softSecondary = "#FFB4A2"; // coral

export default function RechartsMoodChartStyled({ data }: { data: ProcessedPoint[] }) {
  const mapped = data.map(d => ({ ...d, label: format(parseISO(d.date), "MMM d") }));

  return (
    <div style={{ width: "100%", height: 380 }}>
      <ResponsiveContainer>
        <AreaChart data={mapped} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="gradScore" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={softPrimary} stopOpacity={0.15} />
              <stop offset="100%" stopColor={softPrimary} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradAvg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={softSecondary} stopOpacity={0.18} />
              <stop offset="100%" stopColor={softSecondary} stopOpacity={0.03} />
            </linearGradient>
          </defs>

          {/* gentle grid */}
          <CartesianGrid strokeDasharray="3 6" stroke="#e9f2f1" vertical={false} />

          {/* background bands for context */}
          <ReferenceArea y1={1} y2={2.4} strokeOpacity={0} fill="#FFF3F2" fillOpacity={0.6} />
          <ReferenceArea y1={2.4} y2={3.6} strokeOpacity={0} fill="#FFFCEB" fillOpacity={0.3} />
          <ReferenceArea y1={3.6} y2={5} strokeOpacity={0} fill="#F3FFF8" fillOpacity={0.35} />

          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} />
          <Tooltip formatter={(v:any) => v} />

          <Area type="monotone" dataKey="score" stroke={softPrimary} fill="url(#gradScore)" strokeWidth={1.8} />
          <Line type="monotone" dataKey="rolling" stroke={softSecondary} dot={false} strokeWidth={2.4} />

          {mapped.map(p => p.isAnomaly && (
            <ReferenceDot key={p.date} x={p.label} y={p.score} r={5} fill="#FF6B6B" stroke="none" />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
