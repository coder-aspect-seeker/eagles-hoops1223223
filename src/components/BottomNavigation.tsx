
import { User, Calendar, Plus, Clock } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'attendance', label: 'Today', icon: Calendar },
    { id: 'players', label: 'Players', icon: User },
    { id: 'add', label: 'Add', icon: Plus },
    { id: 'history', label: 'History', icon: Clock },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center py-2 px-4 transition-all duration-200 ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-6 h-6 transition-all duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
