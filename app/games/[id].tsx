import React, {useEffect, useState}                                                     from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter}                                                from 'expo-router';
import {Ionicons}                                                                       from '@expo/vector-icons';
import {ActionSheetProvider, useActionSheet}                                            from '@expo/react-native-action-sheet';
import {Colors}                                                                         from '../../constants/Colors';
import {Spacing}                                                                        from '../../constants/Spacing';
import {addSession, formatScheduledTime, generateSessionId}                             from '../../data/SessionStore';
import {getGameByIdPB}                                                                  from '../../data/GamesStorePB';
import {Game}                                                                           from '../../types';

// NOTE: Hardcoded GAME_DATABASE is no longer used - games are now fetched from PocketBase
// Kept here for reference only
// const GAME_DATABASE = {
//   '1': {
//     id         : '1',
//     name       : 'The Legend of Zelda',
//     genre      : 'Aventura',
//     description: 'Um jogo de aventura épico onde você explora o reino de Hyrule, resolve enigmas e enfrenta inimigos poderosos.',
//     platform   : 'Nintendo Switch',
//     releaseYear: '2017',
//   },
//   '2': {
//     id         : '2',
//     name       : 'Super Mario Bros',
//     genre      : 'Plataforma',
//     description: 'O clássico jogo de plataforma onde Mario precisa resgatar a Princesa Peach das garras de Bowser.',
//     platform   : 'Nintendo Switch',
//     releaseYear: '1985',
//   },
//   '3': {
//     id         : '3',
//     name       : 'Minecraft',
//     genre      : 'Sandbox',
//     description: 'Um jogo de mundo aberto onde você pode construir, explorar e sobreviver em um mundo feito de blocos.',
//     platform   : 'Multi-plataforma',
//     releaseYear: '2011',
//   },
//   '4': {
//     id         : '4',
//     name       : 'FIFA 24',
//     genre      : 'Esportes',
//     description: 'O mais recente simulador de futebol com times e jogadores reais de todo o mundo.',
//     platform   : 'PlayStation, Xbox, PC',
//     releaseYear: '2023',
//   },
//   '5': {
//     id         : '5',
//     name       : 'Elden Ring',
//     genre      : 'RPG',
//     description: 'Um RPG de ação desafiador em um mundo de fantasia sombrio, criado por FromSoftware e George R.R. Martin.',
//     platform   : 'PlayStation, Xbox, PC',
//     releaseYear: '2022',
//   },
// };
//
// type GameData = typeof GAME_DATABASE[keyof typeof GAME_DATABASE];

