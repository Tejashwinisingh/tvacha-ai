
import React, { useEffect, useRef } from "react";

function ChatMessages({ messages = [], loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function formatTime(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="chat-messages">
      {messages.map((message, index) => (
        <div
          key={message.id || `${message.role}-${index}`}
          className={`chat-message ${
            message.role === "user" ? "user-message" : "assistant-message"
          }`}
        >
          <div className="chat-message-avatar">
            {message.role === "user" ? "You" : "AI"}
          </div>

          <div className="chat-message-body">
            <div className="chat-message-content">
              {message.content}
            </div>

            <span className="chat-message-time">
              {formatTime(message.created_at || message.timestamp)}
            </span>
          </div>
        </div>
      ))}

      {loading && (
        <div className="chat-typing">
          TvachaAI is thinking...
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatMessages;
