export enum DesignCategory {
  SMART = 'Smart Design',
  ENTERTAINMENT = 'Entertainment Design',
  HYBRID = 'Hybrid Design'
}

export interface AnalyzedPart {
  id: string;
  name: string;
  category: DesignCategory;
  description: string;
  skills: string[];
  reasoning: string;
  boundingBox?: number[]; // [ymin, xmin, ymax, xmax] normalized to 0-1000
}

export interface AnalysisResult {
  overview: string;
  parts: AnalyzedPart[];
}

export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
}