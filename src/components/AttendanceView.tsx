
import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { useFirebase } from '@/hooks/useFirebase';
import { AttendanceStatus, DayAttendance } from '@/types';
import PlayerCard from './PlayerCard';
import { useToast } from '@/hooks/use-toast';

const AttendanceView = () => {
  const { players, saveAttendance } = useFirebase();
  const [attendance, setAttendance] = useState<DayAttendance>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const attendanceRef = ref(database, `attendance/${today}`);
    const unsubscribe = onValue(attendanceRef, (snapshot) => {
      const data = snapshot.val();
      setAttendance(data || {});
    });

    return () => unsubscribe();
  }, [today]);

  const handleStatusChange = (playerId: string, status: AttendanceStatus) => {
    const newAttendance = { ...attendance, [playerId]: status };
    setAttendance(newAttendance);
  };

  const handleSaveAttendance = async () => {
    setLoading(true);
    try {
      await saveAttendance(today, attendance);
      toast({
        title: "Attendance Saved",
        description: "Today's attendance has been successfully recorded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAttendanceStats = () => {
    const statuses = Object.values(attendance);
    return {
      present: statuses.filter(s => s === 'present').length,
      late: statuses.filter(s => s === 'late').length,
      absent: statuses.filter(s => s === 'absent').length,
      total: players.length
    };
  };

  const stats = getAttendanceStats();

  return (
    <div className="p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Today's Practice</h1>
        <p className="text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Stats Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
        <h2 className="text-lg font-semibold mb-4">Attendance Overview</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.present}</div>
            <div className="text-xs opacity-90">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.late}</div>
            <div className="text-xs opacity-90">Late</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.absent}</div>
            <div className="text-xs opacity-90">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs opacity-90">Total</div>
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="space-y-3 mb-6">
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            attendanceStatus={attendance[player.id]}
            onStatusChange={(status) => handleStatusChange(player.id, status)}
          />
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSaveAttendance}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-4 rounded-2xl font-semibold text-lg transition-all duration-200 active:scale-98 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Attendance'}
      </button>
    </div>
  );
};

export default AttendanceView;
