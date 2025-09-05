import { createAsyncThunk } from "@reduxjs/toolkit";

interface LoginArgs {
  username: string;
  password: string;
}

// Login thunk
export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ username, password }: LoginArgs, { rejectWithValue }) => {
    // Dummy auth logic
    if (username === "admin" && password === "admin") {
      const userData = { username };
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    }
    return rejectWithValue("Invalid credentials");
  }
);

// Logout thunk
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("user");
  return true;
});
