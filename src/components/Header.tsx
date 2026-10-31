import React, { useState, useEffect } from 'react';
import { Phone, Clock, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import contentData from '../data/contentData.json';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { brand } = contentData;
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Ribbon */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00558F] to-[#0B72B9] text-white px-4 py-1.5 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-red-600/90 text-white text-[11px] font-bold">
              Quầy số hóa
            </span>
            <span className="hidden sm:inline text-blue-100">
              {brand.fullName} • {brand.branchName}
            </span>
          </div>
          <div className="flex items-center space-x-4 text-blue-100">
            <div className="hidden md:flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span>{time}</span>
            </div>
            <a
              href={`tel:${brand.adviser.phone}`}
              className="inline-flex items-center space-x-1.5 hover:text-white transition-colors text-amber-300 font-semibold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Tư vấn viên: {brand.adviser.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Logo at Left as specified */}
        <div
          onClick={() => setActiveTab('faq')}
          className="flex items-center space-x-3 cursor-pointer group"
          title="Về trang chủ dịch vụ quầy"
        >
          <img
            src={brand.logo}
            alt="Logo VietinBank"
            className="h-10 md:h-12 w-auto object-contain transition-transform group-hover:scale-102"
            onError={(e) => {
              // Fallback to text brand badge if remote image is blocked
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="border-l border-slate-200 pl-3 hidden lg:block">
            <div className="text-sm font-extrabold text-[#00558F] tracking-tight uppercase">
              {brand.name} Kiên Giang
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              Không gian trải nghiệm & Tương tác giao dịch
            </div>
          </div>
        </div>

        {/* Quick status & contact pill */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={() => setActiveTab('branches')}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#00558F] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>Mạng lưới 8 PGD</span>
          </button>

          <a
            href={`tel:${brand.adviser.phone}`}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#D8232A] to-[#ED1C24] hover:shadow-md hover:brightness-105 transition-all shadow-xs"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Gặp tư vấn viên ({brand.adviser.name})</span>
          </a>
        </div>
      </div>
    </header>
  );
};
