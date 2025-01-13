import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-container">
      <textarea
        ref={inputRef}
        className="chat-input"
        rows="1"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
      />
      <motion.button
        className="send-button"
        onClick={handleSend}
        disabled={isLoading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isLoading ? (
          <div className="typing-indicator">
            <div className="typing-dot" style={{ animationDelay: "0s" }} />
            <div className="typing-dot" style={{ animationDelay: "0.2s" }} />
            <div className="typing-dot" style={{ animationDelay: "0.4s" }} />
          </div>
        ) : (
          <>
            <span>Send</span>
            <FaPaperPlane />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default MessageInput; 