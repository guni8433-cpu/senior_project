export interface AnalysisResult {
  trends: string[];
  keywords: string[];
  dramaTechniques: string[];
}

export interface ScriptTopic {
  id: string;
  title: string;
  description: string;
  category: 'retirement' | 'true_story' | 'twist' | 'romance';
  dramaTrope: string;
}

export interface GeneratedScript {
  title: string;
  logline: string;
  characters: string;
  fullScript: string;
  analysisNote: string; // The "Reverse Engineering" explanation
}

export enum AppStep {
  DASHBOARD = 'DASHBOARD',
  TOPIC_SELECTION = 'TOPIC_SELECTION',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT',
}

export interface GenerateConfig {
  topic: ScriptTopic;
  customPrompt?: string;
  length?: 'medium' | 'long';
}