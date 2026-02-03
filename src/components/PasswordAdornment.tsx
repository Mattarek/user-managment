import { IconButton, InputAdornment } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

export function PasswordAdornment({ visible, onToggle }: Readonly<{ visible: boolean; onToggle: () => void }>) {
  return (
    <InputAdornment position="end">
      <IconButton onClick={onToggle} edge="end" aria-label="toggle password visibility">
        {visible ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  );
}
