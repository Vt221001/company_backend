import express from "express";
import {
    createJob,
    deleteJob,
    getAllJobs,
    getJobById,
    updateJob,
} from "../Controller/JobController";
import { authenticateToken } from "../Middlewares/authenticateToken";



const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createJob
);

router.get(
    "/",
    getAllJobs
);

router.get(
    "/:id",
    getJobById
);

router.put(
    "/:id",
    authenticateToken,
    updateJob
);

router.delete(
    "/:id",
    authenticateToken,
    deleteJob
);

export { router as jobRouter };