import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../utils/supabase';

// Async thunks
export const createParcel = createAsyncThunk(
  'parcels/create',
  async (parcelData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.from('parcels').insert([parcelData]).select().single();
      if (error) return rejectWithValue(error.message || 'Failed to create parcel');
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to create parcel');
    }
  }
);

export const fetchParcels = createAsyncThunk(
  'parcels/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      let query = supabase.from('parcels').select('*');
      if (filters) {
        if (filters.userId) query = query.eq('user_id', filters.userId);
        if (filters.status) query = query.eq('status', filters.status);
      }
      const { data, error } = await query;
      if (error) return rejectWithValue(error.message || 'Failed to fetch parcels');
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch parcels');
    }
  }
);

export const trackParcel = createAsyncThunk(
  'parcels/track',
  async (trackingId, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .eq('tracking_number', trackingId)
        .maybeSingle();
      if (error) return rejectWithValue(error.message || 'Failed to track parcel');
      return data;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to track parcel');
    }
  }
);

const parcelSlice = createSlice({
  name: 'parcels',
  initialState: {
    parcels: [],
    currentParcel: null,
    trackingData: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentParcel: (state, action) => {
      state.currentParcel = action.payload;
    },
    clearTrackingData: (state) => {
      state.trackingData = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create parcel
      .addCase(createParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels.unshift(action.payload);
      })
      .addCase(createParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch parcels
      .addCase(fetchParcels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParcels.fulfilled, (state, action) => {
        state.loading = false;
        state.parcels = action.payload;
      })
      .addCase(fetchParcels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Track parcel
      .addCase(trackParcel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(trackParcel.fulfilled, (state, action) => {
        state.loading = false;
        state.trackingData = action.payload;
      })
      .addCase(trackParcel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCurrentParcel, clearTrackingData, clearError } = parcelSlice.actions;
export default parcelSlice.reducer;