import React, {useEffect, useState}                                                     from 'react';
import {ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useLocalSearchParams, useRouter}                                                from 'expo-router';
import {Ionicons}                                                                       from '@expo/vector-icons';
import {ActionSheetProvider, useActionSheet}                                            from '@expo/react-native-action-sheet';
import {CameraView, useCameraPermissions}                                               from 'expo-camera';
import {Colors}                                                                         from '../../constants/Colors';
import {Spacing}                                                                        from '../../constants/Spacing';
import {getSessionByIdPB, removeSession as removeSessionPB, updateSessionCompletion}    from '../../data/SessionStorePB';
import {Session}                                                                        from '../../types';
import pb                                                                               from '../../lib/pb';

function SessionDetailsScreenContent () {
  const {id} = useLocalSearchParams<{id: string}>();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const {showActionSheetWithOptions} = useActionSheet();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);

  // Fetch session data from PocketBase
  useEffect(() => {
    let mounted = true;
    
    const loadSession = async () => {
      console.log('[SessionDetailsScreen] Loading session with ID:', id);
      setLoading(true);
      
      try {
        if (!id) {
          console.log('[SessionDetailsScreen] No ID provided');
          setLoading(false);
          return;
        }
        
        const sessionData = await getSessionByIdPB(id as string);
        
        if (mounted) {
          if (sessionData) {
            setSession(sessionData);
            console.log('[SessionDetailsScreen] Session loaded successfully:', sessionData.gameName);
          } else {
            console.log('[SessionDetailsScreen] Session not found with ID:', id);
            setSession(null);
          }
        }
      } catch (error) {
        console.error('[SessionDetailsScreen] Error loading session:', error);
        if (mounted) {
          setSession(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    loadSession();
    
    return () => {
      mounted = false;
      console.log('[SessionDetailsScreen] Component unmounted');
    };
  }, [id]);

  const handleCompleteSession = () => {
    if (!session) return;

    Alert.alert(
      'Concluir Sessão',
      `Deseja marcar a sessão de ${session.gameName} como concluída?`,
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Concluir',
          style: 'default',
          onPress: async () => {
            try {
              await updateSessionCompletion(session.id, true);
              Alert.alert(
                'Sessão Concluída!',
                `Parabéns por completar sua sessão de ${session.gameName}!`,
                [
                  {text: 'OK', onPress: () => router.push('/schedule')}
                ]
              );
            } catch (error) {
              console.error('[SessionDetailsScreen] Error completing session:', error);
              Alert.alert('Erro', 'Não foi possível concluir a sessão.');
            }
          }
        }
      ]
    );
  };

  const handleCancelSession = () => {
    if (!session) return;

    Alert.alert(
      'Cancelar Sessão',
      `Tem certeza que deseja cancelar a sessão de ${session.gameName}?`,
      [
        {text: 'Não', style: 'cancel'},
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeSessionPB(session.id);
              Alert.alert(
                'Sessão Cancelada',
                'A sessão foi removida da sua agenda.',
                [
                  {text: 'OK', onPress: () => router.push('/schedule')}
                ]
              );
            } catch (error) {
              console.error('[SessionDetailsScreen] Error canceling session:', error);
              Alert.alert('Erro', 'Não foi possível cancelar a sessão.');
            }
          }
        }
      ]
    );
  };

  const handleSaveRecordacao = async () => {
    if (!session) return;

    // Check and request camera permissions
    if (!permission) {
      console.log('[SessionDetailsScreen] Permission not loaded yet');
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          'Permissão Necessária',
          'É necessário permitir o acesso à câmera para salvar uma recordação.',
          [{text: 'OK'}]
        );
        return;
      }
    }

    // Show camera
    setShowCamera(true);
  };

  const handleTakePicture = async () => {
    if (!cameraRef || !session) return;

    try {
      console.log('[SessionDetailsScreen] Taking picture...');
      const photo = await cameraRef.takePictureAsync();
      console.log('[SessionDetailsScreen] Picture taken:', photo?.uri);
      
      if (photo && photo.uri) {
        // Create FormData with React Native format
        const formData = new FormData();
        
        // React Native FormData requires an object with uri, type, and name properties
        formData.append('picture', {
          uri: photo.uri,
          type: 'image/jpeg',
          name: 'recordacao.jpg',
        } as any);

        console.log('[SessionDetailsScreen] Uploading picture to PocketBase...');
        // Update session with the picture file in PocketBase
        await pb.collection('sessions').update(session.id, formData);
        console.log('[SessionDetailsScreen] Picture uploaded successfully');

        // Reload session data to get the updated picture URL
        const updatedSession = await getSessionByIdPB(session.id);
        if (updatedSession) {
          setSession(updatedSession);
          console.log('[SessionDetailsScreen] Session updated with new picture');
        }
        
        setShowCamera(false);

        Alert.alert(
          'Recordação Salva!',
          'Sua foto foi salva com sucesso.',
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      console.error('[SessionDetailsScreen] Error taking picture:', error);
      setShowCamera(false);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color={Colors.primaryDark}/>
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!session) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name='alert-circle-outline' size={80} color={Colors.gray300}/>
        <Text style={styles.errorTitle}>Sessão não encontrada</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera view overlay
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera}
          ref={(ref) => setCameraRef(ref)}
          facing='back'
        />
        <View style={styles.cameraControls}>
          <TouchableOpacity
            style={styles.cameraCancelButton}
            onPress={() => setShowCamera(false)}
          >
            <Ionicons name='close-circle' size={50} color={Colors.textLight}/>
            <Text style={styles.cameraButtonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cameraCaptureButton}
            onPress={handleTakePicture}
          >
            <Ionicons name='camera' size={50} color={Colors.textLight}/>
            <Text style={styles.cameraButtonText}>Tirar Foto</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name='calendar' size={80} color={Colors.primaryDark}/>
      </View>

      {/* Game Name */}
      <Text style={styles.gameName}>{session.gameName}</Text>

      {/* Status Badge */}
      <View style={session.isCompleted ? styles.completedBadge : styles.statusBadge}>
        <Ionicons 
          name={session.isCompleted ? 'checkmark-circle' : 'time-outline'} 
          size={16} 
          color={Colors.textLight}
        />
        <Text style={styles.statusText}>
          {session.isCompleted ? 'Concluída' : 'Agendado'}
        </Text>
      </View>

      {/* Session Info */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name='time-outline' size={24} color={Colors.primaryDark}/>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValue}>{session.scheduledTime}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name='camera-outline' size={24} color={Colors.primaryDark}/>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Recordação</Text>
            <Text style={styles.infoValue}>
              {session.recordacao ? 'Foto salva' : 'Nenhuma foto'}
            </Text>
          </View>
        </View>

        {session.recordacao && (
          <View style={styles.photoContainer}>
            <Image source={{uri: session.recordacao}} style={styles.recordacaoImage} />
          </View>
        )}
      </View>

      {/* Description Section */}
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Sobre esta Sessão</Text>
        <Text style={styles.description}>
          Esta é uma sessão agendada para jogar {session.gameName}. 
          Prepare-se para aproveitar {session.duration} de diversão!
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleCompleteSession}
        >
          <Ionicons name='checkmark-circle-outline' size={24} color={Colors.textLight}/>
          <Text style={styles.completeButtonText}>Marcar como Concluída</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={handleSaveRecordacao}
        >
          <Ionicons name='camera-outline' size={24} color={Colors.primaryDark}/>
          <Text style={styles.optionsButtonText}>Salvar Recordação</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelSession}
        >
          <Ionicons name='close-circle-outline' size={24} color={Colors.error}/>
          <Text style={styles.cancelButtonText}>Cancelar Sessão</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Ionicons name='arrow-back' size={20} color={Colors.primaryDark}/>
          <Text style={styles.secondaryButtonText}>Voltar à Agenda</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

