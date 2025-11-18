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



/**
 * Função auxiliar para formatar horário agendado
 * Por enquanto, retorna um formato simples "Hoje - HH:MM"
 * Em uma aplicação real, isto calcularia data/hora real
 */
export function formatScheduledTime(duration: string): string {
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  
  return `Hoje - ${formattedTime}`;
}
