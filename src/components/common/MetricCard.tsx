import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { KpiMetric } from '../../types';

interface MetricCardProps {
  metric: KpiMetric;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, icon, onClick }) => {
  const isPositive = metric.percentageChange > 0;
  const isZero = metric.percentageChange === 0;

  // Formatting value
  const formattedValue = () => {
    if (metric.format === 'currency') {
      return `$${metric.currentValue.toLocaleString()}`;
    }
    if (metric.format === 'percentage') {
      return `${metric.currentValue.toFixed(1)}%`;
    }
    return metric.currentValue.toLocaleString();
  };

  const isGood = metric.isPositiveGood ? isPositive : !isPositive;

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl transition-all duration-150 ${
        onClick ? 'cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs' : ''
      }`}
    >
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
        <span className="text-xs font-medium tracking-wide uppercase">{metric.title}</span>
        {icon && <div className="text-slate-400 dark:text-slate-500">{icon}</div>}
      </div>

      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
          {formattedValue()}
        </div>

        <div
          className={`flex items-center text-xs font-semibold tabular-nums ${
            isZero
              ? 'text-slate-500'
              : isGood
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {isZero ? (
            <Minus className="w-3.5 h-3.5 mr-0.5" />
          ) : isPositive ? (
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
          )}
          <span>{Math.abs(metric.percentageChange)}%</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500 dark:text-slate-400">
        <span>Prev: {metric.format === 'currency' ? `$${Math.round(metric.previousValue).toLocaleString()}` : metric.previousValue}</span>
        <span aria-hidden="true">·</span>
        <span>{metric.periodLabel}</span>
      </div>
    </div>
  );
};
