
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
    try {
      console.log('Adding player:', player);
      const playersRef = ref(database, 'players');
      const newPlayerRef = push(playersRef);
      
      // Ensure all required fields are present and clean
      const playerData = {
        name: player.name.trim(),
        number: Number(player.number),
        position: player.position.trim(),
        ...(player.photoURL && { photoURL: player.photoURL.trim() })
      };
      
      console.log('Player data to save:', playerData);
      await set(newPlayerRef, playerData);
      console.log('Player added successfully');
    } catch (error) {
      console.error('Error adding player:', error);
      throw new Error(`Failed to add player: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updatePlayer = async (playerId: string, updates: Partial<Player>) => {
    try {
      const playerRef = ref(database, `players/${playerId}`);
      await set(playerRef, updates);
    } catch (error) {
      console.error('Error updating player:', error);
      throw new Error(`Failed to update player: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const deletePlayer = async (playerId: string) => {
    try {
      const playerRef = ref(database, `players/${playerId}`);
      await remove(playerRef);
    } catch (error) {
      console.error('Error deleting player:', error);
      throw new Error(`Failed to delete player: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const saveAttendance = async (date: string, attendance: DayAttendance) => {
    try {
      const attendanceRef = ref(database, `attendance/${date}`);
      await set(attendanceRef, attendance);
    } catch (error) {
      console.error('Error saving attendance:', error);
      throw new Error(`Failed to save attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
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
