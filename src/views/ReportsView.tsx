import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Calendar,
  Layers,
  Printer,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
  X,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../services/api';
import { ReportItem } from '../types';

import { useAuth } from '../context/AuthContext';

export const ReportsView: React.FC = () => {
  const { user, requireRole, openLoginModal } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Generation Modal
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [reportType, setReportType] = useState('Monthly Management');
  const [reportingPeriod, setReportingPeriod] = useState('March 1 – March 31, 2026');

  const isViewer = user.role === 'Viewer';

  const handleOpenGenerate = () => {
    if (requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'generate autonomous executive reports')) {
      setShowGenerateModal(true);
    }
  };

  const reportTypes = [
    'Daily Performance',
    'Weekly Sales',
    'Monthly Management',
    'Quarterly QBR',
    'Financial P&L',
    'Customer Cohort',
    'Product Performance',
    'Executive Summary',
  ];

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
      if (data.length > 0 && !selectedReport) {
        setSelectedReport(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const created = await api.generateReport(reportType, reportingPeriod);
      setReports((prev) => [created, ...prev]);
      setSelectedReport(created);
      setShowGenerateModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCsv = (reportId: string) => {
    window.location.href = `/api/reports/${reportId}/export?format=csv`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Executive Report Generator
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated executive intelligence dossiers grounded in authoritative financial data.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenGenerate}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate New Report</span>
          </button>
        </div>
      </div>

      {/* Viewer Notice Banner */}
      {isViewer && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Viewer Access
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              You have full read-only permissions to review and export published dossiers. To synthesize new custom reports with AI, please sign in.
            </span>
          </div>
          <button
            onClick={() => openLoginModal('Sign in as Super Admin, Business Owner, or Analyst to generate reports.')}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sign In to Generate
          </button>
        </div>
      )}

      {/* Main Layout: Reports List on Left, Active Report Viewer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Reports Index */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">Report Archives</span>
            <span className="text-xs text-slate-400">{reports.length} Reports</span>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {reports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              return (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">{rep.type}</span>
                    <span>{rep.createdAt.substring(0, 10)}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {rep.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {rep.summary}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Report Dossier */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 lg:p-8 space-y-6">
          {selectedReport ? (
            <>
              {/* Dossier Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {selectedReport.type} Dossier
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                    {selectedReport.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span>Period: {selectedReport.reportingPeriod}</span>
                    <span aria-hidden="true">·</span>
                    <span>Generated: {selectedReport.createdAt}</span>
                    <span aria-hidden="true">·</span>
                    <span>By: {selectedReport.generatedBy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExportCsv(selectedReport.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

              {/* 1. Executive Summary */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Executive Summary
                </h3>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  {selectedReport.summary}
                </div>
              </div>

              {/* 2. Key Performance Indicators Scorecard */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Performance Scorecard
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedReport.kpis.map((kpi, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <span className="text-[11px] text-slate-500 font-medium block truncate">
                        {kpi.label}
                      </span>
                      <p className="text-lg font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
                        {kpi.value}
                      </p>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums mt-0.5 block">
                        {kpi.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Important Trends & Findings */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  3. Key Observations & Growth Drivers
                </h3>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {selectedReport.keyFindings.map((finding, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Significant Anomalies & Risks */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  4. Significant Anomalies & Operating Risks
                </h3>
                <div className="space-y-2 text-xs">
                  {selectedReport.risksAndAnomalies.map((risk, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 flex items-start gap-2"
                    >
                      <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Strategic AI Recommendations */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  5. Actionable Strategic Recommendations
                </h3>
                <div className="space-y-2.5 text-xs">
                  {selectedReport.strategicRecommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-start gap-3"
                    >
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                        0{idx + 1}.
                      </span>
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Coverage & Governance Notes */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                <span className="font-semibold text-slate-500 dark:text-slate-400">Data Coverage & Rigor: </span>
                {selectedReport.coverageNotes}
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-700">No report selected</p>
              <p className="text-xs text-slate-400 mt-1">Select an archived dossier or generate a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Generate Autonomous Executive Report
                </h3>
              </div>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {reportTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reporting Scope & Period
                </label>
                <input
                  type="text"
                  value={reportingPeriod}
                  onChange={(e) => setReportingPeriod(e.target.value)}
                  placeholder="e.g. March 1 – March 31, 2026"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-800 dark:text-indigo-300">
                The report engine will aggregate all active transaction records, evaluate statistical deviations, and generate narrative findings grounded in actual numbers.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowGenerateModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing Dossier...</span>
                  </>
                ) : (
                  <span>Generate Report</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
