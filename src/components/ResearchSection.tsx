import React, { useState } from 'react';
import { AppState, ReportItem, ResearchTaskItem } from '../types';
import { FileText, Eye, Info, Layers, CheckCircle2, Quote, ArrowUpRight, TrendingUp, HelpCircle, ArrowDown, Sparkles, Award, ArrowRight } from 'lucide-react';

interface ResearchSectionProps {
  state: AppState;
  currentSubTab: string;
  onViewReport: (report: ReportItem) => void;
  onUpdateState?: (newState: AppState) => void;
  isAdminMode?: boolean;
}

export default function ResearchSection({ 
  state, 
  currentSubTab, 
  onViewReport,
  onUpdateState,
  isAdminMode = false
}: ResearchSectionProps) {
  const { basicInfo, reports, infographic, researchTasks, outcomes } = state;
  const [selectedTask, setSelectedTask] = useState<ResearchTaskItem | null>(null);
  const [viewingAttachment, setViewingAttachment] = useState<any>(null);
  const [activeThemeTab, setActiveThemeTab] = useState<number>(1);
  const [activeOutcomeTab, setActiveOutcomeTab] = useState<'quantitative' | 'qualitative'>('quantitative');
  const [activeAttachmentIndex, setActiveAttachmentIndex] = useState<number>(0);
  const [pdfBlobUrls, setPdfBlobUrls] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setActiveAttachmentIndex(0);
  }, [selectedTask?.id]);

  React.useEffect(() => {
    if (!selectedTask || !selectedTask.attachments) {
      setPdfBlobUrls({});
      return;
    }

    const newUrls: Record<string, string> = {};
    const createdUrls: string[] = [];

    selectedTask.attachments.forEach((att) => {
      if (att.type === 'pdf' && att.data) {
        try {
          const base64Data = att.data;
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
          newUrls[att.id] = url;
          createdUrls.push(url);
        } catch (err) {
          console.error("Failed to parse base64 to PDF blobURL:", att.id, err);
          newUrls[att.id] = att.data;
        }
      }
    });

    setPdfBlobUrls(newUrls);

    return () => {
      createdUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selectedTask]);

  const getStepStyles = (index: number) => {
    const styles = [
      {
        border: 'border-neutral-200/95 hover:border-blue-400 border-t-4 border-t-blue-600',
        badgeBg: 'bg-blue-600',
        badgeText: 'text-blue-50',
        iconBg: 'bg-blue-50 text-blue-600',
        accentColor: 'text-blue-600',
        icon: <Layers className="w-5 h-5 animate-pulse-slow" />
      },
      {
        border: 'border-neutral-200/95 hover:border-emerald-400 border-t-4 border-t-emerald-600',
        badgeBg: 'bg-emerald-600',
        badgeText: 'text-emerald-50',
        iconBg: 'bg-emerald-50 text-emerald-600',
        accentColor: 'text-emerald-600',
        icon: <Sparkles className="w-5 h-5" />
      },
      {
        border: 'border-neutral-200/95 hover:border-indigo-400 border-t-4 border-t-indigo-600',
        badgeBg: 'bg-indigo-600',
        badgeText: 'text-indigo-50',
        iconBg: 'bg-indigo-50 text-indigo-600',
        accentColor: 'text-indigo-600',
        icon: <Award className="w-5 h-5" />
      }
    ];
    return styles[index % styles.length];
  };

  const handleAddAttachment = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'image' | 'pdf') => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedTask || !onUpdateState) return;

    const fileList = Array.from(files) as File[];
    const readFilesPromises = fileList.map((file, index) => {
      return new Promise<{ id: string; name: string; type: 'image' | 'pdf'; data: string; date: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve({
              id: `att-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
              name: file.name,
              type: fileType,
              data: reader.result,
              date: new Date().toISOString().split('T')[0]
            });
          } else {
            reject(new Error('Failed to read file ' + file.name));
          }
        };
        reader.onerror = () => reject(reader.error || new Error('Error reading ' + file.name));
        reader.readAsDataURL(file);
      });
    });

    try {
      const newAttachments = await Promise.all(readFilesPromises);
      
      const updatedTasks = researchTasks.map(t => {
        if (t.id === selectedTask.id) {
          const currentAttachments = t.attachments || [];
          return {
            ...t,
            attachments: [...currentAttachments, ...newAttachments]
          };
        }
        return t;
      });

      const updatedState = {
        ...state,
        researchTasks: updatedTasks
      };

      onUpdateState(updatedState);
      const updatedTask = updatedTasks.find(t => t.id === selectedTask.id);
      if (updatedTask) setSelectedTask(updatedTask);
      
      alert(`성공적으로 ${newAttachments.length}개의 파일이 첨부되었습니다.`);
    } catch (err) {
      console.error(err);
      alert('파일 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    if (!selectedTask || !onUpdateState) return;

    if (!window.confirm("이 첨부파일을 정말로 삭제하시겠습니까?")) return;

    const updatedTasks = researchTasks.map(t => {
      if (t.id === selectedTask.id) {
        const currentAttachments = t.attachments || [];
        return {
          ...t,
          attachments: currentAttachments.filter(a => a.id !== attachmentId)
        };
      }
      return t;
    });

    const updatedState = {
      ...state,
      researchTasks: updatedTasks
    };

    onUpdateState(updatedState);
    const updatedTask = updatedTasks.find(t => t.id === selectedTask.id);
    if (updatedTask) setSelectedTask(updatedTask);
  };

  return (
    <div id="research-section-container" className="py-4 px-1 max-w-7xl mx-auto animate-fade-in font-sans">

      {/* 1. Submenu: 연구학교 개요 (overview) */}
      {currentSubTab === 'overview' && (
        <div id="overview-inner" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
            <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-blue-600 block"></span>
              2026. IB 월드스쿨(초) 연구학교 운영 개요
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <span className="font-bold text-blue-700 block mb-1">연구 주제 (Research Theme)</span>
                  <p className="font-semibold text-neutral-800 leading-relaxed text-justify">{basicInfo.subject}</p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <span className="font-bold text-blue-700 block mb-1">운영 기간 및 대상</span>
                  <p className="text-neutral-800 font-medium">기간: {basicInfo.duration}</p>
                  <p className="text-neutral-600 font-medium mt-1">대상: {basicInfo.researchTarget || "빛가람초등학교 전교생 (1~6학년 총 24개 학급)"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                  <span className="font-bold text-blue-700 block mb-1">연구과제</span>
                  <ul className="space-y-2 text-xs text-neutral-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{basicInfo.researchDir1 || "교원 자율 연수 체계 구축 (연간 120시간 필수 교실 탐구 매개)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{basicInfo.researchDir2 || "학년 교육과정 재설계 (학년당 연간 4종 우수 UOI 완전 적용성 확보)"}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{basicInfo.researchDir3 || "학생 주도 학습동행 나눔제 및 과정중심 성장평가 환류"}</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/80">
                  <span className="font-bold text-blue-800 block mb-1">운영 자문 기관</span>
                  <p className="text-xs text-blue-800/90 leading-relaxed whitespace-pre-line">
                    {basicInfo.researchAdvisors || "전라남도교육청 IB PYP 연구운영국, 한국지식바칼로레아 학회, 나주 혁신도시 교육지원지구 자치협의회"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Submenu: 연구계획서 및 보고서 (reports) */}
      {currentSubTab === 'reports' && (
        <div id="reports-inner" className="space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-3">연구계획서 및 보고서</h2>
            </div>

            {reports.length === 0 ? (
              <div className="text-center py-10 bg-neutral-50 rounded-xl border border-neutral-200/50 font-sans text-xs text-neutral-500">
                등록된 연구 보고서가 아직 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {reports.map((rep) => {
                  let badgeColor = "bg-sky-50 text-sky-700 border-sky-200";
                  let labelName = "운영계획서";
                  if (rep.type === 'mid') {
                    badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                    labelName = "중간보고서";
                  } else if (rep.type === 'final') {
                    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                    labelName = "최종보고서";
                  }

                  return (
                    <div 
                      key={rep.id} 
                      className="group flex flex-col justify-between bg-neutral-50/70 p-5 rounded-xl border border-neutral-200/80 hover:border-blue-400 hover:bg-white transition-all hover:-translate-y-0.5"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded border ${badgeColor}`}>
                            {labelName}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">{rep.uploadDate}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-blue-700 line-clamp-1">
                          {rep.title}
                        </h3>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed text-justify">
                          {rep.desc}
                        </p>
                      </div>

                      <div className="pt-4 mt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <span className="text-[10.5px] font-mono text-neutral-400 max-w-[120px] truncate" title={rep.filename}>
                          📁 {rep.filename}
                        </span>
                        <button
                          onClick={() => onViewReport(rep)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>웹 뷰어 미리보기</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Submenu: 연구 체계 인포그래픽 (infographic) */}
      {currentSubTab === 'infographic' && (
        <div id="infographic-inner" className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-xs">
          <div className="mb-6 border-b border-neutral-100 pb-3">
            <h2 className="text-lg font-bold text-neutral-900">연구 체계 인포그래픽</h2>
          </div>

          {/* Admin upload check */}
          {infographic.imageBase64 && infographic.imageBase64.trim() !== '' ? (
            <div className="flex justify-center py-2">
              <img 
                src={infographic.imageBase64} 
                alt="연구 체계 인포그래픽" 
                className="max-h-[650px] object-contain rounded-xl shadow-xs border border-neutral-100 mx-auto" 
              />
            </div>
          ) : (
            /* 가로 반응형으로 압축 정렬되고 관리자 상태로 수정 가능한 고품격 플로우 차트 시스템 */
            <div className="py-4 font-sans select-none animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-4 lg:gap-2 relative">
                {infographic.steps?.map((stepItem, index) => {
                  const style = getStepStyles(index);
                  const isLast = index === infographic.steps.length - 1;
                  return (
                    <React.Fragment key={index}>
                      {/* 고밀도 간편 카드 설계 */}
                      <div className={`p-6 rounded-2xl bg-gradient-to-b from-white to-neutral-50/20 border ${style.border} shadow-2xs hover:shadow-md hover:bg-white hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group min-w-0`}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            {/* Step Identifier */}
                            <span className={`text-[10.5px] uppercase tracking-widest font-black ${style.badgeBg} ${style.badgeText} px-3 py-1 rounded shadow-3xs font-mono`}>
                              {stepItem.step || `Phase 0${index + 1}`}
                            </span>
                            
                            {/* Action Symbol Badge */}
                            <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-3xs shrink-0`}>
                              {style.icon}
                            </div>
                          </div>

                          <div className="space-y-2 text-left">
                            <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 tracking-tight leading-snug">
                              {stepItem.title}
                            </h3>
                            <p className="text-[12.5px] text-neutral-600 font-semibold leading-relaxed font-sans text-justify">
                              {stepItem.desc}
                            </p>
                          </div>
                        </div>

                        {/* Card static details */}
                        <div className="mt-5 pt-3 border-t border-neutral-100 flex items-center justify-between text-[10px] font-mono font-extrabold text-neutral-400">
                          <span>STAGE 0{index + 1}</span>
                          <span className={`${style.accentColor} font-black tracking-wider`}>RUNNING</span>
                        </div>
                      </div>

                      {/* Direction Flow Arrow inside grid */}
                      {!isLast && (
                        <div className="flex items-center justify-center text-neutral-300 shrink-0 select-none py-2 lg:py-0 px-2">
                          <ArrowRight className="hidden lg:block w-6 h-6 text-neutral-400 animate-pulse" />
                          <ArrowDown className="block lg:hidden w-5 h-5 text-neutral-400 animate-bounce" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Submenu: 연구과제 세부소개 (tasks) */}
      {currentSubTab === 'tasks' && (
        <div id="tasks-inner" className="space-y-6">
          <div className="mb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">연구과제 세부내용</h2>
              <p className="text-xs text-neutral-500 mt-1">대주제 탭을 선택하고 소과제별(1-가-1 ~ 3-나-3) 추진 내용을 확인해 보세요.</p>
            </div>
            
            {/* Theme 1, 2, 3 Tab Selectors */}
            <div className="flex gap-1.5 bg-neutral-100 p-1 rounded-xl shrink-0 font-sans border border-neutral-200/50">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveThemeTab(num)}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    activeThemeTab === num
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200"
                  }`}
                >
                  주제 {num}
                </button>
              ))}
            </div>
          </div>

          {/* Render Active Theme Banner Name */}
          <div className="p-4 bg-blue-50/50 border border-blue-105 rounded-xl flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-blue-700 shrink-0" />
            <div>
              <p className="text-[10px] text-blue-700 uppercase font-mono font-bold">ACTIVE RESEARCH THEME {activeThemeTab}</p>
              <h4 className="text-xs sm:text-sm font-extrabold text-neutral-950 mt-0.5">
                {activeThemeTab === 1 && (basicInfo.researchTheme1 || "주제 1. 교사 전문성 및 UOI 설계 혁신 (PLC & Alignment)")}
                {activeThemeTab === 2 && (basicInfo.researchTheme2 || "주제 2. 학생 주도성 기반 배움마당 (Agency & Practice)")}
                {activeThemeTab === 3 && (basicInfo.researchTheme3 || "주제 3. 배움 성장 평가와 나눔 협력 (Assessment & Sharing)")}
              </h4>
            </div>
          </div>

          {/* Group tasks of active theme by subThemeName ("가", "나") */}
          <div className="space-y-8 mt-4">
            {['가', '나'].map((subLetter) => {
              const themeTasks = researchTasks.filter(
                (task) => task.themeNum === activeThemeTab && task.subThemeName === subLetter
              );

              if (themeTasks.length === 0) return null;

              // Pull the subThemeTitle from the first item
              const subThemeTitle = themeTasks[0]?.subThemeTitle || "";

              return (
                <div key={subLetter} className="space-y-4">
                  {/* Subtheme Title Section Header Banner */}
                  <div className="flex items-center gap-2 pl-1 select-none border-l-4 border-emerald-500">
                    <span className="text-sm font-black text-emerald-800 bg-emerald-50/90 px-2 py-0.5 rounded">
                      과제 {activeThemeTab}-{subLetter}
                    </span>
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-800">
                      {subThemeTitle}
                    </h3>
                  </div>

                  {/* Tasks under this subtheme */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {themeTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                      >
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] px-2 py-0.5 rounded-sm bg-neutral-100 text-neutral-600 font-bold font-mono">
                              {task.taskCode}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                          </div>
                          
                          <h3 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug line-clamp-2">
                            {task.title}
                          </h3>
                          
                          <p className="text-[11px] text-neutral-500 line-clamp-3 leading-relaxed text-justify">
                            <strong className="text-neutral-700">추진내용:</strong> {task.text}
                          </p>
                        </div>

                        <div className="border-t border-neutral-100 pt-3 mt-4 flex items-center justify-between text-xs font-bold text-blue-700 select-none">
                          <span>세부내용 확인</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Research Task Detail Modal */}
          {selectedTask && (
            <div id="task-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
              <div id="task-modal-container" className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] md:h-[85vh] overflow-hidden shadow-2xl border border-neutral-200 flex flex-col">
                <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase font-mono">
                      Research Task Details
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-xs text-neutral-600 font-extrabold pb-0.5">상세 추진 사례 및 산출물 연계</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="p-1 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-900 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    닫기
                  </button>
                </div>
 
                {/* Horizontal Split Body */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
                  
                  {/* Left Column (7 of 12) - Research Case Details & Admin Upload */}
                  <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 min-h-0 scrollbar-thin">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 tracking-tight leading-snug">
                        [{selectedTask.taskCode}] {selectedTask.title}
                      </h3>
                    </div>
 
                    <div className="space-y-4 text-xs sm:text-sm">
                      {/* 1. 추진 배경 (Background) */}
                      <div className="bg-blue-50/10 p-4 rounded-xl border border-neutral-200">
                        <strong className="text-blue-900 block mb-1.5 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                          🔍 1. 추진 배경 (Background)
                        </strong>
                        <p className="text-neutral-700 leading-relaxed text-justify">{selectedTask.bg}</p>
                      </div>
 
                      {/* 2. 핵심 실행 구조 (Actions) */}
                      <div className="bg-blue-50/10 p-4 rounded-xl border border-neutral-200">
                        <strong className="text-blue-900 block mb-1.5 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                          🛠️ 2. 핵심 실행 구조 (Actions)
                        </strong>
                        <p className="text-neutral-700 leading-relaxed text-justify">{selectedTask.text}</p>
                      </div>
 
                      {/* 3. 구체적 운영 방법 (Methodology) */}
                      <div className="bg-blue-50/10 p-4 rounded-xl border border-neutral-200">
                        <strong className="text-blue-900 block mb-1.5 font-bold text-xs sm:text-sm flex items-center gap-1.5 font-sans">
                          📋 3. 구체적 운영 방법 (Methodology)
                        </strong>
                        <ul className="list-disc pl-5 text-xs text-neutral-700 space-y-1">
                          {selectedTask.methods?.map((m, idx) => (
                            <li key={idx} className="leading-relaxed text-justify">{m}</li>
                          ))}
                        </ul>
                      </div>
 
                      {/* 4. 실제 학교 적용사례 (Classroom Practice Case) */}
                      <div className="bg-blue-50/10 p-4 rounded-xl border border-neutral-200">
                        <strong className="text-blue-900 block mb-1.5 font-bold text-xs sm:text-sm flex items-center gap-1.5">
                          💡 4. 실제 학교 적용사례 (Classroom Practice Case)
                        </strong>
                        <ul className="list-disc pl-5 text-xs text-neutral-700 space-y-1">
                          {selectedTask.cases?.map((c, idx) => (
                            <li key={idx} className="leading-relaxed text-justify">{c}</li>
                          ))}
                        </ul>
                      </div>
 
                      {/* Interactive Media Index List */}
                      <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <strong className="text-xs font-bold text-neutral-850 block">
                            📎 실시간 첨부 및 산출물 색인 ({selectedTask.attachments?.length || 0}개)
                          </strong>
                          <span className="text-[10px] text-neutral-400 font-mono">가로 슬라이더와 자동 유관 동기화</span>
                        </div>
 
                        {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {selectedTask.attachments.map((att, idx) => (
                              <button
                                key={att.id}
                                type="button"
                                onClick={() => setActiveAttachmentIndex(idx)}
                                className={`flex items-center justify-between p-2 text-left rounded-lg border transition-all cursor-pointer ${
                                  activeAttachmentIndex === idx
                                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-extrabold shadow-3xs'
                                    : 'bg-white border-neutral-200 hover:border-neutral-350 text-neutral-700'
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                                  <span className={`text-[8px] uppercase font-mono px-1 py-0.5 rounded shrink-0 font-extrabold ${
                                    att.type === 'image' ? 'bg-blue-100 text-blue-750' : 'bg-red-100 text-red-750'
                                  }`}>
                                    {att.type === 'image' ? 'IMG' : 'PDF'}
                                  </span>
                                  <span className="text-xs font-semibold truncate" title={att.name}>
                                    {idx + 1}. {att.name}
                                  </span>
                                </div>
                                <span className="text-[10px] text-blue-600 shrink-0 font-bold select-none hover:underline">보기</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-3 bg-white rounded-lg border border-neutral-100">
                            <p className="text-neutral-400 text-xs italic">업로드된 실제 교육활동 사진 또는 산출물 데이터가 존재하지 않습니다.</p>
                          </div>
                        )}
                      </div>
 
                      {/* Admin upload capabilities (Supports Bulk Selection) */}
                      {isAdminMode && (
                        <div className="bg-white p-4 rounded-xl border border-dashed border-blue-250 space-y-3">
                          <span className="text-xs font-black text-blue-800 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" /> [관리자 기능] 사진 및 산출물 대량 동시 업로드
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <span className="block text-[10.5px] text-neutral-600 font-bold mb-1">📷 이미지 일괄 추가 (여러장 선택 가능)</span>
                              <input 
                                type="file" 
                                accept="image/*"
                                multiple
                                onChange={(e) => handleAddAttachment(e, 'image')}
                                className="block w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                              />
                            </div>
                            <div>
                              <span className="block text-[10.5px] text-neutral-600 font-bold mb-1">📄 학습 보고서/UOI 산출물 PDF 추가 (여러장 선택 가능)</span>
                              <input 
                                type="file" 
                                accept="application/pdf"
                                multiple
                                onChange={(e) => handleAddAttachment(e, 'pdf')}
                                className="block w-full text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>
                      )}
 
                      {/* Resources and Impacts */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200/60 flex flex-col justify-between">
                          <div>
                            <strong className="text-[11.5px] uppercase tracking-wider text-neutral-600 font-mono block">📦 연구 산출물 관련 리포트 바로가기</strong>
                            <ul className="text-xs mt-1.5 space-y-1">
                              {selectedTask.resources?.map((r, idx) => {
                                const link = selectedTask.resourceLinks?.[idx];
                                if (link && link.trim().startsWith('http')) {
                                  return (
                                    <li key={idx} className="truncate">
                                      <a 
                                        href={link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
                                        title={`${r} 산출물 링크 열기`}
                                      >
                                        📎 {r} <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 inline shrink-0" />
                                      </a>
                                    </li>
                                  );
                                }
                                return (
                                  <li key={idx} className="truncate text-neutral-700">
                                    📎 {r}
                                  </li>
                                );
                              })}
                              {(!selectedTask.resources || selectedTask.resources.length === 0) && (
                                <li className="text-[11px] text-neutral-400">등록된 산출물 목록이 없습니다.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                        <div className="bg-blue-50/30 p-3.5 rounded-lg border border-blue-105">
                          <strong className="text-[11.5px] uppercase tracking-wider text-blue-700 font-mono block">📈 도출 성과 및 본교 실질 변화</strong>
                          <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed text-justify">
                            {selectedTask.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
 
                  {/* Right Column (5 of 12) - Continuous Live Viewer Slideshow */}
                  <div className="md:col-span-5 p-6 bg-neutral-50 overflow-y-auto flex flex-col justify-start min-h-0 scrollbar-thin space-y-4">
                    <div className="border-b border-neutral-200 pb-2 mb-1 flex items-center justify-between">
                      <span className="text-xs font-black text-neutral-850 flex items-center gap-1">
                        🖼️ 실제 추진 사례 및 산출물 바로보기
                      </span>
                      {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                        <span className="text-[10px] bg-neutral-200 text-neutral-700 font-mono px-2 py-0.5 rounded-full font-bold">
                          {Math.min(activeAttachmentIndex + 1, selectedTask.attachments.length)} / {selectedTask.attachments.length}
                        </span>
                      )}
                    </div>
 
                    {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                      (() => {
                        const atts = selectedTask.attachments;
                        const index = activeAttachmentIndex < atts.length ? activeAttachmentIndex : 0;
                        const currentAtt = atts[index];
                        return (
                          <div className="flex-1 flex flex-col justify-between min-h-0 space-y-4">
                            {/* Slide Box */}
                            <div className="relative bg-neutral-900 rounded-xl overflow-hidden aspect-video sm:aspect-square flex flex-col items-center justify-center border border-neutral-800 shadow-md group/carousel max-h-[360px]">
                              {currentAtt.type === 'image' ? (
                                <img 
                                  src={currentAtt.data} 
                                  alt={currentAtt.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-contain hover:scale-[1.03] transition-transform duration-300 pointer-events-none"
                                />
                              ) : (
                                <iframe
                                  src={pdfBlobUrls[currentAtt.id] || currentAtt.data}
                                  className="w-full h-full bg-white border-0"
                                  title={currentAtt.name}
                                />
                              )}
 
                              {/* Slider Prev / Next buttons over slide */}
                              {atts.length > 1 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setActiveAttachmentIndex(prev => (prev - 1 + atts.length) % atts.length)}
                                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center font-bold text-lg select-none transition-all cursor-pointer shadow hover:scale-105 z-10"
                                    title="이전 첨부파일"
                                  >
                                    ‹
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveAttachmentIndex(prev => (prev + 1) % atts.length)}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center font-bold text-lg select-none transition-all cursor-pointer shadow hover:scale-105 z-10"
                                    title="다음 첨부파일"
                                  >
                                    ›
                                  </button>
                                </>
                              )}
                            </div>
 
                            {/* Slide Meta tools */}
                            <div className="bg-white p-3 rounded-xl border border-neutral-200/80 flex items-center justify-between shadow-2xs">
                              <div className="min-w-0 pr-2">
                                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono mr-1.5 inline-block select-none shrink-0">
                                  {currentAtt.type === 'image' ? 'IMAGE' : 'PDF'}
                                </span>
                                <span className="text-xs text-neutral-850 font-bold truncate inline-block align-middle max-w-[150px] sm:max-w-xs font-sans" title={currentAtt.name}>
                                  {currentAtt.name}
                                </span>
                              </div>
                              <div className="flex gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setViewingAttachment(currentAtt)}
                                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-[10.5px] font-bold cursor-pointer transition-colors"
                                >
                                  🔍 크게 열기
                                </button>
                                {isAdminMode && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAttachment(currentAtt.id)}
                                    className="px-2.5 py-1 bg-red-55 hover:bg-red-100 text-red-600 rounded text-[10.5px] font-bold cursor-pointer transition-colors"
                                    title="파일 삭제"
                                  >
                                    삭제
                                  </button>
                                )}
                              </div>
                            </div>
 
                            {/* Visual Thumbnail index row */}
                            {atts.length > 1 && (
                              <div className="pt-2 border-t border-neutral-200">
                                <p className="text-[10px] text-neutral-400 font-extrabold mb-1.5 flex items-center gap-1">
                                  <span>💡 개별 파일 고속 선택</span>
                                </p>
                                <div className="flex gap-1.5 overflow-x-auto pb-1 max-h-[60px] scrollbar-thin">
                                  {atts.map((att, idx) => (
                                    <button
                                      key={att.id}
                                      type="button"
                                      onClick={() => setActiveAttachmentIndex(idx)}
                                      className={`relative flex-shrink-0 w-11 h-11 rounded-lg border-2 overflow-hidden transition-all duration-155 cursor-pointer ${
                                        index === idx ? 'border-blue-600 scale-95 shadow-sm' : 'border-neutral-200 opacity-60 hover:opacity-100'
                                      }`}
                                    >
                                      {att.type === 'image' ? (
                                        <img src={att.data} referrerPolicy="no-referrer" className="w-full h-full object-cover pointer-events-none" />
                                      ) : (
                                        <div className="w-full h-full bg-red-50 text-red-600 flex flex-col items-center justify-center text-[8px] font-black pointer-events-none leading-none">
                                          <span>PDF</span>
                                        </div>
                                      )}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    ) : (
                      /* No Attachments Placeholder / "첨부파일이 없는 경우 안내 제공" */
                      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center border border-neutral-200 rounded-2xl bg-white space-y-4 min-h-[300px]">
                        <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                          <Info className="w-6 h-6 text-neutral-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-neutral-800">등록된 첨부파일이 없습니다.</h4>
                          <p className="text-[10.5px] text-neutral-400 max-w-xs leading-relaxed">
                            이 연구과제 활동에 업로드된 현장 사진 기록이나 산출물 파일(PDF 문서 등)이 아직 배치되지 않았습니다.
                          </p>
                        </div>
                        {isAdminMode && (
                          <span className="text-[10px] text-blue-600 font-extrabold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 animate-pulse select-none">
                            💡 왼쪽 아래에서 대량 업로드를 해보세요.
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
 
                {/* Footer Controls */}
                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end shrink-0">
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    확인 및 창 닫기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attachment Viewer Popup Sub-modal Overlay */}
          {viewingAttachment && (
            <div id="attachment-viewer-overlay" className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
              <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                <div className="p-4 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center px-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">사례 첨부물 열람</span>
                    <span className="text-xs text-neutral-850 font-black truncate max-w-[200px] sm:max-w-md">{viewingAttachment.name}</span>
                  </div>
                  <button
                    onClick={() => setViewingAttachment(null)}
                    className="p-1 px-3 bg-neutral-200 hover:bg-neutral-350 text-neutral-700 font-mono rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    닫기 [X]
                  </button>
                </div>

                <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center justify-center bg-neutral-150 min-h-[300px]">
                  {viewingAttachment.type === 'image' ? (
                    <img 
                      src={viewingAttachment.data} 
                      alt={viewingAttachment.name} 
                      className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm border border-neutral-200"
                    />
                  ) : (
                    <div className="w-full h-[70vh] bg-white rounded-xl overflow-hidden border border-neutral-200 shadow-md">
                      <iframe
                        src={pdfBlobUrls[viewingAttachment.id] || viewingAttachment.data}
                        className="w-full h-full bg-neutral-950 border-0"
                        title={viewingAttachment.name}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-neutral-300 bg-neutral-55 flex justify-between items-center px-6">
                  <span className="text-[10px] text-neutral-400 font-mono">Bitgaram Interactive Document Hub</span>
                  <button
                    onClick={() => setViewingAttachment(null)}
                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-850 text-white rounded-lg text-xs font-bold font-sans cursor-pointer"
                  >
                    열람 창 닫기
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Submenu: 연구성과 (outcomes) */}
      {currentSubTab === 'outcomes' && (
        <div id="outcomes-inner" className="space-y-6">
          
          {/* Outcomes tab switch buttons */}
          <div className="flex border-b border-neutral-200 pb-px gap-1">
            <button
              onClick={() => setActiveOutcomeTab('quantitative')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeOutcomeTab === 'quantitative'
                  ? "border-blue-600 text-blue-700 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              📊 정량적 성과 지표 (Quantitative)
            </button>
            <button
              onClick={() => setActiveOutcomeTab('qualitative')}
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeOutcomeTab === 'qualitative'
                  ? "border-blue-600 text-blue-700 font-extrabold"
                  : "border-transparent text-neutral-500 hover:text-neutral-800"
              }`}
            >
              💬 정성적 현장 의견 성찰 (Qualitative)
            </button>
          </div>

          {activeOutcomeTab === 'quantitative' && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm animate-fade-in">
              <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-neutral-900">연구학교 운영 전후 다차원 종합 성과 (수치적 지형)</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    1학기 도입 전(사전설문조사 만족도)과 2학기 보고 시점 사후조사 만족도 간의 퍼센트 변화율 통계
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded bg-neutral-300 inline-block"></span>
                    <span className="text-neutral-500">운영 전 (Before)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded bg-blue-600 inline-block"></span>
                    <span className="text-blue-700">운영 후 (After)</span>
                  </div>
                </div>
              </div>

              {/* Custom High-Fidelity SVG Stat Bars Chart */}
              <div className="space-y-4">
                {outcomes.quantitative?.map((metric, idx) => {
                  const beforePct = metric.before;
                  const afterPct = metric.after;
                  const delta = (afterPct - beforePct).toFixed(1);

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline text-xs sm:text-sm font-sans">
                        <span className="font-bold text-neutral-800">{metric.label}</span>
                        <div className="flex items-center gap-3 font-mono font-bold text-xs">
                          <span className="text-neutral-400">{beforePct}{metric.unit}</span>
                          <span className="text-neutral-300">→</span>
                          <span className="text-blue-700 text-sm">{afterPct}{metric.unit}</span>
                          <span className="text-[11px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded flex items-center font-semibold">
                            <TrendingUp className="w-3 h-3 mr-0.5 shrink-0" />
                            +{delta}{metric.unit}p
                          </span>
                        </div>
                      </div>

                      {/* Progress Track Gauge */}
                      <div className="relative w-full h-8 bg-neutral-100 rounded-lg overflow-hidden border border-neutral-100 flex items-center p-1">
                        {/* Before bar */}
                        <div 
                          className="h-full bg-neutral-300 rounded-l mr-[1px] relative cursor-pointer"
                          style={{ width: `${beforePct}%` }}
                          title={`사전 수치: ${beforePct}%`}
                        >
                          <span className="absolute left-2 inset-y-0 flex items-center text-[10px] text-neutral-600 font-mono font-medium">
                            Before
                          </span>
                        </div>
                        
                        {/* After comparison growth bar */}
                        <div 
                          className="h-full bg-blue-600 rounded-r relative cursor-pointer transition-all duration-1000 ease-out flex-1"
                          style={{ width: `${afterPct - beforePct}%` }}
                          title={`사후 수치: ${afterPct}%`}
                        >
                          <span className="absolute right-2 inset-y-0 flex items-center text-[10px] text-white font-mono font-bold">
                            After
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeOutcomeTab === 'qualitative' && (
            <div className="bg-neutral-50 rounded-2xl p-6 sm:p-8 border border-neutral-200 animate-fade-in">
              <h3 className="text-base font-bold text-neutral-800 mb-5 border-b border-neutral-200/60 pb-2 flex items-center gap-2">
                <Quote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>📢 교육공동체 현장의 소리 (학습 주체별 주관적 실질 변화)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {outcomes.qualitative?.map((fb) => {
                  let badgeStyle = "bg-blue-105 text-blue-800 border-blue-200";
                  if (fb.role === '교사') badgeStyle = "bg-emerald-100 text-emerald-800 border-emerald-250";
                  if (fb.role === '학부모') badgeStyle = "bg-purple-100 text-purple-800 border-purple-200";

                  return (
                    <div key={fb.id} className="bg-white rounded-xl p-5 border border-neutral-200/50 shadow-xs flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-neutral-50 p-1 rounded">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                            {fb.role} 의 성찰
                          </span>
                          <Quote className="w-4 h-4 text-neutral-200" />
                        </div>
                        <p className="text-xs text-neutral-600 italic leading-relaxed text-justify font-serif">
                          "{fb.quote}"
                        </p>
                      </div>

                      <div className="pt-4 mt-3 border-t border-neutral-50/80 flex justify-between items-center text-[10.5px] text-neutral-400 font-sans">
                        <span className="font-bold text-neutral-700">{fb.name}</span>
                        <span className="font-mono">{fb.date}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
