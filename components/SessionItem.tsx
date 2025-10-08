import React                                      from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Ionicons}                                 from '@expo/vector-icons';
import {useActionSheet}                           from '@expo/react-native-action-sheet';
import {SessionItemProps}                         from '../types';
import {Colors}                                   from '../constants/Colors';
import {Spacing}                                  from '../constants/Spacing';

export default function SessionItem ({session, onComplete, onCancel}: SessionItemProps) {
  const {showActionSheetWithOptions} = useActionSheet();

  const handleOptionsPress = () => {
    const options = ['Marcar como concluída', 'Cancelar sessão', 'Fechar'];
    const destructiveButtonIndex = 1;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
       {
         options,
         cancelButtonIndex,
         destructiveButtonIndex,
         title  : session.gameName,
         message: 'Gerenciar sessão agendada',
       },
       (selectedIndex?: number) => {
         if (selectedIndex === undefined || selectedIndex === cancelButtonIndex) {
           console.log('[SessionItem] Opções canceladas');
           return;
         }

         if (selectedIndex === 0) {
           console.log(`[SessionItem] Marcou como concluída: ${session.gameName}`);
           if (onComplete) {
             onComplete(session.id);
           }
         } else if (selectedIndex === 1) {
           // Cancelar sessão
           console.log(`[SessionItem] Cancelou: ${session.gameName}`);
           if (onCancel) {
             onCancel(session.id);
           }
         }
       }
    );
  };

  return (
     <View style={styles.container}>
       <View style={styles.iconContainer}>
         <Ionicons name='calendar-outline' size={28} color={Colors.primaryDark}/>
       </View>

       <View style={styles.sessionInfo}>
         <Text style={styles.gameName}>{session.gameName}</Text>
         <View style={styles.timeContainer}>
           <Ionicons name='time-outline' size={16} color={Colors.textSecondary}/>
           <Text style={styles.scheduledTime}>{session.scheduledTime}</Text>
         </View>
         <Text style={styles.duration}>Duração: {session.duration}</Text>
       </View>

       <TouchableOpacity
          style={styles.optionsButton}
          onPress={handleOptionsPress}
       >
         <Ionicons name='ellipsis-vertical' size={24} color={Colors.textSecondary}/>
       </TouchableOpacity>
     </View>
  );
}

const styles = StyleSheet.create({
                                   container    : {
                                     flexDirection  : 'row',
                                     alignItems     : 'center',
                                     backgroundColor: Colors.cardBackground,
                                     padding        : Spacing.cardPadding,
                                     marginBottom   : Spacing.cardMargin,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     shadowColor    : '#000',
                                     shadowOffset   : {width: 0, height: 2},
                                     shadowOpacity  : 0.1,
                                     shadowRadius   : 4,
                                     elevation      : 3,
                                   },
                                   iconContainer: {
                                     width          : 56,
                                     height         : 56,
                                     borderRadius   : Spacing.borderRadius.medium,
                                     backgroundColor: Colors.iconBackground,
                                     justifyContent : 'center',
                                     alignItems     : 'center',
                                     marginRight    : Spacing.md,
                                   },
                                   sessionInfo  : {
                                     flex: 1,
                                   },
                                   gameName     : {
                                     fontSize    : Spacing.fontSize.lg,
                                     fontWeight  : Spacing.fontWeight.semibold,
                                     color       : Colors.textPrimary,
                                     marginBottom: 6,
                                   },
                                   timeContainer: {
                                     flexDirection: 'row',
                                     alignItems   : 'center',
                                     gap          : Spacing.gap.sm,
                                     marginBottom : 4,
                                   },
                                   scheduledTime: {
                                     fontSize: Spacing.fontSize.base,
                                     color   : Colors.textSecondary,
                                   },
                                   duration     : {
                                     fontSize : Spacing.fontSize.sm,
                                     color    : Colors.textSecondary,
                                     fontStyle: 'italic',
                                   },
                                   optionsButton: {
                                     padding: Spacing.sm,
                                   },
                                 });
