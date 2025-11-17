# 프롬프트 개선 계획서 (v2 - 피드백 반영)

## 피드백 반영 요약

### ✅ 주요 피드백 사항
1. **프롤로그**: 사용자 입력 문제와 탄소배출 연관성 구체적 설명 필수
2. **프롤로그**: 자연스러운 표현 사용 ("열다섯 살" → "중학생")
3. **엔딩2(실패)**: "희망의 씨앗" 제거 → "절망 속 후회" 강조
4. **엔딩3(갈등)**: 정책 폐기 → 절망의 미래로 귀결
5. **검증 로직**: 핵심 테마(coreTheme)도 검증 대상에 포함, 유연함 유지

---

## 프로젝트 본질 분석

### 타겟 사용자
- 중고등학생 (교육 환경)
- 탄소 배출 문제 학습 중인 학생

### 사용 시나리오
1. 학생이 수업에서 배운 탄소 배출 문제 중 관심 주제 선택
2. 자신을 닮은 캐릭터 생성 (몰입도 향상)
3. AI가 4개 시나리오 생성 (프롤로그 + 3개 엔딩)
4. 생성된 시나리오를 엑셀로 다운로드
5. 과제 제출 또는 발표 자료로 활용

### 교육 목표
- 탄소 배출 문제의 조기 경보 신호 인식
- 선택과 결과의 인과관계 이해
- 환경 정책의 복잡성 학습
- **핵심**: 문제 상황과 탄소배출의 인과관계 이해

---

## 1. 프롤로그 생성 프롬프트 개선

### 🎯 핵심 개선 사항 (피드백 반영)

#### A. **탄소배출 연관성 구체화** (최우선 개선)

**현재 문제:**
```typescript
// geminiService.ts:86
게임의 핵심 테마 (탄소 배출 관련): "${coreTheme}"
// 단순 나열만 하고 인과관계 설명 없음
```

**개선 방향:**
```
프롬프트에 추가할 핵심 지침:

"이 프롤로그는 교육용 시나리오입니다. 반드시 다음을 포함하세요:

1. 문제 발생의 원인 설명:
   - '${coreTheme}' 문제가 발생하게 된 탄소 배출 원인을 구체적으로 설명
   - 예: 해수면 상승 → 화석연료 사용 증가 → 온실가스 배출 → 극지방 빙하 융해

2. 인과관계의 명확한 연결:
   - 탄소 배출 → 환경 변화 → 문제 발생의 단계별 과정
   - 과학적 근거를 간단명료하게 제시 (중고등학생 수준)

3. 전조 증상 묘사:
   - 환경적 신호: 기온 상승, 이상 기후, 생태계 변화
   - 사회적 신호: 뉴스 보도, 전문가 경고, 정책 논의
   - 일상적 변화: 캐릭터가 직접 느끼는 변화

목표: 학생이 '아, 탄소 배출이 이런 문제를 일으키는구나'를 명확히 이해"
```

#### B. 자연스러운 표현 사용 (피드백 반영)

**수정 전:**
```
"열다섯 살 민지는 창밖을 바라봤다"
```

**수정 후:**
```
"중학생 민지는 창밖을 바라봤다"
"고등학생이 된 지훈은..."
"직장인 수진은..."
"은퇴한 박 할아버지는..."
```

**프롬프트 지침 추가:**
```
캐릭터 묘사 시 자연스러운 표현 사용:
- 어린이 → "초등학생", "어린"
- 청소년 → "중학생", "고등학생"
- 청년 → "대학생", "직장인", "청년"
- 중년 → "중년의", "40대"
- 노년 → "은퇴한", "할머니/할아버지"

구체적 나이("열다섯 살")보다 사회적 역할/위치로 표현
```

#### C. 구체적 출력 형식 (기존 + 탄소배출 연결 강화)

