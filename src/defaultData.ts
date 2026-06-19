import { AppState } from './types';

// Built-in high-quality vector-like SVG icons for school logos (rendered beautifully inline)
export const defaultSchoolLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12">
  <circle cx="50" cy="50" r="45" fill="#f0fdf4" stroke="#16a34a" stroke-width="3" />
  <path d="M50 15 L20 35 L20 50 L50 75 L80 50 L80 35 Z" fill="#22c55e" opacity="0.15" />
  <path d="M50 15 L80 35 L50 55 L20 35 Z" fill="none" stroke="#16a34a" stroke-width="4" stroke-linejoin="round" />
  <path d="M20 35 L20 65 C20 75, 35 85, 50 85 C65 85, 80 75, 80 65 L80 35" fill="none" stroke="#16a34a" stroke-width="4" stroke-linejoin="round" />
  <path d="M50 55 L50 85" fill="none" stroke="#16a34a" stroke-width="2" stroke-dasharray="3,3" />
  <circle cx="50" cy="35" r="4" fill="#eab308" />
  <path d="M40 48 Q50 42 60 48" fill="none" stroke="#eab308" stroke-width="3" />
</svg>
`;

export const defaultIbLogoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="w-12 h-12">
  <circle cx="50" cy="50" r="45" fill="#f0f9ff" stroke="#0284c7" stroke-width="3" />
  <text x="50" y="44" font-family="'Inter', sans-serif" font-weight="900" font-size="28" fill="#0369a1" text-anchor="middle" letter-spacing="-1">IB</text>
  <text x="50" y="72" font-family="'Inter', sans-serif" font-weight="600" font-size="20" fill="#0369a1" text-anchor="middle">PYP</text>
  <path d="M15 50 Q50 30 85 50" fill="none" stroke="#38bdf8" stroke-width="2" />
  <path d="M15 50 Q50 70 85 50" fill="none" stroke="#38bdf8" stroke-width="2" />
</svg>
`;

