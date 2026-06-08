import mongoose, {
    Document,
    Schema,
} from "mongoose";

export interface IOffice extends Document {
    country: string;
    officeType: string;

    address: string;

    latitude: number;
    longitude: number;

    phone?: string;
    email?: string;

}

const officeSchema = new Schema(
    {
        country: {
            type: String,
            required: true,
            trim: true,
        },

        officeType: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
        },

        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        phone: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            default: "",
        },

    },
    {
        timestamps: true,
    }
);

export const Office =
    mongoose.model<IOffice>(
        "Office",
        officeSchema
    );