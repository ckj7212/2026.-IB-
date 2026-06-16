import React, { useState, useEffect } from 'react';
import { AppState, LessonItem, ReportItem } from '../types';
import { Search, Filter, BookOpen, Clock, Heart, Eye, Info, CheckCircle2, FileDown } from 'lucide-react';

interface LessonSectionProps {
  state: AppState;
  currentSubTab: string;
  onViewPlanPdf: (report: ReportItem) => void;
  onIncrementViews: (lessonId: string) => void;
}

export default function LessonSection({ state, currentSubTab, onViewPlanPdf, onIncrementViews }: LessonSectionProps) {
  const { lessons, basicInfo } = state;

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('전체');
  const [selectedTheme, setSelectedTheme] = useState('전체');
  const [selectedTeacher, setSelectedTeacher] = useState('전체');

  // Detail Modal State
  const [selectedLesson, setSelectedLesson] = useState<LessonItem | null>(null);

  // Sync sub-tab click with filter triggers
  useEffect(() => {
    // Deep research reset state search
    setSearchQuery('');
  }, [currentSubTab]);

  // Unique list generators for filter dropdowns
  const grades = ['전체', '1학년', '2학년', '3학년', '4학년', '5학년', '6학년'];
  const themes = [
    '전체', 
    basicInfo.transTheme1 || '우리는 누구인가 (Who We Are)', 
    basicInfo.transTheme2 || '세계가 돌아가는 방식 (How the World Works)',
    basicInfo.transTheme3 || '우리가 속한 공간과 시간 (Where We Are in Place and Time)',
    basicInfo.transTheme4 || '우리 자신을 표현하는 방법 (How We Express Ourselves)',
    basicInfo.transTheme5 || '우리 자신을 조직하는 방식 (How We Organize Ourselves)',
    basicInfo.transTheme6 || '우리 모두의 지구 (Sharing the Planet)'
  ];
  const teachers = ['전체', '윤정민 교사', '박성우 교사', '최은서 교사', '강동우 교사'];

  // Handle viewing detailed modal & trigger view count
  const handleOpenDetail = (lesson: LessonItem) => {
    onIncrementViews(lesson.id);
    setSelectedLesson(lesson);
  };

  // Convert Lesson Sim Plan to a simulated ReportItem so PDF viewer modal can render it nicely
  const triggerPdfSimulator = (lesson: LessonItem) => {
    const reportSim: ReportItem = {
      id: `sim-plan-${lesson.id}`,
      type: 'plan',
      title: `${lesson.grade} [${lesson.theme}] - ${lesson.teacher} 상세 탐구 지도안`,
      desc: lesson.description,
      filename: `lesson_plan_${lesson.id}.pdf`,
      uploadDate: lesson.date,
      pdfContentSim: lesson.lessonPlanSim,
      pdfBase64: lesson.pdfBase64
    };
    onViewPlanPdf(reportSim);
  };



  // Filter & Search Logic
  const filteredLessons = lessons.filter((les) => {
    // 1. Text Search query
    const matchQuery = 
      les.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.inquiryQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.centralIdea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      les.description.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Grade
    const matchGrade = selectedGrade === '전체' || les.grade === selectedGrade;

    // 3. Theme
    const matchTheme = selectedTheme === '전체' || les.theme.toLowerCase().includes(selectedTheme.split(' (')[0].toLowerCase());

    // 4. Teacher
    const matchTeacher = selectedTeacher === '전체' || les.teacher === selectedTeacher;

    return matchQuery && matchGrade && matchTheme && matchTeacher;
  });

  return (
    <div id="lessons-section-container" className="py-2 px-1 max-w-7xl mx-auto font-sans">
      
      {/* Search and Filters Bento Section */}
      <div className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          
          {/* Main search input with focus indicator */}
          <div className="relative flex-1 w-full">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-5 h-5 text-neutral-400" />
            </span>
            <input
              id="lesson-search-input"
              type="text"
              placeholder="탐구주제, 중심아이디어, 지도교사 및 키워드로 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-neutral-50/70 border border-neutral-200 rounded-xl focus:bg-white text-xs sm:text-sm font-medium focus:border-blue-600 focus:outline-hidden transition-all text-neutral-800"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-xs text-neutral-400 hover:text-neutral-600 font-bold"
              >
                지우기
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 text-xs px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-lg border border-blue-100">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>필터 검색기</span>
          </div>
        </div>

        {/* Dynamic Filters Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Grade filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">대상 학년</label>
            <select
              id="filter-grade-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-neutral-700 cursor-pointer w-full"
            >
              {grades.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Theme filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">초학문적 주제</label>
            <select
              id="filter-theme-select"
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-neutral-700 cursor-pointer font-sans w-full"
            >
              {themes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Teacher filter */}
          <div className="flex flex-col space-y-1">
            <label className="text-[10.5px] font-bold text-neutral-400 uppercase tracking-widest font-mono">지도 교사</label>
            <select
              id="filter-teacher-select"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-semibold text-neutral-700 cursor-pointer w-full"
            >
              {teachers.map(tc => <option key={tc} value={tc}>{tc}</option>)}
            </select>
          </div>

        </div>

        {/* Filters Clear Button if dirty */}
        {(selectedGrade !== '전체' || selectedTheme !== '전체' || selectedTeacher !== '전체' || searchQuery) && (
          <div className="mt-4 flex justify-end">
            <button
              id="filters-reset-button"
              onClick={() => {
                setSelectedGrade('전체');
                setSelectedTheme('전체');
                setSelectedTeacher('전체');
                setSearchQuery('');
              }}
              className="text-[11px] font-bold text-red-600 hover:text-red-800 flex items-center gap-1 bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <span>필터 필드 초기화</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid of Lesson Cards */}
      <h3 className="text-xs font-bold text-neutral-400 tracking-wider font-mono mb-4">
        조회된 수업 자료 수 : {filteredLessons.length}건
      </h3>

      {filteredLessons.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200/75 p-6 space-y-3">
          <BookOpen className="w-12 h-12 text-neutral-300 mx-auto" />
          <h4 className="text-sm font-extrabold text-neutral-700">해당 조건의 수업 자료가 존재하지 않습니다</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
            필터 조건을 변경하거나 검색 키워드를 간소화하여 재시도해 보시기 바랍니다.
          </p>
        </div>
      ) : (
        <div id="lessons-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredLessons.map((les) => (
            <div
              key={les.id}
              onClick={() => handleOpenDetail(les)}
              className="group bg-white rounded-xl overflow-hidden border border-neutral-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              
              {/* Card visual thumb bar */}
              <div className="relative bg-linear-to-br from-blue-50 to-neutral-50 h-28 flex items-center justify-center border-b border-neutral-100">
                <div className="text-4xl filter drop-shadow-xs transform group-hover:scale-110 transition-transform duration-300">
                  {les.image || "🎒"}
                </div>
                
                {/* Upper badges */}
                <span className="absolute top-3 left-3 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-white border border-neutral-200 shadow-xs text-neutral-700">
                  {les.grade}
                </span>

                {les.period && (
                  <span className="absolute top-3 right-3 text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-600 text-white shadow-xs">
                    {les.period}
                  </span>
                )}
              </div>

              {/* Card descriptive text area */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5 font-sans">
                  <span className="text-[10px] text-blue-700 font-extrabold block truncate">
                    {les.theme}
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-neutral-900 group-hover:text-blue-700 line-clamp-1">
                    {les.inquiryQuestion}
                  </h4>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed text-justify">
                    <strong className="text-neutral-700 font-semibold">[중심아이디어]</strong> {les.centralIdea}
                  </p>
                </div>

                {/* Bottom author and numbers metadata */}
                <div className="pt-3 border-t border-neutral-50 flex items-center justify-between text-[10.5px] text-neutral-400">
                  <span className="font-bold text-neutral-700">✍️ {les.teacher}</span>
                  <div className="flex items-center gap-1.5 font-mono">
                    <span>조회 {les.views}</span>
                    <span>•</span>
                    <span className="bg-neutral-100 text-neutral-600 font-semibold px-1 py-0.5 rounded-sm text-[9.5px]">
                      지도안
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Lesson Details Modal */}
      {selectedLesson && (
        <div id="lesson-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div id="lesson-modal-container" className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-neutral-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-blue-600 text-white font-extrabold px-2 py-0.5 rounded-full uppercase font-mono">
                  IB PYP Lesson Profile
                </span>
                <span className="text-neutral-300">|</span>
                <span className="text-xs font-semibold text-neutral-600">{selectedLesson.grade} • {selectedLesson.teacher} {selectedLesson.period && `• ${selectedLesson.period}`}</span>
              </div>
              <button 
                onClick={() => setSelectedLesson(null)}
                className="p-1 px-3 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-xs font-bold text-neutral-700 transition-colors"
              >
                닫기
              </button>
            </div>

            {/* Modal Contents Scroll Space */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Main Banner Info inside detail modal */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-linear-to-r from-blue-50 to-neutral-50/50 p-4 rounded-xl border border-blue-50/50">
                <div className="text-4xl p-2 bg-white rounded-xl shadow-xs shrink-0 mx-auto sm:mx-0">
                  {selectedLesson.image || "🎒"}
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <span className="text-[10.5px] font-bold text-blue-800 tracking-wider uppercase font-mono bg-blue-100/50 px-2 py-0.5 rounded">
                    초학문적 주제 : {selectedLesson.theme}
                  </span>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">탐구 질문 (Inquiry Question)</span>
                    <p className="text-xs sm:text-base font-extrabold text-neutral-900 leading-tight">
                      {selectedLesson.inquiryQuestion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid of core IB Planner metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                  <h5 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider font-mono">
                    💡 중심 아이디어 (Central Idea)
                  </h5>
                  <p className="text-xs font-bold text-neutral-800 leading-relaxed text-justify">
                    {selectedLesson.centralIdea}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-2">
                  <h5 className="text-xs font-extrabold text-neutral-400 uppercase tracking-wider font-mono">
                    🔑 기타 개념 (Other Concepts)
                  </h5>
                  <p className="text-xs font-bold text-slate-800 leading-relaxed font-mono">
                    {selectedLesson.concepts}
                  </p>
                </div>
              </div>

              {/* Outline / Description */}
              <div className="space-y-2 font-sans select-none">
                <h5 className="text-xs font-extrabold text-neutral-800 border-l-3 border-blue-500 pl-2">
                  탐구 수업 개요 (Description)
                </h5>
                <p className="text-xs text-neutral-600 leading-relaxed text-justify bg-neutral-50 p-3 rounded-lg border border-neutral-200/50 whitespace-pre-wrap">
                  {selectedLesson.description}
                </p>
              </div>

              {/* Inquiry Cycle Categories */}
              <div className="space-y-3 font-sans">
                <h5 className="text-xs font-extrabold text-neutral-800 border-l-3 border-blue-500 pl-2">
                  탐구 사이클 단계 (Inquiry Cycle)
                </h5>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["관계맺기", "집중하기", "조사하기", "조직 및 정리하기", "일반화하기", "전이하기", "성찰하기"].map((step) => (
                    <span 
                      key={step} 
                      className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs hover:scale-105 hover:bg-blue-100/50 transition-all duration-200"
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>

              {/* Related files and interactive actions */}
              <div className="pt-4 border-t border-neutral-100">
                
                {/* PDF Viewer preview button link */}
                <div className="p-4 bg-red-50/20 border border-red-200/60 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-red-700 uppercase font-mono tracking-wider block">관련 지도안 (PDF)</span>
                    <span className="text-xs font-bold text-neutral-700 truncate block">
                      {selectedLesson.id}_lesson_plan.pdf
                    </span>
                  </div>
                  <button
                    onClick={() => triggerPdfSimulator(selectedLesson)}
                    className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>지도안 바로보기</span>
                  </button>
                </div>

              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center shrink-0">
              <span className="text-[10px] text-neutral-400 font-mono">수업 일자: {selectedLesson.date} • 조회수: {selectedLesson.views}회</span>
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
