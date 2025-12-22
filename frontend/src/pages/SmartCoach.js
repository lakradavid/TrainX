import React, { useEffect, useState } from 'react';
import { getLogs, getPlans } from '../services/api';

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

const SmartCoach = () => {
  const [logs, setLogs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  // 🥗 Recovery inputs
  const [protein, setProtein] = useState('');
  const [sleep, setSleep] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [logsRes, plansRes] = await Promise.all([
        getLogs(),
        getPlans()
      ]);

      setLogs(logsRes.data);
      setPlans(plansRes.data);

      runAnalysis(logsRes.data, plansRes.data, protein, sleep);
    };

    loadData();
  }, []);

  /* ================= 🧠 CORE ANALYSIS ENGINE ================= */
  const runAnalysis = (logsData, plansData, proteinVal, sleepVal) => {
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

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    logsData.forEach(log => {
      const logDate = new Date(log.date);
      if (logDate >= sevenDaysAgo) sessions++;

      log.completedExercises.forEach(ex => {
        fatigue += Number(ex.setsCompleted || 1);
      });
    });

    /* 🔋 READINESS SCORE */
    let readiness = 100;
    if (sleepVal && sleepVal < 7) readiness -= 15;
    if (fatigue > 40) readiness -= 30;
    else if (fatigue > 25) readiness -= 15;
    readiness = Math.max(0, Math.min(100, readiness));

    /* 📅 TRAINING DAY TYPE */
    let trainingDay =
      readiness < 40
        ? '🛑 Recovery'
        : readiness < 60
        ? '🧘 Light'
        : readiness < 80
        ? '🏋️ Normal'
        : '🔥 Heavy';

    /* 🔥 CALORIES BURNED ESTIMATE */
    let caloriesPerSession = 300;
    if (trainingDay.includes('Recovery')) caloriesPerSession = 150;
    else if (trainingDay.includes('Light')) caloriesPerSession = 250;
    else if (trainingDay.includes('Heavy')) caloriesPerSession = 500;

    const weeklyCalories = caloriesPerSession * sessions;

    /* 💪 MUSCLE GROWTH POTENTIAL */
    let muscleGrowth = '🔻 Low';

    if (
      readiness > 70 &&
      fatigue < 35 &&
      proteinVal &&
      proteinVal >= 1.6 &&
      sleepVal &&
      sleepVal >= 7
    ) {
      muscleGrowth = '🔥 High';
    } else if (
      readiness > 50 &&
      proteinVal &&
      proteinVal >= 1.4
    ) {
      muscleGrowth = '🔶 Moderate';
    }

    /* ⚠️ STATUS */
    let status = '✅ Balanced';
    let reason = 'Training load is appropriate';

    if (fatigue > 40) {
      status = '⚠️ High Fatigue';
      reason = 'High volume accumulated recently';
    } else if (fatigue < 15) {
      status = '📉 Low Load';
      reason = 'Training volume is low';
    }

    /* 🧠 GENERAL ADVICE */
    const advice = [];

    if (fatigue > 40) advice.push('🛑 Reduce volume & prioritize recovery');
    if (fatigue < 15) advice.push('📈 Increase training stimulus gradually');

    if (proteinVal && proteinVal < 1.6)
      advice.push('🍗 Increase protein to 1.6–2.2 g/kg');

    if (sleepVal && sleepVal < 7)
      advice.push('😴 Aim for 7–8 hours of sleep');

    if (advice.length === 0)
      advice.push('👌 Training & recovery look well balanced');

    /* 🏋️ EXERCISE-LEVEL SUGGESTIONS */
    const exerciseSuggestions = [];

    logsData[0]?.completedExercises.forEach(ex => {
      const name = ex.name;
      const isBodyweight = isBodyweightExercise(name);

      if (isBodyweight) {
        if (fatigue < 25) {
          exerciseSuggestions.push(`🔼 Increase reps or tempo for ${name}`);
        } else if (fatigue < 40) {
          exerciseSuggestions.push(`➡️ Maintain reps for ${name}`);
        } else {
          exerciseSuggestions.push(`🔽 Reduce reps or add rest for ${name}`);
        }
      } else {
        if (fatigue < 25) {
          exerciseSuggestions.push(`➕ Increase ${name} weight by 2–5%`);
        } else if (fatigue < 40) {
          exerciseSuggestions.push(`➡️ Maintain load for ${name}`);
        } else {
          exerciseSuggestions.push(`🔽 Reduce load or sets for ${name}`);
        }
      }
    });

    /* 📆 WEEKLY PLAN */
    let weeklyPlan;

    if (fatigue < 20) {
      weeklyPlan = {
        sets: '➕ +1–2 sets',
        reps: '💪 6–10 reps',
        rest: '⏱️ Shorter rest'
      };
    } else if (fatigue < 35) {
      weeklyPlan = {
        sets: '➡️ Maintain sets',
        reps: '⚖️ 8–12 reps',
        rest: '⏱️ Standard rest'
      };
    } else {
      weeklyPlan = {
        sets: '🔽 -1 set',
        reps: '🧠 10–15 reps',
        rest: '⏳ Longer rest'
      };
    }

    /* 🔥 MOTIVATION */
    let motivation =
      sessions >= 4
        ? '🔥 Excellent consistency!'
        : sessions <= 1
        ? '🚀 Let’s increase frequency next week'
        : '💪 Keep the momentum going';

    setAnalysis({
      timestamp,
      sessions,
      fatigue,
      readiness,
      trainingDay,
      weeklyCalories,
      muscleGrowth,
      status,
      reason,
      advice,
      exerciseSuggestions,
      weeklyPlan,
      motivation
    });
  };

  const reAnalyze = () => {
    runAnalysis(logs, plans, protein, sleep);
  };

  /* ================= UI ================= */
  return (
    <div
  style={{
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.pexels.com/photos/1865131/pexels-photo-1865131.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
  className="py-5 mb-5"
>
  <div className="container">
    <h1 className="fw-bold text-center text-white mb-3">
      🧠 Smart Coach
    </h1>

    <p className="text-center text-info fw-semibold fs-5">
      Adaptive coaching with calorie & muscle insights and more💥
    </p>

        {/* INPUTS */}
        <div
  className="card shadow mb-4 border-0"
  style={{
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#fff'
  }}
>
          <div className="card-body">
            <h5 className="fw-bold mb-3">🥗 Recovery Inputs</h5>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label>🍗 Protein (g/kg)</label>
                <input
                  type="number"
                  className="form-control"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label>😴 Sleep (hours)</label>
                <input
                  type="number"
                  className="form-control"
                  value={sleep}
                  onChange={(e) => setSleep(e.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-success" onClick={reAnalyze}>
              🔄 Re-Analyze My Training
            </button>
          </div>
        </div>

        {analysis && !analysis.message && (
          <>
            <div
  className="card shadow mb-4 border-0"
  style={{
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#fff'
  }}
>
              <div className="card-body">
                <p>🔋 <strong>Readiness:</strong> {analysis.readiness} / 100</p>
                <p>📅 <strong>Training Day:</strong> {analysis.trainingDay}</p>
                <p>🔥 <strong>Weekly Calories Burned:</strong> ~{analysis.weeklyCalories} kcal</p>
                <p>💪 <strong>Muscle Growth Potential:</strong> {analysis.muscleGrowth}</p>

                <div className="alert alert-success mt-3">
                  {analysis.motivation}
                </div>
              </div>
            </div>

            <div
  className="card shadow mb-4 border-0"
  style={{
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#fff'
  }}
>
              <div className="card-body">
                <h5 className="fw-bold">🏋️ Exercise-Level Suggestions</h5>
                <ul className="list-group">
                  {analysis.exerciseSuggestions.map((e, i) => (
                    <li key={i} className="list-group-item">{e}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div
  className="card shadow mb-4 border-0"
  style={{
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    color: '#fff'
  }}
>
              <div className="card-body">
                <h5 className="fw-bold">📆 Next Week’s Plan</h5>
                <ul className="list-group">
                  <li className="list-group-item">Sets: {analysis.weeklyPlan.sets}</li>
                  <li className="list-group-item">Reps: {analysis.weeklyPlan.reps}</li>
                  <li className="list-group-item">Rest: {analysis.weeklyPlan.rest}</li>
                </ul>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SmartCoach;
