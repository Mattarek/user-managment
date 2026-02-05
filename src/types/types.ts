export type Mode = 'light' | 'dark';

export type SnackbarState = {
  open: boolean;
  type: 'success' | 'error';
  message: string;
};

export type ProfileFormState = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}>;

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};
