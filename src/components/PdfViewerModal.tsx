import React, { useState, useEffect } from 'react';
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { ReportItem } from '../types';

interface PdfViewerModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export default function PdfViewerModal({ report, onClose }: PdfViewerModalProps) {
  if (!report) return null;

  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [blobUrl, setBlobUrl] = useState<string>('');
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>(report.pdfBase64 ? 'pdf' : 'text');

  useEffect(() => {
    if (report) {
      setViewMode(report.pdfBase64 ? 'pdf' : 'text');
    }
  }, [report.id, report.pdfBase64]);

  useEffect(() => {
    if (report && report.pdfBase64) {
      try {
        // Clean up data-uri scheme if needed, split parts
        const base64Data = report.pdfBase64;
        const commaIndex = base64Data.indexOf(',');
        const base64String = commaIndex !== -1 ? base64Data.substring(commaIndex + 1) : base64Data;
        const mimeMatch = base64Data.match(/data:([^;]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';

        const raw = window.atob(base64String);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        const blob = new Blob([uInt8Array], { type: mime });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        return () => {
          URL.revokeObjectURL(url);
        };
      } catch (err) {
        console.error("Failed to parse base64 to PDF blobURL:", err);
        // Fallback to the raw string if parsing fails
        setBlobUrl(report.pdfBase64);
      }
    } else {
      setBlobUrl('');
    }
  }, [report?.pdfBase64]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 80));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (report.pdfBase64) {
      const element = document.createElement("a");
      element.href = blobUrl || report.pdfBase64;
      element.download = report.filename || 'download.pdf';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      // Generate simulated text download
      const element = document.createElement("a");
      const file = new Blob([report.pdfContentSim || 'No plan content provided.'], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = report.filename ? report.filename.replace('.pdf', '_draft.txt') : 'draft.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleOpenPDFInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    } else if (report.pdfBase64) {
      window.open(report.pdfBase64, '_blank');
    }
  };

  return (
    <div id="pdf-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div id="pdf-modal-container" className="flex flex-col w-full max-w-4xl h-[90vh] bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-neutral-700">
        
        {/* PDF Top Bar */}
        <div id="pdf-modal-header" className="flex flex-wrap items-center justify-between px-4 py-3 bg-neutral-800 border-b border-neutral-700 text-neutral-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 px-2 py-1 rounded text-white inline-flex items-center justify-center font-black text-xs">
              PDF
            </div>
            <div>
              <h3 className="text-sm font-bold text-white max-w-sm sm:max-w-md truncate">{report.title}</h3>
              <p className="text-xs text-neutral-400 font-mono">{report.filename} ({report.uploadDate})</p>
            </div>
          </div>

          {/* Reader controls */}
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {!report.pdfBase64 && (
              <>
                <button 
                  id="pdf-zoom-out"
                  onClick={handleZoomOut}
                  className="p-1.5 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="축소"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-neutral-400 min-w-[32px] text-center">{zoom}%</span>
                <button 
                  id="pdf-zoom-in"
                  onClick={handleZoomIn}
                  className="p-1.5 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="확대"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-neutral-700"></div>

                <button 
                  id="pdf-rotate"
                  onClick={handleRotate}
                  className="p-1.5 rounded hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                  title="회전"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <div className="h-4 w-[1px] bg-neutral-700"></div>
              </>
            )}

            <button 
              id="pdf-download"
              onClick={handleDownload}
              className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 hover:text-white text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              title="문서 다운로드"
            >
              <Download className="w-3.5 h-3.5" />
              <span>다운로드</span>
            </button>

            <div className="h-4 w-[1px] bg-neutral-700"></div>

            <button 
              id="pdf-close"
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-750 hover:bg-red-600 hover:text-white transition-all text-neutral-300 cursor-pointer"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Sub-bar for status */}
        <div className="bg-neutral-850 px-4 py-2 border-b border-neutral-800 flex justify-between items-center text-xs text-neutral-400 shrink-0">
          {report.pdfBase64 ? (
            <span className="text-[10.5px] text-emerald-400 font-bold font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              고해상도 실시간 PDF 뷰어 연동 중
            </span>
          ) : (
            <span className="text-[10.5px] text-amber-500 font-bold font-mono">
              📝 디지털 UOI 탐구 지도안 문서 뷰어 (심사 대기용)
            </span>
          )}

          <span className="hidden md:inline text-neutral-500 text-[10.5px] font-mono">빛가람초등학교 IB PYP 연구정보원</span>
        </div>

        {/* Tab Toggle for PDF vs Text */}
        {report.pdfBase64 && (
          <div className="flex bg-neutral-900 border-b border-neutral-850 px-4 pt-3 gap-2 shrink-0">
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
                viewMode === 'pdf'
                  ? 'bg-neutral-950 border-t border-x border-neutral-700 text-white text-[11.5px]'
                  : 'text-neutral-400 hover:text-white bg-neutral-950/40 hover:bg-neutral-950/80 font-medium'
              }`}
            >
              📄 PDF 원본 뷰어 및 다운로드
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer ${
                viewMode === 'text'
                  ? 'bg-neutral-950 border-t border-x border-neutral-700 text-white text-[11.5px]'
                  : 'text-neutral-400 hover:text-white bg-neutral-950/40 hover:bg-neutral-950/80 font-medium'
              }`}
            >
              📝 모바일/크롬용 텍스트 문서 대체 보기
            </button>
          </div>
        )}

