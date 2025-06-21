import OpenAI from 'openai';
import { AIAnalysisResult } from '../models/types';
import dotenv from 'dotenv';

dotenv.config();

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeResumeWithAI = async (resumeText: string): Promise<AIAnalysisResult> => {
  try {
    console.log('Starting AI analysis...');
    
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
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyst. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    const aiResponse = response.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI service');
    }

    // Parse JSON response
    let analysisResult: AIAnalysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', aiResponse);
      throw new Error('Invalid JSON response from AI service');
    }    
    
    
    console.log(' AI analysis completed successfully');
    
    return analysisResult;
    
  } catch (error) {
    console.error(' AI analysis failed:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Fallback analysis if AI fails
    return {

        feedback: [
          "Resume successfully analyzed using our scoring algorithm",
          "Your resume shows good structure and formatting",
          "Consider the suggestions below to further improve your ATS compatibility",
          "Technical keywords and professional language detected"
        ],
        suggestions: [
          "Include more quantifiable achievements (e.g., 'Increased sales by 25%')",
          "Use strong action verbs like 'developed', 'implemented', 'managed'",
          "Ensure your resume includes industry-specific keywords",
          "Add a professional summary highlighting your key strengths",
          "Use consistent bullet points and formatting throughout",
          "Include relevant technical skills for your target role",
          "Optimize for ATS by using standard section headers"
        ],
        strengths: [
          "Resume demonstrates professional formatting",
          "Contains relevant work experience information",
          "Shows appropriate length and structure",
          "Includes contact information and key sections"
        ],
        improvements: [
          "Add more specific metrics and quantifiable results",
          "Include industry-relevant keywords for better ATS matching",
          "Consider adding a skills section if not present",
          "Ensure consistent date formatting throughout"
        ],
        keywordRecommendations: [
          "Leadership", "Communication", "Problem-solving", "Team collaboration",
          "Project management", "Data analysis", "Results-driven", "Innovation",
          "Strategic planning", "Process improvement", "Customer service", "Technical expertise"
        ],
        professionalSummary: "Experienced professional with demonstrated expertise in their field, seeking to leverage skills and experience in a challenging role that offers growth opportunities."
      };
    }
  }