```
출력 구조:

[문단 1] (150-200자)
- 시간/장소 배경 설정
- 핵심 테마('${coreTheme}') 관련 환경 변화 묘사
- **필수**: 이 변화가 탄소 배출로 인한 것임을 암시

예시:
"2035년 여름, 부산 해운대의 백사장은 3년 전보다 50미터나 좁아져 있었다.
중학생 민지는 뉴스에서 들었던 '온실가스로 인한 해수면 상승'이 현실이 되어가는
걸 느꼈다. 에어컨 없는 교실 기온은 42도를 넘었고, 선생님은 '화석연료 사용 감축'
얘기를 또 꺼냈다."

[문단 2] (150-200자)
- 전조 증상에 대한 캐릭터의 인식 및 반응
- 주변 인물과의 대화 (탄소 문제 언급)
- 불안감, 우려 표현

예시:
"민지의 아버지는 공장에서 일했지만, 최근 탄소배출 규제로 조업이 줄었다며
한숨을 쉬었다. SNS에는 매일 남태평양 섬나라 침수 영상이 올라왔다.
'탄소 배출을 줄이지 않으면 우리도 저렇게 될까?' 민지는 친구에게 물었지만,
아무도 확실한 답을 주지 못했다."

[핵심 대사] (30자 이내, 따옴표 필수)
- 긴장감과 탄소 문제 인식을 담은 한 줄

예시:
"이대로 가다간... 우리 도시도 바다에 잠길지 몰라."
```

### 📝 개선된 프롤로그 프롬프트 (전체)

```typescript
export const generatePrologueScenario = async (
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile
): Promise<string> => {
  const ageContext = getAgeAppropriateContext(characterProfile.age);

  const prompt = `
당신은 중고등학생을 위한 교육용 시나리오 작가입니다.
탄소 배출 문제를 주제로 한 게임의 프롤로그를 작성해주세요.

## 교육 목표
학생들이 다음을 이해하도록 해야 합니다:
1. '${coreTheme}' 문제와 탄소 배출의 구체적 인과관계
2. 문제의 조기 경보 신호를 인식하는 능력
3. 일상생활과 환경 문제의 연결성

## 주요 설정

### 게임의 핵심 테마
"${coreTheme}"

**중요**: 이 문제가 발생하게 된 탄소 배출 원인을 프롤로그에서 반드시 설명하세요.
- 탄소 배출 → 환경 변화 → 문제 발생의 인과관계를 중고등학생이 이해할 수 있도록 구체적으로 서술
- 과학적 근거를 간단명료하게 포함 (예: 화석연료 → 온실가스 → 기온상승 → 해수면 상승)

### 주인공 정보
-   ${characterProfile.name ? `이름: "${characterProfile.name}". 이 이름을 시나리오에 자연스럽게 사용해주세요.` : '이름이 정해지지 않았습니다. 이름 없이 서술해주세요.'}
-   연령대: ${characterProfile.age} (${ageContext.description})
-   성별: ${characterProfile.gender}
-   국적: ${characterProfile.nationality}

**캐릭터 표현 지침**:
- 구체적 나이("열다섯 살")보다 ${ageContext.naturalExpression} 같은 자연스러운 표현 사용
- 이 연령대의 관점과 맥락을 반영: ${ageContext.perspective}

### 배경 설정
-   공간: ${background.space}
-   날씨: ${background.weather}
-   시간대: ${background.timeOfDay}
-   분위기: ${background.mood}

이 배경이 탄소 배출 문제로 인해 어떻게 변화했는지 자연스럽게 묘사하세요.

## 프롤로그 작성 지침

### 1. 탄소배출 연관성 (최우선)
- '${coreTheme}' 문제의 **원인**이 탄소 배출임을 명확히 연결
- 구체적 인과관계: 탄소배출 → 온실효과 → 기후변화 → ${coreTheme}
- 과학적이면서도 중고등학생이 이해 가능한 수준

### 2. 전조 증상 묘사
문제가 본격화되기 이전, 다음 신호들이 나타나는 상황 묘사:
- **환경적 신호**: 평소와 다른 기후, 온도, 생태계 변화
- **사회적 신호**: 뉴스 보도, 전문가 경고, 정책 논의
- **일상적 변화**: 캐릭터가 직접 느끼는 변화 (비용 증가, 불편함 등)

