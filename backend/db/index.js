import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        console.log(mongoUri)
        if (!mongoUri) {
            throw new Error("MONGO_URI is missing in .env file. Direct connection to Atlas is required.");
        }

        console.log("Connecting to MongoDB Atlas...");
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
