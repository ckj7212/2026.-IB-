import React, { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { ReportItem } from '../types';

interface PdfViewerModalProps {
  report: ReportItem | null;
  onClose: () => void;
}

export default function PdfViewerModal({ report, onClose }: PdfViewerModalProps) {
  if (!report) return null;

  const [blobUrl, setBlobUrl] = useState<string>('');

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

  const handleDownload = () => {
    if (report.pdfBase64) {
      const element = document.createElement("a");
      element.href = blobUrl || report.pdfBase64;
      element.download = report.filename || 'download.pdf';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } else {
      alert('⚠️ 다운로드할 수 있는 PDF 파일이 등록되지 않았습니다.');
    }
  };

  const handleOpenPDFInNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, '_blank');
    } else if (report.pdfBase64) {
      window.open(report.pdfBase64, '_blank');
    } else {
      alert('⚠️ 먼저 PDF 파일을 업로드해 주세요.');
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
              <p className="text-xs text-neutral-400 font-mono">{report.filename || 'lesson_plan.pdf'} ({report.uploadDate || '2026-06-15'})</p>
            </div>
          </div>

          {/* Reader controls */}
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            {report.pdfBase64 && (
              <button 
                id="pdf-download"
                onClick={handleDownload}
                className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 hover:text-white text-white transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                title="문서 다운로드"
              >
                <Download className="w-3.5 h-3.5" />
                <span>다운로드</span>
              </button>
            )}

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
              ⚠️ 첨부파일 없음 (PDF 문서 미등록)
            </span>
          )}


        </div>

        {/* PDF Document Stage */}
        <div id="pdf-document-scroll" className="flex-1 overflow-auto bg-neutral-950 p-4 sm:p-6 flex justify-center items-start">
          {report.pdfBase64 ? (
            <div className="w-full h-full flex flex-col gap-4 font-sans justify-between">
              
              {/* Responsive Action Header for Smartphone & Safari Compatibility */}
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-blue-400 flex items-center justify-center sm:justify-start gap-1">
                    <span>📱 스마트폰 및 타기기 호환 뷰어 안내</span>
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                    모바일 기기(아이폰/안드로이드)나 사파리 환경에서 인라인 PDF가 표시되지 않을 경우 아래 버튼들을 눌러 바로 열어볼 수 있습니다.
                  </p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-center">
                  <button
                    type="button"
                    onClick={handleOpenPDFInNewTab}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    🚀 새 창으로 열기
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    ⬇️ 다운로드
                  </button>
                </div>
              </div>

              {/* Keeps the iframe preview full-size taking the entire viewport */}
              <div className="w-full h-full min-h-[500px] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 shadow-inner relative flex-1">
                <iframe
                  src={blobUrl || report.pdfBase64}
                  className="w-full h-full bg-neutral-950 border-0"
                  title={`${report.title} PDF Document`}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6 text-center">
              <div className="max-w-md bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-xl space-y-4">
                <div className="mx-auto w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center">
                  <Download className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-white">등록된 PDF 파일이 없습니다</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    본 연구 문서 혹은 탐구 수업지도안의 실제 PDF 원본 파일이 아직 탐구포털에 등록되지 않았습니다. 
                    관리자 계정으로 접속하셔서 해당 항목에 PDF 파일을 안전하게 업로드해 주시면 바로 조회할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brief hint at bottom */}
        <div className="bg-neutral-900 border-t border-neutral-800 text-center py-2 text-[11px] text-neutral-500 shrink-0 select-none">
          마우스 스크롤 및 윈도우 조작을 통해 지도안과 연계 자료를 원격 검수할 수 있습니다.
        </div>
      </div>
    </div>
  );
}
