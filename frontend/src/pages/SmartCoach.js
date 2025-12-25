import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogs, getPlans } from '../services/api';
import WorkoutRecommendations from '../components/WorkoutRecommendations';
import NutritionRecommendations from '../components/NutritionRecommendations';

// Detect bodyweight exercises
const isBodyweightExercise = (name) => {
  const bodyweightKeywords = [
    'push', 'plank', 'burpee', 'pull-up',
    'chin-up', 'dip', 'mountain climber',
    'jump', 'lunge', 'squat'
  ];
  return bodyweightKeywords.some(k =>
    name.toLowerCase().includes(k)
  );
};

// Exercise categorization
const getExerciseCategory = (name) => {
  const categories = {
    chest: ['bench', 'push-up', 'chest', 'fly', 'dip'],
    back: ['pull-up', 'row', 'lat', 'deadlift', 'chin-up'],
    legs: ['squat', 'lunge', 'leg', 'calf', 'thigh'],
    shoulders: ['shoulder', 'press', 'raise', 'shrug'],
    arms: ['curl', 'tricep', 'bicep', 'arm'],
    core: ['plank', 'crunch', 'abs', 'core', 'sit-up']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(k => name.toLowerCase().includes(k))) {
      return category;
    }
  }
  return 'other';
};

// Calculate progressive overload
const calculateProgressiveOverload = (logs) => {
  if (logs.length < 2) return null;
  
  const recent = logs[0];
  const previous = logs[1];
  
  const improvements = [];
  
  recent.completedExercises.forEach(recentEx => {
    const prevEx = previous.completedExercises.find(ex => ex.name === recentEx.name);
    if (prevEx) {
      const recentVolume = (recentEx.setsCompleted || 0) * (parseInt(recentEx.repsCompleted) || 0) * (recentEx.weightUsed || 1);
      const prevVolume = (prevEx.setsCompleted || 0) * (parseInt(prevEx.repsCompleted) || 0) * (prevEx.weightUsed || 1);
      
      if (recentVolume > prevVolume) {
        const improvement = ((recentVolume - prevVolume) / prevVolume * 100).toFixed(1);
        improvements.push({
          exercise: recentEx.name,
          improvement: `+${improvement}%`
        });
      }
    }
  });
  
  return improvements;
};

