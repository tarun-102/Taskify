import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  AuthState,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "./authTypes";
import {
  loginUserApi,
  registerUserApi,
  logoutUserApi,
  checkAuthApi,
} from "../../api/authApi";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const data = await checkAuthApi();
      return (data as any).data || (data as any).user;
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const loginUser = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/loginUser", async (credentials, { rejectWithValue }) => {
  try {
    const data = await loginUserApi(credentials);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Invalid email or password",
    );
  }
});

export const registerUser = createAsyncThunk<
  AuthResponse,
  RegisterPayload,
  { rejectValue: string }
>("auth/registerUser", async (userData, { rejectWithValue }) => {
  try {
    const data = await registerUserApi(userData);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Registration failed",
    );
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await logoutUserApi();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
    },

    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Check Auth Cases
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload as unknown as User;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem("token");
      })

      // Login Cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;

          const responseData = (action.payload as any).data || action.payload;
          state.user = responseData as unknown as User;

          const token = responseData.accessToken || responseData.token;
          if (token) {
            localStorage.setItem("token", token);
          }
        },
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login error occurred";
      })

      // Register Cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.isAuthenticated = true;

          const responseData = (action.payload as any).data || action.payload;
          state.user = responseData as unknown as User;

          const token = responseData.accessToken || responseData.token;
          if (token) {
            localStorage.setItem("token", token);
          }
        },
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration error occurred";
      })

      // Logout Cases
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        localStorage.removeItem("token");
      });
  },
});

export const { clearAuthError, logout, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;