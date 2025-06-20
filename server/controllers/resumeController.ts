import { Request, Response, NextFunction } from 'express';
import { extractTextFromPDF } from '../services/pdfService';
import { analyzeResumeWithAI } from '../services/aiService';
import { calculateResumeScore } from '../services/scoringService';
import { createError } from '../middleware/errorHandler';
import fs from 'fs';
import path from 'path';


export const analyzeResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw createError('No file uploaded', 400);
      }
  
      console.log(`Processing resume: ${req.file.originalname}`);
  
      
      const resumeText = await extractTextFromPDF(req.file.path);
      
      if (!resumeText || resumeText.trim().length < 50) {
        throw createError('Could not extract meaningful text from PDF. Please ensure it\'s not a scanned image.', 400);
      }
  
      const aiAnalysis = await analyzeResumeWithAI(resumeText);
  
      const scores = await calculateResumeScore(resumeText, aiAnalysis);
  
      fs.unlinkSync(req.file.path);
  
      res.json({
        success: true,
        data: {
          filename: req.file.originalname,
          analysis: {
            overallScore: scores.overall,
            scores: {
              atsCompatibility: scores.atsCompatibility,
              keywords: scores.keywords,
              formatting: scores.formatting,
              content: scores.content,
              experience: scores.experience,
              skills: scores.skills
            },
            feedback: aiAnalysis.feedback,
            suggestions: aiAnalysis.suggestions,
            strengths: aiAnalysis.strengths,
            improvements: aiAnalysis.improvements,
            keywordsDensity: scores.keywordAnalysis,
            analyzedAt: new Date().toISOString()
          }
        }
      });
  
    } catch (error) {
        if (req.file?.path) {
            try {
            fs.unlinkSync(req.file.path);
            } catch (cleanupError) {
            console.error('Failed to cleanup file:', cleanupError);
            }
        }
        next(error);
    }
  };
  
  export const uploadResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw createError('No file uploaded', 400);
      }
  
      const resumeText = await extractTextFromPDF(req.file.path);
      
      fs.unlinkSync(req.file.path);
  
      res.json({
        success: true,
        data: {
          filename: req.file.originalname,
          textLength: resumeText.length,
          preview: resumeText.substring(0, 200) + '...',
          message: 'Resume uploaded and processed successfully'
        }
      });
  
    } catch (error) {
      if (req.file?.path) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Failed to cleanup file:', cleanupError);
        }
      }
      next(error);
    }
  };