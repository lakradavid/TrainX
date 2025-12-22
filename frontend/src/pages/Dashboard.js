import LineChart from '../components/LineChart';
import React, { useState, useEffect } from 'react';
import { getPlans, createPlan, createLog, getLogs } from '../services/api';

const commonExercises = [
  'Bench Press', 'Incline Bench Press', 'Decline Bench Press',
  'Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Fly',
  'Squat', 'Leg Press', 'Lunges', 'Deadlift', 'Romanian Deadlift',
  'Pull-Ups', 'Lat Pulldown', 'Barbell Row', 'Dumbbell Row',
  'Bicep Curl', 'Hammer Curl', 'Tricep Extension', 'Dips',
  'Push-Ups', 'Plank', 'Crunches', 'Leg Raises', 'Calf Raises'
];

const Dashboard = () => {
  const [plans, setPlans] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    exercises: [{ name: '', sets: '', reps: '', restTime: '60s' }]
  });
  const [logData, setLogData] = useState({
    planId: '',
    completedExercises: [],
    overallNotes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansRes, logsRes] = await Promise.all([getPlans(), getLogs()]);
        setPlans(plansRes.data);
        setLogs(logsRes.data);
      } catch (err) {
        alert('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openLogForm = (plan) => {
    setSelectedPlan(plan);
    setLogData({
      planId: plan._id,
      completedExercises: plan.exercises.map(ex => ({
        name: ex.name,
        setsCompleted: '',
        repsCompleted: '',
        weightUsed: '',
        notes: ''
      })),
      overallNotes: ''
    });
    setShowLogForm(true);
  };

  const handleLogChange = (index, field, value) => {
    const updated = logData.completedExercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    setLogData({ ...logData, completedExercises: updated });
  };

  const handleSubmitLog = async (e) => {
    e.preventDefault();
    try {
      const res = await createLog(logData);
      setLogs([res.data, ...logs]);
      setShowLogForm(false);
      alert('Progress logged successfully!');
    } catch (err) {
      alert('Failed to log progress');
    }
  };

  const handleAddExercise = () => {
    setNewPlan({
      ...newPlan,
      exercises: [...newPlan.exercises, { name: '', sets: '', reps: '', restTime: '60s' }]
    });
  };

  const handleExerciseChange = (index, field, value) => {
    const updated = newPlan.exercises.map((ex, i) =>
      i === index ? { ...ex, [field]: value } : ex
    );
    setNewPlan({ ...newPlan, exercises: updated });
  };

  const handleRemoveExercise = (index) => {
    setNewPlan({
      ...newPlan,
      exercises: newPlan.exercises.filter((_, i) => i !== index)
    });
  };

  const handleSubmitPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.name.trim()) return alert('Plan name required');
    try {
      const res = await createPlan(newPlan);
      setPlans([res.data, ...plans]);
      setNewPlan({ name: '', description: '', exercises: [{ name: '', sets: '', reps: '', restTime: '60s' }] });
      setShowCreateForm(false);
      alert('Plan created!');
    } catch (err) {
      alert('Failed');
    }
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm('Delete this plan?')) {
      setPlans(plans.filter(p => p._id !== planId));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
   <div
  className="min-vh-100"
  style={{ backgroundColor: '#0d0d0d', color: '#ffffff' }}
>
  <div className="container mt-4 pb-5">

    <div className="d-flex justify-content-between align-items-center mb-4">
      <h1 className="text-white fw-bold display-5">TrainX</h1>

      <div className="d-flex gap-3">
  <button
    className="btn btn-outline-info"
    onClick={() => window.open('/workouts', '_blank')}
  >
    🏋️ Know Your Workouts
  </button>

  <button
    className="btn btn-outline-success"
    onClick={() => window.open('/smart-coach', '_blank')}
  >
    🧠 Smart Coach
  </button>

  <button className="btn btn-outline-light" onClick={handleLogout}>
    Logout
  </button>
</div>

    </div>


        {/* Hero Cards with Background Videos */}
        <div className="row mb-5">
          {/* Create New Plan Card */}
          <div className="col-md-6 mb-4">
            <div 
              className="card border-0 shadow-lg rounded-4 text-white h-100 position-relative overflow-hidden"
              style={{ minHeight: '350px' }}
              role="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ objectFit: 'cover', zIndex: 0 }}
              >
                <source
                  src="https://www.pexels.com/download/video/3205676/"
                  type="video/mp4"
                />
              </video>

              <div 
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1 }}
              ></div>

              <div className="card-body position-relative d-flex flex-column justify-content-end p-5" style={{ zIndex: 2 }}>
                <h3 className="fw-bold display-6 mb-3">Create New Plan</h3>
                <p className="lead mb-4">Design your custom workout routine with exercises, sets, and reps</p>
                <button className="btn btn-primary btn-lg w-50 align-self-start">
                  {showCreateForm ? 'Close Form' : 'Get Started →'}
                </button>
              </div>
            </div>
          </div>

          {/* Personal Trainer Card */}
          <div className="col-md-6 mb-4">
            <div 
              className="card border-0 shadow-lg rounded-4 text-white h-100 position-relative overflow-hidden"
              style={{ minHeight: '350px' }}
            >
              <video
                autoPlay
                muted
                loop
                playsInline
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ objectFit: 'cover', zIndex: 0 }}
              >
                <source
                  src="https://www.pexels.com/download/video/6296159/"
                  type="video/mp4"
                />
              </video>

              <div 
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1 }}
              ></div>

              <a 
                href="/trainer" 
                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-5 text-decoration-none text-white"
                style={{ zIndex: 2 }}
              >
                <h3 className="fw-bold display-6 mb-3">💪 Personal Trainer</h3>
                <p className="lead mb-4">Get personalized advice based on your goals and progress</p>
                <button className="btn btn-info btn-lg w-50 align-self-start text-white">
                  Talk to Coach →
                </button>
              </a>
            </div>
          </div>
        </div>

        {showCreateForm && (
          <div className="card mb-5 p-4 shadow bg-white bg-opacity-95">
            <h3>Create New Workout Plan</h3>
            <form onSubmit={handleSubmitPlan}>
              <div className="mb-3">
                <label className="form-label">Plan Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Push Day, Full Body A"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Description (optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., Chest, Shoulders, Triceps"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                />
              </div>

              <h5 className="mb-3">Exercises</h5>
              {newPlan.exercises.map((ex, index) => (
                <div key={index} className="row mb-3 align-items-center">
                  <div className="col-md-5">
                    <select
                      className="form-select"
                      value={ex.name}
                      onChange={(e) => handleExerciseChange(index, 'name', e.target.value)}
                      required
                    >
                      <option value="">Select an exercise</option>
                      {commonExercises.map((exercise) => (
                        <option key={exercise} value={exercise}>
                          {exercise}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      className="form-control"
                      value={ex.sets}
                      onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      placeholder="Reps (e.g. 8-12)"
                      className="form-control"
                      value={ex.reps}
                      onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-2">
                    <input
                      type="text"
                      placeholder="Rest (e.g. 90s)"
                      className="form-control"
                      value={ex.restTime}
                      onChange={(e) => handleExerciseChange(index, 'restTime', e.target.value)}
                    />
                  </div>
                  <div className="col-md-1">
                    {newPlan.exercises.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveExercise(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-secondary mb-3 me-3"
                onClick={handleAddExercise}
              >
                + Add Exercise
              </button>

              <button type="submit" className="btn btn-success">
                Save Plan
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-3"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        <h2 className="mb-4 text-white">Your Workout Plans</h2>
        {loading ? <p className="text-white">Loading...</p> : plans.length === 0 ? (
          <div className="alert alert-info bg-white bg-opacity-90">No plans yet — create one!</div>
        ) : (
          <div className="row">
            {plans.map((plan) => (
              <div key={plan._id} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow h-100 bg-white bg-opacity-95">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h4>{plan.name}</h4>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeletePlan(plan._id)}>🗑️</button>
                    </div>
                    {plan.description && <p className="text-muted">{plan.description}</p>}
                    <ul className="list-group list-group-flush mt-3">
                      {plan.exercises.map((ex, i) => (
                        <li key={i} className="list-group-item py-2">
                          <strong>{ex.name}</strong> — {ex.sets} × {ex.reps}
                        </li>
                      ))}
                    </ul>
                    <button 
                      className="btn btn-success w-100 mt-3"
                      onClick={() => openLogForm(plan)}
                    >
                      Log Progress
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Log Progress Modal */}
        {showLogForm && selectedPlan && (
          <div className="modal d-block bg-dark bg-opacity-50" style={{ position: 'fixed', inset: 0, zIndex: 1050 }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5>Log Progress: {selectedPlan.name}</h5>
                  <button className="btn-close" onClick={() => setShowLogForm(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmitLog}>
                    <p className="text-muted">Date: {new Date().toLocaleDateString()}</p>
                    {logData.completedExercises.map((ex, index) => (
                      <div key={index} className="row mb-3 align-items-center">
                        <div className="col-4"><strong>{ex.name}</strong></div>
                        <div className="col-2">
                          <input type="number" placeholder="Sets done" className="form-control"
                            value={ex.setsCompleted} onChange={(e) => handleLogChange(index, 'setsCompleted', e.target.value)} />
                        </div>
                        <div className="col-2">
                          <input type="text" placeholder="Reps" className="form-control"
                            value={ex.repsCompleted} onChange={(e) => handleLogChange(index, 'repsCompleted', e.target.value)} />
                        </div>
                        <div className="col-2">
                          <input type="number" placeholder="Weight (kg)" className="form-control"
                            value={ex.weightUsed} onChange={(e) => handleLogChange(index, 'weightUsed', e.target.value)} />
                        </div>
                        <div className="col-2">
                          <input type="text" placeholder="Notes" className="form-control"
                            value={ex.notes} onChange={(e) => handleLogChange(index, 'notes', e.target.value)} />
                        </div>
                      </div>
                    ))}
                    <div className="mb-3">
                      <label>Overall Notes</label>
                      <textarea className="form-control" rows="3"
                        value={logData.overallNotes}
                        onChange={(e) => setLogData({ ...logData, overallNotes: e.target.value })}></textarea>
                    </div>
                    <div className="text-end">
                      <button type="button" className="btn btn-secondary me-2" onClick={() => setShowLogForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-success">Save Log</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Charts */}
        {logs.length > 0 && (
          <div className="mt-5">
            <h2 className="text-white">Your Progress Charts</h2>
            <p className="text-white mb-4">
              Tracking your strength gains for exercises you've logged (minimum 2 sessions required).
            </p>

            {(() => {
              const exerciseMap = {};

              logs.forEach(log => {
                log.completedExercises.forEach(ex => {
                  if (ex.weightUsed > 0) {
                    if (!exerciseMap[ex.name]) exerciseMap[ex.name] = [];
                    exerciseMap[ex.name].push({
                      date: new Date(log.date).toLocaleDateString('en-GB'),
                      weight: ex.weightUsed,
                      sets: ex.setsCompleted || 1,
                      reps: parseInt(ex.repsCompleted) || 1,
                    });
                  }
                });
              });

              Object.keys(exerciseMap).forEach(ex => {
                exerciseMap[ex].sort((a, b) => new Date(a.date.split('/').reverse().join('-')) - new Date(b.date.split('/').reverse().join('-')));
              });

              const trackedExercises = Object.keys(exerciseMap).filter(ex => exerciseMap[ex].length >= 2);

              if (trackedExercises.length === 0) {
                return (
                  <div className="alert alert-info bg-white bg-opacity-90">
                    <strong>No charts yet!</strong> Log the same exercise with weight at least twice to see your progress graph.
                  </div>
                );
              }

              return (
                <div className="row">
                  {trackedExercises.map(exercise => {
                    const dataPoints = exerciseMap[exercise];
                    const labels = dataPoints.map(p => p.date);
                    const weights = dataPoints.map(p => p.weight);
                    const volumes = dataPoints.map(p => p.sets * p.reps * p.weight);

                    return (
                      <div key={exercise} className="col-lg-6 mb-4">
                        <div className="card shadow h-100 bg-white bg-opacity-95">
                          <div className="card-body">
                            <h5 className="card-title text-primary">{exercise}</h5>
                            <LineChart 
                              labels={labels}
                              weightData={weights}
                              volumeData={volumes}
                            />
                            <small className="text-muted d-block mt-3 text-center">
                              {dataPoints.length} sessions logged
                            </small>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;