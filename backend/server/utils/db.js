import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// MongoDB URI from environment variables
const mongoDBURL = process.env.MONGODB_URL;

if (!mongoDBURL) {
    throw new Error('MongoDB URI is not defined in .env file');
}

// Define the connectDB function
const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to Database');
    } catch (error) {
        console.error('Error connecting to Database:', error.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