        {/* PDF Document Stage */}
        <div id="pdf-document-scroll" className="flex-1 overflow-auto bg-neutral-950 p-4 sm:p-6 flex justify-center items-start">
          {viewMode === 'pdf' ? (
            <div className="w-full h-full flex flex-col gap-4 font-sans justify-between">
              
              {/* Sandbox Workaround Friendly Access Card */}
              <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl text-center space-y-3 w-full max-w-2xl mx-auto shadow-xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-extrabold text-white flex items-center justify-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    💡 크롬(Chrome) 및 모바일 임베드 차단 해결 패널
                  </h4>
                  <p className="text-[11.5px] text-neutral-400 leading-relaxed">
                    구글 크롬 등의 브라우저에서 <span className="text-rose-400">"크롬에서 지원하지 않는 형식"</span>이나 빈 화면이 표시될 수 있습니다. 
                    이는 현재 미리보기 창의 보안 모래상자(Sandbox) 규제로 인한 현상입니다. 
                    아래 버튼들이나 상단 탭을 통해 해결할 수 있습니다.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1.5 font-sans">
                  <button
                    type="button"
                    onClick={handleOpenPDFInNewTab}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow hover:scale-[1.01]"
                  >
                    🖥️ 새 창에서 PDF 원본 전체화면 열기
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow hover:scale-[1.01]"
                  >
                    📁 원본 다운로드 저장
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('text')}
                    className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-extrabold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    📝 텍스트 대체문서로 바로보기
                  </button>
                </div>
              </div>

              {/* Keeps the iframe preview under the quick button */}
              <div className="flex-1 min-h-[380px] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 shadow-inner relative">
                <iframe
                  src={blobUrl || report.pdfBase64}
                  className="w-full h-full bg-neutral-950 border-0"
                  title={`${report.title} PDF Document`}
                />
              </div>
            </div>
          ) : (
            /* Elegant Visual Simulated PDF sheet */
            <div className="w-full flex justify-center overflow-auto items-start min-h-full py-4">
              <div 
                id="pdf-rendered-page"
                className="bg-white text-neutral-800 p-8 sm:p-12 w-full max-w-2xl shadow-2xl transition-transform duration-300 rounded-md relative border border-neutral-300"
                style={{ 
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transformOrigin: 'top center',
                }}
              >
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none rotate-45 overflow-hidden">
                  <span className="text-4xl font-extrabold text-blue-900 tracking-widest text-center uppercase">
                    BITGARAM ELEMENTARY SCHOOL<br/>IB PYP STUDY PORTAL
                  </span>
                </div>

                {/* Simulated Document Header */}
                <div className="border-b-2 border-neutral-800 pb-4 mb-6 flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-800 tracking-wider font-sans bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      IB PYP 통합 탐구 플래너 지도안
                    </span>
                    <h1 className="text-lg font-extrabold text-neutral-900 font-sans tracking-tight mt-1">
                      {report.title}
                    </h1>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      문서번호: BITGARAM-UOI-2026-{report.id.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-neutral-400 font-mono select-none leading-relaxed">
                    <p>발행처 : 빛가람초등학교</p>
                    <p>기안일 : {report.uploadDate}</p>
                    <p>상물상태 : 내부 심의 지도안</p>
                  </div>
                </div>

                {/* Simulated PDF Dynamic content */}
                <div className="min-h-[420px] text-xs sm:text-sm leading-relaxed text-neutral-700 space-y-5 font-sans animate-fade-in">
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded text-neutral-700 text-xs flex flex-col gap-1 select-none">
                    <span className="font-bold flex items-center gap-1 text-amber-800">💡 안내 및 공지사항</span>
                    <span>본 화면은 관리자 페이지에서 실제 PDF 파일이 업로드되지 않았을 때 표시되는 대체 성문화 지도안 포맷입니다.</span>
                    <span className="font-bold text-blue-800">관리자 패널(수업자료 관리)에서 PDF 파일을 직접 업로드해주시면, 즉시 고해상도 PDF 원본이 화면에 바로 노출됩니다.</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-base font-extrabold text-neutral-950 border-b border-neutral-200 pb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-4 bg-blue-600 rounded-sm"></span>
                      1. 핵심 탐구 설계 내역
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-neutral-50 p-3 rounded border border-neutral-150 text-xs">
                      <div>
                        <span className="font-bold text-neutral-400 block text-[10px] uppercase">중심 아이디어 (Central Idea)</span>
                        <span className="font-bold text-neutral-800 text-xs">{report.desc || '정보 미기재'}</span>
                      </div>
                      <div>
                        <span className="font-bold text-neutral-400 block text-[10px] uppercase">등록 기안일 (Date)</span>
                        <span className="font-medium text-neutral-700 text-xs">{report.uploadDate || '정보 미기재'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <h2 className="text-base font-extrabold text-neutral-950 border-b border-neutral-200 pb-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-4 bg-blue-600 rounded-sm"></span>
                      2. 수업나눔 지도 상세 요약안
                    </h2>
                    <div className="text-neutral-700 whitespace-pre-wrap leading-relaxed text-xs bg-neutral-50/50 p-4 rounded-lg border border-neutral-200">
                      {report.pdfContentSim || "등록된 상세 요약 텍스트가 없습니다."}
                    </div>
                  </div>
                </div>

                {/* Simulated Document Footer */}
                <div className="border-t border-neutral-200 pt-4 mt-8 flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                  <span>빛가람초등학교 IB PYP 연구부 개발팀</span>
                  <span>- Page 1 of 1 -</span>
                  <span>대외비 (학내 연구공유용)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brief hint at bottom */}
        <div className="bg-neutral-900 border-t border-neutral-800 text-center py-2 text-[11px] text-neutral-500 shrink-0">
          마우스 스크롤 및 윈도우 조작을 통해 지도안과 연계 자료를 원격 검수할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
