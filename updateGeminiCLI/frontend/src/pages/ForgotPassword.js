import React, { useState } from 'react';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/forgot-password', { email });
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred. Is the backend server running?');
      setMessage('');
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Forgot Password</h2>
              {message && <div className="alert alert-success mt-3">{message}</div>}
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              <p className="text-center mt-3">Enter your email address and we will send you a link to reset your password.</p>
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Send Reset Link</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
