
import { useState } from 'react';
import BottomNavigation from '@/components/BottomNavigation';
import AttendanceView from '@/components/AttendanceView';
import PlayersView from '@/components/PlayersView';
import HistoryView from '@/components/HistoryView';
import AddPlayerModal from '@/components/AddPlayerModal';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'add') {
      setShowAddModal(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceView />;
      case 'players':
        return <PlayersView onAddPlayer={() => setShowAddModal(true)} />;
      case 'history':
        return <HistoryView />;
      default:
        return <AttendanceView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Status Bar Safe Area */}
      <div className="safe-area-inset-top bg-white"></div>
      
      {/* Main Content */}
      <div className="relative">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <Toaster />
    </div>
  );
};

export default Index;
