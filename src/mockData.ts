import { Employee, ShiftTemplate, ShiftAssignment, AttendanceRecord, PayrollCycle, AuditLog, LeaveRequest, ShiftSwapRequest } from './types.ts';

export const INITIAL_SHIFTS: ShiftTemplate[] = [
  {
    id: 'shift-morning',
    name: 'Morning Standard',
    code: 'MORN',
    startTime: '08:00',
    endTime: '16:30',
    breakMinutes: 60,
    color: '#2563eb',
    requiredHeadcount: 5,
    description: 'Core morning operations and client desk coverage'
  },
  {
    id: 'shift-midday',
    name: 'Midday Support',
    code: 'MID',
    startTime: '10:00',
    endTime: '18:30',
    breakMinutes: 60,
    color: '#0d9488',
    requiredHeadcount: 3,
    description: 'Midday overlap and customer escalated support'
  },
  {
    id: 'shift-evening',
    name: 'Evening Operations',
    code: 'EVE',
    startTime: '16:00',
    endTime: '00:30',
    breakMinutes: 60,
    color: '#d97706',
    requiredHeadcount: 2,
    description: 'Evening deployment window, logistics, and handoff'
  },
  {
    id: 'shift-night',
    name: 'Graveyard Shift',
    code: 'NIGHT',
    startTime: '00:00',
    endTime: '08:30',
    breakMinutes: 60,
    color: '#7c3aed',
    requiredHeadcount: 1,
    description: 'Overnight critical infrastructure and surveillance'
  }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'EMP-1001',
    firstName: 'Alex',
    lastName: 'Chen',
    email: 'alex.chen@vanguard-corp.internal',
    phone: '+1 (555) 234-5678',
    department: 'Engineering',
    designation: 'Principal Systems Architect',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2023-03-15',
    avatarBgColor: '#1e293b',
    assignedShiftId: 'shift-morning',
    ptoBalanceDays: 19,
    compensation: {
      payType: 'Salaried',
      rate: 9800,
      standardHoursPerWeek: 40,
      bankName: 'JPMorgan Chase & Co.',
      accountNumberMasked: '•••• 8412',
      accountNumberRaw: '984028412',
      routingNumberMasked: '•••• 0210',
      taxIdMasked: '•••-••-4891'
    },
    emergencyContact: {
      name: 'Clara Chen',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543'
    },
    notes: 'Primary security administrator and infrastructure on-call lead.'
  },
  {
    id: 'emp-002',
    employeeId: 'EMP-1002',
    firstName: 'Sarah',
    lastName: 'Miller',
    email: 'sarah.miller@vanguard-corp.internal',
    phone: '+1 (555) 345-6789',
    department: 'Operations',
    designation: 'Director of Logistics & Ops',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2022-07-01',
    avatarBgColor: '#0f766e',
    assignedShiftId: 'shift-morning',
    ptoBalanceDays: 14,
    compensation: {
      payType: 'Salaried',
      rate: 8500,
      standardHoursPerWeek: 40,
      bankName: 'Wells Fargo Bank, N.A.',
      accountNumberMasked: '•••• 1923',
      accountNumberRaw: '551021923',
      routingNumberMasked: '•••• 3821',
      taxIdMasked: '•••-••-7120'
    },
    emergencyContact: {
      name: 'David Miller',
      relationship: 'Brother',
      phone: '+1 (555) 876-5432'
    },
    notes: 'Manages facilities, warehouse shifts, and on-premise inventory.'
  },
  {
    id: 'emp-003',
    employeeId: 'EMP-1003',
    firstName: 'Marcus',
    lastName: 'Johnson',
    email: 'marcus.j@vanguard-corp.internal',
    phone: '+1 (555) 456-7890',
    department: 'Finance',
    designation: 'Senior Financial Controller',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2021-11-10',
    avatarBgColor: '#0369a1',
    assignedShiftId: 'shift-midday',
    ptoBalanceDays: 22,
    compensation: {
      payType: 'Salaried',
      rate: 7900,
      standardHoursPerWeek: 40,
      bankName: 'Bank of America',
      accountNumberMasked: '•••• 9401',
      accountNumberRaw: '234919401',
      routingNumberMasked: '•••• 4410',
      taxIdMasked: '•••-••-3319'
    },
    emergencyContact: {
      name: 'Tanya Johnson',
      relationship: 'Spouse',
      phone: '+1 (555) 765-4321'
    },
    notes: 'Oversees payroll runs, tax filings, and treasury reconciliation.'
  },
  {
    id: 'emp-004',
    employeeId: 'EMP-1004',
    firstName: 'Elena',
    lastName: 'Rodriguez',
    email: 'elena.r@vanguard-corp.internal',
    phone: '+1 (555) 567-8901',
    department: 'Human Resources',
    designation: 'People Operations Specialist',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2023-01-20',
    avatarBgColor: '#b45309',
    assignedShiftId: 'shift-morning',
    ptoBalanceDays: 16,
    compensation: {
      payType: 'Salaried',
      rate: 6200,
      standardHoursPerWeek: 40,
      bankName: 'Citibank, N.A.',
      accountNumberMasked: '•••• 6672',
      accountNumberRaw: '782396672',
      routingNumberMasked: '•••• 1209',
      taxIdMasked: '•••-••-9082'
    },
    emergencyContact: {
      name: 'Carmen Rodriguez',
      relationship: 'Mother',
      phone: '+1 (555) 654-3210'
    },
    notes: 'Handles employee onboarding, compliance records, and benefit enrollments.'
  },
  {
    id: 'emp-005',
    employeeId: 'EMP-1005',
    firstName: 'Liam',
    lastName: 'Vanderbilt',
    email: 'liam.v@vanguard-corp.internal',
    phone: '+1 (555) 678-9012',
    department: 'Engineering',
    designation: 'Senior DevOps & Site Reliability',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2023-09-01',
    avatarBgColor: '#475569',
    assignedShiftId: 'shift-night',
    ptoBalanceDays: 12,
    compensation: {
      payType: 'Hourly',
      rate: 55,
      standardHoursPerWeek: 40,
      bankName: 'U.S. Bank',
      accountNumberMasked: '•••• 3098',
      accountNumberRaw: '492013098',
      routingNumberMasked: '•••• 8912',
      taxIdMasked: '•••-••-1124'
    },
    emergencyContact: {
      name: 'Noah Vanderbilt',
      relationship: 'Partner',
      phone: '+1 (555) 543-2109'
    },
    notes: 'Graveyard shift operations monitoring and cluster redundancy.'
  },
  {
    id: 'emp-006',
    employeeId: 'EMP-1006',
    firstName: 'Aaliyah',
    lastName: 'Patel',
    email: 'aaliyah.p@vanguard-corp.internal',
    phone: '+1 (555) 789-0123',
    department: 'Customer Support',
    designation: 'Client Escalations Specialist',
    employmentType: 'Full-time',
    status: 'Active',
    joinDate: '2024-02-14',
    avatarBgColor: '#6d28d9',
    assignedShiftId: 'shift-evening',
    ptoBalanceDays: 15,
    compensation: {
      payType: 'Hourly',
      rate: 34,
      standardHoursPerWeek: 40,
      bankName: 'PNC Bank',
      accountNumberMasked: '•••• 5114',
      accountNumberRaw: '831095114',
      routingNumberMasked: '•••• 7731',
      taxIdMasked: '•••-••-6231'
    },
    emergencyContact: {
      name: 'Rajesh Patel',
      relationship: 'Father',
      phone: '+1 (555) 432-1098'
    },
    notes: 'Handles high-priority tier-3 VIP accounts and SLA tracking.'
  },
  {
    id: 'emp-007',
    employeeId: 'EMP-1007',
    firstName: 'Devon',
    lastName: 'Kowalski',
    email: 'devon.k@vanguard-corp.internal',
    phone: '+1 (555) 890-1234',
    department: 'Operations',
    designation: 'Warehouse Shift Supervisor',
    employmentType: 'Full-time',
    status: 'On Leave',
    joinDate: '2022-04-18',
    avatarBgColor: '#4338ca',
    assignedShiftId: 'shift-morning',
    ptoBalanceDays: 8,
    compensation: {
      payType: 'Hourly',
      rate: 38,
      standardHoursPerWeek: 40,
      bankName: 'Capital One',
      accountNumberMasked: '•••• 7741',
      accountNumberRaw: '390127741',
      routingNumberMasked: '•••• 5501',
      taxIdMasked: '•••-••-8840'
    },
    emergencyContact: {
      name: 'Marta Kowalski',
      relationship: 'Spouse',
      phone: '+1 (555) 321-0987'
    },
    notes: 'On scheduled parental leave through next Monday.'
  },
  {
    id: 'emp-008',
    employeeId: 'EMP-1008',
    firstName: 'Chloe',
    lastName: 'Dupont',
    email: 'chloe.d@vanguard-corp.internal',
    phone: '+1 (555) 901-2345',
    department: 'Sales & Marketing',
    designation: 'Enterprise Account Executive',
    employmentType: 'Contract',
    status: 'Active',
    joinDate: '2024-05-01',
    avatarBgColor: '#059669',
    assignedShiftId: 'shift-midday',
    ptoBalanceDays: 0,
    compensation: {
      payType: 'Hourly',
      rate: 65,
      standardHoursPerWeek: 35,
      bankName: 'Silicon Valley Bank / First Citizens',
      accountNumberMasked: '•••• 2380',
      accountNumberRaw: '904512380',
      routingNumberMasked: '•••• 9104',
      taxIdMasked: '•••-••-5599'
    },
    emergencyContact: {
      name: 'Jean Dupont',
      relationship: 'Brother',
      phone: '+1 (555) 210-9876'
    },
    notes: 'Mid-market and enterprise enterprise software conversions.'
  }
];

