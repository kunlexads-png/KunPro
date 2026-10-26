import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, DollarSign, Award, ArrowUpRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { api } from '../services/api';

export const CustomerAnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getCustomerAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Customer Intelligence...</div>;
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#64748b'];

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Customer Analytics & Cohorts
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          RFM segmentation, retention decay matrix, and estimated customer lifetime value (LTV).
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Active B2B Customers</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {data.totalCustomers} Accounts
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Repeat Purchase Rate</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {data.repeatPurchaseRate}%
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Average Account LTV</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            ${data.averageCustomerLifetimeValue.toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Predicted Churn Exposure</span>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {data.churnRiskRate}%
          </p>
        </div>
      </div>

      {/* RFM Segmentation & Cohorts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFM Segmentation Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              RFM Account Segmentation
            </h2>
            <span className="text-xs text-slate-400">Revenue Share</span>
          </div>

          <div className="space-y-4">
            {data.segments.map((seg: any, idx: number) => (
              <div key={seg.name} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{seg.name}</span>
                  <span className="font-mono text-slate-500">
                    {seg.count} accounts · Avg LTV: ${seg.avgLtv.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${seg.revenueShare}%`,
                      backgroundColor: COLORS[idx % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Retention Matrix */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Quarterly Retention Decay (%)
            </h2>
            <span className="text-xs text-slate-400">Cohort Survival</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2">Cohort</th>
                  <th className="py-2 text-right">M0</th>
                  <th className="py-2 text-right">M3</th>
                  <th className="py-2 text-right">M6</th>
                  <th className="py-2 text-right">M9</th>
                  <th className="py-2 text-right">M12</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {data.retentionCohorts.map((c: any) => (
                  <tr key={c.cohort} className="font-mono tabular-nums">
                    <td className="py-2.5 font-sans font-medium text-slate-800 dark:text-slate-200">{c.cohort}</td>
                    <td className="py-2.5 text-right text-emerald-600 font-bold">{c.m0}%</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">{c.m3 ? `${c.m3}%` : '-'}</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">{c.m6 ? `${c.m6}%` : '-'}</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">{c.m9 ? `${c.m9}%` : '-'}</td>
                    <td className="py-2.5 text-right text-slate-600 dark:text-slate-300">{c.m12 ? `${c.m12}%` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
