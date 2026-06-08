import express from "express";

import {
    createOffice,
    getAllOffices,
    getOfficeById,
    updateOffice,
    deleteOffice,
} from "../Controller/OfficeController";

import { authenticateToken } from "../Middlewares/authenticateToken";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createOffice
);

router.get(
    "/",
    getAllOffices
);

router.get(
    "/:id",
    getOfficeById
);

router.put(
    "/:id",
    authenticateToken,
    updateOffice
);

router.delete(
    "/:id",
    authenticateToken,
    deleteOffice
);

export { router as officeRouter };