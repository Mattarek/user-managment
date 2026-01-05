export const appPaths = {
    login: "/login",
    register: "/register",
    forgotPassword: "/forgot-password",

    dashboard: {
        root: "/dashboard",
        patients: "patients",
        patientsAdd: "patients/add",

        doctors: "doctors",
        doctorsAdd: "doctors/add",
    },

    notFound: "*",
} as const;
