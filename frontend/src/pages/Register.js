import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await register(formData);
      localStorage.setItem('token', res.data.token);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
          src="https://www.pexels.com/download/video/4761738/"
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

      {/* 📝 Register Content */}
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
                  <p className="text-muted">Create your account and start training</p>
                </div>

                {error && (
                  <div className="alert alert-danger text-center">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success text-center">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username</label>
                    <input
                      type="text"
                      name="username"
                      className="form-control form-control-lg"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength="6"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="fw-bold text-primary text-decoration-none">
                      Login here
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

export default Register;