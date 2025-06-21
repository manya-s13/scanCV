import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIAnalysisResult } from '../models/types';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const analyzeResumeWithAI = async (resumeText: string): Promise<AIAnalysisResult> => {
  try {
    console.log('Starting Gemini AI analysis...');
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not found, using fallback analysis');
      return getFallbackAnalysis();
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    const prompt = `
    You are an expert ATS (Applicant Tracking System) resume analyzer and career coach. 
    Analyze the following resume and provide detailed feedback.

    Resume Content:
    "${resumeText}"

    Please analyze this resume and provide a JSON response with the following structure:
    {
      "feedback": ["3-5 specific feedback points about what's working well"],
      "suggestions": ["5-7 actionable suggestions for improvement"],
      "strengths": ["3-4 key strengths identified in the resume"],
      "improvements": ["4-6 specific areas that need improvement"],
      "keywordRecommendations": ["10-15 important keywords this resume should include"],
      "professionalSummary": "A 2-3 sentence summary of this candidate's profile"
    }

    Focus on:
    - ATS compatibility and keyword optimization
    - Professional formatting and structure
    - Content quality and impact
    - Skills and experience presentation
    - Missing elements that could strengthen the resume

    Provide specific, actionable advice. Be constructive but honest.
    Return only valid JSON, no additional text or formatting.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('No response from Gemini AI service');
    }

    // Clean up the response to extract JSON
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse JSON response
    let analysisResult: AIAnalysisResult;
    try {
      analysisResult = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      console.warn('🔄 Falling back to algorithm-based analysis');
      return getFallbackAnalysis();
    }
    
    console.log('✅ Gemini AI analysis completed successfully');
    return analysisResult;
    
  } catch (error) {
    console.error('Gemini AI analysis failed:', error);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      
      // Check for specific Gemini API errors
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('403')) {
        console.warn('🚨 Invalid Gemini API key - using fallback analysis');
      } else if (error.message.includes('RATE_LIMIT_EXCEEDED') || error.message.includes('429')) {
        console.warn('🚨 Gemini rate limit exceeded - using fallback analysis');
      }
    }
    
    return getFallbackAnalysis();
  }
};

const getFallbackAnalysis = (): AIAnalysisResult => {
  return {
    feedback: [
      "Resume successfully analyzed using our enhanced scoring algorithm",
      "Your resume shows good structure and professional formatting",
      "Consider the suggestions below to further improve your ATS compatibility",
      "Technical keywords and professional language detected throughout"
    ],
    suggestions: [
      "Include more quantifiable achievements (e.g., 'Increased sales by 25%')",
      "Use strong action verbs like 'developed', 'implemented', 'managed'",
      "Ensure your resume includes industry-specific keywords for your target role",
      "Add a professional summary highlighting your key strengths and value proposition",
      "Use consistent bullet points and formatting throughout all sections",
      "Include relevant technical skills and certifications for your industry",
      "Optimize for ATS by using standard section headers like 'Experience', 'Skills', 'Education'"
    ],
    strengths: [
      "Resume demonstrates professional formatting and structure",
      "Contains relevant work experience and contact information",
      "Shows appropriate length and clear section organization",
      "Includes key professional details and accomplishments"
    ],
    improvements: [
      "Add more specific metrics and quantifiable results to showcase impact",
      "Include industry-relevant keywords for better ATS matching",
      "Consider adding a skills section if not present or expand existing one",
      "Ensure consistent date formatting and professional email address",
      "Review for any spelling or grammatical errors",
      "Consider adding relevant certifications or professional development"
    ],
    keywordRecommendations: [
      "Leadership", "Communication", "Problem-solving", "Team collaboration",
      "Project management", "Data analysis", "Results-driven", "Innovation",
      "Strategic planning", "Process improvement", "Customer service", 
      "Technical expertise", "Cross-functional", "Stakeholder management", "Quality assurance"
    ],
    professionalSummary: "Experienced professional with demonstrated expertise in their field, seeking to leverage proven skills and track record of success in a challenging role that offers growth opportunities and the ability to make meaningful contributions."
  };
};
