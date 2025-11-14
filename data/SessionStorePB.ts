import pb        from "@/lib/pb";
import {Session} from "@/types";

function recordToSession (rec: any): Session {
  return {
    id           : rec.id,
    gameId       : rec.gameId,
    gameName     : rec.gameName,
    scheduledTime: rec.scheduledTime,
    duration     : rec.duration,
  };
}

export async function getAllSessionsPB (): Promise<Session[]> {
  const records = await pb.collection('sessions').getFullList({sort: '-created'});
  return records.map(recordToSession);
}

export async function addSession (input: Omit<Session, 'id'>): Promise<Session> {
  const rec = await pb.collection('sessions').create(input);
  return recordToSession(rec);
}

export async function removeSession (sessionId: string): Promise<void> {
  await pb.collection('sessions')
          .delete(sessionId);
}

export function subscribeToSessions (listener: (sessions: Session[]) => void): () => void {
  let active = true;
  
  // Load initial sessions
  getAllSessionsPB().then(sessions => active && listener(sessions)).catch(console.error);

  // Poll for updates every 5 seconds
  const intervalId = setInterval(async () => {
    try {
      if (!active) return;
      const updatedSessions = await getAllSessionsPB();
      listener(updatedSessions);
      console.log('[SessionStorePB] Sessions refreshed via polling');
    } catch (error) {
      console.error('[SessionStorePB] Error polling sessions:', error);
    }
  }, 5000);

  return () => {
    active = false;
    clearInterval(intervalId);
    console.log('[SessionStorePB] Polling stopped');
  };
}

export function formatScheduledTime (duration: string): string {
  const now = new Date();
  const minutes = now.getMinutes();
  const hours = now.getHours();
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  return `Hoje - ${formattedTime}`;
}

