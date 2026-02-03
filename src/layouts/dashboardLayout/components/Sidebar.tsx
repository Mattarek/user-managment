import {
  Avatar,
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useAppSelector } from '../../../store/hooks.ts';
import { useTranslation } from 'react-i18next';
import { appPaths } from '../../../routes.tsx';

type Props = {
  width?: number;
  height?: number;
};

export function Sidebar({ width = 260, height = 64 }: Readonly<Props>) {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const [patientsOpen, setPatientsOpen] = useState(false);
  const [doctorsOpen, setDoctorsOpen] = useState(false);

  const isPatientsRoute = useMemo(
    () => location.pathname === appPaths.dashboard.patients || location.pathname === appPaths.dashboard.patientsAdd,
    [location.pathname],
  );

  const isDoctorsRoute = useMemo(
    () => location.pathname === appPaths.dashboard.doctors || location.pathname === appPaths.dashboard.doctorsAdd,
    [location.pathname],
  );

  const isPatientsOpen = patientsOpen || isPatientsRoute;
  const isDoctorsOpen = doctorsOpen || isDoctorsRoute;

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: 'border-box',
          top: height,
          height: `calc(100% - ${height}px)`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderBottom: '0.0625rem solid rgba(255,255,255,0.12)',
        }}
      >
        <Avatar>{user?.name?.[0]?.toUpperCase()}</Avatar>

        <Box>
          <Typography fontWeight={600}>{user ? `${user.name ?? ''} ${user.surname ?? ''}`.trim() : '—'}</Typography>

          <Typography variant="body2" color="text.secondary">
            {user?.role ?? ''}
          </Typography>
        </Box>
      </Box>

      <Box component="nav" aria-label="Sidebar navigation">
        <List>
          <ListItemButton component={Link} to={appPaths.dashboard.root} selected={isActive(appPaths.dashboard.root)}>
            <ListItemText primary={t('sidebar.home')} />
          </ListItemButton>

          <Box component="div">
            <ListItemButton onClick={() => setPatientsOpen((v) => !v)} aria-expanded={isPatientsOpen}>
              <ListItemText primary={t('sidebar.patients')} />
              {isPatientsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={isPatientsOpen}>
              <List sx={{ pl: 3 }}>
                <ListItemButton
                  component={Link}
                  to={appPaths.dashboard.patients}
                  selected={isActive(appPaths.dashboard.patients)}
                >
                  <ListItemText primary={t('sidebar.patients_list')} />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to={appPaths.dashboard.patientsAdd}
                  selected={isActive(appPaths.dashboard.patientsAdd)}
                >
                  <ListItemText primary={t('sidebar.patients_add')} />
                </ListItemButton>
              </List>
            </Collapse>
          </Box>

          <Box component="div">
            <ListItemButton onClick={() => setDoctorsOpen((v) => !v)} aria-expanded={isDoctorsOpen}>
              <ListItemText primary={t('sidebar.doctors')} />
              {isDoctorsOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={isDoctorsOpen}>
              <List sx={{ pl: 3 }}>
                <ListItemButton
                  component={Link}
                  to={appPaths.dashboard.doctors}
                  selected={isActive(appPaths.dashboard.doctors)}
                >
                  <ListItemText primary={t('sidebar.doctors_list')} />
                </ListItemButton>

                <ListItemButton
                  component={Link}
                  to={appPaths.dashboard.doctorsAdd}
                  selected={isActive(appPaths.dashboard.doctorsAdd)}
                >
                  <ListItemText primary={t('sidebar.doctors_add')} />
                </ListItemButton>
              </List>
            </Collapse>
          </Box>
        </List>
      </Box>
    </Drawer>
  );
}
