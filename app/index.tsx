import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for games (will be replaced with real data later)
const MOCK_GAMES = [
  { id: '1', name: 'The Legend of Zelda', genre: 'Aventura' },
  { id: '2', name: 'Super Mario Bros', genre: 'Plataforma' },
  { id: '3', name: 'Minecraft', genre: 'Sandbox' },
  { id: '4', name: 'FIFA 24', genre: 'Esportes' },
  { id: '5', name: 'Elden Ring', genre: 'RPG' },
];

export default function MyGamesScreen() {
  const renderGameItem = ({ item }: { item: typeof MOCK_GAMES[0] }) => (
    <Link href={`/games/${item.id}`} asChild>
      <TouchableOpacity style={styles.gameCard}>
        <View style={styles.gameIconContainer}>
          <Ionicons name="game-controller" size={32} color="#16213e" />
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameName}>{item.name}</Text>
          <Text style={styles.gameGenre}>{item.genre}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minha Coleção de Jogos</Text>
        <Link href="/schedule" asChild>
          <TouchableOpacity style={styles.scheduleButton}>
            <Ionicons name="calendar" size={24} color="#fff" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gameIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  gameGenre: {
    fontSize: 14,
    color: '#666',
  },
});