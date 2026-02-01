export const appPaths = {
  root: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password/:token',
  dashboard: {
    root: '/dashboard',
    patients: 'patients',
    patientsAdd: 'patients/add',

    doctors: 'doctors',
    doctorsAdd: 'doctors/add',
  },
  terms: '/terms',
  notFound: '*',
} as const;
