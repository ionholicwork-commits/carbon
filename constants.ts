
import { EndingType, EndingContent, AppPage, BackgroundProfile } from './types';

export const APP_TITLE = "탄소 위기 시나리오 생성기";

export const STEPS = [
  { id: AppPage.CHARACTER_CREATION, name: '캐릭터 생성' },
  { id: AppPage.PROLOGUE_GENERATION, name: '프롤로그' },
  { id: AppPage.ENDING_GENERATION, name: '엔딩' },
  { id: AppPage.FULL_SCENARIO, name: '최종 시나리오' },
];


export const ENDING_DETAILS: Record<EndingType, { title: string; description: string; promptInfo: string }> = {
  [EndingType.CARBON_NEUTRALITY_SUCCESS]: {
    title: "탄소중립 성공",
    description: "탄소 중립에 성공하여 문제가 해결된 미래",
    promptInfo: "탄소중립에 완벽히 성공하여 게임의 핵심 테마와 관련된 모든 문제가 해결된, 희망차고 밝은 미래를 명백한 해피엔딩으로 그려주세요. 이 위대한 성공이 인류와 자연에 가져온 긍정적인 변화와 행복한 감정을 구체적으로 묘사해야 합니다. 성취감과 기쁨이 느껴지는 등장인물의 대화를 포함해주세요."
  },
  [EndingType.CARBON_NEUTRALITY_FAILURE]: {
    title: "탄소 중립 실패",
    description: "탄소중립에 실패하여 문제가 악화된 미래",
    promptInfo: "탄소중립 노력이 실패로 돌아가고, 게임의 핵심 테마와 관련된 탄소 배출 문제가 더욱 악화되어 절망적인 미래가 펼쳐진 시나리오를 그려주세요. 이 비극적인 상황 속 등장인물의 대화를 포함해주세요."
  },
  [EndingType.RESIDENT_HAPPINESS_FAILURE]: {
    title: "행복도 관리 실패",
    description: "탄소중립을 시도하다 사람들의 반발이 심해진 미래",
    promptInfo: "탄소중립 정책을 추진하는 과정에서 시민들의 거센 반발에 직면하여 사회적 갈등이 심화되고, 결과적으로 주민 행복도 관리에 실패한 시나리오를 작성해주세요. 이 상황이 게임의 핵심 테마와 어떻게 연결되는지, 그리고 탄소 배출 관련 노력에 어떤 영향을 미쳤는지 (예: 정책 후퇴, 부분적 성공에도 불구하고 사회 불안정 등) 구체적으로 설명하고, 등장인물의 대화를 포함해주세요."
  },
};

export const ORDERED_ENDING_TYPES: EndingType[] = [
  EndingType.CARBON_NEUTRALITY_SUCCESS,
  EndingType.CARBON_NEUTRALITY_FAILURE,
  EndingType.RESIDENT_HAPPINESS_FAILURE,
];

export const INITIAL_ENDING_CONTENT: EndingContent[] = ORDERED_ENDING_TYPES.map(type => ({
  type,
  title: ENDING_DETAILS[type].title,
  description: ENDING_DETAILS[type].description, // This is the user-facing description for the ending choice
  scenario: '',
  isGenerated: false,
  image: { isLoading: false, isGenerated: false, error: null, skipped: false },
}));

export const CHARACTER_OPTIONS = {
  genders: ['남', '여'],
  ages: ['청소년', '청년', '중년', '노년'],
  nationalities: ['미국', '중국', '케냐', '영국', '한국'],
  occupations: ['학생', '과학자', '환경 운동가', 'CEO', '정치인'],
  outfits: ['캐쥬얼', '모던', '스트리트', '빈티지', '전통의상', '아웃도어', '유니폼'],
  artStyles: ['애니메이션', '90s 애니', '웹툰', '유화', '픽셀아트', '라인아트', 'SD캐릭터', '반실사'],
};

