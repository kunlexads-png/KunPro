import React, { useState, useEffect } from 'react';
import {
  Lightbulb,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  FileEdit,
  Save,
  MessageSquare,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { api } from '../services/api';
import { RecommendationItem } from '../types';

import { useAuth } from '../context/AuthContext';

export const RecommendationsView: React.FC = () => {
  const { user, requireRole, openLoginModal } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const isViewer = user.role === 'Viewer';

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getRecommendations();
      setRecommendations(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: string, status: RecommendationItem['status']) => {
    if (!requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'update recommendation status')) {
      return;
    }
    try {
      const updated = await api.updateRecommendation(id, { status });
      setRecommendations((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (e) {
      console.error(e);
    }
  };

  const saveNotes = async (id: string) => {
    if (!requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'save recommendation team notes')) {
      return;
    }
    try {
      const updated = await api.updateRecommendation(id, { userNotes: tempNotes });
      setRecommendations((prev) => prev.map((r) => (r.id === id ? updated : r)));
      setEditingNotesId(null);
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = recommendations.filter((r) => {
    if (selectedStatus !== 'all' && r.status.toLowerCase() !== selectedStatus.toLowerCase()) {
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
            Strategic Recommendations Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prioritized business intervention plans powered by machine intelligence and margin sensitivity analysis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {['all', 'new', 'reviewed', 'in progress', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors capitalize ${
                selectedStatus === st
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Viewer Notice Banner */}
      {isViewer && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Read-Only Recommendations
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              You can inspect all strategic growth initiatives and estimated returns. Sign in as Super Admin, Business Owner, or Analyst to update action statuses or record notes.
            </span>
          </div>
          <button
            onClick={() => openLoginModal('Sign in to update recommendation statuses or record team notes.')}
            className="self-start sm:self-auto px-3 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            Sign In to Edit
          </button>
        </div>
      )}

      {/* Recommendations Cards */}
      <div className="space-y-4">
        {filtered.map((rec) => {
          const isCritical = rec.priority === 'Critical';
          const isHigh = rec.priority === 'High';
          return (
            <div
              key={rec.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 transition-all hover:border-slate-300 dark:hover:border-slate-700 space-y-5"
            >
              {/* Header Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : isHigh
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {rec.category}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">
                      Confidence Score: <strong className="font-mono">{rec.confidenceScore}%</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {rec.title}
                  </h3>
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  {(['New', 'Reviewed', 'In Progress', 'Completed'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(rec.id, s)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                        rec.status === s
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data & Business Problem */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Business Problem / Opportunity
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rec.businessProblem}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Supporting Data Evidence
                  </span>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                    {rec.supportingData}
                  </p>
                </div>
              </div>

              {/* Suggested Action & Benefit */}
              <div className="space-y-2 text-xs">
                <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                  <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-0.5">
                    Prescribed Strategic Action:
                  </span>
                  <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed">
                    {rec.suggestedAction}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500">
                    Projected Financial Impact:{' '}
                    <strong className="text-emerald-600 dark:text-emerald-400 font-mono">
                      {rec.expectedBenefit}
                    </strong>
                  </span>
                  <span className="text-slate-400">Created: {rec.createdAt}</span>
                </div>
              </div>

              {/* User Notes Section */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                {editingNotesId === rec.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={tempNotes}
                      onChange={(e) => setTempNotes(e.target.value)}
                      placeholder="Add organizational review notes or team assignments..."
                      className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveNotes(rec.id)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-md"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Notes</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{rec.userNotes || 'No team notes recorded yet.'}</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingNotesId(rec.id);
                        setTempNotes(rec.userNotes || '');
                      }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>{rec.userNotes ? 'Edit Notes' : 'Add Note'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
