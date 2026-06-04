import express from "express";

import {
    applyJob,
    getAllApplications,
    getApplicationById,
} from "../Controller/JobApplicationController";

import { authenticateToken } from "../Middlewares/authenticateToken";
import { resumeUpload } from "../Middlewares/ResumeUpload";



const router = express.Router();

router.post(
    "/apply",
    resumeUpload.single("resume"),
    applyJob
);

router.get(
    "/",
    authenticateToken,
    getAllApplications
);

router.get(
    "/:id",
    authenticateToken,
    getApplicationById
);

export { router as jobApplicationRouter };