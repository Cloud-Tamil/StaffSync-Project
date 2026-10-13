import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Employee, EmploymentType, EmployeeStatus } from '../types.ts';
import {
  Search,
  UserPlus,
  LayoutGrid,
  Table as TableIcon,
  Download,
  Building2,
  Mail,
  Phone,
  ChevronRight,
  Filter
} from 'lucide-react';
import { NewEmployeeModal } from './NewEmployeeModal.tsx';

export const EmployeeDirectory: React.FC = () => {
  const { employees, setSelectedEmployee, exportCsv, themeSettings } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [newModalOpen, setNewModalOpen] = useState(false);

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight theme-text">Workforce Directory</h2>
          <p className="text-xs theme-text-muted mt-0.5">
            Personnel register, compensation policies, and shift assignments ({filtered.length} staff members)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCsv('employees')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={() => setNewModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-transform active:scale-98"
            style={{ backgroundColor: themeSettings.primaryColor }}
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Employee</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl theme-surface border theme-border space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID (e.g. EMP-1001), department, designation..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border theme-border theme-surface theme-text placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl border theme-border theme-surface theme-text font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center border theme-border rounded-xl p-0.5 theme-surface-subtle">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'theme-surface theme-text shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table view"
            >
              <TableIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'cards' ? 'theme-surface theme-text shadow-xs' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 pt-1">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedDept === dept
                  ? 'theme-primary-btn font-semibold shadow-xs'
                  : 'theme-surface-subtle theme-text hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Content Display */}
      {viewMode === 'table' ? (
        <div className="rounded-2xl theme-surface border theme-border shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="theme-surface-subtle border-b theme-border text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Department & Role</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Compensation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border">
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => setSelectedEmployee(emp)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ backgroundColor: emp.avatarBgColor || themeSettings.primaryColor }}
                        >
                          {emp.firstName[0]}
                          {emp.lastName[0]}
                        </div>
                        <div>
                          <div className="font-bold theme-text">
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div className="text-[11px] theme-text-muted font-mono">{emp.employeeId} · {emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium theme-text">{emp.designation}</div>
                      <div className="text-[11px] theme-text-muted">{emp.department}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium theme-text">{emp.employmentType}</span>
                      <div className="text-[11px] theme-text-muted">PTO: {emp.ptoBalanceDays}d</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium theme-text">
                      ${emp.compensation.rate.toFixed(2)} / {emp.compensation.payType === 'Hourly' ? 'hr' : 'mo'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          emp.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((emp) => (
            <div
              key={emp.id}
              onClick={() => setSelectedEmployee(emp)}
              className="p-5 rounded-2xl theme-surface border theme-border hover:shadow-md cursor-pointer transition-all space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: emp.avatarBgColor || themeSettings.primaryColor }}
                  >
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm theme-text">
                      {emp.firstName} {emp.lastName}
                    </h4>
                    <p className="text-[11px] theme-text-muted font-mono">{emp.employeeId}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    emp.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {emp.status}
                </span>
              </div>

              <div className="text-xs space-y-1 pt-1 border-t theme-border">
                <p className="font-semibold theme-text">{emp.designation}</p>
                <p className="text-slate-500">{emp.department} · {emp.employmentType}</p>
                <p className="font-mono text-slate-700 dark:text-slate-300 font-medium">
                  ${emp.compensation.rate.toFixed(2)} ({emp.compensation.payType})
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Employee Modal Drawer */}
      <NewEmployeeModal isOpen={newModalOpen} onClose={() => setNewModalOpen(false)} />
    </div>
  );
};
