import React from "react";
import { Chip } from "@mui/material";

export default function PriorityPill({ priority }) {
  const tone =
    priority === "Urgent"
      ? { bg: "#fee2e2", color: "#b91c1c" }
      : priority === "High"
        ? { bg: "#fff7ed", color: "#c2410c" }
        : { bg: "#e0f2fe", color: "#0369a1" };

  return (
    <Chip
      size="small"
      label={priority}
      sx={{
        height: 22,
        bgcolor: tone.bg,
        color: tone.color,
        fontWeight: 700,
        borderRadius: "999px"
      }}
    />
  );
}
