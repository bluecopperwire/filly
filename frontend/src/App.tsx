import { useState } from 'react';
import Sidebar from './components/Sidebar';
import WritePage from './pages/WritePage';
import AnalyticsPage from './pages/AnalyticsPage';
import GuidePage from './pages/GuidePage';
import type { NavPage } from './types';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('write');

  const renderPage = () => {
    switch (activePage) {
      case 'write':
        return <WritePage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'guide':
        return <GuidePage />;
      default:
        return <WritePage />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}
