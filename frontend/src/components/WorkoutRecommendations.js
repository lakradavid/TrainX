import React, { useState, useEffect } from 'react';
import { createPlan } from '../services/api';

const WorkoutRecommendations = ({ readiness, trainingIntensity, currentGoal }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  useEffect(() => {
    generateRecommendations();
  }, [readiness, trainingIntensity, currentGoal]);

  const generateRecommendations = () => {
    const workoutTemplates = {
      strength: {
        high: {
          name: "Heavy Strength Training",
          description: "Focus on compound movements with heavy weights",
          exercises: [
            { name: "Barbell Squat", sets: 5, reps: "3-5", restTime: "3-5 min" },
            { name: "Deadlift", sets: 4, reps: "3-5", restTime: "3-5 min" },
            { name: "Bench Press", sets: 4, reps: "3-5", restTime: "3-5 min" },
            { name: "Overhead Press", sets: 3, reps: "5-6", restTime: "3 min" },
            { name: "Barbell Row", sets: 3, reps: "5-6", restTime: "3 min" }
          ]
        },
        moderate: {
          name: "Moderate Strength Training",
          description: "Balanced approach with moderate intensity",
          exercises: [
            { name: "Goblet Squat", sets: 4, reps: "6-8", restTime: "2-3 min" },
            { name: "Romanian Deadlift", sets: 3, reps: "6-8", restTime: "2-3 min" },
            { name: "Push-ups", sets: 3, reps: "8-12", restTime: "90s" },
            { name: "Dumbbell Row", sets: 3, reps: "8-10", restTime: "90s" },
            { name: "Plank", sets: 3, reps: "30-60s", restTime: "60s" }
          ]
        },
        light: {
          name: "Light Strength Training",
          description: "Focus on movement quality and technique",
          exercises: [
            { name: "Bodyweight Squat", sets: 3, reps: "10-15", restTime: "60s" },
            { name: "Glute Bridge", sets: 3, reps: "12-15", restTime: "60s" },
            { name: "Wall Push-ups", sets: 3, reps: "10-15", restTime: "60s" },
            { name: "Band Pull-apart", sets: 3, reps: "15-20", restTime: "45s" },
            { name: "Dead Bug", sets: 2, reps: "10 each side", restTime: "45s" }
          ]
        }
      },
      muscle: {
        high: {
          name: "Hypertrophy Training",
          description: "High volume training for muscle growth",
          exercises: [
            { name: "Barbell Squat", sets: 4, reps: "8-12", restTime: "90s" },
            { name: "Bench Press", sets: 4, reps: "8-12", restTime: "90s" },
            { name: "Bent-over Row", sets: 4, reps: "8-12", restTime: "90s" },
            { name: "Overhead Press", sets: 3, reps: "10-15", restTime: "75s" },
            { name: "Dumbbell Curls", sets: 3, reps: "12-15", restTime: "60s" },
            { name: "Tricep Dips", sets: 3, reps: "10-15", restTime: "60s" }
          ]
        },
        moderate: {
          name: "Moderate Hypertrophy",
          description: "Balanced muscle building workout",
          exercises: [
            { name: "Dumbbell Squat", sets: 3, reps: "10-12", restTime: "75s" },
            { name: "Push-ups", sets: 3, reps: "10-15", restTime: "60s" },
            { name: "Dumbbell Row", sets: 3, reps: "10-12", restTime: "75s" },
            { name: "Shoulder Press", sets: 3, reps: "12-15", restTime: "60s" },
            { name: "Plank", sets: 3, reps: "45-60s", restTime: "60s" }
          ]
        },
        light: {
          name: "Light Muscle Activation",
          description: "Gentle muscle activation and pump",
          exercises: [
            { name: "Bodyweight Squat", sets: 2, reps: "15-20", restTime: "45s" },
            { name: "Incline Push-ups", sets: 2, reps: "12-15", restTime: "45s" },
            { name: "Band Rows", sets: 2, reps: "15-20", restTime: "45s" },
            { name: "Arm Circles", sets: 2, reps: "10 each direction", restTime: "30s" },
            { name: "Cat-Cow Stretch", sets: 2, reps: "10-15", restTime: "30s" }
          ]
        }
      },
      endurance: {
        high: {
          name: "High-Intensity Endurance",
          description: "Circuit training for cardiovascular fitness",
          exercises: [
            { name: "Burpees", sets: 4, reps: "30s work", restTime: "30s" },
            { name: "Mountain Climbers", sets: 4, reps: "30s work", restTime: "30s" },
            { name: "Jump Squats", sets: 4, reps: "30s work", restTime: "30s" },
            { name: "High Knees", sets: 4, reps: "30s work", restTime: "30s" },
            { name: "Plank Jacks", sets: 4, reps: "30s work", restTime: "30s" }
          ]
        },
        moderate: {
          name: "Moderate Endurance Circuit",
          description: "Steady-state endurance building",
          exercises: [
            { name: "Bodyweight Squat", sets: 3, reps: "20-25", restTime: "45s" },
            { name: "Push-ups", sets: 3, reps: "15-20", restTime: "45s" },
            { name: "Lunges", sets: 3, reps: "15 each leg", restTime: "45s" },
            { name: "Plank", sets: 3, reps: "45-60s", restTime: "45s" },
            { name: "Jumping Jacks", sets: 3, reps: "30s", restTime: "45s" }
          ]
        },
        light: {
          name: "Light Cardio Recovery",
          description: "Active recovery with light movement",
          exercises: [
            { name: "Walking in Place", sets: 3, reps: "2 minutes", restTime: "60s" },
            { name: "Arm Swings", sets: 2, reps: "15 each direction", restTime: "30s" },
            { name: "Gentle Marching", sets: 3, reps: "1 minute", restTime: "45s" },
            { name: "Shoulder Rolls", sets: 2, reps: "10 each direction", restTime: "30s" },
            { name: "Deep Breathing", sets: 3, reps: "10 breaths", restTime: "30s" }
          ]
        }
      },
      weight_loss: {
        high: {
          name: "Fat Burning HIIT",
          description: "High-intensity interval training for fat loss",
          exercises: [
            { name: "Burpees", sets: 5, reps: "45s work", restTime: "15s" },
            { name: "Jump Squats", sets: 5, reps: "45s work", restTime: "15s" },
            { name: "Mountain Climbers", sets: 5, reps: "45s work", restTime: "15s" },
            { name: "Push-up to T", sets: 4, reps: "45s work", restTime: "15s" },
            { name: "Plank Jacks", sets: 4, reps: "45s work", restTime: "15s" }
          ]
        },
        moderate: {
          name: "Metabolic Circuit",
          description: "Moderate intensity fat burning circuit",
          exercises: [
            { name: "Squat to Press", sets: 4, reps: "12-15", restTime: "60s" },
            { name: "Push-ups", sets: 4, reps: "10-15", restTime: "60s" },
            { name: "Reverse Lunges", sets: 4, reps: "12 each leg", restTime: "60s" },
            { name: "Plank", sets: 3, reps: "45s", restTime: "60s" },
            { name: "Jumping Jacks", sets: 3, reps: "45s", restTime: "60s" }
          ]
        },
        light: {
          name: "Low-Impact Fat Loss",
          description: "Gentle movements for active recovery",
          exercises: [
            { name: "Step-ups", sets: 3, reps: "15 each leg", restTime: "60s" },
            { name: "Wall Push-ups", sets: 3, reps: "12-15", restTime: "60s" },
            { name: "Seated Leg Extensions", sets: 3, reps: "15-20", restTime: "45s" },
            { name: "Arm Raises", sets: 3, reps: "15-20", restTime: "45s" },
            { name: "Gentle Stretching", sets: 1, reps: "5 minutes", restTime: "N/A" }
          ]
        }
      }
    };

    const intensityMap = {
      'rest': 'light',
      'light': 'light',
      'moderate': 'moderate',
      'normal': 'high',
      'high': 'high'
    };

    const intensity = intensityMap[trainingIntensity] || 'moderate';
    const goalWorkouts = workoutTemplates[currentGoal] || workoutTemplates.strength;
    const recommendedWorkout = goalWorkouts[intensity] || goalWorkouts.moderate;

    // Generate multiple variations
    const variations = [
      recommendedWorkout,
      // Add some alternative workouts
      ...(intensity === 'high' ? [goalWorkouts.moderate] : []),
      ...(intensity === 'light' ? [] : [goalWorkouts.light])
    ].filter(Boolean);

    setRecommendations(variations);
  };

  const createWorkoutPlan = async (workout) => {
    try {
      const planData = {
        name: `${workout.name} - ${new Date().toLocaleDateString()}`,
        description: workout.description,
        exercises: workout.exercises
      };

      await createPlan(planData);
      alert('Workout plan created successfully!');
    } catch (error) {
      console.error('Error creating workout plan:', error);
      alert('Error creating workout plan');
    }
  };

  return (
    <div className="workout-recommendations">
      <h5 className="fw-bold mb-3">🎯 Recommended Workouts</h5>
      
      <div className="alert alert-info mb-3">
        <strong>Based on your current state:</strong>
        <br />
        Readiness: {readiness}/100 | Intensity: {trainingIntensity} | Goal: {currentGoal}
      </div>

      <div className="row">
        {recommendations.map((workout, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{workout.name}</h6>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setSelectedWorkout(selectedWorkout === index ? null : index)}
                >
                  {selectedWorkout === index ? 'Hide' : 'View'}
                </button>
              </div>
              
              <div className="card-body">
                <p className="text-muted small">{workout.description}</p>
                
                {selectedWorkout === index && (
                  <div>
                    <div className="exercise-list mb-3">
                      {workout.exercises.map((exercise, exIndex) => (
                        <div key={exIndex} className="border-bottom py-2">
                          <div className="d-flex justify-content-between">
                            <strong>{exercise.name}</strong>
                            <small className="text-muted">{exercise.restTime}</small>
                          </div>
                          <small>
                            {exercise.sets} sets × {exercise.reps}
                          </small>
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      className="btn btn-success btn-sm w-100"
                      onClick={() => createWorkoutPlan(workout)}
                    >
                      📋 Create This Plan
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center text-muted">
          <p>No recommendations available. Please check your settings.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutRecommendations;