
import { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams
} from 'react-router-dom'
import '../css/Auth.css'

function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Automatically read token from the email URL
  const tokenFromUrl = searchParams.get('token') || ''

  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  })

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

    setError('')
    setSuccess('')

    if (!tokenFromUrl) {
      setError('Invalid reset link. Please request a new password reset email.')
      return
    }

    if (!formData.new_password || !formData.confirm_password) {
      setError('Please fill in all fields.')
      return
    }

    if (formData.new_password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match.')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(
        'http://127.0.0.1:8000/api/auth/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: tokenFromUrl,
            new_password: formData.new_password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Password reset failed.'
        )
      }

      setSuccess(
        data.message || 'Password reset successfully!'
      )

      setFormData({
        new_password: '',
        confirm_password: ''
      })

      setTimeout(() => {
        navigate('/login')
      }, 2000)

    } catch (err) {
      setError(
        err.message || 'Unable to connect to the server.'
      )
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

        <h1>Reset Password</h1>

        <p className="auth-description">
          Create a new password for your TvachaAI account.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>New Password</label>

            <input
              type="password"
              name="new_password"
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>

            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              autoComplete="new-password"
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
            disabled={loading || !tokenFromUrl}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>

        </form>

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

export default ResetPassword
