import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { MetricCard } from '../components/common/MetricCard';
import { OverviewMetrics, AnomalyItem, RecommendationItem } from '../types';
import { api } from '../services/api';
import { useFilters } from '../context/FilterContext';

import { useAuth } from '../context/AuthContext';

interface OverviewViewProps {
  onNavigate: (view: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { filters } = useFilters();
  const { user, requireRole, openLoginModal } = useAuth();
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null);
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      api.getOverviewMetrics({
        period: filters.dateRange,
        businessUnit: filters.businessUnit,
        region: filters.region,
      }),
      api.getAnomalies(),
      api.getRecommendations(),
    ])
      .then(([mRes, aRes, rRes]) => {
        if (!isMounted) return;
        setMetrics(mRes);
        setAnomalies(aRes);
        setRecommendations(rRes);
      })
      .catch((err) => {
        console.error('Failed to load overview data:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [filters.dateRange, filters.businessUnit, filters.region]);

  const activeAnomalies = anomalies.filter((a) => a.status === 'Open' || a.status === 'Investigating');
  const isViewer = user.role === 'Viewer';

  const handleGenerateReportClick = () => {
    if (requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'generate executive reports')) {
      onNavigate('reports');
    }
  };

  const handleAskAiClick = () => {
    if (requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'consult the AI Business Analyst')) {
      onNavigate('ai-analyst');
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-12 text-center">
        <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">No Dataset Active</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please upload or import a business dataset in the Data Management console to view real-time calculations.
        </p>
        <button
          onClick={() => onNavigate('data-management')}
          className="mt-4 px-4 py-2 text-xs font-medium text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg"
        >
          Go to Data Management
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Viewer Notice Banner if in Read-Only mode */}
      {isViewer && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Viewer Access
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              You are viewing in read-only mode. All dashboards, telemetry, and reports are available to inspect.
            </span>
          </div>
          <button
            onClick={() => openLoginModal('Super Admin, Business Owner, or Analyst credentials required.')}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sign In as Admin / Analyst
          </button>
        </div>
      )}

      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Executive Performance Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Period: {filters.dateRange.toUpperCase()} · Verified against PostgreSQL warehouse · Filtered by{' '}
            {filters.businessUnit === 'all' ? 'All Units' : filters.businessUnit}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerateReportClick}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Executive Report</span>
          </button>
          <button
            onClick={handleAskAiClick}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask AI Analyst</span>
          </button>
        </div>
      </div>

      {/* Critical Anomaly Alert Banner (if any) */}
      {activeAnomalies.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                {activeAnomalies.length} Critical Anomaly Detected
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                {activeAnomalies[0].metric}: observed value {activeAnomalies[0].observedValue.toLocaleString()} vs baseline{' '}
                {activeAnomalies[0].baselineValue.toLocaleString()} ({activeAnomalies[0].deviationPercent > 0 ? '+' : ''}
                {activeAnomalies[0].deviationPercent}% deviation).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('anomalies')}
            className="self-start sm:self-auto flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-200 bg-rose-100 dark:bg-rose-900/50 hover:bg-rose-200 rounded-lg transition-colors whitespace-nowrap"
          >
            <span>Review Root Cause</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Primary KPI Grid (8 metrics required) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard metric={metrics.totalRevenue} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard metric={metrics.totalExpenses} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard metric={metrics.netProfit} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard metric={metrics.profitMargin} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard metric={metrics.salesGrowth} icon={<TrendingUp className="w-4 h-4" />} />
        <MetricCard metric={metrics.customerCount} icon={<Users className="w-4 h-4" />} />
        <MetricCard metric={metrics.averageOrderValue} icon={<DollarSign className="w-4 h-4" />} />
        <MetricCard metric={metrics.conversionRate} icon={<TrendingUp className="w-4 h-4" />} />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue & Profit Trajectory Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue & Profit Trajectory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily actuals with recognized cash margin
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">USD ($)</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(d) => d.substring(5)}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                  labelFormatter={(l) => `Date: ${l}`}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Recognized Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  name="Net Profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorProf)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Category Contribution */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Revenue by Category
              </h2>
              <span className="text-xs text-slate-400">Share %</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Contribution to blended margin
            </p>

            <div className="space-y-4">
              {metrics.categoryPerformance.map((cat) => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{cat.category}</span>
                    <span className="text-slate-900 dark:text-white font-mono font-bold">
                      ${(cat.revenue / 1000).toFixed(1)}k ({cat.share.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 dark:bg-white rounded-full transition-all"
                      style={{ width: `${Math.min(100, cat.share)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
            <button
              onClick={() => onNavigate('sales')}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              <span>Explore SKU-Level Sales</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Strategic AI Recommendations Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              AI Actionable Recommendations
            </h2>
          </div>
          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            View All ({recommendations.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>{rec.category}</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    Confidence: {rec.confidenceScore}%
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{rec.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {rec.businessProblem}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {rec.expectedBenefit}
                </span>
                <span className="text-[11px] text-slate-400">Status: {rec.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
