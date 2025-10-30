
import React, { useState, useMemo } from 'react';
import { Tab } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from './features/overview/OverviewTab';
import EnrichmentTab from './features/enrichment/EnrichmentTab';
import QualityTab from './features/quality/QualityTab';
import AnalyticsTab from './features/analytics/AnalyticsTab';
import ActivityTab from './features/activity/ActivityTab';
import SettingsTab from './features/settings/SettingsTab';
import useCreditSystem from './hooks/useCreditSystem';

export const CreditSystemContext = React.createContext<ReturnType<typeof useCreditSystem> | null>(null);

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('enrichment');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const creditSystem = useCreditSystem();

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'enrichment':
        return <EnrichmentTab />;
      case 'quality':
        return <QualityTab />;
      case 'analytics':
        return <AnalyticsTab />;
      case 'activity':
        return <ActivityTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <CreditSystemContext.Provider value={creditSystem}>
      <div className="min-h-screen flex bg-slate-100 text-slate-800">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col transition-all duration-300 lg:ml-64">
          <Header setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderTab()}
          </main>
        </div>
      </div>
    </CreditSystemContext.Provider>
  );
}
