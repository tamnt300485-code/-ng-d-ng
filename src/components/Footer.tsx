import React from 'react';
import { ShieldCheck, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';
import contentData from '../data/contentData.json';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { brand, navigation } = contentData;

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-black text-white tracking-tight">
                {brand.fullName}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Trang web tương tác khách hàng thông minh tại quầy giao dịch chi nhánh Kiên Giang. Hỗ trợ giải đáp, tính toán biểu phí tiền gửi và tiền vay, hướng dẫn ngân hàng số iPay và khám phá các gói ưu đãi mới nhất.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>Số D11-5B Đường 3 Tháng 2, P. Rạch Giá, Tỉnh An Giang</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline tổng đài: {brand.hotline} • Hỗ trợ PGD: {brand.supportPhone}</span>
              </div>
            </div>
          </div>

          {/* Quick links to 7 modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Tính Năng Quầy Giao Dịch
            </h4>
            <ul className="space-y-2 text-xs">
              {navigation.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.number}. {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Consultant contact */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Cán Bộ Phụ Trách
            </h4>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 space-y-2 text-xs">
              <div className="font-bold text-white">{brand.adviser.name}</div>
              <div className="text-slate-400">{brand.adviser.title}</div>
              <div className="pt-1">
                <a
                  href={`tel:${brand.adviser.phone}`}
                  className="inline-flex items-center space-x-1.5 text-amber-400 font-bold hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{brand.adviser.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {brand.name}. Bản quyền thuộc về Ngân hàng TMCP Công Thương Việt Nam.
          </div>
          <div className="flex items-center space-x-4">
            <span>Bảo mật chuẩn ISO 27001</span>
            <span>Quyết định 2345/QĐ-NHNN</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
