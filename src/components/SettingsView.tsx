import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Lock,
  KeyRound,
  Shield,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    pin,
    setPin,
    autoLockMinutes,
    setAutoLockMinutes,
    sensitiveDataMasked,
    toggleSensitiveMask,
    exportBackupJson,
    resetToDefaultData,
    themeSettings
  } = useApp();

  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [pinError, setPinError] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPinInput !== pin) {
      setPinError('Current master PIN does not match.');
      return;
    }
    if (newPinInput.length !== 4 || !/^\d{4}$/.test(newPinInput)) {
      setPinError('New PIN must be exactly 4 numeric digits.');
      return;
    }
    if (newPinInput !== confirmPinInput) {
      setPinError('New PIN and confirmation do not match.');
      return;
    }

    setPin(newPinInput);
    setPinSuccess(true);
    setPinError('');
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setTimeout(() => setPinSuccess(false), 3000);
  };

  const handleResetData = () => {
    resetToDefaultData();
    setConfirmReset(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div>
        <h2 className="text-xl font-extrabold tracking-tight theme-text">System Administration & Security Settings</h2>
        <p className="text-xs theme-text-muted mt-0.5">
          Master authentication PIN, auto-lock intervals, encrypted backups, and compliance policies
        </p>
      </div>

      {/* Security Credentials Card */}
      <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b theme-border pb-3">
          <KeyRound className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-sm theme-text">Master Security PIN Configuration</h3>
        </div>

        {pinSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Master security PIN successfully updated!</span>
          </div>
        )}

        {pinError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{pinError}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePin} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block theme-text-muted mb-1 font-semibold">Current PIN *</label>
            <input
              type="password"
              maxLength={4}
              required
              value={currentPinInput}
              onChange={(e) => setCurrentPinInput(e.target.value)}
              placeholder="••••"
              className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono tracking-widest text-center"
            />
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-semibold">New 4-Digit PIN *</label>
            <input
              type="password"
              maxLength={4}
              required
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              placeholder="••••"
              className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono tracking-widest text-center"
            />
          </div>

          <div>
            <label className="block theme-text-muted mb-1 font-semibold">Confirm New PIN *</label>
            <input
              type="password"
              maxLength={4}
              required
              value={confirmPinInput}
              onChange={(e) => setConfirmPinInput(e.target.value)}
              placeholder="••••"
              className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-mono tracking-widest text-center"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              Update Security PIN
            </button>
          </div>
        </form>
      </div>

      {/* Auto-Lock & Privacy Card */}
      <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b theme-border pb-3">
          <Clock className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-sm theme-text">Session Management & Inactivity Lock</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block theme-text font-semibold mb-1">Inactivity Auto-Lock Interval</label>
            <p className="text-[11px] theme-text-muted mb-2">Automatically lock the workspace after user inactivity</p>
            <select
              value={autoLockMinutes}
              onChange={(e) => setAutoLockMinutes(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-medium"
            >
              <option value={5}>5 Minutes of Inactivity</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>60 Minutes</option>
              <option value={0}>Disabled (Never Auto-lock)</option>
            </select>
          </div>

          <div>
            <label className="block theme-text font-semibold mb-1">Confidential Financial Data Masking</label>
            <p className="text-[11px] theme-text-muted mb-2">Mask employee banking accounts, routing numbers, and Tax IDs</p>
            <button
              onClick={toggleSensitiveMask}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border font-semibold transition-colors ${
                sensitiveDataMasked
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300'
                  : 'theme-surface-subtle theme-text border-slate-300'
              }`}
            >
              {sensitiveDataMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{sensitiveDataMasked ? 'Masking Active (Protected)' : 'Masking Off (Raw Data Visible)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Backup & Disaster Recovery */}
      <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b theme-border pb-3">
          <Download className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-sm theme-text">Encrypted Data Backup & Export</h3>
        </div>

        <p className="text-xs theme-text-muted">
          Download a complete, encrypted JSON archive containing all employees, shift allocations, punch timesheets, payroll cycles, and audit trails.
        </p>

        <button
          onClick={exportBackupJson}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
          style={{ backgroundColor: themeSettings.primaryColor }}
        >
          <Download className="w-4 h-4" />
          <span>Generate Full Encrypted System Backup (.json)</span>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-bold text-sm">Danger Zone: System Reset</h3>
        </div>

        <p className="text-xs text-rose-600 dark:text-rose-300">
          Reset all employee databases, timesheets, shifts, and payroll cycles back to default demo factory baseline.
        </p>

        {!confirmReset ? (
          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/40 dark:hover:bg-rose-900/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Initial Data</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleResetData}
              className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs"
            >
              Confirm Factory Reset
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
