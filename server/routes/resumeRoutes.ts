import {Router} from 'express'
import multer from 'multer'
import { analyzeResume, uploadResume } from '../controllers/resumeController';
import { validate } from '../middleware/validate';

const resumeRoutes = Router();

const upload = multer({
    dest: 'uploads',
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if(file.mimetype === 'application/pdf'){
            cb(null, true);
        }
        else{
            cb(new Error('only PDF files are allowed'));
        }
    },
});

resumeRoutes.post('/upload', upload.single('resume'), validate, uploadResume);
resumeRoutes.post('/analyze', upload.single('resume'), validate, analyzeResume);

export default resumeRoutes;