import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  Search,
  Building2,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const BranchLocatorSection: React.FC = () => {
  const { branches, brand } = contentData;
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const filteredBranches = branches.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.office.toLowerCase().includes(term) ||
      item.address.toLowerCase().includes(term) ||
      item.phone.includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00558F] to-[#0A6FB0] rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs text-amber-300">
            <Building2 className="w-3.5 h-3.5" />
            <span>Mạng lưới giao dịch VietinBank</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Điểm Giao Dịch Chi Nhánh Kiên Giang
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            Tra cứu địa chỉ, giờ phục vụ, số điện thoại hotline bấm gọi ngay và định vị bản đồ Google Maps của 8 điểm giao dịch trên địa bàn.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên PGD, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/95 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm"
          />
        </div>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-900">
            Tổng cộng: {filteredBranches.length} Điểm giao dịch
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-700 font-semibold">
            Giờ giao dịch: Sáng 7h30-11h30 / Chiều 13h30-16h45 (Thứ 2 - Thứ 6)
          </span>
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden group"
          >
            {/* Office photo */}
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.office}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    'https://raw.githubusercontent.com/lhhiep161/anh-super-app/main/Logo%20VietinBank%20-%20CTG%20Slo.png';
                }}
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-[#00558F] text-white shadow-md">
                STT 0{item.stt}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs">
                {item.branch}
              </div>
            </div>

            {/* Office Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-[#00558F] transition-colors">
                  {item.office}
                </h3>

                {/* Address with Google Maps link */}
                <div className="flex items-start space-x-2 text-xs text-slate-600">
                  <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item.address}</span>
                </div>

                {/* Hours */}
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Clock className="w-4 h-4 text-[#00558F] shrink-0" />
                  <span>{item.hours}</span>
                </div>

                {/* Hotline with click to call */}
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hotline: </span>
                  <a
                    href={`tel:${item.phoneRaw}`}
                    className="text-[#00558F] hover:underline hover:text-blue-800 font-mono text-sm"
                  >
                    {item.phone}
                  </a>
                </div>
              </div>

              {/* Action Buttons as specified in PDF 4 */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                {/* Google Maps link with Google Maps icon */}
                <a
                  href={item.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#00558F] text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 border border-blue-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-blue-600" />
                  <span>Chỉ đường Maps</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                {/* Click to call directly */}
                <a
                  href={`tel:${item.phoneRaw}`}
                  className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi PGD</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
