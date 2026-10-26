import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FilterProvider } from './context/FilterContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';

import { OverviewView } from './views/OverviewView';
import { AiAnalystView } from './views/AiAnalystView';
import { DataManagementView } from './views/DataManagementView';
import { ReportsView } from './views/ReportsView';
import { TrendAnalysisView } from './views/TrendAnalysisView';
import { AnomalyDetectionView } from './views/AnomalyDetectionView';
import { RecommendationsView } from './views/RecommendationsView';
import { CustomerAnalyticsView } from './views/CustomerAnalyticsView';
import { SalesProductView } from './views/SalesProductView';
import { FinancialAnalyticsView } from './views/FinancialAnalyticsView';
import { NotificationsView } from './views/NotificationsView';
import { SettingsView } from './views/SettingsView';

import { LoginModal } from './components/auth/LoginModal';

export function DashboardContent() {
  const [currentView, setCurrentView] = useState<string>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const renderActiveView = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewView onNavigate={setCurrentView} />;
      case 'ai-analyst':
        return <AiAnalystView />;
      case 'data-management':
        return <DataManagementView />;
      case 'reports':
        return <ReportsView />;
      case 'trends':
        return <TrendAnalysisView />;
      case 'anomalies':
        return <AnomalyDetectionView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'customers':
        return <CustomerAnalyticsView />;
      case 'sales':
        return <SalesProductView />;
      case 'financial':
        return <FinancialAnalyticsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 transition-colors">
      <TopBar
        onNavigate={setCurrentView}
        currentView={currentView}
      />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
      <LoginModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FilterProvider>
        <DashboardContent />
      </FilterProvider>
    </AuthProvider>
  );
}
