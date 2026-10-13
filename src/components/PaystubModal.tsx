import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Printer, Download, CheckCircle2, Building, ShieldCheck } from 'lucide-react';

export const PaystubModal: React.FC = () => {
  const { selectedPaystub, setSelectedPaystub, sensitiveDataMasked, themeSettings } = useApp();

  if (!selectedPaystub) return null;

  const { cycle, entry, employee } = selectedPaystub;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl theme-surface border theme-border shadow-2xl overflow-hidden flex flex-col my-8 print:m-0 print:border-none print:shadow-none print:w-full">
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border print:hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm tracking-tight theme-text">Official Earnings Statement Voucher</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setSelectedPaystub(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paystub Voucher Area */}
        <div className="p-8 space-y-6 bg-white text-slate-900 font-sans print:p-0">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">PulseHR Enterprise</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 text-white">Payroll OS</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">Global Workforce Operations & Compensation Systems</p>
              <p className="text-[11px] text-slate-500 font-mono">EIN: 12-8947291 · ACH Originator ID: 948271049</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold uppercase text-slate-500">Paystub Voucher</span>
              <p className="text-base font-extrabold font-mono text-slate-900">{entry.transactionRef || 'ACH-948210'}</p>
              <p className="text-xs text-slate-600 font-mono">Disbursed: {cycle.payDate}</p>
            </div>
          </div>

          {/* Employee & Pay Period Information */}
          <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Employee Information</p>
              <p className="font-bold text-sm text-slate-900">{employee.firstName} {employee.lastName}</p>
              <p className="text-slate-600 font-mono">ID: {employee.employeeId} · {employee.designation}</p>
              <p className="text-slate-600">Dept: {employee.department}</p>
              <p className="text-slate-500 font-mono mt-1">
                Account: {sensitiveDataMasked ? employee.compensation.accountNumberMasked : employee.compensation.accountNumberRaw || employee.compensation.accountNumberMasked}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pay Period Summary</p>
              <p className="font-bold text-slate-900">{cycle.title}</p>
              <p className="text-slate-600 font-mono">{cycle.startDate} through {cycle.endDate}</p>
              <p className="text-slate-600">Disbursement: {entry.paymentMethod}</p>
              <p className="text-emerald-700 font-bold font-mono">Status: {entry.status}</p>
            </div>
          </div>

          {/* Earnings Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Earnings Breakdown</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Pay Type</th>
                    <th className="py-2 px-3 font-semibold text-right">Hours</th>
                    <th className="py-2 px-3 font-semibold text-right">Hourly Rate</th>
                    <th className="py-2 px-3 font-semibold text-right">Total Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-medium">Regular Work Hours</td>
                    <td className="py-2 px-3 text-right font-mono">{entry.regularHours.toFixed(1)}</td>
                    <td className="py-2 px-3 text-right font-mono">
                      ${(entry.regularEarnings / (entry.regularHours || 1)).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-semibold">${entry.regularEarnings.toFixed(2)}</td>
                  </tr>
                  {entry.overtimeHours > 0 && (
                    <tr>
                      <td className="py-2 px-3 font-medium text-amber-700">Overtime (1.5x Premium)</td>
                      <td className="py-2 px-3 text-right font-mono">{entry.overtimeHours.toFixed(1)}</td>
                      <td className="py-2 px-3 text-right font-mono">
                        ${((entry.regularEarnings / (entry.regularHours || 1)) * 1.5).toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-amber-700">
                        ${entry.overtimeEarnings.toFixed(2)}
                      </td>
                    </tr>
                  )}
                  {entry.bonuses.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2 px-3 font-medium text-emerald-700">{b.description}</td>
                      <td className="py-2 px-3 text-right font-mono">--</td>
                      <td className="py-2 px-3 text-right font-mono">--</td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-700">+${b.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={3} className="py-2 px-3 text-slate-800">Total Gross Earnings</td>
                    <td className="py-2 px-3 text-right font-mono text-slate-900">${entry.grossPay.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Deductions & Statutory Withholdings */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Statutory Deductions & Taxes</h4>
            <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 font-semibold">Withholding Item</th>
                    <th className="py-2 px-3 font-semibold">Description</th>
                    <th className="py-2 px-3 font-semibold text-right">Amount Deducted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3 font-medium">Statutory Federal & State Income Tax</td>
                    <td className="py-2 px-3 text-slate-500">Effective Withholding Rate: {cycle.taxRatePercent}%</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700 font-semibold">-${entry.taxWithholding.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">Employer Group Medical & Dental</td>
                    <td className="py-2 px-3 text-slate-500">Comprehensive Pre-tax Benefit</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700 font-semibold">-${entry.medicalInsurance.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-medium">401(k) Retirement Savings Contribution</td>
                    <td className="py-2 px-3 text-slate-500">Retirement Annuity Trust</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700 font-semibold">-${entry.retirementContribution.toFixed(2)}</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={2} className="py-2 px-3 text-slate-800">Total Deductions & Taxes</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700">
                      -${(entry.taxWithholding + entry.medicalInsurance + entry.retirementContribution).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Net Pay Callout */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center">
            <div>
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Net Take-Home Pay</span>
              <span className="text-[11px] text-slate-400">Electronically transferred to {employee.compensation.bankName}</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold font-mono tracking-tight text-emerald-400">
                ${entry.netPay.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="text-center pt-2 border-t border-slate-200">
            <p className="text-[10px] text-slate-500">
              This is a computer-generated voucher issued by PulseHR Enterprise. Keep this statement for personal tax records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
