export type Mode = 'light' | 'dark';

export type SnackbarState = {
  open: boolean;
  type: 'success' | 'error';
  message: string;
};
