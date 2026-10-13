import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Mail,
  Phone,
  Building2,
  Calendar,
  CreditCard,
  Shield,
  Clock,
  CircleDollarSign,
  User,
  ExternalLink,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';

export const EmployeeProfileDrawer: React.FC = () => {
  const {
    selectedEmployee,
    setSelectedEmployee,
    sensitiveDataMasked,
    attendance,
    shifts,
    leaveRequests,
    setSelectedPaystub,
    payrollCycles,
    themeSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'compensation' | 'attendance' | 'timeoff' | 'paystubs'>('details');

  if (!selectedEmployee) return null;

  const empShifts = shifts.find((s) => s.id === selectedEmployee.assignedShiftId);
  const empAttendance = attendance
    .filter((a) => a.employeeId === selectedEmployee.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const empLeaves = leaveRequests
    .filter((l) => l.employeeId === selectedEmployee.id)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md theme-surface border-l theme-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b theme-border flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-bold shadow-sm"
                style={{ backgroundColor: selectedEmployee.avatarBgColor || themeSettings.primaryColor }}
              >
                {selectedEmployee.firstName[0]}
                {selectedEmployee.lastName[0]}
              </div>
              <div>
                <h3 className="font-bold text-base theme-text leading-tight">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-xs theme-text-muted mt-0.5 font-mono">{selectedEmployee.employeeId} · {selectedEmployee.designation}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {selectedEmployee.status}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full theme-surface-subtle theme-text border theme-border">
                    {selectedEmployee.employmentType}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedEmployee(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex border-b theme-border px-6 gap-4 overflow-x-auto">
            {(['details', 'compensation', 'attendance', 'timeoff', 'paystubs'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent theme-text-muted hover:theme-text'
                }`}
                style={activeTab === tab ? { borderColor: themeSettings.primaryColor, color: themeSettings.primaryColor } : {}}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto space-y-5 flex-1">
            {activeTab === 'details' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl theme-surface-subtle border theme-border space-y-2.5">
                  <div className="flex items-center gap-2 theme-text">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmployee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 theme-text">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmployee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 theme-text">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{selectedEmployee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 theme-text">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Joined: {selectedEmployee.joinDate}</span>
                  </div>
                </div>

                {/* Assigned Shift Policy */}
                <div className="p-4 rounded-xl theme-surface-subtle border theme-border">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold theme-text">Shift Policy</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                      {empShifts?.code || 'DEFAULT'}
                    </span>
                  </div>
                  <p className="text-xs theme-text font-medium">{empShifts?.name || 'Standard 9-to-5'}</p>
                  <p className="text-[11px] theme-text-muted mt-0.5">
                    {empShifts?.startTime} - {empShifts?.endTime} ({empShifts?.breakMinutes}m break)
                  </p>
                </div>

                {/* Emergency Contact */}
                <div className="p-4 rounded-xl theme-surface-subtle border theme-border">
                  <span className="font-semibold theme-text block mb-1">Emergency Contact</span>
                  <p className="theme-text">{selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship})</p>
                  <p className="theme-text-muted font-mono mt-0.5">{selectedEmployee.emergencyContact.phone}</p>
                </div>
              </div>
            )}

            {activeTab === 'compensation' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl theme-surface-subtle border theme-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="theme-text-muted">Pay Classification</span>
                    <span className="font-bold theme-text">{selectedEmployee.compensation.payType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="theme-text-muted">Base Rate</span>
                    <span className="font-bold theme-text font-mono">
                      ${selectedEmployee.compensation.rate.toFixed(2)} {selectedEmployee.compensation.payType === 'Hourly' ? '/ hour' : '/ month'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="theme-text-muted">Standard Hours</span>
                    <span className="font-bold theme-text font-mono">{selectedEmployee.compensation.standardHoursPerWeek} hrs / week</span>
                  </div>
                </div>

                {/* Bank Account Info with Privacy Masking */}
                <div className="p-4 rounded-xl theme-surface-subtle border theme-border space-y-2.5">
                  <div className="flex items-center gap-1.5 font-semibold theme-text mb-1">
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span>Disbursement Direct Deposit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Financial Institution:</span>
                    <span className="theme-text font-medium">{selectedEmployee.compensation.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Account Number:</span>
                    <span className="theme-text font-mono">
                      {sensitiveDataMasked
                        ? selectedEmployee.compensation.accountNumberMasked
                        : selectedEmployee.compensation.accountNumberRaw || selectedEmployee.compensation.accountNumberMasked}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Routing Transit Number:</span>
                    <span className="theme-text font-mono">{selectedEmployee.compensation.routingNumberMasked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="theme-text-muted">Tax ID / SSN:</span>
                    <span className="theme-text font-mono">
                      {sensitiveDataMasked ? selectedEmployee.compensation.taxIdMasked : '982-11-4829'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-3">
                <span className="text-xs font-semibold theme-text block">Recent Punch Timesheets</span>
                {empAttendance.length === 0 ? (
                  <p className="text-xs theme-text-muted">No attendance punches recorded yet.</p>
                ) : (
                  empAttendance.map((rec) => (
                    <div key={rec.id} className="p-3 rounded-xl border theme-border theme-surface-subtle text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold theme-text font-mono">{rec.date}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === 'On-Time'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}>
                          {rec.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px] font-mono">
                        <span>In: {rec.clockIn || '--:--'} | Out: {rec.clockOut || '--:--'}</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{rec.totalHours} hrs</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'timeoff' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl theme-surface-subtle border theme-border flex items-center justify-between">
                  <div>
                    <span className="text-xs theme-text-muted">Paid Time Off (PTO) Available</span>
                    <p className="text-xl font-bold theme-text font-mono mt-0.5">{selectedEmployee.ptoBalanceDays} Days</p>
                  </div>
                  <CalendarCheck className="w-7 h-7 text-emerald-500 opacity-80" />
                </div>

                <span className="text-xs font-semibold theme-text block">Leave Request History</span>
                {empLeaves.length === 0 ? (
                  <p className="text-xs theme-text-muted">No time-off requests on record.</p>
                ) : (
                  empLeaves.map((req) => (
                    <div key={req.id} className="p-3 rounded-xl border theme-border theme-surface-subtle text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold theme-text">{req.leaveType}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[11px] theme-text-muted font-mono">{req.startDate} to {req.endDate} ({req.daysCount} days)</p>
                      <p className="text-[11px] theme-text italic">"{req.reason}"</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'paystubs' && (
              <div className="space-y-3">
                <span className="text-xs font-semibold theme-text block">Generated Paystub Vouchers</span>
                {payrollCycles.map((cycle) => {
                  const entry = cycle.entries.find((e) => e.employeeId === selectedEmployee.id);
                  if (!entry) return null;
                  return (
                    <div
                      key={cycle.id}
                      className="p-3.5 rounded-xl border theme-border theme-surface-subtle flex items-center justify-between text-xs hover:border-blue-400 transition-colors"
                    >
                      <div>
                        <span className="font-semibold theme-text block">{cycle.title}</span>
                        <span className="text-[11px] theme-text-muted font-mono">Pay Date: {cycle.payDate}</span>
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                          Net: ${entry.netPay.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedPaystub({ cycle, entry, employee: selectedEmployee })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border theme-border theme-surface theme-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Voucher</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
