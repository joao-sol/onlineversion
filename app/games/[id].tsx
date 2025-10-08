import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock game database
const GAME_DATABASE = {
  '1': { 
    id: '1', 
    name: 'The Legend of Zelda', 
    genre: 'Aventura',
    description: 'Um jogo de aventura épico onde você explora o reino de Hyrule, resolve enigmas e enfrenta inimigos poderosos.',
    platform: 'Nintendo Switch',
    releaseYear: '2017',
  },
  '2': { 
    id: '2', 
    name: 'Super Mario Bros', 
    genre: 'Plataforma',
    description: 'O clássico jogo de plataforma onde Mario precisa resgatar a Princesa Peach das garras de Bowser.',
    platform: 'Nintendo Switch',
    releaseYear: '1985',
  },
  '3': { 
    id: '3', 
    name: 'Minecraft', 
    genre: 'Sandbox',
    description: 'Um jogo de mundo aberto onde você pode construir, explorar e sobreviver em um mundo feito de blocos.',
    platform: 'Multi-plataforma',
    releaseYear: '2011',
  },
  '4': { 
    id: '4', 
    name: 'FIFA 24', 
    genre: 'Esportes',
    description: 'O mais recente simulador de futebol com times e jogadores reais de todo o mundo.',
    platform: 'PlayStation, Xbox, PC',
    releaseYear: '2023',
  },
  '5': { 
    id: '5', 
    name: 'Elden Ring', 
    genre: 'RPG',
    description: 'Um RPG de ação desafiador em um mundo de fantasia sombrio, criado por FromSoftware e George R.R. Martin.',
    platform: 'PlayStation, Xbox, PC',
    releaseYear: '2022',
  },
};

type GameData = typeof GAME_DATABASE[keyof typeof GAME_DATABASE];

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [game, setGame] = useState<GameData | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate data loading with useEffect (demonstrates useEffect usage)
  useEffect(() => {
    console.log('GameDetailsScreen mounted - Loading game with ID:', id);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      if (id && GAME_DATABASE[id as keyof typeof GAME_DATABASE]) {
        setGame(GAME_DATABASE[id as keyof typeof GAME_DATABASE]);
        console.log('Game data loaded:', GAME_DATABASE[id as keyof typeof GAME_DATABASE].name);
      }
      setLoading(false);
    }, 800);

    return () => {
      console.log('GameDetailsScreen unmounted');
      clearTimeout(timer);
    };
  }, [id]);

  const handleScheduleSession = () => {
    // Navigate to schedule screen (will add ActionSheet later)
    console.log('Scheduling session for:', game?.name);
    router.push('/schedule');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16213e" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (!game) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#ccc" />
        <Text style={styles.errorTitle}>Jogo não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Game Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="game-controller" size={80} color="#16213e" />
      </View>

      {/* Game Name */}
      <Text style={styles.gameName}>{game.name}</Text>

      {/* Genre Badge */}
      <View style={styles.genreBadge}>
        <Text style={styles.genreText}>{game.genre}</Text>
      </View>

      {/* Game Info Cards */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="hardware-chip-outline" size={24} color="#16213e" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Plataforma</Text>
            <Text style={styles.infoValue}>{game.platform}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="calendar-outline" size={24} color="#16213e" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>Ano de Lançamento</Text>
            <Text style={styles.infoValue}>{game.releaseYear}</Text>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Sobre o Jogo</Text>
        <Text style={styles.description}>{game.description}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={styles.scheduleButton} 
          onPress={handleScheduleSession}
        >
          <Ionicons name="time-outline" size={24} color="#fff" />
          <Text style={styles.scheduleButtonText}>Agendar Sessão</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="#16213e" />
          <Text style={styles.secondaryButtonText}>Voltar aos Jogos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginTop: 16,
    marginBottom: 24,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  gameName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a2e',
    textAlign: 'center',
    marginBottom: 12,
  },
  genreBadge: {
    backgroundColor: '#16213e',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  genreText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
  },
  descriptionSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  actionSection: {
    marginBottom: 20,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16213e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 10,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#16213e',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#16213e',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
