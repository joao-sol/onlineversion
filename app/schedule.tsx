import React, {useEffect, useState}                                                                        from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View}                                                   from 'react-native';
import {Link}                                                                                              from 'expo-router';
import {FlashList}                                                                                         from '@shopify/flash-list';
import {Ionicons}                                                                                          from '@expo/vector-icons';
import {ActionSheetProvider}                                                                               from '@expo/react-native-action-sheet';
import SessionItem                                                                                         from '../components/SessionItem';
import {Session}                                                                                           from '../types';
import {Colors}                                                                                            from '../constants/Colors';
import {Spacing}                                                                                           from '../constants/Spacing';
import {getAllSessionsPB, removeSession as removeSessionPB, subscribeToSessions as subscribeToSessionsPB, updateSessionCompletion} from '../data/SessionStorePB';
import {clearAllSessions, seedSessions} from "@/lib/seedSessions";

function ScheduleScreenContent () {

  const [sessions, setSessions] = useState<Session[]>([]);
  const [dbOperationLoading, setDbOperationLoading] = useState(false);
  useEffect(() => {
    let unsub: undefined | (() => void);
    (
        async () => {
          try {
            // Load initial sessions from PocketBase
            const initial = await getAllSessionsPB();
            setSessions(initial);
          } catch ( e ) {
            console.log('[Schedule] Erro ao carregar sesões ' + e);
          }
          // Subscribe to PocketBase updates (polling-based in SessionStorePB)
          unsub = subscribeToSessionsPB((updated) => {
            setSessions(updated);
          });
        }
    )();

    return () => {if (unsub) unsub();};
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
              onPress: async () => {
                try {
                  await updateSessionCompletion(sessionId, true);
                  // Refresh sessions list to reflect the update
                  const updatedSessions = await getAllSessionsPB();
                  setSessions(updatedSessions);
                } catch ( err ) {
                  console.error('[Schedule] Erro ao marcar sessão como concluída:', err);
                  Alert.alert('Erro', 'Não foi possível marcar a sessão como concluída.');
                }
              },
            },
          ],
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
            {text: 'Não',
              style: 'cancel',
            },
            {
              text   : 'Sim, Cancelar',
              style  : 'destructive',
              onPress: async () => {
                try {
                  await removeSessionPB(sessionId);
                  // Refresh sessions list to reflect the deletion
                  const updatedSessions = await getAllSessionsPB();
                  setSessions(updatedSessions);
                } catch ( err ) {
                  console.error('[Schedule] Erro ao remover sessão (cancel):', err);
                  Alert.alert('Erro', 'Não foi possível cancelar a sessão.');
                }
              },
            },
          ],
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

  const handleSeedDatabase = async () => {
    if (dbOperationLoading) return;
    setDbOperationLoading(true);
    try {
      await seedSessions();
      Alert.alert('Sucesso!', 'Banco de dados de sessões populado com sucesso.');
    } catch ( error ) {
      console.error('[Schedule] Erro ao popular sessões:', error);
      Alert.alert('Erro', 'Não foi possível popular o banco de dados de sessões.');
    } finally {
      setDbOperationLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (dbOperationLoading) return;
    Alert.alert(
        'Atenção!',
        'Tem certeza que deseja apagar todas as sessões do banco de dados? Esta ação não pode ser desfeita.',
        [
          {text: 'Cancelar',
            style: 'cancel',
          },
          {
            text   : 'Apagar',
            style  : 'destructive',
            onPress: async () => {
              setDbOperationLoading(true);
              try {
                await clearAllSessions();
                Alert.alert('Sucesso!', 'Todas as sessões foram removidas do banco de dados.');
              } catch ( error ) {
                console.error('[Schedule] Erro ao limpar sessões:', error);
                Alert.alert('Erro', 'Não foi possível limpar o banco de dados de sessões.');
              } finally {
                setDbOperationLoading(false);
              }
            },
          },
        ],
    );
  };

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
            <FlashList
                data={sessions}
                renderItem={renderSessionItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContainer}
            />
        ) : (
             renderEmptyState()
         )}

        <View style={styles.dbButtonsContainer}>
          <TouchableOpacity
              style={[styles.dbButton, styles.seedButton]}
              onPress={handleSeedDatabase}
              disabled={dbOperationLoading}
          >
            <Ionicons name='add-circle' size={20} color={Colors.textLight}/>
            <Text style={styles.dbButtonText}>
              {dbOperationLoading ? 'Processando...' : 'Popular BD'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={[styles.dbButton, styles.clearButton]}
              onPress={handleClearDatabase}
              disabled={dbOperationLoading}
          >
            <Ionicons name='trash' size={20} color={Colors.textLight}/>
            <Text style={styles.dbButtonText}>
              {dbOperationLoading ? 'Processando...' : 'Limpar BD'}
            </Text>
          </TouchableOpacity>
        </View>

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
                                   container         : {
                                     flex           : 1,
                                     backgroundColor: Colors.background,
                                   },
                                   header            : {
                                     backgroundColor  : Colors.cardBackground,
                                     padding          : Spacing.lg,
                                     borderBottomWidth: 1,
                                     borderBottomColor: Colors.border,
                                   },
                                   headerTitle       : {
                                     fontSize    : Spacing.fontSize.xl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     marginBottom: Spacing.sm,
                                   },
                                   headerInfo        : {
                                     flexDirection: 'row',
                                     alignItems   : 'center',
                                     gap          : Spacing.gap.md,
                                   },
                                   headerCount       : {
                                     fontSize: Spacing.fontSize.base,
                                     color   : Colors.textSecondary,
                                   },
                                   listContainer     : {
                                     padding: Spacing.lg,
                                   },
                                   emptyContainer    : {
                                     flex          : 1,
                                     justifyContent: 'center',
                                     alignItems    : 'center',
                                     padding       : Spacing.xxl,
                                   },
                                   emptyTitle        : {
                                     fontSize    : Spacing.fontSize.xxl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     marginTop   : Spacing.lg,
                                     marginBottom: Spacing.sm,
                                   },
                                   emptyText         : {
                                     fontSize    : Spacing.fontSize.base,
                                     color       : Colors.textSecondary,
                                     textAlign   : 'center',
                                     marginBottom: Spacing.xl,
                                     lineHeight  : 20,
                                   },
                                   emptyButton       : {
                                     backgroundColor  : Colors.primaryDark,
                                     paddingHorizontal: Spacing.xl,
                                     paddingVertical  : Spacing.md,
                                     borderRadius     : Spacing.borderRadius.small,
                                   },
                                   emptyButtonText   : {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                   dbButtonsContainer: {
                                     flexDirection  : 'row',
                                     padding        : Spacing.lg,
                                     gap            : Spacing.gap.md,
                                     backgroundColor: Colors.cardBackground,
                                     borderTopWidth : 1,
                                     borderTopColor : Colors.border,
                                   },
                                   dbButton          : {
                                     flex           : 1,
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     justifyContent : 'center',
                                     paddingVertical: Spacing.md,
                                     borderRadius   : Spacing.borderRadius.small,
                                     gap            : Spacing.gap.sm,
                                   },
                                   seedButton        : {
                                     backgroundColor: Colors.primaryDark,
                                   },
                                   clearButton       : {
                                     backgroundColor: Colors.error,
                                   },
                                   dbButtonText      : {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.base,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                   footer            : {
                                     backgroundColor: Colors.cardBackground,
                                     padding        : Spacing.lg,
                                     borderTopWidth : 1,
                                     borderTopColor : Colors.border,
                                   },
                                   backButton        : {
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     justifyContent : 'center',
                                     gap            : Spacing.gap.md,
                                     paddingVertical: Spacing.md,
                                   },
                                   backButtonText    : {
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                     color     : Colors.primaryDark,
                                   },
                                 });