// --- [LOCAL ASSET IMAGES] ---
// Used primarily for Dashboard mode or fallbacks. 
// Wizard mode now uses Rich Text/Emoji cards defined below.
const ASSET_BASE = "/assets/images";

export const OPTION_IMAGES: Record<string, Record<string, string>> = {
  nationality: {
    '미국': `${ASSET_BASE}/nationality/usa.jpg`,
    '중국': `${ASSET_BASE}/nationality/china.jpg`,
    '케냐': `${ASSET_BASE}/nationality/kenya.jpg`,
    '영국': `${ASSET_BASE}/nationality/uk.jpg`,
    '한국': `${ASSET_BASE}/nationality/korea.jpg`,
  },
  occupation: {
    '학생': `${ASSET_BASE}/occupation/student.jpg`,
    '과학자': `${ASSET_BASE}/occupation/scientist.jpg`,
    '환경 운동가': `${ASSET_BASE}/occupation/activist.jpg`,
    'CEO': `${ASSET_BASE}/occupation/ceo.jpg`,
    '정치인': `${ASSET_BASE}/occupation/politician.jpg`,
  },
  outfit: {
    '캐쥬얼': `${ASSET_BASE}/outfit/casual.jpg`,
    '모던': `${ASSET_BASE}/outfit/modern.jpg`,
    '스트리트': `${ASSET_BASE}/outfit/street.jpg`,
    '빈티지': `${ASSET_BASE}/outfit/vintage.jpg`,
    '전통의상': `${ASSET_BASE}/outfit/traditional.jpg`,
    '아웃도어': `${ASSET_BASE}/outfit/outdoor.jpg`,
    '유니폼': `${ASSET_BASE}/outfit/uniform.jpg`,
  },
  artStyle: {
    '애니메이션': `${ASSET_BASE}/artStyle/anime.jpg`,
    '웹툰': `${ASSET_BASE}/artStyle/webtoon.jpg`,
    '라인아트': `${ASSET_BASE}/artStyle/line_art.jpg`,
    '유화': `${ASSET_BASE}/artStyle/oil_painting.jpg`,
    '90s 애니': `${ASSET_BASE}/artStyle/90s_anime.jpg`,
    '픽셀아트': `${ASSET_BASE}/artStyle/pixel_art.jpg`,
    'SD캐릭터': `${ASSET_BASE}/artStyle/sd_character.jpg`,
    '반실사': `${ASSET_BASE}/artStyle/semi_realistic.jpg`,
  }
};

// --- [RICH DETAILS FOR WIZARD UI] ---

export const NATIONALITY_DETAILS: Record<string, { emoji: string; title: string; keywords: string[]; description: string }> = {
  '미국': {
    emoji: '🇺🇸',
    title: '미국',
    keywords: ['첨단 기술', '과잉 소비', '역사적 책임'],
    description: '역사적으로 가장 오랫동안\n가장 많은 탄소를 배출해 온 국가입니다.\n\n높은 에너지 소비와 책임 회피로 비판받지만,\n가장 진보된 기술력을 보유하고 있습니다.'
  },
  '중국': {
    emoji: '🇨🇳',
    title: '중국',
    keywords: ['세계의 공장', '개발도상국', '최다 배출'],
    description: "현재 연간 탄소 배출량이 세계 1위인 '세계의 공장'입니다.\n경제 성장을 위해 탄소 배출이 불가피하다는\n개발도상국(Global South)의 논리를 대변합니다."
  },
  '케냐': {
    emoji: '🇰🇪',
    title: '케냐',
    keywords: ['기후 피해', '가뭄', '회복력'],
    description: '아프리카 대륙은 전 세계 탄소 배출의 4% 미만을 차지하지만,\n기후 변화로 인한 가뭄과 홍수 피해는\n가장 심각하게 겪고 있습니다.'
  },
  '영국': {
    emoji: '🇬🇧',
    title: '영국',
    keywords: ['산업혁명', '에너지 전환', '기후 정책'],
    description: "인류 최초로 석탄을 태워 산업혁명을 일으킨 장본인이지만,\n현재는 석탄 발전을 거의 중단하고 가장 강력한\n기후 정책을 펼치는 '기후 모범국'을 자처합니다."
  },
  '한국': {
    emoji: '🇰🇷',
    title: '한국',
    keywords: ['제조업', '수출 중심', '딜레마'],
    description: '반도체, 자동차, 철강 등 전기를 많이 쓰는 제조업 국가입니다.\n"줄이자니 공장이 멈추고, 안 줄이면 수출이 막히는"\n경제적 딜레마를 겪고 있습니다.'
  }
};

