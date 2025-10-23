export enum EndingType {
  CARBON_NEUTRALITY_SUCCESS = 'carbon-neutrality-success',
  CARBON_NEUTRALITY_FAILURE = 'carbon-neutrality-failure',
  RESIDENT_HAPPINESS_FAILURE = 'resident-happiness-failure',
}

export interface ImageState {
  prompt?: string; // English prompt for image generation, not shown to user
  url?: string;    // Base64 data URL of the generated image
  isLoading: boolean;
  isGenerated: boolean;
  error?: string | null;
  skipped?: boolean; // True if user chose to skip image generation
}

export interface EndingContent {
  type: EndingType;
  title: string;
  description: string; // User-facing description of the ending type
  scenario: string; // Generated scenario text
  isGenerated: boolean; // True if scenario text has been generated
  image: ImageState;
}

export enum AppPage {
  INTRODUCTION = 'introduction',
  CHARACTER_CREATION = 'character-creation',
  PROLOGUE_GENERATION = 'prologue-generation',
  ENDING_GENERATION = 'ending-generation',
  FULL_SCENARIO = 'full-scenario',
}

export interface CharacterProfile {
  name?: string;
  gender: string;
  age: string;
  nationality: string;
  outfit: string;
  artStyle: string;
}

export interface BackgroundProfile {
  space: string;
  weather: string;
  timeOfDay: string;
  mood: string;
  composition: number; // 1: 인물중심, 5: 배경중심
}