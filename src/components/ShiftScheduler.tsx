import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShiftTemplate, ShiftAssignment } from '../types.ts';
import {
  CalendarDays,
  Plus,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRightLeft,
  RefreshCw
} from 'lucide-react';

export const ShiftScheduler: React.FC = () => {
  const {
    employees,
    shifts,
    shiftAssignments,
    assignShift,
    removeShiftAssignment,
    autoGenerateSmartRoster,
    swapRequests,
    submitSwapRequest,
    reviewSwapRequest,
    userRole,
    activeEmployeeId,
    themeSettings
  } = useApp();

  // Helper to generate current 7 days
  const today = new Date();
  const getWeekDates = () => {
    const dates: string[] = [];
    const dayOfWeek = today.getDay(); // 0 is Sunday
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const [selectedSlot, setSelectedSlot] = useState<{ employeeId: string; date: string } | null>(null);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [targetSwapEmpId, setTargetSwapEmpId] = useState(employees[1]?.id || '');
  const [swapDate, setSwapDate] = useState(weekDates[2] || '');
  const [swapReason, setSwapReason] = useState('');

  const handleAutoSchedule = () => {
    autoGenerateSmartRoster(weekDates);
  };

  const handleSlotClick = (employeeId: string, date: string) => {
    if (userRole === 'Employee') return;
    setSelectedSlot({ employeeId, date });
  };

  const handleAssign = (templateId: string) => {
    if (!selectedSlot) return;
    assignShift(selectedSlot.employeeId, templateId, selectedSlot.date);
    setSelectedSlot(null);
  };

  const handleRemove = (assignmentId: string) => {
    removeShiftAssignment(assignmentId);
    setSelectedSlot(null);
  };

  const handleSendSwap = (e: React.FormEvent) => {
    e.preventDefault();
    submitSwapRequest(targetSwapEmpId, swapDate, swapReason || 'Mutual shift adjustment');
    setSwapReason('');
    setSwapModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight theme-text">Shift Scheduling & Roster</h2>
          <p className="text-xs theme-text-muted mt-0.5">
            Multi-tier shift policies, interactive roster grid, and algorithmic roster balancing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSwapModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Shift Swaps ({swapRequests.filter((s) => s.status === 'Pending').length})</span>
          </button>

          {userRole !== 'Employee' && (
            <button
              onClick={handleAutoSchedule}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-98"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Smart Auto-Schedule Roster</span>
            </button>
          )}
        </div>
      </div>

      {/* Shift Templates Bar */}
      <div className="p-4 rounded-2xl theme-surface border theme-border space-y-2">
        <span className="text-xs font-bold theme-text uppercase tracking-wider block">Shift Policies Legend</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shifts.map((s) => (
            <div key={s.id} className="p-2.5 rounded-xl border theme-border theme-surface-subtle text-xs flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="font-bold theme-text">{s.name}</span>
                </div>
                <span className="text-[11px] theme-text-muted font-mono mt-0.5 block">
                  {s.startTime} - {s.endTime}
                </span>
              </div>
              <span className="px-1.5 py-0.5 rounded font-mono font-bold text-[10px] bg-slate-200 dark:bg-slate-800 theme-text">
                {s.code}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Roster Grid */}
      <div className="rounded-2xl theme-surface border theme-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="theme-surface-subtle border-b theme-border text-slate-500 font-semibold">
                <th className="py-3 px-4 w-48">Staff Member</th>
                {weekDates.map((date, idx) => (
                  <th key={date} className="py-3 px-3 text-center border-l theme-border min-w-[110px]">
                    <span className="block font-bold theme-text">{dayNames[idx]}</span>
                    <span className="text-[10px] font-mono text-slate-400">{date.slice(5)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-medium theme-text">
                    <div className="font-bold">{emp.firstName} {emp.lastName}</div>
                    <div className="text-[11px] theme-text-muted font-mono">{emp.employeeId} · {emp.department}</div>
                  </td>
                  {weekDates.map((date) => {
                    const assignment = shiftAssignments.find(
                      (a) => a.employeeId === emp.id && a.date === date
                    );
                    const shiftTpl = assignment ? shifts.find((s) => s.id === assignment.shiftTemplateId) : null;

                    return (
                      <td
                        key={date}
                        onClick={() => handleSlotClick(emp.id, date)}
                        className={`py-2 px-2 text-center border-l theme-border transition-colors ${
                          userRole !== 'Employee' ? 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800' : ''
                        }`}
                      >
                        {shiftTpl ? (
                          <div
                            className="p-1.5 rounded-lg border text-[11px] font-bold shadow-xs truncate text-center"
                            style={{
                              backgroundColor: `${shiftTpl.color}15`,
                              borderColor: `${shiftTpl.color}40`,
                              color: shiftTpl.color
                            }}
                          >
                            <span>{shiftTpl.code}</span>
                            <span className="block text-[9px] opacity-75 font-mono">{shiftTpl.startTime.slice(0, 5)}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-300 dark:text-slate-600 font-mono">Off</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slot Assignment Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl theme-surface border theme-border shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <div>
                <h3 className="font-bold text-sm theme-text">Assign Roster Shift</h3>
                <p className="text-[11px] theme-text-muted font-mono">{selectedSlot.date}</p>
              </div>
              <button onClick={() => setSelectedSlot(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold theme-text-muted block">Select Shift Policy</span>
              {shifts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleAssign(s.id)}
                  className="w-full p-2.5 rounded-xl border theme-border theme-surface-subtle hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="font-bold theme-text">{s.name}</span>
                  </div>
                  <span className="font-mono text-slate-500">{s.startTime} - {s.endTime}</span>
                </button>
              ))}

              {/* Remove Assignment Option */}
              {(() => {
                const existing = shiftAssignments.find(
                  (a) => a.employeeId === selectedSlot.employeeId && a.date === selectedSlot.date
                );
                if (existing) {
                  return (
                    <button
                      onClick={() => handleRemove(existing.id)}
                      className="w-full p-2.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold hover:bg-rose-100 transition-colors"
                    >
                      Mark as Rest Day / Off Duty
                    </button>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Shift Swap Management Modal */}
      {swapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl theme-surface border theme-border shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-sm theme-text">Peer Shift Swap Exchange</h3>
              </div>
              <button onClick={() => setSwapModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Pending Requests List */}
            <div className="space-y-3">
              <span className="text-xs font-bold theme-text uppercase tracking-wider block">Pending Swap Requests</span>
              {swapRequests.length === 0 ? (
                <p className="text-xs theme-text-muted">No pending shift swaps.</p>
              ) : (
                swapRequests.map((req) => {
                  const reqEmp = employees.find((e) => e.id === req.requesterId);
                  const targetEmp = employees.find((e) => e.id === req.targetEmployeeId);
                  return (
                    <div key={req.id} className="p-3.5 rounded-xl border theme-border theme-surface-subtle text-xs space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-bold theme-text">
                            {reqEmp?.firstName} {reqEmp?.lastName} ↔ {targetEmp?.firstName} {targetEmp?.lastName}
                          </span>
                          <p className="text-[11px] theme-text-muted font-mono">Date: {req.date}</p>
                          <p className="text-[11px] theme-text italic mt-0.5">"{req.reason}"</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>

                      {userRole !== 'Employee' && req.status === 'Pending' && (
                        <div className="flex justify-end gap-2 pt-1 border-t theme-border">
                          <button
                            onClick={() => reviewSwapRequest(req.id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-rose-600 hover:bg-rose-50"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => reviewSwapRequest(req.id, 'Approved')}
                            className="px-3 py-1 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs"
                          >
                            Approve Swap
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Create Swap Request Form */}
            <form onSubmit={handleSendSwap} className="p-4 rounded-xl border theme-border theme-surface-subtle space-y-3 text-xs">
              <span className="font-bold theme-text block">Submit New Shift Swap Request</span>
              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Select Colleague</label>
                <select
                  value={targetSwapEmpId}
                  onChange={(e) => setTargetSwapEmpId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text"
                >
                  {employees.filter((e) => e.id !== activeEmployeeId).map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Shift Date to Swap</label>
                <select
                  value={swapDate}
                  onChange={(e) => setSwapDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text font-mono"
                >
                  {weekDates.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Reason</label>
                <input
                  type="text"
                  required
                  value={swapReason}
                  onChange={(e) => setSwapReason(e.target.value)}
                  placeholder="e.g. Doctor appointment, family commitment"
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: themeSettings.primaryColor }}
                >
                  Submit Swap Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
