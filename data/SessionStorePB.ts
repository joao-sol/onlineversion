import pb        from "@/lib/pb";
import {POCKETBASE_URL} from "@/lib/pb";
import {Session} from "@/types";

function recordToSession (rec: any): Session {
  // Generate PocketBase file URL for picture if it exists
  let pictureUrl = rec.recordacao; // Keep existing recordacao as fallback
  if (rec.picture) {
    pictureUrl = `${POCKETBASE_URL}/api/files/${rec.collectionName}/${rec.id}/${rec.picture}`;
  }

  return {
    id           : rec.id,
    gameId       : rec.gameId,
    gameName     : rec.gameName,
    scheduledTime: rec.scheduledTime,
    duration     : rec.duration,
    recordacao   : pictureUrl,
    isCompleted  : rec.isCompleted,
  };
}

export async function getAllSessionsPB (): Promise<Session[]> {
  const records = await pb.collection('sessions').getFullList({sort: '-created'});
  return records.map(recordToSession);
}

export async function getSessionByIdPB (sessionId: string): Promise<Session | null> {
  try {
    const rec = await pb.collection('sessions').getOne(sessionId);
    return recordToSession(rec);
  } catch (error) {
    console.error('[SessionStorePB] Error fetching session by ID:', error);
    return null;
  }
}

export async function addSession (input: Omit<Session, 'id'>): Promise<Session> {
  const rec = await pb.collection('sessions').create(input);
  return recordToSession(rec);
}

export async function removeSession (sessionId: string): Promise<void> {
  await pb.collection('sessions')
          .delete(sessionId);
}

export async function updateSessionCompletion (sessionId: string, isCompleted: boolean): Promise<Session> {
  const rec = await pb.collection('sessions').update(sessionId, { isCompleted });
  return recordToSession(rec);
}

export function subscribeToSessions (listener: (sessions: Session[]) => void): () => void {
  let active = true;
  
  // Load initial sessions
  getAllSessionsPB().then(sessions => active && listener(sessions)).catch(console.error);

  return () => {
    active = false;
  };
}

export function formatScheduledTime (duration: string): string {
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return `Hoje - ${formattedTime}`;
}

