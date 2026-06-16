import React, { useState } from 'react';
import { AppState, ReportItem, LessonItem, GalleryItem, ResearchTaskItem, QuantitativeMetric, QualitativeFeedback } from '../types';
import { ShieldAlert, LogOut, CheckCircle, Save, Plus, Trash2, Edit3, Image, Upload, FileJson, ArrowDown, Sparkles } from 'lucide-react';

interface AdminPanelProps {
  state: AppState;
  onUpdateState: (newState: AppState) => void;
  onClose: () => void;
  isAdminMode: boolean;
  onSetAdminMode: (active: boolean) => void;
}

export default function AdminPanel({ state, onUpdateState, onClose, isAdminMode, onSetAdminMode }: AdminPanelProps) {
  const [passcode, setPasscode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(isAdminMode);
  const [authError, setAuthError] = useState('');

  // Active section inside admin panel
  const [activeTab, setActiveTab] = useState<'config' | 'overview' | 'infographic' | 'researchTasks' | 'reports' | 'lessons' | 'gallery' | 'outcomes' | 'community' | 'backup'>('config');

  // --- Research Tasks Section CRUD States ---
  const [selectedTaskToEdit, setSelectedTaskToEdit] = useState<ResearchTaskItem | null>(null);
  const [isAddingNewTask, setIsAddingNewTask] = useState<boolean>(false);
  const [newTaskForm, setNewTaskForm] = useState<Partial<ResearchTaskItem>>({
    themeNum: 1,
    subThemeName: '가',
    subThemeTitle: '',
    taskCode: '',
    title: '',
    bg: '',
    text: '',
    methods: [],
    cases: [],
    resources: [],
    impact: ''
  });

  // New states for adding quantitative metrics and qualitative feedbacks
  const [newMetricForm, setNewMetricForm] = useState({ label: '', before: 0, after: 0, unit: '%' });
  const [newFeedbackForm, setNewFeedbackForm] = useState<Partial<QualitativeFeedback>>({ role: '교사', name: '', quote: '', date: '' });

  // Community posts editing states
  const [selectedPostToEdit, setSelectedPostToEdit] = useState<string | null>(null);
  const [postEditTitle, setPostEditTitle] = useState('');
  const [postEditContent, setPostEditContent] = useState('');

  // Authorization code check (Required: IBGR251125)
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'IBGR251125') {
      setIsAuthorized(true);
      onSetAdminMode(true);
      setAuthError('');
    } else {
      setAuthError('올바르지 않은 관리자 보안 인증 코드입니다.');
    }
  };

  // State update helpers (dispatches changes back to main state)
  const updateConfig = (key: string, value: string) => {
    const updated = { ...state.config, [key]: value };
    onUpdateState({ ...state, config: updated });
  };

  const updateBasicInfoFields = (key: string, value: any) => {
    const updated = { ...state.basicInfo, [key]: value };
    onUpdateState({ ...state, basicInfo: updated });
  };

  const updateInfographicTitle = (title: string) => {
    const updated = { ...state.infographic, title };
    onUpdateState({ ...state, infographic: updated });
  };

  const updateInfographicImage = (base64: string) => {
    const updated = {
      ...state.infographic,
      imageBase64: base64 || ''
    };
    onUpdateState({ ...state, infographic: updated });
  };

  const updateInfographicStep = (index: number, key: 'step' | 'title' | 'desc', value: string) => {
    const updatedSteps = [...state.infographic.steps];
    updatedSteps[index] = { ...updatedSteps[index], [key]: value };
    const updated = { ...state.infographic, steps: updatedSteps };
    onUpdateState({ ...state, infographic: updated });
  };

  const handleUpdateFooter = (key: string, value: string) => {
    const updated = { ...state.footer, [key]: value };
    onUpdateState({ ...state, footer: updated });
  };

  // Base64 file reader helper for uploading logos/images/infographics
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- Reports Section CRUD States ---
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [reportForm, setReportForm] = useState<Partial<ReportItem>>({
    type: 'plan',
    title: '',
    desc: '',
    filename: '',
    pdfContentSim: '',
    pdfBase64: ''
  });

  const handleStartEditReport = (rep: ReportItem) => {
    setEditingReportId(rep.id);
    setReportForm({
      type: rep.type,
      title: rep.title,
      desc: rep.desc,
      filename: rep.filename,
      pdfContentSim: rep.pdfContentSim,
      pdfBase64: rep.pdfBase64
    });
  };
  
  const handleAddReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.filename) {
      alert('제목과 파일명을 반드시 기입해주세요.');
      return;
    }

    if (editingReportId) {
      // Editing Mode
      const updatedReports = state.reports.map(r => r.id === editingReportId ? {
        ...r,
        type: reportForm.type || 'plan',
        title: reportForm.title || '',
        desc: reportForm.desc || '',
        filename: reportForm.filename || '',
        pdfContentSim: reportForm.pdfContentSim || `${reportForm.title}에 연계된 상세 계획/보고서 내역입니다.`,
        pdfBase64: reportForm.pdfBase64
      } : r);

      onUpdateState({
        ...state,
        reports: updatedReports
      });
      setEditingReportId(null);
      alert('연구 보고서가 성공적으로 수정 반영되었습니다.');
    } else {
      // Creating Mode
      const newReport: ReportItem = {
        id: `rep-${Date.now()}`,
        type: reportForm.type || 'plan',
        title: reportForm.title || '',
        desc: reportForm.desc || '',
        filename: reportForm.filename || '',
        uploadDate: new Date().toISOString().substring(0, 10),
        pdfContentSim: reportForm.pdfContentSim || `${reportForm.title}에 연계된 상세 계획/보고서 내역입니다.`,
        pdfBase64: reportForm.pdfBase64
      };

      onUpdateState({
        ...state,
        reports: [newReport, ...state.reports]
      });
      alert('새 연구 보고서가 발급되었습니다.');
    }

    // Reset report form
    setReportForm({
      type: 'plan',
      title: '',
      desc: '',
      filename: '',
      pdfContentSim: '',
      pdfBase64: ''
    });
  };

  const handleDeleteReport = (id: string) => {
    if (confirm('이 연구보고서를 소거하시겠습니까?')) {
      onUpdateState({
        ...state,
        reports: state.reports.filter(r => r.id !== id)
      });
      if (editingReportId === id) {
        setEditingReportId(null);
      }
    }
  };

  // --- Lessons Section CRUD States ---
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState<Partial<LessonItem>>({
    grade: '3학년',
    theme: '우리는 누구인가 (Who We Are)',
    teacher: '',
    inquiryQuestion: '',
    centralIdea: '',
    concepts: '',
    description: '',
    direction: '',
    lessonPlanSim: '',
    pdfBase64: '',
    image: '🏫',
    isOpenLesson: true,
    materialType: '지도안',
    period: ''
  });

  const handleStartEditLesson = (les: LessonItem) => {
    setEditingLessonId(les.id);
    setLessonForm({
      grade: les.grade,
      theme: les.theme,
      teacher: les.teacher,
      inquiryQuestion: les.inquiryQuestion,
      centralIdea: les.centralIdea,
      concepts: les.concepts,
      description: les.description,
      direction: les.direction,
      lessonPlanSim: les.lessonPlanSim,
      pdfBase64: les.pdfBase64,
      image: les.image || '🎒',
      isOpenLesson: true,
      materialType: '지도안',
      period: les.period || ''
    });
  };

  const handleAddLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonForm.teacher || !lessonForm.inquiryQuestion || !lessonForm.centralIdea) {
      alert('지도교사, 탐구질문, 중심아이디어는 필수 요소입니다.');
      return;
    }

    if (editingLessonId) {
      // Editing Mode
      const updatedLessons: LessonItem[] = state.lessons.map(l => l.id === editingLessonId ? {
        ...l,
        grade: lessonForm.grade || '3학년',
        theme: lessonForm.theme || '우리는 누구인가 (Who We Are)',
        teacher: lessonForm.teacher || '',
        inquiryQuestion: lessonForm.inquiryQuestion || '',
        centralIdea: lessonForm.centralIdea || '',
        concepts: lessonForm.concepts || '',
        description: lessonForm.description || '',
        direction: lessonForm.direction || '',
        lessonPlanSim: lessonForm.lessonPlanSim || `${lessonForm.teacher} 교사의 [${lessonForm.theme}] 단원 통합 탐구활동 지도 요약안입니다.`,
        pdfBase64: lessonForm.pdfBase64,
        image: lessonForm.image || '🎒',
        isOpenLesson: true,
        materialType: '지도안' as const,
        period: lessonForm.period || ''
      } as LessonItem : l);

      onUpdateState({
        ...state,
        lessons: updatedLessons
      });
      setEditingLessonId(null);
      alert('수업공유자료 카드가 성공적으로 수정 반영되었습니다.');
    } else {
      // Creating Mode
      const newLesson: LessonItem = {
        id: `les-${Date.now()}`,
        grade: lessonForm.grade || '3학년',
        theme: lessonForm.theme || '우리는 누구인가 (Who We Are)',
        teacher: lessonForm.teacher || '',
        inquiryQuestion: lessonForm.inquiryQuestion || '',
        centralIdea: lessonForm.centralIdea || '',
        concepts: lessonForm.concepts || '',
        description: lessonForm.description || '',
        direction: lessonForm.direction || '',
        lessonPlanSim: lessonForm.lessonPlanSim || `${lessonForm.teacher} 교사의 [${lessonForm.theme}] 단원 통합 탐구활동 지도 요약안입니다.`,
        pdfBase64: lessonForm.pdfBase64,
        image: lessonForm.image || '🎒',
        views: 1,
        date: new Date().toISOString().substring(0, 10),
        isOpenLesson: true,
        materialType: '지도안',
        period: lessonForm.period || ''
      };

      onUpdateState({
        ...state,
        lessons: [newLesson, ...state.lessons]
      });
      alert('새 수업공유자료 카드가 등록되었습니다!');
    }

    // Reset lesson form
    setLessonForm({
      grade: '3학년',
      theme: '우리는 누구인가 (Who We Are)',
      teacher: '',
      inquiryQuestion: '',
      centralIdea: '',
      concepts: '',
      description: '',
      direction: '',
      lessonPlanSim: '',
      pdfBase64: '',
      image: '🎒',
      isOpenLesson: true,
      materialType: '지도안',
      period: ''
    });
  };

  const handleDeleteLesson = (id: string) => {
    if (confirm('이 수업나눔 자료를 정말로 삭제하시겠습니까?')) {
      onUpdateState({
        ...state,
        lessons: state.lessons.filter(l => l.id !== id)
      });
      if (editingLessonId === id) {
        setEditingLessonId(null);
      }
    }
  };

  // --- Gallery Section CRUD States ---
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [galleryForm, setGalleryForm] = useState<Partial<GalleryItem>>({
    title: '',
    grade: '5학년',
    category: '학습',
    theme: '세계가 돌아가는 방식 (How the World Works)',
    description: '',
    files: [],
    pdfBase64: '',
    pdfContentSim: ''
  });
  const [galleryUploadedImages, setGalleryUploadedImages] = useState<string[]>([]);

  const handleStartEditGallery = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setGalleryForm({
      title: item.title,
      grade: item.grade,
      category: item.category,
      theme: item.theme,
      description: item.description,
      files: item.files || [],
      pdfBase64: item.pdfBase64 || '',
      pdfContentSim: item.pdfContentSim || ''
    });
    setGalleryUploadedImages(item.images || []);
  };

  const handleAddGalleryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        setGalleryUploadedImages(prev => [...prev, reader.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title) {
      alert('갤러리 제목을 입력해 주세요.');
      return;
    }
    if (galleryUploadedImages.length === 0 && !galleryForm.pdfBase64) {
      alert('활동 대표 이미지 또는 실제 PDF 파일 중 최소 1개는 포함되어야 합니다.');
      return;
    }

    const defaultPdfName = galleryForm.files && galleryForm.files.length > 0 ? galleryForm.files : (galleryForm.pdfBase64 ? ['portfolio_document.pdf'] : []);

    if (editingGalleryId) {
      // Editing Mode
      const updatedGallery = state.gallery.map(g => g.id === editingGalleryId ? {
        ...g,
        title: galleryForm.title || '',
        grade: galleryForm.grade || '5학년',
        category: galleryForm.category || '학습',
        theme: galleryForm.theme || '세계가 돌아가는 방식 (How the World Works)',
        description: galleryForm.description || '',
        images: galleryUploadedImages,
        files: defaultPdfName,
        pdfBase64: galleryForm.pdfBase64 || undefined,
        pdfContentSim: galleryForm.pdfContentSim || galleryForm.description
      } : g);

      onUpdateState({
        ...state,
        gallery: updatedGallery
      });
      setEditingGalleryId(null);
      alert('교육현장 갤러리가 성공적으로 수정 저장되었습니다.');
    } else {
      // Creating Mode
      const newItem: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: galleryForm.title || '',
        grade: galleryForm.grade || '5학년',
        category: galleryForm.category || '학습',
        theme: galleryForm.theme || '세계가 돌아가는 방식 (How the World Works)',
        description: galleryForm.description || '',
        images: galleryUploadedImages,
        files: defaultPdfName,
        pdfBase64: galleryForm.pdfBase64 || undefined,
        pdfContentSim: galleryForm.pdfContentSim || galleryForm.description,
        date: new Date().toISOString().substring(0, 10)
      };

      onUpdateState({
        ...state,
        gallery: [newItem, ...state.gallery]
      });
      alert('새 교육현장 갤러리가 업로드되었습니다.');
    }

    // Reset
    setGalleryForm({
      title: '',
      grade: '5학년',
      category: '학습',
      theme: '세계가 돌아가는 방식 (How the World Works)',
      description: '',
      files: [],
      pdfBase64: '',
      pdfContentSim: ''
    });
    setGalleryUploadedImages([]);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (confirm('이 갤러리를 삭제하시겠습니까?')) {
      onUpdateState({
        ...state,
        gallery: state.gallery.filter(g => g.id !== id)
      });
      if (editingGalleryId === id) {
        setEditingGalleryId(null);
      }
    }
  };

  // --- Research Tasks CRUD Handlers ---
  const handleSaveEditedTask = () => {
    if (!selectedTaskToEdit) return;
    const updatedTasks = state.researchTasks.map(t => t.id === selectedTaskToEdit.id ? selectedTaskToEdit : t);
    onUpdateState({ ...state, researchTasks: updatedTasks });
    setSelectedTaskToEdit(null);
    alert('연구과제가 성공적으로 최종 저장 변경되었습니다.');
  };

  const handleAddNewTask = () => {
    const taskCodeMatch = newTaskForm.taskCode || `${newTaskForm.themeNum}-${newTaskForm.subThemeName}-1)`;
    const task: ResearchTaskItem = {
      id: `task-${Date.now()}`,
      themeNum: newTaskForm.themeNum || 1,
      subThemeName: newTaskForm.subThemeName || '가',
      subThemeTitle: newTaskForm.subThemeTitle || '',
      taskCode: taskCodeMatch,
      title: newTaskForm.title || '',
      bg: newTaskForm.bg || '',
      text: newTaskForm.text || '',
      methods: newTaskForm.methods || [],
      cases: newTaskForm.cases || [],
      resources: newTaskForm.resources || [],
      resourceLinks: newTaskForm.resourceLinks || [],
      impact: newTaskForm.impact || ''
    };

    onUpdateState({
      ...state,
      researchTasks: [...state.researchTasks, task]
    });

    setNewTaskForm({
      themeNum: 1,
      subThemeName: '가',
      subThemeTitle: '',
      taskCode: '',
      title: '',
      bg: '',
      text: '',
      methods: [],
      cases: [],
      resources: [],
      resourceLinks: [],
      impact: ''
    });
    setIsAddingNewTask(false);
    alert('새 연구과제가 성공적으로 추진 목록에 추가 편입되었습니다.');
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('이 연구과제 항목을 완전히 명단에서 영구 소거하시겠습니까?')) {
      onUpdateState({
        ...state,
        researchTasks: state.researchTasks.filter(t => t.id !== id)
      });
    }
  };

  // --- outcomes metrics modifier ---
  const handleUpdateQuantitativeMetric = (index: number, key: 'before' | 'after' | 'label' | 'unit', value: any) => {
    const newMetric = [...state.outcomes.quantitative];
    newMetric[index] = { ...newMetric[index], [key]: value };
    onUpdateState({
      ...state,
      outcomes: { ...state.outcomes, quantitative: newMetric }
    });
  };

  const handleUpdateQualitativeQuote = (index: number, key: 'quote' | 'name' | 'role' | 'date', value: any) => {
    const newQual = [...state.outcomes.qualitative];
    newQual[index] = { ...newQual[index], [key]: value };
    onUpdateState({
      ...state,
      outcomes: { ...state.outcomes, qualitative: newQual }
    });
  };

  const handleAddQuantitativeMetric = () => {
    if (!newMetricForm.label) {
      alert('지표 명칭을 입력해주세요.');
      return;
    }
    const newMetric: QuantitativeMetric = {
      label: newMetricForm.label,
      before: newMetricForm.before,
      after: newMetricForm.after,
      unit: newMetricForm.unit
    };
    onUpdateState({
      ...state,
      outcomes: {
        ...state.outcomes,
        quantitative: [...(state.outcomes.quantitative || []), newMetric]
      }
    });
    setNewMetricForm({ label: '', before: 0, after: 0, unit: '%' });
    alert('새 정량 지표 항목이 추가되었습니다.');
  };

  const handleDeleteQuantitativeMetric = (index: number) => {
    if (confirm('이 만족도 성과 지표를 영구 삭제하시겠습니까?')) {
      const filtered = state.outcomes.quantitative.filter((_, idx) => idx !== index);
      onUpdateState({
        ...state,
        outcomes: { ...state.outcomes, quantitative: filtered }
      });
    }
  };

  const handleAddQualitativeFeedback = () => {
    if (!newFeedbackForm.quote || !newFeedbackForm.name) {
      alert('공동체 구성원 명칭과 한줄 성찰 성과를 기입해주세요.');
      return;
    }
    const newFeedback: QualitativeFeedback = {
      id: `fb-${Date.now()}`,
      role: newFeedbackForm.role || '교사',
      name: newFeedbackForm.name || '',
      quote: newFeedbackForm.quote || '',
      date: newFeedbackForm.date || new Date().toISOString().substring(0, 10)
    };
    onUpdateState({
      ...state,
      outcomes: {
        ...state.outcomes,
        qualitative: [...(state.outcomes.qualitative || []), newFeedback]
      }
    });
    setNewFeedbackForm({ role: '교사', name: '', quote: '', date: '' });
    alert('새 정성적 현장의 성찰 사례가 추가되었습니다.');
  };

  const handleDeleteQualitativeFeedback = (id: string) => {
    if (confirm('이 정성적 피드백 성찰 사례를 삭제하시겠습니까?')) {
      const filtered = state.outcomes.qualitative.filter(f => f.id !== id);
      onUpdateState({
        ...state,
        outcomes: { ...state.outcomes, qualitative: filtered }
      });
    }
  };

  // --- Community moderation handlers ---
  const handleDeletePost = (postId: string) => {
    if (confirm('이 기고글을 소통게시판에서 강제 삭제 회수하시겠습니까? (이 작업은 영구적입니다)')) {
      onUpdateState({
        ...state,
        community: state.community.filter(p => p.id !== postId)
      });
    }
  };

  const handleSavePostEdit = (postId: string) => {
    const updated = state.community.map(p => p.id === postId ? { ...p, title: postEditTitle, content: postEditContent } : p);
    onUpdateState({ ...state, community: updated });
    setSelectedPostToEdit(null);
    alert('소통성찰 기고 내용이 완벽하게 중재 수정되었습니다.');
  };

  const handleDeleteComment = (postId: string, commentId: string) => {
    if (confirm('이 덧글을 완전히 소거하시겠습니까?')) {
      const updated = state.community.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter(c => c.id !== commentId)
          };
        }
        return p;
      });
      onUpdateState({ ...state, community: updated });
    }
  };

  // --- Backup and Restore Logic (데이터 백업 가능) ---
  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `bitgaram_pyp_portal_state_backup_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.removeChild(downloadAnchor);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && parsed.config && parsed.basicInfo && parsed.reports) {
          onUpdateState(parsed);
          alert('빛가람초 상태 데이터 전체 복원 백업 적용에 성료했습니다!');
        } else {
          alert('체계에 불일치하는 백업 파일 구조입니다. 속성을 감정해보세요.');
        }
      } catch (err) {
        alert('JSON 복원 분석에 난국이 발생했습니다: ' + err);
      }
    };
    reader.readAsText(file);
  };


  // UN-AUTHORIZED SCREEN
  if (!isAuthorized) {
    return (
      <div id="admin-auth-overlay" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 border border-neutral-300 shadow-2xl space-y-6 animate-fade-in-up text-sans">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-linear-to-tr from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-sm font-black text-neutral-900 tracking-tight">빛가람초 IB PYP 포털 관리자 잠금</h2>
            <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">
              정밀 보안 관리를 위해 발간된 지정 인증 코드를 연계하여 잠금을 즉각 해제해 주시기 바랍니다.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10.5px] font-bold text-neutral-400 font-mono tracking-widest block uppercase">접속 암호 코드</label>
              <input
                type="password"
                placeholder="지정 보안 코드 입력"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 focus:bg-white text-xs sm:text-sm font-semibold text-center tracking-widest rounded-lg focus:outline-hidden focus:border-amber-500 text-neutral-800"
                autoFocus
              />
              <span className="text-[9.5px] text-neutral-400 block pt-1 select-none">
                * 관리자 자격 보유자 혹은 포럼 위원회 운영진만 접속할 수 있습니다.
              </span>
            </div>

            {authError && (
              <p className="text-xs text-red-600 font-bold text-center">{authError}</p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-neutral-900 hover:bg-neutral-950 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                인증 해제
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // AUTHORIZED CONTENT SCREEN
  return (
    <div id="admin-panel-overlay" className="fixed inset-0 z-50 bg-neutral-100 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Admin Panel Header */}
      <div className="bg-neutral-900 text-white py-4 px-6 flex justify-between items-center shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 p-1.5 rounded text-neutral-950 inline-flex items-center justify-center font-black">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-normal sm:text-base font-black tracking-tight">빛가람초등학교 IB PYP 포털 마스터 컨트롤 데시보드</h1>
            <p className="text-[10px] text-neutral-400 font-mono leading-none mt-1">Status: Authorized Session • Live Sync On</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (confirm('관리자 모드를 완전히 종료(OFF)하고 로그아웃하시겠습니까?')) {
                setIsAuthorized(false);
                onSetAdminMode(false);
                onClose();
              }
            }}
            className="p-1.5 px-3 bg-neutral-800 hover:bg-red-950/80 rounded-lg text-[11px] font-bold text-red-300 hover:text-red-200 transition-colors cursor-pointer border border-red-950/30"
          >
            관리자 모드 OFF (로그아웃)
          </button>
          <button
            onClick={onClose}
            className="p-1.5 px-3 bg-amber-500 hover:bg-amber-600 rounded-lg text-[11px] font-black text-neutral-950 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>메인 화면 보기 (데시보드 닫기)</span>
          </button>
        </div>
      </div>

      {/* Admin Panel Body Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side menu tabs */}
        <div className="w-64 bg-neutral-800 border-r border-neutral-700 shrink-0 overflow-y-auto hidden md:flex flex-col p-4 justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-500 tracking-wider font-mono">DASHBOARD MODULES</span>
            
            {[
              { id: 'config', name: '✏️ 홈 화면 설정 (전경/상징)' },
              { id: 'overview', name: 'ℹ️ 연구학교 개요 설정' },
              { id: 'infographic', name: '📊 연구 체체 인포그래픽' },
              { id: 'researchTasks', name: '🎯 연구과제 세부내용' },
              { id: 'reports', name: '📄 계획서 및 보고서 PDF' },
              { id: 'lessons', name: '🏫 수업나눔공개 자료' },
              { id: 'gallery', name: '🖼️ 에듀 현장갤러리 사진' },
              { id: 'outcomes', name: '📈 성과지표 정량/피드백' },
              { id: 'community', name: '💬 소통공간 게시판 관리' },
              { id: 'backup', name: '💾 마스터 데이터 백업/복원' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all block cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-neutral-950 font-black shadow-xs'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700/55'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-neutral-900 p-3 rounded-lg border border-neutral-800 text-[11px] text-neutral-500">
            <p className="font-bold text-neutral-400">데이터 백업 지원</p>
            <p className="mt-1 leading-tight text-[10px]">브라우저 캐시 소멸 대비 수시 백업 백업(.json) 권장합니다.</p>
          </div>
        </div>

        {/* Right Active configuration contents workspace */}
        <div className="flex-1 overflow-y-auto bg-neutral-50 p-6">
          
          {/* Mobil quick tab selector */}
          <div className="md:hidden flex gap-1.5 overflow-x-auto pb-4 border-b border-neutral-200 mb-6 font-semibold text-xs select-none">
            {[
              { id: 'config', name: '홈 화면' },
              { id: 'overview', name: '연구 개요' },
              { id: 'infographic', name: '인포그래픽' },
              { id: 'researchTasks', name: '연구과제' },
              { id: 'reports', name: '보고서' },
              { id: 'lessons', name: '수업나눔' },
              { id: 'gallery', name: '갤러리' },
              { id: 'outcomes', name: '성과지표' },
              { id: 'community', name: '소통관리' },
              { id: 'backup', name: '백업' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-md shrink-0 block cursor-pointer transition-colors ${
                  activeTab === tab.id ? 'bg-amber-500 text-neutral-950 font-bold' : 'bg-neutral-200 text-neutral-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-xs max-w-4xl mx-auto">
            
            {/* 1. CONFIG MODULE */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 select-text">학교 정보 및 홈 세부내용 일괄 수정</h2>
                  <p className="text-xs text-neutral-500">포털 상하단의 학교 타이틀 교명, 홈 비디오, 목적, 그리고 하단 푸터 세부 사항을 일괄 오버라이드합니다.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                  <span className="font-extrabold text-neutral-800 text-xs sm:col-span-2 block">🏫 학교 기본 네이밍 정보</span>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">학교 한글 교명</label>
                    <input
                      type="text"
                      value={state.config.schoolName}
                      onChange={(e) => updateConfig('schoolName', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">학교 영문 교명</label>
                    <input
                      type="text"
                      value={state.config.schoolNameEng}
                      onChange={(e) => updateConfig('schoolNameEng', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">한글 연구학교 배지 표기</label>
                    <input
                      type="text"
                      value={state.config.subLabelKor}
                      onChange={(e) => updateConfig('subLabelKor', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">영문 연구학교 배지 표기</label>
                    <input
                      type="text"
                      value={state.config.subLabelEng}
                      onChange={(e) => updateConfig('subLabelEng', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                  <span className="font-extrabold text-neutral-800 text-xs sm:col-span-2 block">🖥️ 연구학교 및 비디오 미디어 세팅</span>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">운영 연구 주제명</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchName}
                      onChange={(e) => updateBasicInfoFields('researchName', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">연구 운영 기간</label>
                    <input
                      type="text"
                      value={state.basicInfo.duration}
                      onChange={(e) => updateBasicInfoFields('duration', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">연구 대상 교과군</label>
                    <input
                      type="text"
                      value={state.basicInfo.subject}
                      onChange={(e) => updateBasicInfoFields('subject', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700 font-sans">온라인 외부 비디오 주소 (유튜브 등)</label>
                    <input
                      type="text"
                      value={(state.basicInfo.videoUrl.startsWith('data:video') || state.basicInfo.videoUrl.startsWith('indexeddb://')) ? '' : state.basicInfo.videoUrl}
                      onChange={(e) => updateBasicInfoFields('videoUrl', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-blue-700 font-semibold"
                      placeholder="예시: https://www.youtube.com/watch?v=gW37oOicb68"
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-bold text-neutral-700 font-sans block">또는 직접 다양한 형식의 동영상 파일 삽입하기 (MP4, WebM, OGG 등)</label>
                    <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-neutral-200">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const { storeAsset } = await import('../lib/idb');
                            await storeAsset('custom_video_payload', file);
                            updateBasicInfoFields('videoUrl', 'indexeddb://custom_video_payload');
                            alert('동영상이 브라우저 내장 IndexedDB 안전 스토리지에 업로드 및 동기화되었습니다! 전송 용량 문제나 브라우저 다운 에러가 완전 해결되었습니다.');
                          } catch (err) {
                            console.error('Video IDB store error: ', err);
                            alert('비디오 저장 실패: ' + err);
                          }
                        }}
                        className="text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-[11px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {state.basicInfo.videoUrl && (state.basicInfo.videoUrl.startsWith('data:video/') || state.basicInfo.videoUrl === 'indexeddb://custom_video_payload') && (
                        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-black">
                          <span>✔️ 비디오 파일 삽입완료 (로컬 재생)</span>
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                const { deleteAsset } = await import('../lib/idb');
                                await deleteAsset('custom_video_payload');
                              } catch (e) {}
                              updateBasicInfoFields('videoUrl', 'https://www.youtube.com/embed/gW37oOicb68');
                            }}
                            className="ml-2 text-red-500 underline text-[9px] hover:text-red-700 bg-transparent border-0 cursor-pointer"
                          >
                            초기화
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700 font-sans">비디오 하단 텍스트 설명 및 성찰문</label>
                    <textarea
                      rows={2}
                      value={state.basicInfo.videoDesc}
                      onChange={(e) => updateBasicInfoFields('videoDesc', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* 🏫 학교 전경 사진 및 학교 상징 일괄 수정 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-amber-50/45 p-4 rounded-xl border border-amber-200/65">
                  <div className="space-y-2">
                    <label className="font-extrabold text-neutral-800 block">🏫 학교 전경 사진 첨부 및 수립</label>
                    <p className="text-[10px] text-neutral-500 leading-tight">메인 소개화면 우측 공간에 자문형 카드 대신에 직접 촬영하신 실제 학교 전경 사진을 영속적으로 고정할 수 있습니다.</p>
                    <div className="flex gap-4 items-center pt-1">
                      {state.basicInfo.schoolImage ? (
                        <div className="relative w-24 h-16 bg-neutral-100 rounded border overflow-hidden shrink-0 shadow-xs">
                          <img src={state.basicInfo.schoolImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          <button
                            type="button"
                            onClick={() => updateBasicInfoFields('schoolImage', '')}
                            className="absolute inset-0 bg-black/60 hover:bg-black/80 flex items-center justify-center text-white text-[9px] font-black opacity-0 hover:opacity-100 transition-opacity"
                          >
                            제거
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-16 bg-neutral-100 rounded border border-dashed flex items-center justify-center shrink-0 text-[10px] text-neutral-400 font-bold">
                          미선택 (기본 벡터)
                        </div>
                      )}
                      
                      <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-[11px] font-bold block cursor-pointer select-none">
                        <span>전경 사진 파일 첨부</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, (base64) => updateBasicInfoFields('schoolImage', base64))}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="font-extrabold text-neutral-800 block">🌸 학교 상징 수정보완 (School Symbols)</label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-600 block">교목 (Timber)</label>
                        <input
                          type="text"
                          value={state.basicInfo.symbolTimber || ''}
                          onChange={(e) => updateBasicInfoFields('symbolTimber', e.target.value)}
                          placeholder="느티나무 (포용, 강인한 건강)"
                          className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-600 block">교화 (Flower)</label>
                        <input
                          type="text"
                          value={state.basicInfo.symbolFlower || ''}
                          onChange={(e) => updateBasicInfoFields('symbolFlower', e.target.value)}
                          placeholder="장미 (열정, 아름다운 품격)"
                          className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-600 block">교색 (Color)</label>
                        <input
                          type="text"
                          value={state.basicInfo.symbolColor || ''}
                          onChange={(e) => updateBasicInfoFields('symbolColor', e.target.value)}
                          placeholder="녹색 (성장, 무한한 희망)"
                          className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-600 block">교훈 (Motto)</label>
                        <input
                          type="text"
                          value={state.basicInfo.symbolMotto || ''}
                          onChange={(e) => updateBasicInfoFields('symbolMotto', e.target.value)}
                          placeholder="바르고 슬기롭게 건강하게"
                          className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* DYNAMIC IB MISSION & SCHOOL INTRO */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <label className="font-bold text-neutral-700">빛가람초 공식 학교 소개글</label>
                    <textarea
                      rows={4}
                      value={state.basicInfo.schoolIntro}
                      onChange={(e) => updateBasicInfoFields('schoolIntro', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold text-neutral-700">IB PYP 미션 기구 성명서 (Mission Statement)</label>
                    <textarea
                      rows={4}
                      value={state.basicInfo.ibMission}
                      onChange={(e) => updateBasicInfoFields('ibMission', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* EDITABLE SCHOOL FOOTER */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                  <span className="font-extrabold text-neutral-800 text-xs sm:col-span-2 block">👣 하차단 푸터 (Footer) 행정 주소 및 연락망 정보</span>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-700">단체 소개 표제글</label>
                    <input
                      type="text"
                      value={state.footer.intro}
                      onChange={(e) => handleUpdateFooter('intro', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">학교 행정소지 주소</label>
                    <input
                      type="text"
                      value={state.footer.address}
                      onChange={(e) => handleUpdateFooter('address', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">행정 연락 유선망 전화번호</label>
                    <input
                      type="text"
                      value={state.footer.phone}
                      onChange={(e) => handleUpdateFooter('phone', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">행정 전자 우편 이메일</label>
                    <input
                      type="text"
                      value={state.footer.email}
                      onChange={(e) => handleUpdateFooter('email', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">저작권 공식 라이센스 권장 대지명</label>
                    <input
                      type="text"
                      value={state.footer.copyright}
                      onChange={(e) => handleUpdateFooter('copyright', e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                </div>

                {/* LOGO IMAGE ASSETS UPLOADS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-neutral-100 text-xs">
                  
                  {/* School symbol logo replace */}
                  <div className="p-4 bg-neutral-50 rounded-xl space-y-3 border border-neutral-200/50">
                    <span className="font-extrabold text-neutral-800 block">1. 빛가람초등학교 상징 로고 대체</span>
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-white p-2 rounded-lg border flex items-center justify-center shrink-0" dangerouslySetInnerHTML={{ __html: state.config.schoolLogo }} />
                      <div className="space-y-1">
                        <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold block text-center cursor-pointer">
                          파일 선택 업로드
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, (base64) => {
                              updateConfig('schoolLogo', `<img src="${base64}" class="w-12 h-12 rounded object-contain"/>`);
                              alert('학교로고가 성공적으로 업로드 변경되었습니다.');
                            })}
                          />
                        </label>
                        <span className="text-[10px] text-neutral-400">PNG, JPG, SVG 이미지 지원 (자동 Base64 변환)</span>
                      </div>
                    </div>
                  </div>

                  {/* IB logo replace */}
                  <div className="p-4 bg-neutral-50 rounded-xl space-y-3 border border-neutral-200/50">
                    <span className="font-extrabold text-neutral-800 block">2. IB 기구 PYP 로고 대체</span>
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 bg-white p-2 rounded-lg border flex items-center justify-center shrink-0" dangerouslySetInnerHTML={{ __html: state.config.ibLogo }} />
                      <div className="space-y-1">
                        <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold block text-center cursor-pointer">
                          파일 선택 업로드
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, (base64) => {
                              updateConfig('ibLogo', `<img src="${base64}" class="w-12 h-12 rounded object-contain"/>`);
                              alert('IB 로고가 업로드 완료되었습니다.');
                            })}
                          />
                        </label>
                        <span className="text-[10px] text-neutral-400">PNG, JPG, SVG 지원</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Save Confirmation Button */}
                <div className="pt-4 border-t border-neutral-200 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      alert('💾 [수정 완료] 학교 기본 정보 및 홈 화면 설정 변경 사항이 성공적으로 안전 저장되었습니다!');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <Save className="w-4 h-4 text-white" />
                    <span>설정 저장 및 수정 완료하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1.1. OVERVIEW DEDICATED MODULE */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 font-sans">연구학교 개요 및 추진방향 정밀 수정</h2>
                  <p className="text-xs text-neutral-500">연구 섹션의 마스터 개요 탭에 실시간 연동되는 주제명, 운영기간, 대상, 자문정보, 추진방향을 오버라이딩합니다.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-800 block">운영 연구 주제명 (Research Theme)</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchName}
                      onChange={(e) => updateBasicInfoFields('researchName', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-800 block">연구 운영 기간</label>
                    <input
                      type="text"
                      value={state.basicInfo.duration}
                      onChange={(e) => updateBasicInfoFields('duration', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-800 block">연구 대상 학급군 / 교과군</label>
                    <input
                      type="text"
                      value={state.basicInfo.subject}
                      onChange={(e) => updateBasicInfoFields('subject', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-800 block">연구 대상 연도 및 구체적인 대상 학년군</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchTarget || ''}
                      onChange={(e) => updateBasicInfoFields('researchTarget', e.target.value)}
                      placeholder="예시: 빛가람초등학교 전교생 (1~6학년 총 24개 학급)"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-neutral-800 block">운영 자문 기관 목록</label>
                    <textarea
                      rows={2}
                      value={state.basicInfo.researchAdvisors || ''}
                      onChange={(e) => updateBasicInfoFields('researchAdvisors', e.target.value)}
                      placeholder="예시: 전라남도교육청 IB PYP 연구운영국, 한국지식바칼로레아 학회, 나주 혁신도시 교육지원지구 자치협의회"
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs bg-blue-50/50 p-4 rounded-xl border border-blue-150">
                  <span className="font-extrabold text-blue-900 block font-sans">✅ 연구 추진 방향 3개조 핵심 전략 (Bullet Points)</span>
                  <p className="text-[10px] text-blue-800/85">연구과제 개요에서 체크마크와 함께 보여지는 전략 어구를 교차 수정합니다.</p>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">핵심 전략 추진방향 1</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchDir1 || ''}
                      onChange={(e) => updateBasicInfoFields('researchDir1', e.target.value)}
                      placeholder="교원 자율 연수 체계 구축 (연간 120시간 필수 교실 탐구 매개)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">핵심 전략 추진방향 2</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchDir2 || ''}
                      onChange={(e) => updateBasicInfoFields('researchDir2', e.target.value)}
                      placeholder="학년 교육과정 재설계 (학년당 연간 4종 우수 UOI 완전 적용성 확보)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 font-sans">핵심 전략 추진방향 3</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchDir3 || ''}
                      onChange={(e) => updateBasicInfoFields('researchDir3', e.target.value)}
                      placeholder="학생 주도 학습동행 나눔제 및 과정중심 성장평가 환류"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* 🏷️ 연구과제 대주제 카테고리 설정 */}
                <div className="grid grid-cols-1 gap-4 text-xs bg-amber-50/50 p-4 rounded-xl border border-amber-150">
                  <span className="font-extrabold text-amber-900 block font-sans">🏷️ 연구과제 대주제 설정 (3가지 카테고리)</span>
                  <p className="text-[10px] text-amber-800/85">세부 과제 확인 페이지 및 등록 시 대분류로 매핑되는 대주제 명칭을 커스터마이징합니다.</p>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">대주제 1 카테고리 명칭</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchTheme1 || ''}
                      onChange={(e) => updateBasicInfoFields('researchTheme1', e.target.value)}
                      placeholder="주제 1. 교사 전문성 및 UOI 설계 혁신 (PLC & Alignment)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">대주제 2 카테고리 명칭</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchTheme2 || ''}
                      onChange={(e) => updateBasicInfoFields('researchTheme2', e.target.value)}
                      placeholder="주제 2. 학생 주도성 기반 배움마당 (Agency & Practice)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">대주제 3 카테고리 명칭</label>
                    <input
                      type="text"
                      value={state.basicInfo.researchTheme3 || ''}
                      onChange={(e) => updateBasicInfoFields('researchTheme3', e.target.value)}
                      placeholder="주제 3. 배움 성장 평가와 나눔 협력 (Assessment & Sharing)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* 🌎 초학문적 주제 (Transdisciplinary Themes) 설정 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-indigo-50/50 p-4 rounded-xl border border-indigo-150">
                  <span className="font-extrabold text-indigo-900 block font-sans sm:col-span-2">🌎 초학문적 주제 명칭 설정 (6가지 카테고리)</span>
                  <p className="text-[10px] text-indigo-800/85 sm:col-span-2">수업나눔공개자료와 현장갤러리 사진에서 대분류 필터 및 등록 시 보여지는 6가지 필수 탐구 대주제 명칭을 구성합니다.</p>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">초학문적 주제 1</label>
                    <input
                      type="text"
                      value={state.basicInfo.transTheme1 || ''}
                      onChange={(e) => updateBasicInfoFields('transTheme1', e.target.value)}
                      placeholder="우리는 누구인가 (Who We Are)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">초학문적 주제 2</label>
                    <input
                      type="text"
                      value={state.basicInfo.transTheme2 || ''}
                      onChange={(e) => updateBasicInfoFields('transTheme2', e.target.value)}
                      placeholder="세계가 돌아가는 방식 (How the World Works)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">초학문적 주제 3</label>
                    <input
                      type="text"
                      value={state.basicInfo.transTheme3 || ''}
                      onChange={(e) => updateBasicInfoFields('transTheme3', e.target.value)}
                      placeholder="우리가 속한 공간과 시간 (Where We Are in Place and Time)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">초학문적 주제 4</label>
                    <input
                      type="text"
                      value={state.basicInfo.transTheme4 || ''}
                      onChange={(e) => updateBasicInfoFields('transTheme4', e.target.value)}
                      placeholder="우리 자신을 표현하는 방법 (How We Express Ourselves)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">초학문적 주제 5</label>
                    <input
                      type="text"
                      value={state.basicInfo.transTheme5 || ''}
                      onChange={(e) => updateBasicInfoFields('transTheme5', e.target.value)}
                      placeholder="우리 자신을 조직하는 방식 (How We Organize Ourselves)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700">초학문적 주제 6</label>
                    <input
                      type="text"
                      value={state.basicInfo.transTheme6 || ''}
                      onChange={(e) => updateBasicInfoFields('transTheme6', e.target.value)}
                      placeholder="우리 모두의 지구 (Sharing the Planet)"
                      className="w-full px-3 py-2 bg-white border border-neutral-250 rounded-lg text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Save Confirmation Button */}
                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      alert('💾 [수정 완료] 연구학교 개요 및 추진 방향 설정 변경 사항이 성공적으로 안전 저장되었습니다!');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <Save className="w-4 h-4 text-white" />
                    <span>설정 저장 및 수정 완료하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1.2. INFOGRAPHIC MODULE */}
            {activeTab === 'infographic' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950 font-sans">연구 체계 인포그래픽(Infographic) 고정 변경 및 3단계 흐름 수정</h2>
                  <p className="text-xs text-neutral-500">포털 연구 체계 인포그래픽 탭에서 제시되는 메인 흐름 인포그래픽 이미지, 타이틀 및 각 단계별 상세 텍스트 내용을 자유롭게 오버레이합니다.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 bg-neutral-50 p-5 rounded-xl border border-neutral-150 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-800 block">인포그래픽 정렬망 표제 수정</label>
                    <input
                      type="text"
                      value={state.infographic.title}
                      onChange={(e) => updateInfographicTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-900 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* 🗺️ 인포그래픽 단계별 실행 정보 수정 */}
                  <div className="space-y-4 pt-2 border-t border-neutral-200">
                    <span className="font-extrabold text-neutral-900 block font-sans">🗺️ 인포그래픽 3단계 세부 흐름 수정 (가로 카드 실시간 반영)</span>
                    <p className="text-[10px] text-neutral-500 -mt-2 leading-relaxed">
                      가로 구조로 간소화된 인포그래픽 흐름도에 직접 주입되는 단계(e.g. 01 / Plan), 흐름 타이틀, 상세 설명을 원격 수정할 수 있습니다. 
                      스크롤 없이 한 화면에 담기도록 내용을 가급적 간결하게 적어주시는 것을 적극 가이드합니다.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                      {state.infographic.steps.map((stepItem, idx) => (
                        <div key={idx} className="p-3.5 bg-white rounded-xl border border-neutral-200 shadow-2xs space-y-3">
                          <div className="flex items-center gap-1.5 border-b border-neutral-100 pb-2 mb-1">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-extrabold text-neutral-800 text-[11px] font-sans">구간 {idx + 1} 설정</span>
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-neutral-750 text-[10px] block">구간 기호 (숫자/이름)</label>
                            <input
                              type="text"
                              value={stepItem.step}
                              onChange={(e) => updateInfographicStep(idx, 'step', e.target.value)}
                              placeholder="e.g. 01 / Plan"
                              className="w-full px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-800 focus:bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-neutral-750 text-[10px] block">프로젝트 타이틀 (Title)</label>
                            <input
                              type="text"
                              value={stepItem.title}
                              onChange={(e) => updateInfographicStep(idx, 'title', e.target.value)}
                              placeholder="e.g. Plan (통합 설계 주기)"
                              className="w-full px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-extrabold text-neutral-950 focus:bg-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-bold text-neutral-755 text-[10px] block">상세 개요 (최대 2줄 권장)</label>
                            <textarea
                              rows={3}
                              value={stepItem.desc}
                              onChange={(e) => updateInfographicStep(idx, 'desc', e.target.value)}
                              placeholder="내용을 간략하게 작성해 주십시오."
                              className="w-full px-2.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg text-[10.5px] font-semibold text-neutral-600 leading-normal focus:bg-white"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-neutral-200 pt-4 mt-2">
                    <label className="font-extrabold text-neutral-800 block">🖼️ 또는 하이퍼 미디어 직접 제작 이미지 탑재 (옵션)</label>
                    <p className="text-[10px] text-neutral-500">실재하는 PPT나 캡처형 다이어그램을 등록하려면 아래를 이용합니다. 등록하지 않으면 위의 3대 가로형 텍스트 그래프가 우아하게 렌더링됩니다.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2">
                      {state.infographic.imageBase64 ? (
                        <div className="flex flex-col items-center gap-2 max-w-sm shrink-0">
                          <div className="relative bg-white p-2 rounded-xl border shadow-xs overflow-hidden">
                            <img src={state.infographic.imageBase64} className="max-h-[120px] rounded object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('커스텀 업로드 인포그래픽 이미지를 제거하고 기본 가로 반응형 플로우 형태로 복원하시겠습니까?')) {
                                updateInfographicImage('');
                              }
                            }}
                            className="w-full px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-lg text-[10.5px] font-black cursor-pointer transition-colors text-center"
                          >
                            ❌ 인포그래픽 이미지 제거 (초기화)
                          </button>
                        </div>
                      ) : (
                        <div className="w-[180px] h-[100px] bg-neutral-100 rounded-xl border border-dashed flex flex-col items-center justify-center shrink-0 text-center text-[10px] text-neutral-400 font-bold p-3">
                          <span>지정된 이미지 없음</span>
                          <span className="text-[9px] text-neutral-400/80 font-medium font-sans mt-0.5">(기본 가로 반응형 Flow 작동)</span>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <label className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg text-xs font-bold block cursor-pointer select-none text-center shadow-xs">
                          📁 실제 인포그래픽 등록
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, (base64) => {
                              updateInfographicImage(base64);
                              alert('인포그래픽 연구체계망 이미지가 반영되었습니다.');
                            })}
                            className="hidden"
                          />
                        </label>
                        <ul className="text-[9.5px] text-neutral-400 leading-tight list-disc pl-3">
                          <li>종횡비 무관히 등록 가능하며, 가급적 선명한 가로 레이아웃 이미지를 권장합니다.</li>
                          <li>등록 해제 시 내장된 가로 반응형 플로우 모델이 자동 연계 복구됩니다.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Confirmation Button */}
                <div className="pt-4 border-t border-neutral-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      alert('💾 [수정 완료] 연구 체계 인포그래픽 변경 사항이 성공적으로 안전 저장되었습니다!');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] select-none"
                  >
                    <Save className="w-4 h-4 text-white" />
                    <span>설정 저장 및 수정 완료하기</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. REPORTS MODULE */}
            {activeTab === 'reports' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">연구 보고서 및 운영계획 파일 등록국</h2>
                  <p className="text-xs text-neutral-500">PDF 원본 파일명 및 모의 본문 구조를 추가하여 웹 뷰어와 연동시킵니다.</p>
                </div>

                {/* Listing of current reports */}
                <div className="space-y-3">
                  <span className="font-bold text-neutral-400 uppercase text-[10px] font-mono block">현재 기재된 보고서 목록</span>
                  <div className="space-y-1.5">
                    {state.reports.map(rep => (
                      <div key={rep.id} className="flex justify-between items-center text-xs bg-neutral-50 p-2 px-3 rounded-lg border border-neutral-200/50">
                        <div className="flex gap-2 items-center truncate">
                          <span className="font-bold text-blue-700 bg-blue-50 px-1 py-0.5 rounded text-[10px] shrink-0">{rep.type === 'plan' ? '계획' : '최종'}</span>
                          <span className="font-semibold text-neutral-700 line-clamp-1">{rep.title}</span>
                          <span className="text-[10px] text-neutral-400 font-mono shrink-0">({rep.filename})</span>
                        </div>
                        <div className="flex gap-1.5 items-center shrink-0">
                          <button
                            onClick={() => handleStartEditReport(rep)}
                            className="text-blue-500 hover:text-blue-700 font-bold flex items-center justify-center p-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteReport(rep.id)}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center justify-center p-1.5 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            title="소거"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Creation form */}
                <form onSubmit={handleAddReport} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs">
                  <span className="font-bold text-neutral-800 text-xs block">📋 {editingReportId ? '연구 보고서 수정 편집 폼' : '새 연구 보고서 등록 폼'}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500">문서 종류</label>
                      <select
                        value={reportForm.type}
                        onChange={(e) => setReportForm({ ...reportForm, type: e.target.value as any })}
                        className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded"
                      >
                        <option value="plan">운영계획서</option>
                        <option value="mid">중간운영보고서</option>
                        <option value="final">최종성과보고서</option>
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="font-bold text-neutral-500">보고서 한글 제목</label>
                      <input
                        type="text"
                        required
                        value={reportForm.title}
                        onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                        placeholder="예: 2026학년도 하반기 보완 연구계획서"
                        className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500">PDF 모의 영문파일명</label>
                      <input
                        type="text"
                        required
                        value={reportForm.filename}
                        onChange={(e) => setReportForm({ ...reportForm, filename: e.target.value })}
                        placeholder="research_plan_second_half.pdf"
                        className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500">간력 설명</label>
                      <input
                        type="text"
                        value={reportForm.desc}
                        onChange={(e) => setReportForm({ ...reportForm, desc: e.target.value })}
                        placeholder="문서에 결부된 일련 사유를 짧게 명시하세요"
                        className="w-full px-2 py-1.5 bg-white border border-neutral-200 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 bg-neutral-100/50 p-2.5 rounded-lg border border-neutral-200">
                    <label className="font-extrabold text-neutral-650 block">📄 [선택] 실제 학술 원본 PDF 파일 업로드</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleImageUpload(e, (base64) => setReportForm({ ...reportForm, pdfBase64: base64 }))}
                      className="text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {reportForm.pdfBase64 && (
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-600 font-extrabold">
                        <span>✔️ 실제 PDF 파일 등록 완료</span>
                        <button
                          type="button"
                          onClick={() => setReportForm({ ...reportForm, pdfBase64: undefined })}
                          className="text-red-500 hover:text-red-700 underline bg-transparent border-0 cursor-pointer text-[9px]"
                        >
                          해제
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className={`flex-1 py-1.5 px-3 font-bold rounded text-xs transition-colors cursor-pointer ${
                        editingReportId ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {editingReportId ? '📝 수정 내용 일괄 업데이트' : '웹 문서 데이터 전파하기'}
                    </button>
                    {editingReportId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReportId(null);
                          setReportForm({
                            type: 'plan',
                            title: '',
                            desc: '',
                            filename: '',
                            pdfContentSim: '',
                            pdfBase64: ''
                          });
                        }}
                        className="px-3 bg-neutral-250 hover:bg-neutral-350 text-neutral-800 font-bold rounded text-xs cursor-pointer transition-colors"
                      >
                        수정 취소
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* 3. LESSONS MODULE */}
            {activeTab === 'lessons' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">공유 탐구 수업 계획서 (UOI) 편집관리</h2>
                  <p className="text-xs text-neutral-500">탐구 단원 계획, 중심 아이디어, 지도안 PDF 업로드를 일괄 조율합니다.</p>
                </div>

                <div className="space-y-3">
                  <span className="font-bold text-neutral-400 uppercase text-[10px] font-mono block">수록된 수업 및 자료 목록</span>
                  <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                    {state.lessons.map(les => (
                      <div key={les.id} className="flex justify-between items-center text-xs bg-neutral-50 p-2 px-3 rounded-lg border border-neutral-200/50">
                        <div className="flex gap-2 items-center truncate">
                          <span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.2 rounded text-[10px] shrink-0">{les.grade}</span>
                          <span className="font-bold text-neutral-800 truncate">{les.teacher} ({les.theme.split(' (')[0]})</span>
                        </div>
                        <div className="flex gap-1.5 items-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditLesson(les)}
                            className="text-blue-500 hover:text-blue-700 font-bold flex items-center justify-center p-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteLesson(les.id)}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center justify-center p-1.5 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to insert new lesson */}
                <form onSubmit={handleAddLesson} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs">
                  <span className="font-bold text-neutral-800 text-xs block">🎒 {editingLessonId ? 'UOI 탐구 카드 수정 편집' : '새 UOI 탐구 카드 성문화 작성'}</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-neutral-500">학년군</label>
                      <select
                        value={lessonForm.grade}
                        onChange={(e) => setLessonForm({ ...lessonForm, grade: e.target.value })}
                        className="w-full p-1 bg-white border border-neutral-200 rounded"
                      >
                        <option>1학년</option>
                        <option>2학년</option>
                        <option>3학년</option>
                        <option>4학년</option>
                        <option>5학년</option>
                        <option>6학년</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-neutral-500">탐구 지도교사명</label>
                      <input
                        type="text"
                        required
                        value={lessonForm.teacher}
                        onChange={(e) => setLessonForm({ ...lessonForm, teacher: e.target.value })}
                        placeholder="예: 홍길동 교사"
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-neutral-500">수업 차시 (Period)</label>
                      <input
                        type="text"
                        value={lessonForm.period}
                        onChange={(e) => setLessonForm({ ...lessonForm, period: e.target.value })}
                        placeholder="예: 3/6차시"
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-500">초학문적 주제 대분류</label>
                    <select
                      value={lessonForm.theme}
                      onChange={(e) => setLessonForm({ ...lessonForm, theme: e.target.value })}
                      className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                    >
                      {[
                        state.basicInfo.transTheme1 || '우리는 누구인가 (Who We Are)',
                        state.basicInfo.transTheme2 || '세계가 돌아가는 방식 (How the World Works)',
                        state.basicInfo.transTheme3 || '우리가 속한 공간과 시간 (Where We Are in Place and Time)',
                        state.basicInfo.transTheme4 || '우리 자신을 표현하는 방법 (How We Express Ourselves)',
                        state.basicInfo.transTheme5 || '우리 자신을 조직하는 방식 (How We Organize Ourselves)',
                        state.basicInfo.transTheme6 || '우리 모두의 지구 (Sharing the Planet)',
                      ].map((themeName) => (
                        <option key={themeName} value={themeName}>{themeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-500">탐구 질문</label>
                    <input
                      type="text"
                      required
                      value={lessonForm.inquiryQuestion}
                      onChange={(e) => setLessonForm({ ...lessonForm, inquiryQuestion: e.target.value })}
                      placeholder="예: 생물종 보호를 위한 우리의 역할은 무엇일까?"
                      className="w-full p-1 bg-white border border-neutral-200 rounded font-semibold text-xs text-neutral-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500">중심 아이디어 (Central Idea)</label>
                      <input
                        type="text"
                        required
                        value={lessonForm.centralIdea}
                        onChange={(e) => setLessonForm({ ...lessonForm, centralIdea: e.target.value })}
                        placeholder="예: 자연의 아름다운 상호 연계는 보존을 통해 오래오래 발달한다"
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500">기타 개념(Other Concepts)</label>
                      <input
                        type="text"
                        value={lessonForm.concepts}
                        onChange={(e) => setLessonForm({ ...lessonForm, concepts: e.target.value })}
                        placeholder="예: 연결성, 책임"
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 font-sans">수업 개요 요약 (Outline)</label>
                      <textarea
                        rows={2}
                        value={lessonForm.description}
                        onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                        placeholder="실생활 연계 실험 과정을 약식 서술하세요."
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-500 font-sans">탐구 사이클 단계(Inquiry Cycle)</label>
                      <textarea
                        rows={2}
                        value={lessonForm.direction}
                        onChange={(e) => setLessonForm({ ...lessonForm, direction: e.target.value })}
                        placeholder="1단계..., 2단계..., 3단계... 형태로 줄 바꿈 기입"
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      />
                    </div>
                  </div>

                   <div className="space-y-1 bg-neutral-150/55 p-2.5 rounded-lg border border-neutral-200">
                    <label className="font-extrabold text-neutral-650 block">📄 [선택] 수업나눔 지도안 실제 PDF 원본 탑재</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleImageUpload(e, (base64) => setLessonForm({ ...lessonForm, pdfBase64: base64 }))}
                      className="text-xs text-neutral-500 file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[11px] file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                    />
                    {lessonForm.pdfBase64 && (
                      <div className="flex items-center gap-1.5 mt-1 text-[10px] text-emerald-600 font-extrabold">
                        <span>✔️ 실제 PDF 지도안 업로드 완료</span>
                        <button
                          type="button"
                          onClick={() => setLessonForm({ ...lessonForm, pdfBase64: undefined })}
                          className="text-red-500 hover:text-red-700 underline bg-transparent border-0 cursor-pointer text-[9px]"
                        >
                          초기화
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className={`flex-1 py-1.5 px-3 font-bold rounded text-xs transition-colors cursor-pointer ${
                        editingLessonId ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950' : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {editingLessonId ? '📝 수정 변경 내용 저장하기' : '수업 자료 데이터 반영 전파'}
                    </button>
                    {editingLessonId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLessonId(null);
                          setLessonForm({
                            grade: '3학년',
                            theme: '우리는 누구인가 (Who We Are)',
                            teacher: '',
                            inquiryQuestion: '',
                            centralIdea: '',
                            concepts: '',
                            description: '',
                            direction: '',
                            lessonPlanSim: '',
                            pdfBase64: '',
                            image: '🎒',
                            isOpenLesson: true,
                            materialType: '지도안',
                            period: ''
                          });
                        }}
                        className="px-3 bg-neutral-250 hover:bg-neutral-350 text-neutral-800 font-bold rounded text-xs cursor-pointer transition-colors"
                      >
                        수정 취소
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* 4. GALLERY MODULE */}
            {activeTab === 'gallery' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">교육활동 현장 실사 사진첩 (Gallery) 관리</h2>
                  <p className="text-xs text-neutral-500">학교 배움 사진을 직접 업로드해 실재감 넘치는 갤러리를 보급합니다.</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-neutral-400 uppercase text-[10px] font-mono block">현재 업로드 갤러리 리스트</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {state.gallery.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/60 p-2">
                        <div className="flex gap-2 items-center truncate">
                          {item.images.length > 0 && <img src={item.images[0]} className="w-8 h-8 rounded object-cover shrink-0" referrerPolicy="no-referrer" />}
                          <span className="font-bold text-neutral-700 truncate">{item.title}</span>
                        </div>
                        <div className="flex gap-1.5 items-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditGallery(item)}
                            className="text-blue-500 hover:text-blue-700 font-bold flex items-center justify-center p-1.5 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                            title="수정"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteGalleryItem(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold flex items-center justify-center p-1.5 hover:bg-red-50 rounded cursor-pointer transition-colors"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upload formulation card */}
                <form onSubmit={handleAddGalleryItem} className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3 text-xs">
                  <span className="font-bold text-neutral-800 text-xs block">📷 {editingGalleryId ? '현장 사진 정보 수정 편집' : '현장 사진 업로드 및 정보 수사'}</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="font-bold text-neutral-500">활동 사진 타이틀</label>
                      <input
                        type="text"
                        required
                        value={galleryForm.title}
                        onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                        placeholder="예: 4학년 탐구 역사관 방문기"
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-neutral-500">대상 학년</label>
                      <select
                        value={galleryForm.grade}
                        onChange={(e) => setGalleryForm({ ...galleryForm, grade: e.target.value })}
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      >
                        <option>1학년</option>
                        <option>2학년</option>
                        <option>3학년</option>
                        <option>4학년</option>
                        <option>5학년</option>
                        <option>6학년</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-bold text-neutral-500">체계 분류유형</label>
                      <select
                        value={galleryForm.category}
                        onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                        className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                      >
                        <option>학습</option>
                        <option>Action</option>
                        <option>Portfolio</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-neutral-500">결부 탐구 대분류 주제</label>
                    <select
                      value={galleryForm.theme}
                      onChange={(e) => setGalleryForm({ ...galleryForm, theme: e.target.value })}
                      className="w-full p-1 bg-white border border-neutral-200 rounded text-xs text-neutral-600"
                    >
                      {[
                        state.basicInfo.transTheme1 || '우리는 누구인가 (Who We Are)',
                        state.basicInfo.transTheme2 || '세계가 돌아가는 방식 (How the World Works)',
                        state.basicInfo.transTheme3 || '우리가 속한 공간과 시간 (Where We Are in Place and Time)',
                        state.basicInfo.transTheme4 || '우리 자신을 표현하는 방법 (How We Express Ourselves)',
                        state.basicInfo.transTheme5 || '우리 자신을 조직하는 방식 (How We Organize Ourselves)',
                        state.basicInfo.transTheme6 || '우리 모두의 지구 (Sharing the Planet)',
                      ].map((themeName) => (
                        <option key={themeName} value={themeName}>{themeName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 font-sans">
                    <label className="font-bold text-neutral-500">배움 과정 상세 묘사</label>
                    <textarea
                      rows={2}
                      value={galleryForm.description}
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                      placeholder="활동의 교육적 함의를 친근한 성찰 어조로 구성하여 학부모님들께 공유하세요..."
                      className="w-full p-1 bg-white border border-neutral-200 rounded text-xs"
                    />
                  </div>

                  {/* Multiple image upload interface simulation (drag/drop and standard inputs) */}
                  <div className="p-3 bg-white border border-neutral-200 rounded-lg space-y-2">
                    <label className="font-bold text-neutral-600 block">🖼️ 현장 실사 사진 선택 추가 (드래그앤드롭 보급)</label>
                    <div className="flex items-center gap-3">
                      <label className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-900 text-white rounded text-[11px] font-bold block text-center cursor-pointer flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" />
                        <span>사진 파일 골라 업로드</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAddGalleryImage}
                        />
                      </label>
                      <span className="text-[10px] text-neutral-400">현재 선택 성정된 사진 개수: <strong>{galleryUploadedImages.length}장</strong></span>
                    </div>

                    {/* Pre-uploaded base64 visual gallery checks */}
                    {galleryUploadedImages.length > 0 && (
                      <div className="flex gap-2 pt-2 border-t border-neutral-100 flex-wrap">
                        {galleryUploadedImages.map((img, idx) => (
                          <div key={idx} className="relative w-12 h-10 border rounded overflow-hidden group">
                            <img src={img} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setGalleryUploadedImages(prev => prev.filter((_,i) => i !== idx))}
                              className="absolute inset-0 bg-black/60 text-white font-extrabold text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="삭제"
                            >
                              제거
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* PDF Portfolio Upload space */}
                  <div className="p-3 bg-red-50/50 border border-red-100 rounded-lg space-y-2">
                    <label className="font-bold text-red-800 block">📄 [선택] 실제 PDF 포트폴리오/보고서 원본 탑재</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label className="px-3 py-1.5 bg-red-650 hover:bg-red-750 text-white rounded text-[11px] font-bold block text-center cursor-pointer flex items-center gap-1 shrink-0 w-fit">
                        <Upload className="w-3.5 h-3.5" />
                        <span>PDF 파일 선택</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(e, (base64) => {
                                setGalleryForm(prev => ({
                                  ...prev,
                                  pdfBase64: base64,
                                  files: [file.name]
                                }));
                              });
                            }
                          }}
                        />
                      </label>
                      <div className="text-xs">
                        {galleryForm.pdfBase64 ? (
                          <div className="flex items-center gap-2 text-emerald-700 font-bold">
                            <span>✔️ 업로드 완료: {galleryForm.files?.[0] || 'portfolio.pdf'}</span>
                            <button
                              type="button"
                              onClick={() => setGalleryForm(prev => ({ ...prev, pdfBase64: '', files: [] }))}
                              className="text-red-500 hover:text-red-700 underline text-[10.5px]"
                            >
                              제거
                            </button>
                          </div>
                        ) : (
                          <span className="text-neutral-500 text-[11px]">* PDF 포트폴리오 파일(학습산출물 등)을 탑재할 수 있습니다.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className={`flex-1 py-1.5 px-3 font-bold rounded text-xs transition-colors cursor-pointer ${
                        editingGalleryId ? 'bg-amber-500 hover:bg-amber-600 text-neutral-950' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {editingGalleryId ? '📝 갤러리 수정 정보 저장' : '사진 갤러리 게시하기'}
                    </button>
                    {editingGalleryId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingGalleryId(null);
                          setGalleryForm({
                            title: '',
                            grade: '5학년',
                            category: '학습',
                            theme: '세계가 돌아가는 방식 (How the World Works)',
                            description: '',
                            files: [],
                            pdfBase64: '',
                            pdfContentSim: ''
                          });
                          setGalleryUploadedImages([]);
                        }}
                        className="px-3 bg-neutral-250 hover:bg-neutral-350 text-neutral-800 font-bold rounded text-xs cursor-pointer transition-colors"
                      >
                        수정 취소
                      </button>
                    )}
                  </div>
                </form>

              </div>
            )}

            {/* 5. OUTCOMES MODULE */}
            {activeTab === 'outcomes' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">정량적 / 정성적 설문 만족도 수해 조정</h2>
                  <p className="text-xs text-neutral-500">연구 학교 운영 전후 만족도 전수 수치와 현장 공동체 성찰 피드백을 추가, 수정, 삭제해 완벽 관리합니다.</p>
                </div>

                {/* 1. Quantitative fields modifier */}
                <div className="space-y-4 bg-neutral-50 p-4 rounded-xl border border-neutral-150">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
                    <span className="font-extrabold text-neutral-800 text-xs block">📊 만족도 정량 성과 지표 조정</span>
                    <span className="text-[10px] text-neutral-400 font-mono">COUNT: {state.outcomes.quantitative?.length || 0}</span>
                  </div>

                  <div className="space-y-3">
                    {state.outcomes.quantitative?.map((met, idx) => (
                      <div key={idx} className="p-3 bg-white border border-neutral-200 rounded-xl space-y-2 text-xs">
                        <div className="flex gap-2">
                          <div className="space-y-1 flex-1">
                            <label className="text-[10px] font-bold text-neutral-400">지표 명명</label>
                            <input
                              type="text"
                              value={met.label}
                              onChange={(e) => handleUpdateQuantitativeMetric(idx, 'label', e.target.value)}
                              className="w-full p-1.5 bg-neutral-50 border border-neutral-200 rounded font-semibold text-neutral-800 text-xs"
                            />
                          </div>
                          <div className="space-y-1 w-20">
                            <label className="text-[10px] font-bold text-neutral-400">단위</label>
                            <input
                              type="text"
                              value={met.unit}
                              onChange={(e) => handleUpdateQuantitativeMetric(idx, 'unit', e.target.value)}
                              className="w-full p-1.5 bg-neutral-50 border border-neutral-200 rounded text-center text-xs"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 items-end justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-neutral-400 font-mono text-[10px]">Before:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={met.before}
                              onChange={(e) => handleUpdateQuantitativeMetric(idx, 'before', parseFloat(e.target.value) || 0)}
                              className="w-20 p-1 bg-neutral-50 border border-neutral-200 rounded font-semibold text-center text-xs text-neutral-600"
                            />
                            <span className="text-neutral-400 font-mono ml-2 text-[10px]">After:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={met.after}
                              onChange={(e) => handleUpdateQuantitativeMetric(idx, 'after', parseFloat(e.target.value) || 0)}
                              className="w-20 p-1 bg-neutral-50 border border-neutral-200 rounded font-semibold text-center text-xs text-blue-700"
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteQuantitativeMetric(idx)}
                            className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-[10px] rounded shrink-0 cursor-pointer"
                          >
                            지표 제거
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new Metric mini form */}
                  <div className="p-3 bg-neutral-100/80 border border-dashed border-neutral-300 rounded-xl space-y-2 text-xs">
                    <span className="font-bold text-neutral-700 block text-[11px]">+ 새 정량 성과 지표 즉시 추가 개설</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-450">지표 명명</label>
                        <input
                          type="text"
                          placeholder="예: 학생들의 학업적 성찰 역량"
                          value={newMetricForm.label}
                          onChange={(e) => setNewMetricForm({ ...newMetricForm, label: e.target.value })}
                          className="w-full p-1.5 bg-white border border-neutral-300 rounded text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-450">전(Before)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newMetricForm.before}
                            onChange={(e) => setNewMetricForm({ ...newMetricForm, before: parseFloat(e.target.value) || 0 })}
                            className="w-full p-1.5 bg-white border border-neutral-300 rounded text-center text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-450">후(After)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newMetricForm.after}
                            onChange={(e) => setNewMetricForm({ ...newMetricForm, after: parseFloat(e.target.value) || 0 })}
                            className="w-full p-1.5 bg-white border border-neutral-300 rounded text-center text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-450">단위</label>
                          <input
                            type="text"
                            value={newMetricForm.unit}
                            onChange={(e) => setNewMetricForm({ ...newMetricForm, unit: e.target.value })}
                            className="w-full p-1.5 bg-white border border-neutral-300 rounded text-center text-xs"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddQuantitativeMetric}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded text-[11px] mt-1 cursor-pointer"
                    >
                      지표 항목 개설 저장
                    </button>
                  </div>
                </div>

                {/* 2. Qualitative Quotes fields modifier */}
                <div className="space-y-4 pt-2 border-t border-neutral-100">
                  <span className="font-extrabold text-neutral-800 text-xs block">💬 학내 3자 주체 정성 인터뷰 성찰 선언</span>
                  
                  <div className="space-y-3">
                    {state.outcomes.qualitative?.map((q, idx) => (
                      <div key={q.id} className="p-3.5 bg-neutral-50 border border-neutral-200/55 rounded-xl space-y-2 text-xs">
                        <div className="flex gap-2 text-xs justify-between">
                          <div className="grid grid-cols-3 gap-2 flex-1">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400">소속 구분</label>
                              <select
                                value={q.role}
                                onChange={(e) => handleUpdateQualitativeQuote(idx, 'role', e.target.value)}
                                className="w-full p-1.5 bg-white border border-neutral-200 rounded text-xs leading-none"
                              >
                                <option value="교사">교사</option>
                                <option value="학생">학생</option>
                                <option value="학부모">학부모</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400">성명</label>
                              <input
                                type="text"
                                value={q.name}
                                onChange={(e) => handleUpdateQualitativeQuote(idx, 'name', e.target.value)}
                                className="w-full p-1.5 bg-white border border-neutral-200 rounded text-xs"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-neutral-400 font-sans">설문기록일</label>
                              <input
                                type="text"
                                value={q.date}
                                onChange={(e) => handleUpdateQualitativeQuote(idx, 'date', e.target.value)}
                                className="w-full p-1.5 bg-white border border-neutral-200 rounded text-xs font-mono text-center"
                              />
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleDeleteQualitativeFeedback(q.id)}
                            className="p-1 px-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-extrabold text-[10px] rounded self-end shrink-0 cursor-pointer h-7"
                          >
                            소거
                          </button>
                        </div>
                        
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-neutral-400 font-sans">성찰 고견 내용</label>
                          <textarea
                            rows={2}
                            value={q.quote}
                            onChange={(e) => handleUpdateQualitativeQuote(idx, 'quote', e.target.value)}
                            className="w-full p-2 bg-white border border-neutral-200 rounded text-xs font-serif italic"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add new Qualitative Quote mini form */}
                  <div className="p-4 bg-neutral-100/80 border border-dashed border-neutral-300 rounded-xl space-y-2.5 text-xs">
                    <span className="font-bold text-neutral-700 block text-[11px]">+ 새 현장 성찰 피드백 추가 신설</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-450">소속 구분</label>
                        <select
                          value={newFeedbackForm.role}
                          onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, role: e.target.value as any })}
                          className="w-full p-1.5 bg-white border border-neutral-300 rounded text-xs"
                        >
                          <option value="교사">교사</option>
                          <option value="학생">학생</option>
                          <option value="학부모">학부모</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-450">성명</label>
                        <input
                          type="text"
                          placeholder="예: 최서진 교사"
                          value={newFeedbackForm.name}
                          onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, name: e.target.value })}
                          className="w-full p-1.5 bg-white border border-neutral-300 rounded text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-450 font-sans">날짜 (기본 오늘)</label>
                        <input
                          type="text"
                          placeholder="YYYY-MM-DD"
                          value={newFeedbackForm.date}
                          onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, date: e.target.value })}
                          className="w-full p-1.5 bg-white border border-neutral-300 rounded text-xs text-center"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-neutral-400 font-sans">피드백 고견 기술 내용</label>
                      <textarea
                        rows={2}
                        placeholder="연구학교가 교육 현장에 부여한 영향과 변화 소감을 조리 있게 기입하세요..."
                        value={newFeedbackForm.quote}
                        onChange={(e) => setNewFeedbackForm({ ...newFeedbackForm, quote: e.target.value })}
                        className="w-full p-2 bg-white border border-neutral-300 rounded text-xs text-neutral-800"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddQualitativeFeedback}
                      className="w-full py-1.5 bg-green-600 hover:bg-green-700 text-white font-black rounded text-[11px] cursor-pointer"
                    >
                      성찰 한줄사례 추가 저장
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 5-B. RESEARCH TASKS COMPLETE EDITING MODULE */}
            {activeTab === 'researchTasks' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-100 pb-3">
                  <div>
                    <h2 className="text-base font-extrabold text-neutral-950">연구학교 18대 세부과제 (1-가-1 ~ 3-나-3) 완전 제어</h2>
                    <p className="text-xs text-neutral-500 mt-1">대과제 테마별 연구학교 세부 실천과제의 시안, 배경, 방법, 적용 현황을 수정, 추가 및 소거합니다.</p>
                  </div>
                  
                  {!selectedTaskToEdit && !isAddingNewTask && (
                    <button
                      type="button"
                      onClick={() => setIsAddingNewTask(true)}
                      className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-lg flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>새 실천과제 항목 추가</span>
                    </button>
                  )}
                </div>

                {/* EDIT FORM (selected task edit screen) */}
                {selectedTaskToEdit ? (
                  <div className="bg-white rounded-2xl p-5 border-2 border-amber-500 space-y-4 animate-fade-in text-xs text-neutral-800">
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <h4 className="font-extrabold text-amber-800 text-xs">실천 과제 수정 작업 영역 : <strong className="text-neutral-900 font-mono text-sm underline">{selectedTaskToEdit.taskCode}</strong></h4>
                      <p className="text-[10.5px] text-neutral-500 mt-0.5">운영 스케치 성찰과 추진배경, 적용사례 일체를 한글 수사 그대로 교정 유도합니다.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">대주제 번호</label>
                        <select
                          value={selectedTaskToEdit.themeNum}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, themeNum: parseInt(e.target.value) || 1 })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        >
                          <option value="1">주제 1: {state.basicInfo.researchTheme1 || "교사 전문성 및 UOI 설계"}</option>
                          <option value="2">주제 2: {state.basicInfo.researchTheme2 || "학생 주도성 기반 배움마당"}</option>
                          <option value="3">주제 3: {state.basicInfo.researchTheme3 || "배움 성장 평가와 나눔 협력"}</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">소주제 기호</label>
                        <input
                          type="text"
                          value={selectedTaskToEdit.subThemeName}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, subThemeName: e.target.value })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-center"
                          placeholder="가, 나 등"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">과제 코드</label>
                        <input
                          type="text"
                          value={selectedTaskToEdit.taskCode}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, taskCode: e.target.value })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-center"
                          placeholder="1-가-1) 등"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">소주제 타이틀 명칭</label>
                      <input
                        type="text"
                        value={selectedTaskToEdit.subThemeTitle}
                        onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, subThemeTitle: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-semibold text-neutral-900"
                        placeholder="예: 교사 전문학습공동체(PLC) 혁신"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">세부 실천 목표과제명</label>
                      <input
                        type="text"
                        value={selectedTaskToEdit.title}
                        onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, title: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-neutral-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">추진 배경 및 방향</label>
                      <textarea
                        rows={3}
                        value={selectedTaskToEdit.bg}
                        onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, bg: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-justify text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">핵심 추진내용 요약</label>
                      <textarea
                        rows={3}
                        value={selectedTaskToEdit.text}
                        onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, text: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-justify text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">예측 성과 및 주체별 영향</label>
                      <textarea
                        rows={2}
                        value={selectedTaskToEdit.impact}
                        onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, impact: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>

                    {/* Arrays fields using convenient newline mapping helper */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 flex justify-between">
                          <span>🛠️ 운영 방법</span>
                          <span className="text-[10px] text-neutral-400 font-mono">NEWLINE DELIMITED</span>
                        </label>
                        <textarea
                          rows={4}
                          value={selectedTaskToEdit.methods?.join('\n')}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, methods: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-sans leading-relaxed"
                          placeholder="한 줄에 하나씩 입력하세요"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 flex justify-between">
                          <span>🏫 실제 적용사례</span>
                          <span className="text-[10px] text-neutral-400 font-mono">NEWLINE DELIMITED</span>
                        </label>
                        <textarea
                          rows={4}
                          value={selectedTaskToEdit.cases?.join('\n')}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, cases: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-sans leading-relaxed"
                          placeholder="한 줄에 하나씩 입력하세요"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 flex justify-between">
                          <span>📁 관련 산출물 목록</span>
                          <span className="text-[10px] text-neutral-400 font-mono">NEWLINE DELIMITED</span>
                        </label>
                        <textarea
                          rows={4}
                          value={selectedTaskToEdit.resources?.join('\n')}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, resources: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-sans leading-relaxed"
                          placeholder="한 줄에 하나씩 입력하세요"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700 flex justify-between">
                          <span>🔗 관련자료 연결 링크 (URL)</span>
                          <span className="text-[10px] text-neutral-400 font-mono">줄바꿈 구분 (순서 매칭)</span>
                        </label>
                        <textarea
                          rows={4}
                          value={selectedTaskToEdit.resourceLinks?.join('\n') || ''}
                          onChange={(e) => setSelectedTaskToEdit({ ...selectedTaskToEdit, resourceLinks: e.target.value.split('\n') })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-sans leading-relaxed"
                          placeholder="예: https://example.com/forms&#10;산출물 개수와 순서(줄바꿈)에 맞춰 기입하십시오."
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-neutral-150 text-xs">
                      <button
                        type="button"
                        onClick={() => setSelectedTaskToEdit(null)}
                        className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-750 font-bold rounded-lg cursor-pointer"
                      >
                        수정 취소
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveEditedTask}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-lg cursor-pointer"
                      >
                        최종 편집내용 저장
                      </button>
                    </div>
                  </div>
                ) : isAddingNewTask ? (
                  /* ADD NEW TASK INTERFACE FORM SCREEN */
                  <div className="bg-white rounded-2xl p-5 border-2 border-green-500 space-y-4 animate-fade-in text-xs text-neutral-800">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                      <h4 className="font-extrabold text-green-800 text-xs">새 추진 과제 및 행동지침 배포서식 개설지</h4>
                      <p className="text-[10.5px] text-neutral-500 mt-0.5">도표 분석 체계에 기여할 새로운 소과제(가, 나 하단)를 명세 편입시킵니다.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">대주제 번호</label>
                        <select
                          value={newTaskForm.themeNum}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, themeNum: parseInt(e.target.value) || 1 })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        >
                          <option value="1">주제 1: {state.basicInfo.researchTheme1 || "교사 전문성 및 UOI 설계"}</option>
                          <option value="2">주제 2: {state.basicInfo.researchTheme2 || "학생 주도성 기반 배움마당"}</option>
                          <option value="3">주제 3: {state.basicInfo.researchTheme3 || "배움 성장 평가와 나눔 협력"}</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">소주제 기호</label>
                        <input
                          type="text"
                          value={newTaskForm.subThemeName}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, subThemeName: e.target.value })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-center"
                          placeholder="가, 나 등"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">과제 코드칭</label>
                        <input
                          type="text"
                          value={newTaskForm.taskCode}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, taskCode: e.target.value })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-mono text-center"
                          placeholder="예: 1-가-4)"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">소주제 타이틀 명칭</label>
                      <input
                        type="text"
                        value={newTaskForm.subThemeTitle}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, subThemeTitle: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-semibold text-neutral-900"
                        placeholder="예: 학급별 자율적 실천 탐구"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">세부 추진 과제명</label>
                      <input
                        type="text"
                        value={newTaskForm.title}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg font-bold text-neutral-900"
                        placeholder="실천할 세부 연구활동 한글 제목을 적으세요"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">추진 배경 및 필요성</label>
                      <textarea
                        rows={2}
                        value={newTaskForm.bg}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, bg: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">주요 행동내용 서술</label>
                      <textarea
                        rows={3}
                        value={newTaskForm.text}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, text: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-neutral-700">기대 수혜 효과 및 성과</label>
                      <textarea
                        rows={2}
                        value={newTaskForm.impact}
                        onChange={(e) => setNewTaskForm({ ...newTaskForm, impact: e.target.value })}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">운영 방법 (한 줄에 하나씩)</label>
                        <textarea
                          rows={3}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, methods: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">실천 사례 (한 줄에 하나씩)</label>
                        <textarea
                          rows={3}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, cases: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">관련 자료명 (한 줄에 하나씩)</label>
                        <textarea
                          rows={3}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, resources: e.target.value.split('\n').filter(Boolean) })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="font-bold text-neutral-700">연결 링크 (한 줄에 하나씩)</label>
                        <textarea
                          rows={3}
                          onChange={(e) => setNewTaskForm({ ...newTaskForm, resourceLinks: e.target.value.split('\n') })}
                          className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg"
                          placeholder="위의 자료명 순서에 맞춰주세요"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end pt-2 border-t border-neutral-150 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsAddingNewTask(false)}
                        className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-750 font-bold rounded-lg cursor-pointer"
                      >
                        개설 취소
                      </button>
                      <button
                        type="button"
                        onClick={handleAddNewTask}
                        className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-black rounded-lg cursor-pointer"
                      >
                        신설 과제 최종 등록 배포
                      </button>
                    </div>
                  </div>
                ) : (
                  /* NORMAL COMPLETE GRID LIST OF STUDY TASKS */
                  <div className="space-y-4">
                    <div className="p-3 bg-neutral-100 rounded-lg border flex justify-between items-center text-xs text-neutral-600">
                      <span>💡 <strong>팁:</strong> 각 주제별 1-가-1) 부터 3-나-3) 까지 총 18대 추진 과제가 체계대로 수립되어 있습니다.</span>
                      <span className="font-bold text-neutral-900">{state.researchTasks?.length}개 활성화</span>
                    </div>

                    <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full border-collapse bg-white">
                        <thead>
                          <tr className="bg-neutral-100 border-b border-neutral-200 text-[11px] font-black text-neutral-500 uppercase text-center select-none">
                            <th className="py-2.5 px-3">분류코드</th>
                            <th className="py-2.5 px-3 text-left">대분류 주제명</th>
                            <th className="py-2.5 px-3 text-left">실천 과제 제목 (18대)</th>
                            <th className="py-2.5 px-3">액션 처리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.researchTasks?.map((task) => (
                            <tr key={task.id} className="border-b border-neutral-100 hover:bg-neutral-50/50">
                              <td className="py-2 px-3 text-center font-mono font-bold text-neutral-600 select-all">{task.taskCode}</td>
                              <td className="py-2 px-3 text-neutral-500 font-medium max-w-[200px] truncate" title={task.subThemeTitle}>
                                Theme {task.themeNum} : {task.subThemeTitle}
                              </td>
                              <td className="py-2 px-3 font-bold text-neutral-900 truncate max-w-[320px]">{task.title}</td>
                              <td className="py-2 px-3 text-center">
                                <div className="inline-flex gap-1.5 justify-center">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedTaskToEdit(task)}
                                    className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold rounded cursor-pointer"
                                  >
                                    수정
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-650 font-bold rounded cursor-pointer"
                                  >
                                    삭제
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                          {(!state.researchTasks || state.researchTasks.length === 0) && (
                            <tr>
                              <td colSpan={4} className="py-8 text-neutral-400 italic text-center font-serif">존재하는 기어 연구과제가 전무합니다. 새로운 과제를 가동 배치해 보시기 바랍니다.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5-C. COMMUNITY MODERATION COMPREHENSIVE MANAGER */}
            {activeTab === 'community' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">소통 공간 타임라인 전 지성글 민원 관리</h2>
                  <p className="text-xs text-neutral-500 mt-1">질문과 답변, 공감 게시판에 공동체 구성원(학생, 교사, 학부모)들이 올린 기고글 제목, 본문 검사, 덧글 소거 민원을 중앙 대지 처리합니다.</p>
                </div>

                {selectedPostToEdit && (
                  <div className="bg-white rounded-2xl p-5 border-2 border-amber-500 space-y-3.5 animate-fade-in text-xs">
                    <span className="font-extrabold text-amber-700 text-xs block underlineDecoration">성찰 기고 내용 직접 개입 수정</span>
                    
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-650 block">기고글 제목 요약</label>
                      <input
                        type="text"
                        value={postEditTitle}
                        onChange={(e) => setPostEditTitle(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-neutral-650 block font-sans">성찰글 본문 전면 수정</label>
                      <textarea
                        rows={4}
                        value={postEditContent}
                        onChange={(e) => setPostEditContent(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs"
                      />
                    </div>
                    <div className="flex justify-end gap-1.5 text-xs pt-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedPostToEdit(null)}
                        className="px-3.5 py-1.5 bg-neutral-200 hover:bg-neutral-300 rounded font-bold cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSavePostEdit(selectedPostToEdit)}
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded cursor-pointer"
                      >
                        교정안 저장 및 전파
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {state.community?.map((post) => (
                    <div key={post.id} className="p-4 bg-white rounded-xl border border-neutral-200 shadow-xs space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-sm bg-blue-50 text-blue-750 font-bold border border-blue-105 font-sans mr-2">
                            {post.category}
                          </span>
                          <span className="text-neutral-400 font-mono text-[10.5px]">WRITER: <strong>{post.author}</strong> | {post.date}</span>
                          <h3 className="text-sm font-bold text-neutral-950 mt-1 select-all">{post.title}</h3>
                        </div>
                        
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPostToEdit(post.id);
                              setPostEditTitle(post.title);
                              setPostEditContent(post.content);
                            }}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10.5px] rounded border border-amber-200 cursor-pointer"
                          >
                            제목/내용 수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePost(post.id)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10.5px] rounded border border-red-200 cursor-pointer"
                          >
                            글 강제삭제
                          </button>
                        </div>
                      </div>

                      <p className="bg-neutral-50/50 p-2.5 rounded-lg border border-neutral-100 text-neutral-600 leading-relaxed text-justify max-h-24 overflow-y-auto font-sans text-[11px] whitespace-pre-wrap select-text">
                        {post.content}
                      </p>

                      {/* Display comments under this post with purge capability */}
                      {post.comments?.length > 0 && (
                        <div className="pt-2.5 border-t border-neutral-100 space-y-2">
                          <span className="text-[10.5px] font-black text-neutral-500 block">💬 등록 댓글 모니터링 수집관 ({post.comments.length}개)</span>
                          <div className="space-y-1.5">
                            {post.comments.map((comm) => (
                              <div key={comm.id} className="flex justify-between items-center bg-neutral-100/40 p-2 rounded-lg border border-neutral-150 text-[11px]">
                                <span className="text-neutral-600 leading-relaxed text-left flex-1 pl-1">
                                  <strong>{comm.author}</strong>: <span className="text-neutral-700 italic">"{comm.content}"</span> <span className="text-[10px] text-neutral-400 font-mono ml-1.5">({comm.date})</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteComment(post.id, comm.id)}
                                  className="text-[10px] text-red-650 hover:text-red-800 font-bold px-2 py-0.5 hover:bg-red-50 rounded cursor-pointer"
                                  title="부적절 피드백 덧글 지우기"
                                >
                                  삭제
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {(!state.community || state.community.length === 0) && (
                    <div className="p-12 text-center text-neutral-400 bg-white border rounded-xl italic">
                      소통공간 타임라인에 등록된 성찰글이 완전히 깨끗한 상태입니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. BACKUP & RESTORE MODULE */}
            {activeTab === 'backup' && (
              <div className="space-y-6 text-xs sm:text-sm font-sans select-text">
                <div>
                  <h2 className="text-base font-extrabold text-neutral-950">데이터 영속성 백업 및 재구조화 보강국</h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    "데이터 백업 가능 구조" 충족을 위해 현 포털의 모든 학풍, 글, 갤러리 설정 데이터를 단 한 장의 표준 JSON 파일로 패킹하여 로컬에 저장하거나 원상 복제해냅니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Backup export card */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-700 to-blue-950 text-white shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <FileJson className="w-5 h-5 text-blue-300" />
                        <span className="font-extrabold text-white text-xs uppercase tracking-wide">EXPORT JSON STATE</span>
                      </div>
                      <p className="text-[11.5px] text-blue-100/95 leading-relaxed text-justify">
                        현재 작성하고 수정한 학교 타이틀 명칭, PDF 파일 리스트 본문, 업로드한 대용량 현장 갤러리 이미지 데이터 전체를 인코딩한 `.json` 파일 사본을 즉각 백업합니다.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full py-2 bg-white hover:bg-neutral-100 text-indigo-950 font-black rounded text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4 text-indigo-800" />
                      <span>포털 백업파일 다운로드</span>
                    </button>
                  </div>

                  {/* Backup input restore card */}
                  <div className="p-5 rounded-2xl bg-white border border-indigo-200/50 shadow-xs space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 text-indigo-950">
                        <Upload className="w-5 h-5 text-indigo-700" />
                        <span className="font-extrabold text-xs uppercase tracking-wide">RESTORE / IMPORT DATA</span>
                      </div>
                      <p className="text-[11.5px] text-neutral-500 leading-relaxed text-justify">
                        과거 보관해 둔 백업 JSON 파일을 연계해 브라우저를 관통하는 완벽한 복구 처리를 유도합니다. 업로드 시 이전 정보는 100% 덮어쓰기 정합됩니다.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="px-3 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-950 rounded text-xs font-black block text-center cursor-pointer">
                        <span>백업 수집본 JSON 파일 적재하기</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportBackup}
                        />
                      </label>
                      <span className="text-[9.5px] text-neutral-400 block text-center mt-1 font-mono">Accepts only standard .json configuration files</span>
                    </div>
                  </div>

                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>초기화 필요 소식 :</span>
                  </p>
                  <p className="text-[11px] text-neutral-600 leading-relaxed text-justify">
                    정비과정에 상태를 아예 공장 초기값으로 돌려서 다시 처음부터 마스터링하고 싶을 때는, 관리자 세션에서 백업 탭을 통해 백업을 받으시거나 브라우저를 새로고침 해보시기 바랍니다.
                  </p>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
