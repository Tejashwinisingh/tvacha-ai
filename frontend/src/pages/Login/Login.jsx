
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import '../css/Auth.css'

const API_URL = 'http://127.0.0.1:8000'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setError('')
    setSuccess('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed. Please try again.')
      }

      if (!data.access_token) {
        throw new Error('Login response did not contain an access token.')
      }

      localStorage.setItem('access_token', data.access_token)
      setSuccess('Login successful! Redirecting...')

      navigate('/dashboard')

    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Unable to connect to the server. Please check your backend.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  function handleGoogleSuccess() {
    setError('Google login is not connected to the backend yet.')
  }

  function handleGoogleError() {
    setError('Google Sign-In failed. Please try again.')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-logo">
          🌿 TvachaAI
        </div>

        <h1>Welcome Back!</h1>

        <p className="auth-description">
          Sign in to continue your skincare journey.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="forgot-password">
            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p className="form-success" role="status">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        <div className="google-divider">
          <span>OR</span>
        </div>

        <div className="google-login-container">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            shape="rectangular"
            text="continue_with"
            width="300"
          />
        </div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register">Create Account</Link>
        </p>

        <p className="auth-footer">
          Your skin. Your care. Your intelligence. 🌱
        </p>

      </div>
    </div>
  )
}

export default Login
