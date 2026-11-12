
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const API_URL = 'http://127.0.0.1:8000'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('access_token')

      if (!token) {
        navigate('/login', { replace: true })
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json'
          }
        })

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('access_token')
          navigate('/login', { replace: true })
          return
        }

        if (!response.ok) {
          throw new Error('Unable to load your profile.')
        }

        const userData = await response.json()
        setUser(userData)

      } catch (err) {
        setError(err.message || 'Something went wrong.')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('access_token')
    navigate('/login', { replace: true })
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading your dashboard...
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-loading">
        <p>{error}</p>
        <button onClick={handleLogout}>
          Return to Login
        </button>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          🌿 TvachaAI
        </div>

        <nav className="dashboard-nav">
          <a href="#overview" className="active">
            Overview
          </a>

          <a href="#profile">
            My Profile
          </a>

          <a href="#skin-profile">
            Skin Profile
          </a>

          <a href="#skin-history">
            Skin History
          </a>

          <a href="#settings">
            Settings
          </a>
        </nav>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* MAIN DASHBOARD */}
      <main className="dashboard-main" id="overview">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <p className="dashboard-label">
              YOUR PERSONAL SKINCARE SPACE
            </p>

            <h1>
              Welcome back, {user.full_name}! 🌱
            </h1>

            <p>
              Let's take care of your skin, one step at a time.
            </p>
          </div>

          <div className="dashboard-avatar">
            {user.full_name?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* WELCOME SECTION */}
        <section className="dashboard-welcome">
          <div>
            <span>✨ YOUR SKINCARE JOURNEY</span>

            <h2>Your skin has a story.</h2>

            <p>
              Understand your skin, discover your preferences,
              and build healthier skincare habits.
            </p>
          </div>

          <div className="dashboard-leaf">
            🌿
          </div>
        </section>

        {/* ACCOUNT PROFILE */}
        <section className="dashboard-section" id="profile">
          <h2>Your Account</h2>

          <div className="dashboard-grid">

            <div className="dashboard-card">
              <span>👤</span>
              <h3>Full Name</h3>
              <p>{user.full_name}</p>
            </div>

            <div className="dashboard-card">
              <span>✉️</span>
              <h3>Email Address</h3>
              <p>{user.email}</p>
            </div>

            <div className="dashboard-card">
              <span>✓</span>
              <h3>Account Status</h3>
              <p>
                {user.is_verified ? 'Verified' : 'Not verified'}
              </p>
            </div>

          </div>
        </section>

        {/* EXPLORE FEATURES */}
        <section className="dashboard-section">
          <h2>Explore TvachaAI</h2>

          <div className="dashboard-grid">

            {/* SKIN PROFILE */}
            <div
              className="dashboard-card feature-card"
              id="skin-profile"
            >
              <span>🧴</span>

              <h3>My Skin Profile</h3>

              <p>
                Manage your skin type and skincare preferences.
              </p>

              <small>Coming soon</small>
            </div>

            {/* AI SKINCARE ASSISTANT */}
            <div
              className="dashboard-card feature-card clickable-card"
              onClick={() => navigate('/chat')}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (
                  event.key === 'Enter' ||
                  event.key === ' '
                ) {
                  event.preventDefault()
                  navigate('/chat')
                }
              }}
            >
              <span>✨</span>

              <h3>AI Skincare Assistant</h3>

              <p>
                Chat with your personal AI skincare companion
                and get personalized skincare guidance.
              </p>

              <small>Start Chatting →</small>
            </div>

            {/* SKIN HISTORY */}
            <div
              className="dashboard-card feature-card"
              id="skin-history"
            >
              <span>📖</span>

              <h3>Skin History</h3>

              <p>
                Keep track of your skincare journey.
              </p>

              <small>Coming soon</small>
            </div>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          Your skin. Your care. Your intelligence. 🌿
        </footer>

      </main>
    </div>
  )
}

export default Dashboard
