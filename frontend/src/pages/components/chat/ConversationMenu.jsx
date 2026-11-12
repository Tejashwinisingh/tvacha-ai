
import { useRef } from "react";

function ConversationMenu({ conversation, onRename, onPin, onDelete }) {
  const menuRef = useRef(null);

  const handleAction = (callback) => {
    callback();
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  };

  return (
    <details
      className="chat-conversation-menu"
      ref={menuRef}
    >
      <summary className="chat-menu-trigger">⋮</summary>

      <div className="chat-menu-options">
        <button
          type="button"
          onClick={() =>
            handleAction(() => onRename(conversation))
          }
        >
          ✏️ Rename
        </button>

        <button
          type="button"
          onClick={() =>
            handleAction(() => onPin(conversation))
          }
        >
          📌 {conversation.is_pinned ? "Unpin" : "Pin"}
        </button>

        <button
          type="button"
          className="chat-menu-delete"
          onClick={() =>
            handleAction(() => onDelete(conversation.id))
          }
        >
          🗑️ Delete
        </button>
      </div>
    </details>
  );
}

export default ConversationMenu;
