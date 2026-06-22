export interface ReportItem {
  id: string;
  type: 'plan' | 'mid' | 'final';
  title: string;
  desc: string;
  filename: string;
  uploadDate: string;
  pdfContentSim: string; // Simulated textual content for modern in-app visual viewing
  pdfBase64?: string;    // Base64 file string for real uploaded PDF display
}

export interface InfographicStep {
  step: string;
  title: string;
  desc: string;
}

export interface InfographicData {
  title: string;
  steps: InfographicStep[];
  imageBase64?: string;
}

export interface ResearchTaskItem {
  id: string;
  themeNum: number;      // 대 주제 번호 (1, 2, 3)
  subThemeName: string;   // 소 주제 기호 ("가", "나")
  subThemeTitle: string;  // 소 주제 명칭
  taskCode: string;      // 1-가-1)
  title: string;
  bg: string;          // 추진 배경
  text: string;        // 실행 내용
  methods: string[];   // 운영 방법
  cases: string[];     // 실제 적용 사례
  resources: string[]; // 관련 자료
  resourceLinks?: string[]; // 관련 자료 링크 (1:1 매핑 또는 옵셔널)
  impact: string;      // 성과 및 변화
  attachments?: Array<{
    id: string;
    name: string;
    type: 'image' | 'pdf';
    data: string; // Base64 raw representation
    date: string;
  }>;
}

export interface QuantitativeMetric {
  label: string;
  before: number;
  after: number;
  unit: string;
}

export interface QualitativeFeedback {
  id: string;
  role: '학생' | '교사' | '학부모';
  name: string;
  quote: string;
  date: string;
}

export interface ResearchOutcomes {
  quantitative: QuantitativeMetric[];
  qualitative: QualitativeFeedback[];
}

export interface LessonItem {
  id: string;
  grade: string;                // 학년 (1~6학년 등)
  theme: string;                // 초학문적 주제 (Transdisciplinary Theme)
  teacher: string;              // 지도교사
  inquiryQuestion: string;      // 탐구질문
  centralIdea: string;          // 중심아이디어 (Central Idea)
  concepts: string;             // 기타 개념
  description: string;          // 수업 개요
  direction: string;            // 탐구 방향
  lessonPlanSim: string;        // 관련 지도안 PDF 시뮬레이션 텍스트
  pdfBase64?: string;           // Base64 file string for real uploaded PDF display
  image: string;                // 사진 또는 썸네일 (Base64 or placeholder index)
  views: number;
  date: string;
  period?: string;              // 수업 차시 (예시: '3/6차시')
  isOpenLesson: boolean;        // 공개수업 여부
  materialType: '지도안' | '수업자료' | '동영상' | '학생활동'; // 자료 유형
}

export interface GalleryItem {
  id: string;
  title: string;
  grade: string;
  category: '학습' | 'Action' | 'Portfolio';
  theme: string;
  description: string;
  images: string[];             // Multi-image list (Base64 or placeholder refs)
  files: string[];              // Related filenames
  date: string;
  pdfBase64?: string;           // Base64 file string for real uploaded PDF display (legacy single PDF)
  pdfContentSim?: string;       // Simulated text content for the inline viewer
  pdfFiles?: { name: string; base64: string }[]; // Support for multiple PDF files!
}

export interface CommentItem {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface CommunityItem {
  id: string;
  category: '공지' | '의견 나눔' | '질문과 답변' | '공감 게시판';
  title: string;
  author: string;
  content: string;
  password?: string; // Optional password for users to edit/delete their own posts
  date: string;
  likes: number;
  views: number;
  comments: CommentItem[];
}

export interface FooterInfo {
  intro: string;
  address: string;
  phone: string;
  email: string;
  copyright: string;
  links: { name: string; url: string }[];
}

export interface PortalConfig {
  schoolName: string;
  schoolNameEng: string;
  subLabelKor: string;
  subLabelEng: string;
  schoolLogo: string; // Base64 or string SVG
  ibLogo: string;     // Base64 or string SVG
}

export interface AppState {
  config: PortalConfig;
  basicInfo: {
    researchName: string;
    duration: string;
    subject: string;
    purpose: string[];
    schoolIntro: string;
    ibMission: string;
    videoUrl: string;      // 영상 URL
    videoDesc: string;     // 영상 아래 설명/대체 텍스트
    slogan1?: string;      // 슬로건 첫째 줄
    slogan2?: string;      // 슬로건 둘째 줄
    slogan3?: string;      // 슬로건 셋째 줄
    schoolImage?: string;  // 학교 전경 이미지 (Base64)
    symbolTimber?: string; // 교목
    symbolFlower?: string; // 교화
    symbolColor?: string;  // 교색
    symbolMotto?: string;  // 교훈
    researchTarget?: string;   // 연구 대상 (예: 빛가람초등학교 전교생...)
    researchAdvisors?: string; // 운영 자문 기관
    researchDir1?: string;     // 연구 추진 방향 1
    researchDir2?: string;     // 연구 추진 방향 2
    researchDir3?: string;     // 연구 추진 방향 3
    researchTheme1?: string;   // 대주제 1 카테고리 명칭
    researchTheme2?: string;   // 대주제 2 카테고리 명칭
    researchTheme3?: string;   // 대주제 3 카테고리 명칭
    transTheme1?: string;      // 초학문적 주제 1
    transTheme2?: string;      // 초학문적 주제 2
    transTheme3?: string;      // 초학문적 주제 3
    transTheme4?: string;      // 초학문적 주제 4
    transTheme5?: string;      // 초학문적 주제 5
    transTheme6?: string;      // 초학문적 주제 6
  };
  reports: ReportItem[];
  infographic: InfographicData;
  researchTasks: ResearchTaskItem[];
  outcomes: ResearchOutcomes;
  lessons: LessonItem[];
  gallery: GalleryItem[];
  community: CommunityItem[];
  footer: FooterInfo;
  updatedAt?: number;
}
