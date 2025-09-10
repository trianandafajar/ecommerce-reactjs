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

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: !!Cookies.get("access_token"), 
  loading: false,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = false;
        state.message = "Registration successful";
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
      })

      // LOGIN
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginThunk.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // FETCH CURRENT USER
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
      })

      // LOGOUT
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // REQUEST RESET PASSWORD
      .addCase(requestPasswordResetThunk.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(requestPasswordResetThunk.rejected, (state, action) => {
        state.error = action.payload || "Failed to request reset";
      })

      // VERIFY OTP
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.error = action.payload || "OTP verification failed";
      })

      // RESET PASSWORD
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.error = action.payload || "Password reset failed";
      })

      // CHANGE PASSWORD
      .addCase(changePasswordThunk.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.error = action.payload || "Password change failed";
      });
  },
});

export default authSlice.reducer;

// SELECTORS
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthMessage = (state: RootState) => state.auth.message;