const SmartCoach = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Recovery inputs
  const [protein, setProtein] = useState('');
  const [sleep, setSleep] = useState('');
  const [stress, setStress] = useState('');
  const [hydration, setHydration] = useState('');
  const [soreness, setSoreness] = useState('');

  // Goal tracking
  const [currentGoal, setCurrentGoal] = useState('strength');
  const [targetWeight, setTargetWeight] = useState('');
  const [currentWeight, setCurrentWeight] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [logsRes, plansRes] = await Promise.all([
          getLogs(),
          getPlans()
        ]);

        setLogs(logsRes.data);
        setPlans(plansRes.data);

        runAnalysis(logsRes.data, plansRes.data, protein, sleep, stress, hydration, soreness);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  /* ================= 🧠 ENHANCED ANALYSIS ENGINE ================= */
  const runAnalysis = (logsData, plansData, proteinVal, sleepVal, stressVal, hydrationVal, sorenessVal) => {
    const timestamp = new Date().toLocaleTimeString();

    if (logsData.length === 0 || plansData.length === 0) {
      setAnalysis({
        timestamp,
        message: '📭 Log workouts and create plans to unlock Smart Coach.'
      });
      return;
    }

    let fatigue = 0;
    let sessions = 0;
    let totalVolume = 0;
    const muscleGroups = {};

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Enhanced analysis with muscle group tracking
    logsData.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= sevenDaysAgo) sessions++;

      log.completedExercises.forEach(ex => {
        const sets = Number(ex.setsCompleted || 1);
        const reps = parseInt(ex.repsCompleted) || 10;
        const weight = ex.weightUsed || 1;
        
        fatigue += sets;
        totalVolume += sets * reps * weight;
        
        const category = getExerciseCategory(ex.name);
        muscleGroups[category] = (muscleGroups[category] || 0) + sets;
      });
    });

    /* 🔋 ENHANCED READINESS SCORE */
    let readiness = 100;
    
    // Sleep factor
    if (sleepVal) {
      if (sleepVal < 6) readiness -= 25;
      else if (sleepVal < 7) readiness -= 15;
      else if (sleepVal >= 8) readiness += 5;
    }
    
    // Stress factor
    if (stressVal) {
      const stressNum = Number(stressVal);
      if (stressNum >= 8) readiness -= 20;
      else if (stressNum >= 6) readiness -= 10;
      else if (stressNum <= 3) readiness += 5;
    }
    
    // Hydration factor
    if (hydrationVal) {
      const hydrationNum = Number(hydrationVal);
      if (hydrationNum < 2) readiness -= 10;
      else if (hydrationNum >= 3) readiness += 5;
    }
    
    // Soreness factor
    if (sorenessVal) {
      const sorenessNum = Number(sorenessVal);
      if (sorenessNum >= 8) readiness -= 15;
      else if (sorenessNum >= 6) readiness -= 8;
      else if (sorenessNum <= 3) readiness += 3;
    }
    
    // Training load factor
    if (fatigue > 40) readiness -= 30;
    else if (fatigue > 25) readiness -= 15;
    else if (fatigue < 10) readiness -= 5; // Too little training
    
    readiness = Math.max(0, Math.min(100, readiness));

    /* 📅 ENHANCED TRAINING DAY TYPE */
    let trainingDay, trainingIntensity;
    if (readiness < 30) {
      trainingDay = '🛑 Complete Rest';
      trainingIntensity = 'rest';
    } else if (readiness < 50) {
      trainingDay = '🧘 Active Recovery';
      trainingIntensity = 'light';
    } else if (readiness < 70) {
      trainingDay = '🏋️ Moderate Training';
      trainingIntensity = 'moderate';
    } else if (readiness < 85) {
      trainingDay = '💪 Normal Training';
      trainingIntensity = 'normal';
    } else {
      trainingDay = '🔥 High Intensity';
      trainingIntensity = 'high';
    }

    /* 🔥 ENHANCED CALORIES ESTIMATION */
    const baseCalories = {
      rest: 0,
      light: 150,
      moderate: 250,
      normal: 350,
      high: 500
    };
    
    let caloriesPerSession = baseCalories[trainingIntensity];
    const weeklyCalories = caloriesPerSession * sessions;
    const monthlyCalories = weeklyCalories * 4.3;

    /* 💪 ENHANCED MUSCLE GROWTH POTENTIAL */
    let muscleGrowth = '🔻 Low';
    let growthFactors = [];

    if (proteinVal && proteinVal >= 1.6) growthFactors.push('protein');
    if (sleepVal && sleepVal >= 7) growthFactors.push('sleep');
    if (readiness > 70) growthFactors.push('recovery');
    if (sessions >= 3 && sessions <= 5) growthFactors.push('frequency');
    if (stressVal && Number(stressVal) <= 5) growthFactors.push('stress');

    if (growthFactors.length >= 4) {
      muscleGrowth = '🔥 Optimal';
    } else if (growthFactors.length >= 3) {
      muscleGrowth = '🔶 High';
    } else if (growthFactors.length >= 2) {
      muscleGrowth = '🟡 Moderate';
    }

    /* 📊 MUSCLE GROUP BALANCE */
    const totalSets = Object.values(muscleGroups).reduce((a, b) => a + b, 0);
    const muscleBalance = {};
    Object.entries(muscleGroups).forEach(([group, sets]) => {
      muscleBalance[group] = {
        sets,
        percentage: ((sets / totalSets) * 100).toFixed(1)
      };
    });

    /* 📈 PROGRESSIVE OVERLOAD */
    const progressiveOverload = calculateProgressiveOverload(logsData);

    /* ⚠️ ENHANCED STATUS */
    let status = '✅ Balanced';
    let reason = 'Training load is appropriate';
    let statusColor = 'success';

    if (readiness < 40) {
      status = '🚨 Overreached';
      reason = 'Multiple recovery factors compromised';
      statusColor = 'danger';
    } else if (fatigue > 40) {
      status = '⚠️ High Fatigue';
      reason = 'High training volume accumulated';
      statusColor = 'warning';
    } else if (fatigue < 15 && sessions < 2) {
      status = '📉 Undertraining';
      reason = 'Training stimulus may be insufficient';
      statusColor = 'info';
    }

    /* 🧠 COMPREHENSIVE ADVICE */
    const advice = [];
    const recoveryAdvice = [];
    const trainingAdvice = [];

    // Recovery advice
    if (sleepVal && sleepVal < 7) {
      recoveryAdvice.push('😴 Prioritize 7-9 hours of quality sleep');
    }
    if (proteinVal && proteinVal < 1.6) {
      recoveryAdvice.push('🍗 Increase protein to 1.6-2.2g per kg body weight');
    }
    if (stressVal && Number(stressVal) > 6) {
      recoveryAdvice.push('🧘 Implement stress management techniques');
    }
    if (hydrationVal && Number(hydrationVal) < 2.5) {
      recoveryAdvice.push('💧 Increase daily water intake to 2.5-3L');
    }

    // Training advice
    if (fatigue > 40) {
      trainingAdvice.push('🛑 Reduce training volume by 20-30%');
      trainingAdvice.push('⏳ Extend rest periods between sets');
    } else if (fatigue < 15) {
      trainingAdvice.push('📈 Gradually increase training volume');
      trainingAdvice.push('➕ Add 1-2 sets to major exercises');
    }

    // Muscle balance advice
    const imbalances = Object.entries(muscleBalance)
      .filter(([group, data]) => data.percentage > 40 || data.percentage < 10)
      .map(([group]) => group);
    
    if (imbalances.length > 0) {
      trainingAdvice.push(`⚖️ Address muscle imbalances: ${imbalances.join(', ')}`);
    }

    /* 🏋️ ENHANCED EXERCISE SUGGESTIONS */
    const exerciseSuggestions = [];
    
    if (logsData[0]?.completedExercises) {
      logsData[0].completedExercises.forEach(ex => {
        const name = ex.name;
        const isBodyweight = isBodyweightExercise(name);
        const category = getExerciseCategory(name);

        if (trainingIntensity === 'rest') {
          exerciseSuggestions.push(`🛑 Skip ${name} today - focus on recovery`);
        } else if (trainingIntensity === 'light') {
          if (isBodyweight) {
            exerciseSuggestions.push(`🧘 ${name}: Reduce reps by 30%, focus on form`);
          } else {
            exerciseSuggestions.push(`🧘 ${name}: Use 60-70% of normal weight`);
          }
        } else if (trainingIntensity === 'high') {
          if (isBodyweight) {
            exerciseSuggestions.push(`🔥 ${name}: Add tempo or extra reps`);
          } else {
            exerciseSuggestions.push(`🔥 ${name}: Consider increasing weight by 2.5-5%`);
          }
        } else {
          exerciseSuggestions.push(`➡️ ${name}: Maintain current intensity`);
        }
      });
    }

    /* 📆 WEEKLY PERIODIZATION */
    let weeklyPlan;
    
    if (readiness < 50) {
      weeklyPlan = {
        volume: '🔽 Reduce by 30%',
        intensity: '🧘 Light (60-70%)',
        frequency: '📉 2-3 sessions',
        focus: '🛁 Recovery & mobility'
      };
    } else if (readiness < 70) {
      weeklyPlan = {
        volume: '➡️ Maintain current',
        intensity: '⚖️ Moderate (70-80%)',
        frequency: '📊 3-4 sessions',
        focus: '🎯 Technique refinement'
      };
    } else {
      weeklyPlan = {
        volume: '➕ Increase by 10%',
        intensity: '💪 Normal-High (80-90%)',
        frequency: '🔥 4-5 sessions',
        focus: '📈 Progressive overload'
      };
    }

    /* 🎯 GOAL-SPECIFIC RECOMMENDATIONS */
    const goalRecommendations = [];
    
    if (currentGoal === 'strength') {
      goalRecommendations.push('🏋️ Focus on 3-6 reps with heavy weight');
      goalRecommendations.push('⏱️ Rest 3-5 minutes between sets');
      goalRecommendations.push('📊 Track 1RM improvements');
    } else if (currentGoal === 'muscle') {
      goalRecommendations.push('💪 Target 8-12 reps for hypertrophy');
      goalRecommendations.push('⏱️ Rest 60-90 seconds between sets');
      goalRecommendations.push('🔄 Focus on time under tension');
    } else if (currentGoal === 'endurance') {
      goalRecommendations.push('🏃 Aim for 15+ reps or time-based sets');
      goalRecommendations.push('⏱️ Shorter rest periods (30-60s)');
      goalRecommendations.push('🔄 Include circuit training');
    } else if (currentGoal === 'weight_loss') {
      goalRecommendations.push('🔥 Combine strength and cardio');
      goalRecommendations.push('⏱️ Shorter rest, higher intensity');
      goalRecommendations.push('📊 Track calorie burn and deficit');
    }

    /* 🔥 ENHANCED MOTIVATION */
    let motivation = '';
    if (progressiveOverload && progressiveOverload.length > 0) {
      motivation = `🚀 Amazing progress! You've improved in ${progressiveOverload.length} exercises!`;
    } else if (sessions >= 4) {
      motivation = '🔥 Excellent consistency! Your dedication is paying off!';
    } else if (sessions >= 2) {
      motivation = '💪 Good momentum! Keep building those habits!';
    } else {
      motivation = '🌟 Every journey starts with a single step. You\'ve got this!';
    }

    setAnalysis({
      timestamp,
      sessions,
      fatigue,
      totalVolume,
      readiness,
      trainingDay,
      trainingIntensity,
      weeklyCalories,
      monthlyCalories,
      muscleGrowth,
      growthFactors,
      muscleBalance,
      progressiveOverload,
      status,
      statusColor,
      reason,
      advice,
      recoveryAdvice,
      trainingAdvice,
      exerciseSuggestions,
      weeklyPlan,
      goalRecommendations,
      motivation
    });
  };

  const showSuccessMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000); // Hide message after 3 seconds
  };

  const getRandomSuccessMessage = () => {
    const messages = [
      '✅ Analysis updated successfully! Your recommendations have been refreshed.',
      '🚀 Smart Coach analysis complete! Check out your personalized recommendations.',
      '💪 Your training data has been analyzed! New insights are ready.',
      '🧠 AI analysis finished! Your personalized coaching plan is updated.',
      '⚡ Analysis refreshed! Your smart recommendations are now current.',
      '🎯 Training analysis complete! Your goals-based plan is ready.'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const reAnalyze = () => {
    setIsAnalyzing(true);
    
    // Add a small delay to show the loading state
    setTimeout(() => {
      runAnalysis(logs, plans, protein, sleep, stress, hydration, soreness);
      setIsAnalyzing(false);
      showSuccessMessage(getRandomSuccessMessage());
    }, 500);
  };

  /* ================= UI ================= */
  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.pexels.com/photos/1865131/pexels-photo-1865131.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}
      className="py-5"
    >
      {/* Back Button */}
      <button 
        className="btn btn-outline-light position-fixed"
        style={{ 
          top: '20px', 
          left: '20px', 
          zIndex: 1000,
          borderRadius: '50px',
          padding: '10px 20px'
        }}
        onClick={() => navigate('/dashboard')}
      >
        <i className="fas fa-arrow-left me-2"></i>
        Back
      </button>

      <div className="container">
        <h1 className="fw-bold text-center text-white mb-3">
          🧠 Smart Coach AI
        </h1>

        <p className="text-center text-info fw-semibold fs-5 mb-4">
          Advanced AI-powered training analysis & personalized coaching 🚀
        </p>

        {/* Success Message */}
        {showMessage && (
          <div className="alert alert-success alert-dismissible fade show mx-auto" 
               style={{ maxWidth: '600px' }} 
               role="alert">
            <strong>{message}</strong>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setShowMessage(false)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <ul className="nav nav-pills justify-content-center">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                  onClick={() => setActiveTab('overview')}
                >
                  📊 Overview
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'recovery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('recovery')}
                >
                  🛁 Recovery
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'progress' ? 'active' : ''}`}
                  onClick={() => setActiveTab('progress')}
                >
                  📈 Progress
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'workouts' ? 'active' : ''}`}
                  onClick={() => setActiveTab('workouts')}
                >
                  🏋️ Workouts
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'nutrition' ? 'active' : ''}`}
                  onClick={() => setActiveTab('nutrition')}
                >
                  🍎 Nutrition
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'goals' ? 'active' : ''}`}
                  onClick={() => setActiveTab('goals')}
                >
                  🎯 Goals
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Recovery Inputs Tab */}
        {activeTab === 'recovery' && (
          <div className="card shadow mb-4 border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff'
            }}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-4">🛁 Recovery & Lifestyle Tracking</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">🍗 Protein Intake (g/kg body weight)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                    placeholder="e.g., 1.8"
                  />
                  <small className="text-muted">Recommended: 1.6-2.2 g/kg</small>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">😴 Sleep Duration (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    className="form-control"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                    placeholder="e.g., 7.5"
                  />
                  <small className="text-muted">Recommended: 7-9 hours</small>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">😰 Stress Level (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="form-range"
                    value={stress}
                    onChange={(e) => setStress(e.target.value)}
                  />
                  <div className="d-flex justify-content-between">
                    <small>Low (1)</small>
                    <small className="fw-bold">{stress || 'Not set'}</small>
                    <small>High (10)</small>
                  </div>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">💧 Daily Water Intake (liters)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control"
                    value={hydration}
                    onChange={(e) => setHydration(e.target.value)}
                    placeholder="e.g., 2.5"
                  />
                  <small className="text-muted">Recommended: 2.5-3.5 L</small>
                </div>

                <div className="col-md-12 mb-3">
                  <label className="form-label">🤕 Muscle Soreness (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    className="form-range"
                    value={soreness}
                    onChange={(e) => setSoreness(e.target.value)}
                  />
                  <div className="d-flex justify-content-between">
                    <small>None (1)</small>
                    <small className="fw-bold">{soreness || 'Not set'}</small>
                    <small>Severe (10)</small>
                  </div>
                </div>
              </div>

              <button 
                className="btn btn-success btn-lg" 
                onClick={reAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Analyzing...
                  </>
                ) : (
                  '🔄 Update Analysis'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Workouts Tab */}
        {activeTab === 'workouts' && analysis && (
          <div className="card shadow mb-4 border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff'
            }}
          >
            <div className="card-body">
              <WorkoutRecommendations 
                readiness={analysis.readiness}
                trainingIntensity={analysis.trainingIntensity}
                currentGoal={currentGoal}
              />
            </div>
          </div>
        )}

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="card shadow mb-4 border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff'
            }}
          >
            <div className="card-body">
              <NutritionRecommendations 
                currentGoal={currentGoal}
                currentWeight={currentWeight}
                targetWeight={targetWeight}
                trainingIntensity={analysis?.trainingIntensity || 'moderate'}
                sessions={analysis?.sessions || 0}
              />
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <div className="card shadow mb-4 border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#fff'
            }}
          >
            <div className="card-body">
              <h5 className="fw-bold mb-4">🎯 Goal Setting & Tracking</h5>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Primary Goal</label>
                  <select 
                    className="form-select"
                    value={currentGoal}
                    onChange={(e) => setCurrentGoal(e.target.value)}
                  >
                    <option value="strength">🏋️ Build Strength</option>
                    <option value="muscle">💪 Build Muscle</option>
                    <option value="endurance">🏃 Improve Endurance</option>
                    <option value="weight_loss">🔥 Lose Weight</option>
                  </select>
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Current Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    placeholder="70"
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <label className="form-label">Target Weight (kg)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={targetWeight}
                    onChange={(e) => setTargetWeight(e.target.value)}
                    placeholder="75"
                  />
                </div>
              </div>

              {analysis?.goalRecommendations && (
                <div className="mt-4">
                  <h6 className="fw-bold">🎯 Goal-Specific Recommendations:</h6>
                  <ul className="list-unstyled">
                    {analysis.goalRecommendations.map((rec, i) => (
                      <li key={i} className="mb-2">
                        <span className="badge bg-primary me-2">{i + 1}</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && analysis && !analysis.message && (
          <>
            {/* Status Card */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className={`card border-0 shadow text-white bg-${analysis.statusColor}`}>
                  <div className="card-body text-center">
                    <h3 className="fw-bold">{analysis.status}</h3>
                    <p className="mb-0">{analysis.reason}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 shadow"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(14px)',
                    color: '#fff'
                  }}
                >
                  <div className="card-body text-center">
                    <h3 className="fw-bold">🔋 {analysis.readiness}/100</h3>
                    <p className="mb-0">Readiness Score</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card border-0 shadow bg-info text-white">
                  <div className="card-body text-center">
                    <h4>{analysis.sessions}</h4>
                    <small>Sessions This Week</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow bg-warning text-dark">
                  <div className="card-body text-center">
                    <h4>{analysis.weeklyCalories}</h4>
                    <small>Weekly Calories</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow bg-success text-white">
                  <div className="card-body text-center">
                    <h4>{analysis.totalVolume.toLocaleString()}</h4>
                    <small>Total Volume</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow bg-primary text-white">
                  <div className="card-body text-center">
                    <h4>{analysis.muscleGrowth}</h4>
                    <small>Growth Potential</small>
                  </div>
                </div>
              </div>
            </div>

            {/* Training Recommendations */}
            <div className="card shadow mb-4 border-0"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(14px)',
                color: '#fff'
              }}
            >
              <div className="card-body">
                <h5 className="fw-bold mb-3">📅 Today's Training: {analysis.trainingDay}</h5>
                
                <div className="row">
                  <div className="col-md-6">
                    <h6 className="fw-bold">📊 This Week's Plan:</h6>
                    <ul className="list-unstyled">
                      <li><strong>Volume:</strong> {analysis.weeklyPlan.volume}</li>
                      <li><strong>Intensity:</strong> {analysis.weeklyPlan.intensity}</li>
                      <li><strong>Frequency:</strong> {analysis.weeklyPlan.frequency}</li>
                      <li><strong>Focus:</strong> {analysis.weeklyPlan.focus}</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-success">
                      <strong>💪 Motivation:</strong><br/>
                      {analysis.motivation}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exercise Suggestions */}
            {analysis.exerciseSuggestions.length > 0 && (
              <div className="card shadow mb-4 border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(14px)',
                  color: '#fff'
                }}
              >
                <div className="card-body">
                  <h5 className="fw-bold mb-3">🏋️ Exercise-Specific Recommendations</h5>
                  <div className="row">
                    {analysis.exerciseSuggestions.map((suggestion, i) => (
                      <div key={i} className="col-md-6 mb-2">
                        <div className="alert alert-info mb-2">
                          {suggestion}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recovery & Training Advice */}
            <div className="row mb-4">
              {analysis.recoveryAdvice.length > 0 && (
                <div className="col-md-6">
                  <div className="card shadow border-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(14px)',
                      color: '#fff'
                    }}
                  >
                    <div className="card-body">
                      <h6 className="fw-bold">🛁 Recovery Recommendations</h6>
                      <ul className="list-unstyled">
                        {analysis.recoveryAdvice.map((advice, i) => (
                          <li key={i} className="mb-2">
                            <span className="badge bg-info me-2">{i + 1}</span>
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              {analysis.trainingAdvice.length > 0 && (
                <div className="col-md-6">
                  <div className="card shadow border-0"
                    style={{
                      background: 'rgba(255, 255, 255, 0.12)',
                      backdropFilter: 'blur(14px)',
                      color: '#fff'
                    }}
                  >
                    <div className="card-body">
                      <h6 className="fw-bold">🏋️ Training Recommendations</h6>
                      <ul className="list-unstyled">
                        {analysis.trainingAdvice.map((advice, i) => (
                          <li key={i} className="mb-2">
                            <span className="badge bg-warning me-2">{i + 1}</span>
                            {advice}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && analysis && (
          <div className="row">
            {/* Muscle Group Balance */}
            {analysis.muscleBalance && Object.keys(analysis.muscleBalance).length > 0 && (
              <div className="col-md-6 mb-4">
                <div className="card shadow border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(14px)',
                    color: '#fff'
                  }}
                >
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">📊 Muscle Group Distribution</h6>
                    {Object.entries(analysis.muscleBalance).map(([group, data]) => (
                      <div key={group} className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span className="text-capitalize">{group}</span>
                          <span>{data.sets} sets ({data.percentage}%)</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div 
                            className="progress-bar bg-info" 
                            style={{ width: `${data.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Progressive Overload */}
            {analysis.progressiveOverload && analysis.progressiveOverload.length > 0 && (
              <div className="col-md-6 mb-4">
                <div className="card shadow border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(14px)',
                    color: '#fff'
                  }}
                >
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">📈 Progressive Overload Achievements</h6>
                    {analysis.progressiveOverload.map((progress, i) => (
                      <div key={i} className="alert alert-success mb-2">
                        <strong>{progress.exercise}</strong>
                        <br/>
                        <span className="badge bg-success">{progress.improvement}</span> improvement
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Growth Factors */}
            {analysis.growthFactors && (
              <div className="col-md-12">
                <div className="card shadow border-0"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(14px)',
                    color: '#fff'
                  }}
                >
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">💪 Growth Optimization Factors</h6>
                    <div className="row">
                      {['protein', 'sleep', 'recovery', 'frequency', 'stress'].map(factor => (
                        <div key={factor} className="col-md-2 text-center mb-3">
                          <div className={`badge ${analysis.growthFactors.includes(factor) ? 'bg-success' : 'bg-secondary'} p-3`}>
                            {factor === 'protein' && '🍗'}
                            {factor === 'sleep' && '😴'}
                            {factor === 'recovery' && '🛁'}
                            {factor === 'frequency' && '📊'}
                            {factor === 'stress' && '🧘'}
                            <br/>
                            <small className="text-capitalize">{factor}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-center mt-3">
                      <strong>{analysis.growthFactors.length}/5</strong> factors optimized for muscle growth
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Data Message */}
        {analysis && analysis.message && (
          <div className="card shadow mb-4 border-0"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(14px)',
              color: '#fff'
            }}
          >
            <div className="card-body text-center">
              <h4>{analysis.message}</h4>
              <p>Start logging your workouts to unlock personalized AI coaching!</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="text-center mt-4">
          <button 
            className="btn btn-success btn-lg me-3" 
            onClick={reAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Analyzing...
              </>
            ) : (
              '🔄 Refresh Analysis'
            )}
          </button>
          <small className="text-light">
            Last updated: {analysis?.timestamp || 'Never'}
          </small>
        </div>
      </div>
    </div>
  );
};

export default SmartCoach;