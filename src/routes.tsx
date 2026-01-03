export const appPaths = {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",

    dashboard: {
        root: "/dashboard",
        patients: "/dashboard/patients",
        patientsAdd: "/dashboard/patients/add",
    },

    notFound: "*",
} as const;