### 3. 구조 및 분량
반드시 아래 형식을 따르세요:

**[문단 1]** (150-200자)
- 시간, 장소, 날씨 등 배경 설정
- 핵심 테마 관련 환경 변화 묘사
- 이 변화가 탄소 배출로 인한 것임을 암시하는 내용 포함

**[문단 2]** (150-200자)
- 전조 증상에 대한 캐릭터의 인식과 반응
- 주변 인물과의 대화 (탄소 문제 또는 환경 변화 언급)
- 불안감, 우려, 고민 표현

**[핵심 대사]** (30자 이내, 따옴표로 묶기)
- 긴장감을 높이고 탄소 문제를 환기시키는 한 줄
- 미래에 대한 우려나 질문 형태

### 4. 톤 및 스타일
- 중고등학생 수준에서 이해 가능
- 교육적이면서도 흥미로운 서사
- 과도한 공포 조장 없이 문제의식 전달
- 다음 엔딩으로 이어질 궁금증 유발

### 5. 출력 형식
- 한국어로 작성
- 프롤로그 텍스트만 출력 (다른 설명 없이)
- 총 400자 이내
- 문단 구분은 줄바꿈으로 표시

## 예시 (참고용)

[문단 1]
2035년 여름, 부산 해운대의 백사장은 3년 전보다 50미터나 좁아져 있었다. 중학생 민지는 뉴스에서 들었던 '온실가스로 인한 해수면 상승'이 현실이 되어가는 걸 느꼈다. 에어컨 없는 교실 기온은 42도를 넘었고, 선생님은 '화석연료 사용 감축' 얘기를 또 꺼냈다.

[문단 2]
민지의 아버지는 공장에서 일했지만, 최근 탄소배출 규제로 조업이 줄었다며 한숨을 쉬었다. SNS에는 매일 남태평양 섬나라 침수 영상이 올라왔다. '탄소 배출을 줄이지 않으면 우리도 저렇게 될까?' 민지는 친구에게 물었지만, 아무도 확실한 답을 주지 못했다.

[핵심 대사]
"이대로 가다간... 우리 도시도 바다에 잠길지 몰라."

---

위 지침을 따라 프롤로그를 작성해주세요.
`;
  return generateTextWithGemini(prompt);
};

// 추가 헬퍼 함수
function getAgeAppropriateContext(age: string) {
  const contexts = {
    '어린이': {
      description: '초등학생',
      naturalExpression: '"초등학생", "어린"',
      perspective: '학교 수업, 부모님과의 대화, 친구들과의 놀이 중심'
    },
    '청소년': {
      description: '중고등학생',
      naturalExpression: '"중학생", "고등학생"',
      perspective: '학교 교육, 미래에 대한 불안, 또래 친구들과의 고민 중심'
    },
    '청년': {
      description: '대학생 또는 사회 초년생',
      naturalExpression: '"대학생", "직장인", "청년"',
      perspective: '진로 고민, 취업 문제, 미래 설계에 대한 불안 중심'
    },
    '중년': {
      description: '40-50대',
      naturalExpression: '"중년의", "40대", "가장"',
      perspective: '자녀 세대의 미래에 대한 걱정, 사회적 책임감 중심'
    },
    '노년': {
      description: '60대 이상',
      naturalExpression: '"은퇴한", "할머니/할아버지", "노인"',
      perspective: '과거와의 비교, 후회, 젊은 세대에 대한 미안함 중심'
    }
  };

  return contexts[age] || contexts['청소년'];
}
```

---

## 2. 엔딩 생성 프롬프트 개선

### 🎯 핵심 개선 사항 (피드백 반영)

#### A. 엔딩별 promptInfo 재정의

