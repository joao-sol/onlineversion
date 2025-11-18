/**
 * seedSessions.ts - Script to populate PocketBase with initial session data
 */

import pb from './pb';
import { addSession } from '../data/SessionStorePB';
import { getAllGamesPB } from '../data/GamesStorePB';
import { Session } from '../types';

const SESSION_DATABASE: Omit<Session, 'id'>[] = [
  { 
    gameId: '1', 
    gameName: 'The Legend of Zelda', 
    scheduledTime: 'Hoje - 20:00', 
    duration: '1 hora',
    isCompleted: true
  },
  { 
    gameId: '3', 
    gameName: 'Minecraft', 
    scheduledTime: 'Amanhã - 18:30', 
    duration: '30 minutos',
    isCompleted: false
  },
  { 
    gameId: '4', 
    gameName: 'FIFA 24', 
    scheduledTime: 'Sexta - 21:00', 
    duration: '1 hora',
    isCompleted: false
  },
];

/**
 * Seeds the PocketBase sessions collection with initial data
 * Uses addSession from SessionStorePB to let PocketBase manage IDs
 * Fetches games from PocketBase and matches by gameName to get correct gameId
 */
export async function seedSessions(): Promise<void> {
  console.log('[SeedSessions] Starting to seed sessions into PocketBase...');

  // First, fetch all games from PocketBase
  let games;
  try {
    games = await getAllGamesPB();
    console.log(`[SeedSessions] Fetched ${games.length} games from PocketBase`);
  } catch (error) {
    console.error('[SeedSessions] Error fetching games from PocketBase:', error);
    throw new Error('Cannot seed sessions: Failed to fetch games from PocketBase. Please ensure games are seeded first.');
  }

  let successCount = 0;
  let errorCount = 0;

  for (const sessionData of SESSION_DATABASE) {
    try {
      // Find the matching game by gameName
      const matchingGame = games.find(game => game.name === sessionData.gameName);
      
      if (!matchingGame) {
        console.error(`[SeedSessions] ✗ No game found with name "${sessionData.gameName}". Skipping session.`);
        errorCount++;
        continue;
      }

      // Create session with the actual gameId from PocketBase
      const { gameId, ...sessionDataWithoutGameId } = sessionData;
      const sessionToCreate: Omit<Session, 'id'> = {
        ...sessionDataWithoutGameId,
        gameId: matchingGame.id, // Use the actual game ID from PocketBase
      };

      // Use addSession from SessionStorePB instead of direct PocketBase call
      await addSession(sessionToCreate);

      console.log(`[SeedSessions] ✓ Successfully created session: ${sessionData.gameName} (${sessionData.scheduledTime}) with gameId: ${matchingGame.id}`);
      successCount++;
    } catch (error: any) {
      // If session creation fails
      console.error(`[SeedSessions] ✗ Error creating session "${sessionData.gameName}":`, error);
      errorCount++;
    }
  }

  console.log('\n[SeedSessions] Seeding completed!');
  console.log(`[SeedSessions] Success: ${successCount} sessions`);
  console.log(`[SeedSessions] Errors: ${errorCount} sessions`);
  console.log(`[SeedSessions] Total: ${SESSION_DATABASE.length} sessions\n`);
}

/**
 * Clears all sessions from the collection (use with caution!)
 */
export async function clearAllSessions(): Promise<void> {
  console.log('[SeedSessions] WARNING: Clearing all sessions from PocketBase...');

  try {
    const sessions = await pb.collection('sessions').getFullList();

    for (const session of sessions) {
      await pb.collection('sessions').delete(session.id);
    }

    console.log(`[SeedSessions] Successfully cleared ${sessions.length} sessions`);
  } catch (error) {
    console.error('[SeedSessions] Error clearing sessions:', error);
    throw error;
  }
}

// Export for manual execution
export default seedSessions;
