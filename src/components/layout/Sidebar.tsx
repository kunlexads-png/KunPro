import React from 'react';
import {
  LayoutDashboard,
  Bot,
  Database,
  TrendingUp,
  AlertOctagon,
  Lightbulb,
  FileText,
  Users,
  ShoppingBag,
  DollarSign,
  BellRing,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isAi?: boolean;
  alert?: boolean;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'ANALYTICS & AI',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'ai-analyst', label: 'AI Analyst', icon: Bot, isAi: true },
        { id: 'reports', label: 'AI Reports', icon: FileText },
        { id: 'recommendations', label: 'Recommendations', icon: Lightbulb, badge: '4' },
      ],
    },
    {
      title: 'DIAGNOSTICS & DATA',
      items: [
        { id: 'trends', label: 'Trend Analysis', icon: TrendingUp },
        { id: 'anomalies', label: 'Anomaly & Risks', icon: AlertOctagon, alert: true, badge: '3' },
        { id: 'data-management', label: 'Data Management', icon: Database },
      ],
    },
    {
      title: 'BUSINESS DOMAINS',
      items: [
        { id: 'financial', label: 'Financial & P&L', icon: DollarSign },
        { id: 'sales', label: 'Sales & Products', icon: ShoppingBag },
        { id: 'customers', label: 'Customer Cohorts', icon: Users },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { id: 'notifications', label: 'Audit & Alerts', icon: BellRing },
        { id: 'settings', label: 'Settings & Team', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 select-none ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Subtitle / Collapse Button */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        {!isCollapsed && (
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Workspace Nav
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!isCollapsed && (
              <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                {section.title}
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                  } ${isCollapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive
                        ? 'text-white dark:text-slate-900'
                        : item.isAi
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : item.alert
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-left flex-1">{item.label}</span>
                  )}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                        item.alert
                          ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Status / Mode Info */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          {!isCollapsed && (
            <div className="truncate text-[11px]">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Engine Online</span>
              <span className="block text-[10px] text-slate-400">PostgreSQL · Gemini 3.8</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
