import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { NavLink, useSearchParams } from 'react-router-dom';

function useGlobalQueryParams() {
  const [searchParams] = useSearchParams();
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export default function DrawerList({ onItemClick }) {
  const query = useGlobalQueryParams();

  return (
    <List>
      <ListItemButton
        component={NavLink}
        to={`/${query}`}
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
        to={`/upload${query}`}
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
        to={`/transactions${query}`}
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
        to={`/budget${query}`}
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
