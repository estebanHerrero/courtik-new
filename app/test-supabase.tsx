// app/test-supabase.tsx
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function TestSupabase() {
  const [msg, setMsg] = useState('probando...');

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) setMsg('error: ' + error.message);
      else setMsg('cliente OK. sesión: ' + (data.session ? 'sí' : 'no'));
    });
  }, []);

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>{msg}</Text>
    </View>
  );
}