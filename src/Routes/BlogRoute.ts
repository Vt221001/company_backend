import express from "express";
import { authenticateToken } from "../Middlewares/authenticateToken";
import { upload } from "../Middlewares/multer";
import { createBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from "../Controller/BlogController";

const router = express.Router();

router.post(
    "/",
    authenticateToken,
    upload.single("coverImage"),
    createBlog
);

router.get("/", getAllBlogs);

router.get("/:id", getBlogById);

router.put(
    "/:id",
    authenticateToken,
    upload.single("coverImage"),
    updateBlog
);

router.delete(
    "/:id",
    authenticateToken,
    deleteBlog
);

export { router as blogRouter };