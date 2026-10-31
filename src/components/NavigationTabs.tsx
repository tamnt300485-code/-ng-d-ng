import React from 'react';
import {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  HelpCircle,
  Smartphone,
  Gamepad2,
  PiggyBank,
  Calculator,
  Sparkles,
  MapPin,
};

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { navigation } = contentData;

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center space-x-2 py-3 overflow-x-auto no-scrollbar">
          {navigation.map((item) => {
            const Icon = iconMap[item.icon] || HelpCircle;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 border ${
                  isActive
                    ? 'bg-[#00558F] text-white border-[#004675] shadow-sm shadow-blue-900/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-blue-50/60 hover:text-[#00558F] border-slate-200/80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>
                  <strong className={isActive ? 'text-amber-300' : 'text-slate-900'}>
                    {item.number}.
                  </strong>{' '}
                  {item.title}
                </span>
                {item.id === 'games' && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-400 text-slate-900">
                    Quà 2L
                  </span>
                )}
                {item.id === 'products' && (
                  <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500 text-white">
                    Mới
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
