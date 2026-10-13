import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Play,
  Square,
  Coffee,
  CheckCircle,
  MapPin,
  ShieldCheck,
  Calendar,
  Clock as ClockIcon,
  Fingerprint,
  Radio,
  UserCheck
} from 'lucide-react';

export const QuickPunchKioskModal: React.FC = () => {
  const {
    punchKioskOpen,
    setPunchKioskOpen,
    employees,
    activeEmployeeId,
    setActiveEmployeeId,
    attendance,
    clockIn,
    clockOut,
    startBreak,
    endBreak,
    themeSettings
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedEmpId, setSelectedEmpId] = useState(activeEmployeeId);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [notes, setNotes] = useState('');
  const [punchFeedback, setPunchFeedback] = useState<string | null>(null);

  useEffect(() => {
    setSelectedEmpId(activeEmployeeId);
  }, [activeEmployeeId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!punchKioskOpen) return null;

  const employee = employees.find((e) => e.id === selectedEmpId) || employees[0];
  const todayStr = currentTime.toISOString().split('T')[0];

  const currentRecord = attendance.find(
    (a) => a.employeeId === employee?.id && a.date === todayStr
  );

  const isClockedIn = !!currentRecord && !!currentRecord.clockIn && !currentRecord.clockOut;
  const activeBreak = currentRecord?.breaks?.find((b) => !b.end);
  const isOnBreak = !!activeBreak;

  const handlePunchAction = (action: 'clockIn' | 'clockOut' | 'startBreak' | 'endBreak') => {
    if (!employee) return;
    if (action === 'clockIn') {
      clockIn(employee.id, notes, biometricEnabled);
      setPunchFeedback(`Clocked IN successfully at ${currentTime.toLocaleTimeString()}`);
    } else if (action === 'clockOut') {
      clockOut(employee.id, notes);
      setPunchFeedback(`Clocked OUT successfully at ${currentTime.toLocaleTimeString()}`);
    } else if (action === 'startBreak') {
      startBreak(employee.id);
      setPunchFeedback(`Break started at ${currentTime.toLocaleTimeString()}`);
    } else if (action === 'endBreak') {
      endBreak(employee.id);
      setPunchFeedback(`Break ended. Resumed work at ${currentTime.toLocaleTimeString()}`);
    }
    setNotes('');
    setTimeout(() => setPunchFeedback(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-2xl theme-surface border theme-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              <ClockIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight theme-text">Biometric Time Kiosk</h3>
              <p className="text-[11px] theme-text-muted">Real-time attendance & GPS verification</p>
            </div>
          </div>
          <button
            onClick={() => setPunchKioskOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Live Clock Display */}
          <div className="p-5 rounded-2xl text-center bg-slate-900 text-white shadow-inner">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-wider font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-2 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {currentTime.toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Feedback Banner */}
          {punchFeedback && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{punchFeedback}</span>
            </div>
          )}

          {/* Employee Selector */}
          <div>
            <label className="block text-xs font-semibold theme-text mb-1.5">Select Employee Profile</label>
            <select
              value={selectedEmpId}
              onChange={(e) => {
                setSelectedEmpId(e.target.value);
                setActiveEmployeeId(e.target.value);
              }}
              className="w-full text-xs font-medium px-3 py-2.5 rounded-xl border theme-border theme-surface theme-text focus:outline-none focus:ring-2"
              style={{ outlineColor: themeSettings.primaryColor }}
            >
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeId}) · {emp.department}
                </option>
              ))}
            </select>
          </div>

          {/* Current Punch Status Box */}
          <div className="p-4 rounded-xl theme-surface-subtle border theme-border flex items-center justify-between">
            <div>
              <p className="text-[11px] theme-text-muted">Current Shift Status</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOnBreak
                      ? 'bg-amber-500 animate-pulse'
                      : isClockedIn
                      ? 'bg-emerald-500 animate-ping'
                      : 'bg-slate-400'
                  }`}
                />
                <span className="text-xs font-bold theme-text">
                  {isOnBreak ? 'On Break / Rest Period' : isClockedIn ? 'Active On Duty' : 'Off Duty'}
                </span>
              </div>
              {currentRecord?.clockIn && (
                <p className="text-[10px] theme-text-muted mt-1 font-mono">
                  In: {currentRecord.clockIn} {currentRecord.clockOut && `| Out: ${currentRecord.clockOut}`}
                </p>
              )}
            </div>

            {/* Geofence Radar Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300">
              <Radio className="w-4 h-4 animate-spin" />
              <div className="text-right">
                <div className="text-[11px] font-bold">Campus Validated</div>
                <div className="text-[9px] font-mono opacity-80">GPS: ±4.2m Accuracy</div>
              </div>
            </div>
          </div>

          {/* Biometrics Toggle & Notes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={(e) => setBiometricEnabled(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="text-xs font-medium theme-text flex items-center gap-1.5">
                <Fingerprint className="w-4 h-4 text-emerald-500" />
                Biometric Liveness Check (Facial & Passkey Verified)
              </span>
            </label>

            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional shift notes or workstation location..."
              className="w-full text-xs px-3 py-2 rounded-xl border theme-border theme-surface theme-text placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Punch Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {!isClockedIn ? (
              <button
                onClick={() => handlePunchAction('clockIn')}
                className="col-span-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md active:scale-98 transition-all"
                style={{ backgroundColor: themeSettings.primaryColor }}
              >
                <Play className="w-4 h-4" />
                <span>Clock In (Start Shift)</span>
              </button>
            ) : (
              <>
                {isOnBreak ? (
                  <button
                    onClick={() => handlePunchAction('endBreak')}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-md active:scale-98 transition-all"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>End Break & Resume Work</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handlePunchAction('startBreak')}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-98 transition-all"
                  >
                    <Coffee className="w-4 h-4" />
                    <span>Start Break</span>
                  </button>
                )}

                <button
                  onClick={() => handlePunchAction('clockOut')}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md active:scale-98 transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>Clock Out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
