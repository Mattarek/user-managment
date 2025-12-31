import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Menu, MenuItem } from '@mui/material';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  return (
    <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
      <IconButton sx={{ color: 'white' }} onClick={(e) => setAnchorEl(e.currentTarget)}>
        <LanguageIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            i18n.changeLanguage('pl');
            setAnchorEl(null);
          }}
        >
          🇵🇱 {t('auth.lang_pl')}
        </MenuItem>

        <MenuItem
          onClick={() => {
            i18n.changeLanguage('en');
            setAnchorEl(null);
          }}
        >
          🇬🇧 {t('auth.lang_en')}
        </MenuItem>
      </Menu>
    </Box>
  );
}
