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
            "public/uploads/blogs"
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

export const upload = multer({
    storage,

    fileFilter: (
        req,
        file,
        cb
    ) => {
        const allowedTypes =
            /jpeg|jpg|png|webp/;

        const extname =
            allowedTypes.test(
                path.extname(
                    file.originalname
                ).toLowerCase()
            );

        const mimetype =
            allowedTypes.test(
                file.mimetype
            );

        if (
            extname &&
            mimetype
        ) {
            return cb(null, true);
        }

        cb(
            new Error(
                "Only images are allowed"
            )
        );
    },
});