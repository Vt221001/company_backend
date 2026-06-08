import mongoose, {
    Document,
    Schema,
} from "mongoose";

export interface IContact
    extends Document {
    fullName: string;
    email: string;
    phoneNumber: string;
    message: string;
}

const contactSchema =
    new Schema(
        {
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

            message: {
                type: String,
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

export const Contact =
    mongoose.model(
        "Contact",
        contactSchema
    );