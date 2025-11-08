import { AppBar, Box, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import GlobalDateRangePicker from './GlobalDateRangePicker';

export default function Header({ onMenuClick }) {
  return (
    <Box sx={{ flex: '0 0 auto' }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onMenuClick}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Budget Tracker
          </Typography>
          <Box sx={{ mr: 2 }}>
            <GlobalDateRangePicker />
          </Box>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