function GameDetailsScreenContent () {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const {showActionSheetWithOptions} = useActionSheet();

  // Fetch game data from PocketBase
  useEffect(() => {
    let mounted = true;
    
    const loadGame = async () => {
      console.log('[GameDetailsScreen] Loading game with ID:', id);
      setLoading(true);
      
      try {
        if (!id) {
          console.log('[GameDetailsScreen] No ID provided');
          setLoading(false);
          return;
        }
        
        const gameData = await getGameByIdPB(id as string);
        
        if (mounted) {
          if (gameData) {
            setGame(gameData);
            console.log('[GameDetailsScreen] Game loaded successfully:', gameData.name);
          } else {
            console.log('[GameDetailsScreen] Game not found with ID:', id);
            setGame(null);
          }
        }
      } catch (error) {
        console.error('[GameDetailsScreen] Error loading game:', error);
        if (mounted) {
          setGame(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadGame();
    
    return () => {
      mounted = false;
      console.log('[GameDetailsScreen] Component unmounted');
    };
  }, [id]);

  const handleScheduleSession = () => {
    if (!game) return;

    const options = ['Agendar 30 minutos', 'Agendar 1 hora', 'Agendar 2 horas', 'Cancelar'];
    const cancelButtonIndex = 3;

    showActionSheetWithOptions(
       {
         options,
         cancelButtonIndex,
         title  : `Agendar sessão de ${game.name}`,
         message: 'Escolha a duração da sessão de jogo',
       },
       (selectedIndex?: number) => {
         if (selectedIndex === undefined || selectedIndex === cancelButtonIndex) {
           console.log('[GameDetailsScreen] Agendamento cancelado');
           return;
         }

         const durations = ['30 minutos', '1 hora', '2 horas'];
         const selectedDuration = durations[selectedIndex];

         // Cria um novo objeto de sessão
         const newSession = {
           id           : generateSessionId(),
           gameId       : game.id,
           gameName     : game.name,
           scheduledTime: formatScheduledTime(selectedDuration),
           duration     : selectedDuration,
         };

         // Adiciona sessão ao armazenamento
         addSession(newSession);
         console.log(`[GameDetailsScreen] Sessão agendada:`, newSession);

         // Exibe alerta de confirmação
         Alert.alert(
            'Sessão Agendada!',
            `${game.name} agendado por ${selectedDuration}.\n\nVeja sua agenda para mais detalhes.`,
            [
              {text: 'OK', style: 'default'},
              {text: 'Ver Agenda', onPress: () => router.push('/schedule')}
            ]
         );
       }
    );
  };

  if (loading) {
    return (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size='large' color={Colors.primaryDark}/>
         <Text style={styles.loadingText}>Carregando detalhes...</Text>
       </View>
    );
  }

  if (!game) {
    return (
       <View style={styles.errorContainer}>
         <Ionicons name='alert-circle-outline' size={80} color={Colors.gray300}/>
         <Text style={styles.errorTitle}>Jogo não encontrado</Text>
         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
           <Text style={styles.backButtonText}>Voltar</Text>
         </TouchableOpacity>
       </View>
    );
  }

  return (
     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
       {/* ícone */}
       <View style={styles.iconContainer}>
         <Ionicons name='game-controller' size={80} color={Colors.primaryDark}/>
       </View>

       {/* nome */}
       <Text style={styles.gameName}>{game.name}</Text>

       {/* Badge badge */}
       <View style={styles.genreBadge}>
         <Text style={styles.genreText}>{game.genre}</Text>
       </View>

       {/* infos */}
       <View style={styles.infoSection}>
         <View style={styles.infoCard}>
           <Ionicons name='hardware-chip-outline' size={24} color={Colors.primaryDark}/>
           <View style={styles.infoTextContainer}>
             <Text style={styles.infoLabel}>Plataforma</Text>
             <Text style={styles.infoValue}>{game.platform}</Text>
           </View>
         </View>

         <View style={styles.infoCard}>
           <Ionicons name='calendar-outline' size={24} color={Colors.primaryDark}/>
           <View style={styles.infoTextContainer}>
             <Text style={styles.infoLabel}>Ano de Lançamento</Text>
             <Text style={styles.infoValue}>{game.releaseYear}</Text>
           </View>
         </View>
       </View>

       {/* Descrição */}
       <View style={styles.descriptionSection}>
         <Text style={styles.sectionTitle}>Sobre o Jogo</Text>
         <Text style={styles.description}>{game.description}</Text>
       </View>

       {/* Botões de Ação */}
       <View style={styles.actionSection}>
         <TouchableOpacity
            style={styles.scheduleButton}
            onPress={handleScheduleSession}
         >
           <Ionicons name='time-outline' size={24} color={Colors.textLight}/>
           <Text style={styles.scheduleButtonText}>Agendar Sessão</Text>
         </TouchableOpacity>

         <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.back()}
         >
           <Ionicons name='arrow-back' size={20} color={Colors.primaryDark}/>
           <Text style={styles.secondaryButtonText}>Voltar aos Jogos</Text>
         </TouchableOpacity>
       </View>
     </ScrollView>
  );
}

export default function GameDetailsScreen () {
  return (
     <ActionSheetProvider>
       <GameDetailsScreenContent/>
     </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
                                   container          : {
                                     flex           : 1,
                                     backgroundColor: Colors.background,
                                   },
                                   contentContainer   : {
                                     padding: 20,
                                   },
                                   loadingContainer   : {
                                     flex           : 1,
                                     justifyContent : 'center',
                                     alignItems     : 'center',
                                     backgroundColor: Colors.background,
                                   },
                                   loadingText        : {
                                     marginTop: Spacing.lg,
                                     fontSize : Spacing.fontSize.lg,
                                     color    : Colors.textSecondary,
                                   },
                                   errorContainer     : {
                                     flex           : 1,
                                     justifyContent : 'center',
                                     alignItems     : 'center',
                                     backgroundColor: Colors.background,
                                     padding        : Spacing.xxl,
                                   },
                                   errorTitle         : {
                                     fontSize    : Spacing.fontSize.xxl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     marginTop   : Spacing.lg,
                                     marginBottom: Spacing.xl,
                                   },
                                   iconContainer      : {
                                     width          : 140,
                                     height         : 140,
                                     borderRadius   : 20,
                                     backgroundColor: Colors.iconBackground,
                                     justifyContent : 'center',
                                     alignItems     : 'center',
                                     alignSelf      : 'center',
                                     marginBottom   : Spacing.xl,
                                   },
                                   gameName           : {
                                     fontSize    : Spacing.fontSize.xxxl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     textAlign   : 'center',
                                     marginBottom: Spacing.md,
                                   },
                                   genreBadge         : {
                                     backgroundColor  : Colors.primaryDark,
                                     paddingHorizontal: 20,
                                     paddingVertical  : Spacing.sm,
                                     borderRadius     : 20,
                                     alignSelf        : 'center',
                                     marginBottom     : Spacing.xl,
                                   },
                                   genreText          : {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.base,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                   infoSection        : {
                                     marginBottom: Spacing.xl,
                                   },
                                   infoCard           : {
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     backgroundColor: Colors.cardBackground,
                                     padding        : Spacing.lg,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     marginBottom   : Spacing.md,
                                     shadowColor    : '#000',
                                     shadowOffset   : {width: 0, height: 2},
                                     shadowOpacity  : 0.1,
                                     shadowRadius   : 4,
                                     elevation      : 3,
                                   },
                                   infoTextContainer  : {
                                     marginLeft: Spacing.md,
                                     flex      : 1,
                                   },
                                   infoLabel          : {
                                     fontSize    : Spacing.fontSize.xs,
                                     color       : Colors.gray300,
                                     marginBottom: 4,
                                   },
                                   infoValue          : {
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                     color     : Colors.textPrimary,
                                   },
                                   descriptionSection : {
                                     backgroundColor: Colors.cardBackground,
                                     padding        : Spacing.lg,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     marginBottom   : Spacing.xl,
                                     shadowColor    : '#000',
                                     shadowOffset   : {width: 0, height: 2},
                                     shadowOpacity  : 0.1,
                                     shadowRadius   : 4,
                                     elevation      : 3,
                                   },
                                   sectionTitle       : {
                                     fontSize    : Spacing.fontSize.xl,
                                     fontWeight  : Spacing.fontWeight.bold,
                                     color       : Colors.textPrimary,
                                     marginBottom: Spacing.md,
                                   },
                                   description        : {
                                     fontSize  : Spacing.fontSize.md,
                                     color     : Colors.textSecondary,
                                     lineHeight: 22,
                                   },
                                   actionSection      : {
                                     marginBottom: 20,
                                   },
                                   scheduleButton     : {
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     justifyContent : 'center',
                                     backgroundColor: Colors.primaryDark,
                                     padding        : Spacing.lg,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     marginBottom   : Spacing.md,
                                     gap            : Spacing.gap.lg,
                                   },
                                   scheduleButtonText : {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.xl,
                                     fontWeight: Spacing.fontWeight.bold,
                                   },
                                   secondaryButton    : {
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     justifyContent : 'center',
                                     backgroundColor: Colors.cardBackground,
                                     padding        : 14,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     borderWidth    : 2,
                                     borderColor    : Colors.primaryDark,
                                     gap            : Spacing.gap.md,
                                   },
                                   secondaryButtonText: {
                                     color     : Colors.primaryDark,
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                   backButton         : {
                                     backgroundColor  : Colors.primaryDark,
                                     paddingHorizontal: Spacing.xl,
                                     paddingVertical  : Spacing.md,
                                     borderRadius     : Spacing.borderRadius.small,
                                   },
                                   backButtonText     : {
                                     color     : Colors.textLight,
                                     fontSize  : Spacing.fontSize.lg,
                                     fontWeight: Spacing.fontWeight.semibold,
                                   },
                                 });
