// @ts-nocheck
import React from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import { Project } from "./api";

interface Props {
  project: Project;
  onlineUsers: number;
}

export default function ProjectHeader({ project, onlineUsers }: Props) {
  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: "primary.100",
        borderBottom: "1px solid gray",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography level="h4">{project.name}</Typography>
      <Typography level="body1">Online: {onlineUsers}</Typography>
    </Box>
  );
}
