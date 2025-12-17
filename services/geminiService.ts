
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { EndingType, CharacterProfile, BackgroundProfile } from '../types';
import { ENDING_DETAILS } from '../constants';

// Initialize the AI instance directly.
// Ensure process.env.API_KEY is strictly used as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Text generation uses Pro for quality story-telling
const textModel = 'gemini-2.5-pro';
// Image Prompt generation uses Flash for speed and better instruction following without over-filtering
const promptGenModel = 'gemini-2.5-flash';

const imageModel = 'gemini-2.5-flash-image';
const highQualityImageModel = 'gemini-3-pro-image-preview';

// Common safety settings to reduce false positives for creative content
// Changed to BLOCK_NONE to allow for dramatic/crisis themes in the game context
const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
];

const generateTextWithGemini = async (prompt: string): Promise<string> => {
  let retries = 3;
  while (retries > 0) {
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          safetySettings: safetySettings,
        }
      });
      if (!response.text) {
        throw new Error("모델로부터 빈 응답을 받았습니다.");
      }
      return response.text;
    } catch (error) {
      retries--;
      console.error(`Error calling Gemini API for text generation (retries left: ${retries}):`, error);

      if (retries > 0 && error instanceof Error && (error.message.includes('500') || error.message.includes('INTERNAL'))) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (3 - retries)));
        continue;
      }

      if (error instanceof Error) {
        if (error.message.includes('API key not valid') || error.message.includes('API_KEY_INVALID')) {
          throw new Error(`설정된 Gemini API 키가 유효하지 않습니다. 개발자에게 문의하세요.`);
        }
        throw new Error(`Gemini API 텍스트 생성 중 오류 발생: ${error.message}`);
      }
      throw new Error("Gemini API 텍스트 생성 중 알 수 없는 오류 발생");
    }
  }
  throw new Error("Gemini API 텍스트 생성 실패: 서버 오류가 반복되었습니다.");
};

// Helper to format prompts consistently
const formatScenarioPrompt = (
  role: string,
  instruction: string,
  coreTheme: string,
  character: CharacterProfile,
  background: BackgroundProfile,
  extraContext: string = ''
) => `
Role: ${role}
Task: ${instruction}

---
[Key Theme & Context]
Theme: "${coreTheme}"
${extraContext}

[Character Profile]
- Name: ${character.name ? `"${character.name}"` : 'Unnamed (refer as protagonist)'}
- Demographics: ${character.age}, ${character.gender}, ${character.nationality}
- Occupation/Role: ${character.occupation}
- Appearance: Wearing ${character.outfit}

[Scene Setting]
- Location: ${background.space}
- Weather/Time: ${background.weather}, ${background.timeOfDay}
- Mood: ${background.mood}
---

[Writing Guidelines]
1. **Structure**: Strictly write exactly **2 distinct paragraphs** of descriptive narrative, separated by a clear line break. Follow this with **1 line of dialogue** that captures the essence of the scene.
   - Paragraph 1: Focus on the scene setup, atmosphere, and sensory details (visuals, sounds).
   - Paragraph 2: Focus on the character's specific action, internal thought, or reaction to the crisis.
   - Dialogue: One impactful line spoken by the character or a key NPC.
2. **Language**: Korean (Natural, immersive, novel-style prose).
3. **Tone**: ${background.mood} and consistent with the theme.
4. **Length**: Keep strictly under **700 characters** (approx. 350-400 words) to allow sufficient detail for two full paragraphs.
5. **Formatting**: Do NOT use markdown headers (like ## Prologue). Just the raw text.
6. **Visual Guidance**: At the very bottom of your response, add a special tag <Composition>...</Composition>. Inside this tag, write a concise English phrase describing **ONLY the Character's Pose and Action** that matches the scene.
   - **DO NOT** include camera angles, lens types, or shot types (e.g., "close-up", "wide shot"). These will be added programmatically.
   - Focus strictly on the character's physical action and emotion.
   Example: "looking down at a withered plant with a sad expression", "running desperately through the crowd", "standing confidently with arms crossed"

Response format example:
[Paragraph 1: Scene setup and atmosphere...]

[Paragraph 2: Character action and internal thought...]

"[One impactful line of dialogue]"

<Composition>
character looking up at the sky with hope, holding a seed
</Composition>
`;

