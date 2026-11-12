
import React, { useState, useEffect, useRef } from "react";

const ACCEPTED_EXTENSIONS = [
  "png",
  "jpg",
  "jpeg",
  "webp",
  "pdf",
  "docx",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

function ChatInput({ onSend, loading }) {
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [files, setFiles] = useState([]);
  const [fileError, setFileError] = useState("");

  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageUrlsRef = useRef([]);

  // ==========================================================
  // CLEANUP
  // ==========================================================

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      imageUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  // ==========================================================
  // FILE SELECTION
  // ==========================================================

  function handleFileChange(e) {
    const selectedFiles = Array.from(e.target.files || []);

    setFileError("");

    const validFiles = [];

    for (const file of selectedFiles) {
      const extension = file.name.split(".").pop().toLowerCase();

      if (!ACCEPTED_EXTENSIONS.includes(extension)) {
        setFileError(`${file.name}: Unsupported file format.`);
        continue;
      }

      if (file.size === 0) {
        setFileError(`${file.name}: Empty files are not allowed.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError(`${file.name}: File size must be 10 MB or less.`);
        continue;
      }

      validFiles.push(file);
    }

    setFiles((previous) => {
      const combined = [...previous, ...validFiles];

      const unique = combined.filter(
        (file, index, array) =>
          array.findIndex(
            (item) =>
              item.name === file.name &&
              item.size === file.size &&
              item.lastModified === file.lastModified
          ) === index
      );

      if (unique.length > MAX_FILES) {
        setFileError("You can attach a maximum of 5 files.");
      }

      return unique.slice(0, MAX_FILES);
    });

    e.target.value = "";
  }

  // ==========================================================
  // REMOVE FILE
  // ==========================================================

  function removeFile(index) {
    setFiles((previous) =>
      previous.filter((_, i) => i !== index)
    );
  }

  // ==========================================================
  // SEND MESSAGE AND ATTACHMENTS
  // ==========================================================

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = message.trim();

    if ((!trimmed && files.length === 0) || loading) {
      return;
    }

    setVoiceError("");
    setFileError("");

    try {
      // Wait for backend response before clearing the input.
      await onSend(trimmed, [...files]);

      setMessage("");
      setFiles([]);

    } catch (err) {
      setFileError(
        err.message || "Unable to send your message. Please try again."
      );
    }
  }

  // ==========================================================
  // KEYBOARD HANDLING
  // ==========================================================

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  // ==========================================================
  // VOICE INPUT
  // ==========================================================

  function startListening() {
    setVoiceError("");

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Voice input is not supported. Please use Chrome or Edge."
      );
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const finalTranscript = Array.from(event.results)
        .filter((result) => result.isFinal)
        .map((result) => result[0].transcript)
        .join(" ");

      if (finalTranscript) {
        setMessage((previous) =>
          previous
            ? `${previous.trim()} ${finalTranscript}`
            : finalTranscript
        );
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setVoiceError("Please allow microphone access.");
      } else if (
        !["no-speech", "aborted"].includes(event.error)
      ) {
        setVoiceError(
          "Unable to recognize your voice. Please try again."
        );
      }

      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  }

  // ==========================================================
  // IMAGE PREVIEWS
  // ==========================================================

  const previews = files.map((file) => ({
    file,
    url: file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : null,
  }));

  // Revoke preview URLs when files change or component unmounts.
  useEffect(() => {
    const previousUrls = imageUrlsRef.current;

    imageUrlsRef.current = previews
      .map((preview) => preview.url)
      .filter(Boolean);

    previousUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });

    return () => {
      imageUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });

      imageUrlsRef.current = [];
    };
  }, [files]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <form
      className="chat-input-container"
      onSubmit={handleSubmit}
    >

      {/* ATTACHMENT PREVIEWS */}
      {previews.length > 0 && (
        <div className="chat-attachments">

          {previews.map(({ file, url }, index) => (
            <div
              className="chat-attachment-item"
              key={`${file.name}-${file.size}-${file.lastModified}`}
            >

              {url ? (
                <img
                  src={url}
                  alt={file.name}
                  className="chat-attachment-preview"
                />
              ) : (
                <span className="chat-attachment-icon">
                  {file.name.toLowerCase().endsWith(".pdf")
                    ? "📕"
                    : "📄"}
                </span>
              )}

              <div className="chat-attachment-info">
                <span title={file.name}>
                  {file.name}
                </span>

                <small>
                  {(file.size / 1024).toFixed(1)} KB
                </small>
              </div>

              <button
                type="button"
                className="chat-remove-attachment"
                onClick={() => removeFile(index)}
                disabled={loading}
                aria-label={`Remove ${file.name}`}
              >
                ×
              </button>

            </div>
          ))}

        </div>
      )}

      {/* MESSAGE INPUT */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything about your skin..."
        rows={1}
        disabled={loading}
      />

      {/* HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.webp,.pdf,.docx"
        multiple
        hidden
        onChange={handleFileChange}
      />

      {/* ATTACHMENT BUTTON */}
      <button
        type="button"
        className="chat-attach-btn"
        onClick={() => fileInputRef.current?.click()}
        disabled={loading || files.length >= MAX_FILES}
        title="Attach images or reports"
        aria-label="Attach files"
      >
        📎
      </button>

      {/* MICROPHONE BUTTON */}
      <button
        type="button"
        className={`chat-mic-btn ${listening ? "listening" : ""}`}
        onClick={startListening}
        disabled={loading}
        title={listening ? "Stop recording" : "Speak your question"}
        aria-label={listening ? "Stop recording" : "Start voice input"}
      >
        {listening ? "⏹️" : "🎙️"}
      </button>

      {/* SEND BUTTON */}
      <button
        type="submit"
        disabled={
          (!message.trim() && files.length === 0) ||
          loading
        }
        className="chat-send-btn"
      >
        {loading ? "..." : "Send"}
      </button>

      {/* ERRORS */}
      {voiceError && (
        <p className="chat-voice-error">
          {voiceError}
        </p>
      )}

      {fileError && (
        <p className="chat-voice-error">
          {fileError}
        </p>
      )}

    </form>
  );
}

export default ChatInput;