export const OCCUPATION_DETAILS: Record<string, { emoji: string; title: string; keywords: string[]; description: string }> = {
  '학생': {
    emoji: '🎒',
    title: '학생',
    keywords: ['미래 세대', '목소리', '희망'],
    description: '기후 위기의 직접적인 피해자이자 미래의 주인입니다.\n어른들의 결정을 비판적인 시각으로 바라보며\n변화를 갈망합니다.'
  },
  '과학자': {
    emoji: '🧪',
    title: '과학자',
    keywords: ['데이터', '혁신', '이성'],
    description: '냉철한 데이터와 기술로 무장한 전문가입니다.\n감정보다는 사실에 기반하여 인류를 구원할 해결책을\n끊임없이 연구합니다.'
  },
  '환경 운동가': {
    emoji: '📢',
    title: '환경 운동가',
    keywords: ['열정', '행동', '저항'],
    description: '거리에서 직접 행동하며 사회의 변화를 촉구합니다.\n기득권에 맞서 싸우며 사람들의 인식을 깨우기 위해\n노력합니다.'
  },
  'CEO': {
    emoji: '🏢',
    title: 'CEO',
    keywords: ['경제', '책임', '딜레마'],
    description: '기업의 이익 창출과 탄소 중립이라는 사회적 책임 사이에서\n균형을 찾아야 합니다.\n자본과 기술력으로 세상을 바꿀 힘을 가지고 있습니다.'
  },
  '정치인': {
    emoji: '⚖️',
    title: '정치인',
    keywords: ['정책', '타협', '리더십'],
    description: '복잡한 이해관계를 조율하고 결단을 내리는 리더입니다.\n경제 성장과 환경 보전 사이에서\n끊임없는 딜레마를 겪습니다.'
  }
};

export const OUTFIT_DETAILS: Record<string, { emoji: string; title: string; keywords: string[]; description: string }> = {
  '캐쥬얼': {
    emoji: '👕',
    title: '캐주얼',
    keywords: ['편안함', '데일리', '심플'],
    description: '활동하기 편한 T셔츠와 청바지,\n일상적인 느낌을 주는 가장 보편적인 스타일입니다.'
  },
  '모던': {
    emoji: '🧥',
    title: '모던',
    keywords: ['세련됨', '도시적', '미니멀'],
    description: '도시적인 세련미가 돋보이는 깔끔한 코트와 슬랙스,\n군더더기 없는 미니멀리즘을 추구합니다.'
  },
  '스트리트': {
    emoji: '🧢',
    title: '스트리트',
    keywords: ['힙합', '자유', '대담함'],
    description: '자유분방함과 개성이 넘치는 힙합 스타일,\n후드티와 헐렁한 핏으로 역동적인 느낌을 줍니다.'
  },
  '빈티지': {
    emoji: '🎞️',
    title: '빈티지',
    keywords: ['레트로', '향수', '클래식'],
    description: '세월의 흔적이 멋스러운 레트로 자켓이나 색바랜 청바지,\n아날로그 감성을 자극합니다.'
  },
  '전통의상': {
    emoji: '🎎',
    title: '전통의상',
    keywords: ['문화', '유산', '뿌리'],
    description: '각 지역의 고유한 문화와 역사가 담긴 아름다운 복식으로,\n캐릭터의 정체성을 강하게 드러냅니다.'
  },
  '아웃도어': {
    emoji: '🧗',
    title: '아웃도어',
    keywords: ['생존', '자연', '실용성'],
    description: '거친 환경에서도 견딜 수 있는 기능성 등산복이나 생존 장비,\n실용성을 최우선으로 합니다.'
  },
  '유니폼': {
    emoji: '🦺',
    title: '유니폼',
    keywords: ['의무', '전문가', '역할'],
    description: '직업이나 소속을 나타내는 제복 혹은 작업복으로,\n캐릭터의 사회적 역할과 전문성을 강조합니다.'
  }
};

