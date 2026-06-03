import mongoose, { Document, Schema, Types } from "mongoose";

export interface IJob extends Document {
    title: string;
    department: string;
    employmentType: "Full-time" | "Part-time" | "Contract" | "Internship";

    minExperience: number;
    maxExperience: number;

    locations: string[];
    remoteAllowed: boolean;

    aboutRole: string;

    skills: string[];
    responsibilities: string[];
    requirements: string[];

    status: "Draft" | "Published" | "Closed";

    createdBy: Types.ObjectId;

    publishedAt?: Date;
    expiresAt?: Date;
}

const jobSchema = new Schema<IJob>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            trim: true,
        },

        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Contract", "Internship"],
            default: "Full-time",
        },

        minExperience: {
            type: Number,
            required: true,
        },

        maxExperience: {
            type: Number,
            required: true,
        },

        locations: [
            {
                type: String,
                trim: true,
            },
        ],

        remoteAllowed: {
            type: Boolean,
            default: false,
        },

        aboutRole: {
            type: String,
            required: true,
        },

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        responsibilities: [
            {
                type: String,
                trim: true,
            },
        ],

        requirements: [
            {
                type: String,
                trim: true,
            },
        ],

        status: {
            type: String,
            enum: ["Draft", "Published", "Closed"],
            default: "Draft",
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        publishedAt: Date,

        expiresAt: Date,
    },
    {
        timestamps: true,
    }
);

export const Job = mongoose.model<IJob>("Job", jobSchema);