import express from "express";

import {
    createCmsPage,
    getAllCmsPages,
    getCmsPageById,
    getCmsPageBySlug,
    updateCmsPage,
    deleteCmsPage,
    uploadCmsImage,
} from "../Controller/CclController";

import { authenticateToken } from "../Middlewares/authenticateToken";
import { cloudinaryUpload } from "../Middlewares/cloudinaryUpload";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    createCmsPage
);

router.post(
    "/cms-image",
    authenticateToken,
    cloudinaryUpload.single("file"),
    uploadCmsImage
);

router.get(
    "/",
    getAllCmsPages
);

router.get(
    "/slug/:slug",
    getCmsPageBySlug
);

router.get(
    "/:id",
    getCmsPageById
);

router.put(
    "/:id",
    authenticateToken,
    updateCmsPage
);

router.delete(
    "/:id",
    authenticateToken,
    deleteCmsPage
);

export { router as cmsPageRouter };