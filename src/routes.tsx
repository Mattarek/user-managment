export const appPaths = {
  root: '/',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',

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
