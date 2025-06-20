import { AIAnalysisResult, ScoreResult, KeywordAnalysis } from '../models/types';

export const calculateResumeScore = async (
  resumeText: string, 
  aiAnalysis: AIAnalysisResult
): Promise<ScoreResult> => {
  
  console.log('📊 Calculating resume scores...');
  
  // 1. ATS Compatibility Score
  const atsScore = calculateATSCompatibility(resumeText);
  
  // 2. Keywords Score
  const keywordAnalysis = analyzeKeywords(resumeText);
  const keywordScore = calculateKeywordScore(keywordAnalysis);
  
  // 3. Formatting Score
  const formattingScore = calculateFormattingScore(resumeText);
  
  // 4. Content Score
  const contentScore = calculateContentScore(resumeText);
  
  // 5. Experience Score
  const experienceScore = calculateExperienceScore(resumeText);
  
  // 6. Skills Score
  const skillsScore = calculateSkillsScore(resumeText);
  
  // Calculate overall score (weighted average)
  const overall = Math.round(
    (atsScore * 0.25) +
    (keywordScore * 0.20) +
    (formattingScore * 0.15) +
    (contentScore * 0.20) +
    (experienceScore * 0.10) +
    (skillsScore * 0.10)
  );
  
  console.log(`✅ Scoring completed - Overall: ${overall}/100`);
  
  return {
    overall,
    atsCompatibility: atsScore,
    keywords: keywordScore,
    formatting: formattingScore,
    content: contentScore,
    experience: experienceScore,
    skills: skillsScore,
    keywordAnalysis
  };
};

// ATS Compatibility Score (0-100)
const calculateATSCompatibility = (text: string): number => {
  let score = 100;
  
  // Deduct points for ATS-unfriendly elements
  if (text.includes('│') || text.includes('─') || text.includes('┌')) {
    score -= 20; // Special characters/tables
  }
  
  if (text.length < 500) {
    score -= 30; // Too short
  }
  
  if (text.length > 5000) {
    score -= 10; // Too long
  }
  
  // Check for standard sections
  const hasContactInfo = /email|phone|@/.test(text.toLowerCase());
  const hasExperience = /experience|work|employment|job/.test(text.toLowerCase());
  const hasSkills = /skills|technical|technologies/.test(text.toLowerCase());
  
  if (!hasContactInfo) score -= 25;
  if (!hasExperience) score -= 25;
  if (!hasSkills) score -= 15;
  
  return Math.max(0, Math.min(100, score));
};

// Analyze keywords in the resume
const analyzeKeywords = (text: string): KeywordAnalysis[] => {
  const keywords = {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
      'HTML', 'CSS', 'Git', 'AWS', 'Docker', 'API', 'Database', 'Frontend',
      'Backend', 'Full-stack', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL'
    ],
    soft: [
      'Leadership', 'Communication', 'Team', 'Collaboration', 'Problem-solving',
      'Management', 'Analytical', 'Creative', 'Adaptable', 'Organized'
    ],
    industry: [
      'Agile', 'Scrum', 'CI/CD', 'DevOps', 'Testing', 'Debugging', 'Optimization',
      'Architecture', 'Design', 'Development', 'Implementation', 'Integration'
    ],
    general: [
      'Experience', 'Project', 'Team', 'Responsible', 'Developed', 'Implemented',
      'Managed', 'Led', 'Created', 'Designed', 'Built', 'Improved'
    ]
  };
  
  const analysis: KeywordAnalysis[] = [];
  const lowerText = text.toLowerCase();
  
  // Analyze each category
  Object.entries(keywords).forEach(([category, words]) => {
    words.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, 'gi');
      const matches = text.match(regex);
      const count = matches ? matches.length : 0;
      
      if (count > 0) {
        analysis.push({
          keyword,
          count,
          category: category as 'technical' | 'soft' | 'industry' | 'general',
          importance: getKeywordImportance(keyword, category)
        });
      }
    });
  });
  
  return analysis.sort((a, b) => b.count - a.count);
};

