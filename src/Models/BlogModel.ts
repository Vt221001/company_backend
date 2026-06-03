import mongoose, {
    Document,
    Schema,
    Types,
} from "mongoose";

export interface IBlog extends Document {
    title: string;
    slug: string;
    excerpt: string;

    content: string;

    coverImage: string;

    category: string;

    tags: string[];

    readTime: number;

    status: "Draft" | "Published";

    author: Types.ObjectId;

    publishedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        excerpt: {
            type: String,
            required: true,
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        coverImage: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        tags: [
            {
                type: String,
                trim: true,
            },
        ],

        readTime: {
            type: Number,
            default: 1,
        },

        status: {
            type: String,
            enum: ["Draft", "Published"],
            default: "Draft",
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        publishedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export const Blog = mongoose.model<IBlog>(
    "Blog",
    blogSchema
);