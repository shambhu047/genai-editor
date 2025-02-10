// @ts-nocheck
import Box from '@mui/joy/Box';

export default function EmptyPage() {
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
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h2>TODO</h2>
      </div>
    </Box>
  );
}
