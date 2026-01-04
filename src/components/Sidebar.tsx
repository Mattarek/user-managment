import {
    Avatar,
    Box,
    Collapse,
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {Link, useLocation} from 'react-router-dom';
import {useState} from 'react';
import {type SidebarItem} from '../types/types';

type Props = {
    items: SidebarItem[];
    width?: number;
    height?: number;
};

export function Sidebar({items, width = 260, height = 64}: Readonly<Props>) {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                }}
            >
                <Avatar/>
                <Box>
                    <Typography fontWeight={600}>Marcin Kowalski</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Administrator
                    </Typography>
                </Box>
            </Box>
            <List>
                {items.map((item) => {
                    if (item.type === 'link') {
                        const active = location.pathname === item.path;

                        return (
                            <ListItemButton key={item.path} component={Link}
                                            to={item.path} selected={active}>
                                <ListItemText primary={item.label}/>
                            </ListItemButton>
                        );
                    }

                    const isActiveDropdown = item.children.some((c) => location.pathname === c.path);
                    const isOpen = !!(openDropdown === item.label || isActiveDropdown);

                    return (
                        <div key={item.label}>
                            <ListItemButton
                                onClick={() => setOpenDropdown((prev) => (prev === item.label ? null : item.label))}
                            >
                                <ListItemText primary={item.label}/>
                                {isOpen ? <ExpandLess/> : <ExpandMore/>}
                            </ListItemButton>

                            <Collapse in={isOpen}>
                                <List sx={{pl: 3}}>
                                    {item.children.map((child) => {
                                        const active = location.pathname === child.path;

                                        return (
                                            <ListItemButton
                                                key={child.path}
                                                component={Link}
                                                to={child.path}
                                                selected={active}
                                            >
                                                <ListItemText
                                                    primary={child.label}/>
                                            </ListItemButton>
                                        );
                                    })}
                                </List>
                            </Collapse>
                        </div>
                    );
                })}
            </List>
        </Drawer>
    );
}