export default function SessionDetailsScreen () {
  return (
    <ActionSheetProvider>
      <SessionDetailsScreenContent/>
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
  statusBadge        : {
    flexDirection    : 'row',
    alignItems       : 'center',
    backgroundColor  : Colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical  : Spacing.sm,
    borderRadius     : 20,
    alignSelf        : 'center',
    marginBottom     : Spacing.xl,
    gap              : Spacing.gap.sm,
  },
  completedBadge     : {
    flexDirection    : 'row',
    alignItems       : 'center',
    backgroundColor  : '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical  : Spacing.sm,
    borderRadius     : 20,
    alignSelf        : 'center',
    marginBottom     : Spacing.xl,
    gap              : Spacing.gap.sm,
  },
  statusText         : {
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
  completeButton     : {
    flexDirection  : 'row',
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: Colors.primaryDark,
    padding        : Spacing.lg,
    borderRadius   : Spacing.borderRadius.medium,
    marginBottom   : Spacing.md,
    gap            : Spacing.gap.lg,
  },
  completeButtonText : {
    color     : Colors.textLight,
    fontSize  : Spacing.fontSize.xl,
    fontWeight: Spacing.fontWeight.bold,
  },
  optionsButton      : {
    flexDirection  : 'row',
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: Colors.cardBackground,
    padding        : 14,
    borderRadius   : Spacing.borderRadius.medium,
    borderWidth    : 2,
    borderColor    : Colors.primaryDark,
    gap            : Spacing.gap.md,
    marginBottom   : Spacing.md,
  },
  optionsButtonText  : {
    color     : Colors.primaryDark,
    fontSize  : Spacing.fontSize.lg,
    fontWeight: Spacing.fontWeight.semibold,
  },
  cancelButton       : {
    flexDirection  : 'row',
    alignItems     : 'center',
    justifyContent : 'center',
    backgroundColor: Colors.cardBackground,
    padding        : 14,
    borderRadius   : Spacing.borderRadius.medium,
    borderWidth    : 2,
    borderColor    : Colors.error,
    gap            : Spacing.gap.md,
    marginBottom   : Spacing.md,
  },
  cancelButtonText   : {
    color     : Colors.error,
    fontSize  : Spacing.fontSize.lg,
    fontWeight: Spacing.fontWeight.semibold,
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
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 40,
  },
  cameraCancelButton: {
    alignItems: 'center',
  },
  cameraCaptureButton: {
    alignItems: 'center',
  },
  cameraButtonText: {
    color: Colors.textLight,
    fontSize: Spacing.fontSize.base,
    fontWeight: Spacing.fontWeight.semibold,
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  photoContainer: {
    marginTop: Spacing.md,
    borderRadius: Spacing.borderRadius.medium,
    overflow: 'hidden',
    backgroundColor: Colors.cardBackground,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordacaoImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
});
