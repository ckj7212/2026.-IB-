import React, { useState, useEffect } from 'react';
import { Calendar, Award, Target, BookOpen, Compass, Shield, HelpCircle, GraduationCap } from 'lucide-react';
import { AppState } from '../types';

interface HomeSectionProps {
  state: AppState;
  currentSubTab: string;
}

export default function HomeSection({ state, currentSubTab }: HomeSectionProps) {
  const { basicInfo, config } = state;
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>('');

  useEffect(() => {
    let activeUrl = basicInfo.videoUrl || '';
    let objectUrl = '';

    if (activeUrl === 'indexeddb://custom_video_payload') {
      import('../lib/idb').then(({ getAsset }) => {
        getAsset('custom_video_payload').then((blob) => {
          if (blob instanceof Blob) {
            objectUrl = URL.createObjectURL(blob);
            setResolvedVideoUrl(objectUrl);
          } else {
            console.warn('IDB video asset is not a blob: ', blob);
          }
        }).catch((err) => {
          console.error('Failed to load IDB video: ', err);
        });
      });
    } else {
      setResolvedVideoUrl(activeUrl);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [basicInfo.videoUrl]);

  return (
    <div id="home-section-container" className="py-4 px-1 max-w-7xl mx-auto animate-fade-in">
      
      {/* 1. Submenu: 연구학교 기본 정보 (basic-info) */}
      {currentSubTab === 'basic-info' && (
        <div id="basic-info-view" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Embed Responsive Video */}
          <div className="order-2 lg:order-1 lg:col-span-7 bg-white border border-neutral-200 p-4 sm:p-5 lg:p-6 rounded-2xl shadow-sm flex flex-col justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-700">
                  <Compass className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-neutral-900 tracking-tight">연구학교 안내 영상</h2>
              </div>
              
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md border border-neutral-200 bg-neutral-900">
                {resolvedVideoUrl ? (
                  resolvedVideoUrl.match(/\.(mp4|webm|ogg|mov|mkv|avi)($|\?)/i) || resolvedVideoUrl.startsWith('data:video/') || resolvedVideoUrl.startsWith('blob:') ? (
                    <video
                      className="absolute inset-0 w-full h-full object-contain bg-black transform-gpu will-change-transform"
                      src={resolvedVideoUrl}
                      controls
                      autoPlay={true}
                      muted={true}
                      playsInline={true}
                      webkit-playsinline="true"
                      loop={true}
                      preload="auto"
                    />
                  ) : (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={(() => {
                        let url = resolvedVideoUrl;
                        const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
                        if (isYoutube) {
                          let videoId = '';
                          if (url.includes('youtu.be/')) {
                            videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
                          } else if (url.includes('v=')) {
                            videoId = url.split('v=')[1]?.split('&')[0] || '';
                          } else if (url.includes('/embed/')) {
                            videoId = url.split('/embed/')[1]?.split('?')[0] || '';
                          }

                          if (videoId) {
                            return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
                          } else {
                            const processed = url.includes('youtube.com') && !url.includes('/embed/') 
                              ? url.replace('watch?v=', 'embed/') 
                              : url;
                            const delimiter = processed.includes('?') ? '&' : '?';
                            return `${processed}${delimiter}autoplay=1&mute=1`;
                          }
                        }
                        return url;
                      })()}
                      title="빛가람초등학교 IB PYP 연구학교 소개 영상"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="no-referrer"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-400 text-xs">
                    <Compass className="w-8 h-8 text-neutral-500 animate-spin mb-2" />
                    <span>등록된 영상이 존재하지 않습니다.</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* ACCESSIBLE CAPTION FOR VIDEO */}
            <div className="p-2.5 bg-neutral-50 border border-neutral-200/60 rounded-xl flex gap-2 items-start">
              <span className="text-blue-700 font-bold shrink-0 text-xs mt-0.5">ℹ️</span>
              <p className="text-[11px] text-neutral-600 leading-relaxed text-justify">
                <strong>영상 안내:</strong> {basicInfo.videoDesc || "빛가람초등학교의 2026학년도 IB PYP 연구학교 운영의 핵심적 현장 스케치 및 탐구 중심 기조 발현 장면에 대한 실사를 소개하는 안내 영상입니다."}
              </p>
            </div>
          </div>

          {/* Right Column: Simplified Elegant Slogan Card */}
          <div className="order-1 lg:order-2 lg:col-span-5 bg-linear-to-b from-blue-50 to-white border border-blue-100 p-5 sm:p-6 lg:p-8 rounded-2xl shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[320px] lg:min-h-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100/40 rounded-full -mr-10 -mt-10 blur-2xl pointer-events-none"></div>
            
            <div className="space-y-8 my-auto text-center py-4">
              <div className="space-y-2">
                <span className="text-xs sm:text-sm text-blue-600 font-bold tracking-wider uppercase bg-blue-100/60 px-3 py-1 rounded-full inline-block">
                  2026 전라남도교육청 지정
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-2">
                  IB 월드스쿨(초) 연구학교
                </h2>
              </div>

              <div className="w-12 h-0.5 bg-blue-500 mx-auto rounded-full"></div>

              <div className="space-y-4 text-base sm:text-lg font-medium text-neutral-700 leading-relaxed select-none">
                <p className="flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200">
                  <span className="text-blue-500 font-extrabold text-base">✏️</span>
                  <span className="font-semibold text-neutral-800">{basicInfo.slogan1 || "배움을 설계하고"}</span>
                </p>
                <p className="flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200">
                  <span className="text-blue-500 font-extrabold text-base">💡</span>
                  <span className="font-semibold text-neutral-800">{basicInfo.slogan2 || "생각을 확장하며"}</span>
                </p>
                <p className="flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200">
                  <span className="text-blue-500 font-extrabold text-base">🌱</span>
                  <span className="font-semibold text-neutral-800">{basicInfo.slogan3 || "주도적으로 성장하다"}</span>
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
              <span className="font-medium text-blue-600/70">* IB PYP 월드스쿨</span>
              <span className="font-mono font-semibold text-neutral-500">빛가람초등학교</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. Submenu: 학교 소개 (school-intro) */}
      {currentSubTab === 'school-intro' && (
        <div id="school-intro-view" className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
          
          {/* Left info column */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 font-sans">
              <GraduationCap className="w-3.5 h-3.5 shrink-0" />
              <span>배움이 즐거운 빛가람 교육</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              빛가람초등학교를 소개합니다
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed text-justify whitespace-pre-line font-sans">
              {basicInfo.schoolIntro}
            </p>

            <div className="bg-neutral-50 rounded-xl p-4 text-xs font-sans text-neutral-500 space-y-2 border border-neutral-100">
              <p className="font-semibold text-neutral-700">🏫 학교 상징 (School Symbols)</p>
              <div className="grid grid-cols-2 gap-3 text-[11px] pt-1">
                <div>
                  <span className="font-bold text-indigo-700">교목 :</span> {basicInfo.symbolTimber || "느티나무 (포용, 강인한 건강)"}
                </div>
                <div>
                  <span className="font-bold text-indigo-700">교화 :</span> {basicInfo.symbolFlower || "장미 (열정, 아름다운 품격)"}
                </div>
                <div>
                  <span className="font-bold text-indigo-700">교색 :</span> {basicInfo.symbolColor || "녹색 (성장, 무한한 희망)"}
                </div>
                <div>
                  <span className="font-bold text-indigo-700">교훈 :</span> {basicInfo.symbolMotto || "바르고 슬기롭게 건강하게"}
                </div>
              </div>
            </div>
          </div>

          {/* Right image/illustration preset column */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-neutral-100 flex items-center justify-center border border-neutral-200 group">
            {basicInfo.schoolImage ? (
              <img 
                src={basicInfo.schoolImage} 
                alt="빛가람초등학교 전경" 
                className="w-full h-full object-cover absolute inset-0 z-0" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-linear-to-tr from-emerald-600/10 via-teal-600/5 to-indigo-600/10 opacity-80 z-0"></div>
                {/* Nice stylized vector overlay for tech/modern feeling */}
                <div className="text-center space-y-3 z-10 p-6">
                  <div className="w-16 h-16 bg-white shadow-md rounded-full mx-auto flex items-center justify-center text-emerald-600 font-extrabold text-2xl border-2 border-emerald-100">
                    숲
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">자연과 어우러진 배움의 전당</p>
                    <p className="text-xs text-neutral-500 mt-1">스마트 친환경 교실 및 유기적 가속 학습 교정</p>
                  </div>
                  <div className="flex justify-center gap-1.5 text-[10px] text-neutral-400">
                    <span className="px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">글로벌 리더십</span>
                    <span className="px-2 py-0.5 bg-neutral-100 rounded border border-neutral-200">개방적 존중</span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      )}

      {/* 3. Submenu: IB Mission Statement (ib-mission) */}
      {currentSubTab === 'ib-mission' && (
        <div id="ib-mission-view" className="bg-linear-to-b from-neutral-50 to-white rounded-2xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
          
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto border border-blue-100">
              <Compass className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-blue-700 uppercase font-mono">EDUCATIONAL CHARTER</span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                IB Mission Statement (사명 선언문)
              </h2>
            </div>

            <blockquote className="relative p-6 sm:p-8 bg-white rounded-xl border-l-4 border-blue-600 shadow-md text-neutral-800 text-sm sm:text-[15px] md:text-base leading-relaxed break-keep font-sans font-medium select-none space-y-3">
              {basicInfo.ibMission ? basicInfo.ibMission.split('.').map((s) => s.trim()).filter(Boolean).map((trimmed, idx) => (
                <p key={idx} className="text-center block text-neutral-800 font-semibold tracking-tight">
                  {idx === 0 ? '“ ' : ''}{trimmed}.{idx === 1 ? ' ”' : ''}
                </p>
              )) : null}
            </blockquote>

            {/* Learner Profile Grid - highly relevant for IB, perfectly aesthetic and requested */}
            <div className="pt-4 space-y-4">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">
                IB 10가지 학습자상 (Learner Profile)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { ko: "탐구하는 사람", en: "Inquirers", color: "bg-blue-50 text-blue-700 border-blue-100/80" },
                  { ko: "지식이 풍부한 사람", en: "Knowledgeable", color: "bg-emerald-50 text-emerald-700 border-emerald-100/80" },
                  { ko: "생각하는 사람", en: "Thinkers", color: "bg-amber-50 text-amber-700 border-amber-100/80" },
                  { ko: "소통하는 사람", en: "Communicators", color: "bg-purple-50 text-purple-700 border-purple-100/80" },
                  { ko: "원칙을 지키는 사람", en: "Principled", color: "bg-rose-50 text-rose-700 border-rose-100/80" },
                  { ko: "열린 마음을 가진 사람", en: "Open-minded", color: "bg-indigo-50 text-indigo-700 border-indigo-100/80" },
                  { ko: "배려하는 사람", en: "Caring", color: "bg-pink-50 text-pink-700 border-pink-100/80" },
                  { ko: "도전하는 사람", en: "Risk-takers", color: "bg-orange-50 text-orange-700 border-orange-100/80" },
                  { ko: "균형 잡힌 사람", en: "Balanced", color: "bg-teal-50 text-teal-700 border-teal-100/80" },
                  { ko: "성찰하는 사람", en: "Reflective", color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
                ].map((profile, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-center transition-transform hover:-translate-y-0.5 flex flex-col justify-center items-center gap-1 shadow-2xs ${profile.color}`}
                  >
                    <span className="font-extrabold text-[12px] sm:text-[13px] tracking-tight leading-tight">{profile.ko}</span>
                    <span className="text-[9.5px] sm:text-[10px] opacity-75 font-mono font-semibold tracking-tight leading-tight">{profile.en}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
