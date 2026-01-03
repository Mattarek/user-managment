import {useCallback, useEffect, useState} from "react";
import {api} from "../api/axios";
import type {AxiosError} from "axios";

export interface User {
    id: string;
    email: string;
    name?: string;
    role?: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface RegisterPayload {
    email: string;
    name: string;
    surname: string;
    password: string;
    confirmPassword: string
}

interface RecoveryPayload {
    email: string;
}


export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getMe = useCallback(async () => {
        try {
            const {data} = await api.get("/users/me");
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            getMe();
        } else {
            setLoading(false);
        }
    }, [getMe]);

    const login = async (payload: LoginPayload) => {
        try {
            const {data} = await api.post("/login", payload);

            if (!data?.accessToken) {
                throw new Error("Missing access token");
            }

            localStorage.setItem("accessToken", data.accessToken);

            await getMe();

            return {ok: true, data};
        } catch (e: unknown) {
            const err = e as AxiosError<{ message?: string }>;

            console.error("Login failed", err);

            return {
                ok: false,
                message: err.response?.data?.message || "Login failed",
            };
        }
    };

    const register = async (payload: RegisterPayload) => {
        try {
            const {data} = await api.post("/register", payload);

            if (!data?.accessToken) {
                throw new Error("Missing access token");
            }

            localStorage.setItem("accessToken", data.accessToken);

            await getMe();

            return {ok: true, data};
        } catch (e: unknown) {
            const err = e as AxiosError<{ message?: string }>;

            console.error("Register failed", err);

            return {
                ok: false,
                message: err.response?.data?.message || "Registration failed",
            };
        }
    };


    const logout = async () => {
        try {
            await api.post("/logout");
        } catch {
            console.warn("Backend logout failed, clearing local anyway");
        }

        localStorage.removeItem("accessToken");
        setUser(null);
    };

    const recovery = async (payload: RecoveryPayload) => {
        try {
            const {data} = await api.post("/users/remind-password", payload);
            return {ok: true, data};
        } catch (e: unknown) {
            const err = e as AxiosError;

            if (err.response) {
                if (err.response.status === 404) {
                    return {ok: false, message: "User not found"};
                }

                if (err.response.status === 422) {
                    return {ok: false, message: "Invalid email"};
                }
            }

            return {ok: false, message: "Server error — try again later"};
        }
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        recovery,
        refresh: () => api.post("/refresh-token"),
    };
}