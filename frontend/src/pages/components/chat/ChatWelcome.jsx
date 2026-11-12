
import React from "react";

const suggestions = [
  {
    title: "Understand my skin type",
    description: "Help me identify my skin type.",
  },
  {
    title: "Acne and acne marks",
    description: "How can I reduce acne and marks?",
  },
  {
    title: "Build a skincare routine",
    description: "Suggest a simple daily skincare routine.",
  },
  {
    title: "Learn about ingredients",
    description: "Explain niacinamide and its benefits.",
  },
];

function ChatWelcome({ onSuggestionClick }) {
  return (
    <div className="chat-welcome">
      <div className="chat-welcome-icon">🌿</div>

      <h1>Welcome to TvachaAI</h1>

      <p>
        Your personal AI skincare companion.
        Ask questions and explore skincare with confidence.
      </p>

      <div className="chat-suggestions">
        {suggestions.map((item) => (
          <button
            type="button"
            className="chat-suggestion-card"
            key={item.title}
            onClick={() => onSuggestionClick(item.description)}
          >
            <strong>{item.title}</strong>
            <span>{item.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChatWelcome;
