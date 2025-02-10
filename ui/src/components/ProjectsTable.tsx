// @ts-nocheck
import * as React from "react";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Box from "@mui/joy/Box";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";

import { Project, fetchProjectList } from "./api";
import CreateProjectForm from "./CreateProjectForm";

export default function ProjectsTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchProjectList();
      setProjects(response);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleRefresh = () => {
    loadProjects();
  };

  if (error) {
    return (
      <div>{`some error occurred ${error}`}</div>
    )
  }

  return (
    <>
      <CreateProjectForm
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        onSuccess={loadProjects}
      />

      <Sheet variant="outlined" sx={{ width: "100%", borderRadius: "sm", overflow: "auto", minHeight: 0 }}>
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          stickyFooter
          hoverRow
          sx={{
            "--TableCell-headBackground": "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
          <tr>
            <th colSpan={3}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 1 }}>
                <Typography level="h4">Projects</Typography>
                <div style={{ flex: 1 }}></div>
                <Button
                  startDecorator={<AddIcon />}
                  onClick={() => setOpenCreateModal(true)}
                  color="primary"
                  variant="soft"
                >
                  New Project
                </Button>
                <IconButton onClick={handleRefresh} loading={loading} color="primary" aria-label="refresh">
                  <RefreshIcon />
                </IconButton>
              </Box>
            </th>
          </tr>
          <tr>
            <th style={{ width: "20%", padding: "12px 6px" }}>Project Name</th>
            <th style={{ width: "60%", padding: "12px 6px", textAlign: "center" }}>Description</th>
            <th style={{ width: "20%", padding: "12px 6px", textAlign: "center" }}>Actions</th>
          </tr>
          </thead>
          <tbody>
          {loading ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "20px" }}>
                <CircularProgress />
              </td>
            </tr>
          ) : (
            projects.map((project) => (
              <tr key={project.id}>
                <td><Typography level="body-xs">{project.name}</Typography></td>
                <td><Typography level="body-xs">{"N/A"}</Typography></td>
                <td style={{ textAlign: "center" }}>
                  <RouterLink to={`/ui/projects/${project.id}`}>Open</RouterLink>
                </td>
              </tr>
            ))
          )}
          </tbody>
        </Table>
      </Sheet>
    </>
  );
}
