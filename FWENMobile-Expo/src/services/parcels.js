import { supabase } from '../utils/supabase';

export const parcelAPI = {
  createParcel: async (parcelData) => {
    const { data, error } = await supabase.from('parcels').insert([parcelData]).select().single();
    if (error) throw error;
    return data;
  },

  getParcels: async (filters = {}) => {
    let query = supabase.from('parcels').select('*');
    if (filters) {
      if (filters.userId) query = query.eq('user_id', filters.userId);
      if (filters.status) query = query.eq('status', filters.status);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  trackParcel: async (trackingId) => {
    const { data, error } = await supabase.from('parcels').select('*').eq('tracking_number', trackingId).maybeSingle();
    if (error) throw error;
    return data;
  },

  updateStatus: async (parcelId, status, location) => {
    const { data, error } = await supabase.from('parcels').update({ status, location }).eq('id', parcelId).select().single();
    if (error) throw error;
    return data;
  },

  getParcelById: async (parcelId) => {
    const { data, error } = await supabase.from('parcels').select('*').eq('id', parcelId).maybeSingle();
    if (error) throw error;
    return data;
  },
};
