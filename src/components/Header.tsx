import React, { useState } from 'react';
import { Menu, X, ShieldAlert, ChevronDown, User, Layers } from 'lucide-react';
import { PortalConfig } from '../types';

export const MENU_ITEMS = [
  {
    id: "home",
    name: "홈",
    submenus: [
      { id: "basic-info", name: "연구학교 기본 정보" },
      { id: "school-intro", name: "학교 소개" },
      { id: "ib-mission", name: "IB Mission Statement" }
    ]
  },
  {
    id: "research",
    name: "연구과제",
    submenus: [
      { id: "overview", name: "연구학교 개요" },
      { id: "reports", name: "연구계획서 및 보고서" },
      { id: "infographic", name: "연구 체계 인포그래픽" },
      { id: "tasks", name: "연구과제 세부내용" },
      { id: "outcomes", name: "연구성과" }
    ]
  },
  {
    id: "lessons",
    name: "수업나눔 자료실",
    submenus: [
      { id: "all-classes", name: "전체 공개수업" }
    ]
  },
  {
    id: "gallery",
    name: "교육 현장 갤러리",
    submenus: [
      { id: "study", name: "학습" },
      { id: "action", name: "Action" },
      { id: "portfolio", name: "Portfolio" },
      { id: "grade-gallery", name: "학년별 갤러리" }
    ]
  },
  {
    id: "community",
    name: "소통공간",
    submenus: [
      { id: "qna", name: "질문과 답변" },
      { id: "sympathy", name: "공감 게시판" }
    ]
  }
];

interface HeaderProps {
  config: PortalConfig;
  currentTab: string;
  currentSubTab: string;
  onNavigate: (tabId: string, subTabId: string) => void;
  onOpenAdmin: () => void;
  isAdminMode: boolean;
}

