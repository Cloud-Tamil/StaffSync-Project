import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AttendanceRecord, AttendanceStatus } from '../types.ts';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Filter,
  Search,
  ShieldCheck,
  Edit2,
  X,
  Radio,
  Fingerprint
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const {
    attendance,
    employees,
    updateAttendanceRecord,
    exportCsv,
    setPunchKioskOpen,
    userRole,
    themeSettings
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<AttendanceStatus>('On-Time');
  const [overrideNotes, setOverrideNotes] = useState('');

  // KPIs
  const todayStr = new Date().toISOString().split('T')[0];
  const activeNow = attendance.filter((a) => a.date === todayStr && a.clockIn && !a.clockOut).length;
  const totalOnTime = attendance.filter((a) => a.status === 'On-Time').length;
  const onTimeRate = attendance.length ? Math.round((totalOnTime / attendance.length) * 100) : 100;
  const totalLate = attendance.filter((a) => a.status === 'Late').length;
  const totalOtHours = attendance.reduce((sum, a) => sum + (a.overtimeHours || 0), 0);

  const filtered = attendance.filter((rec) => {
    const emp = employees.find((e) => e.id === rec.employeeId);
    const empName = emp ? `${emp.firstName} ${emp.lastName} ${emp.employeeId}`.toLowerCase() : '';
    const matchesSearch = empName.includes(search.toLowerCase()) || rec.date.includes(search);
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveOverride = () => {
    if (!editingRecord) return;
    updateAttendanceRecord(editingRecord.id, {
      status: overrideStatus,
      notes: overrideNotes ? `${editingRecord.notes || ''} [Override: ${overrideNotes}]` : editingRecord.notes,
      managerApproved: true
    });
    setEditingRecord(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight theme-text">Attendance & Timesheet Ledger</h2>
          <p className="text-xs theme-text-muted mt-0.5">
            Biometric punches, GPS geofence audit, and supervisor timesheet management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv('attendance')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Timesheets</span>
          </button>

          <button
            onClick={() => setPunchKioskOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: themeSettings.primaryColor }}
          >
            <Clock className="w-4 h-4" />
            <span>Launch Time Kiosk</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Clocked In Now</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold theme-text font-mono">{activeNow}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Live
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">On-Time Punctuality</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold theme-text font-mono">{onTimeRate}%</span>
            <span className="text-xs text-slate-500">Benchmark: 95%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Late Arrivals</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-amber-600 font-mono">{totalLate}</span>
            <span className="text-xs text-slate-500">This Cycle</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Accumulated Overtime</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold theme-text font-mono">{totalOtHours.toFixed(1)}h</span>
            <span className="text-xs text-blue-600 font-medium">1.5x Premium</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl theme-surface border theme-border flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter timesheet by employee name, ID or date (YYYY-MM-DD)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border theme-border theme-surface theme-text placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="On-Time">On-Time</option>
          <option value="Late">Late</option>
          <option value="Overtime">Overtime</option>
          <option value="Absent">Absent</option>
        </select>
      </div>

      {/* Ledger Table */}
      <div className="rounded-2xl theme-surface border theme-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="theme-surface-subtle border-b theme-border text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Clock In / Out</th>
                <th className="py-3 px-4">Breaks</th>
                <th className="py-3 px-4">Hours (Reg / OT)</th>
                <th className="py-3 px-4">Security & Location</th>
                <th className="py-3 px-4">Status</th>
                {userRole !== 'Employee' && <th className="py-3 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {filtered.map((rec) => {
                const emp = employees.find((e) => e.id === rec.employeeId);
                const totalBreakMins = rec.breaks.reduce((acc, b) => acc + (b.durationMinutes || 0), 0);

                return (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium theme-text">
                      <div>{emp ? `${emp.firstName} ${emp.lastName}` : 'Staff'}</div>
                      <div className="text-[11px] theme-text-muted font-mono">{emp?.employeeId} · {emp?.department}</div>
                    </td>
                    <td className="py-3 px-4 font-mono theme-text">{rec.date}</td>
                    <td className="py-3 px-4 font-mono">
                      <span className="text-slate-900 dark:text-slate-100 font-semibold">{rec.clockIn || '--:--'}</span>
                      <span className="text-slate-400 mx-1">→</span>
                      <span className="text-slate-600 dark:text-slate-400">{rec.clockOut || 'Active'}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono">
                      {totalBreakMins > 0 ? `${totalBreakMins}m (${rec.breaks.length})` : '0m'}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium">
                      <span className="text-slate-900 dark:text-slate-100">{rec.totalHours.toFixed(1)}h</span>
                      {rec.overtimeHours > 0 && (
                        <span className="ml-1.5 text-amber-600 dark:text-amber-400 text-[11px]">
                          (+{rec.overtimeHours.toFixed(1)} OT)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        {rec.biometricVerified && <span title="Biometric Verified"><Fingerprint className="w-3.5 h-3.5 text-emerald-500" /></span>}
                        <Radio className="w-3.5 h-3.5 text-blue-500" />
                        <span>{rec.location.geofenceLocation}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          rec.status === 'On-Time'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : rec.status === 'Late'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                    {userRole !== 'Employee' && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setEditingRecord(rec);
                            setOverrideStatus(rec.status);
                            setOverrideNotes('');
                          }}
                          className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                          title="Override or approve timesheet record"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supervisor Override Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl theme-surface border theme-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <h3 className="font-bold text-sm theme-text">Supervisor Timesheet Override</h3>
              <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Adjust Status</label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value as AttendanceStatus)}
                  className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
                >
                  <option value="On-Time">On-Time (Approved)</option>
                  <option value="Late">Late Arrival</option>
                  <option value="Overtime">Authorized Overtime</option>
                  <option value="Half-Day">Half-Day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Reason for Override (Audit Logged)</label>
                <input
                  type="text"
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="e.g. Excused transit breakdown, manager agreed"
                  className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t theme-border">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold theme-surface-subtle theme-text border theme-border"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveOverride}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: themeSettings.primaryColor }}
              >
                Save Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
