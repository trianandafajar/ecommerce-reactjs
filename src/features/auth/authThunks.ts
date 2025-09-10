import { createAsyncThunk } from "@reduxjs/toolkit";
import { GET, POST } from "@/lib/api";
import Cookies from "js-cookie";
import type { StandardResponse } from "@/types/api";

interface LoginArgs {
  email: string;
  password: string;
}
interface RegisterArgs {
  name: string;
  email: string;
  phone?: string;
  password: string;
}
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}
interface AuthResponse {
  access_token: string;
  token_type: string;
}

// REGISTER
export const registerThunk = createAsyncThunk<
  User,
  RegisterArgs,
  { rejectValue: string }
>("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<User>>("/auth/register", payload);

    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to register");
  }
});

// LOGIN
export const loginThunk = createAsyncThunk<
  AuthResponse,
  LoginArgs,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<AuthResponse>>("/auth/login", payload);

    if (res.status !== "success") return rejectWithValue(res.message);

    Cookies.set("access_token", res.data.access_token, { path: "/" });

    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to login");
  }
});

// GET CURRENT USER
export const fetchCurrentUserThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>("auth/me", async (_, { rejectWithValue }) => {
  try {
    const res = await GET<StandardResponse<User>>("/auth/me");

    if (res.status !== "success") return rejectWithValue(res.message);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to fetch user");
  }
});

// LOGOUT
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  Cookies.remove("access_token", { path: "/" });
  return true;
});

// ----------------- PASSWORD RESET FLOW -----------------

export const requestPasswordResetThunk = createAsyncThunk<
  string,
  { email: string },
  { rejectValue: string }
>("auth/requestReset", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<string>>("/auth/forgot-password", payload);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.message;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to request password reset");
  }
});

export const verifyOtpThunk = createAsyncThunk<
  string,
  { email: string; code: string },
  { rejectValue: string }
>("auth/verifyOtp", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<string>>("/auth/verify-otp", payload);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.message;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to verify OTP");
  }
});

export const resetPasswordThunk = createAsyncThunk<
  string,
  { email: string; new_password: string },
  { rejectValue: string }
>("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<string>>("/auth/reset-password", payload);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.message;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to reset password");
  }
});

export const changePasswordThunk = createAsyncThunk<
  string,
  { old_password: string; new_password: string },
  { rejectValue: string }
>("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    const res = await POST<StandardResponse<string>>("/auth/change-password", payload);
    if (res.status !== "success") return rejectWithValue(res.message);
    return res.message;
  } catch (err: any) {
    return rejectWithValue(err.message || "Failed to change password");
  }
});
