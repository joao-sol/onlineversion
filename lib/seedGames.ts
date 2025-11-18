/**
 * seedGames.ts - Script to populate PocketBase with initial game data
 */

import pb from './pb';

const GAME_DATABASE = {
  '1': {
    id         : '1',
    name       : 'The Legend of Zelda',
    genre      : 'Aventura',
    description: 'Um jogo de aventura épico onde você explora o reino de Hyrule, resolve enigmas e enfrenta inimigos poderosos.',
    platform   : 'Nintendo Switch',
    releaseYear: '2017',
    isFavorite : false,
  },
  '2': {
    id         : '2',
    name       : 'Super Mario Bros',
    genre      : 'Plataforma',
    description: 'O clássico jogo de plataforma onde Mario precisa resgatar a Princesa Peach das garras de Bowser.',
    platform   : 'Nintendo Switch',
    releaseYear: '1985',
    isFavorite : false,
  },
  '3': {
    id         : '3',
    name       : 'Minecraft',
    genre      : 'Sandbox',
    description: 'Um jogo de mundo aberto onde você pode construir, explorar e sobreviver em um mundo feito de blocos.',
    platform   : 'Multi-plataforma',
    releaseYear: '2011',
    isFavorite : false,
  },
  '4': {
    id         : '4',
    name       : 'FIFA 24',
    genre      : 'Esportes',
    description: 'O mais recente simulador de futebol com times e jogadores reais de todo o mundo.',
    platform   : 'PlayStation, Xbox, PC',
    releaseYear: '2023',
    isFavorite : false,
  },
  '5': {
    id         : '5',
    name       : 'Elden Ring',
    genre      : 'RPG',
    description: 'Um RPG de ação desafiador em um mundo de fantasia sombrio, criado por FromSoftware e George R.R. Martin.',
    platform   : 'PlayStation, Xbox, PC',
    releaseYear: '2022',
    isFavorite : false,
  },
};

/**
 * Seeds the PocketBase games collection with initial data
 * Will attempt to create each game, or update if it already exists
 */
export async function seedGames (): Promise<void> {
  console.log('[SeedGames] Starting to seed games into PocketBase...');

  let successCount = 0;
  let errorCount = 0;

  for (const [key, gameData] of Object.entries(GAME_DATABASE)) {
    try {
      const {
        id,
        ...gameDataWithoutId
      } = gameData;

      await pb.collection('games').create(gameDataWithoutId);

      console.log(`[SeedGames] ✓ Successfully created game: ${gameData.name}`);
      successCount++;
    } catch ( error: any ) {
      // If game already exists or other error occurs
      if (error?.status === 400 && error?.data?.name) {
        console.log(`[SeedGames] ⚠ Game "${gameData.name}" may already exist, skipping...`);
      } else {
        console.error(`[SeedGames] ✗ Error creating game "${gameData.name}":`, error);
        errorCount++;
      }
    }
  }

  console.log('\n[SeedGames] Seeding completed!');
  console.log(`[SeedGames] Success: ${successCount} games`);
  console.log(`[SeedGames] Errors: ${errorCount} games`);
  console.log(`[SeedGames] Total: ${Object.keys(GAME_DATABASE).length} games\n`);
}

/**
 * Clears all games from the collection (use with caution!)
 */
export async function clearAllGames (): Promise<void> {
  console.log('[SeedGames] WARNING: Clearing all games from PocketBase...');

  try {
    const games = await pb.collection('games').getFullList();

    for (const game of games) {
      await pb.collection('games').delete(game.id);
      console.log(`[SeedGames] ✓ Deleted game: ${game.name}`);
    }

    console.log(`[SeedGames] Successfully cleared ${games.length} games`);
  } catch ( error ) {
    console.error('[SeedGames] Error clearing games:', error);
    throw error;
  }
}

// Export for manual execution
export default seedGames;
