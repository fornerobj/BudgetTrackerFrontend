import { useAuth0 } from '@auth0/auth0-react';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import { useState } from 'react';

export const UserMenu = () => {
  const { user, isAuthenticated, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!isAuthenticated) return null;

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar src={user.picture} alt={user.name} />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem disabled>{user.email}</MenuItem>
        <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Log out</MenuItem>
      </Menu>
    </>
  );
};
