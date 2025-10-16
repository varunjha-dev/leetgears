const express = require('express')
const app = express();
require('dotenv').config();
const main =  require('./config/db')
const cookieParser =  require('cookie-parser');
const authRouter = require("./routes/userAuth");
const redisClient = require("./config/redis")
const problemRouter = require("./routes/problemCreator")
const submitRouter = require("./routes/submit")
const aiRouter = require("./routes/aichatting")
const cors = require('cors')

// CORS Configuration
const corsOptions = {
    origin: 'http://localhost:5173',
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

// Add basic error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something broke!' });
});

app.use('/user',authRouter);
app.use('/problem',problemRouter);
app.use('/submission',submitRouter);
app.use('/ai',aiRouter);

const PORT = process.env.PORT || 3000;

const InitalizeConnection = async () => {
    try {
        // Connect to MongoDB and Redis
        await Promise.all([main(), redisClient.connect()]);
        console.log("✅ DB and Redis Connected");
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    }
    catch(error) {
        console.error("❌ Error occurred:", error);
        process.exit(1); // Exit if we can't connect to critical services
    }
}

// Start the server
InitalizeConnection().catch(console.error);