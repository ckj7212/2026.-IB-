/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header, { MENU_ITEMS } from './components/Header';
import Footer from './components/Footer';
import HomeSection from './components/HomeSection';
import ResearchSection from './components/ResearchSection';
import LessonSection from './components/LessonSection';
import GallerySection from './components/GallerySection';
import CommunitySection from './components/CommunitySection';
import AdminPanel from './components/AdminPanel';
import PdfViewerModal from './components/PdfViewerModal';
import { defaultData } from './defaultData';
import { AppState, ReportItem, LessonItem, CommunityItem } from './types';
import { Compass, BookOpen, Clock, Heart, Users, ShieldAlert, CheckCircle2, ChevronRight, Layers } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'bitgaram_ib_pyp_portal_state';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn("로컬 에러 원인 복합 수사 실패. 기본 데이터 가치를 인계받습니다: ", err);
    }
    return defaultData;
  });

  // Routing navigation state
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentSubTab, setCurrentSubTab] = useState<string>('basic-info');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Modal display states
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('bitgaram_admin_active') === 'true';
  });
  const [activeReportPdf, setActiveReportPdf] = useState<ReportItem | null>(null);

  // Global notice bar
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync admin state to localStorage
  useEffect(() => {
    localStorage.setItem('bitgaram_admin_active', isAdminMode ? 'true' : 'false');
  }, [isAdminMode]);

  // Load state from IndexedDB on initial mount
  useEffect(() => {
    import('./lib/idb').then(({ getAsset }) => {
      getAsset('app_state_v2').then((idbState) => {
        if (idbState) {
          console.log("Loaded state from IndexedDB safely:", idbState);
          setState(idbState);
        }
      }).catch((err) => {
        console.error("IndexedDB state loading failed: ", err);
      }).finally(() => {
        setIsInitialized(true);
      });
    });
  }, []);

  // Persist State Updates
  useEffect(() => {
    if (!isInitialized) return;

    // 1. Save to IndexedDB (virtually unlimited quota)
    import('./lib/idb').then(({ storeAsset }) => {
      storeAsset('app_state_v2', state).catch((err) => {
        console.error("IndexedDB state save failed: ", err);
      });
    });

    // 2. Fallback to localStorage (clean and graceful if quota exceeded)
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("localStorage size quota exceeded, saved successfully to IndexedDB only: ", err);
    }
  }, [state, isInitialized]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // State manipulation interfaces
  const handleUpdateState = (newState: AppState) => {
    setState(newState);
  };

  // Nav update
  const handleNavigate = (tabId: string, subTabId: string) => {
    setCurrentTab(tabId);
    setCurrentSubTab(subTabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Increments view metrics for lesson items
  const handleIncrementViews = (lessonId: string) => {
    const updatedLessons = state.lessons.map(les => {
      if (les.id === lessonId) {
        return { ...les, views: les.views + 1 };
      }
      return les;
    });
    setState(prev => ({ ...prev, lessons: updatedLessons }));
  };

  // --- Community Section State modifiers ---
  const handleAddPost = (
    category: '공지' | '의견 나눔' | '질문과 답변' | '공감 게시판',
    title: string,
    author: string,
    content: string
  ) => {
    const newPost: CommunityItem = {
      id: `post-${Date.now()}`,
      category,
      title,
      author,
      content,
      date: new Date().toISOString().substring(0, 10),
      likes: 0,
      views: 1,
      comments: []
    };

    setState(prev => ({
      ...prev,
      community: [newPost, ...prev.community]
    }));
    triggerToast(`"${category}" 게시판에 새 탐구성찰 글이 게시되었습니다.`);
  };

  const handleAddComment = (postId: string, author: string, content: string) => {
    const updatedCommunity = state.community.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: `com-${Date.now()}`,
              author,
              content,
              date: new Date().toISOString().substring(0, 10) + ' ' + new Date().toTimeString().substring(0, 5)
            }
          ]
        };
      }
      return post;
    });

    setState(prev => ({ ...prev, community: updatedCommunity }));
    triggerToast('소통 발언 댓글이 정상 접수되었습니다.');
  };

  const handleLikePost = (postId: string) => {
    const updatedCommunity = state.community.map(post => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setState(prev => ({ ...prev, community: updatedCommunity }));
    triggerToast('배움에 대해 깊은 공감을 전달했습니다.');
  };

  const handleDeletePost = (postId: string) => {
    setState(prev => ({
      ...prev,
      community: prev.community.filter(p => p.id !== postId)
    }));
    triggerToast('성공적으로 기고글을 소거 파기해 드렸습니다.');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    const updatedCommunity = state.community.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter(c => c.id !== commentId)
        };
      }
      return post;
    });
    setState(prev => ({ ...prev, community: updatedCommunity }));
    triggerToast('지정 의견 댓글을 소거 완료했습니다.');
  };

  const activeMenu = MENU_ITEMS.find(m => m.id === currentTab);

  return (
    <div id="school-portal-root" className="min-h-screen bg-neutral-50/50 flex flex-col justify-between select-none">
      
      {/* Header component */}
      <Header
        config={state.config}
        currentTab={currentTab}
        currentSubTab={currentSubTab}
        onNavigate={handleNavigate}
        onOpenAdmin={() => setAdminOpen(true)}
        isAdminMode={isAdminMode}
      />

      {/* Real-time Dynamic Status/Tab Sub Bar (Meets requested constraint to easily navigate scroll-free) */}
      <div id="sub-navigation-header" className="bg-white border-b border-neutral-200/50 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          
          {/* Breadcrumbs path */}
          <div className="flex items-center gap-1 text-xs text-neutral-400 font-sans">
            <span>빛가람 IB PYP</span>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="font-extrabold text-neutral-800">{activeMenu?.name}</span>
            <ChevronRight className="w-3 h-3 text-neutral-300" />
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-sm font-semibold border border-blue-100">
              {activeMenu?.submenus.find(sub => sub.id === currentSubTab)?.name || currentSubTab}
            </span>
          </div>

          {/* Quick micro-selectors row for scroll-free sub-navigation cards alignment */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-sans">
            {activeMenu?.submenus.map((sub) => {
              const isActive = currentSubTab === sub.id;
              return (
                <button
                  key={sub.id}
                  id={`subtab-pill-${sub.id}`}
                  onClick={() => handleNavigate(currentTab, sub.id)}
                  className={`px-3 py-1 text-[11.5px] font-bold rounded-full transition-all shrink-0 cursor-pointer block select-none ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 hover:text-neutral-800"
                  }`}
                  aria-label={`${sub.name} 뷰 띄우기`}
                >
                  {sub.name}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Content Workspace viewport */}
      <main className="flex-1 w-full px-4 py-6 sm:py-8 max-w-7xl mx-auto text-neutral-800">
        
        {/* Render Tab specific screens */}
        {currentTab === 'home' && (
          <HomeSection 
            state={state} 
            currentSubTab={currentSubTab} 
          />
        )}

        {currentTab === 'research' && (
          <ResearchSection 
            state={state} 
            currentSubTab={currentSubTab} 
            onViewReport={(rep) => setActiveReportPdf(rep)} 
          />
        )}

        {currentTab === 'lessons' && (
          <LessonSection 
            state={state} 
            currentSubTab={currentSubTab} 
            onViewPlanPdf={(rep) => setActiveReportPdf(rep)}
            onIncrementViews={handleIncrementViews}
            onUpdateState={handleUpdateState}
          />
        )}

        {currentTab === 'gallery' && (
          <GallerySection 
            state={state} 
            currentSubTab={currentSubTab} 
            onViewPdf={(rep) => setActiveReportPdf(rep)}
            onUpdateState={handleUpdateState}
          />
        )}

        {currentTab === 'community' && (
          <CommunitySection 
            state={state} 
            currentSubTab={currentSubTab} 
            isAdminMode={isAdminMode}
            onAddPost={handleAddPost}
            onAddComment={handleAddComment}
            onLikePost={handleLikePost}
            onDeletePost={handleDeletePost}
            onDeleteComment={handleDeleteComment}
          />
        )}

      </main>

      {/* Footer element */}
      <Footer footer={state.footer} />

      {/* Admin Panel dialog overlay drawer */}
      {adminOpen && (
        <AdminPanel
          state={state}
          onUpdateState={handleUpdateState}
          onClose={() => setAdminOpen(false)}
          isAdminMode={isAdminMode}
          onSetAdminMode={setIsAdminMode}
        />
      )}

      {/* Simulated Document PDF viewer Modal overlay */}
      {activeReportPdf && (
        <PdfViewerModal
          report={activeReportPdf}
          onClose={() => setActiveReportPdf(null)}
        />
      )}

      {/* Global Toast System Notification strip */}
      {toastMsg && (
        <div id="toast-notification-strip" className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up font-sans select-none pointer-events-none">
          <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white shrink-0 text-xs text-[10px]">
            ✓
          </div>
          <div className="text-xs">
            <p className="font-extrabold text-neutral-100">포털 위원회 알림</p>
            <p className="text-neutral-400 mt-0.5">{toastMsg}</p>
          </div>
        </div>
      )}

    </div>
  );
}
