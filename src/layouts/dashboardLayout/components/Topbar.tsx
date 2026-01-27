import {
  AppBar,
  Avatar,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  Toolbar,
  Typography,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import logo from '../../../assets/logo.svg';
import { useAppDispatch, useAppSelector } from '../../../store/hooks.ts';
import { logoutThunk } from '../../../features/auth/auth.thunks.ts';
import { SessionStatus } from '../../../components/tokenTimer/SessionStatus.tsx';
import { useNavigate } from 'react-router-dom';

export function Topbar() {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutThunk()).unwrap();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="fixed" sx={{ ml: 260, zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <img src={logo} alt="Logo" width={80} height={80} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <SessionStatus />
          {user && <Typography>{user.email}</Typography>}

          <Avatar>{user?.email?.[0]?.toUpperCase()}</Avatar>

          {/*<ThemeSwitcher />*/}

          <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
            <SettingsIcon sx={{ color: '#fff' }} />
          </IconButton>

          <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
            <MenuItem onClick={(e) => setLangAnchor(e.currentTarget)}>
              <ArrowLeftIcon style={{ marginRight: 8 }} />
              <ListItemText>{t('topbar.language')}</ListItemText>
            </MenuItem>

            <MenuItem
              sx={{ justifyContent: 'center' }}
              onClick={() => {
                handleLogout();
                setAnchor(null);
              }}
            >
              {t('topbar.logout')}
            </MenuItem>
          </Menu>

          <Popover
            open={!!langAnchor}
            anchorEl={langAnchor}
            onClose={() => setLangAnchor(null)}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ mt: -1, minWidth: '8.75rem' }}
          >
            <MenuItem
              onClick={() => {
                i18n.changeLanguage('pl');
                setLangAnchor(null);
                setAnchor(null);
              }}
            >
              <ListItemIcon>🇵🇱</ListItemIcon>
              <ListItemText>Polski</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => {
                i18n.changeLanguage('en');
                setLangAnchor(null);
                setAnchor(null);
              }}
            >
              <ListItemIcon>🇬🇧</ListItemIcon>
              <ListItemText>English</ListItemText>
            </MenuItem>
          </Popover>
        </div>
      </Toolbar>
    </AppBar>
  );
}
