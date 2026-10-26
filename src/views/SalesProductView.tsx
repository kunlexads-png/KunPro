import React, { useState, useEffect } from 'react';
import { ShoppingBag, TrendingUp, TrendingDown, DollarSign, Award, Layers } from 'lucide-react';
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

export const SalesProductView: React.FC = () => {
  const [salesData, setSalesData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.getSalesAnalytics()
      .then((res) => setSalesData(res))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !salesData) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading Sales & Product Matrix...</div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Sales & Product Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          SKU profitability, unit throughput, margin contribution, and catalog life-cycle status.
        </p>
      </div>

      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Top Revenue Generator</span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {salesData.topSellingProduct?.product}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono">
            <span className="text-emerald-600 font-bold">${salesData.topSellingProduct?.revenue.toLocaleString()}</span>
            <span className="text-slate-400">· Margin: {salesData.topSellingProduct?.margin}%</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-rose-500 font-medium">Underperforming Line</span>
          <p className="text-base font-bold text-slate-900 dark:text-white mt-1">
            {salesData.decliningProduct?.product}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs font-mono">
            <span className="text-rose-600 font-bold">Growth: {salesData.decliningProduct?.growthRate}%</span>
            <span className="text-slate-400">· Margin: {salesData.decliningProduct?.margin}%</span>
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500 font-medium">Total Recognized Revenue</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono tabular-nums">
            ${salesData.totalSales.toLocaleString()}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Full product catalog consolidated</span>
        </div>
      </div>

      {/* Product Breakdown Chart */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue vs. Cost by Product Line
            </h2>
            <p className="text-xs text-slate-500">Gross profit spread across core offerings</p>
          </div>
          <span className="text-xs font-mono text-slate-400">USD ($)</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={salesData.products} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.6} />
              <XAxis dataKey="product" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cost" name="COGS & Delivery Cost" fill="#94a3b8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Product Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Product Performance Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-3">Product Name</th>
                <th className="px-4 py-3 text-right">Units Sold</th>
                <th className="px-4 py-3 text-right">Revenue</th>
                <th className="px-4 py-3 text-right">Direct Cost</th>
                <th className="px-4 py-3 text-right">Gross Profit</th>
                <th className="px-4 py-3 text-right">Gross Margin</th>
                <th className="px-6 py-3 text-right">Growth Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
              {salesData.products.map((p: any) => (
                <tr key={p.product} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-3 font-sans font-medium text-slate-900 dark:text-white">
                    {p.product}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">
                    {p.units}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                    ${p.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-500">
                    ${p.cost.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                    ${p.profit.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-slate-800 dark:text-slate-200">
                    {p.margin}%
                  </td>
                  <td className="px-6 py-3 text-right font-sans">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        p.status === 'growing'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                      }`}
                    >
                      {p.growthRate > 0 ? `+${p.growthRate}%` : `${p.growthRate}%`}
                    </span>
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
