import 'react-native-url-polyfill/auto'
import {Stack}     from "expo-router";
import React       from "react";
import {StatusBar} from "expo-status-bar";
import {Colors}    from "../constants/Colors";
import {Spacing}   from "../constants/Spacing";

export default function RootLayout () {
  return (
     <>
       <StatusBar style='light'/>
       <Stack>
         <Stack.Screen
            name='index'
            options={{
              title           : "Meus Jogos",
              headerStyle     : {backgroundColor: Colors.primary},
              headerTintColor : Colors.textLight,
              headerTitleStyle: {fontWeight: Spacing.fontWeight.bold}
            }}
         />
         <Stack.Screen
            name='schedule'
            options={{
              title           : "Agenda de Jogos",
              headerStyle     : {backgroundColor: Colors.primary},
              headerTintColor : Colors.textLight,
              headerTitleStyle: {fontWeight: Spacing.fontWeight.bold}
            }}
         />
         <Stack.Screen
            name='games/[id]'
            options={{
              title           : "Detalhes do Jogo",
              headerStyle     : {backgroundColor: Colors.primary},
              headerTintColor : Colors.textLight,
              headerTitleStyle: {fontWeight: Spacing.fontWeight.bold}
            }}
         />
       </Stack>
     </>
  );
}
