import React                                                       from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link, useRouter}                                           from 'expo-router';
import {Ionicons}                                                  from '@expo/vector-icons';
import {ActionSheetProvider}                                       from '@expo/react-native-action-sheet';
import GameItem                                                    from '../components/GameItem';
import {Game}                                                      from '../types';
import {Colors}                                                    from '../constants/Colors';
import {Spacing}                                                   from '../constants/Spacing';
import {addSession, formatScheduledTime, generateSessionId}        from '../data/SessionStore';

// mock db de games
const MOCK_GAMES: Game[] = [
  {id: '1', name: 'The Legend of Zelda', genre: 'Aventura'},
  {id: '2', name: 'Super Mario Bros', genre: 'Plataforma'},
  {id: '3', name: 'Minecraft', genre: 'Sandbox'},
  {id: '4', name: 'FIFA 24', genre: 'Esportes'},
  {id: '5', name: 'Elden Ring', genre: 'RPG'},
];

function MyGamesScreenContent () {
  const router = useRouter();

  const handleSchedule = (gameId: string, duration: string) => {
    const game = MOCK_GAMES.find(g => g.id === gameId);
    if (game) {
      const newSession = {
        id           : generateSessionId(),
        gameId       : game.id,
        gameName     : game.name,
        scheduledTime: formatScheduledTime(duration),
        duration     : duration,
      };

      // Adiciona sessão no mock-db
      addSession(newSession);
      console.log('[MyGamesScreen] sessão agendada:', newSession);

      // confirma
      Alert.alert(
         'Sessão Agendada!',
         `${game.name} agendado por ${duration}.\n\nVeja sua agenda para mais detalhes.`,
         [
           {text: 'OK', style: 'default'},
           {text: 'Ver Agenda', onPress: () => router.push('/schedule')}
         ]
      );
    }
  };

  const renderGameItem = ({item}: {item: Game}) => (
     <GameItem game={item} onSchedule={handleSchedule}/>
  );

  return (
     <View style={styles.container}>
       <View style={styles.header}>
         <Text style={styles.headerTitle}>Minha Coleção de Jogos</Text>
         <Link href='/schedule' asChild>
           <TouchableOpacity style={styles.scheduleButton}>
             <Ionicons name='calendar' size={24} color={Colors.textLight}/>
             <Text style={styles.scheduleButtonText}>Agenda</Text>
           </TouchableOpacity>
         </Link>
       </View>

       <FlatList
          data={MOCK_GAMES}
          renderItem={renderGameItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
       />
     </View>
  );
}

export default function MyGamesScreen () {
  return (
     <ActionSheetProvider>
       <MyGamesScreenContent/>
     </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
                                   container         : {
                                     flex           : 1,
                                     backgroundColor: Colors.background,
                                   },
                                   header            : {
                                     backgroundColor  : Colors.cardBackground,
                                     padding          : Spacing.lg,
                                     flexDirection    : 'row',
                                     justifyContent   : 'space-between',
                                     alignItems       : 'center',
                                     borderBottomWidth: 1,
                                     borderBottomColor: Colors.border,
                                   },
                                   headerTitle       : {
                                     fontSize  : Spacing.fontSize.xl,
                                     fontWeight: Spacing.fontWeight.bold,
                                     color     : Colors.textPrimary,
                                   },
                                   scheduleButton    : {
                                     flexDirection    : 'row',
                                     alignItems       : 'center',
                                     backgroundColor  : Colors.primaryDark,
                                     paddingHorizontal: Spacing.md,
                                     paddingVertical  : Spacing.sm,
                                     borderRadius     : Spacing.borderRadius.small,
                                     gap              : Spacing.gap.sm,
                                   },
                                   scheduleButtonText: {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.base,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                   listContainer     : {
                                     padding: Spacing.lg,
                                   },
                                 });