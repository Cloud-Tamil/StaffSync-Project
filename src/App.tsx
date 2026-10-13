/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext.tsx';
import { Header } from './components/Header.tsx';
import { MobileNav } from './components/MobileNav.tsx';
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { EmployeeDirectory } from './components/EmployeeDirectory.tsx';
import { AttendanceTracker } from './components/AttendanceTracker.tsx';
import { ShiftScheduler } from './components/ShiftScheduler.tsx';
import { LeaveManagementView } from './components/LeaveManagementView.tsx';
import { PayrollManager } from './components/PayrollManager.tsx';
import { AuditLogViewer } from './components/AuditLogViewer.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { SecurityLockModal } from './components/SecurityLockModal.tsx';
import { QuickPunchKioskModal } from './components/QuickPunchKioskModal.tsx';
import { EmployeeProfileDrawer } from './components/EmployeeProfileDrawer.tsx';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal.tsx';

const AppShell: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col theme-bg theme-text transition-colors duration-200">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-12">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'directory' && <EmployeeDirectory />}
        {activeTab === 'attendance' && <AttendanceTracker />}
        {activeTab === 'shifts' && <ShiftScheduler />}
        {activeTab === 'leave' && <LeaveManagementView />}
        {activeTab === 'payroll' && <PayrollManager />}
        {activeTab === 'audit' && <AuditLogViewer />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <MobileNav />

      {/* Global Modals & Drawers */}
      <SecurityLockModal />
      <QuickPunchKioskModal />
      <EmployeeProfileDrawer />
      <ThemeCustomizerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
