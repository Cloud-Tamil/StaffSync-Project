import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ShieldAlert, Fingerprint, Delete, CheckCircle2, Lock } from 'lucide-react';

export const SecurityLockModal: React.FC = () => {
  const { isLocked, unlockWithPin, themeSettings } = useApp();
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isLocked) return null;

  const handleDigit = (digit: string) => {
    if (pinInput.length >= 4) return;
    const next = pinInput + digit;
    setPinInput(next);
    setErrorMsg('');

    if (next.length === 4) {
      const ok = unlockWithPin(next);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          setPinInput('');
          setSuccess(false);
        }, 300);
      } else {
        setErrorMsg('Incorrect security PIN. Please retry');
        setTimeout(() => {
          setPinInput('');
        }, 600);
      }
    }
  };

  const handleDelete = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleBiometric = () => {
    setSuccess(true);
    setTimeout(() => {
      unlockWithPin('1234');
      setPinInput('');
      setSuccess(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl p-6 sm:p-8 theme-surface border theme-border shadow-2xl text-center">
        <div
          className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white mb-4 shadow-md"
          style={{ backgroundColor: themeSettings.primaryColor }}
        >
          {success ? <CheckCircle2 className="w-7 h-7" /> : <Lock className="w-7 h-7" />}
        </div>

        <h2 className="text-xl font-bold tracking-tight theme-text">PulseHR Session Locked</h2>
        <p className="text-xs theme-text-muted mt-1">Enter your 4-digit Master PIN or use biometrics to resume</p>

        {/* PIN Indicators */}
        <div className="flex justify-center gap-3 my-6">
          {[0, 1, 2, 3].map((idx) => {
            const filled = pinInput.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  filled
                    ? 'scale-110 shadow-xs'
                    : 'border-2 theme-border bg-slate-100 dark:bg-slate-800'
                }`}
                style={filled ? { backgroundColor: themeSettings.primaryColor } : {}}
              />
            );
          })}
        </div>

        {errorMsg && (
          <p className="text-xs font-medium text-red-500 mb-4 animate-shake">{errorMsg}</p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-12 rounded-xl text-lg font-semibold theme-surface-subtle theme-text hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleBiometric}
            className="h-12 rounded-xl flex items-center justify-center text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 active:scale-95 transition-all"
            title="Biometric Passkey"
            aria-label="Biometric Passkey"
          >
            <Fingerprint className="w-6 h-6" />
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-12 rounded-xl text-lg font-semibold theme-surface-subtle theme-text hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-12 rounded-xl flex items-center justify-center theme-surface-subtle text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all"
            title="Backspace"
            aria-label="Backspace"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Biometric Instant Bypass */}
        <button
          onClick={handleBiometric}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border theme-border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors theme-text"
        >
          <Fingerprint className="w-4 h-4 text-emerald-500" />
          <span>Biometric Passkey / Instant Unlock (Default PIN: 1234)</span>
        </button>
      </div>
    </div>
  );
};
