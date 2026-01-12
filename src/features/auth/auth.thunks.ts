import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi, logoutApi, recoveryApi, registerApi } from "../../api/auth.api";
import type { LoginPayload, RegisterPayload } from "./auth.types";
import { isTokenExpired } from "../../utils/isTokenExpired.ts";
import { api } from "../../api/axios.ts";

export const loginThunk = createAsyncThunk<
  void,
  LoginPayload,
  {
    rejectValue: string;
  }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const data = await loginApi(payload);

    if (!data.accessToken) {
      throw new Error("Missing token");
    }

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return;
  } catch {
    return rejectWithValue("Login failed");
  }
});

export const getMeThunk = createAsyncThunk("auth/getMe", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return rejectWithValue("NO_TOKEN");
  }

  if (!isTokenExpired(token)) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return rejectWithValue("TOKEN_INVALID");
  }

  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch {
    return rejectWithValue("UNAUTHORIZED");
  }
});

export const registerThunk = createAsyncThunk<
  void,
  RegisterPayload,
  {
    rejectValue: string;
  }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const data = await registerApi(payload);
    localStorage.setItem("accessToken", data.accessToken);
    return;
  } catch {
    return rejectWithValue("Register failed");
  }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    await logoutApi();
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
});

export const recoveryThunk = createAsyncThunk<
  void,
  string,
  {
    rejectValue: string;
  }
>("auth/recovery", async (email, { rejectWithValue }) => {
  try {
    await recoveryApi(email);
  } catch {
    return rejectWithValue("User not found");
  }
});
