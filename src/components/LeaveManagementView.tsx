import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { LeaveType } from '../types.ts';
import {
  CalendarCheck,
  Calendar,
  CheckCircle,
  XCircle,
  Plus,
  Clock,
  UserCheck,
  Building2,
  AlertCircle
} from 'lucide-react';

export const LeaveManagementView: React.FC = () => {
  const {
    employees,
    leaveRequests,
    submitLeaveRequest,
    reviewLeaveRequest,
    userRole,
    activeEmployeeId,
    themeSettings
  } = useApp();

  const [formOpen, setFormOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Time Off (PTO)');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reason, setReason] = useState('');

  const activeEmp = employees.find((e) => e.id === activeEmployeeId) || employees[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;
    submitLeaveRequest(leaveType, startDate, endDate, reason);
    setReason('');
    setFormOpen(false);
  };

  const pendingLeaves = leaveRequests.filter((l) => l.status === 'Pending');
  const pastLeaves = leaveRequests.filter((l) => l.status !== 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight theme-text">Time Off & Leave Management</h2>
          <p className="text-xs theme-text-muted mt-0.5">
            Accrued PTO allowances, vacation requests, and managerial approvals
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-98"
          style={{ backgroundColor: themeSettings.primaryColor }}
        >
          <Plus className="w-4 h-4" />
          <span>Request Time Off</span>
        </button>
      </div>

      {/* Accrual Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs theme-text-muted font-medium block">Current PTO Allowance</span>
            <span className="text-2xl font-extrabold theme-text font-mono mt-1 block">
              {activeEmp?.ptoBalanceDays || 15} Days
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">Available to Book</span>
          </div>
          <CalendarCheck className="w-8 h-8 text-emerald-500 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs theme-text-muted font-medium block">Pending Requests</span>
            <span className="text-2xl font-extrabold text-amber-600 font-mono mt-1 block">
              {pendingLeaves.length}
            </span>
            <span className="text-[11px] text-slate-500">Awaiting Manager Review</span>
          </div>
          <Clock className="w-8 h-8 text-amber-500 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs theme-text-muted font-medium block">Approved This Year</span>
            <span className="text-2xl font-extrabold theme-text font-mono mt-1 block">
              {pastLeaves.filter((l) => l.status === 'Approved').length}
            </span>
            <span className="text-[11px] text-blue-600 font-semibold">Discharged & Scheduled</span>
          </div>
          <CheckCircle className="w-8 h-8 text-blue-500 opacity-80" />
        </div>
      </div>

      {/* Pending Authorization Queue */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm theme-text">Pending Authorization Queue</h3>
          <span className="text-xs theme-text-muted font-mono">{pendingLeaves.length} requests waiting</span>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="p-6 rounded-2xl theme-surface border theme-border text-center text-xs theme-text-muted">
            No pending leave requests in the queue.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingLeaves.map((req) => {
              const emp = employees.find((e) => e.id === req.employeeId);
              return (
                <div key={req.id} className="p-4 rounded-2xl theme-surface border theme-border shadow-xs space-y-3 text-xs">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: emp?.avatarBgColor || themeSettings.primaryColor }}
                      >
                        {emp?.firstName[0]}
                        {emp?.lastName[0]}
                      </div>
                      <div>
                        <span className="font-bold theme-text block">{emp?.firstName} {emp?.lastName}</span>
                        <span className="text-[11px] theme-text-muted font-mono">{emp?.department} · {emp?.employeeId}</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      Pending
                    </span>
                  </div>

                  <div className="p-3 rounded-xl theme-surface-subtle border theme-border space-y-1">
                    <div className="flex justify-between font-medium theme-text">
                      <span className="font-bold">{req.leaveType}</span>
                      <span className="font-mono">{req.daysCount} days</span>
                    </div>
                    <div className="text-[11px] theme-text-muted font-mono">
                      {req.startDate} to {req.endDate}
                    </div>
                    <p className="text-[11px] theme-text italic pt-1">"{req.reason}"</p>
                  </div>

                  {userRole !== 'Employee' && (
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => reviewLeaveRequest(req.id, 'Rejected')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => reviewLeaveRequest(req.id, 'Approved')}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
                      >
                        Approve Leave
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Past Leave Records */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm theme-text">Historical Leave Ledger</h3>
        <div className="rounded-2xl theme-surface border theme-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="theme-surface-subtle border-b theme-border text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Staff</th>
                  <th className="py-3 px-4">Leave Category</th>
                  <th className="py-3 px-4">Date Range</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {pastLeaves.map((l) => {
                  const emp = employees.find((e) => e.id === l.employeeId);
                  return (
                    <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-medium theme-text">
                        <div>{emp ? `${emp.firstName} ${emp.lastName}` : 'Staff'}</div>
                        <div className="text-[11px] theme-text-muted font-mono">{emp?.employeeId}</div>
                      </td>
                      <td className="py-3 px-4 font-semibold theme-text">{l.leaveType}</td>
                      <td className="py-3 px-4 font-mono theme-text-muted">{l.startDate} → {l.endDate}</td>
                      <td className="py-3 px-4 font-mono font-bold theme-text">{l.daysCount} days</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">{l.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          l.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Leave Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl theme-surface border theme-border shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b theme-border pb-3">
              <h3 className="font-bold text-sm theme-text">Book Paid Leave / Time Off</h3>
              <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                  className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
                >
                  <option value="Paid Time Off (PTO)">Paid Time Off (PTO)</option>
                  <option value="Sick Leave">Medical / Sick Leave</option>
                  <option value="Parental">Parental / Family Leave</option>
                  <option value="Personal">Personal Unpaid Leave</option>
                  <option value="Bereavement">Bereavement</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block theme-text-muted mb-1 font-semibold">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono"
                  />
                </div>
                <div>
                  <label className="block theme-text-muted mb-1 font-semibold">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Purpose / Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Annual family vacation travel, doctor surgery..."
                  className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t theme-border">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: themeSettings.primaryColor }}
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