// Calculate keyword score based on diversity and frequency
const calculateKeywordScore = (keywordAnalysis: KeywordAnalysis[]): number => {
  if (keywordAnalysis.length === 0) return 0;
  
  const categories = ['technical', 'soft', 'industry', 'general'];
  const categoryScores = categories.map(cat => {
    const categoryKeywords = keywordAnalysis.filter(k => k.category === cat);
    return categoryKeywords.length > 0 ? Math.min(25, categoryKeywords.length * 5) : 0;
  });
  
  return Math.min(100, categoryScores.reduce((a, b) => a + b, 0));
};

// Calculate formatting score
const calculateFormattingScore = (text: string): number => {
  let score = 70; // Base score
  
  // Check for bullet points
  if (text.includes('•') || text.includes('-') || text.includes('*')) {
    score += 15;
  }
  
  // Check for proper sections (based on common patterns)
  const sections = ['experience', 'education', 'skills', 'summary', 'objective'];
  const foundSections = sections.filter(section => 
    text.toLowerCase().includes(section)
  ).length;
  
  score += foundSections * 3;
  
  // Penalize very long paragraphs (sign of poor formatting)
  const paragraphs = text.split('\n').filter(p => p.trim().length > 0);
  const longParagraphs = paragraphs.filter(p => p.length > 500).length;
  score -= longParagraphs * 10;
  
  return Math.max(0, Math.min(100, score));
};

// Calculate content quality score
const calculateContentScore = (text: string): number => {
  let score = 50; // Base score
  
  // Check for quantifiable achievements
  const numbers = text.match(/\d+%|\$\d+|\d+\+|increased|decreased|improved/gi);
  if (numbers && numbers.length > 0) {
    score += Math.min(30, numbers.length * 5);
  }
  
  // Check for action verbs
  const actionVerbs = [
    'achieved', 'managed', 'led', 'developed', 'implemented', 'created',
    'designed', 'built', 'improved', 'optimized', 'streamlined'
  ];
  
  const actionVerbCount = actionVerbs.filter(verb => 
    text.toLowerCase().includes(verb)
  ).length;
  
  score += Math.min(20, actionVerbCount * 3);
  
  return Math.max(0, Math.min(100, score));
};

// Calculate experience score
const calculateExperienceScore = (text: string): number => {
  let score = 50;
  
  // Look for date patterns (experience timeline)
  const datePatterns = text.match(/\d{4}|\d{1,2}\/\d{4}|present|current/gi);
  if (datePatterns && datePatterns.length >= 2) {
    score += 25;
  }
  
  // Look for company/organization names (usually capitalized)
  const companies = text.match(/[A-Z][a-z]+ [A-Z][a-z]+|[A-Z][a-z]+ Inc|[A-Z][a-z]+ LLC/g);
  if (companies && companies.length > 0) {
    score += Math.min(25, companies.length * 8);
  }
  
  return Math.max(0, Math.min(100, score));
};

// Calculate skills score
const calculateSkillsScore = (text: string): number => {
  const commonSkills = [
    'programming', 'software', 'technical', 'computer', 'digital',
    'analytical', 'communication', 'leadership', 'management'
  ];
  
  const skillCount = commonSkills.filter(skill => 
    text.toLowerCase().includes(skill)
  ).length;
  
  return Math.min(100, skillCount * 12);
};

// Helper function to determine keyword importance
const getKeywordImportance = (keyword: string, category: string): 'high' | 'medium' | 'low' => {
  const highImportance = [
    'JavaScript', 'Python', 'React', 'Leadership', 'Management',
    'Experience', 'Project', 'Team'
  ];
  
  if (highImportance.includes(keyword)) return 'high';
  if (category === 'technical') return 'medium';
  return 'low';
};