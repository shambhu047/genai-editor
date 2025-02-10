import { Routes, Route } from 'react-router-dom';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EmptyPage from "./pages/EmptyPage";
import ProjectListPage from "./pages/ProjectListPage";
import ProjectPage from "./pages/ProjectPage";

export default function JoyOrderDashboardTemplate() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          overflow: 'auto',
          scrollbarWidth: 'thin',

          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#ccc',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#aaa',
            },
          },
        }}
      >
        <Header />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Routes>
              <Route path="/ui" element={<ProjectListPage />} />
              <Route path="/ui/projects" element={<ProjectListPage />} />
              <Route path="/ui/projects/:projectId" element={<ProjectPage />} />
              <Route path="/ui/notifications" element={<EmptyPage />} />
              <Route path="/ui/settings" element={<EmptyPage />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