export const defaultData: AppState = {
  config: {
    schoolName: "빛가람초등학교",
    schoolNameEng: "Bitgaram Elementary School",
    subLabelKor: "IB PYP 연구학교",
    subLabelEng: "IB PYP Research School",
    schoolLogo: defaultSchoolLogoSvg,
    ibLogo: defaultIbLogoSvg,
  },
  basicInfo: {
    researchName: "2026학년도 전라남도교육청 지정 IB PYP 연구학교",
    duration: "2026. 03. 01. ~ 2027. 02. 28. (1년간)",
    subject: "초학문적 탐구 프로그램(UOI) 공동 연구·설계를 통한 미래전환적 탐구 역량 함양",
    purpose: [
      "자발적 참여와 협력을 기반으로 하는 교사 전문적 학습공동체 운영을 통해 수업 설계 및 성찰 역량 강화",
      "초학문적 주제(Transdisciplinary Themes) 중심 of UOI 탐구 교육과정을 설계 및 실천하여 깊이 있는 배움 구현",
      "학생 주도성(Learner Agency)을 발현하는 다양한 탐구 활동과 과정 중심 평가 연계를 통한 교육 혁신",
      "가정과 지역사회 공유를 통한 지속 가능한 상호 성장 교육 생태계 구축 및 IB 공교육 적용성 증명"
    ],
    schoolIntro: "전남 나주 빛가람 혁신도시에 위치한 빛가람초등학교는 배움과 질문이 살아있는 교실, 학생이 주도하는 배움을 통해 글로벌 품성을 갖춘 창의 인재를 육성하고 있습니다. 2026년 IB PYP 연구학교로 발돋움하며 공교육의 핵심 가치를 발전시키는 프런티어 역할을 다하고 있습니다.",
    ibMission: "국제학력평가기구(IB)는 학생들이 타인과 그들의 차이점을 이해하고 인정하며, 탐구심과 지식, 인성을 갖춘 젊은 세대를 육성함으로써 더 나은 평화로운 세상을 만드는 데 기여하고자 합니다. 이를 위해 학교, 교육국 및 국제기구등과 적극적으로 협업하여 도전적인 국제 교육 프로그램과 엄격한 평가 체계를 운영합니다.",
    videoUrl: "https://www.youtube.com/embed/gW37oOicb68", // A lovely educational/school intro embed video
    videoDesc: "2026학년도 빛가람초등학교 IB PYP 연구학교 교육과정 안내 및 수업 소개 동영상입니다. 학생 중심의 질문 교실, 탐구 플레너 설계 흐름, 학년별 UOI 학습 실천 현장을 성찰적으로 시청하실 수 있습니다.",
    slogan1: "배움을 설계하고",
    slogan2: "생각을 확장하며",
    slogan3: "주도적으로 성장하다",
    researchTheme1: "주제 1. 교사 전문성 및 UOI 설계 혁신 (PLC & Alignment)",
    researchTheme2: "주제 2. 학생 주도성 기반 배움마당 (Agency & Practice)",
    researchTheme3: "주제 3. 배움 성장 평가와 나눔 협력 (Assessment & Sharing)",
    transTheme1: "우리는 누구인가 (Who We Are)",
    transTheme2: "세계가 돌아가는 방식 (How the World Works)",
    transTheme3: "우리가 속한 공간과 시간 (Where We Are in Place and Time)",
    transTheme4: "우리 자신을 표현하는 방법 (How We Express Ourselves)",
    transTheme5: "우리 자신을 조직하는 방식 (How We Organize Ourselves)",
    transTheme6: "우리 모두의 지구 (Sharing the Planet)"
  },
  reports: [
    {
      id: "rep-1",
      type: "plan",
      title: "2026학년도 IB PYP 연구학교 운영 계획서",
      desc: "연구학교 심사를 거쳐 최종 승인된 2026년도 전체 연간 운영 마스터 플랜 및 예산 활용 계획서입니다.",
      filename: "2026_bitgaram_pyp_research_plan.pdf",
      uploadDate: "2026-03-12",
      pdfBase64: "data:application/pdf;base64,JVBERi0xLjQKJUltZ2gKMSAwIG9iagogIDw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCiAgPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKICA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKICA8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKNSAwIG9iaagogIDw8L0xlbmd0aCA3Nz4+c3RyZWFtCkJUCi9GMSAxMiBUZgoxMCAwIDAgMTAgNTAgODAwIFRkCihCaXRnYXJhbSBFbGVtZW50YXJ5IFNjaG9vbCBJQiBQWVAgUmVzZWFyY2ggRG9jdW1lbnQpIFRqCkVOCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjkgMDAwMDAgbiAKMDAwMDAwMDEyMSAwMDAwMCBuIAowMDAwMDAwMjQwIDAwMDAwIG4gCjAwMDAwMDAzMTggMDAwMDAgbiAKdHJhaWxlcgogIDw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ0NgotJUVPRg==",
      pdfContentSim: `
[빛가람초등학교 IB PYP 연구학교 운영 계획서]
■ 운영 대상: 빛가람초등학교 전학년 (1~6학년)
■ 연구 주제: 초학문적 탐구 프로그램(UOI) 설계 및 적용을 통한 탐구 능력 개발
■ 핵심 연구 영역:
1. 연차별 교사 전문적 학습공동체(PLC) 120시간 연간 워크숍 편성
2. 학년 수준별 4~6개 학교단위 초학문적 탐구 단원 개발 및 고도화
3. 글로벌 마인드셋(International Mindedness) 함양을 위한 교육 환경 개선
■ 추진 실적 마일스톤:
- 3월: 학교 구성원 비전 공유, 전문적 학습공동체 발기인 대회
- 4~5월: 학년별 중심아이디어 세부 조율 및 세부 탐구선 설계
- 6~7월: 1학기 학부모 참관 공개수업 및 성찰 나눔회
- 9월 이후: 2차 실행주기 진입 및 융합 평가 개발
      `
    },
    {
      id: "rep-2",
      type: "mid",
      title: "2026학년도 상반기 IB PYP 중간 운영 성과 보고서",
      desc: "1학기 동안 진행된 학년별 UOI 실천 실적과 정량적 설문조사, 주요 교사/학생 성찰을 중간 정리한 보고서입니다.",
      filename: "2026_bitgaram_pyp_midterm_report.pdf",
      uploadDate: "2026-07-15",
      pdfBase64: "data:application/pdf;base64,JVBERi0xLjQKJUltZ2gKMSAwIG9iagogIDw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+CmVuZG9iagoyIDAgb2JqCiAgPDwvVHlwZS9QYWdlcy9LaWRzWzMgMCBSXS9Db3VudCAxPj4KZW5kb2JqCjMgMCBvYmoKICA8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL01lZGlhQm94WzAgMCA1OTUgODQyXS9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKICA8PC9UeXBlL0ZvbnQvU3VidHlwZS9UeXBlMS9CYXNlRm9udC9IZWx2ZXRpY2E+PgplbmRvYmoKNSAwIG9iaagogIDw8L0xlbmd0aCA3Nz4+c3RyZWFtCkJUCi9GMSAxMiBUZgoxMCAwIDAgMTAgNTAgODAwIFRkCihCaXRnYXJhbSBFbGVtZW50YXJ5IFNjaG9vbCBJQiBQWVAgUmVzZWFyY2ggRG9jdW1lbnQpIFRqCkVOCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAwNjkgMDAwMDAgbiAKMDAwMDAwMDEyMSAwMDAwMCBuIAowMDAwMDAwMjQwIDAwMDAwIG4gCjAwMDAwMDAzMTggMDAwMDAgbiAKdHJhaWxlcgogIDw8L1NpemUgNi9Sb290IDEgMCBSPj4Kc3RhcnR4cmVmCjQ0NgotJUVPRg==",
      pdfContentSim: `
[빛가람초등학교 IB PYP 연구학교 1학기 중간 운영 보고서]
■ 주요 추진 경과:
1. 전문적학습공동체(PLC)를 활용한 UOI 탐구 설계 18회차 정규 가동
2. 6개 초학문적 주제에 맞춘 탐구 플래너 학년 공동 작성 및 1차 실행 성과 도출
3. 만족도 연계 설문을 통한 만족지수 전년동기 대비 크게 상장
      `
    }
  ],
  researchTasks: [
    // --- Theme 1, Sub "가" ---
    {
      id: "task-1-a-1",
      themeNum: 1,
      subThemeName: "가",
      subThemeTitle: "주도적 학습 및 학문적 정직성 정책 수립",
      taskCode: "1-가-1)",
      title: "주도적 학습을 지원하는 포용성 정책 수립",
      bg: "모든 학생이 학습에 의미 있게 참여할 수 있도록 학교 차원의 포용성 기준을 마련하여 학생 주도적 참여를 보장하고자 함.",
      text: "IB 포용성 원칙을 반영한 포용성 정책 수립 및 단원 설계·학년 협의 과정에 포용성 검토 절차를 적용함.",
      methods: [
        "포용성 정책 개발 및 교직원 공유",
        "단원 설계 시 포용성 점검 항목 적용",
        "학년 협의를 통한 적용 사례 공유",
        "개선 사항 환류 및 정책 보완"
      ],
      cases: [
        "6학년 UOI 설계 시 동일 성취기준을 유지하면서 다양한 산출물(영상, 발표, 포스터) 선택 허용"
      ],
      resources: [
        "포용성 정책",
        "포용성 점검 체크리스트",
        "학년 협의록"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생의 학습 참여 기회 확대 및 학습자 주도성 향상",
      attachments: []
    },
    {
      id: "task-1-a-2",
      themeNum: 1,
      subThemeName: "가",
      subThemeTitle: "주도적 학습 및 학문적 정직성 정책 수립",
      taskCode: "1-가-2)",
      title: "학문적 정직성 정책 수립",
      bg: "책임 있는 탐구 태도와 올바른 정보 활용 문화를 형성하고자 함.",
      text: "출처 표기, 협업 기준, AI 활용 기준을 포함한 학문적 정직성 정책을 수립하고 학년별 실천 가이드를 마련함.",
      methods: [
        "정책 개발 및 학년군별 가이드 제작",
        "수업 속 출처 표기 지도",
        "AI 활용 교육 실시",
        "사례 분석 및 정책 개선"
      ],
      cases: [
        "고학년 학생 대상 참고문헌 작성 및 AI 활용 윤리 교육 실시"
      ],
      resources: [
        "학문적 정직성 정책",
        "학년군별 가이드",
        "출처 표기 예시 자료"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생의 책임 있는 탐구 태도 형성 및 학습 신뢰도 향상",
      attachments: []
    },
    // --- Theme 1, Sub "나" ---
    {
      id: "task-1-b-1",
      themeNum: 1,
      subThemeName: "나",
      subThemeTitle: "탐구 생성 및 인지적 사고 환경 설계",
      taskCode: "1-나-1)",
      title: "탐구 질문 생성을 위한 환경 조성",
      bg: "질문을 중심으로 탐구를 시작하는 학생 주도적 학습 문화를 조성하고자 함.",
      text: "질문 틀 포스터와 Wonder Wall을 활용하여 질문 생성 및 확장 환경을 구축함.",
      methods: [
        "학년군별 질문 틀 제작",
        "Wonder Wall 상시 운영",
        "질문 공유 및 발전 활동 실시",
        "핵심 질문과 탐구 질문 연결"
      ],
      cases: [
        "지구촌 단원에서 Wonder Wall을 활용해 학생 질문을 수집하고 탐구 주제로 발전"
      ],
      resources: [
        "질문 틀 포스터",
        "Wonder Wall 운영 자료",
        "학생 질문 사례집"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생 질문 수 증가 및 탐구 참여도 향상",
      attachments: []
    },
    {
      id: "task-1-b-2",
      themeNum: 1,
      subThemeName: "나",
      subThemeTitle: "탐구 생성 및 인지적 사고 환경 설계",
      taskCode: "1-나-2)",
      title: "학습 사고를 지원하는 인지적 환경 설계",
      bg: "학생의 사고 과정을 가시화하여 개념적 이해를 심화하고자 함.",
      text: "그래픽 오거나이저와 이중부호화 전략을 활용한 사고 중심 학습 환경을 구축함.",
      methods: [
        "그래픽 오거나이저 상시 게시",
        "사고 결과물 전시",
        "시각화 전략 활용",
        "사고 과정 공유 활동 운영"
      ],
      cases: [
        "속력 단원에서 비교표와 개념도를 활용하여 개념 일반화 수행"
      ],
      resources: [
        "그래픽 오거나이저 자료",
        "사고루틴 활용 사례",
        "학생 사고 결과물"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생의 개념적 이해 및 자기주도적 사고력 향상",
      attachments: []
    },
    // --- Theme 2, Sub "가" ---
    {
      id: "task-2-a-1",
      themeNum: 2,
      subThemeName: "가",
      subThemeTitle: "학생 주도 탐구 실천 및 참여",
      taskCode: "2-가-1)",
      title: "학생이 주도하는 탐구 실천 문화 조성",
      bg: "탐구 결과를 실천으로 연결하는 학생 주도 문화를 조성하고자 함.",
      text: "Action Day와 Exhibition을 연계하여 학생 주도 탐구 문화를 구축함.",
      methods: [
        "학년별 Action Day 운영",
        "학생 주도 프로젝트 기획",
        "멘토링 체계 구축",
        "탐구 결과 공유"
      ],
      cases: [
        "지역사회 문제 해결 Action 프로젝트 운영"
      ],
      resources: [
        "Action Day 운영 자료",
        "Exhibition 결과물",
        "탐구 보고서"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생 실천 역량 및 학습자 주도성 강화",
      attachments: []
    },
    {
      id: "task-2-a-2",
      themeNum: 2,
      subThemeName: "가",
      subThemeTitle: "학생 주도 탐구 실천 및 참여",
      taskCode: "2-가-2)",
      title: "학부모지원단 연계를 통한 참여 기반 마련",
      bg: "학부모를 교육 파트너로 참여시켜 탐구 학습을 확장하고자 함.",
      text: "학부모지원단의 전문성과 경험을 단원 운영과 연계함.",
      methods: [
        "정기 협의회 운영",
        "전문가 인터뷰 지원",
        "현장체험 지원",
        "참여 결과 환류"
      ],
      cases: [
        "학부모 직업 전문가 초청 인터뷰 실시"
      ],
      resources: [
        "학부모지원단 운영 계획",
        "참여 기록지",
        "활동 결과 보고서"
      ],
      resourceLinks: ["", "", ""],
      impact: "교육공동체 협력 문화 강화 및 학습 경험 확장",
      attachments: []
    },
    // --- Theme 2, Sub "나" ---
    {
      id: "task-2-b-1",
      themeNum: 2,
      subThemeName: "나",
      subThemeTitle: "협업과 성찰 공동체 가치 정착",
      taskCode: "2-나-1)",
      title: "학년 간 협업이 일상화되는 교원 문화 정착",
      bg: "지속 가능한 IB 운영을 위한 협력 문화를 구축하고자 함.",
      text: "매월 학년 간 협의를 정례화하여 UOI 설계와 평가를 공동 협의함.",
      methods: [
        "월 1회 학년 간 협의",
        "공동 설계 및 검토",
        "수업 사례 공유",
        "평가 기준 협의"
      ],
      cases: [
        "POI 연계성 검토 및 UOI 공동 설계"
      ],
      resources: [
        "협의록",
        "공동 설계안",
        "수업 사례집"
      ],
      resourceLinks: ["", "", ""],
      impact: "교원 전문성 향상 및 운영 일관성 확보",
      attachments: []
    },
    {
      id: "task-2-b-2",
      themeNum: 2,
      subThemeName: "나",
      subThemeTitle: "협업과 성찰 공동체 가치 정착",
      taskCode: "2-나-2)",
      title: "성찰하는 교원 문화 조성",
      bg: "수업 실행에 대한 성찰을 통해 IB 운영을 지속적으로 개선하고자 함.",
      text: "IB 성찰의 날을 운영하여 학생·학부모 의견을 반영한 개선 체계를 구축함.",
      methods: [
        "만족도 조사 실시",
        "IB 성찰의 날 운영",
        "개선 방안 도출",
        "결과 공유"
      ],
      cases: [
        "학기말 UOI 운영 성찰 및 개선안 도출"
      ],
      resources: [
        "성찰 기록지",
        "설문 결과",
        "카드뉴스"
      ],
      resourceLinks: ["", "", ""],
      impact: "수업 개선 문화 정착 및 교육공동체 신뢰 향상",
      attachments: []
    },
    // --- Theme 3, Sub "가" ---
    {
      id: "task-3-a-1",
      themeNum: 3,
      subThemeName: "가",
      subThemeTitle: "교육과정-수업-평가 일체화",
      taskCode: "3-가-1)",
      title: "교육과정-수업-평가 일체화 설계",
      bg: "학생의 개념 이해와 주도적 탐구를 지원하는 일체화 체계를 구축하고자 함.",
      text: "백워드 설계를 기반으로 성취기준-평가-수업을 정렬하여 운영함.",
      methods: [
        "성취기준 분석",
        "평가 우선 설계",
        "탐구 사이클 적용",
        "수업-평가 연계 운영"
      ],
      cases: [
        "속력 단원 백워드 설계 및 개념 기반 수업 운영"
      ],
      resources: [
        "UOI 플래너",
        "평가 계획서",
        "단원 지도안"
      ],
      resourceLinks: ["", "", ""],
      impact: "개념적 이해 증진 및 수업의 일관성 확보",
      attachments: []
    },
    {
      id: "task-3-a-2",
      themeNum: 3,
      subThemeName: "가",
      subThemeTitle: "교육과정-수업-평가 일체화",
      taskCode: "3-가-2)",
      title: "포트폴리오 기반 기록 및 공유",
      bg: "학생 성장 과정을 체계적으로 기록하고 성찰을 지원하고자 함.",
      text: "학년별 포트폴리오 체계를 구축하여 학습 과정을 지속적으로 기록·공유함.",
      methods: [
        "학년별 포트폴리오 운영",
        "결과물 누적 기록",
        "학부모 공유",
        "자기 성찰 활동 실시"
      ],
      cases: [
        "Canva 기반 온라인 포트폴리오 구축"
      ],
      resources: [
        "온라인 포트폴리오",
        "학습 기록물",
        "성찰 기록지"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생의 자기성찰 능력 및 학습 주인의식 향상",
      attachments: []
    },
    // --- Theme 3, Sub "나" ---
    {
      id: "task-3-b-1",
      themeNum: 3,
      subThemeName: "나",
      subThemeTitle: "학년별 ATL 및 사고루틴 구체화",
      taskCode: "3-나-1)",
      title: "성취기준 기반 학년별 ATL 도달 기준 구체화",
      bg: "ATL을 추상적 역량이 아닌 수업 속에서 관찰 가능한 학습 기능으로 구체화하고자 함.",
      text: "학년별 성취기준을 분석하여 필요한 ATL 요소를 도출하고, 학년별 도달 기준으로 체계화함.",
      methods: [
        "학년별 성취기준 분석",
        "관련 ATL 요소 도출",
        "학생 수행 행동으로 진술",
        "루브릭 및 단원 설계에 반영"
      ],
      cases: [
        "6학년 탐구 단원에서 조사 기능, 사고 기능, 의사소통 기능을 루브릭에 반영하여 평가함."
      ],
      resources: [
        "학년별 ATL 도달 기준표",
        "ATL 반영 루브릭",
        "UOI 플래너"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생의 탐구 기능이 명확해지고, 자기조절 및 주도적 학습 역량이 강화됨.",
      attachments: []
    },
    {
      id: "task-3-b-2",
      themeNum: 3,
      subThemeName: "나",
      subThemeTitle: "학년별 ATL 및 사고루틴 구체화",
      taskCode: "3-나-2)",
      title: "탐구 사이클 기반 단계별 사고루틴 적용 사례 연구",
      bg: "탐구 단계별로 적합한 사고루틴을 적용하여 학생의 사고 과정을 구조화하고자 함.",
      text: "개념 기반 탐구 사이클에 따라 사고루틴을 적용하고, 학생 사고 변화와 적용 사례를 축적함.",
      methods: [
        "탐구 단계별 사고루틴 선정",
        "수업 적용",
        "학생 산출물 수집",
        "질문·설명·일반화 변화 분석",
        "사례 공유"
      ],
      cases: [
        "관계맺기 단계에서 Zoom In, 조직하기 단계에서 비교표, 일반화하기 단계에서 Headline을 활용함."
      ],
      resources: [
        "탐구 단계별 사고루틴 적용표",
        "수업 적용 사례 기록",
        "학생 사고 산출물"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생의 사고가 가시화되고, 개념 이해와 일반화 능력이 향상됨.",
      attachments: []
    },
    {
      id: "task-3-b-3",
      themeNum: 3,
      subThemeName: "나",
      subThemeTitle: "학년별 ATL 및 사고루틴 구체화",
      taskCode: "3-나-3)",
      title: "탐구 질문을 활용한 수업 운영 방안 적용",
      bg: "질문을 중심으로 수업을 구조화하여 학생이 탐구의 방향을 이해하고 주도적으로 참여하도록 함.",
      text: "학생 질문과 교사 질문을 함께 활용하고, 핵심 질문과 탐구 질문을 구분하여 수업 전반에 적용함.",
      methods: [
        "학생 질문 생성",
        "교사 가이딩 질문 설계",
        "핵심 질문·탐구 질문 구분",
        "차시별 탐구 질문 적용",
        "질문 기반 성찰"
      ],
      cases: [
        "단원 도입에서 Wonder Wall 질문을 수집하고, 차시별 탐구 질문으로 연결하여 수업을 운영함."
      ],
      resources: [
        "핵심 질문 및 탐구 질문 목록",
        "질문 생성 틀",
        "Wonder Wall 기록",
        "수업 성찰 자료"
      ],
      resourceLinks: ["", "", ""],
      impact: "학생 질문이 탐구의 출발점으로 기능하고, 수업 참여도와 학습자 주도성이 향상됨.",
      attachments: []
    }
  ],
  infographic: {
    title: "빛가람초 IB PYP 교육 정렬 및 핵심 실행 체계",
    steps: [
      {
        step: "01 / IB PSP",
        title: "IB PSP(프로그램 기준 및 운영 방침)",
        desc: "국제 바칼로레아(IB) 표준에 부합하는 협력적 전문 학습공동체(PLC) 인프라 구축 및 초학문적 통합 정렬"
      },
      {
        step: "02 / Research",
        title: "연구과제 3가지 (실천·배움·평가)",
        desc: "교사 전문성 & UOI 설계 혁신, 학생 주도성 기반 자발 배움마당, 역량 중심 성장 평가 및 일상 나눔"
      },
      {
        step: "03 / Agency",
        title: "학습자 주도성 향상 (Learner Agency)",
        desc: "스스로 탐구를 주도하는 Voice(목소리), Choice(선택권), Ownership(소유권)을 지닌 민주적 학습자 완성"
      }
    ]
  },
  outcomes: {
    quantitative: [
      { label: "탐구수업 참여 및 흥미도", before: 68.4, after: 94.6, unit: "%" },
      { label: "학생의 능동적 주도성 지표", before: 52.1, after: 88.3, unit: "%" },
      { label: "동료교사와의 협업 활성화", before: 71.4, after: 97.2, unit: "%" },
      { label: "학교 교육에 대한 학부모 만족도", before: 79.5, after: 96.1, unit: "%" },
      { label: "창의적 문제해결력 자신감", before: 58.0, after: 85.4, unit: "%" },
    ],
    qualitative: [
      {
        id: "qual-1",
        role: "학생",
        name: "김하람 (4학년 2반)",
        quote: "옛날에는 선생님이 책을 따라 읽는 게 다였는데, 이제는 교실에 큰 질문이 붙어있고 우리가 가짜 도시의 물 부족 해결책을 모둠이랑 같이 만들어요. 진짜 연구가가 된 것 같아서 매일 학교 오는 날이 기대돼요!",
        date: "2026-06-03"
      },
      {
        id: "qual-2",
        role: "교사",
        name: "이지연 (3학년 부장 서포터)",
        quote: "처음에는 플래너를 쓰는 양이 너무 많고 낯설어 혼란도 겪었습니다. 그러나 동료 교사들과 머리를 맞대고 학습을 설계하며 가르치는 맛을 되찾았어요. 이제 교사들끼리 매 수업이 끝난 뒤에 자발적으로 커피 마시며 성찰을 나누는 것이 일상이 되었습니다.",
        date: "2026-10-15"
      },
      {
        id: "qual-3",
        role: "학부모",
        name: "박윤아 (5학년 전원 학부모)",
        quote: "아이가 집에 오면 단순히 '학원 숙제 끝났어'가 아니라, '엄마, 오늘 우리는 이 세상의 식량 부족 문제가 지구 온난화랑 어떻게 복합적으로 엮여있는지 인과관계를 마인드맵으로 그렸다!'라며 끊임없이 신나게 떠듭니다. 배움이 정말 학교 밖으로 번져나간 느낌이에요.",
        date: "2026-11-20"
      }
    ]
  },
  lessons: [
    {
      id: "les-1",
      grade: "3학년",
      theme: "우리는 누구인가 (Who We Are)",
      teacher: "윤정민 교사",
      inquiryQuestion: "가치관과 역사적 배경이 우리의 자아 정체성을 구성하는 방법은 무엇일까?",
      centralIdea: "개인과 사회의 가치 전통은 인간 정체성 확립에 심오한 형성을 촉진한다.",
      concepts: "관계(Connection), 관점(Perspective)",
      description: "학생들이 본인 가계의 주요 의식주 전통과 빛가람 지역 향토 전통문화를 상호 비교 분석하며, '나'라는 인격체가 다원적 문맥에서 어떻게 복합적으로 성장했는지 시계열 자화상 지도로 그려 탐구합니다.",
      direction: "1. 가계 인터뷰를 통한 전통 사례 수집\n2. 가문의 가치와 지역의 역사적 연계성 분석\n3. 미래 세대 전수 가치 우선순위 선정 및 선언 낭독",
      lessonPlanSim: `
[3학년 '우리는 누구인가' 통합 플래너 요약]
* 핵심개념: 관점, 관계
* 탐구선 1: 나와 조상의 삶을 이어주는 소중한 무형 문화적 특성들
* 탐구선 2: 지역사회의 변화 흐름과 가치 보존 노력
* 탐구선 3: 미래 인재로 선언하는 나만의 인생 핵심 가치 헌장
[교수학습 활동]
- 1~4차시: 우리 집 보물 1호 인터뷰 및 프레젠테이션
- 5~8차시: 나주 향토 역사서 연구 및 연계성 규명
- 9~12차시: 모둠별 공공 가치 캠페인 포스터 갤러리 피어 리뷰
      `,
      image: "🏠",
      views: 142,
      date: "2026-05-18",
      isOpenLesson: true,
      materialType: "지도안",
      period: "3/12차시"
    },
    {
      id: "les-2",
      grade: "5학년",
      theme: "세계가 돌아가는 방식 (How the World Works)",
      teacher: "박성우 교사",
      inquiryQuestion: "에너지의 영속적 변환과 자원의 공평한 분배는 어떻게 지속성을 담보하는가?",
      centralIdea: "에너지 자원에 관한 원인과 한계 탐구는 지속 가용한 보존 지혜를 발달시킨다.",
      concepts: "원인(Causation), 기능(Function)",
      description: "다양한 천연자원과 신재생 에너지 추출 원리를 물리적 도구를 통해 직접 실험하고, 나주 빛가람 혁신도시 스마트 그리드 센터 체험을 바탕으로 빛가람초등학교의 전력 과용 실태를 측정하여 실효성 높은 에너지 절감 방안 보고서를 학우들과 도출합니다.",
      direction: "1. 마찰·빛·바람 활용 전력 생산 간이 테스트\n2. 학내 사용하지 않는 교실 전기 누출 분석\n3. 자치 위원회에 '1교실 1조절 플러그 아웃' 의제 건의 및 추진",
      lessonPlanSim: `
[5학년 '세계가 돌아가는 방식' 통합 플래너 요약]
* 핵심개념: 기능, 원인
* 탐구선 1: 에너지의 변환 패턴과 우리 일상 전력 공급의 핵심 기능
* 탐구선 2: 유한 자원의 과소비가 환경 시스템에 유발시키는 원인과 파장
* 탐구선 3: 나주형 스마트 청정 행동을 실질적으로 전파하는 친환경 캠페인 설계
[주요 활동]
- 태양광 자가 미니 키트 조립 및 실외 광량에 따른 작동 전류 측정 정비
- 학년별 전력 소모량 데이터 통계 분석 연계
      `,
      image: "⚡",
      views: 215,
      date: "2026-06-25",
      isOpenLesson: true,
      materialType: "지도안",
      period: "5/10차시"
    },
    {
      id: "les-3",
      grade: "2학년",
      theme: "우리 자신을 표현하는 방법 (How We Express Ourselves)",
      teacher: "최은서 교사",
      inquiryQuestion: "몸동작과 언어의 소리는 서로 다른 문화와 감정을 어떻게 연결하는가?",
      centralIdea: "예술적 상상력과 신체 신호는 경계를 넘어 감정을 설득력 있게 방출한다.",
      concepts: "형태(Form), 반성(Reflection)",
      description: "세계 각국의 전통 가면극과 몸짓 예술 양식을 분석한 뒤, 학생들이 나만의 평화나 기쁨의 감정을 시각적 얼굴 가면으로 표현하고, 이를 활용해 비언어적 융합 마임 극을 직접 창작해 무대 나눔을 실행합니다.",
      direction: "1. 국가별 시각 가면 예술 디자인의 전형성 관찰\n2. 한지 가면을 통한 주관 감정 구현\n3. 마임 및 효과음만을 사용하여 친구들에게 이야기 전달하고 가치 맞추기",
      lessonPlanSim: `
[2학년 '표현 방식' 플래너 요약]
* 핵심개념: 형태, 반성
* 탐구선 1: 문화를 초월하여 존재해온 독특한 전형 가면에 투영된 인류의 공통 감정
* 탐구선 2: 소리와 표정, 비언어 신체 동작으로 깊은 메시지를 표명하는 정서 형태
[수업 흐름]
- 가면 형태 스케칭 및 컬러 페인팅
- 연극 무용 강사 초빙 극예술 협업 워크샵
      `,
      image: "🎭",
      views: 98,
      date: "2026-10-09",
      isOpenLesson: true,
      materialType: "지도안",
      period: "2/8차시"
    },
    {
      id: "les-4",
      grade: "6학년",
      theme: "우리 모두의 지구 (Sharing the Planet)",
      teacher: "강동우 교사",
      inquiryQuestion: "생물종 다양성과 인간의 산업 팽창 사이에서 지속적인 공존을 설계하는 방책은 무엇인가?",
      centralIdea: "생물권 교란은 생존의 거대한 고리 붕괴를 초래하며 보호 연대는 우리의 책임이다.",
      concepts: "연계성(Connection), 책임(Responsibility)",
      description: "로컬 영산강 에코 구역 조류들과 곤충 개체 수 급감 추이를 데이터로 수사하고 생물 다양성 위기 지도를 매핑합니다. 이와 더불어 나주시 자연 환경 부서에 생태 통로 개방 촉구 전자 민원 서한을 공동 대의로 합의해 전달하는 소셜 액션을 실천합니다.",
      direction: "1. 하천 보 주변 훼손 요인 조사\n2. 생물종 먹이사슬 상호 연계성 실물 인형 놀이 역할극\n3. 보호 메시지를 담은 고품질 공익 광고 카드뉴스 창작 및 전시",
      lessonPlanSim: `
[6학년 '우리 모두의 지구' 플래너 요약]
* 핵심개념: 연계성, 책임
* 탐구선 1: 영산강 자연생태계 사슬에 담긴 균형 잡힌 연계
* 탐구선 2: 오염 및 난개발이 서식 개체군 생태계에 입힌 위험성
* 탐구선 3: 생명의 다양성을 구제하기 위한 시민들의 사회적 의무와 공동체 행동 책임
[평가 과제]
- 하천 환경 연대 보호 광고 패널 제작 및 학교 앞 보도 현장 발표회
      `,
      image: "🌱",
      views: 310,
      date: "2026-11-04",
      isOpenLesson: true,
      materialType: "지도안",
      period: "4/8차시"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "5학년 신재생 에너지 탐구 및 스마트 그리드 시범 교육",
      grade: "5학년",
      category: "학습",
      theme: "세계가 돌아가는 방식 (How the World Works)",
      description: "직접 제작한 태양광 발전 패널과 풍력 에너지 풍차 모형을 들고 야외 운동장에서 빛의 세기에 따라 모터 속도가 얼마나 변하는지 초단위로 탐사하는 학생들의 몰입 가득한 순간입니다.",
      images: [
        "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1548613053-220efc620bf5?auto=format&fit=crop&w=600&q=80"
      ],
      files: ["energy_test_sheet.xlsx"],
      date: "2026-06-21"
    },
    {
      id: "gal-2",
      title: "그린 바자회 기금으로 꽃나무를 영산강변에 심은 '초록지기 6인조' Action",
      grade: "6학년",
      category: "Action",
      theme: "우리 모두의 지구 (Sharing the Planet)",
      description: "학급 나눔 장터에서 캔 음료 세척 및 도서 공평 유통으로 수금한 12만 원 수익금을 사용해 나주 묘목 센터에서 관목을 구입하고, 주말 아침 자발적으로 생태 수변공원에 꽃나무를 식재한 의미 깊은 시민 실천 Action 현장입니다.",
      images: [
        "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
      ],
      files: ["activity_outcome.pdf"],
      date: "2026-10-18"
    },
    {
      id: "gal-3",
      title: "3학년 '동물 서식지 설계도' 배움 나눔 포트폴리오 전시",
      grade: "3학년",
      category: "Portfolio",
      theme: "우리가 속한 공간과 시간 (Where We Are in Place and Time)",
      description: "서로 다른 대륙과 기후 조건에 서식하는 야생 동물들의 은신처와 쉼터 형태를 탐구해 도화지와 흙으로 완벽히 입체 복원했습니다. 자신의 탐구 여정을 일목요연하게 차트화하여 복도 스터디 갤러리에 설치했습니다.",
      images: [
        "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1576085898323-2183fa9bc376?auto=format&fit=crop&w=600&q=80"
      ],
      files: ["portfolio_index_gr3.pdf"],
      date: "2026-11-12"
    }
  ],
  community: [
    {
      id: "post-1",
      category: "공지",
      title: "★ 2026학년도 2학기 IB PYP 학부모 초청 학습 나눔회(Student-led Conference) 안내",
      author: "연구홍보부",
      content: "빛가람초 학부모님들께 경의를 표합니다.\\n드디어 한 해 동안 우리 아이들이 가슴 벅차게 수집해 온 탐구 결과물과 배움의 변화 과정을 부모님 앞에서 당당하게 펼치고 직접 지식 탐색 워크숍을 아이가 지도해드리는 '학생 주도 나눔 콘퍼런스'를 개최합니다.\\n\\n- 일시: 2026년 11월 27일 (금) 14:00 - 16:30\\n- 장소: 각 학년 교실 및 체육관 로비 개방 부스\\n- 준비물: 자녀의 열정에 감탄할 마음과 가감 없는 배움 상호 성찰 피드백\\n\\n교과서나 단답 점수표로는 절대로 보여줄 수 없었던 우리 빛가람 어린이들의 진화 가치를 온몸으로 만져보시는 감동의 자리에 많은 참석을 소망합니다.",
      date: "2026-11-10",
      likes: 24,
      views: 312,
      comments: [
        {
          id: "com-1",
          author: "박상철 (6학년 학부모)",
          content: "안내장 보고 벌써 설렙니다. 작년엔 교실 뒤에서 숨죽이고 구경만 했는데 아이가 직접 저를 앉혀두고 공부를 가르쳐 준다니 꼭 월차 내서 참석하겠습니다!",
          date: "2026-11-10"
        },
        {
          id: "com-2",
          author: "김지영 (4학년 학부모)",
          content: "아이가 요즘 집에서도 평가 루브릭 얘기하면서 자기 나눔 백업하고 있어요. 성장한 모습 기대할게요.",
          date: "2026-11-11"
        }
      ]
    },
    {
      id: "post-2",
      category: "의견 나눔",
      title: "인공지능 도구를 활용한 개념 탐구, 학부모님들의 시각은 어떤가요?",
      author: "연구부장 교사",
      content: "이번 고학년 UOI 단원 중 '정보 기술의 소통'을 연구하는 중에, 6학년 학생들이 AI 검색 도구(Gemini)와 크리에이티브 생성기 등을 직접 제어해 탐구 팩트를 가려내는 시도를 기획하고 있습니다.\\n인식의 긍정적인 면(신속한 핵심 정보 조합, 창조 시제품 시간 단축)과 신중을 기할 점(할루시네이션 가짜 정보 판별 훈련 부족, 지적 소유권 훼손) 중에서 어떠한 기풍으로 다듬으면 좋을지 학부모님 및 동료 연구 교육가님들의 넓고 혜안 깊은 소리를 듣고자 합니다.",
      date: "2026-10-05",
      likes: 18,
      views: 198,
      comments: [
        {
          id: "com-3",
          author: "이지은 교사",
          content: "IB 프로그램의 핵심인 '배움 접근방법(ATL) 중 정보 기량 학습' 관점상, 기기 차단 방식보다는 AI 질문의 정확성과 편향 조사를 아이들 스스로 검증하게 만드는 성찰 가이드라인을 내재화하는 방향이 훨씬 교육적 성장에 유익할 것 같습니다.",
          date: "2026-10-05"
        },
        {
          id: "com-4",
          author: "윤재민 아빠",
          content: "아이들이 어차피 마주할 미래 기술이라면 안전한 학교 환경 내에서 올바른 윤리 의식을 함께 고민하는 게 가장 좋겠습니다. 인공지능이 제공한 답변에 '왜 그럴까?'라는 반대 질문을 최소 세 번 던지게 훈련시키는 방법이 효과적이더군요.",
          date: "2026-10-06"
        }
      ]
    },
    {
      id: "post-3",
      category: "질문과 답변",
      title: "Q. 전입생인 경우에도 기존 UOI 탐구 진행에 무리가 없을까요?",
      author: "고민하는맘",
      content: "이번 2학기 도중에 빛가람초등학교로 전입을 고민하고 있는 3학년 학부모입니다.\\n아이가 활발하긴 하지만 이전에 일반 분과 전통 수업만 들어와서, 스스로 질문을 발굴하고 자료를 교차 정리해 협력 발표하는 특수한 IB 탐구 수업 방식을 전혀 경험해보지 못해 혹시라도 동료 전우인 모둠 학우들에게 짐이 되거나 주눅 이 들어 겉돌까 봐 무척이나 걱정이 앞섭니다. 적응을 도울 정비 시스템이 따로 구비되어 있는지 여쭈어봅니다.",
      date: "2026-08-22",
      likes: 9,
      views: 125,
      comments: [
        {
          id: "com-5",
          author: "빛가람지기",
          content: "전혀 걱정하실 필요 없습니다! 빛가람의 학급 협동 학습 분위기는 무척 따뜻하며, 전입 시 '탐구 또래 짝꿍 멘토 제도'를 즉시 구축하여 질문 연습 카드놀이 등으로 서서히 탐구 언어에 습관화되도록 돕습니다. 전입한 아이들의 목소리가 오히려 새로운 신선한 Perspective(관점)를 더해 주어 모둠원들이 더 환영하는 경우가 아주 가득합니다. 언제든 환영합니다!",
          date: "2026-08-23"
        }
      ]
    },
    {
      id: "post-4",
      category: "공감 게시판",
      title: "[학부모 소감] Student-led Conference에 다녀와서 남편과 나란히 울컥했습니다.",
      author: "다은아빠",
      content: "오늘 퇴근 직전에 간신히 시간 맞춰 2학년 교실 문을 열었습니다.\\n아침에 아이가 머리칼까지 단정하게 다듬으며 기다린 이유가 있더군요.\\n칠판에 귀엽게 그려진 학습 바퀴 마인드맵을 지나 아이의 자리에 마주 앉은 저에게, 작은 손가락으로 본인이 수집해 보관한 탐구 바인더를 페이지마다 조목조목 짚어가며 '우리가 정리가 되지 않은 쓰레기 섬 문제에 왜 슬퍼했는지, 그리고 이를 극복하기 위해 본인이 정한 루브릭이 무엇이며 다음번에 더 나은 성찰을 하려면 질문을 평소에 어떻게 바꿔보겠다'고 저에게 진지하게 조곤조곤 조언해주더군요.\\n\\n맞고 틀리는 성적 랭킹 번호에 매몰된 아이가 아니라, 본인이 행하는 지식에 정직하게 주도권을 쥔 어젓한 한 명의 인본적인 탐구자로 성장한 걸 보고 돌아오는 길에 가슴이 너무 요동쳤고 뭉클했습니다. 이런 멋진 교육 여건을 헌신적으로 설계해주신 빛가람초등학교 선생님들께 진심 어린 감사를 올립니다.",
      date: "2026-11-28",
      likes: 54,
      views: 421,
      comments: [
        {
          id: "com-6",
          author: "교장선생님",
          content: "학부모님의 따뜻하고 세심하신 사려 깊은 성찰 감사 글이 되려 저희 빛가람 모든 가르침 일꾼들에게 몇 마디 말로 형용할 수 없는 크나큰 최고의 영양제이자 전율이 됩니다. 아이의 시선에 온전히 동참하고 안아주신 부모님의 동반자적 자세가 있기에 비로소 탐구는 가능했습니다. 앞으로도 지식을 넘어 인격이 빛나는 학교를 다듬겠습니다.",
          date: "2026-11-28"
        }
      ]
    }
  ],
  footer: {
    intro: "빛가람초등학교는 대한민국 전라남도 나주시 배멧3길 19에 위치하고 있으며, 전라남도교육청에서 공식 지정한 IB PYP 연구학교로서 학생 중심 교육의 미래 지평을 선도적으로 개막하고 있습니다.",
    address: "(58223) 전라남도 나주시 배멧3길 19 (빛가람동, 빛가람초등학교)",
    phone: "061-330-8500",
    email: "bitgarames@korea.kr",
    copyright: "© 2026 Bitgaram Elementary School & IB PYP Research Committee. All Rights Reserved.",
    links: [
      { name: "빛가람초등학교", url: "http://bgr.es.jne.kr" },
      { name: "전라남도교육청", url: "https://www.jne.go.kr" },
      { name: "국제바칼로레아(IB) 기구 공식포털", url: "https://www.ibo.org" },
      { name: "전남교육청 교육연구정보원", url: "https://www.jnei.go.kr" }
    ]
  }
};
