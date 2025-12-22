const mongoose = require('mongoose');

const progressLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkoutPlan',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  completedExercises: [{
    name: { type: String, required: true },
    setsCompleted: { type: Number },
    repsCompleted: { type: String },
    weightUsed: { type: Number }, // in kg or lbs
    notes: { type: String }
  }],
  overallNotes: { type: String }
});

module.exports = mongoose.model('ProgressLog', progressLogSchema);