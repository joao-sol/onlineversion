/**
 * SessionStore - Banco de Dados Simulado para Sessões de Jogo
 * 
 * Este módulo fornece um armazenamento simples em memória para gerenciar sessões de jogo agendadas.
 * Em uma aplicação real, isto seria substituído por AsyncStorage, SQLite ou uma API backend.
 * 
 * Funcionalidades:
 * - Adicionar novas sessões
 * - Remover sessões por ID
 * - Listar todas as sessões
 * - Inscrever-se para mudanças (para atualizações reativas)
 */

import { Session } from '../types';

// Armazenamento em memória para sessões
let sessions: Session[] = [
  { 
    id: '1', 
    gameId: '1', 
    gameName: 'The Legend of Zelda', 
    scheduledTime: 'Hoje - 20:00', 
    duration: '1 hora' 
  },
  { 
    id: '2', 
    gameId: '3', 
    gameName: 'Minecraft', 
    scheduledTime: 'Amanhã - 18:30', 
    duration: '30 minutos' 
  },
  { 
    id: '3', 
    gameId: '4', 
    gameName: 'FIFA 24', 
    scheduledTime: 'Sexta - 21:00', 
    duration: '1 hora' 
  },
];

// Callbacks de listeners para notificações de mudanças
type ChangeListener = (sessions: Session[]) => void;
let listeners: ChangeListener[] = [];

/**
 * Obtém todas as sessões agendadas
 */
export function getAllSessions(): Session[] {
  return [...sessions]; // Retorna uma cópia para prevenir mutações externas
}

/**
 * Adiciona uma nova sessão ao armazenamento
 */
export function addSession(session: Session): void {
  sessions.push(session);
  notifyListeners();
  console.log('[SessionStore] Sessão adicionada:', session);
}

/**
 * Remove uma sessão por ID
 */
export function removeSession(sessionId: string): void {
  const initialLength = sessions.length;
  sessions = sessions.filter(s => s.id !== sessionId);
  
  if (sessions.length < initialLength) {
    notifyListeners();
    console.log('[SessionStore] Sessão removida:', sessionId);
  }
}

/**
 * Gera um ID único para novas sessões
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString()}`;
}

/**
 * Inscreve-se para mudanças nas sessões
 * Retorna uma função para cancelar a inscrição
 */
export function subscribeToSessions(listener: ChangeListener): () => void {
  listeners.push(listener);
  
  // Retorna função para cancelar inscrição
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

/**
 * Notifica todos os listeners sobre mudanças
 */
function notifyListeners(): void {
  const currentSessions = getAllSessions();
  listeners.forEach(listener => {
    try {
      listener(currentSessions);
    } catch (error) {
      console.error('[SessionStore] Erro no listener:', error);
    }
  });
}

/**
 * Limpa todas as sessões (útil para testes)
 */
export function clearAllSessions(): void {
  sessions = [];
  notifyListeners();
  console.log('[SessionStore] Todas as sessões limpas');
}

/**
 * Função auxiliar para formatar horário agendado
 * Por enquanto, retorna um formato simples "Hoje - HH:MM"
 * Em uma aplicação real, isto calcularia data/hora real
 */
export function formatScheduledTime(duration: string): string {
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  
  // Formatação simples - poderia ser melhorada com bibliotecas de data apropriadas
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return `Hoje - ${formattedTime}`;
}
