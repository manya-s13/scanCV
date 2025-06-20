import pdf from 'pdf-parse';
import fs from 'fs'
import { createError } from '../middleware/errorHandler';


export const extractTextFromPDF = async (filePath: string): Promise<string> => {
    try{
        console.log(`Extracting text from PDF: ${filePath}`);

        const pdfBuffer = fs.readFileSync(filePath);

        const pdfData = await pdf(pdfBuffer);

        const cleanText = cleanPDFText(pdfData.text);

        console.log(`Extracted: ${cleanText.length} characters`);

        return cleanText;
    }
    catch(error){
        console.log('PDF extraction failed:', error);
        throw createError('Failed to extract text from PDF', 500);
    }
}

const cleanPDFText = (text: string): string => {
    return text
      // Remove extra whitespace and normalize spacing
      .replace(/\s+/g, ' ')
      // Remove weird characters that sometimes appear in PDFs
      .replace(/[^\x20-\x7E\n\r]/g, '')
      // Fix common PDF extraction issues
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
      .replace(/(\d)([A-Za-z])/g, '$1 $2') // Add space between numbers and letters
      // Clean up
      .trim();
  };
  