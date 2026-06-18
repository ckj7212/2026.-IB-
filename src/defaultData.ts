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
      "초학문적 주제(Transdisciplinary Themes) 중심의 UOI 탐구 교육과정을 설계 및 실천하여 깊이 있는 배움 구현",
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
    // --- 1-가 ---
    {
      id: "task-1-a-1",
      themeNum: 1,
      subThemeName: "가",
      subThemeTitle: "교사 전문학습공동체(PLC) 혁신",
      taskCode: "1-가-1)",
      title: "학년단위 주간 UOI 공동 워크숍 편성 및 협력 설계 확대",
      bg: "교사 개인별 UOI 설계 역량 격차를 극복하고, 동학년 교사들의 연구 집단지성을 정규 교육과정 시간 내에 확보하고자 함.",
      text: "매주 수요일 오후 5-6교시를 '학년 공동 설계 시간'으로 고정 지정하고, 전문 설계 패널(플래너 캔버스)을 구축하여 협력 설계를 상시화했습니다.",
      methods: [
        "학년별 3~4인 규모 동학년 설계 분과 가동",
        "수요일 성찰 공동 설계 워크숍 34회 진행",
        "개념 기반 탐구 설계용 동료 피드백 템플릿 개발"
      ],
      cases: [
        "4학년 교사들이 '우리가 살아가는 시공간' 단원 플래너를 5회 공동 검수하여 교과 간 인과성 지도를 완성함"
      ],
      resources: [
        "동학년 UOI 협동설계 가이드북",
        "개념 탐색 도출 시각화 카드"
      ],
      impact: "교사들의 기획 자신감이 사전 대비 24%p 대폭 신장되었으며 가르침 만족도가 증가했습니다."
    },
    {
      id: "task-1-a-2",
      themeNum: 1,
      subThemeName: "가",
      subThemeTitle: "교사 전문학습공동체(PLC) 혁신",
      taskCode: "1-가-2)",
      title: "IB PYP 공식 연수 및 전남교육청 지정 연사 초빙 컨설팅 실행",
      bg: "IB PYP 프레임워크의 대내외 엄격성에 부응하고 국제 바칼로레아 기조의 최신 컨설팅 지식을 수용하고자 함.",
      text: "교육청 지정 IB PYP 수석 교사 및 주 책임 컨설턴트를 매월 정기 초빙하여 학내 워크숍을 심층 가동하고 연수를 지원했습니다.",
      methods: [
        "교원 1인당 최소 60시간 이상의 공식 PYP 온라인/지정 연수 이수",
        "전문 컨설턴트 밀착 동행 UOI 수업 실사 컨설팅 4회 가동",
        "타 연구학교 부장교사 초청 강연"
      ],
      cases: [
        "나주 혁신도시 타 연구학교와의 우수 교안 피드백 교류회를 통해 상호 성찰 지점 보완"
      ],
      resources: [
        "IB 최신 학습접근방식(ATL) 요약서",
        "컨설턴트 작성 자문 성찰서"
      ],
      impact: "전체 교사 중 95% 이상이 개념 기반 탐구 수업 모형의 핵심 지식을 능동적으로 설명 및 현장 배치가 가능해짐."
    },
    {
      id: "task-1-a-3",
      themeNum: 1,
      subThemeName: "가",
      subThemeTitle: "교사 전문학습공동체(PLC) 혁신",
      taskCode: "1-가-3)",
      title: "교사 간 다차원 성찰적 수업 참관 피드백 정형화",
      bg: "단순히 보여주기식의 지식 전달형 수업 공개에서 탈피하고 동료 교사 간 주체적인 협력 피드백 체계를 갖춤.",
      text: "줄 세우기식 평가가 아니라, 수업 중 아동 주도성이 분출된 장면과 설계 의도가 일치한 부분을 동영상 성찰 분석법으로 상호 연구 피드백했습니다.",
      methods: [
        "동영상 성찰 기반 참관 일지 양식 배포",
        "참관 후 ‘칭찬 2가지, 다르게 해볼 제안 1가지’ 안착",
        "성찰적 마주보기 세미나 정례화"
      ],
      cases: [
        "3학년 공개수업 후 ‘질문 유도 발문법’에 초점을 두어 4명의 동료 교사가 비디오 성찰 보고서를 작성해 공유함"
      ],
      resources: [
        "성찰 중심 참관 프로토콜",
        "비디오 피드백 체크리스트"
      ],
      impact: "자기 수업 공개에 대한 두려움이 소멸하고 신뢰에 기반한 개방적 협업 기풍이 정착되었습니다."
    },
    // --- 1-나 ---
    {
      id: "task-1-b-1",
      themeNum: 1,
      subThemeName: "나",
      subThemeTitle: "초학문적 탐구 교안 통합 조율 및 얼라인먼트",
      taskCode: "1-나-1)",
      title: "6대 초학문적 주제 가로·세로축 얼라인먼트 매핑 정비",
      bg: "학년 간 탐구 주제의 무분별한 중복을 회피하고 학년의 난이도 도약에 따른 나선형 탐구 도달선 정비 필요.",
      text: "1학년부터 6학년까지 매핑 차트를 실물 전시하여 6대 주제별 핵심 개념과 ATL 매칭을 일목요연하게 입체 정렬시켰습니다.",
      methods: [
        "빛가람초 UOI 통합 마스터 크로스 차트 수립"
      ],
      cases: [
        "6학년의 영산강 환경 보호 캠페인이 SNS 지자체 부서에 전달되어 정식 피드백과 서명 응답을 확보함"
      ],
      resources: [
        "실천 캠페인 가이드북",
        "서명 및 피드백 기록 보드"
      ],
      impact: "가정과 학교가 완벽하게 일관된 PYP 탐색 언어로 단일 결속되어 배움 생태계를 원활히 유지합니다."
    },
    {
      id: "task-2-b-1",
      themeNum: 2,
      subThemeName: "나",
      subThemeTitle: "개념 및 질문 기반 교실 실천",
      taskCode: "2-나-1)",
      title: "개념적 렌즈(Conceptual Lens)를 활용한 핵심 질문 탐색",
      bg: "단순 열거 지식 습득에서 탈피하여 기능(Function), 변화(Change), 연결(Connection) 등의 개념 키워드를 통해 세상을 바라봄.",
      text: "모든 학급에 7대 핵심 개념 자석 보드를 배치하고, 배움 매뉴얼마다 아동의 생각을 개념적 렌즈를 통해 확장하는 질문법을 적용했습니다.",
      methods: [
        "개념 핵심 키워드 카드 매핑",
        "질문 던지기 릴레이 게임",
        "생각 모음 나무 구축"
      ],
      cases: [
        "3학년의 소그룹 자석 카드 분류 학습"
      ],
      resources: [
        "개념 자석 세트",
        "핵심 질문 디자인 북"
      ],
      impact: "아동들은 현상을 보고 배후의 인과관계나 관점의 다양성을 질문하는 비판적 사고 기틀을 다졌습니다."
    },
    {
      id: "task-2-b-2",
      themeNum: 2,
      subThemeName: "나",
      subThemeTitle: "개념 및 질문 기반 교실 실천",
      taskCode: "2-나-2)",
      title: "인형극 및 연극 기반 아동 주도 드라마 UOI 학습실행",
      bg: "텍스트 중심 교실을 역동적인 인격 교감 및 예술 표현의 장으로 승화시키고자 극적 표현을 도입함.",
      text: "인물과 사회의 갈등, 역사적 의제에 대하여 모둠별로 직접 각본을 쓰고 인형극을 시행해 보며 복잡한 세상을 입체적으로 학습했습니다.",
      methods: [
        "마스크 및 아케타입 캐릭터 디자인",
        "모둠별 인형극 공연 세션",
        "사후 인물 성찰 나눔"
      ],
      cases: [
        "4학년의 역사 의제 연동 자치인형극 시행"
      ],
      resources: [
        "인형극 마스크 아키타입 북",
        "효과음 음원 및 보조 교안"
      ],
      impact: "아동 상호 간 정서 유대감이 향상되고 관계 자신감이 향상되는 고무적 효과창출."
    },
    {
      id: "task-2-b-3",
      themeNum: 2,
      subThemeName: "나",
      subThemeTitle: "개념 및 질문 기반 교실 실천",
      taskCode: "2-나-3)",
      title: "영산강 서식 생물 조사 및 생태통로 개방 요구 전자 청원",
      bg: "지식이 실제적 삶과 사회의 법적, 행정적 정책과 일맥상통하며 변화를 연출하는 행동 체계를 가동함.",
      text: "영산강 생태 탐사단 활동 후, 차집관 및 도로 건설로 끊어진 야생 너구리 등 생태 단절로를 입체 분석하여 해결안을 건의했습니다.",
      methods: [
        "하천 식물과 조류 곤충 24종 현장 분포 모니터링",
        "나주 환경공학과 교수 초빙 온라인 컨설팅 실행",
        "생태 편지 및 영산강 시 공무원 수신 전자 메일 건의 발송"
      ],
      cases: [
        "6학년 3반 모둠의 ‘로드킬 대책도’가 정식 지자체 부서에 도달하여 민원 성찰 답변 달성"
      ],
      resources: [
        "영산강 생물도판 워크북",
        "행정서한 작법 프레임"
      ],
      impact: "공공의 사명에 적극 헌신하는 ‘책임(Responsibility)’ 개념의 진정한 내면 성장을 확인했습니다."
    },

    // --- 3-가 ---
    {
      id: "task-3-a-1",
      themeNum: 3,
      subThemeName: "가",
      subThemeTitle: "성찰형 과정 평가 정착",
      taskCode: "3-가-1)",
      title: "루브릭 공동 수립 및 아동 친화형 리라이팅 안착",
      bg: "평가는 단지 교사만의 점수 부여 독점물에서 벗어나, 아동도 목표와 성취 준거를 알고 자기 점검 능력을 개발하고자 함.",
      text: "UOI 단원 개시 때 평가 명세표를 아동 맞춤 단어로 재정의하는 리라이팅(Student-friendly Rubric)을 전체 도입했습니다.",
      methods: [
        "학습 지표 카드를 사용한 단어 변환 세미나",
        "자기평가, 동료평가용 3단계 시각 성찰 바퀴 공유",
        "평가 준거 벽면 상시 게시제 가동"
      ],
      cases: [
        "4학년 '글로벌 무역' 단원에서 '탁월한 발표자'의 기준을 '친구의 눈을 보고 또박또박 3가지 근거를 통해 설득하는 것'으로 합의 기벽 게시"
      ],
      resources: [
        "아동 눈높이 평가 준거 변환 시트",
        "자가 진단용 시각 신호판"
      ],
      impact: "무엇을 계획하고 무엇을 더 연구해야 하는지 자정하는 메타인지 주도성이 크게 증가하였습니다."
    },
    {
      id: "task-3-a-2",
      themeNum: 3,
      subThemeName: "가",
      subThemeTitle: "성찰형 과정 평가 정착",
      taskCode: "3-가-2)",
      title: "아동 자기 성찰 3단계 일지 매 차시 연계 정합성 강화",
      bg: "하루하루의 배움을 허투루 흘려보내지 않고, 성취 내용과 당면 결핍 요체를 꼼꼼히 기록하여 성장을 촉진함.",
      text: "학년에 맞는 ‘배운 것 / 더 연구할 것 / 적용할 동행 행동’ 템플릿을 개발해 매주 정규 탐구 시간 직후 성찰 일지로 수집했습니다.",
      methods: [
        "저학년용 그림 성찰 및 스티커 레터",
        "고학년용 ATL 기여 역량 자가 점수 분석 휠 적용",
        "성찰 기록물의 주말 가정 발신 동행"
      ],
      cases: [
        "3학년 이** 아동이 '인과관계' 성찰 후 매일 급식을 남기던 습관을 수정해 '음식 쓰레기가 지구 온난화에 미치는 영향'을 일지에 작성함"
      ],
      resources: [
        "3단계 성찰 휠 다이어그램 가이드",
        "학년부 특화 일지 가제본"
      ],
      impact: "단순 지식 암기가 아닌 자신의 행동을 세계와 결부시키는 성찰 인격 정립에 성공하였습니다."
    },
    {
      id: "task-3-a-3",
      themeNum: 3,
      subThemeName: "가",
      subThemeTitle: "성찰형 과정 평가 정착",
      taskCode: "3-ga-3)",
      title: "동료 다차원 상호 피드백 및 배움 성찰 분석 포트폴리오 기틀",
      bg: "동료들의 배움 동반자적 인식을 제고하고 혼자만의 배움이 아닌 ‘생각의 나눔 교차성’을 공고화하고자 함.",
      text: "모둠의 진행을 회고 보드(Scrum Board)로 시각화하고 동료의 탐색 경로에 격려와 추천 의견을 교섭 연동했습니다.",
      methods: [
        "동료 칭찬 릴레이 및 '성장 피어 피드백' 화법 훈련",
        "포트폴리오 바인더 내 피어(Peer) 배지 연동",
        "교사-학생 1:1 체크인 상담 정례화"
      ],
      cases: [
        "6학년의 세계 종교 탐색 PPT에서 동료들이 슬라이드마다 덧대어 준 성찰 코멘트로 논증 정밀성 증가"
      ],
      resources: [
        "동료 코멘터용 포스트잇 규칙판",
        "포트폴리오 우수 복각본"
      ],
      impact: "경합 경쟁보다는 동료 관계가 한층 유순해지고 상호 협조 문화 기반의 집단 시너지 증폭."
    },
    // --- 3-나 ---
    {
      id: "task-3-b-1",
      themeNum: 3,
      subThemeName: "나",
      subThemeTitle: "학교 공동체성 성장 나눔제",
      taskCode: "3-나-1)",
      title: "학기말 학부모 초청 Student-led Conference 괄목 안착",
      bg: "부모를 수동 참관인 범주에서 전격 동참인으로 승격하고, 아동은 부모의 면전에서 복합적 지식을 브리핑하게 유도.",
      text: "카드 성적표 배포 대신, 학기 말 아동이 부모의 손을 잡고 부스를 회전하며 꼼꼼히 설명하는 나눔회를 설계했습니다.",
      methods: [
        "학급당 부모 동반 1:1 지식 브리핑 동선 설계",
        "아이가 부모에게 직접 개념 질문을 가르쳐주는 코스 도입",
        "가정 연계 성찰 편지 세션 교섭"
      ],
      cases: [
        "학부모 210여 명이 참석하여 '우리 아이가 직접 배움의 변화를 조리 있게 발표하는 깊이에 큰 전율과 눈물을 흘렸다'고 전해옴"
      ],
      resources: [
        "나눔회 오리엔테이션 요약 안내",
        "학부모 다차원 피드백 북"
      ],
      impact: "학교에 대한 신뢰가 100%에 달성되며 가정과 교육 공동체의 일체감이 구현되었습니다."
    },
    {
      id: "task-3-b-2",
      themeNum: 3,
      subThemeName: "나",
      subThemeTitle: "학교 공동체성 성장 나눔제",
      taskCode: "3-나-2)",
      title: "배움나눔 포트폴리오 수집 및 누적 성장 보고서 연계",
      bg: "수집된 낱장 종이가 성찰 없이 유실되는 우려를 차단하고, 1년간의 지적 진화 과정을 누적 보존함.",
      text: "학생들의 UOI 최종 가공본, 실물 사진, 탐색 보고서 등을 디지털화 한 자산 백업 시스템을 구축했습니다.",
      methods: [
        "개인별 UOI 아카이브 구축",
        "연말 1년 탐색 성장 자취 포트폴리오전 개최",
        "환경 친화적 디지털 아카이빙 적극 도모"
      ],
      cases: [
        "5학년 전체의 에너지 단원 실천 보고서와 사진을 포털로 정밀 업로드해 항구 기록 보관"
      ],
      resources: [
        "성찰 바인더 인쇄 양식",
        "디지털 업로드 규격 매뉴얼"
      ],
      impact: "누적 성장 폭을 목도한 아동과 부모가 배움에 대한 자부심과 자기 효능감 확보."
    },
    {
      id: "task-3-b-3",
      themeNum: 3,
      subThemeName: "나",
      subThemeTitle: "학교 공동체성 성장 나눔제",
      taskCode: "3-나-3)",
      title: "삼주체 연동 참관 성찰 레터 환류 체계 체득화",
      bg: "나눔 행사를 일시적인 퍼포먼스로 끝내지 않고 가정에서의 지속적 탐구 연대를 마련하고자 성찰 루프 구축.",
      text: "부모 격려 레터를 교정 전시판에 1달간 게시하고, 아동은 이에 보답 답장을 쓰며 교사가 마무리 성찰 기록하는 종합 환류입니다.",
      methods: [
        "지정 3파트 레프(Reflective) 카드 발간",
        "동학년 교실 교차 게시 및 우수 발자취 성찰회 개최",
        "우수 수신 소감문 학보 보급 연대"
      ],
      cases: [
        "‘우리가 소비하는 물’ 단원에서 부모-아동-교사가 상호 레터를 완성해 나주 시청 자원순환과에 정정 전시"
      ],
      resources: [
        "참관 피드백 레터 공식 양식",
        "사랑-성장 우체통 키트"
      ],
      impact: "가정과 학교가 완벽하게 일관된 PYP 탐색 언어로 단일 결속되어 배움 생태계를 원활히 유지합니다."
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
      content: "빛가람초 학부모님들께 경의를 표합니다.\n드디어 한 해 동안 우리 아이들이 가슴 벅차게 수집해 온 탐구 결과물과 배움의 변화 과정을 부모님 앞에서 당당하게 펼치고 직접 지식 탐색 워크숍을 아이가 지도해드리는 '학생 주도 나눔 콘퍼런스'를 개최합니다.\n\n- 일시: 2026년 11월 27일 (금) 14:00 - 16:30\n- 장소: 각 학년 교실 및 체육관 로비 개방 부스\n- 준비물: 자녀의 열정에 감탄할 마음과 가감 없는 배움 상호 성찰 피드백\n\n교과서나 단답 점수표로는 절대로 보여줄 수 없었던 우리 빛가람 어린이들의 진화 가치를 온몸으로 만져보시는 감동의 자리에 많은 참석을 소망합니다.",
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
      content: "이번 고학년 UOI 단원 중 '정보 기술의 소통'을 연구하는 중에, 6학년 학생들이 AI 검색 도구(Gemini)와 크리에이티브 생성기 등을 직접 제어해 탐구 팩트를 가려내는 시도를 기획하고 있습니다.\n인식의 긍정적인 면(신속한 핵심 정보 조합, 창조 시제품 시간 단축)과 신중을 기할 점(할루시네이션 가짜 정보 판별 훈련 부족, 지적 소유권 훼손) 중에서 어떠한 기풍으로 다듬으면 좋을지 학부모님 및 동료 연구 교육가님들의 넓고 혜안 깊은 소리를 듣고자 합니다.",
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
      content: "이번 2학기 도중에 빛가람초등학교로 전입을 고민하고 있는 3학년 학부모입니다.\n아이가 활발하긴 하지만 이전에 일반 분과 전통 수업만 들어와서, 스스로 질문을 발굴하고 자료를 교차 정리해 협력 발표하는 특수한 IB 탐구 수업 방식을 전혀 경험해보지 못해 혹시라도 동료 전우인 모둠 학우들에게 짐이 되거나 주눅 이 들어 겉돌까 봐 무척이나 걱정이 앞섭니다. 적응을 도울 정비 시스템이 따로 구비되어 있는지 여쭈어봅니다.",
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
      content: "오늘 퇴근 직전에 간신히 시간 맞춰 2학년 교실 문을 열었습니다.\n아침에 아이가 머리칼까지 단정하게 다듬으며 기다린 이유가 있더군요.\n칠판에 귀엽게 그려진 학습 바퀴 마인드맵을 지나 아이의 자리에 마주 앉은 저에게, 작은 손가락으로 본인이 수집해 보관한 탐구 바인더를 페이지마다 조목조목 짚어가며 '우리가 정리가 되지 않은 쓰레기 섬 문제에 왜 슬퍼했는지, 그리고 이를 극복하기 위해 본인이 정한 루브릭이 무엇이며 다음번에 더 나은 성찰을 하려면 질문을 평소에 어떻게 바꿔보겠다'고 저에게 진지하게 조곤조곤 조언해주더군요.\n\n맞고 틀리는 성적 랭킹 번호에 매몰된 아이가 아니라, 본인이 행하는 지식에 정직하게 주도권을 쥔 어젓한 한 명의 인본적인 탐구자로 성장한 걸 보고 돌아오는 길에 가슴이 너무 요동쳤고 뭉클했습니다. 이런 멋진 교육 여건을 헌신적으로 설계해주신 빛가람초등학교 선생님들께 진심 어린 감사를 올립니다.",
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