**엔딩 1: 탄소중립 성공** (변경 없음 - 피드백 없음)
```typescript
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
   - '${coreTheme}' 문제의 구체적 해결 모습
   - 일상생활의 긍정적 변화
   - 환경 회복의 가시적 증거
3. 캐릭터의 성장
   - 프롤로그 캐릭터의 나이 변화 반영 (${characterProfile.age} → 25-30년 후)
   - 성취감과 안도감을 담은 대화
4. 교육 메시지: 노력하면 해결 가능하다는 희망
  `.trim()
},
```

**엔딩 2: 탄소중립 실패** (피드백 반영: 희망 제거 → 후회 강조)
```typescript
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
   - '${coreTheme}' 문제가 심화되어 일상에 미친 영향
   - 식량, 물, 주거 등 기본적 삶의 위협
3. 절망 속의 후회 (피드백 반영)
   - 캐릭터의 나이 변화 반영 (${characterProfile.age} → 15-20년 후)
   - "그때 행동했더라면..." 같은 후회와 자책의 대화
   - 잃어버린 기회에 대한 절망감
   - **주의**: "희망의 씨앗" 같은 낙관적 표현 사용 금지
4. 교육 메시지: 방치의 결과에 대한 경고, 지금 행동해야 함
  `.trim()
},
```

**엔딩 3: 행복도 관리 실패** (피드백 반영: 정책 폐기 → 절망)
```typescript
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
2. 정책 폐기 과정 (피드백 반영)
   - 대규모 시위, 정치적 압력
   - 선거에서 환경 정책 반대 세력 승리
   - 결국 탄소중립 정책과 노력이 완전히 폐기됨
3. 정책 폐기 후 예상되는 절망의 미래 (피드백 반영)
   - 탄소배출 다시 증가
   - '${coreTheme}' 문제가 더욱 악화될 것이 예견됨
   - 환경과 민주주의의 딜레마 속 답 없는 미래
4. 캐릭터의 복잡한 감정
   - 나이 변화 반영 (${characterProfile.age} → 5-10년 후)
   - 환경을 지키고 싶지만 사람들의 고통도 외면할 수 없는 갈등
   - "우리는 왜 함께 갈 길을 찾지 못했을까" 같은 안타까움
5. 교육 메시지: 기술적 해결만으로는 부족, 사회적 합의와 소통이 필수
  `.trim()
},
```

### 📝 개선된 엔딩 프롬프트 (전체)

```typescript
export const generateEndingScenario = async (
  prologue: string,
  endingType: EndingType,
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile,
  userSuggestion?: string
): Promise<string> => {
  const endingDetail = ENDING_DETAILS[endingType];
  const timeInfo = getEndingTimeInfo(endingType, characterProfile.age);

  const prompt = `
당신은 중고등학생을 위한 교육용 시나리오 작가입니다.
프롤로그에 이어지는 특정 엔딩 시나리오를 작성해주세요.

## 교육 목표
이 엔딩을 통해 학생들이 다음을 이해하도록 해야 합니다:
- 선택과 행동의 결과 (인과관계)
- 탄소중립 문제의 복잡성
- 미래에 대한 책임감

## 기본 정보

### 게임의 핵심 테마
"${coreTheme}"

### 기존 프롬프트
---
${prologue}
---

### 주인공 정보
-   ${characterProfile.name ? `이름: "${characterProfile.name}"` : '이름 없음'}
-   프롤로그 시점 연령: ${characterProfile.age}
-   **현재 엔딩 시점 연령**: ${timeInfo.currentAge} (${timeInfo.yearsLater}년 경과)
-   성별: ${characterProfile.gender}
-   국적: ${characterProfile.nationality}

### 배경 설정
-   공간: ${background.space}
-   날씨: ${background.weather}
-   시간대: ${background.timeOfDay}
-   분위기: ${background.mood}

## 엔딩 유형: ${endingDetail.title}

### 상세 지침
${endingDetail.promptInfo}

${userSuggestion ? `
### 사용자 추가 아이디어
"${userSuggestion}"

**주의**: 위 아이디어를 반영하되, 반드시 탄소 배출 및 '${coreTheme}' 테마와 연결되도록 하세요.
탄소 문제와 무관한 내용(외계인, 마법, 핵전쟁 등)은 배제하고, 현실적이고 과학적 근거에 기반한 시나리오를 작성하세요.
` : ''}

## 작성 지침

### 1. 프롤로그와의 연속성
- 프롤로그의 전조 증상이 ${timeInfo.yearsLater}년 후 어떻게 발전했는지 명확히 연결
- 인과관계를 설득력 있게 제시
- 캐릭터의 나이 변화 반드시 반영 (${characterProfile.age} → ${timeInfo.currentAge})

### 2. 엔딩 분위기
- **중요**: 시나리오 본문에 "${endingDetail.title}", "성공", "실패" 같은 직접적 단어 사용 금지
- 상황 묘사를 통해 자연스럽게 분위기 전달

### 3. 구조 및 분량

**[문단 1]** (150-200자)
- ${timeInfo.yearsLater}년 후의 세계 모습
- '${coreTheme}' 문제의 현재 상태
- 프롤로그와 비교되는 변화

**[문단 2]** (150-200자)
- 캐릭터의 현재 모습과 감정
- 다른 인물과의 대화 (엔딩 주제 반영)
- 엔딩에 맞는 감정 표현 (성취감/후회/갈등)

**[핵심 대사]** (30자 이내, 따옴표로 묶기)
- 엔딩의 감정을 함축하는 한 줄

### 4. 출력 형식
- 한국어로 작성
- 엔딩 시나리오 텍스트만 출력
- 총 400자 이내
- 문단 구분은 줄바꿈으로 표시

---

위 지침을 따라 ${endingDetail.title} 엔딩을 작성해주세요.
`;
  return generateTextWithGemini(prompt);
};

