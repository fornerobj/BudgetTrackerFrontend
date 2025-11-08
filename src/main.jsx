import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.js';
import { BrowserRouter } from 'react-router';
import { DateRangeProvider } from './utils/DateRangeProvider';

// Force dark mode (Tailwind 'class' strategy)
document.documentElement.classList.add('dark');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DateRangeProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </DateRangeProvider>
  </StrictMode>,
);
