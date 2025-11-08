import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { NavLink } from 'react-router-dom';

export default function DrawerList({ onItemClick }) {
  return (
    <List>
      <ListItemButton
        component={NavLink}
        to="/"
        onClick={onItemClick}
        sx={{ '&.active': { bgcolor: 'action.selected' } }}
        end
      >
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      <ListItemButton
        component={NavLink}
        to="/upload"
        onClick={onItemClick}
        sx={{ '&.active': { bgcolor: 'action.selected' } }}
      >
        <ListItemIcon>
          <UploadFileIcon />
        </ListItemIcon>
        <ListItemText primary="Upload" />
      </ListItemButton>
      <ListItemButton
        component={NavLink}
        to="/transactions"
        onClick={onItemClick}
        sx={{ '&.active': { bgcolor: 'action.selected' } }}
      >
        <ListItemIcon>
          <ReceiptIcon />
        </ListItemIcon>
        <ListItemText primary="Transactions" />
      </ListItemButton>
      <ListItemButton
        component={NavLink}
        to="/budget"
        onClick={onItemClick}
        sx={{ '&.active': { bgcolor: 'action.selected' } }}
      >
        <ListItemIcon>
          <AttachMoneyIcon />
        </ListItemIcon>
        <ListItemText primary="Budget" />
      </ListItemButton>
    </List>
  );
}
