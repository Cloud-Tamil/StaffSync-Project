import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { AuditLog } from '../types.ts';
import {
  ShieldAlert,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Lock,
  UserCheck,
  Calendar,
  CircleDollarSign,
  Palette
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = ['All', 'SECURITY', 'EMPLOYEE', 'ATTENDANCE', 'SHIFT', 'PAYROLL', 'THEME'];

  const filtered = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search);
    const matchesCat = selectedCat === 'All' || log.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleDownloadLogs = () => {
    const headers = ['Timestamp', 'Actor', 'Role', 'Category', 'Action', 'Details', 'IP Address'];
    const rows = filtered.map((l) => [
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.category}"`,
      `"${l.action}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pulsehr_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h2 className="text-xl font-extrabold tracking-tight theme-text">Immutable Security & Audit Trail</h2>
          </div>
          <p className="text-xs theme-text-muted mt-0.5">
            Cryptographic ledger tracking authentication, shift overrides, wage recalculations, and administrative events
          </p>
        </div>

        <button
          onClick={handleDownloadLogs}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold theme-surface-subtle theme-text border theme-border hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log CSV</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl theme-surface border theme-border space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search audit trail by actor, IP address, action or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border theme-border theme-surface theme-text placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat
                  ? 'theme-primary-btn font-semibold shadow-xs'
                  : 'theme-surface-subtle theme-text hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl theme-surface border theme-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="theme-surface-subtle border-b theme-border text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Event Details</th>
                <th className="py-3 px-4 font-mono text-right">IP Stamped</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold theme-text">{log.actor}</span>
                    <span className="block text-[10px] theme-text-muted">{log.actorRole}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border theme-border">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold theme-text">{log.action}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-sm truncate">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 font-mono text-right text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
