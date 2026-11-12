
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './SkincareAgent.css'

const API_URL = 'http://127.0.0.1:8000'

function SkincareAgent() {
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! 🌿 I'm TvachaAI, your personal skincare companion. Tell me about your skin concerns, and let's build a skincare routine together."
    }
  ])
  const [conversationId, setConversationId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel()
      recognitionRef.current?.stop()
    }
  }, [])

  async function sendMessage(event) {
    event?.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage || loading) return

    const token = localStorage.getItem('access_token')

    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    setError('')
    setMessage('')

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: trimmedMessage }
    ])

    setLoading(true)

    try {
      const response = await fetch(
        `${API_URL}/api/skincare-agent/chat`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            message: trimmedMessage,
            conversation_id: conversationId
          })
        }
      )

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('access_token')
        navigate('/login', { replace: true })
        return
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Unable to get a response from TvachaAI.'
        )
      }

      setConversationId(data.conversation_id)

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: data.response
        }
      ])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      setError(
        'Speech recognition is not supported in this browser. Please use Chrome or type your message.'
      )
      return
    }

    setError('')

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const recognition = new SpeechRecognition()

    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setListening(true)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setMessage((previous) =>
        previous ? `${previous} ${transcript}` : transcript
      )
    }

    recognition.onerror = () => {
      setError('Microphone error. Please check your microphone permission.')
      setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }

  function speakMessage(content) {
    if (!window.speechSynthesis) {
      setError('Text-to-speech is not supported in this browser.')
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(content)
    utterance.lang = 'en-IN'
    utterance.rate = 1
    utterance.pitch = 1

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  function stopSpeaking() {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  function startNewChat() {
    stopSpeaking()
    setConversationId(null)
    setError('')
    setMessages([
      {
        role: 'assistant',
        content:
          "Welcome back! 🌿 What would you like to discuss about your skincare today?"
      }
    ])
  }

  return (
    <div className="skincare-agent-page">
      <aside className="agent-sidebar">
        <div className="agent-brand">🌿 TvachaAI</div>

        <button
          className="agent-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <div className="agent-sidebar-content">
          <p className="agent-sidebar-heading">YOUR SKINCARE SPACE</p>

          <button
            className="agent-new-chat"
            onClick={startNewChat}
          >
            + New Conversation
          </button>

          <div className="agent-sidebar-note">
            <span>✨</span>
            <h3>Your AI Companion</h3>
            <p>
              Get skincare guidance based on your questions and preferences.
            </p>
          </div>
        </div>

        <div className="agent-sidebar-footer">
          Your Skin. Your Care. Your Intelligence.
        </div>
      </aside>

      <main className="agent-main">
        <header className="agent-header">
          <div>
            <p className="agent-eyebrow">YOUR PERSONAL SKINCARE COMPANION</p>
            <h1>Ask TvachaAI 🌱</h1>
            <p>Let's understand your skin and care for it together.</p>
          </div>

          <div className="agent-status">
            <span className="agent-status-dot"></span>
            AI Assistant
          </div>
        </header>

        <section className="agent-chat-container">
          <div className="agent-chat-messages">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`agent-message-row ${item.role}`}
              >
                {item.role === 'assistant' && (
                  <div className="agent-message-avatar">🌿</div>
                )}

                <div className="agent-message-content">
                  <div className="agent-message-name">
                    {item.role === 'assistant' ? 'TvachaAI' : 'You'}
                  </div>

                  <div className="agent-message-bubble">
                    {item.content}
                  </div>

                  {item.role === 'assistant' && (
                    <div className="agent-message-actions">
                      <button
                        onClick={() => speakMessage(item.content)}
                        title="Listen to this response"
                      >
                        🔊 Listen
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="agent-message-row assistant">
                <div className="agent-message-avatar">🌿</div>
                <div className="agent-message-content">
                  <div className="agent-message-name">TvachaAI</div>
                  <div className="agent-message-bubble agent-typing">
                    Thinking about your skincare question...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="agent-error" role="alert">
              {error}
            </div>
          )}

          <form className="agent-input-area" onSubmit={sendMessage}>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Ask me about acne, oily skin, routines, ingredients..."
              rows={2}
              disabled={loading}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  sendMessage()
                }
              }}
            />

            <div className="agent-input-actions">
              <button
                type="button"
                className={`agent-mic-button ${listening ? 'listening' : ''}`}
                onClick={startListening}
                disabled={loading}
                title="Speak your question"
              >
                {listening ? '🔴 Listening...' : '🎙️ Voice'}
              </button>

              {speaking && (
                <button
                  type="button"
                  className="agent-stop-button"
                  onClick={stopSpeaking}
                >
                  Stop audio
                </button>
              )}

              <button
                type="submit"
                className="agent-send-button"
                disabled={loading || !message.trim()}
              >
                {loading ? 'Sending...' : 'Send ↑'}
              </button>
            </div>
          </form>

          <p className="agent-disclaimer">
            TvachaAI provides general skincare information, not medical
            diagnosis. Consult a dermatologist for persistent or serious
            skin concerns.
          </p>
        </section>
      </main>
    </div>
  )
}

export default SkincareAgent
