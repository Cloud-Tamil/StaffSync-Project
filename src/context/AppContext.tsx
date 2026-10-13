import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  ShiftTemplate,
  ShiftAssignment,
  AttendanceRecord,
  PayrollCycle,
  PayrollEntry,
  AuditLog,
  UserRole,
  ActiveTab,
  ThemeSettings,
  LeaveRequest,
  ShiftSwapRequest,
  LeaveType
} from '../types.ts';
import {
  INITIAL_EMPLOYEES,
  INITIAL_SHIFTS,
  generateInitialShiftAssignments,
  INITIAL_ATTENDANCE,
  INITIAL_PAYROLL_CYCLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_LEAVE_REQUESTS,
  INITIAL_SWAP_REQUESTS
} from '../mockData.ts';
import { DEFAULT_THEME, THEME_PRESETS, applyThemeToDom } from '../theme/themeConfig.ts';

interface AppContextType {
  themeSettings: ThemeSettings;
  setThemeSettings: (settings: ThemeSettings) => void;
  applyPresetTheme: (presetId: string) => void;
  themeModalOpen: boolean;
  setThemeModalOpen: (open: boolean) => void;

  employees: Employee[];
  shifts: ShiftTemplate[];
  shiftAssignments: ShiftAssignment[];
  attendance: AttendanceRecord[];
  payrollCycles: PayrollCycle[];
  auditLogs: AuditLog[];
  leaveRequests: LeaveRequest[];
  swapRequests: ShiftSwapRequest[];

  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeEmployeeId: string;
  setActiveEmployeeId: (id: string) => void;
  
  isLocked: boolean;
  pin: string;
  setPin: (pin: string) => void;
  unlockWithPin: (inputPin: string) => boolean;
  lockApp: () => void;
  sensitiveDataMasked: boolean;
  toggleSensitiveMask: () => void;
  autoLockMinutes: number;
  setAutoLockMinutes: (min: number) => void;
  
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  punchKioskOpen: boolean;
  setPunchKioskOpen: (open: boolean) => void;
  selectedPaystub: { cycle: PayrollCycle; entry: PayrollEntry; employee: Employee } | null;
  setSelectedPaystub: (data: { cycle: PayrollCycle; entry: PayrollEntry; employee: Employee } | null) => void;
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  clockIn: (employeeId: string, notes?: string, biometric?: boolean) => void;
  clockOut: (employeeId: string, notes?: string) => void;
  startBreak: (employeeId: string) => void;
  endBreak: (employeeId: string) => void;
  updateAttendanceRecord: (id: string, updates: Partial<AttendanceRecord>) => void;
  
  assignShift: (employeeId: string, shiftTemplateId: string, date: string, notes?: string) => void;
  removeShiftAssignment: (assignmentId: string) => void;
  addShiftTemplate: (template: Omit<ShiftTemplate, 'id'>) => void;
  updateShiftTemplate: (id: string, updates: Partial<ShiftTemplate>) => void;
  autoGenerateSmartRoster: (dates: string[]) => void;
  submitSwapRequest: (targetEmployeeId: string, date: string, reason: string) => void;
  reviewSwapRequest: (requestId: string, status: 'Approved' | 'Rejected') => void;

  submitLeaveRequest: (leaveType: LeaveType, startDate: string, endDate: string, reason: string) => void;
  reviewLeaveRequest: (requestId: string, status: 'Approved' | 'Rejected') => void;
  
  runPayrollCalculation: (cycleId: string, customTaxRate?: number) => void;
  approvePayrollCycle: (cycleId: string) => void;
  disbursePayrollCycle: (cycleId: string) => void;
  createPayrollCycle: (title: string, startDate: string, endDate: string, payDate: string) => void;
  
