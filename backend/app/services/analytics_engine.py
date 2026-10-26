import numpy as np
import pandas as pd
from typing import List, Dict, Any, Tuple

class AnalyticsEngine:
    """
    Authoritative computation engine for business analytics,
    period-over-period variance, moving averages, and statistical anomaly detection.
    """

    @staticmethod
    def compute_summary_kpis(df: pd.DataFrame) -> Dict[str, Any]:
        if df.empty:
            return {}

        total_revenue = float(df['revenue'].sum())
        total_cost = float(df['cost'].sum())
        net_profit = total_revenue - total_cost
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0.0
        total_orders = len(df)
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0.0
        unique_customers = int(df['customerId'].nunique()) if 'customerId' in df.columns else 0

        return {
            "total_revenue": round(total_revenue, 2),
            "total_cost": round(total_cost, 2),
            "net_profit": round(net_profit, 2),
            "profit_margin": round(profit_margin, 2),
            "total_orders": total_orders,
            "average_order_value": round(avg_order_value, 2),
            "unique_customers": unique_customers,
        }

    @staticmethod
    def detect_zscore_anomalies(series: pd.Series, threshold: float = 2.5) -> List[Dict[str, Any]]:
        """
        Detect outliers using Z-score (standard deviations from mean).
        Z = (X - μ) / σ
        """
        if len(series) < 4:
            return []

        mean = float(series.mean())
        std = float(series.std())
        if std == 0:
            return []

        z_scores = (series - mean) / std
        anomalies = []
        for idx, z in z_scores.items():
            if abs(z) >= threshold:
                val = float(series.loc[idx])
                dev_pct = round(((val - mean) / mean) * 100, 2)
                anomalies.append({
                    "index": str(idx),
                    "value": val,
                    "mean_baseline": round(mean, 2),
                    "z_score": round(float(z), 2),
                    "deviation_pct": dev_pct,
                    "method": "Z-Score (2.5σ)",
                    "severity": "Critical" if abs(z) >= 3.0 else "High"
                })
        return anomalies

    @staticmethod
    def detect_iqr_anomalies(series: pd.Series, multiplier: float = 1.5) -> List[Dict[str, Any]]:
        """
        Detect outliers using Interquartile Range (IQR).
        Bounds: Q1 - (1.5 * IQR) and Q3 + (1.5 * IQR)
        """
        if len(series) < 4:
            return []

        q1 = float(series.quantile(0.25))
        q3 = float(series.quantile(0.75))
        iqr = q3 - q1
        lower_bound = q1 - (multiplier * iqr)
        upper_bound = q3 + (multiplier * iqr)

        anomalies = []
        for idx, val in series.items():
            val_f = float(val)
            if val_f < lower_bound or val_f > upper_bound:
                baseline = float(series.median())
                dev_pct = round(((val_f - baseline) / baseline) * 100, 2) if baseline > 0 else 0
                anomalies.append({
                    "index": str(idx),
                    "value": val_f,
                    "lower_bound": round(lower_bound, 2),
                    "upper_bound": round(upper_bound, 2),
                    "median_baseline": round(baseline, 2),
                    "deviation_pct": dev_pct,
                    "method": "Interquartile Range (IQR)",
                    "severity": "Critical" if val_f > (q3 + 2.5 * iqr) else "Medium"
                })
        return anomalies
