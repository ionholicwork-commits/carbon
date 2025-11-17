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
    promptInfo: `
상황: 25-30년 후, 탄소중립 완전 달성
필수 포함 내용:
1. 성공까지의 과정과 어려움
   - 기술적 돌파구: 재생에너지 혁신, 탄소포집 기술 등
   - 사회적 노력: 정책 추진, 국제 협력, 시민 참여
   - 극복한 장애물: 경제적 부담, 초기 반발, 기술적 한계
2. 성공 후 변화된 세계
   - 게임의 핵심 테마 문제의 구체적 해결 모습
   - 일상생활의 긍정적 변화
   - 환경 회복의 가시적 증거
3. 캐릭터의 성장
   - 프롤로그 캐릭터의 나이 변화 반영 (25-30년 후)
   - 성취감과 안도감을 담은 대화
4. 교육 메시지: 노력하면 해결 가능하다는 희망
    `.trim()
  },
  [EndingType.CARBON_NEUTRALITY_FAILURE]: {
    title: "탄소 중립 실패",
    description: "탄소중립에 실패하여 문제가 악화된 미래",
    promptInfo: `
상황: 15-20년 후, 탄소배출 감축 실패로 재앙적 미래
필수 포함 내용:
1. 실패의 구체적 원인
   - 정책 지연: 국제 협상 결렬, 정치적 우선순위 변화
   - 기술 한계: 예상보다 느린 기술 발전
   - 사회적 무관심: 경제 우선주의, 단기적 이익 추구
2. 악화된 현실
   - 프롤로그의 전조 증상이 현실화된 구체적 모습
   - 게임의 핵심 테마 문제가 심화되어 일상에 미친 영향
   - 식량, 물, 주거 등 기본적 삶의 위협
3. 절망 속의 후회
   - 캐릭터의 나이 변화 반영 (15-20년 후)
   - "그때 행동했더라면..." 같은 후회와 자책의 대화
   - 잃어버린 기회에 대한 절망감
   - 주의: "희망의 씨앗" 같은 낙관적 표현 사용 금지
4. 교육 메시지: 방치의 결과에 대한 경고, 지금 행동해야 함
    `.trim()
  },
  [EndingType.RESIDENT_HAPPINESS_FAILURE]: {
    title: "행복도 관리 실패",
    description: "탄소중립 정책이 사회적 갈등으로 폐기된 미래",
    promptInfo: `
상황: 5-10년 후, 정책 추진 중 사회적 갈등으로 실패
필수 포함 내용:
1. 정책 추진과 반발
   - 초기 정책: 탄소세, 화석연료 제한, 이동 규제 등
   - 구체적 불편: 에너지 가격 상승, 일자리 감소, 생활 제약
   - 계층/세대 간 갈등: 부유층 vs 서민층, 청년 vs 장년층
2. 정책 폐기 과정
   - 대규모 시위, 정치적 압력
   - 선거에서 환경 정책 반대 세력 승리
   - 결국 탄소중립 정책과 노력이 완전히 폐기됨
3. 정책 폐기 후 예상되는 절망의 미래
   - 탄소배출 다시 증가
   - 게임의 핵심 테마 문제가 더욱 악화될 것이 예견됨
   - 환경과 민주주의의 딜레마 속 답 없는 미래
4. 캐릭터의 복잡한 감정
   - 나이 변화 반영 (5-10년 후)
   - 환경을 지키고 싶지만 사람들의 고통도 외면할 수 없는 갈등
   - "우리는 왜 함께 갈 길을 찾지 못했을까" 같은 안타까움
5. 교육 메시지: 기술적 해결만으로는 부족, 사회적 합의와 소통이 필수
    `.trim()
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
  ages: ['어린이', '청소년', '청년', '중년', '노년'],
  nationalities: ['한국', '유럽', '아프리카', '중앙아시아'],
  outfits: ['캐쥬얼', '후드티', '전통의상'],
  artStyles: ['애니메이션', '반실사', '수채화', '픽셀아트', 'SD캐릭터'],
};

export const BACKGROUND_OPTIONS = {
  spaces: ['도시', '시골', '집', '학교', '공원'],
  weathers: ['맑음', '흐림', '비', '눈', '안개'],
  timeOfDays: ['새벽', '아침', '낮', '해질녘', '밤'],
  moods: ['평화로운', '활기찬', '공허한', '긴박한'],
};

export const INITIAL_BACKGROUND_PROFILE: BackgroundProfile = {
  space: BACKGROUND_OPTIONS.spaces[0],
  weather: BACKGROUND_OPTIONS.weathers[0],
  timeOfDay: BACKGROUND_OPTIONS.timeOfDays[2], // 낮
  mood: BACKGROUND_OPTIONS.moods[0],
  composition: 3, // 중립
};

export const ENDING_DEFAULT_BACKGROUNDS: Record<EndingType, Omit<BackgroundProfile, 'space'>> = {
  [EndingType.CARBON_NEUTRALITY_SUCCESS]: {
    weather: '맑음',
    timeOfDay: '낮',
    mood: '활기찬',
    composition: 4,
  },
  [EndingType.CARBON_NEUTRALITY_FAILURE]: {
    weather: '흐림',
    timeOfDay: '밤',
    mood: '공허한',
    composition: 5,
  },
  [EndingType.RESIDENT_HAPPINESS_FAILURE]: {
    weather: '흐림',
    timeOfDay: '해질녘',
    mood: '긴박한',
    composition: 2,
  },
};
