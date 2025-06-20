export interface ResumeAnalysis {
    overallScore: number;
    scores: {
      atsCompatibility: number;
      keywords: number;
      formatting: number;
      content: number;
      experience: number;
      skills: number;
    };
    feedback: string[];
    suggestions: string[];
    strengths: string[];
    improvements: string[];
    keywordsDensity: KeywordAnalysis[];
    analyzedAt: string;
  }
  
  export interface KeywordAnalysis {
    keyword: string;
    count: number;
    category: 'technical' | 'soft' | 'industry' | 'general';
    importance: 'high' | 'medium' | 'low';
  }
  
  export interface AIAnalysisResult {
    feedback: string[];
    suggestions: string[];
    strengths: string[];
    improvements: string[];
    keywordRecommendations: string[];
    professionalSummary: string;
  }
  
  export interface ScoreResult {
    overall: number;
    atsCompatibility: number;
    keywords: number;
    formatting: number;
    content: number;
    experience: number;
    skills: number;
    keywordAnalysis: KeywordAnalysis[];
  }