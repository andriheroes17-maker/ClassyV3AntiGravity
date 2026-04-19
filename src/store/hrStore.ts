import { create } from 'zustand';

export type AttendanceStatus = 'present' | 'late' | 'absent' | 'leave' | 'wfh';

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  gpsLoc?: string; // string representation of coordinates
}

export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  type: string; // Annual, Sick, Unpaid
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
}

export interface ReviewScore {
  id: string;
  userName: string;
  period: string; // "Q3 2026"
  okrScore: number; // 1-5
  competencyScore: number; // 1-5
  finalScore: number; // (okr*0.6) + (comp*0.4)
  notes: string;
}

interface HrState {
  attendances: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  performanceReviews: ReviewScore[];
  approveLeaveRequest: (id: string, status: LeaveStatus) => void;
  checkIn: (userId: string, userName: string) => void;
}

const mockAttendances: AttendanceRecord[] = [
  { id: 'att-1', userId: 'u1', userName: 'John Developer', date: new Date().toISOString().split('T')[0], checkInTime: '08:45 AM', status: 'present', gpsLoc: '-6.200000, 106.816666' },
  { id: 'att-2', userId: 'u2', userName: 'Sarah Designer', date: new Date().toISOString().split('T')[0], checkInTime: '09:15 AM', status: 'late', gpsLoc: '-6.211000, 106.820000' },
  { id: 'att-3', userId: 'u3', userName: 'Mike Marketing', date: new Date().toISOString().split('T')[0], status: 'wfh' },
  { id: 'att-4', userId: 'u4', userName: 'Andri Nasution', date: new Date().toISOString().split('T')[0], status: 'leave' },
];

const mockLeaves: LeaveRequest[] = [
  { id: 'lv-1', userId: 'u4', userName: 'Andri Nasution', type: 'Annual Leave', startDate: '2026-08-16', endDate: '2026-08-18', reason: 'Family vacation', status: 'pending' },
  { id: 'lv-2', userId: 'u2', userName: 'Sarah Designer', type: 'Sick Leave', startDate: '2026-08-10', endDate: '2026-08-11', reason: 'Medical appointment', status: 'approved' },
];

const mockReviews: ReviewScore[] = [
  { id: 'rev-1', userName: 'John Developer', period: 'Q2 2026', okrScore: 4.5, competencyScore: 4.2, finalScore: 4.38, notes: 'Excellent logic output, slightly needs improvement in comms.' },
  { id: 'rev-2', userName: 'Sarah Designer', period: 'Q2 2026', okrScore: 4.8, competencyScore: 4.7, finalScore: 4.76, notes: 'Exceptional artistic direction.' },
];

export const useHrStore = create<HrState>((set) => ({
  attendances: mockAttendances,
  leaveRequests: mockLeaves,
  performanceReviews: mockReviews,
  
  approveLeaveRequest: (id, status) => set(state => ({
    leaveRequests: state.leaveRequests.map(lv => lv.id === id ? { ...lv, status } : lv)
  })),

  checkIn: (userId, userName) => set(state => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: `att-new-${Date.now()}`,
      userId,
      userName,
      date: today,
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'present',
      gpsLoc: '-6.123, 106.123'
    };
    return { attendances: [...state.attendances, newRecord] };
  })
}));
