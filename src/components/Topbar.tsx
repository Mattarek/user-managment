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
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'; // 👈 tu zmiana
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import logo from '../assets/logo.svg';
import {ThemeSwitcher} from "./ThemeSwitcher.tsx";

export function Topbar() {
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

    const {i18n, t} = useTranslation();

    return (
        <AppBar position="fixed"
                sx={{ml: 260, zIndex: (theme) => theme.zIndex.drawer + 1}}>
            <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                <img src={logo} alt="Logo" width={80} height={80}/>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                    <Typography>przyklad@testowy.pl</Typography>
                    <Avatar/>
                    <ThemeSwitcher/>
                    <IconButton onClick={(e) => setAnchor(e.currentTarget)}>
                        <SettingsIcon sx={{color: '#fff'}}/>
                    </IconButton>

                    <Menu anchorEl={anchor} open={!!anchor}
                          onClose={() => setAnchor(null)}>
                        <MenuItem
                            onClick={(e) => setLangAnchor(e.currentTarget)}>
                            <ArrowLeftIcon style={{marginRight: 8}}/>
                            <ListItemText>{t('topbar.language')}</ListItemText>
                        </MenuItem>
                        <MenuItem
                            onClick={() => console.log('logout')}>{t('topbar.logout')}</MenuItem>
                    </Menu>

                    <Popover
                        open={!!langAnchor}
                        anchorEl={langAnchor}
                        onClose={() => setLangAnchor(null)}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        sx={{mt: -1}}
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