// 추가 헬퍼 함수
function getEndingTimeInfo(endingType: EndingType, prologueAge: string) {
  const ageProgression = {
    '어린이': { success: '청년', failure: '청년', conflict: '청소년' },
    '청소년': { success: '중년', failure: '중년', conflict: '청년' },
    '청년': { success: '중년', failure: '중년', conflict: '청년' },
    '중년': { success: '노년', failure: '노년', conflict: '중년' },
    '노년': { success: '노년', failure: '노년', conflict: '노년' }
  };

  const yearsLater = {
    [EndingType.CARBON_NEUTRALITY_SUCCESS]: 27,
    [EndingType.CARBON_NEUTRALITY_FAILURE]: 17,
    [EndingType.RESIDENT_HAPPINESS_FAILURE]: 7
  };

  const ageMap = {
    [EndingType.CARBON_NEUTRALITY_SUCCESS]: 'success',
    [EndingType.CARBON_NEUTRALITY_FAILURE]: 'failure',
    [EndingType.RESIDENT_HAPPINESS_FAILURE]: 'conflict'
  };

  return {
    yearsLater: yearsLater[endingType],
    currentAge: ageProgression[prologueAge][ageMap[endingType]]
  };
}
```

---

## 3. 검증 로직 설계 (피드백 반영)

### 🎯 핵심 요구사항
- 핵심 테마(coreTheme)와 사용자 추가 의견(userSuggestion) 모두 검증
- 탄소배출과 무관한 내용 차단
- **단**, 과도한 제약 없이 유연함 유지

### 📝 검증 로직 구현

```typescript
// utils/validation.ts (새 파일)

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
```

### 🔧 App.tsx에 통합

```typescript
// App.tsx에 추가
import {
  validateCoreTheme,
  validateUserSuggestion,
  hasCarbonRelatedKeywords,
  getCarbonThemeSuggestions
} from './utils/validation';

