import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Gift,
  CreditCard,
  QrCode,
} from 'lucide-react';
import contentData from '../data/contentData.json';
import { QRCodeCard } from './QRCodeCard';

export const IpayDownloadSection: React.FC = () => {
  const { ipayDownload } = contentData;
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopy = (url: string, key: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00558F] to-[#0A6FB0] rounded-3xl text-white p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs text-blue-100">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Kênh Ngân Hàng Số VietinBank iPay Mobile</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {ipayDownload.title}
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            {ipayDownload.subtitle}. Quét mã QR bằng camera điện thoại của Quý khách hoặc bấm vào liên kết để cài đặt ngay trong 30 giây.
          </p>
        </div>
      </div>

      {/* 2 Main Store Cards with QR codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* iOS / iPhone */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                <Apple className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Dành cho iPhone / iPad
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {ipayDownload.ios.name}
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
              {ipayDownload.ios.store}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
            <QRCodeCard
              url={ipayDownload.ios.url}
              label="Quét QR iPhone"
              subLabel="Mở trực tiếp App Store"
              size={150}
            />

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Hướng dẫn nhanh:</p>
                <p>1. Mở ứng dụng Máy ảnh trên iPhone</p>
                <p>2. Hướng vào mã QR để mở liên kết</p>
                <p>3. Bấm "Nhận" trên App Store để cài đặt</p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={ipayDownload.ios.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Apple className="w-4 h-4" />
                  <span>Mở trên App Store</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <button
                  onClick={() => handleCopy(ipayDownload.ios.url, 'ios')}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold transition-colors"
                >
                  {copiedLink === 'ios' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép link iOS</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao chép liên kết</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Android / Samsung / Xiaomi / Oppo */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Dành cho Samsung / Xiaomi / Oppo...
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  {ipayDownload.android.name}
                </h3>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {ipayDownload.android.store}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
            <QRCodeCard
              url={ipayDownload.android.url}
              label="Quét QR Android"
              subLabel="Mở trực tiếp CH Play"
              size={150}
            />

            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Hướng dẫn nhanh:</p>
                <p>1. Mở máy ảnh hoặc Zalo quét mã QR</p>
                <p>2. Chạm vào link thông báo để vào Google Play</p>
                <p>3. Bấm "Cài đặt" để tải về máy</p>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={ipayDownload.android.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Mở trên Google Play</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-200" />
                </a>

                <button
                  onClick={() => handleCopy(ipayDownload.android.url, 'android')}
                  className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-white text-xs font-semibold transition-colors"
                >
                  {copiedLink === 'android' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Đã sao chép link Android</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao chép liên kết</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-[#00558F]" />
          <span>Đặc quyền trải nghiệm trên ứng dụng VietinBank iPay</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ipayDownload.perks.map((perk, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col space-y-2"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#00558F] font-bold text-xs flex items-center justify-center">
                0{idx + 1}
              </div>
              <h4 className="text-sm font-bold text-slate-900">{perk.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{perk.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
