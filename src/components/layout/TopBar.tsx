import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  ChevronDown,
  Lock,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFilters } from '../../context/FilterContext';

interface TopBarProps {
  onNavigate: (view: string) => void;
  currentView: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onNavigate }) => {
  const { user, organization, logout, openLoginModal } = useAuth();
  const { filters, setDateRange, setBusinessUnit, setRegion } = useFilters();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isViewer = user.role === 'Viewer';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Single Brand Wordmark element */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onNavigate('overview')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <span>Cerebro BI</span>
        </button>
        <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 font-mono">
          / {organization?.name || 'Enterprise'}
        </span>
      </div>

      {/* Zone 2: Contextual Global Filters & Date Selector */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        {/* Date Range Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 text-xs font-medium">
          {(['7d', '30d', '90d', 'ytd'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                filters.dateRange === range
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Business Unit Selector */}
        <div className="relative">
          <select
            value={filters.businessUnit}
            onChange={(e) => setBusinessUnit(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Business Units</option>
            <option value="Global Enterprise">Global Enterprise</option>
            <option value="Mid-Market Solutions">Mid-Market Solutions</option>
            <option value="Direct Commercial">Direct Commercial</option>
          </select>
        </div>

        {/* Region Selector */}
        <div className="relative">
          <select
            value={filters.region}
            onChange={(e) => setRegion(e.target.value)}
            className="text-xs bg-slate-100 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Regions</option>
            <option value="North America">North America</option>
            <option value="Europe">Europe</option>
            <option value="Asia Pacific">Asia Pacific</option>
            <option value="Latin America">Latin America</option>
          </select>
        </div>
      </div>

      {/* Zone 3: Authentication, Notifications & User Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          title="Toggle Light/Dark Theme"
          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-900 dark:text-white">
                <span>System Notifications</span>
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate('notifications');
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-2 mt-2">
                <div
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate('anomalies');
                  }}
                  className="p-2 text-xs rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 cursor-pointer hover:opacity-90"
                >
                  <p className="font-semibold text-rose-700 dark:text-rose-400">Critical Cost Anomaly</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">Singapore egress surged +82.6% over baseline.</p>
                </div>
                <div
                  onClick={() => {
                    setShowNotifMenu(false);
                    onNavigate('reports');
                  }}
                  className="p-2 text-xs rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 cursor-pointer hover:opacity-90"
                >
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Executive Report Ready</p>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">March 2026 Monthly Management Review generated.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Auth State Control */}
        {isViewer ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
              Viewer Mode
            </span>
            <button
              onClick={() => openLoginModal('Please sign in with your corporate email and password.')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          </div>
        ) : (
          /* Authenticated user menu (Super Admin, Business Owner, or Analyst) */
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-5 h-5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              )}
              <div className="text-left">
                <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                  {user.name}
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono block leading-tight">
                  {user.role}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-1" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                <div className="px-3 py-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-[11px] text-slate-400">{user.email}</p>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold mt-1 inline-block">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Account & Governance</span>
                  </button>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
