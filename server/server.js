const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'https://blind-project.vercel.app', // Vercel Frontend URL
    'https://blindproject.pages.dev', // Cloudflare Pages URL
    process.env.FRONTEND_URL
].filter(Boolean);
const corsOptions = {
    origin: function(origin, callback) {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV === 'development') {
            return callback(null, true);
        }

        const isAllowed = allowedOrigins.indexOf(origin) !== -1 ||
            origin.endsWith('.blindproject.pages.dev');

        if (isAllowed) {
            callback(null, true);
        } else {
            console.log(`CORS blocked: ${origin}`);
            console.log('Allowed origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files setup
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const searchRoutes = require("./routes/searchRoutes");
const conversationRoutes = require("./routes/conversationRoutes");

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/conversations', conversationRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ 
        status: 'Server is running',
        message: 'BlindProject API',
        timestamp: new Date().toISOString(),
        routes: [
            '/api/auth',
            '/api/users', 
            '/api/teams',
            '/api/search',
            '/api/notifications',
            '/api/messages',
            '/api/conversations',
            '/api/ratings',
            '/api/admin'
        ]
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "حدث خطأ في السيرفر",
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('API routes ready with /api prefix');
});