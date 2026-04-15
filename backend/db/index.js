import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (mongoUri) {
            console.log("Attempting to connect to provided MONGO_URI...");
            try {
                const conn = await mongoose.connect(mongoUri);
                console.log(`MongoDB Cloud Connected: ${conn.connection.host}`);
                return; // successfully connected to Cloud
            } catch (cloudError) {
                console.warn(`\n⚠️ Cloud DB connection failed (${cloudError.code || cloudError.message}).`);
                console.warn("Falling back to local in-memory database for instant testing...\n");
            }
        }

        // Fallback or local testing database
        const mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB In-Memory Test Server Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
