import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ActiveTab, UserRole } from '../types.ts';
import {
  Clock,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Shield,
  Palette,
  Activity,
  CalendarDays,
  Users,
  CircleDollarSign,
  LayoutDashboard,
  ShieldAlert,
  Settings,
  CalendarCheck
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userRole,
    setUserRole,
    isLocked,
    lockApp,
    sensitiveDataMasked,
    toggleSensitiveMask,
    setPunchKioskOpen,
    setThemeModalOpen,
    themeSettings
  } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; roles?: UserRole[] }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'directory', label: 'Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'attendance', label: 'Attendance', icon: <Clock className="w-4 h-4" /> },
    { id: 'shifts', label: 'Shifts & Roster', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'leave', label: 'Time Off', icon: <CalendarCheck className="w-4 h-4" /> },
    { id: 'payroll', label: 'Payroll', icon: <CircleDollarSign className="w-4 h-4" />, roles: ['Admin', 'Supervisor'] },
    { id: 'audit', label: 'Audit Trail', icon: <ShieldAlert className="w-4 h-4" />, roles: ['Admin'] },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" />, roles: ['Admin'] },
  ];

  const visibleNav = navItems.filter((item) => !item.roles || item.roles.includes(userRole));

  return (
    <header className="sticky top-0 z-30 border-b theme-border theme-surface backdrop-blur-md bg-opacity-95 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0"
              style={{ backgroundColor: themeSettings.primaryColor }}
            >
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight theme-text">PulseHR</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border theme-border">
                  Enterprise
                </span>
              </div>
              <p className="text-[11px] theme-text-muted hidden sm:block">Workforce, Shifts & Payroll OS</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {visibleNav.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    isActive
                      ? 'theme-primary-badge font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                  }`}
                  style={isActive ? { color: themeSettings.primaryColor, backgroundColor: `${themeSettings.primaryColor}15` } : {}}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Controls */}
          <div className="flex items-center gap-2">
            {/* Quick Punch Kiosk */}
            <button
              onClick={() => setPunchKioskOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-sm hover:opacity-95 active:scale-98 transition-all"
              style={{ backgroundColor: themeSettings.primaryColor }}
              title="Open biometric live punch kiosk"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time Kiosk</span>
            </button>

            {/* Theme Customizer Trigger */}
            <button
              onClick={() => setThemeModalOpen(true)}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Customize App Colors & Theme"
              aria-label="Theme Customizer"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Privacy Mask Toggle */}
            <button
              onClick={toggleSensitiveMask}
              className={`p-2 rounded-lg transition-colors ${
                sensitiveDataMasked
                  ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={sensitiveDataMasked ? 'Confidential data masked (Click to reveal)' : 'Confidential data visible (Click to mask)'}
              aria-label="Toggle Data Masking"
            >
              {sensitiveDataMasked ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center border theme-border rounded-lg p-0.5 theme-surface-subtle">
              {(['Admin', 'Supervisor', 'Employee'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    userRole === role
                      ? 'theme-surface theme-text font-semibold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Lock Session */}
            <button
              onClick={lockApp}
              className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Lock Session (PIN 1234)"
              aria-label="Lock Session"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
