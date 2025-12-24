import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null;

export function createClient() {
  if (!supabaseInstance) {
    const supabaseUrl = `https://${projectId}.supabase.co`;
    supabaseInstance = createSupabaseClient(supabaseUrl, publicAnonKey);
  }
  return supabaseInstance;
}

// API helper functions
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-0ae5d492`;

export async function apiCall(
  endpoint: string, 
  options: {
    method?: string;
    body?: any;
    requireAuth?: boolean;
  } = {}
) {
  const { method = 'GET', body, requireAuth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Add auth token if required
  if (requireAuth) {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, fetchOptions);
    const data = await response.json();

    if (!response.ok) {
      console.error(`API call failed for ${endpoint}: ${data.error || 'Unknown error'}`);
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
}

// Auth API functions
export const authAPI = {
  signup: async (data: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    district: string;
  }) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: data,
    });
  },

  signin: async (email: string, password: string) => {
    const result = await apiCall('/auth/signin', {
      method: 'POST',
      body: { email, password },
    });

    // Store session in Supabase client
    if (result.success && result.accessToken) {
      const supabase = createClient();
      await supabase.auth.setSession({
        access_token: result.accessToken,
        refresh_token: result.accessToken, // Using same token for simplicity
      });
    }

    return result;
  },

  getSession: async () => {
    return apiCall('/auth/session', {
      method: 'GET',
      requireAuth: true,
    });
  },

  signout: async () => {
    const result = await apiCall('/auth/signout', {
      method: 'POST',
      requireAuth: true,
    });

    // Clear local session
    const supabase = createClient();
    await supabase.auth.signOut();

    return result;
  },
};

// Parcel API functions
export const parcelAPI = {
  create: async (parcelData: any) => {
    return apiCall('/parcels', {
      method: 'POST',
      body: parcelData,
      requireAuth: true,
    });
  },

  getByTrackingNumber: async (trackingNumber: string) => {
    return apiCall(`/parcels/${trackingNumber}`, {
      method: 'GET',
    });
  },

  updateStatus: async (trackingNumber: string, statusData: {
    status: string;
    location: string;
    description: string;
  }) => {
    return apiCall(`/parcels/${trackingNumber}/status`, {
      method: 'PUT',
      body: statusData,
      requireAuth: true,
    });
  },

  getUserParcels: async () => {
    return apiCall('/user/parcels', {
      method: 'GET',
      requireAuth: true,
    });
  },
};

// User profile API functions
export const userAPI = {
  getProfile: async () => {
    return apiCall('/user/profile', {
      method: 'GET',
      requireAuth: true,
    });
  },

  updateProfile: async (profileData: any) => {
    return apiCall('/user/profile', {
      method: 'PUT',
      body: profileData,
      requireAuth: true,
    });
  },
};

// Cargo API functions
export const cargoAPI = {
  getStats: async () => {
    return apiCall('/cargo/stats', {
      method: 'GET',
      requireAuth: true,
    });
  },
};
