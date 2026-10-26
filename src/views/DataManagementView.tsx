import React, { useState, useEffect } from 'react';
import {
  Upload,
  Database,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Download,
  RefreshCw,
  Plus,
  Table,
  Check,
  X,
  FileText,
} from 'lucide-react';
import { api } from '../services/api';
import { Dataset } from '../types';

import { useAuth } from '../context/AuthContext';

export const DataManagementView: React.FC = () => {
  const { user, requireRole, openLoginModal } = useAuth();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<{ dataset: Dataset; rows: any[] } | null>(null);

  const isViewer = user.role === 'Viewer';

  const handleOpenUpload = () => {
    if (requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'upload or modify business datasets')) {
      setShowUploadModal(true);
    }
  };

  // Upload Form state
  const [datasetName, setDatasetName] = useState('');
  const [datasetType, setDatasetType] = useState<'sales' | 'financial' | 'inventory' | 'customers'>('sales');
  const [csvContent, setCsvContent] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const loadDatasets = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDatasets();
      setDatasets(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setUploadError('Please select a valid .csv file');
      return;
    }

    setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);
      setUploadError('');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleType: 'sales' | 'financial' | 'customers') => {
    if (sampleType === 'sales') {
      setDatasetName('Retail Omnichannel Sales Q1 2026');
      setDatasetType('sales');
      setCsvContent(`date,product,category,region,revenue,cost,units,customerId
2026-03-01,Apex Cloud Core,Cloud Services,North America,45200,12500,14,cust-101
2026-03-03,Cerebro Insights AI,Enterprise Software,Europe,68500,14200,8,cust-102
2026-03-05,Edge Gateway v3,Hardware Devices,North America,28400,18100,42,cust-103
2026-03-08,Enterprise Support Plus,Support & Training,Asia Pacific,19800,7200,10,cust-104
2026-03-11,Apex Cloud Core,Cloud Services,Europe,53400,14900,16,cust-105
2026-03-14,Cerebro Insights AI,Enterprise Software,Asia Pacific,84000,16800,11,cust-106`);
    } else if (sampleType === 'financial') {
      setDatasetName('General Ledger Expense Run Q1 2026');
      setDatasetType('financial');
      setCsvContent(`period,accountCode,category,budget,actual,variance,businessUnit
2026-03,6100-AWS,Cloud Services,45000,52400,7400,Global Enterprise
2026-03,6200-SAL,Sales & Marketing,85000,92000,7000,Direct Commercial
2026-03,6300-ENG,R&D Engineering,82000,78000,-4000,Mid-Market Solutions
2026-03,6400-ADM,General & Admin,42000,41200,-800,Global Enterprise`);
    } else {
      setDatasetName('Customer Retention Cohorts 2026');
      setDatasetType('customers');
      setCsvContent(`customerId,joinDate,segment,ltv,ordersCount,lastOrderDate,churnProbability
cust-201,2025-01-15,Enterprise,98000,18,2026-03-24,0.04
cust-202,2025-04-10,Mid-Market,42000,9,2026-03-18,0.12
cust-203,2025-08-01,Enterprise,115000,24,2026-03-30,0.02
cust-204,2025-11-20,SMB,14000,4,2026-01-12,0.48`);
    }
  };

  const submitUpload = async () => {
    if (!datasetName.trim()) {
      setUploadError('Please provide a dataset name.');
      return;
    }
    if (!csvContent.trim()) {
      setUploadError('CSV content cannot be empty.');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    try {
      const created = await api.uploadDataset({
        name: datasetName,
        type: datasetType,
        rawContent: csvContent,
      });
      setUploadSuccess(`Successfully uploaded "${created.name}" with ${created.rowCount} rows.`);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess('');
        setDatasetName('');
        setCsvContent('');
        loadDatasets();
      }, 1200);
    } catch (e: any) {
      setUploadError(e.message || 'Failed to upload dataset.');
    } finally {
      setIsUploading(false);
    }
  };

  const previewDataset = async (dataset: Dataset) => {
    try {
      const res = await api.previewDataset(dataset.id);
      setSelectedPreview({ dataset: res.dataset, rows: res.previewRows });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Business Data Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Import, validate, inspect, and map source datasets to the analytical warehouse.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadDatasets}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 rounded-lg"
            title="Refresh datasets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Dataset</span>
          </button>
        </div>
      </div>

      {/* Viewer Notice Banner */}
      {isViewer && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Read-Only Dataset Catalog
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Viewers can inspect schemas and preview dataset records. To upload files or map custom columns, please sign in.
            </span>
          </div>
          <button
            onClick={() => openLoginModal('Sign in as Super Admin, Business Owner, or Analyst to upload datasets.')}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sign In to Upload
          </button>
        </div>
      )}

      {/* Dataset Storage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Connected Warehouse Datasets</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {datasets.length} Active Tables
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Validated Records in Memory</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
            {datasets.reduce((acc, d) => acc + d.rowCount, 0).toLocaleString()} Rows
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
          <span className="text-xs text-slate-500">Data Integrity Score</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            99.8% Clean
          </p>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Datasets Catalog</h2>
          <span className="text-xs text-slate-400">PostgreSQL Isolated Tenant Schema</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold uppercase text-slate-400 tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-3">Dataset Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Rows</th>
                <th className="px-4 py-3 text-right">Columns</th>
                <th className="px-4 py-3 text-right">File Size</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Integrity</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {datasets.map((ds) => (
                <tr key={ds.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate max-w-xs">{ds.name}</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-400 capitalize">
                    {ds.type}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                    {ds.rowCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                    {ds.columnCount}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-slate-500 tabular-nums">
                    {ds.fileSize}
                  </td>
                  <td className="px-4 py-3.5 text-slate-500">
                    <div>{ds.uploadedAt}</div>
                    <div className="text-[10px] text-slate-400">{ds.uploadedBy}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{ds.validationSummary.validRows} clean</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right space-x-2">
                    <button
                      onClick={() => previewDataset(ds)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Dataset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Import New Business Dataset
                </h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Demo Templates */}
            <div>
              <span className="text-xs font-medium text-slate-500 block mb-2">
                Load Preset Demonstration Dataset:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleLoadSample('sales')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
                >
                  Omnichannel Retail (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('financial')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
                >
                  General Ledger P&L (CSV)
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('customers')}
                  className="px-2.5 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
                >
                  Customer Retention Cohorts (CSV)
                </button>
              </div>
            </div>

            {/* Dataset Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Dataset Name
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g., Regional Transactions Q1"
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business Domain
                </label>
                <select
                  value={datasetType}
                  onChange={(e) => setDatasetType(e.target.value as any)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="sales">Sales & Revenue</option>
                  <option value="financial">Financial & Ledger</option>
                  <option value="customers">Customers & Cohorts</option>
                  <option value="inventory">Inventory & Logistics</option>
                </select>
              </div>
            </div>

            {/* File drag / upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Upload File or Paste CSV Data
              </label>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 mb-2 cursor-pointer"
              />
              <textarea
                rows={6}
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                placeholder="Paste CSV rows here (including header)..."
                className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 p-2.5 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900/40">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {uploadSuccess && (
              <div className="flex items-center gap-2 p-2.5 text-xs text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-900/40">
                <Check className="w-4 h-4 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitUpload}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isUploading ? 'Validating Schema...' : 'Validate & Commit Dataset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Preview Drawer */}
      {selectedPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-4xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Preview: {selectedPreview.dataset.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Total records: {selectedPreview.dataset.rowCount} · Attributes: {selectedPreview.dataset.columns.join(', ')}
                </p>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto border border-slate-100 dark:border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-mono">
                    {selectedPreview.dataset.columns.map((c) => (
                      <th key={c} className="px-3 py-2 whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {selectedPreview.rows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 font-mono">
                      {selectedPreview.dataset.columns.map((c) => (
                        <td key={c} className="px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-300">
                          {r[c] !== undefined ? String(r[c]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Displaying first {selectedPreview.rows.length} sample rows
              </span>
              <button
                onClick={() => setSelectedPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
