export type UserRole = 'Admin' | 'Supervisor' | 'Employee';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';
export type PayType = 'Hourly' | 'Salaried';

export interface ThemeSettings {
  mode: 'light' | 'dark';
  presetId: string;
  primaryColor: string;
  primaryHover: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  surfaceSubtle: string;
  borderColor: string;
  textColor: string;
  textMutedColor: string;
  radius: number;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  employmentType: EmploymentType;
  status: EmployeeStatus;
  joinDate: string;
  avatarBgColor?: string;
  assignedShiftId: string;
  ptoBalanceDays: number;
  compensation: {
    payType: PayType;
    rate: number;
    standardHoursPerWeek: number;
    bankName: string;
    accountNumberMasked: string;
    accountNumberRaw?: string;
    routingNumberMasked: string;
    taxIdMasked: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  notes?: string;
}

export interface ShiftTemplate {
  id: string;
  name: string;
  code: string;
  startTime: string;
  endTime: string;
  breakMinutes: number;
  color: string;
  requiredHeadcount: number;
  description: string;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftTemplateId: string;
  date: string;
  status: 'Scheduled' | 'Completed' | 'Swapped' | 'Cancelled';
  notes?: string;
}

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  targetEmployeeId: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
  createdAt: string;
}

export type LeaveType = 'Paid Time Off (PTO)' | 'Sick Leave' | 'Parental' | 'Personal' | 'Bereavement';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
  reviewedBy?: string;
}

export type AttendanceStatus = 'On-Time' | 'Late' | 'Early-Departure' | 'Half-Day' | 'Overtime' | 'Absent';

export interface AttendanceBreak {
  start: string;
  end?: string;
  durationMinutes?: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  breaks: AttendanceBreak[];
  regularHours: number;
  overtimeHours: number;
  totalHours: number;
  status: AttendanceStatus;
  location: {
    verified: boolean;
    ipAddress: string;
    geofenceLocation: string;
    latitude?: number;
    longitude?: number;
    distanceMeters?: number;
  };
  biometricVerified?: boolean;
  notes?: string;
  managerApproved: boolean;
}

export interface PayrollBonusDeduction {
  id: string;
  description: string;
  amount: number;
}

export interface PayrollEntry {
  id: string;
  employeeId: string;
  regularHours: number;
  regularEarnings: number;
  overtimeHours: number;
  overtimeEarnings: number;
  bonuses: PayrollBonusDeduction[];
  deductions: PayrollBonusDeduction[];
  grossPay: number;
  taxWithholding: number;
  medicalInsurance: number;
  retirementContribution: number;
  netPay: number;
  paymentMethod: 'Direct Deposit' | 'Bank Wire' | 'Cheque';
  status: 'Draft' | 'Approved' | 'Paid';
  transactionRef?: string;
}

export interface PayrollCycle {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Disbursed';
  taxRatePercent: number;
  totalGross: number;
  totalNet: number;
  totalTaxes: number;
  entries: PayrollEntry[];
  disbursedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  category: 'SECURITY' | 'EMPLOYEE' | 'ATTENDANCE' | 'SHIFT' | 'PAYROLL' | 'THEME';
  details: string;
  ipAddress: string;
}

export type ActiveTab = 'overview' | 'directory' | 'attendance' | 'shifts' | 'payroll' | 'leave' | 'audit' | 'settings';
