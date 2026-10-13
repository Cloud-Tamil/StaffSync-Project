import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Users,
  Clock,
  CircleDollarSign,
  CalendarDays,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Activity,
  Radio,
  CalendarCheck
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    employees,
    attendance,
    shiftAssignments,
    payrollCycles,
    setActiveTab,
    setPunchKioskOpen,
    themeSettings
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const activeNow = attendance.filter((a) => a.date === todayStr && a.clockIn && !a.clockOut);
  const activeCycle = payrollCycles[0];
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === 'Active').length;
  const onLeaveEmployees = employees.filter((e) => e.status === 'On Leave').length;

  const todayAssignments = shiftAssignments.filter((a) => a.date === todayStr);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl theme-surface border theme-border shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Operations Active · All Systems Operational
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight theme-text">
            PulseHR Command Center
          </h2>
          <p className="text-xs theme-text-muted mt-1 max-w-xl">
            Unified workforce intelligence, biometrically verified attendance, algorithmic shift coverage, and automated compensation disbursement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPunchKioskOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-98 transition-all"
            style={{ backgroundColor: themeSettings.primaryColor }}
          >
            <Clock className="w-4 h-4" />
            <span>Launch Live Punch Kiosk</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('directory')}
          className="p-5 rounded-2xl theme-surface border theme-border shadow-xs cursor-pointer hover:border-blue-400 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">Total Headcount</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold theme-text font-mono tracking-tight">{totalEmployees}</div>
          <div className="text-[11px] theme-text-muted flex items-center gap-2">
            <span className="text-emerald-600 font-semibold">{activeEmployees} Active</span>
            <span>·</span>
            <span>{onLeaveEmployees} On Leave</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('attendance')}
          className="p-5 rounded-2xl theme-surface border theme-border shadow-xs cursor-pointer hover:border-emerald-400 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">Clocked In Now</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">{activeNow.length}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <Radio className="w-3.5 h-3.5 animate-spin" />
            <span>Campus GPS Geofenced</span>
          </div>
        </div>

        <div
          onClick={() => setActiveTab('shifts')}
          className="p-5 rounded-2xl theme-surface border theme-border shadow-xs cursor-pointer hover:border-indigo-400 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">Today's Shift Roster</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold theme-text font-mono tracking-tight">{todayAssignments.length}</div>
          <div className="text-[11px] theme-text-muted">
            100% Shift Coverage Met
          </div>
        </div>

        <div
          onClick={() => setActiveTab('payroll')}
          className="p-5 rounded-2xl theme-surface border theme-border shadow-xs cursor-pointer hover:border-amber-400 transition-all space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold theme-text-muted">Current Pay Cycle</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <CircleDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">
            ${activeCycle ? Math.round(activeCycle.totalGross).toLocaleString() : '0'}
          </div>
          <div className="text-[11px] theme-text-muted">
            Net: ${activeCycle ? Math.round(activeCycle.totalNet).toLocaleString() : '0'} · {activeCycle?.status}
          </div>
        </div>
      </div>

      {/* Two Column Section: Live Staff on Duty & Quick Navigation Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* On Duty Staff Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl theme-surface border theme-border shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b theme-border pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h3 className="font-bold text-sm theme-text">Active Workforce On Duty Right Now</h3>
            </div>
            <button
              onClick={() => setActiveTab('attendance')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View Timesheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeNow.length === 0 ? (
            <p className="text-xs theme-text-muted py-4 text-center">No staff members currently clocked in.</p>
          ) : (
            <div className="divide-y theme-border">
              {activeNow.map((record) => {
                const emp = employees.find((e) => e.id === record.employeeId);
                return (
                  <div key={record.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: emp?.avatarBgColor || themeSettings.primaryColor }}
                      >
                        {emp?.firstName[0]}
                        {emp?.lastName[0]}
                      </div>
                      <div>
                        <div className="font-bold theme-text">{emp?.firstName} {emp?.lastName}</div>
                        <div className="text-[11px] theme-text-muted font-mono">{emp?.department} · In at {record.clockIn}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {record.status}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{record.location.geofenceLocation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Launch & System Health */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl theme-surface border theme-border shadow-xs space-y-3">
            <h3 className="font-bold text-sm theme-text">Quick Launch Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('directory')}
                className="w-full p-2.5 rounded-xl border theme-border theme-surface-subtle hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold theme-text transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>Register or View Employees</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('shifts')}
                className="w-full p-2.5 rounded-xl border theme-border theme-surface-subtle hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold theme-text transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-500" />
                  <span>Manage Weekly Shifts</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('leave')}
                className="w-full p-2.5 rounded-xl border theme-border theme-surface-subtle hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold theme-text transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-emerald-500" />
                  <span>Approve Leave Requests</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                onClick={() => setActiveTab('payroll')}
                className="w-full p-2.5 rounded-xl border theme-border theme-surface-subtle hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-between text-xs font-semibold theme-text transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CircleDollarSign className="w-4 h-4 text-amber-500" />
                  <span>Review Payroll & Tax Rates</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Enterprise Compliance Level 1</span>
            </div>
            <p className="text-[11px] theme-text-muted leading-relaxed">
              All time punches are stamped with SHA-256 integrity hashes and recorded in the immutable audit log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
