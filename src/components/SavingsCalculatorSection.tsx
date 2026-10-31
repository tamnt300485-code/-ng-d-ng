import React, { useState, useId } from 'react';
import {
  PiggyBank,
  TrendingUp,
  Video,
  ExternalLink,
  Coins,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const SavingsCalculatorSection: React.FC = () => {
  const { savings } = contentData;
  const rawId = useId();

  // Inputs
  const [depositAmountRaw, setDepositAmountRaw] = useState<string>('100000000'); // default 100M
  const [selectedMonths, setSelectedMonths] = useState<number>(12); // default 12 months
  const [interestRate, setInterestRate] = useState<string>('4.8'); // default 4.8%

  // Errors state
  const [errors, setErrors] = useState<{
    amount?: string;
    term?: string;
    rate?: string;
  }>({});

  // Format currency helpers
  const formatVND = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' VND';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setDepositAmountRaw(rawValue);
  };

  const handleTermChange = (months: number) => {
    setSelectedMonths(months);
    // Auto populate realistic rate from config for selected term
    const matched = savings.terms.find((t) => t.months === months);
    if (matched) {
      setInterestRate(matched.rate.toString());
    }
  };

  // Calculation
  const amountNumber = parseFloat(depositAmountRaw) || 0;
  const rateNumber = parseFloat(interestRate) || 0;

  // Formula: Tiền lãi = Số tiền gửi * (Lãi suất %/năm) * (Kỳ hạn tháng / 12)
  const estimatedInterest = Math.round(
    amountNumber * (rateNumber / 100) * (selectedMonths / 12)
  );
  const totalReceived = amountNumber + estimatedInterest;

  const validate = () => {
    const newErrors: { amount?: string; term?: string; rate?: string } = {};
    if (!amountNumber || amountNumber <= 0) {
      newErrors.amount = savings.errors.amount;
    }
    if (!selectedMonths) {
      newErrors.term = savings.errors.term;
    }
    if (rateNumber < 0 || isNaN(rateNumber)) {
      newErrors.rate = savings.errors.rate;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const presetAmounts = [
    { label: '50 Triệu', value: '50000000' },
    { label: '100 Triệu', value: '100000000' },
    { label: '200 Triệu', value: '200000000' },
    { label: '500 Triệu', value: '500000000' },
    { label: '1 Tỷ', value: '1000000000' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Title Banner */}
      <div className="bg-gradient-to-br from-[#003B70] via-[#00558F] to-[#0A6FB0] rounded-3xl text-white p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs text-amber-300">
            <PiggyBank className="w-3.5 h-3.5" />
            <span>Tiết kiệm sinh lời an toàn cùng VietinBank</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {savings.title}
          </h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            {savings.subtitle}. Lãi suất minh bạch, nhận trọn vẹn tiền lãi cuối kỳ.
          </p>
        </div>
      </div>

      {/* Main Grid: Inputs on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Coins className="w-5 h-5 text-[#00558F]" />
              <span>Thông tin khoản tiền gửi</span>
            </h3>
            <button
              onClick={() => {
                setDepositAmountRaw('100000000');
                setSelectedMonths(12);
                setInterestRate('4.8');
                setErrors({});
              }}
              className="text-xs text-slate-500 hover:text-[#00558F] flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>
          </div>

          {/* Amount input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={`deposit-amount-${rawId}`} className="text-xs sm:text-sm font-bold text-slate-800">
                Số tiền gửi dự tính (VND) <span className="text-red-500">*</span>
              </label>
              <span className="text-xs text-blue-600 font-semibold">
                {amountNumber > 0 ? formatVND(amountNumber) : 'Chưa nhập'}
              </span>
            </div>

            <div className="relative">
              <input
                id={`deposit-amount-${rawId}`}
                type="text"
                inputMode="numeric"
                value={
                  depositAmountRaw
                    ? new Intl.NumberFormat('vi-VN').format(parseInt(depositAmountRaw, 10))
                    : ''
                }
                onChange={handleAmountChange}
                placeholder="Ví dụ: 100,000,000"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border ${
                  errors.amount ? 'border-red-500 bg-red-50/30' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-base font-bold text-slate-900 transition-all`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                VND
              </span>
            </div>

            {errors.amount && (
              <p className="text-xs text-red-600 font-medium flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{errors.amount}</span>
              </p>
            )}

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presetAmounts.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setDepositAmountRaw(preset.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    depositAmountRaw === preset.value
                      ? 'bg-[#00558F] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Term selector */}
          <div className="space-y-2">
            <label htmlFor={`deposit-term-${rawId}`} className="text-xs sm:text-sm font-bold text-slate-800">
              Kỳ hạn gửi (Tháng) <span className="text-red-500">*</span>
            </label>

            <select
              id={`deposit-term-${rawId}`}
              value={selectedMonths}
              onChange={(e) => handleTermChange(parseInt(e.target.value, 10))}
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900 transition-all"
            >
              {savings.terms.map((t) => (
                <option key={t.months} value={t.months}>
                  {t.label} (Lãi suất tham khảo: {t.rate}%/năm)
                </option>
              ))}
            </select>
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor={`deposit-rate-${rawId}`} className="text-xs sm:text-sm font-bold text-slate-800">
                Lãi suất áp dụng (%/năm) <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-500">Có thể điều chỉnh theo thỏa thuận quầy</span>
            </div>

            <div className="relative">
              <input
                id={`deposit-rate-${rawId}`}
                type="number"
                step="0.05"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border ${
                  errors.rate ? 'border-red-500' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900 transition-all`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %/năm
              </span>
            </div>
          </div>

          {/* Video Guide Link as specified in PDF 2 */}
          <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200/80 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Video hướng dẫn gửi tiết kiệm VietinBank
                </h4>
                <p className="text-[11px] text-slate-500">
                  Xem clip ngắn hướng dẫn thao tác gửi tiền tiết kiệm online
                </p>
              </div>
            </div>

            <a
              href={savings.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-white border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-bold flex items-center space-x-1 shrink-0 shadow-2xs"
            >
              <span>Xem Video</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Results Card (Right) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="bg-gradient-to-br from-[#003B70] via-[#00558F] to-[#002B52] rounded-3xl p-6 sm:p-8 text-white shadow-md flex-1 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Kết quả dự tính
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950">
                  Trả lãi sau
                </span>
              </div>

              {/* Total Interest Box */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1 mb-4">
                <span className="text-xs text-blue-200 font-medium">Tiền lãi dự tính nhận được</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight font-mono">
                  {formatVND(estimatedInterest)}
                </div>
              </div>

              {/* Total Received Box */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <span className="text-xs text-blue-200 font-medium">
                  Tổng số tiền nhận được (Gốc + Lãi)
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
                  {formatVND(totalReceived)}
                </div>
              </div>
            </div>

            {/* Breakdown summary */}
            <div className="pt-4 border-t border-white/15 text-xs text-blue-100 space-y-2">
              <div className="flex justify-between">
                <span>Số tiền gốc:</span>
                <strong className="text-white">{formatVND(amountNumber)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Kỳ hạn gửi:</span>
                <strong className="text-white">{selectedMonths} Tháng</strong>
              </div>
              <div className="flex justify-between">
                <span>Lãi suất áp dụng:</span>
                <strong className="text-amber-300">{rateNumber}% / năm</strong>
              </div>
              <div className="flex justify-between">
                <span>Phương thức nhận lãi:</span>
                <strong className="text-white">Cuối kỳ (Trả sau)</strong>
              </div>
            </div>

            {/* Counter advisory prompt */}
            <div className="p-3 bg-white/10 rounded-xl text-[11px] text-blue-200 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>
                Quý khách có thể liên hệ ngay giao dịch viên tại quầy để làm thủ tục mở sổ tiết kiệm với lãi suất ưu đãi nhất!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
