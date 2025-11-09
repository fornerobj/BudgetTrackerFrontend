import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme.js';
import { BrowserRouter } from 'react-router';
import { DateRangeProvider } from './utils/DateRangeProvider';
import { Auth0Provider } from '@auth0/auth0-react';

// Force dark mode (Tailwind 'class' strategy)
document.documentElement.classList.add('dark');
const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    >
      <DateRangeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </DateRangeProvider>
    </Auth0Provider>
  </StrictMode>,
);
