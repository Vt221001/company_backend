import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../Config/cloudinary";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "cms-pages",
    } as any,
});

export const cloudinaryUpload = multer({
    storage,
});