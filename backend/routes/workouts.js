const express = require('express');
const jwt = require('jsonwebtoken');
const WorkoutPlan = require('../models/WorkoutPlan');
const ProgressLog = require('../models/ProgressLog');

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

// Create a workout plan
router.post('/plans', authMiddleware, async (req, res) => {
  try {
    const { name, description, exercises } = req.body;
    const plan = new WorkoutPlan({
      userId: req.userId,
      name,
      description,
      exercises
    });
    await plan.save();
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all plans for the user
router.get('/plans', authMiddleware, async (req, res) => {
  try {
    const plans = await WorkoutPlan.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Log progress for a plan
router.post('/logs', authMiddleware, async (req, res) => {
  try {
    const { planId, completedExercises, overallNotes } = req.body;
    const log = new ProgressLog({
      userId: req.userId,
      planId,
      completedExercises,
      overallNotes
    });
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all logs for the user
router.get('/logs', authMiddleware, async (req, res) => {
  try {
    const logs = await ProgressLog.find({ userId: req.userId })
      .populate('planId', 'name')
      .sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;