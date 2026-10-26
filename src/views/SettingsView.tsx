import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Shield,
  Building,
  Key,
  Check,
  Save,
  RefreshCw,
  Sliders,
  Database,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, UserRole } from '../types';

export const SettingsView: React.FC = () => {
  const { user, organization, logout, requireRole, openLoginModal } = useAuth();
  const [orgName, setOrgName] = useState(organization?.name || '');
  const [currency, setCurrency] = useState(organization?.currency || 'USD ($)');
  const [timezone, setTimezone] = useState(organization?.timezone || 'America/New_York (UTC-5)');
  const [fiscalYear, setFiscalYear] = useState(organization?.fiscalYearStart || 'January');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isViewer = user.role === 'Viewer';

  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  useEffect(() => {
    api.getOrganization().then((res) => {
      if (res.members) setTeamMembers(res.members);
    });
  }, []);

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireRole(['Super Admin', 'Business Owner'], 'modify organization legal or fiscal parameters')) {
      return;
    }
    setIsSaving(true);
    try {
      await api.updateOrgSettings({
        name: orgName,
        currency,
        timezone,
        fiscalYearStart: fiscalYear,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const rolePermissions: Record<UserRole, string[]> = {
    'Super Admin': ['Full System Administration', 'Manage Billing & Subscriptions', 'Upload & Delete Datasets', 'Generate Reports & Analyses', 'Manage Team & Assign Roles'],
    'Business Owner': ['View All Dashboards', 'Upload & Validate Datasets', 'Generate Reports & Export CSVs', 'Manage Organization Settings'],
    'Analyst': ['View All Dashboards', 'Upload Datasets', 'Execute AI Business Analyst Queries', 'Generate Reports & Export CSVs'],
    'Viewer': ['Read-Only View of Dashboards & Published Reports'],
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Settings & Role Governance
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Multi-tenant tenant parameters, RBAC authorization matrix, and data access policies.
        </p>
      </div>

      {/* Viewer Notice Banner */}
      {isViewer && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Read-Only Governance
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              You are currently viewing in Viewer mode. Sign in as Super Admin or Business Owner to configure organization parameters.
            </span>
          </div>
          <button
            onClick={() => openLoginModal('Sign in as Super Admin or Business Owner to manage settings.')}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sign In as Admin
          </button>
        </div>
      )}

      {/* User Profile Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span>Active Authenticated Profile</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-white">
                {user?.name?.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
              <span className="text-[11px] font-mono font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
                Assigned Role: {user?.role}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isViewer ? (
              <button
                onClick={() => openLoginModal('Please log in with your email and password.')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In with Corporate Account
              </button>
            ) : (
              <button
                onClick={() => logout()}
                className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Permissions Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Role-Based Access Control (RBAC) Matrix</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Backend Enforced</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(rolePermissions) as UserRole[]).map((r) => (
            <div
              key={r}
              className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                user?.role === r
                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60'
                  : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{r}</span>
                {user?.role === r && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold">
                    Current
                  </span>
                )}
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                {rolePermissions[r].map((perm, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{perm}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Organization Parameters Form */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-slate-500" />
          <span>Tenant Organization Configuration</span>
        </h2>

        <form onSubmit={handleSaveOrg} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization Legal Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="USD ($)">USD ($) - United States Dollar</option>
                <option value="EUR (€)">EUR (€) - Eurozone</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Reporting Timezone
              </label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fiscal Year Start Month
              </label>
              <select
                value={fiscalYear}
                onChange={(e) => setFiscalYear(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="January">January (Calendar Year)</option>
                <option value="April">April (UK / Commonwealth Cycle)</option>
                <option value="July">July (Mid-Year Cycle)</option>
                <option value="October">October (US Federal Cycle)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            {saveSuccess ? (
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Parameters updated successfully.
              </span>
            ) : (
              <span className="text-xs text-slate-400">Settings are persisted immediately to the tenant store.</span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Parameters'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
