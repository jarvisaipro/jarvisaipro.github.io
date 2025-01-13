import React from "react";

const ChatHistory = ({ chatHistories, onSelectChat, onDeleteChat, onNewChat }) => {
  return (
    <div className="chat-history">
      <div className="chat-history-header">
        <h3>Chat History</h3>
        <button className="new-chat-button" onClick={onNewChat}>
          + New Chat
        </button>
      </div>
      <ul className="chat-history-list">
        {chatHistories.map((chat, index) => (
          <li
            key={index}
            className={`chat-history-item ${index === 0 ? "active" : ""}`}
            onClick={() => onSelectChat(index)}
          >
            <span className="chat-title">{chat.title}</span>
            <button
              className="delete-chat-button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering onSelectChat
                onDeleteChat(index);
              }}
            >
              🗑️
            </button>
          </li>
        ))}
        {chatHistories.length === 0 && (
          <li className="no-history">No previous chats</li>
        )}
      </ul>
    </div>
  );
};

export default ChatHistory; 