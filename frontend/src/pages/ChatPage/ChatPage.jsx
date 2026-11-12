
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { chatService } from "../../services/chatService";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatInput from "../components/chat/ChatInput";
import ChatWelcome from "../components/chat/ChatWelcome";

import "./chat.css";

function ChatPage() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================================
  // LOAD CONVERSATIONS
  // ==========================================================

  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();

      setConversations(Array.isArray(data) ? data : []);

    } catch (err) {
      setError(err.message || "Unable to load conversations.");
      throw err;
    }
  }, []);

  // ==========================================================
  // AUTHENTICATION AND INITIAL HISTORY LOADING
  // ==========================================================

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    async function initializeChat() {
      try {
        await loadConversations();
      } catch {
        // Error is displayed in the chat interface.
      } finally {
        setPageLoading(false);
      }
    }

    initializeChat();

  }, [navigate, loadConversations]);

  // ==========================================================
  // START NEW CONVERSATION
  // ==========================================================

  function handleNewChat() {
    setActiveConversation(null);
    setMessages([]);
    setError("");
  }

  // ==========================================================
  // OPEN EXISTING CONVERSATION
  // ==========================================================

  async function handleSelectConversation(conversationId) {
    if (loading || pageLoading) return;

    try {
      setError("");
      setPageLoading(true);

      const data = await chatService.getConversation(conversationId);

      setActiveConversation(data.id);
      setMessages(data.messages || []);

    } catch (err) {
      setError(err.message || "Unable to open conversation.");
    } finally {
      setPageLoading(false);
    }
  }

  // ==========================================================
  // SEND TEXT MESSAGE / IMAGE / PDF / DOCX
  // ==========================================================

  async function handleSendMessage(message, files = []) {
    const trimmedMessage = (message || "").trim();

    const attachments = Array.isArray(files) ? files : [];

    // Allow message-only, file-only and message-plus-file requests.
    if (
      (!trimmedMessage && attachments.length === 0) ||
      loading ||
      pageLoading
    ) {
      return;
    }

    setError("");
    setLoading(true);

    const attachmentNames = attachments.map(
      (file) => file.name
    );

    const displayContent = [
      trimmedMessage,
      attachmentNames.length
        ? `Attached files: ${attachmentNames.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const userMessage = {
      id: `temporary-${Date.now()}`,
      role: "user",
      content: displayContent,
      created_at: new Date().toISOString(),
    };

    // Display user message immediately.
    setMessages((previous) => [...previous, userMessage]);

    try {
      let response;

      // TEXT + ATTACHMENT REQUEST
      if (attachments.length > 0) {
        response = await chatService.sendMessageWithFiles(
          trimmedMessage,
          activeConversation,
          attachments
        );
      }

      // EXISTING TEXT-ONLY REQUEST
      else {
        response = await chatService.sendMessage(
          trimmedMessage,
          activeConversation
        );
      }

      if (!response.conversation_id || !response.response) {
        throw new Error("Unexpected response from TvachaAI.");
      }

      setActiveConversation(response.conversation_id);

      // Retrieve saved messages from the database.
      try {
        const conversation = await chatService.getConversation(
          response.conversation_id
        );

        setMessages(conversation.messages || []);

      } catch {
        // Keep the successful response visible even if history
        // retrieval temporarily fails.
        setMessages((previous) => [
          ...previous,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: response.response,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      // Refresh sidebar independently.
      try {
        await loadConversations();
      } catch {
        // Message was successfully sent. Keep the current chat visible.
      }

    } catch (err) {
      setError(err.message || "Unable to send your message.");

      // Remove only the failed temporary message.
      setMessages((previous) =>
        previous.filter(
          (item) => item.id !== userMessage.id
        )
      );

    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // RENAME CONVERSATION
  // ==========================================================

  async function handleRename(conversationId, title) {
    try {
      setError("");

      await chatService.updateConversation(conversationId, {
        title,
      });

      await loadConversations();

    } catch (err) {
      setError(err.message || "Unable to rename conversation.");
    }
  }

  // ==========================================================
  // PIN / UNPIN CONVERSATION
  // ==========================================================

  async function handlePin(conversation) {
    try {
      setError("");

      await chatService.updateConversation(conversation.id, {
        is_pinned: !conversation.is_pinned,
      });

      await loadConversations();

    } catch (err) {
      setError(err.message || "Unable to update pin status.");
    }
  }

  // ==========================================================
  // DELETE CONVERSATION
  // ==========================================================

  async function handleDelete(conversationId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this conversation?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await chatService.deleteConversation(conversationId);

      if (activeConversation === conversationId) {
        handleNewChat();
      }

      await loadConversations();

    } catch (err) {
      setError(err.message || "Unable to delete conversation.");
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="tvacha-chat-layout">

      {/* CHAT SIDEBAR */}
      <ChatSidebar
        conversations={conversations}
        activeConversation={activeConversation}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        onRename={handleRename}
        onPin={handlePin}
        onDelete={handleDelete}
      />

      {/* MAIN CHAT AREA */}
      <main className="tvacha-chat-main">

        <ChatHeader />

        <section className="tvacha-chat-content">

          {/* ERROR MESSAGE */}
          {error && (
            <div className="chat-error" role="alert">
              <span>{error}</span>

              <button
                type="button"
                onClick={() => setError("")}
                aria-label="Close error"
              >
                ×
              </button>
            </div>
          )}

          {/* PAGE CONTENT */}
          {pageLoading ? (
            <div className="chat-page-loading">
              Loading your conversations...
            </div>
          ) : messages.length === 0 ? (
            <ChatWelcome
              onSuggestionClick={handleSendMessage}
            />
          ) : (
            <ChatMessages
              messages={messages}
              loading={loading}
            />
          )}

        </section>

        {/* CHAT INPUT */}
        <ChatInput
          onSend={handleSendMessage}
          loading={loading || pageLoading}
        />

      </main>

    </div>
  );
}

export default ChatPage;
