import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart as PieIcon, TrendingUp, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../services/api';

export const FinancialAnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getFinancialAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !data) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Financial Ledger...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Financial Analytics & P&L Statement
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Audited EBITDA margins, operating expense structure, and budget variance ledger.
        </p>
      </div>

      {/* Top Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Gross Profit</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            ${data.grossProfit.toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-semibold font-mono mt-0.5 block">
            {data.grossMargin}% Gross Margin
          </span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Total Operating Expenses</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            ${data.totalOpex.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 mt-0.5 block">R&D, S&M, and G&A</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Adjusted EBITDA</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 font-mono tabular-nums">
            ${data.ebitda.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 mt-0.5 block">Operating Cash Generation</span>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Net Income</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            ${Math.round(data.netIncome).toLocaleString()}
          </p>
          <span className="text-xs text-emerald-600 font-semibold font-mono mt-0.5 block">
            {data.netMargin}% Net Margin
          </span>
        </div>
      </div>

      {/* P&L Statement Table & OpEx Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* P&L Summary */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Consolidated Profit & Loss (P&L) Summary
          </h2>

          <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="flex justify-between py-2 font-medium">
              <span className="text-slate-800 dark:text-slate-200">Gross Recognized Revenue</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">${data.revenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-400">
              <span>Cost of Goods Sold (COGS & Cloud Infrastructure)</span>
              <span className="font-mono text-rose-600">(${data.cogs.toLocaleString()})</span>
            </div>
            <div className="flex justify-between py-2.5 font-bold bg-slate-50 dark:bg-slate-800/40 px-2 rounded-md">
              <span className="text-slate-900 dark:text-white">Gross Profit</span>
              <span className="font-mono text-emerald-600">${data.grossProfit.toLocaleString()} ({data.grossMargin}%)</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-400 pl-4">
              <span>Research & Development (R&D)</span>
              <span className="font-mono">(${data.operatingExpenses.researchAndDevelopment.toLocaleString()})</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-400 pl-4">
              <span>Sales & Marketing (S&M)</span>
              <span className="font-mono">(${data.operatingExpenses.salesAndMarketing.toLocaleString()})</span>
            </div>
            <div className="flex justify-between py-2 text-slate-600 dark:text-slate-400 pl-4">
              <span>General & Administrative (G&A)</span>
              <span className="font-mono">(${data.operatingExpenses.generalAndAdministrative.toLocaleString()})</span>
            </div>
            <div className="flex justify-between py-2.5 font-bold bg-slate-50 dark:bg-slate-800/40 px-2 rounded-md">
              <span className="text-slate-900 dark:text-white">Operating EBITDA</span>
              <span className="font-mono text-emerald-600">${data.ebitda.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 text-slate-500 pl-4">
              <span>Provision for Corporate Taxes (18% Effective)</span>
              <span className="font-mono">(${Math.round(data.ebitda * 0.18).toLocaleString()})</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-sm bg-indigo-50/50 dark:bg-indigo-950/20 px-2 rounded-md text-indigo-950 dark:text-indigo-200">
              <span>Net Recognized Income</span>
              <span className="font-mono font-bold">${Math.round(data.netIncome).toLocaleString()} ({data.netMargin}%)</span>
            </div>
          </div>
        </div>

        {/* Budget vs Actual Variance Ledger */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Budget vs. Actual Variance
            </h2>
            <span className="text-xs text-slate-400">Tolerance: ±10%</span>
          </div>

          <div className="space-y-4 text-xs">
            {data.budgetVariance.map((b: any) => {
              const isOver = b.variance > 0;
              return (
                <div key={b.category} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1.5">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-900 dark:text-white">{b.category}</span>
                    <span
                      className={`font-mono font-bold ${
                        b.category === 'Revenue'
                          ? isOver ? 'text-emerald-600' : 'text-rose-600'
                          : isOver ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {b.variancePct > 0 ? `+${b.variancePct}%` : `${b.variancePct}%`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                    <span>Budget: ${b.budget.toLocaleString()}</span>
                    <span>Actual: ${b.actual.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[11px] text-slate-400">
            * Accounting note: Financial records are synced directly with the ERP general ledger.
          </div>
        </div>
      </div>
    </div>
  );
};
