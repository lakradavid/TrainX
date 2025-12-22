const mongoose = require('mongoose');

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  exercises: [{
    name: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: String, required: true }, // e.g., "10-12"
    restTime: { type: String, default: '60s' }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);