import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import jwt from 'jsonwebtoken';
import connectDB from './utils/db.js';

// Load environment variables from .env file
dotenv.config();

const app = express();


// Middleware
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));


app.get('/', (req, res) => {
    console.log(req);
    return res.status(234).send('Welcome aaa');
});

export const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request object
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);


const startServer = async () => {
    try {
        await connectDB(); // Connect to MongoDB
        const PORT = process.env.PORT || 5000; // Access the PORT value
        app.listen(PORT, () => {
            console.log(`App is listening on port: ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
};

startServer();