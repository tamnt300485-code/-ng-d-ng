import React, { useState, useMemo, useId } from 'react';
import {
  Calculator,
  Calendar,
  FileSpreadsheet,
  Download,
  Printer,
  X,
  ChevronRight,
  TrendingDown,
  Building,
  DollarSign,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import contentData from '../data/contentData.json';

interface LoanScheduleRow {
  period: number;
  paymentDate: string;
  openingBalance: number;
  principal: number;
  interest: number;
  totalPayment: number;
  closingBalance: number;
}

export const LoanScheduleSection: React.FC = () => {
  const { loan } = contentData;
  const rawId = useId();

  // Inputs
  const [propertyValueRaw, setPropertyValueRaw] = useState<string>('1500000000');
  const [loanAmountRaw, setLoanAmountRaw] = useState<string>('500000000');
  const [termMonths, setTermMonths] = useState<number>(60); // 5 years
  const [interestRateYear, setInterestRateYear] = useState<string>('8.0');
  const [disbursementDate, setDisbursementDate] = useState<string>('2026-01-10');
  const [paymentCycle, setPaymentCycle] = useState<'monthly' | 'quarterly' | 'semiannual' | 'annual'>('monthly');
  const [paymentDay, setPaymentDay] = useState<number>(25);
  const [roundToThousand, setRoundToThousand] = useState<boolean>(true);

  // Detail Modal
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Formatting helpers
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' VND';
  };

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPropertyValueRaw(e.target.value.replace(/[^0-9]/g, ''));
  };

  const handleLoanAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoanAmountRaw(e.target.value.replace(/[^0-9]/g, ''));
  };

  // Schedule Calculation
  const calculationResult = useMemo(() => {
    const loanAmount = parseFloat(loanAmountRaw) || 0;
    const rateYear = (parseFloat(interestRateYear) || 0) / 100;

    let cycleStepMonths = 1;
    let ratePerCycle = rateYear / 12;
    if (paymentCycle === 'quarterly') {
      cycleStepMonths = 3;
      ratePerCycle = rateYear / 4;
    } else if (paymentCycle === 'semiannual') {
      cycleStepMonths = 6;
      ratePerCycle = rateYear / 2;
    } else if (paymentCycle === 'annual') {
      cycleStepMonths = 12;
      ratePerCycle = rateYear;
    }

    const totalPeriods = Math.max(1, Math.ceil(termMonths / cycleStepMonths));
    const rawPrincipalPerCycle = loanAmount / totalPeriods;
    const roundFunc = (n: number) => (roundToThousand ? Math.round(n / 1000) * 1000 : Math.round(n));

    const rows: LoanScheduleRow[] = [];
    let currentBalance = loanAmount;
    let totalInterestPaid = 0;
    let totalPrincipalPaid = 0;

    // Parse disbursement date
    const [dYear, dMonth, dDay] = disbursementDate.split('-').map(Number);
    let startPayYear = dYear;
    let startPayMonth = dMonth; // 1-indexed

    for (let i = 1; i <= totalPeriods; i++) {
      const opening = currentBalance;
      let interest = opening * ratePerCycle;
      interest = roundFunc(interest);

      let principal = roundFunc(rawPrincipalPerCycle);

      // Adjustment on the final period
      if (i === totalPeriods) {
        principal = currentBalance; // ensure exact zero out
      }

      const totalPayment = principal + interest;
      const closing = Math.max(0, opening - principal);

      // Calculate Payment Date: next months with fixed payment day
      let targetMonth = startPayMonth + (i - 1) * cycleStepMonths + 1;
      let targetYear = startPayYear;
      while (targetMonth > 12) {
        targetMonth -= 12;
        targetYear += 1;
      }
      // handle short months (Feb 28/29, April 30, etc.)
      const maxDaysInTargetMonth = new Date(targetYear, targetMonth, 0).getDate();
      const actualDay = Math.min(paymentDay, maxDaysInTargetMonth);
      const paymentDateFormatted = `${String(actualDay).padStart(2, '0')}/${String(
        targetMonth
      ).padStart(2, '0')}/${targetYear}`;

      rows.push({
        period: i,
        paymentDate: paymentDateFormatted,
        openingBalance: opening,
        principal,
        interest,
        totalPayment,
        closingBalance: closing,
      });

      totalInterestPaid += interest;
      totalPrincipalPaid += principal;
      currentBalance = closing;
    }

    const firstPeriodPayment = rows[0]?.totalPayment || 0;
    const lastPeriodPayment = rows[rows.length - 1]?.totalPayment || 0;

    return {
      rows,
      firstPeriodPayment,
      lastPeriodPayment,
      totalInterestPaid,
      totalPrincipalPaid,
      grandTotal: totalPrincipalPaid + totalInterestPaid,
      totalPeriods,
    };
  }, [
    loanAmountRaw,
    termMonths,
    interestRateYear,
    disbursementDate,
    paymentCycle,
    paymentDay,
    roundToThousand,
  ]);

  const loanAmountNum = parseFloat(loanAmountRaw) || 0;
  const propertyValNum = parseFloat(propertyValueRaw) || 0;
  const ltvRatio = propertyValNum > 0 ? ((loanAmountNum / propertyValNum) * 100).toFixed(1) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00558F] to-[#0A6FB0] rounded-3xl text-white p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs text-amber-300">
            <Calculator className="w-3.5 h-3.5" />
            <span>Kế hoạch tài chính & Vay vốn minh bạch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{loan.title}</h2>
          <p className="text-blue-100 text-xs sm:text-sm">
            {loan.method}. {loan.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Form Left, Summary Cards Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Step 1: Input Form (Left) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                Bước 1
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Nhập thông số khoản vay
              </h3>
            </div>
            <button
              onClick={() => {
                setPropertyValueRaw('1500000000');
                setLoanAmountRaw('500000000');
                setTermMonths(60);
                setInterestRateYear('8.0');
                setDisbursementDate('2026-01-10');
                setPaymentCycle('monthly');
                setPaymentDay(25);
              }}
              className="text-xs text-slate-500 hover:text-[#00558F] flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Mặc định</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Property Value */}
            <div className="space-y-1.5">
              <label htmlFor={`property-value-${rawId}`} className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>Giá trị tài sản bảo đảm (VND)</span>
              </label>
              <div className="relative">
                <input
                  id={`property-value-${rawId}`}
                  type="text"
                  inputMode="numeric"
                  value={
                    propertyValueRaw
                      ? new Intl.NumberFormat('vi-VN').format(parseInt(propertyValueRaw, 10))
                      : ''
                  }
                  onChange={handlePropertyChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  VND
                </span>
              </div>
            </div>

            {/* Loan Amount */}
            <div className="space-y-1.5">
              <label htmlFor={`loan-amount-${rawId}`} className="text-xs font-bold text-slate-700 flex items-center space-x-1">
                <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                <span>Số tiền vay (VND) <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <input
                  id={`loan-amount-${rawId}`}
                  type="text"
                  inputMode="numeric"
                  value={
                    loanAmountRaw
                      ? new Intl.NumberFormat('vi-VN').format(parseInt(loanAmountRaw, 10))
                      : ''
                  }
                  onChange={handleLoanAmountChange}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-[#00558F]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  VND
                </span>
              </div>
              {propertyValNum > 0 && (
                <span className="text-[11px] text-slate-500">
                  Tỷ lệ vay/Tài sản (LTV): <strong>{ltvRatio}%</strong>
                </span>
              )}
            </div>

            {/* Loan Term */}
            <div className="space-y-1.5">
              <label htmlFor={`term-months-${rawId}`} className="text-xs font-bold text-slate-700">
                Thời gian vay (Tháng) <span className="text-red-500">*</span>
              </label>
              <select
                id={`term-months-${rawId}`}
                value={termMonths}
                onChange={(e) => setTermMonths(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900"
              >
                <option value={12}>12 Tháng (1 năm)</option>
                <option value={24}>24 Tháng (2 năm)</option>
                <option value={36}>36 Tháng (3 năm)</option>
                <option value={60}>60 Tháng (5 năm)</option>
                <option value={84}>84 Tháng (7 năm)</option>
                <option value={120}>120 Tháng (10 năm)</option>
                <option value={180}>180 Tháng (15 năm)</option>
                <option value={240}>240 Tháng (20 năm)</option>
              </select>
            </div>

            {/* Interest Rate */}
            <div className="space-y-1.5">
              <label htmlFor={`interest-rate-year-${rawId}`} className="text-xs font-bold text-slate-700">
                Lãi suất vay (%/năm) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id={`interest-rate-year-${rawId}`}
                  type="number"
                  step="0.1"
                  value={interestRateYear}
                  onChange={(e) => setInterestRateYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  %/năm
                </span>
              </div>
            </div>

            {/* Disbursement Date */}
            <div className="space-y-1.5">
              <label htmlFor={`disbursement-date-${rawId}`} className="text-xs font-bold text-slate-700">
                Ngày giải ngân <span className="text-red-500">*</span>
              </label>
              <input
                id={`disbursement-date-${rawId}`}
                type="date"
                value={disbursementDate}
                onChange={(e) => setDisbursementDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900"
              />
            </div>

            {/* Payment Cycle */}
            <div className="space-y-1.5">
              <label htmlFor={`payment-cycle-${rawId}`} className="text-xs font-bold text-slate-700">
                Chu kỳ trả nợ <span className="text-red-500">*</span>
              </label>
              <select
                id={`payment-cycle-${rawId}`}
                value={paymentCycle}
                onChange={(e) => setPaymentCycle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900"
              >
                <option value="monthly">Hằng tháng (12 kỳ/năm)</option>
                <option value="quarterly">Hằng quý (4 kỳ/năm)</option>
                <option value="semiannual">6 tháng (2 kỳ/năm)</option>
                <option value="annual">Hằng năm (1 kỳ/năm)</option>
              </select>
            </div>

            {/* Payment Day of month */}
            <div className="space-y-1.5">
              <label htmlFor={`payment-day-${rawId}`} className="text-xs font-bold text-slate-700">
                Ngày trả nợ định kỳ <span className="text-red-500">*</span>
              </label>
              <select
                id={`payment-day-${rawId}`}
                value={paymentDay}
                onChange={(e) => setPaymentDay(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00558F] focus:bg-white text-sm font-bold text-slate-900"
              >
                {[5, 10, 15, 20, 25, 28].map((day) => (
                  <option key={day} value={day}>
                    Ngày {day} hằng kỳ
                  </option>
                ))}
              </select>
            </div>

            {/* Rounding rule */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 block">
                Quy tắc làm tròn số
              </span>
              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="roundThousand"
                  checked={roundToThousand}
                  onChange={(e) => setRoundToThousand(e.target.checked)}
                  className="w-4 h-4 text-[#00558F] rounded border-slate-300 focus:ring-[#00558F]"
                />
                <label htmlFor="roundThousand" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Làm tròn đến 1.000 đồng (chuẩn ngân hàng)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Output (Right) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex-1 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-[#00558F] uppercase tracking-wider">
                  Tổng quan chi trả
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {calculationResult.totalPeriods} kỳ thanh toán
                </span>
              </div>

              {/* Monthly Repayments */}
              <div className="mt-4 space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Số tiền trả kỳ đầu (cao nhất):</span>
                    <span className="text-red-500 font-bold">Kỳ 1</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    {formatMoney(calculationResult.firstPeriodPayment)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Số tiền trả kỳ cuối (thấp nhất):</span>
                    <span className="text-emerald-600 font-bold">Kỳ {calculationResult.totalPeriods}</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    {formatMoney(calculationResult.lastPeriodPayment)}
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổng gốc phải trả:</span>
                  <strong className="text-slate-900 font-mono">
                    {formatMoney(calculationResult.totalPrincipalPaid)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tổng lãi phải trả:</span>
                  <strong className="text-amber-700 font-mono">
                    {formatMoney(calculationResult.totalInterestPaid)}
                  </strong>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-800">Tổng gốc + Lãi:</span>
                  <strong className="text-[#00558F] font-black font-mono">
                    {formatMoney(calculationResult.grandTotal)}
                  </strong>
                </div>
              </div>
            </div>

            {/* Step 2 Trigger: Button "Xem chi tiết" */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowDetailModal(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#00558F] hover:bg-[#004675] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <FileSpreadsheet className="w-4 h-4 text-amber-300" />
                <span>Xem chi tiết lịch trả nợ</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-center text-slate-400">
                Nhấn "Xem chi tiết" để hiển thị đầy đủ bảng tính theo từng kỳ giảm dần
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Detail Modal Table as specified in PDF 3 */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#003B70] to-[#00558F] text-white flex items-center justify-between shrink-0">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Bảng Tính Lịch Trả Nợ Với Dư Nợ Giảm Dần
                </span>
                <h3 className="text-lg sm:text-xl font-bold">
                  Khoản vay: {formatMoney(loanAmountNum)} ({termMonths} tháng, {interestRateYear}%/năm)
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="In lịch trả nợ"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="py-3 px-3 rounded-l-xl">KỲ</th>
                    <th className="py-3 px-3">KỲ TRẢ NỢ</th>
                    <th className="py-3 px-3 text-right">SỐ GỐC CÒN LẠI</th>
                    <th className="py-3 px-3 text-right">GỐC</th>
                    <th className="py-3 px-3 text-right">LÃI</th>
                    <th className="py-3 px-3 text-right font-bold rounded-r-xl">TỔNG GỐC + LÃI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Period 0 row as seen in PDF sample */}
                  <tr className="text-slate-500 bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold">0</td>
                    <td className="py-2.5 px-3">{disbursementDate.split('-').reverse().join('/')}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {formatMoney(loanAmountNum)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                    <td className="py-2.5 px-3 text-right text-slate-400">-</td>
                  </tr>

                  {calculationResult.rows.map((row) => (
                    <tr key={row.period} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-700">{row.period}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-600">{row.paymentDate}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {formatMoney(row.openingBalance)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                        {formatMoney(row.principal)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-700">
                        {formatMoney(row.interest)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#00558F]">
                        {formatMoney(row.totalPayment)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-bold text-xs sm:text-sm">
                    <td className="py-3.5 px-3 rounded-l-xl" colSpan={2}>
                      TỔNG CỘNG
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-slate-400">-</td>
                    <td className="py-3.5 px-3 text-right font-mono text-emerald-400">
                      {formatMoney(calculationResult.totalPrincipalPaid)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                      {formatMoney(calculationResult.totalInterestPaid)}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-white rounded-r-xl">
                      {formatMoney(calculationResult.grandTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 shrink-0">
              <span className="italic">
                * Bảng tính mang tính chất tham khảo dựa trên quy tắc tính lãi dư nợ thực tế của VietinBank.
              </span>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
