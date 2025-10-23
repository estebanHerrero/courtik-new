// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import 'react-native-url-polyfill/auto';

const extra = (Constants?.expoConfig?.extra ?? Constants?.manifest?.extra) as {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
};

if (!extra?.SUPABASE_URL || !extra?.SUPABASE_ANON_KEY) {
  console.warn('Supabase keys missing in app config. Check app.config.js and .env');
}

console.log('SUPABASE_URL:', extra?.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY length:', extra?.SUPABASE_ANON_KEY?.length);

export const supabase = createClient(
  extra?.SUPABASE_URL ?? '',
  extra?.SUPABASE_ANON_KEY ?? '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);