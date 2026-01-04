export const appPaths = {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",

    dashboard: {
        root: "/dashboard",
        patients: "/dashboard/patients",
        patientsAdd: "/dashboard/patients/add",

        doctors: "/dashboard/doctors",
        doctorsAdd: "/dashboard/doctors/add",
    },

    notFound: "*",
} as const;
