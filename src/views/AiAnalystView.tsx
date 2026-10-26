import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Database,
  ArrowUpRight,
  Download,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../services/api';
import { ChatMessage } from '../types';
import { useFilters } from '../context/FilterContext';

import { useAuth } from '../context/AuthContext';

export const AiAnalystView: React.FC = () => {
  const { filters } = useFilters();
  const { user, requireRole, openLoginModal } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `Hello! I am your AI Business Analyst. I am connected directly to your authorized PostgreSQL data warehouse for period **${filters.dateRange.toUpperCase()}**.

All financial metrics, growth rates, and margins are calculated using verified data pipelines. I can help analyze your business trends, diagnose performance anomalies, compare regional contributions, and evaluate strategic opportunities.

What would you like to explore today?`,
      timestamp: 'Just now',
      confidence: 'High',
      suggestedFollowUps: [
        'What are the main business trends this month?',
        'Which products generate the highest revenue?',
        'What are my largest expense categories and anomalies?',
        'Which regions have the strongest growth trajectory?',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isViewer = user.role === 'Viewer';

  const suggestedQuestions = [
    'What are the main business trends this month?',
    'Which products generate the highest revenue?',
    'Why did sales change compared to last month?',
    'Which regions have the strongest performance?',
    'What are my largest expense categories?',
    'What actions could improve profit margins?',
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async (queryText?: string) => {
    if (!requireRole(['Super Admin', 'Business Owner', 'Analyst'], 'query the AI Business Analyst')) {
      return;
    }
    const textToSend = queryText || input;
    if (!textToSend.trim() || isSending) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsSending(true);

    try {
      const response = await api.askAiAnalyst(textToSend, filters.dateRange);
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `I encountered an issue querying the analytics service: ${err.message || 'Unknown error'}. Ordinary dashboard calculations remain fully operational.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 'Estimated',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const exportChat = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp}] ${m.sender.toUpperCase()}:\n${m.content}\n`)
      .join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cerebro-analyst-session-${new Date().toISOString().substring(0, 10)}.txt`;
    a.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto h-[calc(100vh-5rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              AI Business Analyst
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded in verified warehouse calculations · Zero hallucinated numbers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md font-mono">
            Scope: {filters.dateRange.toUpperCase()}
          </span>
          <button
            onClick={exportChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Transcript</span>
          </button>
        </div>
      </div>

      {/* Suggested Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" /> Prompts:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-md whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                  AI
                </div>
              )}

              <div
                className={`p-4 rounded-xl text-xs space-y-2.5 leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Cited factual metrics badges */}
                {msg.metricsCited && msg.metricsCited.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex flex-wrap gap-2 text-[11px]">
                    {msg.metricsCited.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono"
                      >
                        {c.label}: <strong className="font-bold">{c.value}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Follow up suggestions */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Suggested Follow-ups:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {msg.suggestedFollowUps.map((fu, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(fu)}
                          className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline block text-left"
                        >
                          → {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-slate-400 pt-1 text-right">
                  {msg.timestamp} {msg.confidence && `· Confidence: ${msg.confidence}`}
                </div>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex gap-3 max-w-md">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
              AI
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Querying PostgreSQL warehouse & calculating facts...</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Viewer Notice Banner */}
      {isViewer && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shrink-0">
          <span className="text-slate-600 dark:text-slate-400">
            <strong>Viewer Notice:</strong> Viewing existing conversational intelligence in read-only mode. Sign in as Super Admin, Business Owner, or Analyst to query Gemini.
          </span>
          <button
            onClick={() => openLoginModal('Sign in to prompt the AI Business Analyst.')}
            className="px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-900 rounded-md border border-slate-300 dark:border-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            Sign In to Ask
          </button>
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your revenue, margins, expenses, or regional performance..."
          className="flex-1 px-3 py-2 text-xs bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 rounded-lg transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
