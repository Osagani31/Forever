import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = String(process.env.MONGODB_URI || "").trim();
        const dbName = process.env.MONGODB_DB_NAME || "Forever2";

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not set in .env");
        }

        // Build a safe connection URI. Only inject dbName when URI has no database path.
        let connectionUri = mongoUri;
        try {
            const parsedUri = new URL(mongoUri);
            const hasDatabaseInUri = parsedUri.pathname && parsedUri.pathname !== "/";
            if (!hasDatabaseInUri && dbName) {
                parsedUri.pathname = `/${dbName}`;
                connectionUri = parsedUri.toString();
            }
        } catch {
            // Fallback for unexpected URI formats.
            const hasQuery = mongoUri.includes("?");
            const [base, query = ""] = mongoUri.split("?");
            const normalizedBase = base.replace(/\/+$/, "");
            connectionUri = dbName ? `${normalizedBase}/${dbName}` : normalizedBase;
            if (hasQuery && query) {
                connectionUri = `${connectionUri}?${query}`;
            }
        }

        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        await mongoose.connect(connectionUri, {
            serverSelectionTimeoutMS: 10000,
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

export default connectDB;