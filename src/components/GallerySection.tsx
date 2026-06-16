import React, { useState, useEffect } from 'react';
import { AppState, GalleryItem } from '../types';
import { Camera, Calendar, ArrowLeft, ArrowRight, X, Layers, Filter, Search, Eye } from 'lucide-react';

interface GallerySectionProps {
  state: AppState;
  currentSubTab: string;
  onViewPdf: (report: any) => void;
}

export default function GallerySection({ state, currentSubTab, onViewPdf }: GallerySectionProps) {
  const { gallery, basicInfo } = state;

  // Filters State
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTheme, setSelectedTheme] = useState('전체');

  // Lightbox index/state
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [lightboxImgIdx, setLightboxImgIdx] = useState<number>(0);

  // Sync sub-tab selections
  useEffect(() => {
    if (currentSubTab === 'study') {
      setSelectedCategory('학습');
      setSelectedGrade('전체');
    } else if (currentSubTab === 'action') {
      setSelectedCategory('Action');
      setSelectedGrade('전체');
    } else if (currentSubTab === 'portfolio') {
      setSelectedCategory('Portfolio');
      setSelectedGrade('전체');
    } else {
      setSelectedCategory('전체');
      setSelectedGrade('전체');
    }
  }, [currentSubTab]);

  const grades = ['전체', '1학년', '2학년', '3학년', '4학년', '5학년', '6학년'];
  const categories = ['전체', '학습', 'Action', 'Portfolio'];
  const themes = [
    '전체',
    basicInfo.transTheme1 || '우리는 누구인가 (Who We Are)',
    basicInfo.transTheme2 || '세계가 돌아가는 방식 (How the World Works)',
    basicInfo.transTheme3 || '우리가 속한 공간과 시간 (Where We Are in Place and Time)',
    basicInfo.transTheme4 || '우리 자신을 표현하는 방법 (How We Express Ourselves)',
    basicInfo.transTheme5 || '우리 자신을 조직하는 방식 (How We Organize Ourselves)',
    basicInfo.transTheme6 || '우리 모두의 지구 (Sharing the Planet)'
  ];

  // Filtering Logic
  const filteredGallery = gallery.filter((item) => {
    const matchGrade = selectedGrade === '전체' || item.grade === selectedGrade;
    const matchCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchTheme = selectedTheme === '전체' || item.theme.toLowerCase().includes(selectedTheme.split(' (')[0].toLowerCase());
    return matchGrade && matchCategory && matchTheme;
  });

  const handleOpenLightbox = (item: GalleryItem, imgIdx: number) => {
    setLightboxItem(item);
    setLightboxImgIdx(imgIdx);
  };

  const handleNextImg = () => {
    if (!lightboxItem) return;
    setLightboxImgIdx(prevIdx => (prevIdx + 1) % lightboxItem.images.length);
  };

  const handlePrevImg = () => {
    if (!lightboxItem) return;
    setLightboxImgIdx(prevIdx => (prevIdx - 1 + lightboxItem.images.length) % lightboxItem.images.length);
  };

  return (
    <div id="gallery-section-container" className="py-2 px-1 max-w-7xl mx-auto font-sans">

      {/* Filter panel */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="w-5 h-5 text-emerald-600" />
          <h2 className="text-sm font-bold text-neutral-800">교육 활동 갤러리 검색기</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Grade filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">학년 필터</label>
            <select
              id="gallery-grade-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 cursor-pointer font-semibold"
            >
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Activity Category filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">활동 유형</label>
            <select
              id="gallery-category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 cursor-pointer font-semibold"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Theme filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">초학문적 탐구 주제</label>
            <select
              id="gallery-theme-select"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 cursor-pointer font-semibold"
            >
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Clear filter */}
        {(selectedGrade !== '전체' || selectedCategory !== '전체' || selectedTheme !== '전체') && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSelectedGrade('전체');
                setSelectedCategory('전체');
                setSelectedTheme('전체');
              }}
              className="text-[10.5px] font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100/80 px-2 rounded py-1 transition-colors cursor-pointer"
            >
              필터 해제
            </button>
          </div>
        )}
      </div>

      {/* Grid of gallery cards */}
      {filteredGallery.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 text-neutral-500 space-y-2">
          <Layers className="w-10 h-10 text-neutral-300 mx-auto" />
          <h4 className="text-xs font-bold text-neutral-700">검색 필터에 부합하는 현장 갤러리가 없습니다</h4>
          <p className="text-[11px] text-neutral-400">다른 카테고리나 학년을 탭해 배움 사진을 탐독해보세요.</p>
        </div>
      ) : (
        <div id="gallery-grid" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredGallery.map((item) => {
            let catBadge = "bg-blue-600 text-white";
            if (item.category === 'Action') catBadge = "bg-emerald-600 text-white";
            if (item.category === 'Portfolio') catBadge = "bg-purple-600 text-white";

            return (
              <div 
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-2xs hover:shadow-xs hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                {/* Images grid/thumbnail preview */}
                <div className="relative group overflow-hidden bg-neutral-100 aspect-video flex">
                  {item.images.length > 0 ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-zoom-in"
                      onClick={() => handleOpenLightbox(item, 0)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 font-bold text-xs uppercase font-mono">
                      No Image Asset
                    </div>
                  )}

                  {/* Top category label overlay */}
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs ${catBadge}`}>
                    {item.category}
                  </span>

                  {item.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 text-[10px] bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded-md font-mono font-bold tracking-tight">
                      +{item.images.length - 1} Images
                    </span>
                  )}
                </div>

                {/* Info and detail area */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 font-sans">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                      <span>{item.grade} • {item.theme.split(' (')[0]}</span>
                      <span className="font-mono">{item.date}</span>
                    </div>
                    <h3 
                      onClick={() => handleOpenLightbox(item, 0)}
                      className="text-xs sm:text-sm font-extrabold text-neutral-900 hover:text-blue-700 cursor-pointer line-clamp-1"
                    >
                      {item.title}
                    </h3>
                    <p className="text-[11.5px] text-neutral-500 line-clamp-2 leading-relaxed text-justify">
                      {item.description}
                    </p>
                  </div>

                  {/* Multi-images minor thumbnails inside card */}
                  {item.images.length > 1 && (
                    <div className="flex gap-1.5 pt-1">
                      {item.images.map((img, index) => (
                        <div
                          key={index}
                          onClick={() => handleOpenLightbox(item, index)}
                          className={`w-10 h-8 rounded overflow-hidden border cursor-pointer hover:border-blue-500 transition-colors ${
                            index === 0 ? 'ring-1 ring-blue-500/50' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="썸네일" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  )}

                  {item.category === 'Portfolio' && (
                    <div className="pt-2 mt-1.5 border-t border-neutral-150 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-mono truncate max-w-[130px]">
                        📄 {item.files?.[0] || `${item.title}_portfolio.pdf`}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const reportSim = {
                            id: `sim-gallery-${item.id}`,
                            type: 'plan',
                            title: `[포트폴리오] ${item.grade} - ${item.title}`,
                            desc: item.description,
                            filename: item.files?.[0] || `${item.title}_portfolio.pdf`,
                            uploadDate: item.date,
                            pdfContentSim: item.pdfContentSim || item.description,
                            pdfBase64: item.pdfBase64
                          };
                          onViewPdf(reportSim);
                        }}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-md font-sans font-bold text-[10px] select-none cursor-pointer transition-all flex items-center gap-1 shadow-3xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        <span>PDF 포폴보기</span>
                      </button>
                    </div>
                  )}

                  {item.category !== 'Portfolio' && item.files?.length > 0 && (
                    <div className="pt-2 mt-1.5 border-t border-neutral-50 flex items-center justify-between text-[10.5px]">
                      <span className="text-neutral-400 font-mono truncate max-w-[170px]" title={item.files[0]}>
                        📎 {item.files[0]}
                      </span>
                      <span className="text-blue-600 font-bold hover:underline cursor-pointer">자료동반</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Overlay (라이트박스 모달) */}
      {lightboxItem && (
        <div id="lightbox-overlay" className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xs flex flex-col justify-between p-4 animate-fade-in">
          
          {/* Lightbox Head */}
          <div className="flex justify-between items-center text-white p-2 shrink-0">
            <div>
              <span className="text-[10px] tracking-wider text-emerald-400 font-extrabold uppercase bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900/50">
                {lightboxItem.category} • {lightboxItem.grade}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white mt-1">{lightboxItem.title}</h3>
            </div>
            <button 
              onClick={() => setLightboxItem(null)}
              className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition-colors text-neutral-300 hover:text-white"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lightbox Body with Prev/Next buttons */}
          <div className="flex-1 flex items-center justify-center relative my-4">
            
            {/* Prev Image */}
            <button
              onClick={handlePrevImg}
              className="absolute left-2 sm:left-6 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
              title="이전 사진"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Display Image with loading referrers */}
            <div className="max-w-full max-h-[70vh] flex flex-col items-center justify-center">
              <img
                src={lightboxItem.images[lightboxImgIdx]}
                alt={`라이트박스 ${lightboxImgIdx + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-2xl border border-neutral-800"
              />
              <span className="text-[11px] text-neutral-400 mt-3 font-mono">
                {lightboxImgIdx + 1} / {lightboxItem.images.length} • 이미지 원본 보기
              </span>
            </div>

            {/* Next Image */}
            <button
              onClick={handleNextImg}
              className="absolute right-2 sm:right-6 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
              title="다음 사진"
            >
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>

          {/* Lightbox Descriptive Bottom Container */}
          <div className="bg-neutral-900/90 text-neutral-300 p-4 rounded-xl max-w-2xl mx-auto border border-neutral-800 shrink-0 text-xs sm:text-sm font-sans space-y-3">
            <p className="text-neutral-400 leading-relaxed text-justify">
              {lightboxItem.description}
            </p>
            {lightboxItem.category === 'Portfolio' && (
              <div className="pt-2 border-t border-neutral-800/80 flex justify-between items-center">
                <span className="text-[11px] text-neutral-400">📄 PDF 포트폴리오 첨부됨</span>
                <button
                  onClick={() => {
                    const reportSim = {
                      id: `sim-gallery-${lightboxItem.id}`,
                      type: 'plan',
                      title: `[포트폴리오] ${lightboxItem.grade} - ${lightboxItem.title}`,
                      desc: lightboxItem.description,
                      filename: lightboxItem.files?.[0] || `${lightboxItem.title}_portfolio.pdf`,
                      uploadDate: lightboxItem.date,
                      pdfContentSim: lightboxItem.pdfContentSim || lightboxItem.description,
                      pdfBase64: lightboxItem.pdfBase64
                    };
                    onViewPdf(reportSim);
                  }}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white border border-red-500 rounded-lg text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  <span>PDF 뷰어로 열기</span>
                </button>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-[11px] text-neutral-500">
              <span>초학문 주제: {lightboxItem.theme}</span>
              <span>등록일자: {lightboxItem.date}</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
