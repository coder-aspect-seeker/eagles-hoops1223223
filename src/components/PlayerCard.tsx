
import { Player, AttendanceStatus } from '@/types';
import { User, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useFirebase } from '@/hooks/useFirebase';
import { useToast } from '@/hooks/use-toast';

interface PlayerCardProps {
  player: Player;
  attendanceStatus?: AttendanceStatus;
  onStatusChange?: (status: AttendanceStatus) => void;
  showAttendance?: boolean;
  showDelete?: boolean;
}

const PlayerCard = ({ 
  player, 
  attendanceStatus, 
  onStatusChange, 
  showAttendance = true, 
  showDelete = false 
}: PlayerCardProps) => {
  const { deletePlayer } = useFirebase();
  const { toast } = useToast();

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

  const getStatusIcon = (status: AttendanceStatus) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5 text-white" />;
      case 'late':
        return <Clock className="w-5 h-5 text-white" />;
      case 'absent':
        return <XCircle className="w-5 h-5 text-white" />;
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to remove ${player.name} from the team?`)) {
      try {
        await deletePlayer(player.id);
        toast({
          title: "Player Removed",
          description: `${player.name} has been removed from the team.`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove player. Please try again.",
          variant: "destructive",
        });
      }
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
        
        <div className="flex items-center space-x-2">
          {showAttendance && onStatusChange && (
            <div className="flex space-x-2">
              {(['present', 'late', 'absent'] as AttendanceStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    attendanceStatus === status
                      ? `${getStatusColor(status)} border-transparent text-white`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  {attendanceStatus === status ? (
                    getStatusIcon(status)
                  ) : (
                    <div className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}></div>
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

          {showDelete && (
            <button
              onClick={handleDelete}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;
