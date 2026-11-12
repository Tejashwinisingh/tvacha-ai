
import React, { useMemo, useState } from "react";
import ConversationMenu from "./ConversationMenu";

function ChatSidebar({
  conversations = [],
  activeConversation,
  onNewChat,
  onSelectConversation,
  onRename,
  onPin,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const filteredConversations = useMemo(() => {
    return [...conversations]
      .filter((conversation) =>
        (conversation.title || "New Conversation")
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (a.is_pinned !== b.is_pinned) {
          return a.is_pinned ? -1 : 1;
        }

        return (
          new Date(b.last_message_at || b.updated_at || 0) -
          new Date(a.last_message_at || a.updated_at || 0)
        );
      });
  }, [conversations, search]);

  function startRename(conversation) {
    setEditingId(conversation.id);
    setEditTitle(conversation.title || "");
  }

  function saveRename(id) {
    const title = editTitle.trim();

    if (title) {
      onRename(id, title);
    }

    setEditingId(null);
    setEditTitle("");
  }

  function cancelRename() {
    setEditingId(null);
    setEditTitle("");
  }

  return (
    <aside className="chat-sidebar">

      {/* BRAND */}
      <div className="chat-sidebar-brand">
        <span>🌿</span>
        <strong>TvachaAI</strong>
      </div>

      {/* NEW CHAT */}
      <button
        type="button"
        className="chat-new-btn"
        onClick={onNewChat}
      >
        + New Chat
      </button>

      {/* SEARCH */}
      <input
        type="search"
        className="chat-search"
        placeholder="Search conversations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h4 className="chat-history-heading">
        Your conversations
      </h4>

      {/* CONVERSATION HISTORY */}
      <div className="chat-conversation-list">
        {filteredConversations.length === 0 ? (
          <p className="chat-empty-history">
            No conversations found.
          </p>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`chat-conversation-item ${
                activeConversation === conversation.id
                  ? "active"
                  : ""
              }`}
            >
              {editingId === conversation.id ? (
                <input
                  autoFocus
                  className="chat-rename-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveRename(conversation.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.currentTarget.blur();
                    }

                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelRename();
                    }
                  }}
                />
              ) : (
                <>
                  <button
                    type="button"
                    className="chat-conversation-select"
                    onClick={() =>
                      onSelectConversation(conversation.id)
                    }
                    title={conversation.title}
                  >
                    {conversation.is_pinned ? "📌 " : ""}
                    {conversation.title || "New Conversation"}
                  </button>

                  <ConversationMenu
                    conversation={conversation}
                    onRename={startRename}
                    onPin={onPin}
                    onDelete={onDelete}
                  />
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* FOOTER */}
      <div className="chat-sidebar-footer">
        Your personal skincare companion 🌱
      </div>

    </aside>
  );
}

export default ChatSidebar;
