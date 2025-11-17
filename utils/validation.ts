interface ValidationResult {
  valid: boolean;
  message?: string;
  suggestion?: string;
}

/**
 * 탄소 배출 관련성 검증
 * 과도한 제약 없이 명백히 무관한 내용만 차단
 */
export function validateCarbonRelevance(text: string, fieldName: string): ValidationResult {
  if (!text || text.trim().length === 0) {
    return { valid: true }; // 빈 값은 허용
  }

  // 명백히 탄소/환경과 무관한 키워드 (유연한 기준)
  const irrelevantKeywords = [
    '외계인', '에이리언', 'UFO',
    '좀비', '언데드',
    '마법', '마술', '초능력',
    '핵전쟁', '핵무기', '세계대전',
    '타임머신', '시간여행',
    '로봇 반란', 'AI 반란'
  ];

  const lowerText = text.toLowerCase();
  const foundKeyword = irrelevantKeywords.find(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );

  if (foundKeyword) {
    return {
      valid: false,
      message: `'${foundKeyword}'은(는) 탄소 배출 문제와 관련이 없습니다.`,
      suggestion: `탄소 배출로 인한 현실적인 문제를 입력해주세요.\n예: 해수면 상승, 폭염, 대기오염, 가뭄, 생태계 변화 등`
    };
  }

  // 너무 짧거나 모호한 입력 경고 (차단은 아님)
  if (text.trim().length < 5) {
    return {
      valid: true, // 통과시키되
      message: `조금 더 구체적으로 작성하면 더 좋은 시나리오가 생성됩니다.`,
      suggestion: `예: "해수면 상승으로 해안 도시 침수" 같은 구체적 문제`
    };
  }

  return { valid: true };
}

/**
 * 핵심 테마 검증 (프롤로그 생성 시)
 */
export function validateCoreTheme(coreTheme: string): ValidationResult {
  return validateCarbonRelevance(coreTheme, '핵심 테마');
}

/**
 * 사용자 추가 의견 검증 (엔딩 생성 시)
 */
export function validateUserSuggestion(suggestion: string): ValidationResult {
  return validateCarbonRelevance(suggestion, '추가 아이디어');
}

/**
 * 탄소 관련 키워드가 포함되어 있는지 확인 (선택적 가이드)
 */
export function hasCarbonRelatedKeywords(text: string): boolean {
  const carbonKeywords = [
    '탄소', '온실가스', 'CO2', '이산화탄소',
    '기후', '온난화', '지구온난화',
    '배출', '화석연료', '석탄', '석유',
    '해수면', '폭염', '가뭄', '홍수',
    '빙하', '극지방', '생태계',
    '재생에너지', '태양광', '풍력'
  ];

  const lowerText = text.toLowerCase();
  return carbonKeywords.some(keyword =>
    lowerText.includes(keyword.toLowerCase())
  );
}

/**
 * 친절한 제안 메시지 생성
 */
export function getCarbonThemeSuggestions(): string[] {
  return [
    '해수면 상승으로 인한 해안 도시 침수',
    '극심한 폭염으로 인한 식량 생산 감소',
    '대기 오염으로 인한 호흡기 질환 증가',
    '빙하 융해로 인한 담수 부족',
    '이상 기후로 인한 자연재해 증가',
    '생태계 파괴로 인한 생물 다양성 감소',
    '탄소 포집 기술 개발의 어려움',
    '재생 에너지 전환 과정의 경제적 부담'
  ];
}
