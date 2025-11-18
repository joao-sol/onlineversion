export interface Game {
  id: string;
  name: string;
  genre: string;
  isFavorite?: boolean;
  description?: string;
  platform?: string;
  releaseYear?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Session {
  id: string;
  gameId: string;
  gameName: string;
  scheduledTime: string;
  duration: string;
  isCompleted?: boolean;
  picture?: Blob
  createdAt?: string;
  updatedAt?: string;
}

export interface GameItemProps {
  game: Game;
  onSchedule?: (gameId: string, duration: string) => void;
  onFavoriteToggle?: (gameId: string, newFavoriteState: boolean) => void;
}

export interface SessionItemProps {
  session: Session;
  onComplete?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
}
