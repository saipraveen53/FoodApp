import { Stack } from 'expo-router';
import React from 'react';
import 'setimmediate';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="modal" 
        options={{ 
          presentation: 'modal',
          title: 'Modal Page' 
        }} 
      />
    </Stack>
  );
}