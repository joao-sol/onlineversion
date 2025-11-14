import React, {useEffect, useState}                                from 'react';
import {Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link, useRouter}                                           from 'expo-router';
import {Ionicons}                                                  from '@expo/vector-icons';
import {ActionSheetProvider}                                       from '@expo/react-native-action-sheet';
import GameItem                                                    from '../components/GameItem';
import {Game}                                                      from '../types';
import {Colors}                                                    from '../constants/Colors';
import {Spacing}                                                   from '../constants/Spacing';
import {addSession, formatScheduledTime, generateSessionId}        from '../data/SessionStore';
import {getAllGamesPB}            from "@/data/GamesStorePB";
import seedGames, {clearAllGames} from "@/lib/seedGames";
import {clearAllSessions}         from "@/lib/seedSessions";
import CameraScreen                                                from "@/tests/Camera";

// mock db de games
const MOCK_GAMES: Game[] = [
  {
    id   : '1',
    name : 'The Legend of Zelda',
    genre: 'Aventura',
  },
  {
    id   : '2',
    name : 'Super Mario Bros',
    genre: 'Plataforma',
  },
  {
    id   : '3',
    name : 'Minecraft',
    genre: 'Sandbox',
  },
  {
    id   : '4',
    name : 'FIFA 24',
    genre: 'Esportes',
  },
  {
    id   : '5',
    name : 'Elden Ring',
    genre: 'RPG',
  },
];

function MyGamesScreenContent () {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbOperationLoading, setDbOperationLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (
        async () => {
          try {
            const data = await getAllGamesPB();
            // console.log('[Index: games carregados]', data);
            if (mounted) {
              setGames(data);
            }
          } catch ( error ) {
            console.log('[Index: erro ao montar games]' + error);
            Alert.alert('Erro', 'Não foi possível carregar os jogos.');
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        }
    )();
    return () => {mounted = false;};
  }, []);

  const loadGames = async () => {
    try {
      const data = await getAllGamesPB();
      setGames(data);
    } catch ( error ) {
      console.log('[Index: erro ao carregar games]' + error);
      Alert.alert('Erro', 'Não foi possível carregar os jogos.');
    }
  };

  const handleSeedDatabase = async () => {
    if (dbOperationLoading) return;

    setDbOperationLoading(true);
    try {
      await seedGames();
      Alert.alert(
          'Sucesso!',
          'Banco de dados populado com sucesso.',
          [
            {
              text   : 'OK',
              onPress: async () => {
                await loadGames();
              },
            },
          ],
      );
    } catch ( error ) {
      console.error('[Index] Erro ao popular banco de dados:', error);
      Alert.alert('Erro', 'Não foi possível popular o banco de dados.');
    } finally {
      setDbOperationLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (dbOperationLoading) return;

    Alert.alert(
        'Atenção!',
        'Tem certeza que deseja apagar todos os jogos do banco de dados? Esta ação não pode ser desfeita.',
        [
          {
            text : 'Cancelar',
            style: 'cancel',
          },
          {
            text   : 'Apagar',
            style  : 'destructive',
            onPress: async () => {
              setDbOperationLoading(true);
              try {
                await clearAllGames();
                Alert.alert(
                    'Sucesso!',
                    'Todos os jogos foram removidos do banco de dados.',
                    [
                      {
                        text   : 'OK',
                        onPress: async () => {
                          await loadGames();
                        },
                      },
                    ],
                );
              } catch ( error ) {
                console.error('[Index] Erro ao limpar banco de dados:', error);
                Alert.alert('Erro', 'Não foi possível limpar o banco de dados.');
              } finally {
                setDbOperationLoading(false);
              }
            },
          },
        ],
    );
  };

  const handleSchedule = async (gameId: string, duration: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;

    try {
      addSession({
                   id           : generateSessionId(),
                   gameId       : game.id,
                   duration     : duration,
                   gameName     : game.name,
                   scheduledTime: formatScheduledTime(duration),
                 });
      Alert.alert(
          'Sessão agendada!',
          `${game.name} agendado por ${duration}.\n\nVeja sua agenda para mais detalhes.`,
          [
            {
              text : 'OK',
              style: 'default',
            },
            {
              text   : 'Ver agenda',
              onPress: () => router.push('/schedule'),
            },
          ],
      );
    } catch ( error ) {
      console.log('[Index] Erro ao agendar' + error);
      Alert.alert('Erro', 'Não foi possível agendar a sessão');
    }
  };

  // const handleSchedule = (gameId: string, duration: string) => {
  //   const game = MOCK_GAMES.find(g => g.id === gameId);
  //   if (game) {
  //     const newSession = {
  //       id           : generateSessionId(),
  //       gameId       : game.id,
  //       gameName     : game.name,
  //       scheduledTime: formatScheduledTime(duration),
  //       duration     : duration,
  //     };
  //
  //     // Adiciona sessão no mock-db
  //     addSession(newSession);
  //     console.log('[MyGamesScreen] sessão agendada:', newSession);
  //
  //     // confirma
  //     Alert.alert(
  //         'Sessão Agendada!',
  //         `${game.name} agendado por ${duration}.\n\nVeja sua agenda para mais detalhes.`,
  //         [
  //           {
  //             text : 'OK',
  //             style: 'default',
  //           },
  //           {
  //             text   : 'Ver Agenda',
  //             onPress: () => router.push('/schedule'),
  //           },
  //         ],
  //     );
  //   }
  // };

  const handleFavoriteToggle = (gameId: string, newFavoriteState: boolean) => {
    setGames(prevGames =>
                 prevGames.map(game =>
                                   game.id === gameId
                                   ? {
                                         ...game,
                                         isFavorite: newFavoriteState,
                                       }
                                   : game,
                 ),
    );
    console.log(`[Index] Updated local favorite state for game ${gameId} to ${newFavoriteState}`);
  };

  const renderGameItem = ({item}: {item: Game}) => (
      <GameItem
          game={item}
          onSchedule={handleSchedule}
          onFavoriteToggle={handleFavoriteToggle}
      />
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
            data={games}
            renderItem={renderGameItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={!loading ? (
                <Text style={{
                  color  : Colors.textSecondary,
                  padding: Spacing.lg,
                }}>Nenhum jogo encontrado</Text>
            ) : null}
        />

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
                                 });