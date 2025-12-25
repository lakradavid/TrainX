const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  // Physical metrics
  currentWeight: { type: Number },
  targetWeight: { type: Number },
  height: { type: Number }, // in cm
  age: { type: Number },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Goals and preferences
  primaryGoal: { 
    type: String, 
    enum: ['strength', 'muscle', 'endurance', 'weight_loss', 'general_fitness'],
    default: 'general_fitness'
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  // Lifestyle factors
  dailyProtein: { type: Number }, // g/kg body weight
  averageSleep: { type: Number }, // hours
  stressLevel: { type: Number, min: 1, max: 10 },
  hydrationLevel: { type: Number }, // liters per day
  
  // Training preferences
  preferredWorkoutDuration: { type: Number }, // minutes
  workoutsPerWeek: { type: Number },
  availableEquipment: [{ type: String }],
  
  // Progress tracking
  measurements: [{
    date: { type: Date, default: Date.now },
    weight: Number,
    bodyFat: Number,
    muscleMass: Number,
    notes: String
  }],
  
  // Personal records
  personalRecords: [{
    exercise: String,
    weight: Number,
    reps: Number,
    date: { type: Date, default: Date.now }
  }],
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userProfileSchema.pre('save', function() {
  this.updatedAt = new Date();
});

module.exports = mongoose.model('UserProfile', userProfileSchema);