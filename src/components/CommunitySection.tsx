import React, { useState, useEffect } from 'react';
import { AppState, CommunityItem, CommentItem } from '../types';
import { MessageSquare, Heart, Trash2, Edit3, Send, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface CommunitySectionProps {
  state: AppState;
  currentSubTab: string;
  isAdminMode: boolean;
  onAddPost: (category: '공지' | '의견 나눔' | '질문과 답변' | '공감 게시판', title: string, author: string, content: string, password?: string) => void;
  onAddComment: (postId: string, author: string, content: string) => void;
  onLikePost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onUpdateState: (newState: AppState) => void;
}

// Simple typical Korean profanity filter words
const BANNED_WORDS = ['바보', '멍청이', '쓰레기', '나쁜놈', '욕설', '시발', '존나', '개새끼', '미친'];

export default function CommunitySection({
  state,
  currentSubTab,
  isAdminMode,
  onAddPost,
  onAddComment,
  onLikePost,
  onDeletePost,
  onDeleteComment,
  onUpdateState
}: CommunitySectionProps) {
  const { community } = state;

  const [activeCategory, setActiveCategory] = useState<'질문과 답변' | '공감 게시판'>('질문과 답변');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  // New post form state
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostAuthor, setNewPostAuthor] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostPassword, setNewPostPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // New states for Password Entry & Post Editing Modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CommunityItem | null>(null);
  const [passwordActionType, setPasswordActionType] = useState<'edit' | 'delete'>('delete');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editError, setEditError] = useState('');

  // New comment state
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [commentError, setCommentError] = useState('');

  // Sync sub-tab clicks
  useEffect(() => {
    if (currentSubTab === 'qna') setActiveCategory('질문과 답변');
    else if (currentSubTab === 'sympathy') setActiveCategory('공감 게시판');
    
    // Collapse expanded state on tab change
    setExpandedPostId(null);
  }, [currentSubTab]);

  // Censors input text returning masked text with ***
  const filterSlangText = (text: string): string => {
    let result = text;
    BANNED_WORDS.forEach((word) => {
      const regex = new RegExp(word, 'gi');
      result = result.replace(regex, '*'.repeat(word.length));
    });
    return result;
  };

  // Check if text has slang
  const hasSlang = (text: string): boolean => {
    return BANNED_WORDS.some(word => text.toLowerCase().includes(word));
  };

  const filteredPosts = community.filter(post => post.category === activeCategory);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    if (!newPostTitle.trim() || !newPostAuthor.trim() || !newPostContent.trim() || !newPostPassword.trim()) {
      setFormError('비밀번호를 포함하여 모든 필드를 작성해주시기 바랍니다.');
      return;
    }

    if (newPostPassword.trim().length < 4) {
      setFormError('비밀번호는 최소 4자리 이상으로 설정해 주세요.');
      return;
    }

    if (activeCategory === '공지' && !isAdminMode) {
      setFormError('공지사항 개설은 공식 관리자 승인 권한(Admin)이 필요합니다.');
      return;
    }

    // Slang verification check before posting
    const cleanTitle = filterSlangText(newPostTitle);
    const cleanContent = filterSlangText(newPostContent);

    onAddPost(activeCategory, cleanTitle, newPostAuthor.trim(), cleanContent, newPostPassword.trim());
    
    setNewPostTitle('');
    setNewPostAuthor('');
    setNewPostContent('');
    setNewPostPassword('');
    setFormSuccess(true);
    setTimeout(() => setFormSuccess(false), 3000);
  };

  const handleOpenPasswordModal = (post: CommunityItem, actionType: 'edit' | 'delete') => {
    if (isAdminMode) {
      if (actionType === 'delete') {
        if (window.confirm("이 기고글을 완전 삭제하시겠습니까? (관리자 비밀번호 바이패스 권한)")) {
          onDeletePost(post.id);
        }
      } else if (actionType === 'edit') {
        setSelectedPost(post);
        setEditTitle(post.title);
        setEditAuthor(post.author);
        setEditContent(post.content);
        setEditError('');
        setEditModalOpen(true);
      }
      return;
    }

    setSelectedPost(post);
    setPasswordActionType(actionType);
    setEnteredPassword('');
    setPasswordError('');
    setPasswordModalOpen(true);
  };

  const handleVerifyPasswordAndExecute = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!selectedPost) return;

    if (!selectedPost.password) {
      setPasswordError('이 게시물은 시스템 등록 초기 게시물로서, 비밀번호를 통한 수정/삭제가 제한됩니다. (관리자 문의 혹은 새 글을 작성해 테스트해 주세요)');
      return;
    }

    if (selectedPost.password !== enteredPassword) {
      setPasswordError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
      return;
    }

    // Password correct!
    if (passwordActionType === 'delete') {
      onDeletePost(selectedPost.id);
      setPasswordModalOpen(false);
      setSelectedPost(null);
      setEnteredPassword('');
    } else if (passwordActionType === 'edit') {
      setEditTitle(selectedPost.title);
      setEditAuthor(selectedPost.author);
      setEditContent(selectedPost.content);
      setEditError('');
      
      setPasswordModalOpen(false);
      setEnteredPassword('');
      setEditModalOpen(true);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditError('');

    if (!editTitle.trim() || !editAuthor.trim() || !editContent.trim()) {
      setEditError('모든 필드를 입력해 주시기 바랍니다.');
      return;
    }

    const cleanTitle = filterSlangText(editTitle);
    const cleanContent = filterSlangText(editContent);

    const updatedCommunity = state.community.map(post => {
      if (post.id === selectedPost?.id) {
        return {
          ...post,
          title: cleanTitle,
          author: editAuthor.trim(),
          content: cleanContent,
        };
      }
      return post;
    });

    onUpdateState({
      ...state,
      community: updatedCommunity
    });

    setEditModalOpen(false);
    setSelectedPost(null);
  };

  const handleCreateComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    setCommentError('');

    if (!newCommentAuthor.trim() || !newCommentContent.trim()) {
      setCommentError('성함과 의견을 채워주세요.');
      return;
    }

    let cleanContent = newCommentContent;
    
    // Auto censored notification
    if (hasSlang(newCommentContent)) {
      alert("부적절한 어휘나 비속어 표현이 포함되어 규정에 따라 마스킹 처리되었습니다.");
      cleanContent = filterSlangText(newCommentContent);
    }

    onAddComment(postId, newCommentAuthor.trim(), cleanContent);
    setNewCommentContent('');
    setNewCommentAuthor('');
  };

  return (
    <div id="community-section-container" className="py-2 px-1 max-w-7xl mx-auto font-sans grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Left List Container */}
      <div className="lg:col-span-8 space-y-6 w-full animate-fade-in animate-duration-300">
        
        {/* Category Header */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-2xs flex justify-between items-center select-none">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-blue-700 uppercase font-mono">CATEGORY STREAM</span>
            <h2 className="text-sm sm:text-base font-extrabold text-neutral-900 mt-1">
              {activeCategory} 게시글 타임라인
            </h2>
          </div>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-2.5 py-1 rounded-md">
            총 {filteredPosts.length}개의 글
          </span>
        </div>

        {/* List of posts with inline collapsible details */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-neutral-200 text-neutral-400 font-sans text-xs space-y-2 select-none">
            <MessageSquare className="w-8 h-8 text-neutral-300 mx-auto" />
            <p>작성된 글이 아직 존재하지 않는 대기 구역입니다.</p>
            <p className="text-[10px] text-neutral-400">오른쪽 작성 폼을 채워 첫 성찰 소감을 기고해 보세요!</p>
          </div>
        ) : (
          <div id="posts-timeline-list" className="space-y-4">
            {filteredPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              return (
                <div 
                  key={post.id}
                  onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isExpanded 
                      ? "bg-blue-50/20 border-blue-400/80 shadow-xs" 
                      : "bg-white border-neutral-200/80 hover:border-neutral-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                      <span>작성자: <strong className="text-neutral-700">{post.author}</strong></span>
                      <span>추천 {post.likes} • 조회 {post.views}</span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-neutral-950 hover:text-blue-700 leading-snug">
                      {post.title}
                    </h3>
                    
                    {/* Inline Content Display */}
                    {isExpanded ? (
                      <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed text-justify bg-white/80 p-4 rounded-xl border border-neutral-200/50 mt-2 font-medium">
                        {post.content}
                      </p>
                    ) : (
                      <p className="text-[11.5px] text-neutral-500 line-clamp-2 leading-relaxed text-justify">
                        {post.content}
                      </p>
                    )}
                  </div>

                  {/* Actions / Meta line */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
                    <span className="font-mono">{post.date}</span>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onLikePost(post.id);
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 font-mono bg-rose-50 px-2.5 py-1 rounded-md transition-colors"
                        title="공감/추천"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        <span>{post.likes}</span>
                      </button>

                      {/* Edit/Delete with Password for users */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPasswordModal(post, 'edit');
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-blue-700 bg-neutral-100 hover:bg-blue-50 px-2 py-1 rounded-md transition-all cursor-pointer"
                        title="글 수정하기"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>수정</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenPasswordModal(post, 'delete');
                        }}
                        className="flex items-center gap-1 text-[11px] font-bold text-neutral-600 hover:text-red-700 bg-neutral-100 hover:bg-red-50 px-2 py-1 rounded-md transition-all cursor-pointer"
                        title="글 삭제하기"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>삭제</span>
                      </button>
                      
                      {/* Admin Delete */}
                      {isAdminMode && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("정말로 이 소중한 기고글을 완전 소거 삭제하시겠습니까?")) {
                              onDeletePost(post.id);
                            }
                          }}
                          className="p-1 px-1.5 rounded-md hover:bg-neutral-100 hover:text-red-600 transition-all text-neutral-400"
                          title="관리자 강제 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Comments thread list inside post card & submit comment form */}
                  {isExpanded && (
                    <div 
                      className="pt-4 border-t border-neutral-200/60 space-y-4 animate-fade-in"
                      onClick={(e) => e.stopPropagation()} // Prevent card collapse when clicking elements inside
                    >
                      {/* Comments stream */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-extrabold text-neutral-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-blue-500" />
                          <span>의견 댓글 나눔 ({post.comments?.length || 0})</span>
                        </h4>

                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {post.comments?.length === 0 ? (
                            <p className="text-[10.5px] text-neutral-400 italic text-center py-2">
                              아직 등록된 교사 / 학부모 의견 나눔 댓글이 없습니다.
                            </p>
                          ) : (
                            post.comments?.map((com) => (
                              <div key={com.id} className="p-3 rounded-lg bg-neutral-100/50 border border-neutral-200/50 text-xs text-justify">
                                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono mb-1">
                                  <span className="font-extrabold text-neutral-700">{com.author}</span>
                                  <div className="flex items-center gap-2">
                                    <span>{com.date}</span>
                                    {isAdminMode && (
                                      <button
                                        onClick={() => {
                                          if (confirm("이 모니터 의견 댓글을 완전 파기하시겠습니까?")) {
                                            onDeleteComment(post.id, com.id);
                                          }
                                        }}
                                        className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                      >
                                        삭제
                                      </button>
                                    )}
                                  </div>
                                </div>
                                <p className="text-neutral-600 leading-relaxed font-sans">{com.content}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Add comment Form */}
                      <form onSubmit={(e) => handleCreateComment(e, post.id)} className="space-y-2 pt-2 border-t border-neutral-100">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="성함/필명"
                            value={newCommentAuthor}
                            onChange={(e) => setNewCommentAuthor(e.target.value)}
                            className="px-2.5 py-1.5 bg-neutral-50/70 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-800"
                          />
                          <div className="relative col-span-2 flex items-center animate-duration-200">
                            <input
                              type="text"
                              placeholder="의견 댓글 발언 입력..."
                              value={newCommentContent}
                              onChange={(e) => setNewCommentContent(e.target.value)}
                              className="w-full pl-2.5 pr-8 py-1.5 bg-neutral-50/70 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-800"
                            />
                            <button
                              type="submit"
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-blue-600 hover:text-blue-850"
                              title="댓글 등록"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {commentError && (
                          <p className="text-[10px] text-red-600 font-semibold">{commentError}</p>
                        )}
                        <p className="text-[9px] text-neutral-400 text-right">
                          * 바보, 멍청이, 욕설 등의 단어는 시스템 및 규정에 의하여 * 기호 처리됩니다.
                        </p>
                      </form>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right Column: Add New Post input card */}
      <div className="lg:col-span-4 w-full animate-fade-in">
        <div className="bg-white rounded-2xl p-5 border border-neutral-200/95 shadow-xs space-y-4">
          
          <div>
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase font-mono">CONTRIBUTE CORNER</span>
            <h3 className="text-xs sm:text-sm font-extrabold text-neutral-900 mt-1">
              새 탐구 지성글 작성하기 : <span className="text-blue-700 bg-blue-50 text-xs px-2 py-0.5 rounded font-black font-sans">{activeCategory}</span>
            </h3>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-3 text-xs sm:text-sm font-sans">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400">기고 작성자명</label>
              <input
                type="text"
                required
                placeholder="예: 강다은 학부모, 5학년 교사 등"
                value={newPostAuthor}
                onChange={(e) => setNewPostAuthor(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-50/60 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-850"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 font-sans">글 제목</label>
              <input
                type="text"
                required
                placeholder="질문이나 탐구 성찰 제목을 입력하세요"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-50/60 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-850"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 font-sans">수정/삭제 비밀번호</label>
              <input
                type="password"
                required
                placeholder="비밀번호 4자리 이상 입력"
                maxLength={20}
                value={newPostPassword}
                onChange={(e) => setNewPostPassword(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-50/60 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-850"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-neutral-400 font-sans">기고 본문 내용</label>
              <textarea
                required
                rows={5}
                placeholder="수업 소감, 학습 나눔에 대한 의견을 자유롭게 적어 공유해주세요..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full px-3 py-1.5 bg-neutral-50/60 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-850"
              />
            </div>

            {formError && (
              <p className="text-[11px] text-red-600 font-bold">{formError}</p>
            )}

            {formSuccess && (
              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>성찰 가치가 성공적으로 수집되어 타임라인에 반영되었습니다.</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer select-none font-sans"
            >
              작성하기
            </button>
          </form>

          {/* Quick guideline info */}
          <div className="p-3 bg-neutral-50 rounded-lg text-[10px] text-neutral-400 leading-relaxed">
            <strong>💡 소통 주의점:</strong> 서로의 생각을 존중하며 함께 배우는 공간입니다. 다양한 의견을 열린 마음으로 경청하고, 배려 있는 언어로 소통해 주세요.
          </div>

        </div>
      </div>

      {/* Password verification dialog */}
      {passwordModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-sm overflow-hidden text-neutral-800">
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h4 className="text-xs font-black text-neutral-900 tracking-wider">
                🔒 본인 확인 비밀번호 입력
              </h4>
              <button 
                onClick={() => {
                  setPasswordModalOpen(false);
                  setSelectedPost(null);
                  setEnteredPassword('');
                }}
                className="text-neutral-400 hover:text-neutral-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleVerifyPasswordAndExecute} className="p-4 space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs font-extrabold text-neutral-700">
                  {passwordActionType === 'edit' ? '게시글 수정' : '게시글 삭제'}을 계속하시겠습니까?
                </p>
                <p className="text-[10.5px] text-neutral-400 leading-normal">
                  작성 시 기입하셨던 비밀번호를 입력해 주세요.
                </p>
              </div>

              <div className="space-y-1.5 focus-within:text-blue-600">
                <input
                  type="password"
                  required
                  placeholder="비밀번호 입력"
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  className="w-full text-center tracking-widest text-xs px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-blue-500 font-bold text-neutral-900"
                />
                {passwordError && (
                  <p className="text-[10px] text-rose-600 font-bold text-center leading-relaxed">
                    {passwordError}
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-1 font-sans">
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalOpen(false);
                    setSelectedPost(null);
                    setEnteredPassword('');
                  }}
                  className="flex-1 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-lg text-xs cursor-pointer text-center"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer text-center"
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Edit Dialog */}
      {editModalOpen && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
          <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-lg overflow-hidden text-neutral-800">
            <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h4 className="text-xs font-black text-neutral-900 tracking-wider">
                📝 게시글 내용 수정하기
              </h4>
              <button 
                onClick={() => {
                  setEditModalOpen(false);
                  setSelectedPost(null);
                }}
                className="text-neutral-400 hover:text-neutral-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-5 space-y-4 text-xs sm:text-sm font-sans">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400">기고 작성자명</label>
                <input
                  type="text"
                  required
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 font-sans">글 제목</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 font-sans">기고 본문 내용</label>
                <textarea
                  required
                  rows={6}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-hidden text-neutral-800"
                />
              </div>

              {editError && (
                <p className="text-[11px] text-red-650 font-bold">{editError}</p>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditModalOpen(false);
                    setSelectedPost(null);
                  }}
                  className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 font-bold rounded-lg text-xs cursor-pointer text-center"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer text-center animate-duration-150"
                >
                  변경사항 저장하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
