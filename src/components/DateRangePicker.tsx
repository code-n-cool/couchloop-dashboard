import React from "react";

type Props = {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

export default function DateRangePicker({ from, to, onChange }: Props) {
  return (
    <form aria-label="Date range filter" style={{ display: "flex", gap: 8, alignItems: "center" }}
      onSubmit={(e)=>e.preventDefault()}>
      <label>
        From
        <input type="date" value={from} onChange={(e)=>onChange(e.target.value, to)} />
      </label>
      <label>
        To
        <input type="date" value={to} onChange={(e)=>onChange(from, e.target.value)} />
      </label>
    </form>
  );
}
