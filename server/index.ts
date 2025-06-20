import express from "express";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import router from "./routes";
import resumeRoutes from "./routes/resumeRoutes";
import errorHandler from "./middleware/errorHandler";


dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.use('/api', router);
// app.use('/api/resume', resumeRoutes);

const PORT = process.env.PORT || 3001

// app.use(errorHandler);

app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`);
})

export default app;