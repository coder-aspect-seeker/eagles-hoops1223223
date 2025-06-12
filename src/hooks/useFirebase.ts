
import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Player, DayAttendance } from '@/types';

export const useFirebase = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const playersRef = ref(database, 'players');
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playersArray = Object.entries(data).map(([id, player]: [string, any]) => ({
          id,
          ...player
        }));
        setPlayers(playersArray);
      } else {
        setPlayers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addPlayer = async (player: Omit<Player, 'id'>) => {
    const playersRef = ref(database, 'players');
    const newPlayerRef = push(playersRef);
    await set(newPlayerRef, player);
  };

  const updatePlayer = async (playerId: string, updates: Partial<Player>) => {
    const playerRef = ref(database, `players/${playerId}`);
    await set(playerRef, updates);
  };

  const deletePlayer = async (playerId: string) => {
    const playerRef = ref(database, `players/${playerId}`);
    await remove(playerRef);
  };

  const saveAttendance = async (date: string, attendance: DayAttendance) => {
    const attendanceRef = ref(database, `attendance/${date}`);
    await set(attendanceRef, attendance);
  };

  return {
    players,
    loading,
    addPlayer,
    updatePlayer,
    deletePlayer,
    saveAttendance
  };
};
