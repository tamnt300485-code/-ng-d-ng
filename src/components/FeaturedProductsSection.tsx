import React, { useState } from 'react';
import {
  Sparkles,
  Star,
  Gift,
  Heart,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  CheckCircle,
  X,
  ExternalLink,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import contentData from '../data/contentData.json';

export const FeaturedProductsSection: React.FC = () => {
  const { products, brand } = contentData;
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [showInterestModal, setShowInterestModal] = useState<boolean>(false);
  const [interestedProduct, setInterestedProduct] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);

  const filteredItems = products.items.filter((item) => {
    if (activeCategory === 'Tất cả') return true;
    if (activeCategory.includes('cá nhân') && item.group.includes('cá nhân')) return true;
    if (activeCategory.includes('hộ kinh doanh') && item.group.includes('hộ kinh doanh')) return true;
    if (activeCategory.includes('doanh nghiệp') && item.group.includes('doanh nghiệp')) return true;
    if (activeCategory.includes('Ưu đãi') && item.group.includes('Ưu đãi')) return true;
    if (activeCategory.includes('đấu giá') && item.group.includes('đấu giá')) return true;
    return item.group === activeCategory;
  });

  const handleInterestClick = (item: any) => {
    setInterestedProduct(item);
    setShowInterestModal(true);
  };

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#003B70] via-[#00558F] to-[#D8232A] rounded-3xl text-white p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ưu đãi & Giải pháp độc quyền</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{products.title}</h2>
          <p className="text-blue-100 text-xs sm:text-sm max-w-xl">
            {products.description}
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl backdrop-blur-xs border border-white/20">
          <button
            onClick={() => setViewMode('carousel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'carousel'
                ? 'bg-white text-[#00558F] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Dạng Carousel</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'grid'
                ? 'bg-white text-[#00558F] shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Dạng Lưới</span>
          </button>
        </div>
      </div>

      {/* Filter Chips as specified in PDF 5 */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
        {products.categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCarouselIndex(0);
              }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border ${
                isSelected
                  ? 'bg-[#00558F] text-white border-[#00558F] shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-blue-50 border-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* View Mode: Carousel */}
      {viewMode === 'carousel' && filteredItems.length > 0 && (
        <div className="relative bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-xs overflow-hidden">
          {/* Active slide */}
          {(() => {
            const currentItem = filteredItems[carouselIndex % filteredItems.length];
            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Poster Image */}
                <div className="lg:col-span-7 flex justify-center">
                  <div
                    onClick={() => setSelectedProduct(currentItem)}
                    className="relative cursor-pointer group rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md max-h-[500px] bg-slate-50 flex items-center justify-center p-2"
                  >
                    <img
                      src={currentItem.image}
                      alt={currentItem.title}
                      className="max-h-[460px] w-auto object-contain rounded-xl transition-transform duration-300 group-hover:scale-102"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'https://raw.githubusercontent.com/lhhiep161/anh-super-app/main/Logo%20VietinBank%20-%20CTG%20Slo.png';
                      }}
                    />
                    <div className="absolute top-4 left-4 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md">
                      <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                      <span>{currentItem.badge}</span>
                    </div>
                  </div>
                </div>

                {/* Details & Action */}
                <div className="lg:col-span-5 space-y-5">
                  <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#00558F] text-xs font-bold border border-blue-200">
                      {currentItem.group}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                      {currentItem.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                      {currentItem.desc}
                    </p>
                  </div>

                  {currentItem.benefits && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Điểm nổi bật:
                      </h4>
                      <div className="space-y-1.5">
                        {currentItem.benefits.map((b: string, i: number) => (
                          <div key={i} className="flex items-center space-x-2 text-xs sm:text-sm text-slate-700">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => handleInterestClick(currentItem)}
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#D8232A] to-[#ED1C24] hover:brightness-110 text-white font-extrabold text-sm sm:text-base shadow-md transition-all flex items-center justify-center space-x-2 active:scale-98"
                    >
                      <Heart className="w-5 h-5 fill-white" />
                      <span>Tôi quan tâm</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
            <button
              onClick={prevSlide}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1 text-xs font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Poster trước</span>
            </button>

            {/* Dots */}
            <div className="flex items-center space-x-2">
              {filteredItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === carouselIndex % filteredItems.length
                      ? 'w-8 bg-[#00558F]'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1 text-xs font-semibold"
            >
              <span>Poster tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Mode: Grid */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-center h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'https://raw.githubusercontent.com/lhhiep161/anh-super-app/main/Logo%20VietinBank%20-%20CTG%20Slo.png';
                  }}
                />
                <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600 text-white shadow-xs">
                  {item.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-700 shadow-xs backdrop-blur-xs">
                  {item.group}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#00558F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleInterestClick(item)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#00558F] hover:bg-[#004675] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Tôi quan tâm</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* "Tôi Quan Tâm" Modal as strictly required in PDF 5 Page 1 */}
      {showInterestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-red-600 flex items-center justify-center">
                  <Heart className="w-7 h-7 fill-red-500 text-red-500" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Ghi nhận quan tâm
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {interestedProduct?.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setShowInterestModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 text-slate-700 text-sm leading-relaxed">
              <p className="font-semibold text-slate-900">
                Cảm ơn Quý khách đã quan tâm đến sản phẩm/dịch vụ này. Quý khách vui lòng liên hệ cán bộ VietinBank tại quầy để được tư vấn chi tiết.
              </p>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-[#00558F] font-medium">
                Hoặc liên hệ Chuyên viên tư vấn: <br />
                <strong className="text-sm font-bold text-red-600">
                  {brand.adviser.name} - {brand.adviser.phoneDisplay}
                </strong>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={`tel:${brand.adviser.phone}`}
                className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm text-center shadow-md flex items-center justify-center space-x-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Gọi tư vấn ngay</span>
              </a>

              <button
                onClick={() => setShowInterestModal(false)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm"
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
