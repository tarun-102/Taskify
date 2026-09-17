import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        console.log("MONGO_URI exists:", !!mongoUri);

        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};