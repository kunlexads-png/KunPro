import React, { useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  FileText,
  Shield,
  Search,
  Check,
  Clock,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { NotificationItem, AuditLogItem } from '../types';

export const NotificationsView: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'audit'>('notifications');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [nRes, aRes] = await Promise.all([api.getNotifications(), api.getAuditLogs()]);
      setNotifications(nRes);
      setAuditLogs(aRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const markRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System Alerts & Security Audit Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable trace of automated telemetry events, data warehouse operations, and user governance actions.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'notifications'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Alerts & Notices ({notifications.filter((n) => !n.read).length} Unread)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'audit'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {activeTab === 'notifications' ? (
        <div className="space-y-3">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-4 bg-white dark:bg-slate-900 border rounded-xl flex items-start justify-between gap-4 transition-all ${
                item.read
                  ? 'border-slate-200 dark:border-slate-800 opacity-80'
                  : 'border-blue-200 dark:border-blue-900/50 bg-blue-50/20 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                    item.severity === 'critical'
                      ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                      : item.severity === 'success'
                      ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                      : 'bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
                  }`}
                >
                  {item.severity === 'critical' ? (
                    <AlertTriangle className="w-4 h-4" />
                  ) : item.severity === 'success' ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {item.title}
                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{item.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">{item.timestamp}</span>
                </div>
              </div>

              {!item.read && (
                <button
                  onClick={() => markRead(item.id)}
                  className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md whitespace-nowrap"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search audit trail by actor, action, resource..."
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs font-mono text-slate-400">
              {filteredLogs.length} Records Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-800/30 font-mono">
                  <th className="px-4 py-3">Timestamp (UTC)</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target Resource</th>
                  <th className="px-4 py-3">Source IP</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3 font-sans font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {log.actor}
                    </td>
                    <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {log.resource}
                    </td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{log.ipAddress}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-sans text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
