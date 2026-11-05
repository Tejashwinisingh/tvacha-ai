
import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../css/Auth.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setSuccess('')

    try {
      setLoading(true)

      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email.trim()
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Unable to process your request.')
      }

      setSuccess(data.message)

    } catch (err) {
      setError(err.message || 'Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <div className="auth-logo">
          🌿 TvachaAI
        </div>

        <h1>Forgot Password?</h1>

        <p className="auth-description">
          Enter your registered email address to reset your password.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
                setSuccess('')
              }}
              autoComplete="email"
              required
            />
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
            {loading ? 'Please wait...' : 'Send Reset Instructions'}
          </button>

        </form>

        <p className="auth-switch">
          Already have a reset token?{' '}
          <Link to="/reset-password">
            Reset Password
          </Link>
        </p>

        <p className="auth-switch">
          Remember your password?{' '}
          <Link to="/login">Back to Login</Link>
        </p>

        <p className="auth-footer">
          Your skin. Your care. Your intelligence. 🌱
        </p>

      </div>
    </div>
  )
}

export default ForgotPassword
