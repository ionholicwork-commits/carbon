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
