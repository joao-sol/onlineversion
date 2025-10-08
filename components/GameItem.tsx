import React, {useEffect, useState}               from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Link}                                     from 'expo-router';
import {Ionicons}                                 from '@expo/vector-icons';
import {useActionSheet}                           from '@expo/react-native-action-sheet';
import {GameItemProps}                            from '../types';
import {Colors}                                   from '../constants/Colors';
import {Spacing}                                  from '../constants/Spacing';

/**
 * Componente GameItem
 * - Props: Recebe dados do jogo e callback
 * - useState: Gerencia estado de alternância de favorito
 * - useEffect: Registra eventos do ciclo de vida do componente
 * - ActionSheet: Fornece opções de agendamento
 */
export default function GameItem ({game, onSchedule}: GameItemProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const {showActionSheetWithOptions} = useActionSheet();

  // useEffect to demonstrate lifecycle logging (academic requirement)
  useEffect(() => {
    console.log(`[GameItem] Componente montado para o jogo: ${game.name}`);

    return () => {
      console.log(`[GameItem] Componente desmontado para o jogo: ${game.name}`);
    };
  }, [game.name]);

  // useEffect loga o estado de favorito. Poderia chamar DB, por exemplo
  useEffect(() => {
    if (isFavorite) {
      console.log(`[GameItem] Jogo "${game.name}" marcado como favorito`);
    } else {
      console.log(`[GameItem] Jogo "${game.name}" desmarcado como favorito`);
    }
  }, [isFavorite, game.name]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleSchedulePress = () => {
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
           console.log('[GameItem] Agendamento cancelado');
           return;
         }

         const durations = ['30 minutos', '1 hora', '2 horas'];
         const selectedDuration = durations[selectedIndex];

         console.log(`[GameItem] Agendado ${selectedDuration} para o jogo: ${game.name}`);

         if (onSchedule) {
           onSchedule(game.id, selectedDuration);
         }
       }
    );
  };

  return (
     <View style={styles.container}>
       <Link href={`/games/${game.id}`} asChild>
         <TouchableOpacity style={styles.mainContent}>
           <View style={styles.iconContainer}>
             <Ionicons name='game-controller' size={32} color={Colors.primaryDark}/>
           </View>
           <View style={styles.gameInfo}>
             <Text style={styles.gameName}>{game.name}</Text>
             <Text style={styles.gameGenre}>{game.genre}</Text>
           </View>
           <Ionicons name='chevron-forward' size={24} color={Colors.textSecondary}/>
         </TouchableOpacity>
       </Link>

       <View style={styles.actionsContainer}>
         <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleFavorite}
         >
           <Ionicons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? Colors.favorite : Colors.textSecondary}
           />
         </TouchableOpacity>

         <TouchableOpacity
            style={[styles.actionButton, styles.scheduleButton]}
            onPress={handleSchedulePress}
         >
           <Ionicons name='calendar' size={20} color={Colors.textLight}/>
           <Text style={styles.scheduleButtonText}>Agendar</Text>
         </TouchableOpacity>
       </View>
     </View>
  );
}

const styles = StyleSheet.create({
                                   container         : {
                                     backgroundColor: Colors.cardBackground,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     marginBottom   : Spacing.cardMargin,
                                     shadowColor    : '#000',
                                     shadowOffset   : {width: 0, height: 2},
                                     shadowOpacity  : 0.1,
                                     shadowRadius   : 4,
                                     elevation      : 3,
                                   },
                                   mainContent       : {
                                     flexDirection: 'row',
                                     alignItems   : 'center',
                                     padding      : Spacing.cardPadding,
                                   },
                                   iconContainer     : {
                                     width          : 56,
                                     height         : 56,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     backgroundColor: Colors.iconBackground,
                                     justifyContent : 'center',
                                     alignItems     : 'center',
                                     marginRight    : Spacing.md,
                                   },
                                   gameInfo          : {
                                     flex: 1,
                                   },
                                   gameName          : {
                                     fontSize    : Spacing.fontSize.lg,
                                     fontWeight  : Spacing.fontWeight.semibold,
                                     color       : Colors.textPrimary,
                                     marginBottom: 4,
                                   },
                                   gameGenre         : {
                                     fontSize: Spacing.fontSize.base,
                                     color   : Colors.textSecondary,
                                   },
                                   actionsContainer  : {
                                     flexDirection    : 'row',
                                     justifyContent   : 'space-between',
                                     alignItems       : 'center',
                                     paddingHorizontal: Spacing.cardPadding,
                                     paddingBottom    : Spacing.cardPadding,
                                     paddingTop       : Spacing.sm,
                                     borderTopWidth   : 1,
                                     borderTopColor   : Colors.border,
                                   },
                                   actionButton      : {
                                     padding: Spacing.sm,
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
                                 });