export const generateInitialShiftAssignments = (): ShiftAssignment[] => {
  const dates = ['2026-10-12', '2026-10-13', '2026-10-14', '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'];
  const assignments: ShiftAssignment[] = [];

  INITIAL_EMPLOYEES.forEach((emp) => {
    dates.forEach((date, i) => {
      if (i < 5 && emp.status === 'Active') {
        assignments.push({
          id: `asg-${emp.id}-${date}`,
          employeeId: emp.id,
          shiftTemplateId: emp.assignedShiftId,
          date,
          status: 'Scheduled',
          notes: i === 0 ? 'Confirmed by supervisor' : undefined
        });
      } else if (emp.status === 'On Leave' && i < 5) {
        assignments.push({
          id: `asg-${emp.id}-${date}`,
          employeeId: emp.id,
          shiftTemplateId: emp.assignedShiftId,
          date,
          status: 'Cancelled',
          notes: 'Approved medical/parental leave'
        });
      }
    });
  });

  return assignments;
};

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-101',
    employeeId: 'emp-001',
    date: '2026-10-12',
    clockIn: '2026-10-12T07:54:12.000Z',
    breaks: [{ start: '2026-10-12T12:00:00.000Z', end: '2026-10-12T12:45:00.000Z', durationMinutes: 45 }],
    regularHours: 8.0,
    overtimeHours: 0.5,
    totalHours: 8.5,
    status: 'On-Time',
    location: {
      verified: true,
      ipAddress: '192.168.10.42 (HQ VPN)',
      geofenceLocation: 'HQ Tech Campus - Building A',
      latitude: 37.7749,
      longitude: -122.4194,
      distanceMeters: 14
    },
    biometricVerified: true,
    notes: 'Architecture sync and security audit review',
    managerApproved: true
  },
  {
    id: 'att-102',
    employeeId: 'emp-002',
    date: '2026-10-12',
    clockIn: '2026-10-12T08:14:30.000Z',
    breaks: [],
    regularHours: 7.75,
    overtimeHours: 0.0,
    totalHours: 7.75,
    status: 'Late',
    location: {
      verified: true,
      ipAddress: '192.168.10.88 (HQ WiFi 6E)',
      geofenceLocation: 'HQ Operations Hub',
      latitude: 37.7751,
      longitude: -122.4192,
      distanceMeters: 28
    },
    biometricVerified: true,
    notes: 'Transit delay noted and acknowledged',
    managerApproved: true
  },
  {
    id: 'att-103',
    employeeId: 'emp-003',
    date: '2026-10-12',
    clockIn: '2026-10-12T09:58:04.000Z',
    breaks: [{ start: '2026-10-12T13:00:00.000Z', end: '2026-10-12T13:50:00.000Z', durationMinutes: 50 }],
    regularHours: 8.0,
    overtimeHours: 1.25,
    totalHours: 9.25,
    status: 'Overtime',
    location: {
      verified: true,
      ipAddress: '192.168.10.15 (HQ Finance Floor)',
      geofenceLocation: 'Executive Suite - Floor 4',
      latitude: 37.7748,
      longitude: -122.4195,
      distanceMeters: 9
    },
    biometricVerified: true,
    notes: 'Q3 closing books & tax reconciliation',
    managerApproved: true
  },
  {
    id: 'att-104',
    employeeId: 'emp-004',
    date: '2026-10-12',
    clockIn: '2026-10-12T07:58:22.000Z',
    breaks: [],
    regularHours: 8.0,
    overtimeHours: 0.0,
    totalHours: 8.0,
    status: 'On-Time',
    location: {
      verified: true,
      ipAddress: '192.168.10.99 (HQ HR Wing)',
      geofenceLocation: 'HR & People Operations Suite',
      latitude: 37.7749,
      longitude: -122.4193,
      distanceMeters: 18
    },
    biometricVerified: true,
    notes: 'New hire onboarding program kickoff',
    managerApproved: true
  },
  {
    id: 'att-105',
    employeeId: 'emp-005',
    date: '2026-10-12',
    clockIn: '2026-10-12T00:02:18.000Z',
    clockOut: '2026-10-12T08:35:00.000Z',
    breaks: [{ start: '2026-10-12T04:00:00.000Z', end: '2026-10-12T04:45:00.000Z', durationMinutes: 45 }],
    regularHours: 8.0,
    overtimeHours: 0.0,
    totalHours: 8.0,
    status: 'On-Time',
    location: {
      verified: true,
      ipAddress: '10.0.4.120 (DC Server Room)',
      geofenceLocation: 'Data Center Primary Facility',
      latitude: 37.7746,
      longitude: -122.4199,
      distanceMeters: 35
    },
    biometricVerified: true,
    notes: 'Night shift hardware swap completed smoothly',
    managerApproved: true
  },
  {
    id: 'att-106',
    employeeId: 'emp-006',
    date: '2026-10-12',
    clockIn: '2026-10-12T15:55:10.000Z',
    breaks: [],
    regularHours: 8.0,
    overtimeHours: 0.0,
    totalHours: 8.0,
    status: 'On-Time',
    location: {
      verified: true,
      ipAddress: '192.168.20.104 (Support Pod 3)',
      geofenceLocation: 'Customer Experience Center',
      latitude: 37.7750,
      longitude: -122.4191,
      distanceMeters: 22
    },
    biometricVerified: true,
    notes: 'Coverage for EMEA client escalations',
    managerApproved: true
  },
  {
    id: 'att-107',
    employeeId: 'emp-008',
    date: '2026-10-12',
    clockIn: '2026-10-12T09:45:10.000Z',
    breaks: [{ start: '2026-10-12T13:00:00.000Z', end: '2026-10-12T13:30:00.000Z', durationMinutes: 30 }],
    regularHours: 7.0,
    overtimeHours: 0.0,
    totalHours: 7.0,
    status: 'On-Time',
    location: {
      verified: true,
      ipAddress: '172.16.4.12 (Remote Secure Access)',
      geofenceLocation: 'Enterprise Client Site - Downtown',
      latitude: 37.7833,
      longitude: -122.4167,
      distanceMeters: 980
    },
    biometricVerified: true,
    notes: 'On-site enterprise client proposal demonstration',
    managerApproved: true
  }
];

