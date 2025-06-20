import { Router } from "express";
import resumeRoutes from "./resumeRoutes";

const router = Router();

router.use('/resume', resumeRoutes);

router.get('/health', (req, res)=>{
    res.json({status: "ok", timestamp: new Date().toISOString()})
})

export default router;