export default function Header({ config, currentTab, currentSubTab, onNavigate, onOpenAdmin, isAdminMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHoverMenu, setActiveHoverMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);

  const handleSubClick = (menuId: string, subId: string) => {
    onNavigate(menuId, subId);
    setMobileMenuOpen(false);
    setActiveHoverMenu(null);
  };

  const toggleMobileSubmenu = (menuId: string) => {
    setExpandedMobileMenu(expandedMobileMenu === menuId ? null : menuId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200/80 shadow-xs">
      
      {/* Top Banner Strip */}
      <div className="w-full bg-neutral-900 text-neutral-300 py-1.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-sans text-[11px] tracking-tight text-neutral-400 font-medium">
              2026 Bitgaram IB PYP Research School Portal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="admin-login-button"
              onClick={onOpenAdmin}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-all font-sans font-semibold border ${
                isAdminMode
                  ? "bg-amber-600/20 text-amber-400 border-amber-600/50"
                  : "bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-700"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAdminMode ? "관리자 모드 활성" : "관리자 설정 (Admin)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Logo & Menu Area */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Left Side: Brand Logo Combo */}
        <div 
          onClick={() => onNavigate("home", "basic-info")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* School logo */}
          <div 
            id="brand-school-logo"
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-transform duration-300 group-hover:scale-105"
            dangerouslySetInnerHTML={{ __html: config.schoolLogo }}
          />

          {/* Separator / IB logo */}
          <div 
            id="brand-ib-logo"
            className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 transition-transform duration-300 group-hover:scale-105 border-l border-neutral-300 pl-3 flex items-center"
            dangerouslySetInnerHTML={{ __html: config.ibLogo }}
          />

          {/* School Name & Type */}
          <div className="flex flex-col select-none">
            <div className="flex items-baseline gap-1.5">
              <span id="brand-school-name" className="text-sm sm:text-lg font-extrabold text-neutral-900 tracking-tight font-sans">
                {config.schoolName}
              </span>
              <span id="brand-sub-badge" className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-100 hidden sm:inline">
                {config.subLabelKor}
              </span>
            </div>
            <span id="brand-school-name-eng" className="text-[10px] sm:text-xs text-neutral-500 font-mono font-medium -mt-0.5">
              {config.schoolNameEng} ({config.subLabelEng})
            </span>
          </div>
        </div>

        {/* Right Side: Desktop Nav Menu Grid */}
        <nav className="hidden lg:flex items-center gap-1">
          {MENU_ITEMS.map((item) => {
            const isTabActive = currentTab === item.id;
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => setActiveHoverMenu(item.id)}
                onMouseLeave={() => setActiveHoverMenu(null)}
              >
                {/* Main Menu Button */}
                <button
                  id={`nav-main-${item.id}`}
                  onClick={() => onNavigate(item.id, item.submenus[0].id)}
                  className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isTabActive
                      ? "text-blue-800 bg-blue-50/70"
                      : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                  }`}
                >
                  <span>{item.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeHoverMenu === item.id ? "rotate-180 text-blue-700" : "text-neutral-400"}`} />
                </button>

                {/* Submenu Dropdown */}
                {activeHoverMenu === item.id && (
                  <div
                    id={`nav-submenu-list-${item.id}`}
                    className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-neutral-200/80 py-1.5 z-50 animate-fade-in-up"
                  >
                    <div className="px-3 py-1 bg-neutral-50 text-[10px] font-bold text-neutral-400 tracking-wider font-mono">
                      {item.name} 서브카테고리
                    </div>
                    {item.submenus.map((sub) => {
                      const isSubActive = currentSubTab === sub.id;
                      return (
                        <button
                          key={sub.id}
                          id={`nav-sub-${sub.id}`}
                          onClick={() => handleSubClick(item.id, sub.id)}
                          className={`w-full text-left px-4 py-2 text-xs font-semibold select-none flex items-center justify-between transition-colors ${
                            isSubActive
                              ? "text-blue-700 bg-blue-50/50 hover:bg-blue-50"
                              : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                          }`}
                        >
                          <span>{sub.name}</span>
                          {isSubActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex lg:hidden items-center">
          <button
            id="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-100 text-neutral-700 hover:text-neutral-900 transition-colors"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Slide-out Menu Screen Overlay */}
      {mobileMenuOpen && (
        <div id="mobile-menu-overlay" className="fixed inset-0 top-[103px] z-50 bg-black/40 backdrop-blur-xs lg:hidden animate-fade-in">
          <div id="mobile-menu-drawer" className="absolute top-0 right-0 w-80 max-w-full h-full bg-white shadow-xl flex flex-col overflow-y-auto p-4 border-l border-neutral-100">
            
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">MOBILE NAVIGATION</span>
              <h4 className="text-xs font-semibold text-neutral-500 mt-1">빛가람초등학교 IB PYP</h4>
            </div>

            <div className="flex-1 space-y-3">
              {MENU_ITEMS.map((item) => {
                const isExpanded = expandedMobileMenu === item.id;
                const isTabActive = currentTab === item.id;
                return (
                  <div key={item.id} className="border-b border-neutral-100 pb-2">
                    <button
                      id={`mobile-main-${item.id}`}
                      onClick={() => toggleMobileSubmenu(item.id)}
                      className={`w-full flex items-center justify-between py-2 text-left text-sm font-bold transition-all ${
                        isTabActive ? "text-blue-700" : "text-neutral-800"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-blue-600" : "text-neutral-400"}`} />
                    </button>

                    {/* Mobile Submenu Expanded */}
                    {isExpanded && (
                      <div className="mt-1 pl-3 border-l-2 border-blue-100 space-y-1 block">
                        {item.submenus.map((sub) => {
                          const isSubActive = currentSubTab === sub.id;
                          return (
                            <button
                              key={sub.id}
                              id={`mobile-sub-${sub.id}`}
                              onClick={() => handleSubClick(item.id, sub.id)}
                              className={`w-full text-left py-1.5 px-2 text-xs font-medium rounded transition-colors block ${
                                isSubActive
                                  ? "bg-blue-50 text-blue-700 font-bold"
                                  : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800"
                              }`}
                            >
                              {sub.name}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mobile Footer Area inside Drawer */}
            <div className="mt-8 pt-4 border-t border-neutral-100 bg-neutral-50 -mx-4 -mb-4 p-4 text-xs text-neutral-500">
              <p className="font-semibold text-neutral-800">빛가람초등학교 IB PYP 연구학교</p>
              <p className="mt-1 text-[10px] leading-tight">Windows, Mac, iOS, Android 완벽 반응형 웹사이트</p>
              <div className="mt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="w-full py-1.5 px-3 bg-neutral-800 text-white rounded text-center text-xs font-bold hover:bg-neutral-950 transition-colors"
                >
                  Admin 패널 접속하기
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
