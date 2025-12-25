import React, { useState, useEffect } from 'react';
import { getProfile, addMeasurement, addPersonalRecord, getAnalytics } from '../services/api';

const ProgressTracker = () => {
  const [profile, setProfile] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('measurements');
  
  // Measurement form
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [muscleMass, setMuscleMass] = useState('');
  const [measurementNotes, setMeasurementNotes] = useState('');
  
  // Personal record form
  const [exercise, setExercise] = useState('');
  const [recordWeight, setRecordWeight] = useState('');
  const [reps, setReps] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, analyticsRes] = await Promise.all([
        getProfile(),
        getAnalytics()
      ]);
      setProfile(profileRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleAddMeasurement = async (e) => {
    e.preventDefault();
    try {
      await addMeasurement({
        weight: weight ? parseFloat(weight) : undefined,
        bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
        muscleMass: muscleMass ? parseFloat(muscleMass) : undefined,
        notes: measurementNotes
      });
      
      // Reset form
      setWeight('');
      setBodyFat('');
      setMuscleMass('');
      setMeasurementNotes('');
      
      // Reload data
      loadData();
      
      alert('Measurement added successfully!');
    } catch (error) {
      console.error('Error adding measurement:', error);
      alert('Error adding measurement');
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await addPersonalRecord({
        exercise,
        weight: parseFloat(recordWeight),
        reps: parseInt(reps)
      });
      
      // Reset form
      setExercise('');
      setRecordWeight('');
      setReps('');
      
      // Reload data
      loadData();
      
      alert('Personal record added successfully!');
    } catch (error) {
      console.error('Error adding record:', error);
      alert('Error adding record');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📊 Progress Tracker</h2>
      
      {/* Navigation Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'measurements' ? 'active' : ''}`}
            onClick={() => setActiveTab('measurements')}
          >
            📏 Body Measurements
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            🏆 Personal Records
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📈 Analytics
          </button>
        </li>
      </ul>

      {/* Measurements Tab */}
      {activeTab === 'measurements' && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>📏 Add New Measurement</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddMeasurement}>
                  <div className="mb-3">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70.5"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Body Fat (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      placeholder="15.2"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Muscle Mass (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control"
                      value={muscleMass}
                      onChange={(e) => setMuscleMass(e.target.value)}
                      placeholder="35.8"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={measurementNotes}
                      onChange={(e) => setMeasurementNotes(e.target.value)}
                      placeholder="How are you feeling? Any observations?"
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-primary">
                    📊 Add Measurement
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>📈 Recent Measurements</h5>
              </div>
              <div className="card-body">
                {profile?.measurements?.length > 0 ? (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {profile.measurements
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 10)
                      .map((measurement, index) => (
                        <div key={index} className="border-bottom pb-2 mb-2">
                          <small className="text-muted">
                            {new Date(measurement.date).toLocaleDateString()}
                          </small>
                          <div>
                            {measurement.weight && <span className="badge bg-info me-1">Weight: {measurement.weight}kg</span>}
                            {measurement.bodyFat && <span className="badge bg-warning me-1">BF: {measurement.bodyFat}%</span>}
                            {measurement.muscleMass && <span className="badge bg-success me-1">Muscle: {measurement.muscleMass}kg</span>}
                          </div>
                          {measurement.notes && (
                            <small className="text-muted d-block mt-1">{measurement.notes}</small>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-muted">No measurements recorded yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Records Tab */}
      {activeTab === 'records' && (
        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>🏆 Add Personal Record</h5>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddRecord}>
                  <div className="mb-3">
                    <label className="form-label">Exercise</label>
                    <input
                      type="text"
                      className="form-control"
                      value={exercise}
                      onChange={(e) => setExercise(e.target.value)}
                      placeholder="Bench Press"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      className="form-control"
                      value={recordWeight}
                      onChange={(e) => setRecordWeight(e.target.value)}
                      placeholder="100"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Reps</label>
                    <input
                      type="number"
                      className="form-control"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      placeholder="5"
                      required
                    />
                  </div>
                  
                  <button type="submit" className="btn btn-success">
                    🏆 Add Record
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h5>🏆 Personal Records</h5>
              </div>
              <div className="card-body">
                {analytics?.personalRecords?.length > 0 ? (
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {analytics.personalRecords.map((record, index) => (
                      <div key={index} className="border-bottom pb-2 mb-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <strong>{record.exercise}</strong>
                          <small className="text-muted">
                            {new Date(record.date).toLocaleDateString()}
                          </small>
                        </div>
                        <div>
                          <span className="badge bg-primary me-2">{record.weight}kg</span>
                          <span className="badge bg-secondary">{record.reps} reps</span>
                          <span className="badge bg-info ms-2">
                            {(record.weight * record.reps).toFixed(1)} volume
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No personal records yet. Start lifting!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="row">
          <div className="col-md-12">
            <div className="row mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center">
                    <h4>{analytics?.recordsCount || 0}</h4>
                    <small>Personal Records</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body text-center">
                    <h4>{analytics?.measurementsCount || 0}</h4>
                    <small>Measurements</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-info text-white">
                  <div className="card-body text-center">
                    <h4>{analytics?.latestWeight || 'N/A'}</h4>
                    <small>Latest Weight (kg)</small>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center">
                    <h4>
                      {analytics?.weightProgress?.length >= 2 
                        ? `${(analytics.weightProgress[analytics.weightProgress.length - 1].weight - analytics.weightProgress[0].weight).toFixed(1)}kg`
                        : 'N/A'
                      }
                    </h4>
                    <small>Weight Change</small>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Weight Progress Chart */}
            {analytics?.weightProgress?.length > 1 && (
              <div className="card">
                <div className="card-header">
                  <h5>📈 Weight Progress Over Time</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weight (kg)</th>
                          <th>Change</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.weightProgress.map((point, index) => {
                          const prevWeight = index > 0 ? analytics.weightProgress[index - 1].weight : null;
                          const change = prevWeight ? (point.weight - prevWeight).toFixed(1) : null;
                          
                          return (
                            <tr key={index}>
                              <td>{new Date(point.date).toLocaleDateString()}</td>
                              <td>{point.weight}</td>
                              <td>
                                {change && (
                                  <span className={`badge ${change > 0 ? 'bg-success' : 'bg-danger'}`}>
                                    {change > 0 ? '+' : ''}{change}kg
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;