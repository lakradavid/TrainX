import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLogs } from '../services/api';

const PersonalTrainer = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState('');
  const [equipment, setEquipment] = useState('');
  const [advice, setAdvice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getLogs();
        setLogs(res.data);
      } catch (err) {
        console.log('Could not load logs for analysis');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const generatePersonalizedAdvice = () => {
    if (!goal) {
      setAdvice('<p class="text-danger">Please select your fitness goal to get personalized advice!</p>');
      return;
    }

    let message = `<h4 class="text-primary">Your Personalized Training Plan 🔥</h4>`;
    message += `<p><strong>Goal:</strong> ${goal}</p>`;
    message += `<p><strong>Equipment Available:</strong> ${equipment || 'Not specified'}</p><hr/>`;

    // Goal-based advice
    switch (goal) {
      case 'Weight Loss':
        message += `<p>Focus on <strong>calorie deficit</strong> and <strong>high-intensity workouts</strong>.</p>`;
        message += `<p>Best workouts: HIIT, cardio circuits, full-body strength 3–5x/week.</p>`;
        message += `<p>💡 Tip: Combine strength training with 20–30 min cardio sessions.</p>`;
        message += `<p>🍎 Nutrition: Aim for high protein (1.6–2.2g/kg body weight), moderate carbs, healthy fats.</p>`;
        break;

      case 'Muscle Gain':
        message += `<p>Prioritize <strong>progressive overload</strong> and <strong>recovery</strong>.</p>`;
        message += `<p>Best approach: 4–6 gym sessions/week, focus on compound lifts (squat, deadlift, bench, pull-ups).</p>`;
        message += `<p>💪 Rep range: 6–12 reps with heavy weights.</p>`;
        message += `<p>🍎 Nutrition: Calorie surplus (+300–500 kcal), high protein (2g/kg+), carbs around workouts.</p>`;
        break;

      case 'Flexibility':
        message += `<p>Consistency is key — stretch daily or 5–6x/week.</p>`;
        message += `<p>Include yoga, dynamic stretching before workout, static stretching after.</p>`;
        message += `<p>Recommended: 15–30 min sessions focusing on tight areas (hips, hamstrings, shoulders).</p>`;
        message += `<p>🧘 Add breathing exercises for better mind-body connection.</p>`;
        break;

      case 'Endurance':
        message += `<p>Build aerobic base with longer, moderate sessions.</p>`;
        message += `<p>Activities: Running, cycling, swimming, rowing — 3–5 sessions/week.</p>`;
        message += `<p>Include intervals to boost VO2 max.</p>`;
        message += `<p>🥗 Nutrition: Higher carbs for energy, stay hydrated.</p>`;
        break;

      case 'Rehab / General Fitness':
        message += `<p>Focus on <strong>safe movement, consistency, and enjoyment</strong>.</p>`;
        message += `<p>Balanced full-body routines 3x/week, mobility work, light cardio.</p>`;
        message += `<p>Avoid pain — listen to your body.</p>`;
        message += `<p>Great for long-term health and injury prevention.</p>`;
        break;

      default:
        message += `<p>Select a goal to get tailored recommendations!</p>`;
    }

    // Equipment-based customization
    if (equipment) {
      message += `<hr/><h5>Workout Style Recommendation:</h5>`;
      switch (equipment) {
        case 'No equipment':
          message += `<p>Perfect for <strong>bodyweight training</strong>: push-ups, squats, lunges, planks, burpees.</p>`;
          message += `<p>Home-friendly circuits — no gym needed!</p>`;
          break;
        case 'Dumbbells':
          message += `<p>Add <strong>dumbbell variations</strong>: goblet squats, rows, presses, curls.</p>`;
          message += `<p>Great for progressive overload at home.</p>`;
          break;
        case 'Resistance bands':
          message += `<p>Use bands for <strong>assisted pull-ups, lateral walks, face pulls</strong>.</p>`;
          message += `<p>Excellent for joint-friendly resistance.</p>`;
          break;
        case 'Full gym':
          message += `<p>You have everything! Focus on <strong>barbell compounds + machines</strong>.</p>`;
          message += `<p>Optimal for muscle gain and strength.</p>`;
          break;
      }
    }

    // Add motivation
    const quotes = [
      "Small daily improvements lead to stunning results.",
      "The body achieves what the mind believes.",
      "Don't wish for it — work for it.",
      "Every workout is progress.",
      "Be stronger than your excuses."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    message += `<blockquote class="blockquote mt-4 border-start border-primary border-4 ps-3">
      <p class="mb-0">${randomQuote}</p>
    </blockquote>`;

    message += `<p class="mt-4 fw-bold">You've got this. Let's make it happen! 💪</p>`;

    setAdvice(message);
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
  <div
    className="min-vh-100 position-relative"
    style={{
      backgroundImage:
        'url(https://images.pexels.com/photos/2011383/pexels-photo-2011383.jpeg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}
  >
    {/* Dark overlay */}
    <div
      className="position-absolute top-0 start-0 w-100 h-100"
      style={{
        backgroundColor: 'rgba(0,0,0,0.7)',
      }}
    ></div>

    {/* Content */}
    <div className="container mt-5 pb-5 position-relative">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1
  className="fw-bold display-5 mb-0"
  style={{ color: 'powderblue' }}
>
  💪 Your Personal Trainer
</h1>
        <div>
          <button className="btn btn-secondary me-3" onClick={handleBack}>
            ← Back to Dashboard
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-9">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-5">
                <div className="display-1 mb-3">🏋️‍♂️</div>
                <h3 className="text-primary">Let's Build Your Perfect Plan</h3>
                <p className="lead">Tell me your goal and equipment — I'll create a custom strategy</p>
              </div>

              {/* Goal Selection */}
              <div className="mb-4">
                <label className="form-label fs-5 fw-bold">What's your primary fitness goal?</label>
                <select className="form-select form-select-lg" value={goal} onChange={(e) => setGoal(e.target.value)}>
                  <option value="">Choose your goal...</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Flexibility">Flexibility & Mobility</option>
                  <option value="Endurance">Endurance & Stamina</option>
                  <option value="Rehab / General Fitness">Rehab / General Fitness</option>
                </select>
              </div>

              {/* Equipment Selection */}
              <div className="mb-5">
                <label className="form-label fs-5 fw-bold">What equipment do you have?</label>
                <select className="form-select form-select-lg" value={equipment} onChange={(e) => setEquipment(e.target.value)}>
                  <option value="">Select equipment...</option>
                  <option value="No equipment">No equipment (bodyweight only)</option>
                  <option value="Dumbbells">Dumbbells</option>
                  <option value="Resistance bands">Resistance bands</option>
                  <option value="Full gym">Full gym access</option>
                </select>
              </div>

              <div className="text-center mb-5">
                <button className="btn btn-success btn-lg px-5" onClick={generatePersonalizedAdvice}>
                  Generate My Plan
                </button>
              </div>

              {advice && (
                <div className="mt-5 p-4 bg-light rounded shadow-sm">
                  <div className="fs-5" dangerouslySetInnerHTML={{ __html: advice }} />
                </div>
              )}

              {!advice && !loading && (
                <div className="text-center text-muted mt-5">
                  <p>Select your goal and equipment, then click "Generate My Plan" for personalized guidance!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
     </div>
  );
};

export default PersonalTrainer;