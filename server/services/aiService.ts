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
          content: "You are an expert resume analyst. Use the function spec to generate ATS analysis."
        },
        {
          role: "user",
          content: `Here is a resume to analyze: ${resumeText}`
        },
        {
            role: "user",
            content: `Please return your response in this JSON structure: { ... }`
          }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      functions: [
        {
          name: "return_resume_analysis",
          description: "Provides ATS-style resume analysis",
          parameters: {
            type: "object",
            properties: {
              feedback: {
                type: "array",
                items: { type: "string" }
              },
              suggestions: {
                type: "array",
                items: { type: "string" }
              },
              strengths: {
                type: "array",
                items: { type: "string" }
              },
              improvements: {
                type: "array",
                items: { type: "string" }
              },
              keywordRecommendations: {
                type: "array",
                items: { type: "string" }
              },
              professionalSummary: {
                type: "string"
              }
            },
            required: [
              "feedback",
              "suggestions",
              "strengths",
              "improvements",
              "keywordRecommendations",
              "professionalSummary"
            ]
          }
        }
      ],
      function_call: { name: "return_resume_analysis" }
    });
    const functionCall = response.choices[0]?.message?.function_call;

    if (!functionCall || !functionCall.arguments) {
        throw new Error("Function call response is missing or invalid");
      }
      
      const analysisResult: AIAnalysisResult = JSON.parse(functionCall.arguments);    
    // const aiResponse = response.choices[0]?.message?.content;
    
    // if (!aiResponse) {
    //   throw new Error('No response from AI service');
    // }

    // // Parse JSON response
    // const analysisResult: AIAnalysisResult = JSON.parse(aiResponse);
    
    console.log(' AI analysis completed successfully');
    
    return analysisResult;
    
  } catch (error) {
    console.error('❌ AI analysis failed:', error);
    
    // Fallback analysis if AI fails
    return {
      feedback: [
        "AI analysis temporarily unavailable",
        "Using basic analysis instead"
      ],
      suggestions: [
        "Ensure your resume includes relevant keywords",
        "Use bullet points for better readability",
        "Include quantifiable achievements",
        "Add a professional summary section",
        "Use consistent formatting throughout"
      ],
      strengths: [
        "Resume structure appears professional"
      ],
      improvements: [
        "Consider adding more specific details",
        "Include measurable results where possible"
      ],
      keywordRecommendations: [
        "Leadership", "Communication", "Problem-solving", "Team collaboration",
        "Project management", "Technical skills", "Results-driven"
      ],
      professionalSummary: "Professional with experience in their field seeking opportunities to contribute their skills."
    };
  }
};