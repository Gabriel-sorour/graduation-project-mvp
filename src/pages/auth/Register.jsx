import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; //Use the same Login style

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registering with:", formData);
    // will connect an endpoint here 

    // navigate to dashboard for now
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join SageKitchen and start cooking!</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Ahmed Ali"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email Field */}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="password_confirmation"
              className="form-input"
              placeholder="Repeat your password"
              value={formData.password_confirmation}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth">Sign Up</button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login" className="auth-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;