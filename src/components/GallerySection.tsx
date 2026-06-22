import React, { useState, useEffect } from 'react';
import { AppState, GalleryItem } from '../types';
import { Camera, Calendar, ArrowLeft, ArrowRight, X, Layers, Filter, Search, Eye, Upload, PlusCircle, Check, FileText } from 'lucide-react';

interface GallerySectionProps {
  state: AppState;
  currentSubTab: string;
  onViewPdf: (report: any) => void;
  onUpdateState?: (newState: AppState) => void;
}

export default function GallerySection({ state, currentSubTab, onViewPdf, onUpdateState }: GallerySectionProps) {
  const { gallery, basicInfo } = state;

  // Filters State
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedTheme, setSelectedTheme] = useState('전체');

  // Lightbox index/state
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [lightboxImgIdx, setLightboxImgIdx] = useState<number>(0);

  // Swipe navigation state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Teacher direct upload modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemGrade, setNewItemGrade] = useState('5학년');
  const [newItemCategory, setNewItemCategory] = useState<'학습' | 'Action' | 'Portfolio'>('학습');
  const [newItemTheme, setNewItemTheme] = useState('세계가 돌아가는 방식 (How the World Works)');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemImages, setNewItemImages] = useState<string[]>([]);
  const [newItemPdfBase64, setNewItemPdfBase64] = useState('');
  const [newItemPdfName, setNewItemPdfName] = useState('');
  const [newItemPdfs, setNewItemPdfs] = useState<{ name: string; base64: string }[]>([]);

  // Keyboard navigation listener inside lightbox
  useEffect(() => {
    if (!lightboxItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextImg();
      } else if (e.key === 'ArrowLeft') {
        handlePrevImg();
      } else if (e.key === 'Escape') {
        setLightboxItem(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxItem, lightboxImgIdx]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    // Swipe left (diffX > 50) -> next, swipe right (diffX < -50) -> prev
    if (diffX > 50) {
      handleNextImg();
    } else if (diffX < -50) {
      handlePrevImg();
    }
    setTouchStartX(null);
  };

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

  const handleNewImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewItemImages(prev => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file as any);
    });
  };

  const handleNewPdfAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const loadedPdfs: { name: string; base64: string }[] = [];
    let completed = 0;

    for (let i = 0; i < files.length; i++) {
       const file = files[i];
       const reader = new FileReader();
       reader.onloadend = () => {
         if (typeof reader.result === 'string') {
           loadedPdfs.push({ name: file.name, base64: reader.result });
         }
         completed++;
         if (completed === files.length) {
           setNewItemPdfs(prev => {
             const updated = [...prev, ...loadedPdfs];
             // For fallback, keep setting first PDF info
             if (updated.length > 0) {
               setNewItemPdfBase64(updated[0].base64);
               setNewItemPdfName(updated[0].name);
             }
             return updated;
           });
         }
       };
       reader.readAsDataURL(file as any);
    }
  };

  const handleSubmitNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) {
      alert('갤러리 제목을 입력해 주세요.');
      return;
    }
    const hasPdfs = newItemPdfs.length > 0 || newItemPdfBase64;
    if (newItemImages.length === 0 && !hasPdfs) {
      alert('활동 대표 사진 또는 첨부 PDF 보고서 중 최소 1개는 포함되어야 합니다.');
      return;
    }

    const newGalleryItem: GalleryItem = {
      id: `gal-pub-${Date.now()}`,
      title: newItemTitle,
      grade: newItemGrade,
      category: newItemCategory,
      theme: newItemTheme,
      description: newItemDescription || '선생님이 등록하신 활동 설명입니다.',
      images: newItemImages,
      files: newItemPdfs.length > 0 ? newItemPdfs.map(x => x.name) : (newItemPdfName ? [newItemPdfName] : []),
      pdfBase64: newItemPdfs.length > 0 ? newItemPdfs[0].base64 : (newItemPdfBase64 || undefined),
      pdfFiles: newItemPdfs,
      pdfContentSim: newItemDescription || '선생님이 등록하신 활동 원본 포트폴리오입니다.',
      date: new Date().toISOString().substring(0, 10)
    };

    if (onUpdateState) {
      onUpdateState({
        ...state,
        gallery: [newGalleryItem, ...state.gallery]
      });
      alert('🎉 교육현장 갤러리 자료가 성공적으로 등록되었습니다.');
      // Reset forms
      setNewItemTitle('');
      setNewItemGrade('5학년');
      setNewItemCategory('학습');
      setNewItemTheme('세계가 돌아가는 방식 (How the World Works)');
      setNewItemDescription('');
      setNewItemImages([]);
      setNewItemPdfBase64('');
      setNewItemPdfName('');
      setNewItemPdfs([]);
      setShowAddModal(false);
    } else {
      alert('업로드 도중 오류가 발생했습니다: update handler is missing.');
    }
  };

  const handleOpenPdfDirectly = (item: GalleryItem) => {
    // If the item has multiple files, open the first one by default when clicked directly on thumbnails
    const base64 = item.pdfFiles && item.pdfFiles.length > 0 ? item.pdfFiles[0].base64 : item.pdfBase64;
    const name = item.pdfFiles && item.pdfFiles.length > 0 ? item.pdfFiles[0].name : (item.files?.[0] || `${item.title}_portfolio.pdf`);

    const reportSim = {
      id: `sim-gallery-${item.id}`,
      type: 'plan',
      title: `[포트폴리오] ${item.grade} - ${item.title}`,
      desc: item.description,
      filename: name,
      uploadDate: item.date,
      pdfContentSim: item.pdfContentSim || item.description,
      pdfBase64: base64
    };
    onViewPdf(reportSim);
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

      {/* Teacher Direct Upload Button */}
      {onUpdateState && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] hover:shadow-md cursor-pointer select-none active:scale-[0.99]"
          >
            <PlusCircle className="w-4 h-4 text-emerald-100" />
            <span>글쓰기</span>
          </button>
        </div>
      )}

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
                      onClick={() => {
                        if (item.pdfBase64) {
                          handleOpenPdfDirectly(item);
                        } else {
                          handleOpenLightbox(item, 0);
                        }
                      }}
                    />
                  ) : item.pdfBase64 ? (
                    <div 
                      onClick={() => handleOpenPdfDirectly(item)}
                      className="w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-red-50/50 to-neutral-50 text-red-650 cursor-pointer group-hover:bg-red-50 transition-colors p-4 border-b border-neutral-200"
                    >
                      <Layers className="w-10 h-10 text-red-400 mb-1 animate-pulse" />
                      <span className="text-[10.5px] font-extrabold text-neutral-700 tracking-tight text-center line-clamp-2 px-2">{item.title}</span>
                      <span className="text-[9px] text-red-600 font-extrabold mt-1.5 uppercase tracking-wider font-mono">원클릭 PDF 열기</span>
                    </div>
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
                      onClick={() => {
                        if (item.pdfBase64) {
                          handleOpenPdfDirectly(item);
                        } else {
                          handleOpenLightbox(item, 0);
                        }
                      }}
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
                          onClick={() => {
                            if (item.pdfBase64) {
                              handleOpenPdfDirectly(item);
                            } else {
                              handleOpenLightbox(item, index);
                            }
                          }}
                          className={`w-10 h-8 rounded overflow-hidden border cursor-pointer hover:border-blue-500 transition-colors ${
                            index === 0 ? 'ring-1 ring-blue-500/50' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="썸네일" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Multiple PDFs support inside the card */}
                  {((item.pdfFiles && item.pdfFiles.length > 0) || item.pdfBase64) && (
                    <div className="pt-2 mt-1.5 border-t border-neutral-150 space-y-1.5">
                      {item.pdfFiles && item.pdfFiles.length > 0 ? (
                        item.pdfFiles.map((pdf, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between gap-2">
                            <span className="text-[10px] text-neutral-605 font-mono truncate max-w-[130px] font-bold" title={pdf.name}>
                              📄 {pdf.name}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileSim = {
                                  id: `sim-gallery-${item.id}-${pIdx}`,
                                  type: 'plan',
                                  title: `[포트폴리오] ${item.grade} - ${item.title} (${pIdx + 1})`,
                                  desc: item.description,
                                  filename: pdf.name,
                                  uploadDate: item.date,
                                  pdfContentSim: item.pdfContentSim || item.description,
                                  pdfBase64: pdf.base64
                                };
                                onViewPdf(fileSim);
                              }}
                              className="px-1.5 py-0.5 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-md font-sans font-bold text-[9px] select-none cursor-pointer transition-all flex items-center gap-1 shadow-3xs shrink-0"
                            >
                              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span>
                              <span>열기</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        // Fallback to legacy single pdf format
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="text-[10px] text-red-650 font-mono truncate max-w-[130px] font-bold">
                            📄 {item.files?.[0] || `${item.title}_portfolio.pdf`}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPdfDirectly(item);
                            }}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-650 border border-red-200 rounded-md font-sans font-bold text-[10px] select-none cursor-pointer transition-all flex items-center gap-1 shadow-3xs shrink-0"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                            <span>PDF 보기</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {item.category !== 'Portfolio' && !item.pdfBase64 && (!item.pdfFiles || item.pdfFiles.length === 0) && item.files?.length > 0 && (
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
            <div 
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="max-w-full max-h-[70vh] flex flex-col items-center justify-center select-none touch-pan-y cursor-grab active:cursor-grabbing"
            >
              <img
                src={lightboxItem.images[lightboxImgIdx]}
                alt={`라이트박스 ${lightboxImgIdx + 1}`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[65vh] object-contain rounded-lg shadow-2xl border border-neutral-800"
              />
              <span className="text-[11px] text-neutral-400 mt-3 font-mono text-center px-4">
                {lightboxImgIdx + 1} / {lightboxItem.images.length} • 모바일 스와이프 및 PC 키보드 방향키(←, →) 지원
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
            {((lightboxItem.pdfFiles && lightboxItem.pdfFiles.length > 0) || lightboxItem.pdfBase64) && (
              <div className="pt-2 border-t border-neutral-800/85 space-y-2">
                <span className="text-[11px] text-neutral-400 font-bold">📄 첨부된 PDF 포트폴리오 문서 목록 ({lightboxItem.pdfFiles?.length || 1}개)</span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                  {lightboxItem.pdfFiles && lightboxItem.pdfFiles.length > 0 ? (
                    lightboxItem.pdfFiles.map((pdf, pIdx) => (
                      <div key={pIdx} className="flex justify-between items-center bg-black/40 p-2 border border-neutral-800 rounded">
                        <span className="text-[11px] text-neutral-350 font-mono truncate max-w-[320px] sm:max-w-[450px]" title={pdf.name}>{pdf.name}</span>
                        <button
                          onClick={() => {
                            const fileSim = {
                              id: `sim-gallery-${lightboxItem.id}-${pIdx}`,
                              type: 'plan',
                              title: `[포트폴리오] ${lightboxItem.grade} - ${lightboxItem.title}`,
                              desc: lightboxItem.description,
                              filename: pdf.name,
                              uploadDate: lightboxItem.date,
                              pdfContentSim: lightboxItem.pdfContentSim || lightboxItem.description,
                              pdfBase64: pdf.base64
                            };
                            onViewPdf(fileSim);
                          }}
                          className="px-2 py-1 bg-red-650 hover:bg-red-550 text-white rounded text-[10px] font-bold font-sans cursor-pointer transition-all flex items-center gap-1 shrink-0"
                        >
                          <span className="w-1 h-1 rounded-full bg-white animate-pulse"></span>
                          <span>PDF 열기</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    // Legacy single PDF file
                    <div className="flex justify-between items-center bg-black/40 p-2 border border-neutral-800 rounded">
                      <span className="text-[11px] text-neutral-350 font-mono truncate max-w-[320px] sm:max-w-[450px]">
                        {lightboxItem.files?.[0] || `${lightboxItem.title}_portfolio.pdf`}
                      </span>
                      <button
                        onClick={() => {
                          handleOpenPdfDirectly(lightboxItem);
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white border border-red-500 rounded text-xs font-bold font-sans cursor-pointer transition-all flex items-center gap-1 shrink-0"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                        <span>PDF 열기</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-[11px] text-neutral-500">
              <span>초학문 주제: {lightboxItem.theme}</span>
              <span>등록일자: {lightboxItem.date}</span>
            </div>
          </div>

        </div>
      )}

      {/* Teacher Direct Upload Modal Dialogue */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl border border-neutral-200 shadow-2xl p-6 relative flex flex-col max-h-[90vh]">
            
            {/* Modal Head */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base sm:text-lg font-extrabold text-neutral-800">선생님 활동 및 산출물 직접 등록</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleSubmitNewItem} className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
              
              {/* Title input */}
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-neutral-700">📌 활동/산출물 제목 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="예: 5학년 세계 박람회 탐구 산출 포스터"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:border-emerald-600 focus:outline-hidden font-medium text-neutral-800"
                />
              </div>

              {/* Selector grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Grade */}
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-700">대상 학년</label>
                  <select
                    value={newItemGrade}
                    onChange={(e) => setNewItemGrade(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 font-semibold cursor-pointer"
                  >
                    {['1학년', '2학년', '3학년', '4학년', '5학년', '6학년'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-700">활동 분류</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 font-semibold cursor-pointer"
                  >
                    <option value="학습">학습 (Study)</option>
                    <option value="Action">실천 (Action)</option>
                    <option value="Portfolio">포트폴리오 (Portfolio)</option>
                  </select>
                </div>

                {/* Theme */}
                <div className="flex flex-col space-y-1">
                  <label className="font-bold text-neutral-700">초학문 탐구주제</label>
                  <select
                    value={newItemTheme}
                    onChange={(e) => setNewItemTheme(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden text-neutral-700 font-semibold cursor-pointer"
                  >
                    {[
                      '우리는 누구인가 (Who We Are)',
                      '세계가 돌아가는 방식 (How the World Works)',
                      '우리가 속한 공간과 시간 (Where We Are in Place and Time)',
                      '우리 자신을 표현하는 방법 (How We Express Ourselves)',
                      '우리 자신을 조직하는 방식 (How We Organize Ourselves)',
                      '우리 모두의 지구 (Sharing the Planet)'
                    ].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1">
                <label className="font-bold text-neutral-700">📝 상세 활동 설명</label>
                <textarea
                  placeholder="학습 목표, 실천 활동의 내용 및 배움의 성찰 내용을 요약 기록해 주세요."
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-hidden text-neutral-800 focus:border-emerald-600"
                ></textarea>
              </div>

              {/* Multiple Images Upload */}
              <div className="p-3 bg-neutral-50 rounded-xl space-y-2 border border-neutral-200/60 font-sans">
                <label className="font-bold text-neutral-800 block">🖼️ 대표 활동 사진 선택 (다중 등록 및 첨부 가능)</label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md hover:bg-emerald-100 transition-all font-bold text-xs flex items-center gap-1 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>사진 선택</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleNewImageAdd}
                    />
                  </label>
                  <span className="text-[10.5px] text-neutral-400 font-medium">선택된 사진 개수: {newItemImages.length}장</span>
                </div>

                {/* Selected Thumbs */}
                {newItemImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-neutral-200/50">
                    {newItemImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded border overflow-hidden bg-white shadow-3xs group">
                        <img src={img} alt="업로드 이미지" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewItemImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute inset-x-0 bottom-0 bg-red-600/90 text-[10px] text-white py-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-center font-bold cursor-pointer"
                        >
                          제거
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PDF Documents Upload */}
              <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 space-y-2 font-sans">
                <label className="font-bold text-red-800 block">📄 [선택] 실제 PDF 포트폴리오 원본 동반 탑재 (다중 선택 가능)</label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <label className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold block text-center cursor-pointer flex items-center gap-1 shrink-0 w-fit transition-all shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>PDF 파일 선택 (다중)</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      multiple
                      className="hidden"
                      onChange={handleNewPdfAdd}
                    />
                  </label>
                  <span className="text-neutral-500 text-[11px]">* 학교 학습지, 탐구성찰 산출지 등 PDF 문서들을 여러 개 탑재할 수 있습니다.</span>
                </div>

                {/* Selected PDFs List */}
                {newItemPdfs.length > 0 && (
                  <div className="mt-2 space-y-1.5 bg-white p-2.5 rounded-lg border border-red-100 max-h-40 overflow-y-auto">
                    <p className="text-[10.5px] text-neutral-400 font-bold mb-1">첨부 지정된 PDF 파일 ({newItemPdfs.length}개):</p>
                    {newItemPdfs.map((pdf, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2 p-1 bg-neutral-50/50 border border-neutral-100 rounded">
                        <span className="text-[11px] text-neutral-700 font-bold font-mono truncate max-w-[220px] sm:max-w-md block">📄 {pdf.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewItemPdfs(prev => {
                              const remaining = prev.filter((_, i) => i !== idx);
                              if (remaining.length === 0) {
                                setNewItemPdfBase64('');
                                setNewItemPdfName('');
                              } else {
                                setNewItemPdfBase64(remaining[0].base64);
                                setNewItemPdfName(remaining[0].name);
                              }
                              return remaining;
                            });
                          }}
                          className="text-red-500 hover:text-red-700 text-xs font-bold shrink-0 cursor-pointer"
                        >
                          제거
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit / Cancel Actions */}
              <div className="pt-4 border-t border-neutral-100 flex justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg text-xs font-bold transition-all cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>배움자료 등록하기</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
