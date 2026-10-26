import pytest
import pandas as pd
from backend.app.services.analytics_engine import AnalyticsEngine

def test_kpi_calculations():
    test_data = pd.DataFrame([
        {"revenue": 1000.0, "cost": 300.0, "customerId": "c1"},
        {"revenue": 2000.0, "cost": 700.0, "customerId": "c2"},
        {"revenue": 1500.0, "cost": 500.0, "customerId": "c1"},
    ])
    
    kpis = AnalyticsEngine.compute_summary_kpis(test_data)
    assert kpis["total_revenue"] == 4500.0
    assert kpis["total_cost"] == 1500.0
    assert kpis["net_profit"] == 3000.0
    assert kpis["profit_margin"] == pytest.approx(66.67, 0.01)
    assert kpis["total_orders"] == 3
    assert kpis["unique_customers"] == 2

def test_anomaly_detection_zscore():
    # 9 normal numbers around 100, and one massive outlier 1000
    series = pd.Series([100.0, 102.0, 98.0, 101.0, 99.0, 100.0, 97.0, 103.0, 100.0, 1000.0])
    anomalies = AnalyticsEngine.detect_zscore_anomalies(series, threshold=2.0)
    assert len(anomalies) >= 1
    assert anomalies[0]["value"] == 1000.0
    assert anomalies[0]["severity"] in ["High", "Critical"]

def test_anomaly_detection_iqr():
    series = pd.Series([10, 12, 11, 13, 12, 11, 14, 12, 100])
    anomalies = AnalyticsEngine.detect_iqr_anomalies(series)
    assert len(anomalies) >= 1
    assert anomalies[0]["value"] == 100.0
