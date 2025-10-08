import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for scheduled sessions (will be replaced with state management later)
const MOCK_SESSIONS = [
  { id: '1', gameName: 'The Legend of Zelda', scheduledTime: 'Hoje - 20:00', duration: '1 hora' },
  { id: '2', gameName: 'Minecraft', scheduledTime: 'Amanhã - 18:30', duration: '30 minutos' },
  { id: '3', gameName: 'FIFA 24', scheduledTime: 'Sexta - 21:00', duration: '1 hora' },
];

export default function ScheduleScreen() {
  const router = useRouter();

  const renderSessionItem = ({ item }: { item: typeof MOCK_SESSIONS[0] }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionIconContainer}>
        <Ionicons name="calendar-outline" size={28} color="#16213e" />
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionGameName}>{item.gameName}</Text>
        <View style={styles.sessionDetails}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.sessionTime}>{item.scheduledTime}</Text>
        </View>
        <Text style={styles.sessionDuration}>Duração: {item.duration}</Text>
      </View>
      <TouchableOpacity style={styles.sessionOptions}>
        <Ionicons name="ellipsis-vertical" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="calendar-outline" size={80} color="#ccc" />
      <Text style={styles.emptyTitle}>Nenhuma sessão agendada</Text>
      <Text style={styles.emptyText}>
        Comece agendando uma sessão de jogo para organizar seu tempo!
      </Text>
      <Link href="/" asChild>
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
          <Ionicons name="game-controller" size={20} color="#16213e" />
          <Text style={styles.headerCount}>{MOCK_SESSIONS.length} sessões</Text>
        </View>
      </View>

      {MOCK_SESSIONS.length > 0 ? (
        <FlatList
          data={MOCK_SESSIONS}
          renderItem={renderSessionItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        renderEmptyState()
      )}

      <View style={styles.footer}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color="#16213e" />
            <Text style={styles.backButtonText}>Voltar aos Jogos</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCount: {
    fontSize: 14,
    color: '#666',
  },
  listContainer: {
    padding: 16,
  },
  sessionCard: {
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
  sessionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#e8f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionGameName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a2e',
    marginBottom: 6,
  },
  sessionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sessionTime: {
    fontSize: 14,
    color: '#666',
  },
  sessionDuration: {
    fontSize: 13,
    color: '#999',
  },
  sessionOptions: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a2e',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: '#16213e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16213e',
  },
});
