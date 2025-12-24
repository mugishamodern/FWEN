import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../utils/supabase';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return rejectWithValue(error.message || 'Login failed');
      const session = data?.session || null;
      const user = data?.user || null;
      const token = session?.access_token || null;

      // Try to read role from user_metadata or users profile table
      let role = user?.user_metadata?.role || null;
      if (!role && user?.id) {
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (!profileErr && profile) role = profile.role;
      }

      return { user, token, role };
    } catch (error) {
      return rejectWithValue(error?.message || 'Login failed');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signup',
  async ({ email, password, metadata }, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password }, { data: metadata || {} });
      if (error) return rejectWithValue(error.message || 'Signup failed');

      // Supabase signUp may not return a full session immediately depending on settings
      // Try to sign in after sign up to obtain session
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) return rejectWithValue(signInError.message || 'Signup succeeded but auto-login failed');

      const session = signInData?.session || null;
      const user = signInData?.user || null;
      const token = session?.access_token || null;

      // attempt to fetch role
      let role = user?.user_metadata?.role || null;
      if (!role && user?.id) {
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (!profileErr && profile) role = profile.role;
      }

      return { user, token, role };
    } catch (error) {
      return rejectWithValue(error?.message || 'Signup failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) return rejectWithValue(error.message || 'Logout failed');
      return true;
    } catch (error) {
      return rejectWithValue(error?.message || 'Logout failed');
    }
  }
);

export const loadStoredAuth = createAsyncThunk(
  'auth/loadStored',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) return rejectWithValue(error.message || 'Failed to load stored auth');
      const session = data?.session || null;
      const user = session?.user || null;
      const token = session?.access_token || null;

      // Attempt to fetch role from profile
      let role = user?.user_metadata?.role || null;
      if (!role && user?.id) {
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
        if (!profileErr && profile) role = profile.role;
      }

      if (user) return { user, token, role };
      return null;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load stored auth');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    userRole: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.role;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.userRole = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
      // Load stored auth
      .addCase(loadStoredAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.userRole = action.payload.role;
          state.isAuthenticated = true;
        }
      });
    
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userRole = action.payload.role;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;