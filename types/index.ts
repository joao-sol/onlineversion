export interface Game {
  id: string;
  name: string;
  genre: string;
  description?: string;
  platform?: string;
  releaseYear?: string;
  image?: string;
}

export interface Session {
  id: string;
  gameId: string;
  gameName: string;
  scheduledTime: string;
  duration: string;
}

export interface GameItemProps {
  game: Game;
  onSchedule?: (gameId: string, duration: string) => void;
}

export interface SessionItemProps {
  session: Session;
  onComplete?: (sessionId: string) => void;
  onCancel?: (sessionId: string) => void;
}