export const ART_STYLE_DETAILS: Record<string, { emoji: string; title: string; keywords: string[]; description: string }> = {
  '애니메이션': {
    emoji: '🎬',
    title: '애니메이션',
    keywords: ['시네마틱', '선명함', '고퀄리티'],
    description: '선명한 색감과 화려한 조명 효과가 돋보이는\n고퀄리티 극장판 애니메이션 스타일입니다.'
  },
  '90s 애니': {
    emoji: '📼',
    title: '90s 애니',
    keywords: ['레트로', '향수', '셀화'],
    description: '셀화 특유의 입자가 느껴지는 레트로 스타일,\n90년대의 향수와 감성을 자극합니다.'
  },
  '웹툰': {
    emoji: '📱',
    title: '웹툰',
    keywords: ['스크롤', '톡톡 튀는', '선화'],
    description: '한국 웹툰 특유의 또렷한 선과 화려한 채색,\n캐릭터의 표정이 살아있는 스타일입니다.'
  },
  '유화': {
    emoji: '🖼️',
    title: '유화',
    keywords: ['질감', '클래식', '명화'],
    description: '캔버스의 질감과 묵직한 붓터치가 느껴지는\n고전 명화 스타일로, 중후한 분위기를 연출합니다.'
  },
  '픽셀아트': {
    emoji: '👾',
    title: '픽셀아트',
    keywords: ['8비트', '게임', '디지털'],
    description: '도트 하나하나가 모여 만드는 고전 게임 그래픽,\n독특한 디지털 감성을 표현합니다.'
  },
  '라인아트': {
    emoji: '✒️',
    title: '라인아트',
    keywords: ['잉크', '스케치', '단색'],
    description: '검은 펜선으로 세밀하게 묘사된 잉크 일러스트 스타일,\n명암 대비와 선의 디테일이 돋보입니다.'
  },
  'SD캐릭터': {
    emoji: '🧸',
    title: 'SD 캐릭터',
    keywords: ['귀여움', '미니', 'SD'],
    description: '머리가 크고 몸이 작은 귀여운 비율의 캐릭터,\n친근하고 가벼운 느낌을 줍니다.'
  },
  '반실사': {
    emoji: '📸',
    title: '반실사',
    keywords: ['디테일', '디지털 아트', '트렌디'],
    description: '실사와 그림의 중간 지점,\n현실적이면서도 회화적인 매력이 공존하는 세련된 스타일입니다.'
  }
};

export const OPTION_DESCRIPTIONS: Record<string, string> = {
    // Fallbacks for dashboard text tooltips
    ...Object.fromEntries(Object.values(NATIONALITY_DETAILS).map(d => [d.title, d.description])),
    ...Object.fromEntries(Object.values(OCCUPATION_DETAILS).map(d => [d.title, d.description])),
    ...Object.fromEntries(Object.values(OUTFIT_DETAILS).map(d => [d.title, d.description])),
    ...Object.fromEntries(Object.values(ART_STYLE_DETAILS).map(d => [d.title, d.description])),
};

export const OUTFIT_DESCRIPTIONS: Record<string, string> = {
  // 호환성을 위해 유지
  '캐쥬얼': '편안하고 일상적인 복장',
  '모던': '세련되고 깔끔한 도시 스타일',
  '스트리트': '자유로운 힙합/거리 패션',
  '빈티지': '낡은 듯 멋스러운 복고풍',
  '전통의상': '고유한 문화적 전통 복식',
  '아웃도어': '기능성 생존/등산 복장',
  '유니폼': '직업/소속을 나타내는 제복',
};

