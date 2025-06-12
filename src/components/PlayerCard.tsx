
import { Player, AttendanceStatus } from '@/types';
import { User } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  attendanceStatus?: AttendanceStatus;
  onStatusChange?: (status: AttendanceStatus) => void;
  showAttendance?: boolean;
}

const PlayerCard = ({ player, attendanceStatus, onStatusChange, showAttendance = true }: PlayerCardProps) => {
  const getStatusColor = (status?: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-green-500';
      case 'late': return 'bg-yellow-500';
      case 'absent': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusText = (status?: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'Present';
      case 'late': return 'Late';
      case 'absent': return 'Absent';
      default: return 'Not marked';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all duration-200 active:scale-98">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
            {player.photoURL ? (
              <img src={player.photoURL} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-500">#{player.number} • {player.position}</p>
          </div>
        </div>
        
        {showAttendance && onStatusChange && (
          <div className="flex space-x-2">
            {(['present', 'late', 'absent'] as AttendanceStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                  attendanceStatus === status
                    ? `${getStatusColor(status)} border-transparent`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="sr-only">{getStatusText(status)}</span>
                {attendanceStatus === status && (
                  <div className="w-full h-full rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        
        {showAttendance && !onStatusChange && (
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(attendanceStatus)}`}></div>
            <span className="text-sm font-medium text-gray-600">{getStatusText(attendanceStatus)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerCard;
