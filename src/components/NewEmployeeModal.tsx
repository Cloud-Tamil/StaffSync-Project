import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { EmploymentType, PayType } from '../types.ts';
import { X, UserPlus, Shield, AlertCircle } from 'lucide-react';

interface NewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewEmployeeModal: React.FC<NewEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addEmployee, shifts, themeSettings } = useApp();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    employmentType: 'Full-time' as EmploymentType,
    joinDate: new Date().toISOString().split('T')[0],
    assignedShiftId: shifts[0]?.id || 'shift-morning',
    payType: 'Hourly' as PayType,
    rate: 45,
    standardHoursPerWeek: 40,
    bankName: 'JPMorgan Chase',
    accountNumber: '948271049281',
    routingNumber: '021000021',
    taxId: '982-44-1294',
    emergencyName: '',
    emergencyRelationship: 'Spouse',
    emergencyPhone: ''
  });

  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.designation) {
      setError('Please complete all required fields.');
      return;
    }

    const empIdNum = Math.floor(1000 + Math.random() * 9000);
    const employeeId = `EMP-${empIdNum}`;
    const mask = (num: string) => `••••••••${num.slice(-4)}`;

    addEmployee({
      employeeId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      department: formData.department,
      designation: formData.designation,
      employmentType: formData.employmentType,
      status: 'Active',
      joinDate: formData.joinDate,
      assignedShiftId: formData.assignedShiftId,
      ptoBalanceDays: 15,
      compensation: {
        payType: formData.payType,
        rate: Number(formData.rate) || 40,
        standardHoursPerWeek: Number(formData.standardHoursPerWeek) || 40,
        bankName: formData.bankName,
        accountNumberMasked: mask(formData.accountNumber),
        accountNumberRaw: formData.accountNumber,
        routingNumberMasked: mask(formData.routingNumber),
        taxIdMasked: `•••-••-${formData.taxId.slice(-4)}`
      },
      emergencyContact: {
        name: formData.emergencyName || 'Primary Contact',
        relationship: formData.emergencyRelationship || 'Family',
        phone: formData.emergencyPhone || '+1 (555) 123-4567'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl theme-surface border theme-border shadow-2xl flex flex-col my-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight theme-text">Register New Employee</h3>
              <p className="text-[11px] theme-text-muted">Enter workforce profile, shift allocation, and payroll credentials</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Basic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold theme-text mb-1">First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="Jane"
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              />
            </div>
            <div>
              <label className="block font-semibold theme-text mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold theme-text mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="jane.doe@pulsehr.internal"
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              />
            </div>
            <div>
              <label className="block font-semibold theme-text mb-1">Phone Number</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 349-2810"
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              />
            </div>
          </div>

          {/* Department & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold theme-text mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              >
                {['Engineering', 'Operations', 'Finance', 'Human Resources', 'Sales & Marketing', 'Customer Support'].map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold theme-text mb-1">Job Designation *</label>
              <input
                type="text"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Senior Backend Architect"
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              />
            </div>
            <div>
              <label className="block font-semibold theme-text mb-1">Employment Type</label>
              <select
                value={formData.employmentType}
                onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
              >
                {['Full-time', 'Part-time', 'Contract', 'Intern'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Shift Template Allocation */}
          <div className="text-xs">
            <label className="block font-semibold theme-text mb-1">Assigned Shift Policy</label>
            <select
              value={formData.assignedShiftId}
              onChange={(e) => setFormData({ ...formData, assignedShiftId: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text"
            >
              {shifts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}: {s.startTime} - {s.endTime})
                </option>
              ))}
            </select>
          </div>

          {/* Compensation */}
          <div className="p-4 rounded-xl theme-surface-subtle border theme-border space-y-3 text-xs">
            <span className="font-bold theme-text block">Compensation & Direct Deposit Structure</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block theme-text-muted mb-1">Pay Type</label>
                <select
                  value={formData.payType}
                  onChange={(e) => setFormData({ ...formData, payType: e.target.value as PayType })}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text"
                >
                  <option value="Hourly">Hourly Rate</option>
                  <option value="Salaried">Salaried Monthly</option>
                </select>
              </div>
              <div>
                <label className="block theme-text-muted mb-1">Rate ($)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.rate}
                  onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text font-mono"
                />
              </div>
              <div>
                <label className="block theme-text-muted mb-1">Bank Name</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block theme-text-muted mb-1">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text font-mono"
                />
              </div>
              <div>
                <label className="block theme-text-muted mb-1">Tax ID / SSN</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border theme-border theme-surface theme-text font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-98"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
