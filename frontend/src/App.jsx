
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword'
import ResetPassword from './pages/ResetPassword/ResetPassword'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail'
import Dashboard from './pages/Dashboard/Dashboard'

// Home page
function Home() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="brand">🌿 TvachaAI</div>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#about">About</a>
          <a href="#features">Features</a>
        </div>

        <div>
          <a href="/login">
            <button className="login-btn">Login</button>
          </a>
        </div>
      </nav>

      <main id="home" className="hero">
        <div className="hero-content">
          <span className="tagline">
            ✨ YOUR PERSONAL AI SKINCARE COMPANION
          </span>

          <h1>
            Your Skin Has a Story.
            <br />
            <span>Let's Understand It.</span>
          </h1>

          <p>
            Discover a smarter approach to skincare.
            Understand your skin, explore ingredients,
            and build a skincare routine that works for you.
          </p>

          <div className="hero-buttons">
            <a href="/register">
              <button className="primary-btn">Get Started →</button>
            </a>

            <a href="#features">
              <button className="secondary-btn">Explore Features</button>
            </a>
          </div>

          <div className="hero-note">
            🌱 Free to use • Privacy focused • AI powered
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-circle">
            <span className="leaf">🌿</span>
            <div className="visual-text">
              <h2>Healthy Skin</h2>
              <p>Starts with understanding</p>
            </div>
          </div>
        </div>
      </main>

      <section id="about" className="about">
        <h2>Skincare, Made Smarter.</h2>
        <p>
          TvachaAI brings skincare knowledge and intelligent
          technology together to help you make informed
          skincare decisions.
        </p>
      </section>

      <footer>
        © 2026 TvachaAI. Built with care for every skin story. 🌿
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/verify-email"
          element={<VerifyEmail />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
