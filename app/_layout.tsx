import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Meus Jogos",
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <Stack.Screen 
        name="schedule" 
        options={{ 
          title: "Agenda de Jogos",
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <Stack.Screen 
        name="games/[id]" 
        options={{ 
          title: "Detalhes do Jogo",
          headerStyle: { backgroundColor: '#1a1a2e' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack>
  );
}
