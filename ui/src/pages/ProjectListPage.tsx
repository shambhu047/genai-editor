// @ts-nocheck
import Box from '@mui/joy/Box';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';

import {Link as RouterLink} from "react-router-dom";
import ProjectsTable from "../components/ProjectsTable";

export default function ProjectListPage() {
  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: {xs: 2, md: 6},
        pt: {
          xs: 'calc(12px + var(--Header-height))',
          sm: 'calc(12px + var(--Header-height))',
          md: 3,
        },
        pb: {xs: 2, sm: 2, md: 3},
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100dvh',
        gap: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
            aria-label="Devices"
            sx={{ display: 'inline-flex', alignItems: 'center' }}
          >
            <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
              Projects
            </Typography>
          </Link>
        </Breadcrumbs>
      </Box>
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: {xs: 'column', sm: 'row'},
          alignItems: {xs: 'start', sm: 'center'},
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
      </Box>
      <ProjectsTable/>
    </Box>
  );
}
