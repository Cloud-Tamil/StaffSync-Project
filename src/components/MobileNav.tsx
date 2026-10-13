import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ActiveTab, UserRole } from '../types.ts';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  CircleDollarSign,
  CalendarCheck
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, userRole, themeSettings } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; roles?: UserRole[] }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'directory', label: 'Staff', icon: <Users className="w-5 h-5" /> },
    { id: 'attendance', label: 'Timesheet', icon: <Clock className="w-5 h-5" /> },
    { id: 'shifts', label: 'Roster', icon: <CalendarDays className="w-5 h-5" /> },
    { id: 'leave', label: 'Leave', icon: <CalendarCheck className="w-5 h-5" /> },
    { id: 'payroll', label: 'Payroll', icon: <CircleDollarSign className="w-5 h-5" />, roles: ['Admin', 'Supervisor'] },
  ];

  const visibleNav = navItems.filter((item) => !item.roles || item.roles.includes(userRole));

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t theme-border theme-surface backdrop-blur-lg bg-opacity-95 shadow-lg safe-area-pb">
      <div className="grid grid-flow-col auto-cols-fr items-center px-1 py-1.5 min-h-[58px]">
        {visibleNav.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
              style={isActive ? { color: themeSettings.primaryColor } : { color: 'var(--app-text-muted)' }}
            >
              <div className="relative">
                {item.icon}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ backgroundColor: themeSettings.primaryColor }}
                  />
                )}
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
