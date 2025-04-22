import mongoose, { ConnectOptions } from "mongoose";

export const connectdb = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.error("❌ MongoDB URI is not defined in environment variables.");
        return { 
            success: false, 
            message: "MongoDB URI is not configured." 
        };
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI);

        if (conn.connection.readyState === 1) {
            console.log("Successfully connected to MongoDB ✅ :", conn.connection.host);
            return { 
                success: true, 
                message: "Connected to the database.",
                host: conn.connection.host 
            };
        } else {
            throw new Error("Mongoose connection in an unexpected state.");
        }
    } catch (error) {
        console.error("❌ Database connection error:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Unknown database error",
        };
    }
};