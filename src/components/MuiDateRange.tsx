import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Box } from "@mui/material";

type Props = {
  from: Date | null;
  to: Date | null;
  onFromChange: (d: Date | null) => void;
  onToChange: (d: Date | null) => void;
  initialFrom?: Date; // optional initial values
  initialTo?: Date;
};

export default function MuiDateRangeFallback({
  from,
  to,
  onFromChange,
  onToChange,
  initialFrom,
  initialTo
}: Props) {
  const [internalFrom, setInternalFrom] = useState<Date | null>(from || initialFrom || null);
  const [internalTo, setInternalTo] = useState<Date | null>(to || initialTo || null);

  // synchronize parent state on first render
  useEffect(() => {
    if (!from && internalFrom) onFromChange(internalFrom);
    if (!to && internalTo) onToChange(internalTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      <DatePicker
        label="From"
        value={internalFrom}
        onChange={(d) => {
          setInternalFrom(d);
          onFromChange(d ? d : null);
        }}
        slotProps={{ textField: { size: "small" } }}
      />
      <DatePicker
        label="To"
        value={internalTo}
        onChange={(d) => {
          setInternalTo(d);
          onToChange(d ? d : null);
        }}
        slotProps={{ textField: { size: "small" } }}
      />
    </Box>
  );
}
