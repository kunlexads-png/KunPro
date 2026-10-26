import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { api } from '../services/api';
import { useFilters } from '../context/FilterContext';

export const TrendAnalysisView: React.FC = () => {
  const { filters } = useFilters();
  const [trendData, setTrendData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  const [granularity, setGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    setIsLoading(true);
    api.getTrends(filters.dateRange)
      .then((data) => setTrendData(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [filters.dateRange]);

  if (isLoading || !trendData) {
    return (
      <div className="p-8 space-y-6 animate-pulse max-w-7xl mx-auto">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-md w-1/3" />
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Trend & Longitudinal Analysis
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Period-over-period growth rates, smoothing moving averages, and statistical horizon forecasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium">
            <button
              onClick={() => setGranularity('daily')}
              className={`px-3 py-1 rounded-md transition-colors ${
                granularity === 'daily'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setGranularity('weekly')}
              className={`px-3 py-1 rounded-md transition-colors ${
                granularity === 'weekly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Weekly Rollup
            </button>
            <button
              onClick={() => setGranularity('monthly')}
              className={`px-3 py-1 rounded-md transition-colors ${
                granularity === 'monthly'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showSMA}
              onChange={(e) => setShowSMA(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Show 7-Day SMA</span>
          </label>
        </div>
      </div>

      {/* Main Historical Trend Chart with Moving Average */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue Velocity & Moving Average Smoothing
            </h2>
            <p className="text-xs text-slate-500">
              Evaluates underlying demand trajectory by neutralizing day-of-week seasonality
            </p>
          </div>
          <div className="text-right text-xs">
            <span className="text-slate-400">Current Velocity: </span>
            <span className="font-mono font-bold text-emerald-600">
              +{(trendData.periodComparison.growthRate).toFixed(1)}% vs Prior Cycle
            </span>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(d) => d.substring(5)} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Daily Actual Revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              {showSMA && (
                <Line
                  type="monotone"
                  dataKey="revenueSMA"
                  name="7-Day Simple Moving Avg (SMA)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}
              <Line
                type="monotone"
                dataKey="expenses"
                name="Operating Cost Actual"
                stroke="#ef4444"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Horizon Forecast Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Next-Cycle Horizon Projection (April 2026)
              </h2>
              <p className="text-xs text-slate-500">
                Projected trajectory with 90% confidence bands
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              Confidence: 90%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData.forecast} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(d) => d.substring(5)} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  name="Upper Confidence Band"
                  stroke="#c4b5fd"
                  strokeDasharray="2 2"
                  fill="transparent"
                />
                <Area
                  type="monotone"
                  dataKey="forecastedRevenue"
                  name="Expected Trajectory"
                  stroke="#8b5cf6"
                  strokeWidth={2.5}
                  fill="url(#colorForecast)"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  name="Lower Confidence Band"
                  stroke="#c4b5fd"
                  strokeDasharray="2 2"
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Methodology & Limitations Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Info className="w-4 h-4 text-blue-500" />
              <span>Statistical Methodology</span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {trendData.methodology}
            </p>

            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
              <strong className="block font-semibold">Scientific Rigor Note:</strong>
              <span>
                Forecasts are mathematical extrapolations of historical observations and do not account for external macroeconomic disruptions or sudden regulatory changes.
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            Baseline Coverage: 1,842 clean historical transactions
          </div>
        </div>
      </div>
    </div>
  );
};
