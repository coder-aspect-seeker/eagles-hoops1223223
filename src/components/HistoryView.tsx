
import { useState, useEffect } from 'react';
import { useFirebase } from '@/hooks/useFirebase';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Users, CheckCircle, Clock, XCircle } from 'lucide-react';

const HistoryView = () => {
  const { getAttendanceHistory, players } = useFirebase();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [attendanceHistory, setAttendanceHistory] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getAttendanceHistory();
        setAttendanceHistory(history);
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [getAttendanceHistory]);

  const getAttendanceForDate = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return attendanceHistory[dateString] || {};
  };

  const getAttendanceStats = (attendance: any) => {
    const statuses = Object.values(attendance);
    return {
      present: statuses.filter(s => s === 'present').length,
      late: statuses.filter(s => s === 'late').length,
      absent: statuses.filter(s => s === 'absent').length,
      total: players.length
    };
  };

  const getDatesWithAttendance = () => {
    return Object.keys(attendanceHistory).map(dateString => new Date(dateString));
  };

  const selectedDateAttendance = selectedDate ? getAttendanceForDate(selectedDate) : {};
  const stats = getAttendanceStats(selectedDateAttendance);

  if (loading) {
    return (
      <div className="p-4 pb-24 flex items-center justify-center min-h-64">
        <div className="text-gray-500">Loading attendance history...</div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Attendance History</h1>
        <p className="text-gray-500">Select a date to view practice attendance</p>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Practice Calendar</h2>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{
            hasAttendance: getDatesWithAttendance()
          }}
          modifiersStyles={{
            hasAttendance: { 
              backgroundColor: '#3b82f6', 
              color: 'white',
              fontWeight: 'bold'
            }
          }}
          className="rounded-md border-0"
        />
        
        <div className="mt-4 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Days with recorded attendance</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </h2>
            
            {Object.keys(selectedDateAttendance).length > 0 ? (
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
            ) : (
              <div className="text-center py-4">
                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="opacity-90">No attendance recorded for this date</p>
              </div>
            )}
          </div>

          {/* Player Details for Selected Date */}
          {Object.keys(selectedDateAttendance).length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Player Attendance</h3>
              {players.map((player) => {
                const status = selectedDateAttendance[player.id];
                const getStatusIcon = () => {
                  switch (status) {
                    case 'present':
                      return <CheckCircle className="w-5 h-5 text-green-500" />;
                    case 'late':
                      return <Clock className="w-5 h-5 text-yellow-500" />;
                    case 'absent':
                      return <XCircle className="w-5 h-5 text-red-500" />;
                    default:
                      return <div className="w-5 h-5 bg-gray-300 rounded-full"></div>;
                  }
                };

                const getStatusText = () => {
                  switch (status) {
                    case 'present': return 'Present';
                    case 'late': return 'Late';
                    case 'absent': return 'Absent';
                    default: return 'Not marked';
                  }
                };

                return (
                  <div key={player.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                          {player.photoURL ? (
                            <img src={player.photoURL} alt={player.name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{player.name}</h4>
                          <p className="text-sm text-gray-500">#{player.number} • {player.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon()}
                        <span className="text-sm font-medium text-gray-600">{getStatusText()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {Object.keys(attendanceHistory).length === 0 && (
        <div className="text-center py-12">
          <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <div className="text-gray-400 text-lg mb-2">No attendance history</div>
          <p className="text-gray-500">Start taking attendance to see practice history here</p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
