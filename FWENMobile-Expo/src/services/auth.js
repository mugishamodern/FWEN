import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';

const AUTH_STORAGE_KEY = '@fwen_auth';
const AUTH_TOKEN_KEY = '@fwen_auth_token';

export const authAPI = {
  login: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const session = data?.session || null;
      const user = data?.user || null;
      const token = session?.access_token || null;

      // store locally for backward compatibility
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, token }));
      if (token) await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

      return { user, token };
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      }, { data: userData.metadata || {} });
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await supabase.auth.signOut();
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  },

  getStoredAuth: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Get session error:', error);
        return null;
      }
      const session = data?.session || null;
      const user = session?.user || null;
      const token = session?.access_token || null;

      if (user) {
        const payload = { user, token };
        await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
        if (token) await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
        return payload;
      }

      // fallback to local storage
      const authData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return authData ? JSON.parse(authData) : null;
    } catch (error) {
      console.error('Get stored auth error:', error);
      return null;
    }
  },
};
