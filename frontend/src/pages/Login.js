import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 position-relative overflow-hidden">

      {/* 🎥 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ objectFit: 'cover' }}
      >
        <source
          src="https://www.pexels.com/download/video/8544782/"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* 🌑 Dark Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
        }}
      ></div>

      {/* 🔐 Login Content */}
      <div
        className="container h-100 d-flex align-items-center justify-content-center position-relative"
        style={{ zIndex: 2 }}
      >
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="card border-0 rounded-4 shadow-lg bg-white bg-opacity-95">
              <div className="card-body p-5">

                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">💪 Virtual Personal Trainer</h2>
                  <p className="text-muted">Log in to continue your fitness journey</p>
                </div>

                {error && (
                  <div className="alert alert-danger text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Don’t have an account?{' '}
                    <Link to="/register" className="fw-bold text-primary text-decoration-none">
                      Register
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
