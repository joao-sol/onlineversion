import {Game} from "@/types";
import pb     from "@/lib/pb";

function recordToGame (record: any): Game {
  return {
    id         : record.id,
    name       : record.name,
    genre      : record.genre ?? 'Outro',
    isFavorite : record.isFavorite ?? false,
    image      : record.image ?? 'https://via.placeholder.com/150',
    description: record.description ?? 'Sem descrição',
    platform   : record.platform ?? 'Outro',
    releaseYear: record.releaseYear ?? 'Ano não informado',
    createdAt  : record.createdAt ?? new Date().toISOString(),
    updatedAt  : record.updatedAt ?? new Date().toISOString(),
  };
}

export async function getAllGamesPB (): Promise<Game[]> {
  console.log('[GamesStorePB] Fetching games from PocketBase...');
  try {
    const records = await pb.collection('games').getFullList({sort: 'name'});
    console.log('[GamesStorePB] Successfully fetched', records.length, 'games');
    return records.map(recordToGame);
  } catch ( error ) {
    console.error('[GamesStorePB] Error fetching games:', error);
    throw error;
  }
}

export async function getGameByIdPB (gameId: string): Promise<Game | null> {
  console.log('[GamesStorePB] Fetching game with ID:', gameId);
  try {
    const record = await pb.collection('games').getOne(gameId);
    console.log('[GamesStorePB] Successfully fetched game:', record.name);
    return recordToGame(record);
  } catch ( error ) {
    console.error('[GamesStorePB] Error fetching game by ID:', error);
    return null;
  }
}

export async function toggleFavoriteInPB (gameId: string, currentFavoriteState: boolean): Promise<Game | null> {
  console.log('[GamesStorePB] Toggling favorite for game ID:',
              gameId,
              'from',
              currentFavoriteState,
              'to',
              !currentFavoriteState);
  try {
    const record = await pb.collection('games').update(gameId, {
      isFavorite: !currentFavoriteState,
    });
    console.log('[GamesStorePB] Successfully toggled favorite status for:', record.name);
    return recordToGame(record);
  } catch ( error ) {
    console.error('[GamesStorePB] Error toggling favorite status:', error);
    throw error;
  }
}