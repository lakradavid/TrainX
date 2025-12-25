const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const workoutRoutes = require('./routes/workouts');
app.use('/api/workouts', workoutRoutes);
const profileRoutes = require('./routes/profile');
app.use('/api/profile', profileRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
    res.send('Virtual Personal Trainer Backend is running!');
});

// Connect to MongoDB
console.log('🔌 Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log('📍 Database:', process.env.MONGODB_URI.split('/').pop().split('?')[0]);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        
        if (err.message.includes('authentication failed')) {
            console.error('🔐 Authentication failed - check username/password in MONGODB_URI');
        } else if (err.message.includes('network')) {
            console.error('🌐 Network error - check internet connection and MongoDB Atlas status');
        } else if (err.message.includes('timeout')) {
            console.error('⏰ Connection timeout - MongoDB Atlas cluster might be paused');
        }
        
        console.error('\n💡 Quick fixes:');
        console.error('1. Check MongoDB Atlas cluster status');
        console.error('2. Verify Network Access whitelist');
        console.error('3. Run: node test-db.js');
        
        process.exit(1);
    });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});