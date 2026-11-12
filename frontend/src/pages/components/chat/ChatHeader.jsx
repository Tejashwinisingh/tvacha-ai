
import React from "react";
import { useNavigate } from "react-router-dom";

function ChatHeader() {
  const navigate = useNavigate();

  return (
    <header className="chat-header">
      <div>
        <h2>Ask TvachaAI</h2>
        <p>
          <span className="chat-status-dot"></span>
          AI Skincare Assistant
        </p>
      </div>

      <button
        type="button"
        className="chat-dashboard-btn"
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>
    </header>
  );
}

export default ChatHeader;
