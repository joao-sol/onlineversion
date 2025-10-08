import React, {useEffect, useState}                                from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link}                                                      from 'expo-router';
import {Ionicons}                                                  from '@expo/vector-icons';
import {ActionSheetProvider}                                       from '@expo/react-native-action-sheet';
import SessionItem                                                 from '../components/SessionItem';
import {Session}                                                   from '../types';
import {Colors}                                                    from '../constants/Colors';
import {Spacing}                                                   from '../constants/Spacing';
import {getAllSessions, removeSession, subscribeToSessions}        from '../data/SessionStore';

function ScheduleScreenContent () {
  const [sessions, setSessions] = useState<Session[]>(getAllSessions());

  // subscribe to mudanças no armazenamento
  useEffect(() => {
    console.log('[ScheduleScreen] Componente montado, inscrevendo-se nas mudanças');

    const unsubscribe = subscribeToSessions((updatedSessions) => {
      console.log('[ScheduleScreen] gaming sessions atualizadas contagem:', updatedSessions.length);
      setSessions(updatedSessions);
    });

    //limpa inscrição ao desmontar
    return () => {
      console.log('[ScheduleScreen] Componente desmontado, cancelando inscrição');
      unsubscribe();
    };
  }, []);

  const handleComplete = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      Alert.alert(
         'Sessão Concluída!',
         `Parabéns por completar sua sessão de ${session.gameName}!`,
         [
           {
             text   : 'OK',
             onPress: () => {
               removeSession(sessionId);
             }
           }
         ]
      );
    }
  };

  const handleCancel = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      Alert.alert(
         'Cancelar Sessão',
         `Tem certeza que deseja cancelar a sessão de ${session.gameName}?`,
         [
           {text: 'Não', style: 'cancel'},
           {
             text   : 'Sim, Cancelar',
             style  : 'destructive',
             onPress: () => {
               removeSession(sessionId);
             }
           }
         ]
      );
    }
  };

  const renderSessionItem = ({item}: {item: Session}) => (
     <SessionItem
        session={item}
        onComplete={handleComplete}
        onCancel={handleCancel}
     />
  );

  const renderEmptyState = () => (
     <View style={styles.emptyContainer}>
       <Ionicons name='calendar-outline' size={80} color={Colors.gray300}/>
       <Text style={styles.emptyTitle}>Nenhuma sessão agendada</Text>
       <Text style={styles.emptyText}>
         Comece agendando uma sessão de jogo para organizar seu tempo!
       </Text>
       <Link href='/' asChild>
         <TouchableOpacity style={styles.emptyButton}>
           <Text style={styles.emptyButtonText}>Ver Meus Jogos</Text>
         </TouchableOpacity>
       </Link>
     </View>
  );

  return (
     <View style={styles.container}>
       <View style={styles.header}>
         <Text style={styles.headerTitle}>Sessões Agendadas</Text>
         <View style={styles.headerInfo}>
           <Ionicons name='game-controller' size={20} color={Colors.primaryDark}/>
           <Text style={styles.headerCount}>{sessions.length} sessões</Text>
         </View>
       </View>

       {sessions.length > 0 ? (
          <FlatList
             data={sessions}
             renderItem={renderSessionItem}
             keyExtractor={(item) => item.id}
             contentContainerStyle={styles.listContainer}
          />
       ) : (
           renderEmptyState()
        )}

       <View style={styles.footer}>
         <Link href='/' asChild>
           <TouchableOpacity style={styles.backButton}>
             <Ionicons name='arrow-back' size={20} color={Colors.primaryDark}/>
             <Text style={styles.backButtonText}>Voltar aos Jogos</Text>
           </TouchableOpacity>
         </Link>
       </View>
     </View>
  );
}

export default function ScheduleScreen () {
  return (
     <ActionSheetProvider>
       <ScheduleScreenContent/>
     </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
                                   container      : {
                                     flex           : 1,
                                     backgroundColor: Colors.background,
                                   },
                                   header         : {
                                     backgroundColor  : Colors.cardBackground,
                                     padding          : Spacing.lg,
                                     borderBottomWidth: 1,
                                     borderBottomColor: Colors.border,
                                   },
                                   headerTitle    : {
                                     fontSize    : Spacing.fontSize.xl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     marginBottom: Spacing.sm,
                                   },
                                   headerInfo     : {
                                     flexDirection: 'row',
                                     alignItems   : 'center',
                                     gap          : Spacing.gap.md,
                                   },
                                   headerCount    : {
                                     fontSize: Spacing.fontSize.base,
                                     color   : Colors.textSecondary,
                                   },
                                   listContainer  : {
                                     padding: Spacing.lg,
                                   },
                                   emptyContainer : {
                                     flex          : 1,
                                     justifyContent: 'center',
                                     alignItems    : 'center',
                                     padding       : Spacing.xxl,
                                   },
                                   emptyTitle     : {
                                     fontSize    : Spacing.fontSize.xxl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     marginTop   : Spacing.lg,
                                     marginBottom: Spacing.sm,
                                   },
                                   emptyText      : {
                                     fontSize    : Spacing.fontSize.base,
                                     color       : Colors.textSecondary,
                                     textAlign   : 'center',
                                     marginBottom: Spacing.xl,
                                     lineHeight  : 20,
                                   },
                                   emptyButton    : {
                                     backgroundColor  : Colors.primaryDark,
                                     paddingHorizontal: Spacing.xl,
                                     paddingVertical  : Spacing.md,
                                     borderRadius     : Spacing.borderRadius.small,
                                   },
                                   emptyButtonText: {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                   footer         : {
                                     backgroundColor: Colors.cardBackground,
                                     padding        : Spacing.lg,
                                     borderTopWidth : 1,
                                     borderTopColor : Colors.border,
                                   },
                                   backButton     : {
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     justifyContent : 'center',
                                     gap            : Spacing.gap.md,
                                     paddingVertical: Spacing.md,
                                   },
                                   backButtonText : {
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                     color     : Colors.primaryDark,
                                   },
                                 });
