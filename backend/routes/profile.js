const express = require('express');
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');

const router = express.Router();

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    let profile = await UserProfile.findOne({ userId: req.userId });
    
    // Create default profile if it doesn't exist
    if (!profile) {
      profile = new UserProfile({ userId: req.userId });
      await profile.save();
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/', authMiddleware, async (req, res) => {
  try {
    const updateData = req.body;
    
    let profile = await UserProfile.findOne({ userId: req.userId });
    
    if (!profile) {
      profile = new UserProfile({ userId: req.userId, ...updateData });
    } else {
      Object.assign(profile, updateData);
    }
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add measurement
router.post('/measurements', authMiddleware, async (req, res) => {
  try {
    const { weight, bodyFat, muscleMass, notes } = req.body;
    
    let profile = await UserProfile.findOne({ userId: req.userId });
    
    if (!profile) {
      profile = new UserProfile({ userId: req.userId });
    }
    
    profile.measurements.push({
      weight,
      bodyFat,
      muscleMass,
      notes
    });
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add personal record
router.post('/records', authMiddleware, async (req, res) => {
  try {
    const { exercise, weight, reps } = req.body;
    
    let profile = await UserProfile.findOne({ userId: req.userId });
    
    if (!profile) {
      profile = new UserProfile({ userId: req.userId });
    }
    
    // Check if record already exists for this exercise
    const existingRecordIndex = profile.personalRecords.findIndex(
      record => record.exercise.toLowerCase() === exercise.toLowerCase()
    );
    
    const newRecord = { exercise, weight, reps };
    
    if (existingRecordIndex >= 0) {
      // Update existing record if new one is better
      const existingRecord = profile.personalRecords[existingRecordIndex];
      const existingVolume = existingRecord.weight * existingRecord.reps;
      const newVolume = weight * reps;
      
      if (newVolume > existingVolume) {
        profile.personalRecords[existingRecordIndex] = newRecord;
      }
    } else {
      // Add new record
      profile.personalRecords.push(newRecord);
    }
    
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get analytics data
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.userId });
    
    if (!profile) {
      return res.json({
        weightProgress: [],
        recordsCount: 0,
        measurementsCount: 0
      });
    }
    
    // Calculate weight progress over time
    const weightProgress = profile.measurements
      .filter(m => m.weight)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(m => ({
        date: m.date,
        weight: m.weight
      }));
    
    const analytics = {
      weightProgress,
      recordsCount: profile.personalRecords.length,
      measurementsCount: profile.measurements.length,
      latestWeight: weightProgress.length > 0 ? weightProgress[weightProgress.length - 1].weight : null,
      personalRecords: profile.personalRecords.sort((a, b) => new Date(b.date) - new Date(a.date))
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;