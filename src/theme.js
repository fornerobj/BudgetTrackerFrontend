import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#3B82F6', light: '#60A5FA', dark: '#1D4ED8' },
    secondary: { main: '#F472B6' },
    info: { main: '#0EA5E9' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    background: { default: '#0D1117', paper: '#161B22' },
    divider: '#1F2937',
    text: { primary: '#F1F5F9', secondary: '#94A3B8', disabled: '#64748B' }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h1: { fontWeight: 600, fontSize: '2.2rem' },
    h2: { fontWeight: 600, fontSize: '1.8rem' },
    button: { textTransform: 'none', fontWeight: 500 }
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 8 } }
    }
  }
});

export default theme;
