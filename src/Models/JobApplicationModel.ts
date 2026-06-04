import mongoose, {
    Document,
    Schema,
} from "mongoose";

export interface IJobApplication
    extends Document {
    jobTitle: string;


    fullName: string;
    email: string;
    phoneNumber: string;

    resumeUrl: string;
    coverNote: string;

    appliedAt: Date;
}

const jobApplicationSchema =
    new Schema<IJobApplication>(
        {

            jobTitle: {
                type: String,
                required: true,
                trim: true,
            },


            fullName: {
                type: String,
                required: true,
                trim: true,
            },

            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
            },

            phoneNumber: {
                type: String,
                required: true,
                trim: true,
            },

            resumeUrl: {
                type: String,
                required: true,
            },

            coverNote: {
                type: String,
                required: true,
            },

            appliedAt: {
                type: Date,
                default: Date.now,
            },
        },
        {
            timestamps: true,
        }
    );

export const JobApplication =
    mongoose.model<IJobApplication>(
        "JobApplication",
        jobApplicationSchema
    );