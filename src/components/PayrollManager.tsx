import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { PayrollCycle, PayrollEntry } from '../types.ts';
import {
  CircleDollarSign,
  Calculator,
  CheckCircle,
  Send,
  Download,
  Plus,
  FileText,
  Sliders,
  Building,
  TrendingUp,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { PaystubModal } from './PaystubModal.tsx';

export const PayrollManager: React.FC = () => {
  const {
    payrollCycles,
    employees,
    runPayrollCalculation,
    approvePayrollCycle,
    disbursePayrollCycle,
    createPayrollCycle,
    setSelectedPaystub,
    exportCsv,
    userRole,
    themeSettings
  } = useApp();

  const [selectedCycleId, setSelectedCycleId] = useState(payrollCycles[0]?.id || '');
  const [taxSliderVal, setTaxSliderVal] = useState<number>(18);
  const [newCycleModal, setNewCycleModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Bi-Weekly Cycle · Next');
  const [newStart, setNewStart] = useState('2026-10-16');
  const [newEnd, setNewEnd] = useState('2026-10-31');
  const [newPayDate, setNewPayDate] = useState('2026-11-05');

  const activeCycle = payrollCycles.find((c) => c.id === selectedCycleId) || payrollCycles[0];

  const handleRecalculate = () => {
    if (!activeCycle) return;
    runPayrollCalculation(activeCycle.id, taxSliderVal);
  };

  const handleApprove = () => {
    if (!activeCycle) return;
    approvePayrollCycle(activeCycle.id);
  };

  const handleDisburse = () => {
    if (!activeCycle) return;
    disbursePayrollCycle(activeCycle.id);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    createPayrollCycle(newTitle, newStart, newEnd, newPayDate);
    setNewCycleModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight theme-text">Payroll & Compensation Engine</h2>
          <p className="text-xs theme-text-muted mt-0.5">
            Timesheet-driven wage calculation, statutory tax withholding, and direct deposit ACH disbursements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv('payroll')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Payroll CSV</span>
          </button>

          {userRole === 'Admin' && (
            <button
              onClick={() => setNewCycleModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-98"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              <span>New Pay Cycle</span>
            </button>
          )}
        </div>
      </div>

      {/* Cycle Selector & Status Header */}
      <div className="p-4 rounded-2xl theme-surface border theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold theme-text whitespace-nowrap">Pay Period:</label>
          <select
            value={activeCycle?.id}
            onChange={(e) => setSelectedCycleId(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
          >
            {payrollCycles.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.startDate} to {c.endDate})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              activeCycle?.status === 'Disbursed'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : activeCycle?.status === 'Approved'
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
          >
            Status: {activeCycle?.status}
          </span>

          {userRole !== 'Employee' && activeCycle && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRecalculate}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Recalculate
              </button>

              {activeCycle.status === 'Draft' && (
                <button
                  onClick={handleApprove}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                >
                  Authorize & Approve
                </button>
              )}

              {activeCycle.status === 'Approved' && (
                <button
                  onClick={handleDisburse}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Disburse Direct Deposits</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Total Gross Wages</span>
          <div className="text-2xl font-extrabold theme-text font-mono mt-1">
            ${activeCycle?.totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">Regular + Overtime</span>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Statutory Withholdings</span>
          <div className="text-2xl font-extrabold text-rose-600 font-mono mt-1">
            ${activeCycle?.totalTaxes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-slate-500">Rate: {activeCycle?.taxRatePercent}%</span>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Net Disbursed Take-Home</span>
          <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1">
            ${activeCycle?.totalNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">ACH Ready</span>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <span className="text-xs theme-text-muted font-medium block">Payroll Enrollees</span>
          <div className="text-2xl font-extrabold theme-text font-mono mt-1">
            {activeCycle?.entries.length || 0} Staff
          </div>
          <span className="text-[11px] text-slate-500">100% Timesheet Reconciled</span>
        </div>
      </div>

      {/* Statutory Tax Slider Simulation */}
      {userRole !== 'Employee' && (
        <div className="p-4 rounded-2xl theme-surface border theme-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-blue-500" />
            <div>
              <span className="text-xs font-bold theme-text block">Statutory Tax Withholding Rate Adjustment</span>
              <span className="text-[11px] theme-text-muted">Simulate net impact of federal/state rate variations</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="10"
              max="28"
              value={taxSliderVal}
              onChange={(e) => setTaxSliderVal(parseInt(e.target.value))}
              className="w-40 accent-blue-600"
            />
            <span className="text-xs font-mono font-bold theme-text w-12">{taxSliderVal}%</span>
            <button
              onClick={handleRecalculate}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              Apply Rate
            </button>
          </div>
        </div>
      )}

      {/* Employee Payroll Ledger */}
      <div className="rounded-2xl theme-surface border theme-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="theme-surface-subtle border-b theme-border text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4 text-right">Regular Hrs</th>
                <th className="py-3 px-4 text-right">OT Hrs</th>
                <th className="py-3 px-4 text-right">Gross Pay</th>
                <th className="py-3 px-4 text-right">Taxes & Benefits</th>
                <th className="py-3 px-4 text-right">Net Pay</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Paystub</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {activeCycle?.entries.map((entry) => {
                const emp = employees.find((e) => e.id === entry.employeeId);
                const deductionsSum = entry.taxWithholding + entry.medicalInsurance + entry.retirementContribution;

                return (
                  <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium theme-text">
                      <div className="font-bold">{emp ? `${emp.firstName} ${emp.lastName}` : 'Staff'}</div>
                      <div className="text-[11px] theme-text-muted font-mono">{emp?.employeeId} · {emp?.department}</div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium theme-text">
                      {entry.regularHours.toFixed(1)}h (${entry.regularEarnings.toFixed(2)})
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-amber-600 dark:text-amber-400 font-medium">
                      {entry.overtimeHours > 0 ? `${entry.overtimeHours.toFixed(1)}h ($${entry.overtimeEarnings.toFixed(2)})` : '--'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold theme-text">
                      ${entry.grossPay.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-rose-600 dark:text-rose-400">
                      -${deductionsSum.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                      ${entry.netPay.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {emp && (
                        <button
                          onClick={() => setSelectedPaystub({ cycle: activeCycle, entry, employee: emp })}
                          className="p-1.5 rounded-lg border theme-border theme-surface theme-text hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors inline-flex items-center gap-1"
                          title="Generate official printable paystub"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className="text-[11px] font-medium hidden sm:inline">Voucher</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Cycle Modal */}
      {newCycleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl theme-surface border theme-border shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm theme-text">Initiate New Pay Cycle</h3>
            <form onSubmit={handleCreateNew} className="space-y-3 text-xs">
              <div>
                <label className="block theme-text-muted mb-1 font-semibold">Cycle Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block theme-text-muted mb-1 font-semibold">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono"
                  />
                </div>
                <div>
                  <label className="block theme-text-muted mb-1 font-semibold">End Date</label>
                  <input
                    type="date"
                    required
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block theme-text-muted mb-1 font-semibold">ACH Pay Date</label>
                <input
                  type="date"
                  required
                  value={newPayDate}
                  onChange={(e) => setNewPayDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t theme-border">
                <button
                  type="button"
                  onClick={() => setNewCycleModal(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: themeSettings.primaryColor }}
                >
                  Initialize Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Paystub Voucher Modal */}
      <PaystubModal />
    </div>
  );
};
