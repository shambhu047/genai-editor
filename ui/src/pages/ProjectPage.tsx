// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";

import Box from "@mui/joy/Box";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import CircularProgress from "@mui/joy/CircularProgress";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import ProjectEditor from "../components/ProjectEditor";
import { fetchProjectDetails, Project } from "../components/api";

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        const projectData = await fetchProjectDetails(projectId);
        setProject(projectData);
      } catch (error) {
        console.error("Error loading project:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId]);

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: { xs: 2, md: 6 },
        pt: {
          xs: "calc(12px + var(--Header-height))",
          sm: "calc(12px + var(--Header-height))",
          md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100dvh",
        gap: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="primary"
            component={RouterLink}
            to={"/ui/"}
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Link
            underline="none"
            color="neutral"
            component={RouterLink}
            to={"/ui/projects"}
            aria-label="Projects"
            sx={{ display: "inline-flex", alignItems: "center" }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
              Projects
            </Typography>
          </Link>
          {project && (
            <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
              {project.name}
            </Typography>
          )}
        </Breadcrumbs>
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        project && <ProjectEditor project={project} />
      )}
    </Box>
  );
}
