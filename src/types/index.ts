export type UserRole = 'Super Admin' | 'Business Owner' | 'Analyst' | 'Viewer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface Organization {
  id: string;
  name: string;
  plan: string;
  currency: string;
  fiscalYearStart: string;
  timezone: string;
  memberCount: number;
}

export interface KpiMetric {
  key: string;
  title: string;
  currentValue: number;
  previousValue: number;
  percentageChange: number;
  isPositiveGood: boolean;
  format: 'currency' | 'number' | 'percentage';
  periodLabel: string;
  breakdown?: { label: string; value: number }[];
}

export interface OverviewMetrics {
  totalRevenue: KpiMetric;
  totalExpenses: KpiMetric;
  netProfit: KpiMetric;
  profitMargin: KpiMetric;
  salesGrowth: KpiMetric;
  customerCount: KpiMetric;
  averageOrderValue: KpiMetric;
  conversionRate: KpiMetric;
  timeSeries: {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
    orders: number;
  }[];
  categoryPerformance: {
    category: string;
    revenue: number;
    share: number;
  }[];
  regionalPerformance: {
    region: string;
    revenue: number;
    growth: number;
  }[];
}

export interface Dataset {
  id: string;
  name: string;
  type: 'sales' | 'financial' | 'inventory' | 'customers' | 'marketing';
  rowCount: number;
  columnCount: number;
  columns: string[];
  uploadedAt: string;
  uploadedBy: string;
  status: 'active' | 'processing' | 'error';
  fileSize: string;
  validationSummary: {
    validRows: number;
    invalidRows: number;
    missingValuesCount: number;
    duplicateRows: number;
    warnings: string[];
  };
  sampleData?: Record<string, any>[];
}

export interface AnomalyItem {
  id: string;
  metric: string;
  observedValue: number;
  baselineValue: number;
  deviationPercent: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  detectedAt: string;
  dimension: string;
  statisticalMethod: 'Z-Score (2.5σ)' | 'Interquartile Range (IQR)' | 'Moving Average Spike';
  description: string;
  recommendedAction: string;
  status: 'Open' | 'Investigating' | 'Resolved' | 'Ignored';
}

export interface RecommendationItem {
  id: string;
  title: string;
  category: 'Revenue Optimization' | 'Cost Reduction' | 'Inventory & Logistics' | 'Customer Retention' | 'Pricing Strategy';
  businessProblem: string;
  supportingData: string;
  suggestedAction: string;
  expectedBenefit: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  confidenceScore: number;
  status: 'New' | 'Reviewed' | 'In Progress' | 'Completed';
  createdAt: string;
  userNotes?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly Sales' | 'Monthly Management' | 'Quarterly QBR' | 'Financial P&L' | 'Customer Cohort' | 'Product Performance';
  reportingPeriod: string;
  createdAt: string;
  generatedBy: string;
  summary: string;
  kpis: { label: string; value: string; change: string }[];
  keyFindings: string[];
  risksAndAnomalies: string[];
  strategicRecommendations: string[];
  coverageNotes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metricsCited?: { label: string; value: string }[];
  dataPointsUsed?: number;
  confidence?: 'High' | 'Medium' | 'Estimated';
  suggestedFollowUps?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'anomaly' | 'import' | 'report' | 'system';
  severity: 'info' | 'warning' | 'critical' | 'success';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  ipAddress: string;
  status: 'Success' | 'Denied' | 'Failed';
  details: string;
}

export interface GlobalFilterState {
  dateRange: '7d' | '30d' | '90d' | 'ytd' | 'all';
  businessUnit: string;
  region: string;
  currency: string;
}
