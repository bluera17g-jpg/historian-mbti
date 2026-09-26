export interface DimensionType {
  code: string;
  name: string;
  description: string;
}

export interface Question {
  id: number;
  text: string;
  optionA: string;
  optionB: string;
}

export interface Dimension {
  id: string;
  name: string;
  typeA: DimensionType;
  typeB: DimensionType;
  questions: Question[];
}

export interface Personality {
  code: string;
  tag: string;
  historian: string;
  description: string;
  traits: string[];
  strengths: string[];
  suitableFor: string[];
}

export interface TestResult {
  code: string;
  scores: {
    S: number;
    P: number;
    F: number;
    I: number;
    O: number;
    H: number;
    Y: number;
    E: number;
  };
  dimensions: {
    SP: { winner: 'S' | 'P' | 'balanced'; diff: number };
    FI: { winner: 'F' | 'I' | 'balanced'; diff: number };
    OH: { winner: 'O' | 'H' | 'balanced'; diff: number };
    YE: { winner: 'Y' | 'E' | 'balanced'; diff: number };
  };
  isComposite: boolean;
  compositeCodes?: string[];
}

export type AnswerKey = 'A' | 'B' | null;

export interface UserAnswers {
  [questionId: number]: AnswerKey;
}
