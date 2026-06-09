import mongoose, {
    Document,
    Schema,
} from "mongoose";

export interface IOffice extends Document {
    country: string;
    officeType?: string;
    address: string;
    phone?: string;
    email?: string;
    mapUrl?: string;

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
            trim: true,
        },

        address: {
            type: String,
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
        mapUrl: {
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