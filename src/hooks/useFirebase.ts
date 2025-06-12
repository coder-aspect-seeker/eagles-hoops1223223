
import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, get } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database } from '@/lib/firebase';
import { Player, DayAttendance } from '@/types';

export const useFirebase = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const storage = getStorage();

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const playersRef = ref(database, 'players');
        const attendanceRef = ref(database, 'attendance');
        
        // Check if players folder exists, if not create it
        const playersSnapshot = await get(playersRef);
        if (!playersSnapshot.exists()) {
          await set(playersRef, {});
        }
        
        // Check if attendance folder exists, if not create it
        const attendanceSnapshot = await get(attendanceRef);
        if (!attendanceSnapshot.exists()) {
          await set(attendanceRef, {});
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();

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

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const imageRef = storageRef(storage, `players/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(imageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

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

  const getAttendanceHistory = async () => {
    try {
      const attendanceRef = ref(database, 'attendance');
      const snapshot = await get(attendanceRef);
      return snapshot.val() || {};
    } catch (error) {
      console.error('Error getting attendance history:', error);
      throw new Error(`Failed to get attendance history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return {
    players,
    loading,
    addPlayer,
    updatePlayer,
    deletePlayer,
    saveAttendance,
    getAttendanceHistory,
    uploadImage
  };
};
