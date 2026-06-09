import mongoose, { Schema, Document } from "mongoose";

export interface ICmsPage extends Document {
    pageName: string;
    slug: string;

    icon?: string;
    menuSubtitle?: string;


    hero: {
        title?: string;
        subtitle?: string;
        bannerImage?: string;
    };

    sections: {
        type: string;
        title?: string;
        subtitle?: string;
        description?: string;
        image?: string;
        items?: any[];
    }[];
}

const cmsPageSchema = new Schema(
    {
        pageName: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        icon: {
            type: String,
            trim: true,
        },
        menuSubtitle: {
            type: String,
            trim: true,
        },
        hero: {
            title: String,
            subtitle: String,
            bannerImage: String,
        },

        sections: [
            {
                type: {
                    type: String,
                    required: true,
                },

                title: String,

                subtitle: String,

                description: String,

                image: String,

                items: {
                    type: [Schema.Types.Mixed],
                    default: [],
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICmsPage>(
    "CmsPage",
    cmsPageSchema
);