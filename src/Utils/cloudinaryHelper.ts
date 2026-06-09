import cloudinary from "../Config/cloudinary";

export const deleteCloudinaryImage = async (
    imageUrl: string
) => {
    try {
        if (!imageUrl) return;

        const parts =
            imageUrl.split("/upload/");

        if (
            !parts ||
            parts.length < 2
        )
            return;

        const publicId = parts[1]
            .replace(/^v\d+\//, "")
            .replace(
                /\.[^/.]+$/,
                ""
            );

        console.log(publicId);

        const result = await cloudinary.uploader.destroy(
            publicId
        );

        console.log(
            "PUBLIC ID:",
            publicId
        );

        console.log(
            "DELETE RESULT:",
            result
        );
    } catch (error) {
        console.error(
            "Cloudinary delete error:",
            error
        );
    }
};