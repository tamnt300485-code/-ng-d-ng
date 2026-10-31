import React, { useState } from 'react';
import {
  HelpCircle,
  ExternalLink,
  Youtube,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  PhoneCall,
  X,
  MessageSquare,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const FaqSection: React.FC = () => {
  const { faq, brand } = contentData;
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'satisfied' | 'unsatisfied' | 'ended'>('idle');
  const [zoomImage, setZoomImage] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState<boolean>(false);

  const activeTopic = faq.topics.find((t) => t.id === selectedTopicId);

  const handleSelectTopic = (id: string) => {
    setSelectedTopicId(id);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
    setShowVideoModal(false);
  };

  const handleResetToMenu = () => {
    setSelectedTopicId(null);
    setCurrentStepIndex(0);
    setFeedbackState('idle');
    setShowVideoModal(false);
  };

  const handleEndConversation = () => {
    setFeedbackState('ended');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* If conversation ended */}
      {feedbackState === 'ended' && (
        <div className="bg-white rounded-3xl border border-blue-100 shadow-md p-8 text-center max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-blue-50 text-[#00558F] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8 text-[#00558F]" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            {faq.endChatMessage}
          </h3>
          <p className="text-sm text-slate-500">
            VietinBank luôn sẵn sàng đồng hành và hỗ trợ Quý khách trong mọi giao dịch tài chính.
          </p>
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleResetToMenu}
              className="px-5 py-2.5 rounded-xl bg-[#00558F] text-white font-semibold text-sm hover:bg-[#004675] transition-all flex items-center space-x-2 shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Bắt đầu cuộc trò chuyện mới</span>
            </button>
            <a
              href={`tel:${brand.adviser.phone}`}
              className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-all flex items-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Gọi hotline chi nhánh</span>
            </a>
          </div>
        </div>
      )}

      {/* Main View: Topics Menu */}
      {!selectedTopicId && feedbackState !== 'ended' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-900 via-[#00558F] to-[#01416e] rounded-3xl text-white p-6 sm:p-8 shadow-sm">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs text-blue-100">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Trợ lý giải đáp trực tiếp tại quầy</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {faq.question}
              </h2>
              <p className="text-blue-100 text-sm sm:text-base">
                {faq.promptIntro}
              </p>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {faq.topics.map((topic, idx) => (
              <div
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-blue-400 cursor-pointer transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-100/40 via-blue-50/20 to-transparent rounded-bl-full pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-[#00558F] font-bold text-sm flex items-center justify-center border border-blue-100">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-[#00558F]">
                      {topic.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#00558F] transition-colors leading-snug">
                    {topic.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 line-clamp-2">
                    {topic.desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#00558F]">
                  <span className="flex items-center space-x-1">
                    <span>{topic.steps.length} bước thực hiện</span>
                    {topic.videoUrl && <span className="text-red-500">• Có Video</span>}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-[#00558F] group-hover:text-white flex items-center justify-center transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail Step-by-Step Flow */}
      {selectedTopicId && activeTopic && feedbackState !== 'ended' && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={handleResetToMenu}
              className="inline-flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#00558F] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Quay lại danh sách câu hỏi</span>
            </button>

            <div className="flex items-center space-x-2">
              {activeTopic.videoUrl && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200 hover:bg-red-100 transition-colors"
                >
                  <Youtube className="w-4 h-4 text-red-600" />
                  <span>Xem Video trên YouTube</span>
                </button>
              )}

              <button
                onClick={handleEndConversation}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 text-xs font-medium hover:bg-slate-200 transition-colors"
              >
                <span>Kết thúc cuộc trò chuyện</span>
              </button>
            </div>
          </div>

          {/* Guide Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#00558F] border border-blue-200">
                {activeTopic.badge}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Bước {currentStepIndex + 1} / {activeTopic.steps.length}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {activeTopic.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {activeTopic.desc}
            </p>

            {/* Step navigation dots / progress */}
            <div className="mt-4 flex items-center space-x-1.5 overflow-x-auto pb-1">
              {activeTopic.steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'w-8 bg-[#00558F]'
                      : idx < currentStepIndex
                      ? 'w-4 bg-blue-200'
                      : 'w-2.5 bg-slate-200'
                  }`}
                  title={`Bước ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Step Body Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Step Instruction Column */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#00558F] to-[#003B70] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    {activeTopic.steps[currentStepIndex].stepNumber}
                  </span>
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                      Bước {activeTopic.steps[currentStepIndex].stepNumber}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {activeTopic.steps[currentStepIndex].title}
                    </h3>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {activeTopic.steps[currentStepIndex].content}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Chạm hoặc click vào ảnh minh họa bên phải để xem ảnh kích thước lớn, sắc nét.
                  </span>
                </div>
              </div>

              {/* Prev / Next controls */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-3 mt-6">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Bước trước</span>
                </button>

                <div className="text-xs font-semibold text-slate-500">
                  {currentStepIndex + 1} / {activeTopic.steps.length}
                </div>

                {currentStepIndex < activeTopic.steps.length - 1 ? (
                  <button
                    onClick={() =>
                      setCurrentStepIndex((prev) =>
                        Math.min(activeTopic.steps.length - 1, prev + 1)
                      )
                    }
                    className="px-5 py-2.5 rounded-xl bg-[#00558F] text-white font-bold text-xs hover:bg-[#004675] shadow-xs flex items-center space-x-1"
                  >
                    <span>Bước tiếp theo</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const el = document.getElementById('feedback-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-xs flex items-center space-x-1"
                  >
                    <span>Hoàn thành các bước</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Step Image Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center shadow-xs">
              <div
                onClick={() => setZoomImage(activeTopic.steps[currentStepIndex].image)}
                className="relative cursor-zoom-in group w-full max-h-[500px] flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-100"
              >
                <img
                  src={activeTopic.steps[currentStepIndex].image}
                  alt={`Minh họa bước ${currentStepIndex + 1}`}
                  className="max-h-[480px] w-auto object-contain transition-transform duration-300 group-hover:scale-102"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://raw.githubusercontent.com/lhhiep161/anh-super-app/main/Logo%20VietinBank%20-%20CTG%20Slo.png';
                  }}
                />
                <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-800 text-xs font-semibold shadow-md">
                    Click để phóng to ảnh
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Feedback Interaction as required in PDF 1 */}
          <div
            id="feedback-section"
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4"
          >
            <div className="flex items-center space-x-3 text-[#00558F]">
              <MessageSquare className="w-6 h-6" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                {faq.satisfactionQuestion}
              </h3>
            </div>

            {feedbackState === 'idle' && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setFeedbackState('satisfied')}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 shadow-xs flex items-center space-x-2 transition-transform active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Đã ổn, tôi đã làm được</span>
                </button>

                <button
                  onClick={() => setFeedbackState('unsatisfied')}
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 shadow-xs flex items-center space-x-2 transition-transform active:scale-95"
                >
                  <AlertCircle className="w-5 h-5" />
                  <span>Chưa ổn, cần hỗ trợ thêm</span>
                </button>

                <button
                  onClick={handleEndConversation}
                  className="px-5 py-3 rounded-2xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-colors"
                >
                  Kết thúc cuộc trò chuyện
                </button>
              </div>
            )}

            {/* Customer says: Đã ổn */}
            {feedbackState === 'satisfied' && (
              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-emerald-900">
                      Rất vui vì đã hỗ trợ được Quý khách hoàn thành thao tác!
                    </h4>
                    <p className="text-xs sm:text-sm text-emerald-700 mt-1">
                      Quý khách có muốn tìm hiểu thêm nội dung hướng dẫn khác hoặc trải nghiệm các tính năng tiếp theo không?
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleResetToMenu}
                    className="px-5 py-2.5 rounded-xl bg-[#00558F] text-white font-bold text-xs hover:bg-[#004675] shadow-xs flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Quay lại menu chính</span>
                  </button>

                  <button
                    onClick={handleEndConversation}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-colors"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}

            {/* Customer says: Chưa ổn */}
            {feedbackState === 'unsatisfied' && (
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {faq.notSatisfiedMessage}
                    </p>
                    <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#00558F] bg-white px-3 py-1.5 rounded-lg border border-amber-200">
                      <span>Cán bộ phụ trách:</span>
                      <span className="text-red-600">{brand.adviser.name} - {brand.adviser.phoneDisplay}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={`tel:${brand.adviser.phone}`}
                    className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 shadow-xs flex items-center space-x-1.5"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Bấm để gọi ngay</span>
                  </a>

                  <button
                    onClick={handleResetToMenu}
                    className="px-5 py-2.5 rounded-xl bg-[#00558F] text-white font-semibold text-xs hover:bg-[#004675] shadow-xs flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Quay lại menu chính</span>
                  </button>

                  <button
                    onClick={handleEndConversation}
                    className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-300 transition-colors"
                  >
                    Kết thúc cuộc trò chuyện
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lightbox Image Zoom Modal */}
      {zoomImage && (
        <div
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
          >
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomImage}
              alt="Ảnh phóng to"
              className="max-h-[85vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {/* YouTube Modal */}
      {showVideoModal && activeTopic?.videoUrl && (
        <div
          onClick={() => setShowVideoModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3"
          >
            <div className="flex items-center justify-between text-white px-2">
              <div className="flex items-center space-x-2">
                <Youtube className="w-5 h-5 text-red-500" />
                <span className="font-bold text-sm">{activeTopic.title}</span>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
              {activeTopic.videoUrl.includes('youtube.com/watch?v=') ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${activeTopic.videoUrl.split('v=')[1]?.split('&')[0]}?autoplay=1`}
                  title={activeTopic.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white space-y-3">
                  <p>Mở video trên ứng dụng YouTube</p>
                  <a
                    href={activeTopic.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-sm flex items-center space-x-2"
                  >
                    <span>Mở liên kết YouTube</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>
            <div className="text-center pt-1">
              <a
                href={activeTopic.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-300 hover:underline inline-flex items-center space-x-1"
              >
                <span>Mở trực tiếp trên ứng dụng YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
