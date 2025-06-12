
export interface Player {
  id: string;
  name: string;
  number: number;
  position: string;
  photoURL?: string;
}

export interface AttendanceRecord {
  playerId: string;
  status: 'present' | 'absent' | 'late';
  timestamp: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface DayAttendance {
  [playerId: string]: AttendanceStatus;
}