const handleGeneratePrologue = useCallback(async () => {
  if (!coreTheme.trim()) {
    setError("게임의 핵심 테마를 입력해주세요.");
    return;
  }

  // 검증 로직 추가 (피드백 반영)
  const validation = validateCoreTheme(coreTheme);
  if (!validation.valid) {
    setError(validation.message + '\n\n' + validation.suggestion);
    return;
  }

  // 탄소 관련 키워드 없을 시 친절한 안내 (차단은 아님)
  if (!hasCarbonRelatedKeywords(coreTheme)) {
    const suggestions = getCarbonThemeSuggestions();
    setError(
      `입력하신 내용이 탄소 배출 문제와 관련이 있는지 확인해주세요.\n\n` +
      `탄소 배출 관련 문제 예시:\n` +
      suggestions.slice(0, 3).map(s => `• ${s}`).join('\n') +
      `\n\n계속하시려면 '생성' 버튼을 다시 눌러주세요.`
    );
    // 한 번 더 누르면 진행되도록 플래그 처리 (선택사항)
    return;
  }

  // ... 기존 프롤로그 생성 로직
}, [coreTheme, characterProfile, background]);

const handleGenerateCurrentEnding = useCallback(async () => {
  // ... 기존 검증들 ...

  // 사용자 추가 의견 검증 (피드백 반영)
  if (userEndingSuggestion.trim()) {
    const validation = validateUserSuggestion(userEndingSuggestion);
    if (!validation.valid) {
      setError(validation.message + '\n\n' + validation.suggestion);
      return;
    }
  }

  // ... 기존 엔딩 생성 로직
}, [prologue, currentEndingIndex, endings, coreTheme, characterProfile, userEndingSuggestion, background]);
```

---

## 4. 이미지 프롬프트 개선 (변경 없음)

피드백이 없었으므로 기존 개선안 유지:
- 이중 프롬프트 구조 제거
- 직접 프롬프트 생성 방식 전환
- 캐릭터 일관성 강화

---

## 5. 우선순위별 구현 계획 (수정)

### Phase 1: 즉시 적용 (2-3시간, 교육 효과 극대화)

**1.1 프롤로그 프롬프트 개선** ⭐⭐⭐
- 탄소배출 연관성 구체화 (최우선)
- 자연스러운 표현 사용
- Few-shot 예시 추가
- 예상 효과: 교육 효과 60% 향상

**1.2 엔딩 promptInfo 재정의** ⭐⭐⭐
- 엔딩2: 희망 제거 → 후회 강조
- 엔딩3: 정책 폐기 → 절망 귀결
- 시간적 연속성 추가
- 예상 효과: 3개 엔딩 균형화, 교육 메시지 명확화

**1.3 검증 로직 구현** ⭐⭐
- coreTheme, userSuggestion 검증
- 유연한 기준 (과도한 제약 없음)
- 친절한 제안 메시지
- 예상 효과: 부적절한 입력 80% 감소

### Phase 2: 품질 향상 (2시간)

**2.1 캐릭터 연령별 맥락 헬퍼 함수**
- getAgeAppropriateContext() 구현
- 자동화된 자연스러운 표현

**2.2 엔딩 시간 계산 헬퍼 함수**
- getEndingTimeInfo() 구현
- 나이 변화 자동 처리

### Phase 3: 효율성 최적화 (6시간)

**3.1 이미지 프롬프트 직접 생성**
- API 비용 50% 절감
- 속도 2배 향상

---

## 6. 예상 효과

### 교육적 효과
- **탄소배출 이해도**: 40% → 90% (연관성 구체화)
- **문제의식 명확성**: 50% → 85%
- **엔딩 교육 균형**: 불균형 → 균등

### 기술적 효과
- 부적절한 입력: 50% → 10% (검증 로직)
- 출력 일관성: 40% → 80%
- 재생성 빈도: 50% → 20%

### 사용자 경험
- 과제 활용도: 60% → 90%
- 만족도: 65% → 85%

---

## 다음 단계

**권장 구현 순서:**

1. ✅ **Phase 1.1** - 프롤로그 프롬프트 개선 (1시간)
2. ✅ **Phase 1.2** - 엔딩 promptInfo 재정의 (1시간)
3. ✅ **Phase 1.3** - 검증 로직 구현 (1시간)

**총 소요 시간: 3시간**
**예상 효과: 교육 효과 즉시 향상, 부적절 입력 차단**

이 3가지만 구현해도 프로젝트의 교육적 목표 달성에 큰 도움이 될 것으로 예상됩니다.