export const INITIAL_PAYROLL_CYCLES: PayrollCycle[] = [
  {
    id: 'pay-2026-10',
    title: 'October 2026 (Monthly Standard)',
    startDate: '2026-10-01',
    endDate: '2026-10-31',
    payDate: '2026-10-31',
    status: 'Under Review',
    taxRatePercent: 16,
    totalGross: 52180,
    totalNet: 40178.6,
    totalTaxes: 8348.8,
    entries: [
      {
        id: 'pe-001',
        employeeId: 'emp-001',
        regularHours: 160,
        regularEarnings: 9800,
        overtimeHours: 4,
        overtimeEarnings: 367.5,
        bonuses: [{ id: 'b1', description: 'Lead Architect Merit Allowance', amount: 500 }],
        deductions: [],
        grossPay: 10667.5,
        taxWithholding: 1706.8,
        medicalInsurance: 320,
        retirementContribution: 426.7,
        netPay: 8214.0,
        paymentMethod: 'Direct Deposit',
        status: 'Approved',
        transactionRef: 'ACH-202610-8401'
      },
      {
        id: 'pe-002',
        employeeId: 'emp-002',
        regularHours: 160,
        regularEarnings: 8500,
        overtimeHours: 0,
        overtimeEarnings: 0,
        bonuses: [{ id: 'b2', description: 'Operations Safety Bonus', amount: 250 }],
        deductions: [],
        grossPay: 8750,
        taxWithholding: 1400,
        medicalInsurance: 320,
        retirementContribution: 350,
        netPay: 6680,
        paymentMethod: 'Direct Deposit',
        status: 'Approved',
        transactionRef: 'ACH-202610-8402'
      },
      {
        id: 'pe-003',
        employeeId: 'emp-003',
        regularHours: 160,
        regularEarnings: 7900,
        overtimeHours: 6,
        overtimeEarnings: 444.38,
        bonuses: [],
        deductions: [],
        grossPay: 8344.38,
        taxWithholding: 1335.1,
        medicalInsurance: 320,
        retirementContribution: 333.78,
        netPay: 6355.5,
        paymentMethod: 'Direct Deposit',
        status: 'Approved',
        transactionRef: 'ACH-202610-8403'
      },
      {
        id: 'pe-004',
        employeeId: 'emp-004',
        regularHours: 160,
        regularEarnings: 6200,
        overtimeHours: 0,
        overtimeEarnings: 0,
        bonuses: [],
        deductions: [],
        grossPay: 6200,
        taxWithholding: 992,
        medicalInsurance: 280,
        retirementContribution: 248,
        netPay: 4680,
        paymentMethod: 'Direct Deposit',
        status: 'Approved',
        transactionRef: 'ACH-202610-8404'
      },
      {
        id: 'pe-005',
        employeeId: 'emp-005',
        regularHours: 160,
        regularEarnings: 8800,
        overtimeHours: 8,
        overtimeEarnings: 660,
        bonuses: [{ id: 'b3', description: 'Graveyard Shift Differential ($4/hr)', amount: 640 }],
        deductions: [],
        grossPay: 10100,
        taxWithholding: 1616,
        medicalInsurance: 320,
        retirementContribution: 404,
        netPay: 7760,
        paymentMethod: 'Direct Deposit',
        status: 'Draft'
      },
      {
        id: 'pe-006',
        employeeId: 'emp-006',
        regularHours: 160,
        regularEarnings: 5440,
        overtimeHours: 2,
        overtimeEarnings: 102,
        bonuses: [],
        deductions: [],
        grossPay: 5542,
        taxWithholding: 886.72,
        medicalInsurance: 260,
        retirementContribution: 221.68,
        netPay: 4173.6,
        paymentMethod: 'Direct Deposit',
        status: 'Draft'
      },
      {
        id: 'pe-008',
        employeeId: 'emp-008',
        regularHours: 140,
        regularEarnings: 9100,
        overtimeHours: 0,
        overtimeEarnings: 0,
        bonuses: [{ id: 'b4', description: 'Commission Milestone - Enterprise Deal', amount: 1500 }],
        deductions: [{ id: 'd1', description: 'Contractor Technology Withholding', amount: 120 }],
        grossPay: 10480,
        taxWithholding: 1676.8,
        medicalInsurance: 0,
        retirementContribution: 0,
        netPay: 8683.2,
        paymentMethod: 'Bank Wire',
        status: 'Draft'
      }
    ]
  }
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'emp-007',
    leaveType: 'Parental',
    startDate: '2026-10-10',
    endDate: '2026-10-19',
    daysCount: 7,
    reason: 'Scheduled parental leave for newborn welcoming',
    status: 'Approved',
    submittedAt: '2026-10-01T10:00:00.000Z',
    reviewedBy: 'Elena Rodriguez (HR)'
  },
  {
    id: 'leave-002',
    employeeId: 'emp-006',
    leaveType: 'Paid Time Off (PTO)',
    startDate: '2026-10-23',
    endDate: '2026-10-24',
    daysCount: 2,
    reason: 'Family anniversary travel & rest',
    status: 'Pending',
    submittedAt: '2026-10-11T14:30:00.000Z'
  }
];

