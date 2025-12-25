import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const workoutsData = [
  {
    title: 'Push Workout',
    level: 'Beginner',
    desc: 'Chest, Shoulders, Triceps',
    video: 'https://www.pexels.com/download/video/4367541/',
    poster: 'https://images.pexels.com/photos/416717/pexels-photo-416717.jpeg',
    exercises: [
      'Bench Press',
      'Incline Bench Press',
      'Decline Bench Press',
      'Push-Ups',
      'Overhead Shoulder Press',
      'Arnold Press',
      'Lateral Raises',
      'Front Raises',
      'Cable Fly',
      'Tricep Dips',
      'Skull Crushers',
      'Tricep Pushdowns',
      'Close-Grip Bench Press'
    ]
  },
  {
    title: 'Pull Workout',
    level: 'Intermediate',
    desc: 'Back & Biceps',
    video: 'https://www.pexels.com/download/video/6547818/',
    poster: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg',
    exercises: [
      'Pull-Ups',
      'Chin-Ups',
      'Lat Pulldown',
      'Wide-Grip Pulldown',
      'Barbell Row',
      'Dumbbell Row',
      'T-Bar Row',
      'Seated Cable Row',
      'Face Pulls',
      'Barbell Curl',
      'Dumbbell Curl',
      'Hammer Curl',
      'Preacher Curl',
      'Concentration Curl'
    ]
  },
  {
    title: 'Leg Workout',
    level: 'Beginner',
    desc: 'Quads, Hamstrings, Glutes',
    video: 'https://www.pexels.com/download/video/8809584/',
    poster: 'https://images.pexels.com/photos/2261485/pexels-photo-2261485.jpeg',
    exercises: [
      'Back Squat',
      'Front Squat',
      'Goblet Squat',
      'Walking Lunges',
      'Reverse Lunges',
      'Leg Press',
      'Romanian Deadlift',
      'Stiff-Leg Deadlift',
      'Hamstring Curl',
      'Hip Thrust',
      'Glute Bridge',
      'Standing Calf Raises',
      'Seated Calf Raises'
    ]
  },
  {
    title: 'Full Body',
    level: 'Advanced',
    desc: 'Total strength & conditioning',
    video: 'https://www.pexels.com/download/video/7780294/',
    poster: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg',
    exercises: [
      'Deadlift',
      'Back Squat',
      'Bench Press',
      'Overhead Press',
      'Pull-Ups',
      'Barbell Row',
      'Kettlebell Swings',
      'Clean and Press',
      'Farmer’s Walk',
      'Burpees',
      'Plank',
      'Mountain Climbers'
    ]
  },
  {
    title: 'Cardio',
    level: 'Beginner',
    desc: 'Fat loss & endurance',
    video: 'https://www.pexels.com/download/video/4753017/',
    poster: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg',
    exercises: [
      'Running',
      'Treadmill Jog',
      'Cycling',
      'Stationary Bike',
      'Jump Rope',
      'High Knees',
      'Burpees',
      'Jump Squats',
      'Mountain Climbers',
      'Rowing Machine',
      'Elliptical Trainer'
    ]
  },
  {
    title: 'Core Workout',
    level: 'Intermediate',
    desc: 'Abs & lower back',
    video: 'https://www.pexels.com/download/video/4671947/',
    poster: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg',
    exercises: [
      'Plank',
      'Side Plank',
      'Crunches',
      'Bicycle Crunch',
      'Leg Raises',
      'Hanging Knee Raises',
      'Russian Twists',
      'Cable Crunch',
      'Ab Rollouts',
      'Flutter Kicks',
      'Dead Bug',
      'Superman Hold'
    ]
  }
];

const Workouts = () => {
  const [level, setLevel] = useState('All');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  const filteredWorkouts =
    level === 'All'
      ? workoutsData
      : workoutsData.filter(w => w.level === level);

  const playVideo = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;

    video.currentTime = 0;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {});
    }
  };

  const resetVideo = (index) => {
    const video = videoRefs.current[index];
    if (!video) return;
    video.currentTime = 0;
  };

  return (
    <div className="min-vh-100 bg-dark text-white py-5">
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

        <h1 className="text-center fw-bold mb-3">🏋️ Know Your Workouts</h1>
        <p className="text-center text-muted mb-4">
          Hover to preview • Click to view exercises
        </p>

        {/* Filters */}
        <div className="d-flex justify-content-center gap-3 mb-5">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(l => (
            <button
              key={l}
              className={`btn ${level === l ? 'btn-info' : 'btn-outline-info'}`}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Workout Cards */}
        <div className="row">
          {filteredWorkouts.map((w, i) => (
            <div key={i} className="col-md-6 col-lg-4 mb-4">
              <div
                className="card h-100 shadow-lg border-0 overflow-hidden"
                role="button"
                onClick={() => setSelectedWorkout(w)}
              >
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <video
                    ref={el => (videoRefs.current[i] = el)}
                    muted
                    loop
                    playsInline
                    poster={w.poster}
                    onMouseEnter={() => playVideo(i)}
                    onMouseLeave={() => resetVideo(i)}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  >
                    <source src={w.video} type="video/mp4" />
                  </video>
                </div>

                <div className="card-body text-dark">
                  <span className="badge bg-secondary mb-2">{w.level}</span>
                  <h5 className="fw-bold">{w.title}</h5>
                  <p className="mb-0">{w.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedWorkout && (
          <div className="modal d-block bg-dark bg-opacity-75" style={{ inset: 0 }}>
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="fw-bold">{selectedWorkout.title}</h5>
                  <button
                    className="btn-close"
                    onClick={() => setSelectedWorkout(null)}
                  />
                </div>
                <div className="modal-body">
                  <p className="text-muted">
                    Level: <strong>{selectedWorkout.level}</strong>
                  </p>
                  <h6 className="fw-bold mb-3">Exercises Included:</h6>
                  <ul className="list-group">
                    {selectedWorkout.exercises.map((ex, idx) => (
                      <li key={idx} className="list-group-item">
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedWorkout(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Workouts;
