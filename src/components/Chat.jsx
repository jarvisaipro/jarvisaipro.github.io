import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { motion } from 'framer-motion';
import { FaTrash } from 'react-icons/fa';
import { getGroqChatCompletion } from '../api/groqClient';

const MESSAGES_STORAGE_KEY = 'homepage_chat_messages';

const Chat = () => {
  console.log('Chat component rendered'); // Debug log

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
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: '100vh',
      width: '100vw',
      zIndex: 1000
    }}>
      <div className="chat-layout" style={{ height: '100%' }}>
        <div className="chat-wrapper" style={{ height: '100%' }}>
          <div className="messages-container">
            {messages.map((message, index) => (
              <Message key={index} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          <MessageInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default Chat;