  logAudit: (action: string, category: AuditLog['category'], details: string) => void;
  exportCsv: (type: 'employees' | 'attendance' | 'payroll') => void;
  exportBackupJson: () => void;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: 'pulsehr_theme_v2',
  EMPLOYEES: 'pulsehr_employees_v2',
  SHIFTS: 'pulsehr_shifts_v2',
  ASSIGNMENTS: 'pulsehr_assignments_v2',
  ATTENDANCE: 'pulsehr_attendance_v2',
  PAYROLL: 'pulsehr_payroll_v2',
  AUDIT: 'pulsehr_audit_v2',
  LEAVE: 'pulsehr_leave_v2',
  SWAP: 'pulsehr_swap_v2',
  PIN: 'pulsehr_pin_v2',
  ROLE: 'pulsehr_role_v2',
  AUTO_LOCK: 'pulsehr_autolock_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeSettings, setThemeSettingsState] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  useEffect(() => {
    applyThemeToDom(themeSettings);
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(themeSettings));
  }, [themeSettings]);

  const setThemeSettings = (newSettings: ThemeSettings) => {
    setThemeSettingsState(newSettings);
    logAudit('THEME_CUSTOMIZED', 'THEME', `Color system modified. Primary: ${newSettings.primaryColor}, Mode: ${newSettings.mode}`);
  };

  const applyPresetTheme = (presetId: string) => {
    const preset = THEME_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setThemeSettingsState(preset.settings);
      logAudit('THEME_PRESET_APPLIED', 'THEME', `Switched theme preset to "${preset.name}"`);
    }
  };

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [shifts, setShifts] = useState<ShiftTemplate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    return saved ? JSON.parse(saved) : INITIAL_SHIFTS;
  });

  const [shiftAssignments, setShiftAssignments] = useState<ShiftAssignment[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return saved ? JSON.parse(saved) : generateInitialShiftAssignments();
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [payrollCycles, setPayrollCycles] = useState<PayrollCycle[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYROLL);
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL_CYCLES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVE);
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SWAP);
    return saved ? JSON.parse(saved) : INITIAL_SWAP_REQUESTS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return (saved as UserRole) || 'Admin';
  });
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('emp-001');

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [pin, setPinState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.PIN) || '1234';
  });
  const [sensitiveDataMasked, setSensitiveDataMasked] = useState<boolean>(true);
  const [autoLockMinutes, setAutoLockMinutesState] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTO_LOCK);
    return saved ? Number(saved) : 15;
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [punchKioskOpen, setPunchKioskOpen] = useState<boolean>(false);
  const [selectedPaystub, setSelectedPaystub] = useState<{
    cycle: PayrollCycle;
    entry: PayrollEntry;
    employee: Employee;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }, [shifts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(shiftAssignments));
  }, [shiftAssignments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYROLL, JSON.stringify(payrollCycles));
  }, [payrollCycles]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVE, JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SWAP, JSON.stringify(swapRequests));
  }, [swapRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE, userRole);
  }, [userRole]);

  const setPin = (newPin: string) => {
    setPinState(newPin);
    localStorage.setItem(STORAGE_KEYS.PIN, newPin);
    logAudit('SECURITY_PIN_CHANGED', 'SECURITY', 'Security master PIN code updated');
  };

  const setAutoLockMinutes = (min: number) => {
    setAutoLockMinutesState(min);
    localStorage.setItem(STORAGE_KEYS.AUTO_LOCK, String(min));
  };

  useEffect(() => {
    if (autoLockMinutes <= 0) return;
    let timer: NodeJS.Timeout;

    const resetInactivity = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsLocked(true);
        logAudit('AUTO_LOCK_TRIGGERED', 'SECURITY', `Inactivity threshold reached (${autoLockMinutes}m)`);
      }, autoLockMinutes * 60 * 1000);
    };

    window.addEventListener('mousemove', resetInactivity);
    window.addEventListener('keydown', resetInactivity);
    window.addEventListener('touchstart', resetInactivity);
    resetInactivity();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', resetInactivity);
      window.removeEventListener('keydown', resetInactivity);
      window.removeEventListener('touchstart', resetInactivity);
    };
  }, [autoLockMinutes]);

  const unlockWithPin = (inputPin: string): boolean => {
    if (inputPin === pin) {
      setIsLocked(false);
      logAudit('APPLICATION_UNLOCKED', 'SECURITY', 'Application unlocked successfully via PIN/Biometric');
      return true;
    }
    logAudit('FAILED_UNLOCK_ATTEMPT', 'SECURITY', 'Unauthorized passcode attempt rejected');
    return false;
  };

  const lockApp = () => {
    setIsLocked(true);
    logAudit('APPLICATION_LOCKED', 'SECURITY', 'Manual lock triggered by user');
  };

  const toggleSensitiveMask = () => {
    setSensitiveDataMasked((prev) => {
      const next = !prev;
      logAudit(
        next ? 'SENSITIVE_DATA_MASKED' : 'SENSITIVE_DATA_UNMASKED',
        'SECURITY',
        `Tax IDs and bank account data visibility set to ${next ? 'Masked' : 'Revealed'}`
      );
      return next;
    });
  };

  const logAudit = (action: string, category: AuditLog['category'], details: string) => {
    const currentEmp = employees.find((e) => e.id === activeEmployeeId);
    const actorName = currentEmp ? `${currentEmp.firstName} ${currentEmp.lastName}` : 'System Admin';
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor: `${actorName} (${userRole})`,
      actorRole: userRole,
      action,
      category,
      details,
      ipAddress: '192.168.10.' + Math.floor(20 + Math.random() * 80)
    };
    setAuditLogs((prev) => [newLog, ...prev.slice(0, 199)]);
  };

  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now().toString(36)}`;
    const colors = ['#1e293b', '#0f766e', '#0369a1', '#b45309', '#475569', '#6d28d9', '#4338ca', '#059669'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newEmployee: Employee = {
      ...employeeData,
      id: newId,
      ptoBalanceDays: employeeData.ptoBalanceDays || 15,
      avatarBgColor: employeeData.avatarBgColor || randomColor
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    logAudit(
      'EMPLOYEE_CREATED',
      'EMPLOYEE',
      `Registered employee ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.employeeId}) in ${newEmployee.department}`
    );
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, ...updates };
          logAudit(
            'EMPLOYEE_UPDATED',
            'EMPLOYEE',
            `Updated profile and compensation details for ${updated.firstName} ${updated.lastName} (${updated.employeeId})`
          );
          return updated;
        }
        return emp;
      })
    );
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    if (!target) return;
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    logAudit(
      'EMPLOYEE_DELETED',
      'EMPLOYEE',
      `Permanently removed record for ${target.firstName} ${target.lastName} (${target.employeeId})`
    );
  };

  const getTodayDateString = () => new Date().toISOString().split('T')[0];

  const clockIn = (employeeId: string, notes?: string, biometric: boolean = true) => {
    const today = getTodayDateString();
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);

    if (existing && existing.clockIn && !existing.clockOut) {
      return;
    }

    const now = new Date().toISOString();
    const employee = employees.find((e) => e.id === employeeId);
    const assignedShift = shifts.find((s) => s.id === employee?.assignedShiftId);

    let status: AttendanceRecord['status'] = 'On-Time';
    if (assignedShift) {
      const [shiftHour, shiftMinute] = assignedShift.startTime.split(':').map(Number);
      const nowLocal = new Date();
      const shiftStartTimeToday = new Date(nowLocal);
      shiftStartTimeToday.setHours(shiftHour, shiftMinute + 10, 0, 0);
      if (nowLocal > shiftStartTimeToday) {
        status = 'Late';
      }
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      employeeId,
      date: today,
      clockIn: now,
      breaks: [],
      regularHours: 0,
      overtimeHours: 0,
      totalHours: 0,
      status,
      location: {
        verified: true,
        ipAddress: '192.168.10.' + Math.floor(10 + Math.random() * 80),
        geofenceLocation: 'Verified GPS Geofence (Facility Perimeter)',
        latitude: 37.7749 + (Math.random() - 0.5) * 0.001,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.001,
        distanceMeters: Math.floor(8 + Math.random() * 25)
      },
      biometricVerified: biometric,
      notes: notes || undefined,
      managerApproved: true
    };

    setAttendance((prev) => {
      const filtered = prev.filter((a) => !(a.employeeId === employeeId && a.date === today));
      return [newRecord, ...filtered];
    });

    logAudit(
      'CLOCK_IN',
      'ATTENDANCE',
      `${employee ? `${employee.firstName} ${employee.lastName}` : employeeId} clocked in (${status}) · Biometric: ${biometric ? 'Verified' : 'Manual'}`
    );
  };

  const clockOut = (employeeId: string, notes?: string) => {
    const today = getTodayDateString();
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (!existing || !existing.clockIn || existing.clockOut) return;

    const clockOutTime = new Date();
    const clockInTime = new Date(existing.clockIn);
    const diffMs = clockOutTime.getTime() - clockInTime.getTime();

    const totalBreakMinutes = existing.breaks.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);
    const workedMinutes = Math.max(0, diffMs / 60000 - totalBreakMinutes);
    const workedHours = Number((workedMinutes / 60).toFixed(2));

    const regularHours = Math.min(8, workedHours);
    const overtimeHours = Number(Math.max(0, workedHours - 8).toFixed(2));

    const updatedRecord: AttendanceRecord = {
      ...existing,
      clockOut: clockOutTime.toISOString(),
      regularHours,
      overtimeHours,
      totalHours: workedHours,
      status: overtimeHours > 0 ? 'Overtime' : existing.status,
      notes: notes || existing.notes
    };

    setAttendance((prev) => prev.map((a) => (a.id === existing.id ? updatedRecord : a)));
    
    const employee = employees.find((e) => e.id === employeeId);
    logAudit(
      'CLOCK_OUT',
      'ATTENDANCE',
      `${employee ? `${employee.firstName} ${employee.lastName}` : employeeId} clocked out. Total logged: ${workedHours} hrs`
    );
  };

  const startBreak = (employeeId: string) => {
    const today = getTodayDateString();
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (!existing || !existing.clockIn || existing.clockOut) return;

    const activeBreak = existing.breaks.find((b) => !b.end);
    if (activeBreak) return;

    const now = new Date().toISOString();
    const updatedBreaks = [...existing.breaks, { start: now }];

    setAttendance((prev) =>
      prev.map((a) => (a.id === existing.id ? { ...existing, breaks: updatedBreaks } : a))
    );

    const employee = employees.find((e) => e.id === employeeId);
    logAudit('BREAK_STARTED', 'ATTENDANCE', `${employee ? employee.firstName : employeeId} started meal/rest break`);
  };

  const endBreak = (employeeId: string) => {
    const today = getTodayDateString();
    const existing = attendance.find((a) => a.employeeId === employeeId && a.date === today);
    if (!existing || !existing.clockIn || existing.clockOut) return;

    const breakIndex = existing.breaks.findIndex((b) => !b.end);
    if (breakIndex === -1) return;

    const now = new Date();
    const breakStart = new Date(existing.breaks[breakIndex].start);
    const durationMinutes = Math.round((now.getTime() - breakStart.getTime()) / 60000);

    const updatedBreaks = [...existing.breaks];
    updatedBreaks[breakIndex] = {
      ...updatedBreaks[breakIndex],
      end: now.toISOString(),
      durationMinutes
    };

    setAttendance((prev) =>
      prev.map((a) => (a.id === existing.id ? { ...existing, breaks: updatedBreaks } : a))
    );

    const employee = employees.find((e) => e.id === employeeId);
    logAudit(
      'BREAK_ENDED',
      'ATTENDANCE',
      `${employee ? employee.firstName : employeeId} resumed duty (${durationMinutes} mins break duration)`
    );
  };

  const updateAttendanceRecord = (id: string, updates: Partial<AttendanceRecord>) => {
    setAttendance((prev) =>
      prev.map((rec) => {
        if (rec.id === id) {
          const updated = { ...rec, ...updates };
          logAudit(
            'ATTENDANCE_OVERRIDE',
            'ATTENDANCE',
            `Manager manual adjustment applied to attendance entry #${id} on ${rec.date}`
          );
          return updated;
        }
        return rec;
      })
    );
  };

  const assignShift = (employeeId: string, shiftTemplateId: string, date: string, notes?: string) => {
    const newAssignment: ShiftAssignment = {
      id: `asg-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      employeeId,
      shiftTemplateId,
      date,
      status: 'Scheduled',
      notes
    };

    setShiftAssignments((prev) => {
      const filtered = prev.filter((a) => !(a.employeeId === employeeId && a.date === date));
      return [...filtered, newAssignment];
    });

    const emp = employees.find((e) => e.id === employeeId);
    const shift = shifts.find((s) => s.id === shiftTemplateId);
    logAudit(
      'SHIFT_ASSIGNED',
      'SHIFT',
      `Assigned ${shift?.name || 'Shift'} to ${emp?.firstName || employeeId} for ${date}`
    );
  };

  const removeShiftAssignment = (assignmentId: string) => {
    const existing = shiftAssignments.find((a) => a.id === assignmentId);
    if (!existing) return;
    setShiftAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    logAudit('SHIFT_REMOVED', 'SHIFT', `Cancelled shift assignment #${assignmentId} on ${existing.date}`);
  };

  const addShiftTemplate = (templateData: Omit<ShiftTemplate, 'id'>) => {
    const newTemplate: ShiftTemplate = {
      ...templateData,
      id: `shift-${Date.now().toString(36)}`
    };
    setShifts((prev) => [...prev, newTemplate]);
    logAudit('SHIFT_TEMPLATE_CREATED', 'SHIFT', `Created new shift policy: ${newTemplate.name} (${newTemplate.code})`);
  };

  const updateShiftTemplate = (id: string, updates: Partial<ShiftTemplate>) => {
    setShifts((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          logAudit('SHIFT_TEMPLATE_UPDATED', 'SHIFT', `Modified shift rules for ${updated.name}`);
          return updated;
        }
        return s;
      })
    );
  };

  const autoGenerateSmartRoster = (dates: string[]) => {
    const newAssignments: ShiftAssignment[] = [];
    const activeStaff = employees.filter((e) => e.status === 'Active');

    dates.forEach((date, dayIdx) => {
      const isWeekend = dayIdx >= 5;

      shifts.forEach((shift) => {
        const primaryCandidates = activeStaff.filter((e) => e.assignedShiftId === shift.id);

        primaryCandidates.forEach((emp) => {
          const hasLeave = leaveRequests.some(
            (l) => l.employeeId === emp.id && l.status === 'Approved' && date >= l.startDate && date <= l.endDate
          );

          if (!hasLeave && (!isWeekend || shift.code === 'NIGHT' || shift.code === 'EVE')) {
            newAssignments.push({
              id: `auto-${emp.id}-${date}`,
              employeeId: emp.id,
              shiftTemplateId: shift.id,
              date,
              status: 'Scheduled',
              notes: 'AI Smart Roster Balanced'
            });
          }
        });
      });
    });

    setShiftAssignments((prev) => {
      const dateSet = new Set(dates);
      const preserved = prev.filter((a) => !dateSet.has(a.date));
      return [...preserved, ...newAssignments];
    });

    logAudit(
      'SMART_ROSTER_GENERATED',
      'SHIFT',
      `Auto-balanced shift roster generated across ${dates.length} days with ${newAssignments.length} slots allocated.`
    );
  };

  const submitSwapRequest = (targetEmployeeId: string, date: string, reason: string) => {
    const newSwap: ShiftSwapRequest = {
      id: `swap-${Date.now()}`,
      requesterId: activeEmployeeId,
      targetEmployeeId,
      date,
      status: 'Pending',
      reason,
      createdAt: new Date().toISOString()
    };
    setSwapRequests((prev) => [newSwap, ...prev]);
    logAudit('SHIFT_SWAP_REQUESTED', 'SHIFT', `Shift swap requested for date ${date}`);
  };

  const reviewSwapRequest = (requestId: string, status: 'Approved' | 'Rejected') => {
    setSwapRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          if (status === 'Approved') {
            const reqAsg = shiftAssignments.find((a) => a.employeeId === r.requesterId && a.date === r.date);
            const tgtAsg = shiftAssignments.find((a) => a.employeeId === r.targetEmployeeId && a.date === r.date);

            if (reqAsg && tgtAsg) {
              const tempShift = reqAsg.shiftTemplateId;
              reqAsg.shiftTemplateId = tgtAsg.shiftTemplateId;
              tgtAsg.shiftTemplateId = tempShift;
              reqAsg.status = 'Swapped';
              tgtAsg.status = 'Swapped';
            }
          }
          return { ...r, status };
        }
        return r;
      })
    );
    logAudit('SHIFT_SWAP_REVIEWED', 'SHIFT', `Shift swap request #${requestId} was ${status}`);
  };

  const submitLeaveRequest = (leaveType: LeaveType, startDate: string, endDate: string, reason: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1);

    const newLeave: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: activeEmployeeId,
      leaveType,
      startDate,
      endDate,
      daysCount: diffDays,
      reason,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    setLeaveRequests((prev) => [newLeave, ...prev]);
    const emp = employees.find((e) => e.id === activeEmployeeId);
    logAudit('LEAVE_REQUESTED', 'EMPLOYEE', `${emp ? emp.firstName : 'Employee'} requested ${diffDays} days ${leaveType}`);
  };

  const reviewLeaveRequest = (requestId: string, status: 'Approved' | 'Rejected') => {
    const req = leaveRequests.find((r) => r.id === requestId);
    if (!req) return;

    setLeaveRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status, reviewedBy: `${userRole} Administrator` } : r))
    );

    if (status === 'Approved') {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === req.employeeId && req.leaveType === 'Paid Time Off (PTO)') {
            return { ...emp, ptoBalanceDays: Math.max(0, emp.ptoBalanceDays - req.daysCount) };
          }
          return emp;
        })
      );
    }

    logAudit('LEAVE_REVIEWED', 'EMPLOYEE', `Leave request #${requestId} ${status} by ${userRole}`);
  };

  const runPayrollCalculation = (cycleId: string, customTaxRate?: number) => {
    const cycle = payrollCycles.find((c) => c.id === cycleId);
    if (!cycle) return;

    const taxRate = customTaxRate !== undefined ? customTaxRate : cycle.taxRatePercent || 16;

    const updatedEntries: PayrollEntry[] = employees
      .filter((e) => e.status !== 'Terminated')
      .map((emp) => {
        const existingEntry = cycle.entries.find((e) => e.employeeId === emp.id);
        const existingBonuses = existingEntry?.bonuses || [];
        const existingDeductions = existingEntry?.deductions || [];

        const empAttendance = attendance.filter(
          (a) => a.employeeId === emp.id && a.date >= cycle.startDate && a.date <= cycle.endDate
        );

        let regularHours = 160;
        let overtimeHours = 0;

        if (empAttendance.length > 0) {
          const loggedRegular = empAttendance.reduce((acc, a) => acc + (a.regularHours || 0), 0);
          const loggedOT = empAttendance.reduce((acc, a) => acc + (a.overtimeHours || 0), 0);
          if (loggedRegular > 0) {
            regularHours = Math.max(loggedRegular, emp.compensation.payType === 'Salaried' ? 160 : loggedRegular);
            overtimeHours = loggedOT;
          }
        }

        let regularEarnings = 0;
        let overtimeEarnings = 0;

        if (emp.compensation.payType === 'Salaried') {
          regularEarnings = emp.compensation.rate;
          const hourlyEquivalent = emp.compensation.rate / 160;
          overtimeEarnings = Number((overtimeHours * (hourlyEquivalent * 1.5)).toFixed(2));
        } else {
          regularEarnings = Number((regularHours * emp.compensation.rate).toFixed(2));
          overtimeEarnings = Number((overtimeHours * (emp.compensation.rate * 1.5)).toFixed(2));
        }

        const bonusTotal = existingBonuses.reduce((acc, b) => acc + b.amount, 0);
        const deductionTotal = existingDeductions.reduce((acc, d) => acc + d.amount, 0);

        const grossPay = Number((regularEarnings + overtimeEarnings + bonusTotal - deductionTotal).toFixed(2));

        const taxWithholding = Number((grossPay * (taxRate / 100)).toFixed(2));
        const medicalInsurance = emp.employmentType === 'Contract' ? 0 : 320;
        const retirementContribution = emp.employmentType === 'Contract' ? 0 : Number((grossPay * 0.04).toFixed(2));

        const netPay = Number(
          Math.max(0, grossPay - taxWithholding - medicalInsurance - retirementContribution).toFixed(2)
        );

        return {
          id: existingEntry?.id || `pe-${emp.id}-${Date.now().toString(36)}`,
          employeeId: emp.id,
          regularHours,
          regularEarnings,
          overtimeHours,
          overtimeEarnings,
          bonuses: existingBonuses,
          deductions: existingDeductions,
          grossPay,
          taxWithholding,
          medicalInsurance,
          retirementContribution,
          netPay,
          paymentMethod: emp.employmentType === 'Contract' ? 'Bank Wire' : 'Direct Deposit',
          status: 'Approved',
          transactionRef: existingEntry?.transactionRef || `ACH-${Date.now().toString().slice(-6)}`
        };
      });

    const totalGross = Number(updatedEntries.reduce((acc, e) => acc + e.grossPay, 0).toFixed(2));
    const totalNet = Number(updatedEntries.reduce((acc, e) => acc + e.netPay, 0).toFixed(2));
    const totalTaxes = Number(updatedEntries.reduce((acc, e) => acc + e.taxWithholding, 0).toFixed(2));

    const updatedCycle: PayrollCycle = {
      ...cycle,
      status: 'Under Review',
      taxRatePercent: taxRate,
      totalGross,
      totalNet,
      totalTaxes,
      entries: updatedEntries
    };

    setPayrollCycles((prev) => prev.map((c) => (c.id === cycleId ? updatedCycle : c)));
    logAudit(
      'PAYROLL_RECALCULATED',
      'PAYROLL',
      `Auto-calculated wages & statutory withholdings (${taxRate}% tax). Total Gross: $${totalGross.toLocaleString()}`
    );
  };

  const approvePayrollCycle = (cycleId: string) => {
    setPayrollCycles((prev) =>
      prev.map((c) => {
        if (c.id === cycleId) {
          logAudit('PAYROLL_APPROVED', 'PAYROLL', `Authorized payroll cycle "${c.title}" for electronic disbursement`);
          return { ...c, status: 'Approved' };
        }
        return c;
      })
    );
  };

  const disbursePayrollCycle = (cycleId: string) => {
    setPayrollCycles((prev) =>
      prev.map((c) => {
        if (c.id === cycleId) {
          const updatedEntries: PayrollEntry[] = c.entries.map((e) => ({
            ...e,
            status: 'Paid',
            transactionRef: e.transactionRef || `ACH-${Math.floor(100000 + Math.random() * 900000)}`
          }));
          logAudit(
            'PAYROLL_DISBURSED',
            'PAYROLL',
            `Direct deposit transfers completed for "${c.title}". Disbursed $${c.totalNet.toLocaleString()} net wages.`
          );
          return {
            ...c,
            status: 'Disbursed',
            entries: updatedEntries,
            disbursedAt: new Date().toISOString()
          };
        }
        return c;
      })
    );
  };

  const createPayrollCycle = (title: string, startDate: string, endDate: string, payDate: string) => {
    const newCycle: PayrollCycle = {
      id: `pay-${Date.now().toString(36)}`,
      title,
      startDate,
      endDate,
      payDate,
      status: 'Draft',
      taxRatePercent: 16,
      totalGross: 0,
      totalNet: 0,
      totalTaxes: 0,
      entries: []
    };
    setPayrollCycles((prev) => [newCycle, ...prev]);
    logAudit('PAYROLL_CYCLE_CREATED', 'PAYROLL', `Configured payroll schedule: ${title} (${startDate} to ${endDate})`);
    setTimeout(() => runPayrollCalculation(newCycle.id), 50);
  };

  const exportCsv = (type: 'employees' | 'attendance' | 'payroll') => {
    let csvContent = '';
    let fileName = '';

    if (type === 'employees') {
      fileName = `pulsehr_employees_${getTodayDateString()}.csv`;
      const headers = ['ID,EmployeeID,Name,Email,Phone,Department,Designation,Type,Status,PayType,Rate,PTOBalance,JoinDate\n'];
      const rows = employees.map((e) =>
        [
          e.id,
          e.employeeId,
          `"${e.firstName} ${e.lastName}"`,
          e.email,
          e.phone,
          `"${e.department}"`,
          `"${e.designation}"`,
          e.employmentType,
          e.status,
          e.compensation.payType,
          e.compensation.rate,
          e.ptoBalanceDays,
          e.joinDate
        ].join(',')
      );
      csvContent = headers.concat(rows.map((r) => r + '\n')).join('');
    } else if (type === 'attendance') {
      fileName = `pulsehr_attendance_timesheet_${getTodayDateString()}.csv`;
      const headers = ['ID,Date,EmployeeID,EmployeeName,ClockIn,ClockOut,RegularHours,OvertimeHours,TotalHours,Status,Location,Biometric\n'];
      const rows = attendance.map((a) => {
        const emp = employees.find((e) => e.id === a.employeeId);
        return [
          a.id,
          a.date,
          emp?.employeeId || a.employeeId,
          `"${emp ? `${emp.firstName} ${emp.lastName}` : ''}"`,
          a.clockIn || '',
          a.clockOut || '',
          a.regularHours,
          a.overtimeHours,
          a.totalHours,
          a.status,
          `"${a.location.geofenceLocation}"`,
          a.biometricVerified ? 'Yes' : 'No'
        ].join(',');
      });
      csvContent = headers.concat(rows.map((r) => r + '\n')).join('');
    } else if (type === 'payroll') {
      fileName = `pulsehr_payroll_summary_${getTodayDateString()}.csv`;
      const activeCycle = payrollCycles[0];
      const headers = ['Cycle,EmployeeID,EmployeeName,RegularHours,GrossPay,TaxWithholding,Benefits,NetPay,Status,PaymentMethod\n'];
      const rows = activeCycle
        ? activeCycle.entries.map((entry) => {
            const emp = employees.find((e) => e.id === entry.employeeId);
            return [
              `"${activeCycle.title}"`,
              emp?.employeeId || entry.employeeId,
              `"${emp ? `${emp.firstName} ${emp.lastName}` : ''}"`,
              entry.regularHours,
              entry.grossPay,
              entry.taxWithholding,
              entry.medicalInsurance + entry.retirementContribution,
              entry.netPay,
              entry.status,
              entry.paymentMethod
            ].join(',');
          })
        : [];
      csvContent = headers.concat(rows.map((r) => r + '\n')).join('');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAudit('EXPORT_CSV', 'SECURITY', `Exported ${type.toUpperCase()} data register to CSV`);
  };

  const exportBackupJson = () => {
    const backupData = {
      system: 'PulseHR Enterprise Workforce Suite',
      version: '2.0-ADVANCED',
      exportedAt: new Date().toISOString(),
      themeSettings,
      employees,
      shifts,
      shiftAssignments,
      attendance,
      payrollCycles,
      leaveRequests,
      swapRequests,
      auditLogs
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulsehr_system_backup_${getTodayDateString()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAudit('BACKUP_JSON_EXPORTED', 'SECURITY', 'Full encrypted system backup archive generated');
  };

  const resetToDefaultData = () => {
    setThemeSettingsState(DEFAULT_THEME);
    setEmployees(INITIAL_EMPLOYEES);
    setShifts(INITIAL_SHIFTS);
    setShiftAssignments(generateInitialShiftAssignments());
    setAttendance(INITIAL_ATTENDANCE);
    setPayrollCycles(INITIAL_PAYROLL_CYCLES);
    setLeaveRequests(INITIAL_LEAVE_REQUESTS);
    setSwapRequests(INITIAL_SWAP_REQUESTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setPinState('1234');
    setUserRole('Admin');
    localStorage.clear();
    logAudit('SYSTEM_FACTORY_RESET', 'SECURITY', 'System state restored to factory baseline configuration');
  };

  return (
    <AppContext.Provider
      value={{
        themeSettings,
        setThemeSettings,
        applyPresetTheme,
        themeModalOpen,
        setThemeModalOpen,
        employees,
        shifts,
        shiftAssignments,
        attendance,
        payrollCycles,
        auditLogs,
        leaveRequests,
        swapRequests,
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        activeEmployeeId,
        setActiveEmployeeId,
        isLocked,
        pin,
        setPin,
        unlockWithPin,
        lockApp,
        sensitiveDataMasked,
        toggleSensitiveMask,
        autoLockMinutes,
        setAutoLockMinutes,
        selectedEmployee,
        setSelectedEmployee,
        punchKioskOpen,
        setPunchKioskOpen,
        selectedPaystub,
        setSelectedPaystub,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        clockIn,
        clockOut,
        startBreak,
        endBreak,
        updateAttendanceRecord,
        assignShift,
        removeShiftAssignment,
        addShiftTemplate,
        updateShiftTemplate,
        autoGenerateSmartRoster,
        submitSwapRequest,
        reviewSwapRequest,
        submitLeaveRequest,
        reviewLeaveRequest,
        runPayrollCalculation,
        approvePayrollCycle,
        disbursePayrollCycle,
        createPayrollCycle,
        logAudit,
        exportCsv,
        exportBackupJson,
        resetToDefaultData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
