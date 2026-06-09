import { deleteCloudinaryImage } from "./cloudinaryHelper";

export const deleteCmsPageImages = async (
    page: any
) => {

    // Hero Banner
    if (page.hero?.bannerImage) {
        console.log(page.hero.bannerImage);
        await deleteCloudinaryImage(
            page.hero.bannerImage
        );
    }

    // Sections
    for (const section of page.sections || []) {

        // Section Image
        if (section.image) {
            await deleteCloudinaryImage(
                section.image
            );
        }

        // Items
        for (const item of section.items || []) {

            if (item.image) {
                await deleteCloudinaryImage(
                    item.image
                );
            }

            if (item.logo) {
                await deleteCloudinaryImage(
                    item.logo
                );
            }
        }
    }
};