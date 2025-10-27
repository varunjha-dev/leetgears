const express = require('express');
const app = express();
require('dotenv').config();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/userAuth');
const redisClient = require('./config/redis');
const problemRouter = require('./routes/problemCreator');
const submitRouter = require('./routes/submit');
const aiRouter = require('./routes/aichatting');
const videoRouter = require('./routes/videoCreator');
const cors = require('cors');

// Health check endpoint FIRST - before any middleware
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// CORS Configuration
const corsOptions = {
    origin: [
        'https://leetgears.onrender.com',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter);

// 404 Handler - must be after all routes
app.use((req, res, next) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Global error handling middleware - must be last
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(err.status || 500).json({ 
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

// Server configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Critical for Render deployment

// Initialize connections and start server
const InitalizeConnection = async () => {
    try {
        // Connect to MongoDB and Redis in parallel
        await Promise.all([
            main(), 
            redisClient.connect()
        ]);
        
        console.log('✅ DB and Redis Connected');
        
        // Start the server - MUST bind to 0.0.0.0
        app.listen(PORT, HOST, () => {
            console.log(`🚀 Server running on http://${HOST}:${PORT}`);
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`🏥 Health check: http://${HOST}:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Failed to initialize:', error);
        process.exit(1); // Exit if critical services fail
    }
};

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    console.log('⚠️  SIGTERM received, shutting down gracefully...');
    try {
        await redisClient.quit();
        console.log('✅ Redis connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
});

process.on('SIGINT', async () => {
    console.log('⚠️  SIGINT received, shutting down gracefully...');
    try {
        await redisClient.quit();
        console.log('✅ Redis connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during shutdown:', error);
        process.exit(1);
    }
});

// Start the application
InitalizeConnection().catch((error) => {
    console.error('❌ Startup failed:', error);
    process.exit(1);
});
