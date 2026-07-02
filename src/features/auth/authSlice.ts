import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import Cookies from "js-cookie";
import {
  registerThunk,
  loginThunk,
  fetchCurrentUserThunk,
  logoutThunk,
  requestPasswordResetThunk,
  verifyOtpThunk,
  resetPasswordThunk,
  changePasswordThunk,
} from "@/features/auth/authThunks";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: "admin" | "customer";
  is_active?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: !Cookies.get("access_token"),
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setInitialized(state) {
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = false;
        state.message = "Registration successful";
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.user = action.payload.user ?? state.user;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
        state.isAuthenticated = false;
        state.isInitialized = true;
        state.user = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;
      })
      .addCase(requestPasswordResetThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(requestPasswordResetThunk.fulfilled, (state, action) => {
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(requestPasswordResetThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to request reset";
        state.loading = false;
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.error = action.payload || "OTP verification failed";
        state.loading = false;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.error = action.payload || "Password reset failed";
        state.loading = false;
      })
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        state.message = action.payload;
        state.loading = false;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.error = action.payload || "Password change failed";
        state.loading = false;
      });
  },
});

export const { setInitialized } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsInitialized = (state: RootState) => state.auth.isInitialized;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthMessage = (state: RootState) => state.auth.message;
export const selectIsAdmin = (state: RootState) => state.auth.user?.role === "admin";
