import { Request, Response, NextFunction } from "express";
import { createError } from "./errorHandler";

export const validate = (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.file){
            throw createError('Please upload a file', 400);
        }
        if (req.file.mimetype !== 'application/pdf') {
            throw createError('Only PDF files are allowed', 400);
          }
      
          // Check file size (5MB limit)
          if (req.file.size > 5 * 1024 * 1024) {
            throw createError('File size must be less than 5MB', 400);
          }
      
          // Check if file is not empty
          if (req.file.size === 0) {
            throw createError('Uploaded file is empty', 400);
          }
      
          console.log(`✅ File validation passed: ${req.file.originalname} (${req.file.size} bytes)`);
          next();      
    }
    catch(error){
        next(error);
    }
};