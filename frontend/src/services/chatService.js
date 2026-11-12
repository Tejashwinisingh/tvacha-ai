
const API_URL = "http://127.0.0.1:8000";

// ==========================================================
// AUTHENTICATION
// ==========================================================

function getToken() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return token;
}

// ==========================================================
// STANDARD JSON REQUEST
// ==========================================================

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";

    throw new Error("Session expired. Please log in again.");
  }

  const data =
    response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "Something went wrong. Please try again."
    );
  }

  return data;
}

// ==========================================================
// MULTIPART FILE UPLOAD REQUEST
// ==========================================================

async function uploadRequest(endpoint, formData) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",

    headers: {
      Authorization: `Bearer ${getToken()}`,
      Accept: "application/json",
    },

    // Do not manually set Content-Type.
    // Browser automatically adds the multipart boundary.
    body: formData,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("access_token");
    window.location.href = "/login";

    throw new Error("Session expired. Please log in again.");
  }

  const data =
    response.status === 204 ? null : await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail || "File upload failed. Please try again."
    );
  }

  return data;
}

// ==========================================================
// CHAT SERVICE
// ==========================================================

export const chatService = {

  // Create conversation
  createConversation(title = "New Conversation") {
    return request("/api/chat/conversations", {
      method: "POST",
      body: JSON.stringify({ title }),
    });
  },

  // Get all conversations
  getConversations() {
    return request("/api/chat/conversations");
  },

  // Get conversation details
  getConversation(id) {
    return request(`/api/chat/conversations/${id}`);
  },

  // Update conversation
  updateConversation(id, updates) {
    return request(`/api/chat/conversations/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  },

  // Delete conversation
  deleteConversation(id) {
    return request(`/api/chat/conversations/${id}`, {
      method: "DELETE",
    });
  },

  // ========================================================
  // EXISTING TEXT-ONLY CHAT
  // ========================================================

  sendMessage(message, conversationId = null) {
    return request("/api/skincare-agent/chat", {
      method: "POST",
      body: JSON.stringify({
        message,
        conversation_id: conversationId,
      }),
    });
  },

  // ========================================================
  // NEW IMAGE / PDF / DOCX UPLOAD CHAT
  // ========================================================

  sendMessageWithFiles(message, conversationId = null, files = []) {

    if (!Array.isArray(files) || files.length === 0) {
      throw new Error("Please select at least one file.");
    }

    const formData = new FormData();

    formData.append("message", message || "");

    if (conversationId) {
      formData.append("conversation_id", conversationId);
    }

    files.forEach((file) => {
      formData.append("files", file);
    });

    return uploadRequest(
      "/api/skincare-agent/chat-with-attachments",
      formData
    );
  },
};