const parseScenarioResponse = (responseText: string) => {
    const compositionMatch = responseText.match(/<Composition>([\s\S]*?)<\/Composition>/i);
    let scenario = responseText.replace(/<Composition>[\s\S]*?<\/Composition>/i, '').trim();
    let composition = compositionMatch ? compositionMatch[1].trim() : '';
    
    // Fallback if composition is empty or missing
    if (!composition) {
        composition = "character standing naturally";
    }
    
    return { scenario, composition };
};

export const generatePrologueScenario = async (
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile
): Promise<{ scenario: string, composition: string }> => {
  const instruction = `
    Write a prologue for a game about a carbon crisis. 
    Describe the calm before the storm. Show subtle signs of the "${coreTheme}" affecting daily life through the eyes of a ${characterProfile.occupation}.
    Do not resolve the conflict; create tension and curiosity.
  `;
  
  const prompt = formatScenarioPrompt(
    "Expert Interactive Fiction Writer specializing in Eco-Thrillers",
    instruction,
    coreTheme,
    characterProfile,
    background
  );

  const rawText = await generateTextWithGemini(prompt);
  return parseScenarioResponse(rawText);
};

export const generateEndingScenario = async (
  prologue: string,
  endingType: EndingType,
  coreTheme: string,
  characterProfile: CharacterProfile,
  background: BackgroundProfile,
  userSuggestion?: string
): Promise<{ scenario: string, composition: string }> => {
  const endingDetail = ENDING_DETAILS[endingType];
  
  const extraContext = `
Previous Story (Prologue):
"""
${prologue}
"""

Ending Type: ${endingDetail.title}
Specific Direction: ${endingDetail.promptInfo}
${userSuggestion ? `User's Creative Twist: "${userSuggestion}" (Integrate this creatively)` : ''}
  `;

  const instruction = `
    Write the final ending scenario based on the prologue and theme.
    The outcome should strictly reflect the "${endingDetail.title}" scenario.
    Convey the emotions deeply (Joy/Hope for Success, Despair/Regret for Failure).
    Do NOT mention the ending title explicitly in the text.
  `;

  const prompt = formatScenarioPrompt(
    "Expert Game Scenario Writer",
    instruction,
    coreTheme,
    characterProfile,
    background,
    extraContext
  );

  const rawText = await generateTextWithGemini(prompt);
  return parseScenarioResponse(rawText);
};

const translateToEnglish = (profile: CharacterProfile) => {
  const translations = {
    gender: { '남': 'male', '여': 'female' },
    age: { 
        '청소년': '15-year-old teenager', 
        '청년': '25-year-old young adult', 
        '중년': '45-year-old middle-aged adult', 
        '노년': '70-year-old elderly person' 
    },
    nationality: { 
      '미국': 'American',
      '중국': 'Chinese',
      '케냐': 'Kenyan',
      '영국': 'British',
      '한국': 'Korean'
    },
    outfit: { 
      '캐쥬얼': 'casual everyday clothing, t-shirt and jeans', 
      '모던': 'modern minimalist fashion, sleek and clean', 
      '스트리트': 'streetwear, hoodie, hip-hop fashion', 
      '빈티지': 'vintage clothing, retro aesthetic', 
      '전통의상': 'traditional cultural attire, authentic folk costume',
      '아웃도어': 'outdoor survival gear, hiking clothes, practical',
      '유니폼': `professional uniform, work attire, functional clothing suitable for a ${profile.occupation}`
    },
    artStyle: { 
      '애니메이션': 'modern high-quality anime style, ufotable style, kyoto animation style, highly detailed, vibrant colors', 
      '90s 애니': '90s retro anime style, cel shaded, vintage aesthetic, Sailor Moon vibe, grain', 
      '웹툰': 'korean webtoon style, sharp lines, vibrant coloring, manhwa aesthetic, digital art',
      '유화': 'oil painting style, impasto, textured, classical art style, rich colors',
      '픽셀아트': 'pixel art, retro game style, 16-bit, isometric or side view', 
      '라인아트': 'intricate ink illustration, line art, hatching, black and white, detailed linework, masterpiece',
      'SD캐릭터': 'chibi style, super deformed, cute proportions, large head', 
      '반실사': 'Arcane style, Riot Games style, semi-realistic digital painting, highly detailed, ArtStation trending',
    },
    occupation: {
      '학생': 'student', '과학자': 'scientist', '환경 운동가': 'environmental activist', 
      '정치인': 'politician', 'CEO': 'corporate CEO, business leader in a suit'
    }
  };

  return {
    gender: translations.gender[profile.gender as keyof typeof translations.gender] || profile.gender,
    age: translations.age[profile.age as keyof typeof translations.age] || profile.age,
    nationality: translations.nationality[profile.nationality as keyof typeof translations.nationality] || profile.nationality,
    outfit: translations.outfit[profile.outfit as keyof typeof translations.outfit] || profile.outfit,
    artStyle: translations.artStyle[profile.artStyle as keyof typeof translations.artStyle] || profile.artStyle,
    occupation: translations.occupation[profile.occupation as keyof typeof translations.occupation] || profile.occupation
  };
};

/**
 * Returns style-specific rendering tags to avoid polluting the prompt with photorealistic terms
 * when a stylized look is desired.
 */
const getStyleSpecificTags = (styleKey: string): string => {
  // 2D / Anime / Illustration Group
  if (['애니메이션', '90s 애니', '웹툰', 'SD캐릭터'].includes(styleKey)) {
    return "flat color, cel shaded, 2D, digital illustration, vector art, vibrant, clean lines, anime key visual";
  }
  // Line Art Group
  if (styleKey === '라인아트') {
    return "ink illustration, monochrome, hatching, line art, manga style, high contrast, clean white background";
  }
  // Painting Group
  if (styleKey === '유화') {
    return "oil painting texture, impasto, visible brush strokes, canvas texture, painterly, traditional media";
  }
  // Pixel Group
  if (styleKey === '픽셀아트') {
    return "pixel art, 16-bit, retro game sprite, sharp edges, digital art";
  }
  // Realistic / Semi-Realistic / Default Group
  // For '반실사' or fallback, we use high-fidelity rendering terms
  return "masterpiece, best quality, 8k, photorealistic textures, ray tracing, cinematic lighting, detailed skin texture, subsurface scattering, depth of field";
};

/**
 * Generates a prompt for the character preview using a Rule-Based approach.
 * This skips the LLM text generation step for faster performance.
 */
export const generateCharacterPreviewPrompt = async (profile: CharacterProfile): Promise<string> => {
  const engProfile = translateToEnglish(profile);
  const styleTags = getStyleSpecificTags(profile.artStyle); // Use the original Korean key to determine tags
  
  // Rule-Based Prompt Construction
  // Order: Art Style -> Subject (Demographics + Occupation) -> Outfit -> Pose/Framing -> Background -> Quality/Style Tags
  
  const parts = [
    // 1. Art Style (Highest Priority)
    `**Art Style**: ${engProfile.artStyle}`,
    
    // 2. Subject Definition
    `**Character**: A ${engProfile.age} ${engProfile.nationality} ${engProfile.gender} ${engProfile.occupation}`,
    
    // 3. Outfit & Appearance
    `**Outfit**: wearing ${engProfile.outfit}`,
    
    // 4. Pose & Composition (Dynamic based on style)
    // For 2D styles, avoid "85mm lens" which implies photography
    ['애니메이션', '90s 애니', '웹툰', 'SD캐릭터', '라인아트', '픽셀아트'].includes(profile.artStyle)
      ? `**Shot**: Waist-up portrait, character centered, looking at viewer, illustration composition`
      : `**Shot**: Waist-up portrait, 85mm lens, f/1.8, bokeh, character centered, looking at viewer`,
    
    // 5. Background (Enforced for clean reference)
    `**Background**: Simple white background, studio lighting, clean isolated background`,
    
    // 6. Quality/Style Specific Boosters (No more hardcoded photorealism for anime)
    `**Visual Style**: ${styleTags}`
  ];

  // Join parts with commas for the image model
  return parts.join(', ');
};

const translateBackgroundToEnglish = (profile: BackgroundProfile) => {
    const translations = {
        space: { '도시': 'futuristic city', '시골': 'rural countryside', '집': 'cozy house interior', '학교': 'classroom or school hallway', '공원': 'urban park with nature' },
        weather: { '맑음': 'clear sunny sky, high contrast', '흐림': 'overcast, diffuse lighting', '비': 'heavy rain, wet surfaces, reflections', '눈': 'snowy, white winter atmosphere', '안개': 'foggy, misty, atmospheric perspective' },
        timeOfDay: { '새벽': 'dawn, blue hour', '아침': 'morning, soft sunlight', '낮': 'mid-day, bright daylight', '해질녘': 'sunset, golden hour', '밤': 'night, cinematic lighting, moonlit' },
        mood: { '평화로운': 'peaceful, serene', '활기찬': 'vibrant, energetic, dynamic', '공허한': 'desolate, empty, lonely', '긴박한': 'tense, dramatic, ominous' }
    };

    return {
        space: translations.space[profile.space as keyof typeof translations.space] || profile.space,
        weather: translations.weather[profile.weather as keyof typeof translations.weather] || profile.weather,
        timeOfDay: translations.timeOfDay[profile.timeOfDay as keyof typeof translations.timeOfDay] || profile.timeOfDay,
        mood: translations.mood[profile.mood as keyof typeof translations.mood] || profile.mood,
    };
};

/**
 * Maps the user's composition selection to professional camera syntax.
 */
const getCompositionKeywords = (composition: string): string => {
  switch (composition) {
    case '인물 중심':
      return "Close-up shot, portrait lens (85mm), depth of field, focus on character's face and expression, bokeh background";
    case '배경 중심':
      return "Wide angle shot, landscape view, establishing shot, character is small in frame, focus on the vast environment and atmosphere";
    case '중간':
    default:
      return "Medium shot, waist-up shot, balanced composition, rule of thirds, character interacting with the immediate surroundings";
  }
};


export const generateImagePromptInternal = async (
  scenarioText: string, 
  scenarioType: 'prologue' | 'ending', 
  characterProfile: CharacterProfile,
  background: BackgroundProfile,
  title?: string,
  compositionGuidance?: string // This is now strictly Pose/Action guidance from AI
): Promise<string> => {
  const engProfile = translateToEnglish(characterProfile);
  const engBackground = translateBackgroundToEnglish(background);
  const styleTags = getStyleSpecificTags(characterProfile.artStyle);

  const characterDescription = `A ${engProfile.age} ${engProfile.nationality} ${engProfile.gender} ${engProfile.occupation}${characterProfile.name ? ` named ${characterProfile.name}` : ''}, wearing ${engProfile.outfit}.`;
  
  const cameraKeywords = getCompositionKeywords(background.composition);
  const poseGuidance = compositionGuidance || "character standing naturally";
  const visualStructure = `${cameraKeywords}, ${poseGuidance}`;

  // Standard Prompt
  const standardPrompt = `
You are an expert AI Art Prompt Engineer.
Create a highly detailed, descriptive prompt for an image generation model based on the following scenario.

**Input Data:**
- **Context**: ${scenarioType === 'prologue' ? 'Prologue of a Carbon Crisis Game' : `Ending: ${title}`}
- **Scenario**: "${scenarioText}"
- **Character**: ${characterDescription}
- **Style**: ${engProfile.artStyle}
- **Setting**: ${engBackground.space}, ${engBackground.weather}, ${engBackground.timeOfDay}
- **Mood**: ${engBackground.mood}
- **Camera & Pose**: ${visualStructure} (Strictly follow this structure)

**Instructions:**
1. **Visual Focus**: Select the most visually striking moment from the scenario.
2. **Detailing**: Describe clothing textures, lighting, and specific background details that reflect the carbon crisis theme.
3. **Camera & Pose**: Incorporate the provided 'Camera & Pose' guidance. 
   - Use the **Camera** settings (shot type) to frame the image.
   - Use the **Pose** settings to depict the character's action.
4. **Safety**: **CRITICAL**: Ensure the content is PG-13 and suitable for general audiences. Use symbolic or artistic representation for any conflict. Avoid gore, extreme violence, or prohibited sensitive content. Focus on atmosphere and emotion.
5. **Output**: Return ONLY the English prompt text. No prefixes like "Prompt:".

**Quality Keywords (Use these for the style):**
"${styleTags}"
  `;

  // Fallback Prompt (Safe Mode)
  const fallbackPrompt = `
You are an expert AI Art Prompt Engineer.
The previous attempt to generate a prompt for this scenario was flagged for safety.
Your task is to create a **Safe, Symbolic, and Atmospheric** image prompt based on the mood of the scenario, **completely omitting any explicit description of violence, disaster, or suffering**.

**Input Data:**
- **Context**: ${scenarioType === 'prologue' ? 'Prologue' : `Ending: ${title}`} (Carbon Crisis Theme)
- **Mood**: ${engBackground.mood}
- **Setting**: ${engBackground.space}, ${engBackground.weather}, ${engBackground.timeOfDay}
- **Character**: ${characterDescription}
- **Style**: ${engProfile.artStyle}
- **Camera**: ${visualStructure}

**Instructions:**
1. **Focus on Atmosphere**: Describe the lighting, colors, and environment to convey the emotion (e.g., tension, melancholy, hope) without showing the cause.
2. **Symbolism**: Use metaphors (e.g., a withered flower, a looming shadow, a ray of light) instead of literal depiction of crisis.
3. **Character**: Show the character's reaction or contemplation, not them being harmed or in immediate danger.
4. **Safety**: ABSOLUTELY NO gore, violence, destruction, or disturbing imagery. Keep it PG and artistic.
5. **Output**: Return ONLY the English prompt text.

**Quality Keywords (Use these for the style):**
"${styleTags}"
  `;
  
  let retries = 3;
  let useFallback = false;

  while (retries > 0) {
    try {
      const currentPromptToUse = useFallback ? fallbackPrompt : standardPrompt;

      // Use promptGenModel (Flash) for prompt generation to avoid "Empty Response" issues from Pro's stricter filters
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: promptGenModel, 
        contents: currentPromptToUse,
        config: {
          temperature: 0.7, 
          responseMimeType: 'text/plain',
          safetySettings: safetySettings, // Apply safety settings to prevent blocking
        }
      });

      // Check for safety filtering before accessing text
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'PROHIBITED_CONTENT') {
          if (!useFallback) {
             console.warn("Scenario triggered safety filter. Switching to Safe Fallback Mode.");
             useFallback = true;
             // Don't decrement retries yet, try immediately with fallback
             continue;
          } else {
             // Already tried fallback and failed
             console.warn("Fallback prompt also triggered safety filter.");
             throw new Error("이미지 묘사 생성 실패: 안전 정책에 의해 차단되었습니다 (Fallback Failed).");
          }
        }
      }
      
      const text = response.text;
      
      // If text is empty/undefined, it often means a silent block or model refusal.
      // Treat this as a trigger for Fallback Mode.
      if (!text) {
         if (!useFallback) {
             console.warn("Empty response received (Silent Block). Switching to Safe Fallback Mode.");
             useFallback = true;
             continue;
         }

         if (response.candidates && response.candidates.length > 0 && response.candidates[0].finishReason !== 'STOP') {
           throw new Error(`이미지 프롬프트 생성 실패: 비정상 종료 (${response.candidates[0].finishReason})`);
         }
         throw new Error("이미지 프롬프트 생성 실패: 모델 응답 없음");
      }
      
      // Clean up potential markdown code blocks or prefixes
      return text.replace(/```(plaintext|text|en|english)?\s*([\s\S]+?)\s*```/g,'$2').trim();

    } catch (error) {
      // If it is safety error (thrown above), it will bubble up
      if (error instanceof Error && error.message.includes('안전 정책')) {
          throw error;
      }

      retries--;
      console.error(`Error calling Gemini API for image prompt generation (retries left: ${retries}):`, error);

      if (retries === 0) {
         if (error instanceof Error) throw error;
         throw new Error("이미지 프롬프트 생성 중 알 수 없는 오류 발생");
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("이미지 프롬프트 생성 실패: 재시도 횟수 초과");
};

export const generateImageFromPrompt = async (
  imagePrompt: string,
  baseImage?: { data: string; mimeType: string },
  useHighQuality: boolean = false,
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3' | '3:4' = '16:9',
  referenceStrength: 'Weak' | 'Medium' | 'Strong' = 'Medium'
): Promise<string> => {
  try {
    let finalPrompt = imagePrompt;
    // Append instruction based on reference strength if a baseImage exists
    if (baseImage) {
        const instructionMap = {
            'Weak': "Use the attached image as a loose reference.",
            'Medium': "Maintain consistency with the attached reference image.",
            'Strong': "Strictly follow the visual details and face of the attached reference image."
        };
        finalPrompt += ` ${instructionMap[referenceStrength]}`;
    }

    const parts: ({ text: string } | { inlineData: { data: string; mimeType: string } })[] = [];
    
    if (baseImage) {
      parts.push({
        inlineData: {
          data: baseImage.data,
          mimeType: baseImage.mimeType,
        },
      });
    }
    parts.push({ text: finalPrompt });

    // Select the model based on the quality flag
    const selectedModel = useHighQuality ? highQualityImageModel : imageModel;

    const response = await ai.models.generateContent({
        model: selectedModel,
        contents: { parts },
        config: {
          responseModalities: [Modality.IMAGE],
          imageConfig: {
              aspectRatio: aspectRatio,
          },
          safetySettings: safetySettings, // Apply safety settings here too
        },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
        throw new Error("이미지 생성 실패: 모델이 응답하지 않았습니다. (Candidates 없음)");
    }

    const firstCandidate = candidates[0];
    // Check for safety filtering or other finish reasons
    if (firstCandidate.finishReason === 'SAFETY' || firstCandidate.finishReason === 'PROHIBITED_CONTENT') {
        throw new Error("이미지 생성 실패: 시나리오의 표현이 너무 구체적이거나 자극적일 수 있습니다. 안전 정책에 의해 차단되었습니다.");
    }
    if (firstCandidate.finishReason === 'NO_IMAGE') {
        throw new Error("이미지 생성 실패: AI가 이미지를 생성하지 못했습니다. (NO_IMAGE). 설정을 변경하여 다시 시도해주세요.");
    }
    if (firstCandidate.finishReason && firstCandidate.finishReason !== 'STOP') {
         throw new Error(`이미지 생성 실패: 비정상적인 종료 사유 (${firstCandidate.finishReason})`);
    }

    const imagePart = firstCandidate.content?.parts?.find(part => part.inlineData);

    if (imagePart?.inlineData) {
      return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    } else {
      throw new Error("응답에서 이미지 데이터(InlineData)를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
     if (error instanceof Error) {
        // Pass through the detailed error message
      throw error;
    }
    throw new Error("이미지 생성 중 알 수 없는 오류 발생");
  }
};
