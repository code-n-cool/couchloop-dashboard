import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField, Box } from "@mui/material";

type Props = {
    from: Date | null;
    to: Date | null;
    onFromChange: (d: Date | null) => void;
    onToChange: (d: Date | null) => void;
};

export default function MuiDateRangeFallback({ from, to, onFromChange, onToChange }: Props) {
    return (
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <DatePicker
                label="From"
                value={from}
                onChange={(d) => onFromChange(d ? d : null)}
                slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
                label="To"
                value={to}
                onChange={(d) => onToChange(d ? d : null)}
                slotProps={{ textField: { size: "small" } }}
            />
        </Box>
    );
}