export const BACKGROUND_OPTIONS = {
  spaces: ['도시', '시골', '집', '학교', '공원'],
  weathers: ['맑음', '흐림', '비', '눈', '안개'],
  timeOfDays: ['새벽', '아침', '낮', '해질녘', '밤'],
  moods: ['평화로운', '활기찬', '공허한', '긴박한'],
  compositions: ['인물 중심', '중간', '배경 중심'],
};

export const INITIAL_BACKGROUND_PROFILE: BackgroundProfile = {
  space: BACKGROUND_OPTIONS.spaces[0],
  weather: BACKGROUND_OPTIONS.weathers[0],
  timeOfDay: BACKGROUND_OPTIONS.timeOfDays[2], // 낮
  mood: BACKGROUND_OPTIONS.moods[0],
  composition: '중간',
};

export const ENDING_DEFAULT_BACKGROUNDS: Record<EndingType, Omit<BackgroundProfile, 'space'>> = {
  [EndingType.CARBON_NEUTRALITY_SUCCESS]: {
    weather: '맑음',
    timeOfDay: '낮',
    mood: '활기찬',
    composition: '배경 중심',
  },
  [EndingType.CARBON_NEUTRALITY_FAILURE]: {
    weather: '흐림',
    timeOfDay: '밤',
    mood: '공허한',
    composition: '중간',
  },
  [EndingType.RESIDENT_HAPPINESS_FAILURE]: {
    weather: '흐림',
    timeOfDay: '해질녘',
    mood: '긴박한',
    composition: '인물 중심',
  },
};

export const LOADING_TIPS = [
    "팁: 중요한 키워드는 맨 앞에 적으세요!",
    "팁: '오버핏'을 입력하면 힙한 느낌이 납니다.",
    "팁: 구체적인 색상(예: 네이비, 베이지)을 지정해보세요.",
    "팁: 액세서리(안경, 모자)를 추가하면 캐릭터가 생생해집니다.",
    "팁: '자연광' 키워드는 따뜻한 분위기를 만듭니다.",
    "팁: 감정 표현(웃는, 진지한)을 넣으면 캐릭터가 살아납니다.",
    "팁: 헤어스타일은 '단발', '포니테일', '파마' 등으로 구체화하세요.",
    "팁: '파스텔톤'으로 부드러운 색감을 표현할 수 있어요.",
    "팁: 너무 많은 키워드보다 핵심 3-5개가 효과적입니다.",
    "팁: '미니멀' 스타일은 깔끔한 이미지를 만듭니다.",
    "팁: 계절감(여름, 겨울)을 넣으면 의상이 자연스러워져요.",
    "팁: '심플한', '화려한' 등으로 전체 분위기를 조절하세요.",
    "팁: 직업(학생, 직장인)을 명시하면 어울리는 스타일이 나옵니다.",
    "팁: 배경색을 '흰색', '투명'으로 지정할 수 있어요.",
    "팁: '일러스트 스타일'과 '사실적인 스타일' 중 선택해보세요.",
    "팁: '캐주얼', '포멀' 같은 복장 스타일을 먼저 정하세요.",
    "팁: 연령대(10대, 20대)를 명확히 하면 더 정확해집니다.",
    "팁: '따뜻한 조명', '차가운 조명'으로 무드를 바꿔보세요.",
    "팁: 특정 브랜드나 패션 스타일(빈티지, 스트릿)을 참고하세요.",
    "팁: '정면', '측면', '3/4각도'로 원하는 포즈를 지정하세요.",
    "팁: 쉼표로 키워드를 구분하면 더 정확하게 인식됩니다.",
    "팁: '귀여운', '시크한', '우아한'으로 인상을 결정하세요.",
    "팁: 부정 프롬프트로 원하지 않는 요소를 제외할 수 있어요.",
    "팁: 눈 색상까지 지정하면 디테일이 살아납니다.",
    "팁: '애니메이션 스타일'은 더 친근한 느낌을 줍니다."
];
