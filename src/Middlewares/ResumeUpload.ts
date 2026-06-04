import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (
        req,
        file,
        cb
    ) => {
        cb(
            null,
            "public/uploads/resumes"
        );
    },

    filename: (
        req,
        file,
        cb
    ) => {
        cb(
            null,
            `${Date.now()}-${file.originalname}`
        );
    },
});

export const resumeUpload = multer({
    storage,

    fileFilter: (
        req,
        file,
        cb
    ) => {
        const allowedTypes =
            /pdf|doc|docx/;

        const extname =
            allowedTypes.test(
                path.extname(
                    file.originalname
                ).toLowerCase()
            );

        const mimetype =
            [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ].includes(file.mimetype);

        if (
            extname &&
            mimetype
        ) {
            return cb(null, true);
        }

        cb(
            new Error(
                "Only PDF, DOC and DOCX files are allowed"
            )
        );
    },

    limits: {
        fileSize:
            2 * 1024 * 1024, 
    },
});