export const INITIAL_SWAP_REQUESTS: ShiftSwapRequest[] = [
  {
    id: 'swap-001',
    requesterId: 'emp-006',
    targetEmployeeId: 'emp-003',
    date: '2026-10-16',
    reason: 'Dentist appointment during early morning hours',
    status: 'Pending',
    createdAt: '2026-10-12T08:30:00.000Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-12T10:45:00.000Z',
    actor: 'Alex Chen (Admin)',
    actorRole: 'Admin',
    action: 'PAYROLL_REVIEW_STARTED',
    category: 'PAYROLL',
    details: 'Initiated monthly review cycle for October 2026. 7 entries pending authorization.',
    ipAddress: '192.168.10.42'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-12T09:15:22.000Z',
    actor: 'Marcus Johnson (Supervisor)',
    actorRole: 'Supervisor',
    action: 'ATTENDANCE_OVERRIDE_APPROVED',
    category: 'ATTENDANCE',
    details: 'Approved transit delay late flag for Sarah Miller (EMP-1002).',
    ipAddress: '192.168.10.15'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-12T08:00:10.000Z',
    actor: 'Elena Rodriguez (HR)',
    actorRole: 'Admin',
    action: 'SHIFT_ROSTER_SYNCED',
    category: 'SHIFT',
    details: 'Published week 42 shift roster with 32 assigned slots across 4 shift tiers.',
    ipAddress: '192.168.10.99'
  },
  {
    id: 'log-004',
    timestamp: '2026-10-11T18:20:00.000Z',
    actor: 'Security Daemon',
    actorRole: 'Admin',
    action: 'ENCRYPTED_PIN_POLICY_ENFORCED',
    category: 'SECURITY',
    details: 'Automatic biometric / PIN inactivity lock policy set to 15 minutes. Session protected.',
    ipAddress: '127.0.0.1'
  }
];
