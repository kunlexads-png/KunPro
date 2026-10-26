import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  CheckCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Filter,
  Check,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { AnomalyItem } from '../types';

import { useAuth } from '../context/AuthContext';

export const AnomalyDetectionView: React.FC = () => {
  const { user, requireRole, openLoginModal } = useAuth();
  const [anomalies, setAnomalies] = useState<AnomalyItem[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const isViewer = user.role === 'Viewer';

  const loadAnomalies = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAnomalies();
      setAnomalies(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAnomalies();
  }, []);

  const updateAnomalyStatus = (id: string, newStatus: AnomalyItem['status']) => {
    if (!requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'change anomaly workflow status')) {
      return;
    }
    setAnomalies((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const filtered = anomalies.filter((a) => {
    if (filterSeverity !== 'all' && a.severity.toLowerCase() !== filterSeverity.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Statistical Anomaly & Risk Detection
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Explainable mathematical outlier identification using Z-Score (2.5σ) and Interquartile Range (IQR) baselines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'critical', 'high', 'medium'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Viewer Notice Banner */}
      {isViewer && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Read-Only Risk Inspection
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Viewers can inspect all mathematical anomalies and root cause evidence. Sign in as Super Admin, Business Owner, or Analyst to manage investigation workflows.
            </span>
          </div>
          <button
            onClick={() => openLoginModal('Sign in to manage anomaly investigation workflows.')}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sign In to Manage
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Active Flags</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {anomalies.filter((a) => a.status === 'Open' || a.status === 'Investigating').length} Issues
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-rose-500 font-semibold">Critical Priority</span>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1 tabular-nums">
            {anomalies.filter((a) => a.severity === 'Critical').length} Outlier
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Statistical Method</span>
          <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-1">
            Z-Score + IQR
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">False Positive Rate</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            &lt; 0.5%
          </p>
        </div>
      </div>

      {/* Anomaly Cards Grid */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isCritical = item.severity === 'Critical';
          const isHigh = item.severity === 'High';
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCritical
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900'
                        : isHigh
                        ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900'
                    }`}
                  >
                    <AlertOctagon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.metric}
                      </h3>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Dimension: {item.dimension} · Detected: {item.detectedAt}
                    </p>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Workflow:</span>
                  {(['Open', 'Investigating', 'Resolved'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateAnomalyStatus(item.id, st)}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        item.status === st
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Statistical Evidence Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl text-xs">
                <div>
                  <span className="text-slate-400 block">Observed Metric:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {item.observedValue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Expected Baseline:</span>
                  <span className="font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                    {item.baselineValue.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Absolute Deviation:</span>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      item.deviationPercent > 0 ? 'text-rose-600' : 'text-amber-600'
                    }`}
                  >
                    {item.deviationPercent > 0 ? '+' : ''}
                    {item.deviationPercent}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Detection Formula:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{item.statisticalMethod}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-slate-900 dark:text-white">Explanation: </strong>
                  {item.description}
                </p>
                <p className="text-slate-700 dark:text-slate-300">
                  <strong className="text-indigo-600 dark:text-indigo-400">Recommended Investigation: </strong>
                  {item.recommendedAction}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
