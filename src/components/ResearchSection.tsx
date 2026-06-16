import React, { useState } from 'react';
import { AppState, ReportItem, ResearchTaskItem } from '../types';
import { FileText, Eye, Info, Layers, CheckCircle2, Quote, ArrowUpRight, TrendingUp, HelpCircle, ArrowDown, Sparkles, Award, ArrowRight } from 'lucide-react';

interface ResearchSectionProps {
  state: AppState;
  currentSubTab: string;
  onViewReport: (report: ReportItem) => void;
}

export default function ResearchSection({ state, currentSubTab, onViewReport }: ResearchSectionProps) {
  const { basicInfo, reports, infographic, researchTasks, outcomes } = state;
  const [selectedTask, setSelectedTask] = useState<ResearchTaskItem | null>(null);
  const [activeThemeTab, setActiveThemeTab] = useState<number>(1);
  const [activeOutcomeTab, setActiveOutcomeTab] = useState<'quantitative' | 'qualitative'>('quantitative');

  const getStepStyles = (index: number) => {
    const styles = [
      {
        border: 'border-neutral-200/95 hover:border-blue-400 border-t-4 border-t-blue-600',
        badgeBg: 'bg-blue-600',
        badgeText: 'text-blue-50',
        iconBg: 'bg-blue-50 text-blue-600',
        accentColor: 'text-blue-600',
        icon: <Layers className="w-5 h-5" />
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
                          <span>스케치 성찰 열람</span>
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
              <div id="task-modal-container" className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-neutral-200 flex flex-col">
                <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase font-mono">
                      Research Task Details
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-xs text-neutral-600 font-extrabold">세부내용</span>
                  </div>
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="p-1 px-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-neutral-900 rounded-lg text-xs font-bold transition-all"
                  >
                    닫기
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 font-sans">
                  <div>
                    <h3 className="text-base sm:text-lg font-extrabold text-neutral-950 tracking-tight">
                      {selectedTask.title}
                    </h3>
                  </div>

                  <div className="space-y-4 text-xs sm:text-sm">
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50">
                      <strong className="text-amber-800 block mb-1">🔍 1. 추진 배경 (Background)</strong>
                      <p className="text-neutral-700 leading-relaxed text-justify">{selectedTask.bg}</p>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 bg-white">
                      <strong className="text-neutral-800 block mb-1">🛠️ 2. 핵심 실행 구조 (Actions)</strong>
                      <p className="text-neutral-700 leading-relaxed text-justify">{selectedTask.text}</p>
                    </div>

                    <div className="space-y-2">
                      <strong className="text-blue-900 block font-bold text-xs">📋 3. 구체적 운영 방법 (Methodology)</strong>
                      <ul className="list-disc pl-5 text-xs text-neutral-600 space-y-1">
                        {selectedTask.methods?.map((m, idx) => (
                          <li key={idx} className="text-neutral-700">{m}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100">
                      <strong className="text-emerald-800 block mb-1">💡 4. 실제 학교 적용사례 (Classroom Practice Case)</strong>
                      <ul className="list-disc pl-5 text-xs text-neutral-700 space-y-1">
                        {selectedTask.cases?.map((c, idx) => (
                          <li key={idx} className="leading-relaxed text-justify">{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200/60">
                        <strong className="text-[11.5px] uppercase tracking-wider text-neutral-600 font-mono block">📦 관련 산출물 및 자료 (클릭시 바로가기)</strong>
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
                      <div className="bg-blue-50/30 p-3.5 rounded-lg border border-blue-100">
                        <strong className="text-[11.5px] uppercase tracking-wider text-blue-700 font-mono block">📈 도출 성과 및 학생 변화</strong>
                        <p className="text-xs text-neutral-700 mt-1.5 leading-relaxed text-justify">
                          {selectedTask.impact}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
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
