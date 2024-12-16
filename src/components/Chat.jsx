import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import { getGroqChatCompletion } from '../api/groqClient';

const MESSAGES_STORAGE_KEY = 'homepage_chat_messages';

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [{
      role: "assistant",
      content: "Hello, how may I assist you today?"
    }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = { role: "user", content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMessage];
      const response = await getGroqChatCompletion(conversationHistory);
      const assistantMessage = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    const initialMessage = {
      role: "assistant",
      content: "Conversation cleared. How may I assist you?"
    };
    setMessages([initialMessage]);
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify([initialMessage]));
  };

  useEffect(() => {
    const handleClearChat = () => {
      clearConversation();
    };

    window.addEventListener('clearChat', handleClearChat);
    return () => window.removeEventListener('clearChat', handleClearChat);
  }, []);

  return (
    <>
      <div style={{ 
        position: 'fixed', 
        top: '10px', 
        right: '200px',  // Adjust this value if needed
        zIndex: 9999    // Increased z-index
      }}>
        <motion.button
          onClick={clearConversation}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Clear conversation"
          style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #333',
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
            gap: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',  // Added shadow
            minWidth: '120px',  // Ensure minimum width
            height: '40px'      // Match height with other buttons
          }}
        >
          <FaTrash size={16} />
          Clear Chat
        </motion.button>
      </div>

      <div className="chat-layout">
        <div className="chat-wrapper">
          <div className="messages-container">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
};

export default Chat;