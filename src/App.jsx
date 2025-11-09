import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Upload from './pages/Upload';
import Home from './pages/Home';
import Header from './components/Header';
import { useState } from 'react';
import { Drawer, Button, Container } from '@mui/material';
import DrawerList from './components/DrawerList';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    loginWithRedirect();
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <span>Redirecting to login...</span>
      </div>
    );
  }

  const toggleDrawer = (open) => () => {
    setOpen(open);
  };

  return (
    <div className="flex h-screen w-screen flex-col">
      <Header onMenuClick={toggleDrawer(true)} />
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList onItemClick={toggleDrawer(false)} />
      </Drawer>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          width: '100%',
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budget" element={<Budget />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
