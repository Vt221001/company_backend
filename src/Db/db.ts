import mongoose from "mongoose";
import { DB_NAME } from "../constant";


const connectDB = async (): Promise<void> => {
    try {
        console.log("Mongo URI:", process.env.MONGO_URI);
        console.log("DB NAME:", DB_NAME);
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}/${DB_NAME}`
        );

        console.log(
            `MongoDB Connected !! DB HOST: ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.error("MongoDB connection error:", err);

        process.exit(1);
    }
};

export default connectDB;