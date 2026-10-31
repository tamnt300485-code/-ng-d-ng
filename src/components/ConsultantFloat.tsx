import React, { useState } from 'react';
import { Phone, MessageCircle, UserCheck, X, Sparkles } from 'lucide-react';
import contentData from '../data/contentData.json';

export const ConsultantFloat: React.FC = () => {
  const { brand } = contentData;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <div className="mb-3 bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 w-72 space-y-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00558F] to-[#ED1C24] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                HH
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{brand.adviser.name}</h4>
                <p className="text-[11px] text-slate-500">{brand.adviser.title}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-[#00558F]">Cần hỗ trợ tại quầy?</p>
            <p className="text-[11px] text-slate-500">
              Chuyên viên sẵn sàng hướng dẫn thủ tục mở tài khoản, nộp thuế, đăng ký thẻ và sinh trắc học.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href={`tel:${brand.adviser.phone}`}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D8232A] to-[#ED1C24] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs hover:brightness-105"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Gọi: {brand.adviser.phoneDisplay}</span>
            </a>
            <a
              href={`tel:${brand.hotline.replace(/\s+/g, '')}`}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center space-x-1.5 hover:bg-slate-200"
            >
              <span>Hotline 24/7: {brand.hotline}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center space-x-2.5 px-4 py-3 rounded-full bg-[#00558F] text-white shadow-xl hover:bg-[#004675] hover:shadow-2xl transition-all duration-300 active:scale-95 border-2 border-white"
        aria-label="Tư vấn viên VietinBank"
      >
        <div className="relative">
          <UserCheck className="w-5 h-5 text-amber-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#00558F] animate-pulse" />
        </div>
        <span className="text-xs font-bold hidden sm:inline">
          Tư vấn: {brand.adviser.name}
        </span>
      </button>
    </div>
  );
};
