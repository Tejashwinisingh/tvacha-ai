
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import '../css/Auth.css'

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const password = formData.password

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  }

  const strength = Object.values(requirements).filter(Boolean).length

  const strengthLabel =
    strength <= 2 ? 'Weak' :
    strength <= 4 ? 'Medium' : 'Strong'

  function handleChange(event) {
    const { name, value } = event.target

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    setError('')
    setSuccess('')
  }

  function generatePassword() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'

    const randomValues = new Uint32Array(16)

    window.crypto.getRandomValues(randomValues)

    const generatedPassword = Array.from(randomValues)
      .map(value => chars[value % chars.length])
      .join('')

    setFormData(prev => ({
      ...prev,
      password: generatedPassword,
      confirmPassword: generatedPassword
    }))

    setShowPassword(true)
    setShowConfirmPassword(true)

    setError('')
    setSuccess('Strong password generated successfully!')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (formData.fullName.trim().length < 2) {
      setError('Please enter your full name.')
      return
    }

    if (strength !== 5) {
      setError('Please create a strong password.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSuccess('Registration form validated successfully!')

    console.log('Registration details:', {
      fullName: formData.fullName,
      email: formData.email
    })
  }

  function handleGoogleSuccess(credentialResponse) {
    setError('')
    setSuccess('Google authentication successful! Backend verification is coming next.')

    console.log(
      'Google credential received:',
      Boolean(credentialResponse.credential)
    )
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

        <h1>Create Account</h1>

        <p className="auth-description">
          Start your personalized skincare journey.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
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

            <button
              type="button"
              className="password-suggest-btn"
              onClick={generatePassword}
            >
              ✨ Suggest Strong Password
            </button>
          </div>

          {/* Password Strength */}
          {password && (
            <div className="password-strength">

              <div className="strength-heading">
                Password strength:
                <strong>{strengthLabel}</strong>
              </div>

              <div className="strength-track">
                <div
                  className={`strength-fill strength-${strength}`}
                  style={{ width: `${strength * 20}%` }}
                />
              </div>

              <div className="password-requirements">

                <p className={requirements.length ? 'valid' : ''}>
                  {requirements.length ? '✓' : '○'}
                  {' '}At least 8 characters
                </p>

                <p className={requirements.uppercase ? 'valid' : ''}>
                  {requirements.uppercase ? '✓' : '○'}
                  {' '}One uppercase letter
                </p>

                <p className={requirements.lowercase ? 'valid' : ''}>
                  {requirements.lowercase ? '✓' : '○'}
                  {' '}One lowercase letter
                </p>

                <p className={requirements.number ? 'valid' : ''}>
                  {requirements.number ? '✓' : '○'}
                  {' '}One number
                </p>

                <p className={requirements.special ? 'valid' : ''}>
                  {requirements.special ? '✓' : '○'}
                  {' '}One special character
                </p>

              </div>
            </div>
          )}

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>

            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="password-eye"
                onClick={() => setShowConfirmPassword(prev => !prev)}
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Messages */}
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

          <button type="submit" className="auth-button">
            Create Account
          </button>

        </form>

        <div className="google-divider">
          <span>OR</span>
        </div>

        {/* Google Sign-In */}
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
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <p className="auth-footer">
          Your skin. Your care. Your intelligence. 🌱
        </p>

      </div>
    </div>
  )
}

export default Register
