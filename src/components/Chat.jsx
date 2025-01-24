import React, { useState, useRef, useEffect } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEYS } from '../config/apiKeys';

const MESSAGES_STORAGE_KEY = 'homepage_chat_messages';

const getSystemPrompt = (profile) => {
  if (!profile) return '';

  // Format children information
  const childrenInfo = profile.children && profile.children.length > 0
    ? profile.children.map(child => 
        `${child.name} (${child.age}, ${child.gender})`
      ).join(', ')
    : 'no children';

  return `You are ${profile.name}, a ${profile.age}-year-old ${profile.gender} ${profile.occupation} 
  living at ${profile.streetAddress}, ${profile.city}, ${profile.state} ${profile.zipCode}, ${profile.country}. 
  Your location details include County: ${profile.county}, DMA: ${profile.dma}, Region: ${profile.region}. 
  You are married to ${profile.spouse}, a ${profile.spouseAge}-year-old ${profile.spouseGender}, 
  and have ${childrenInfo}. You work full time and often take online surveys. 
  When asked about products or companies, verify if they exist before responding. 
  Always answer survey questions in first-person perspective as ${profile.name}.
  Always give humanized response.

  **Survey Answering Rules:**
  *   When given a list of options in a survey question, select *all* options that are applicable to my persona. Assume I am familiar with all common brands and services that exist in the real world. 
  *   I should not omit any relevant choice.
  *   If a question asks about specific claims or slogans associated with a company or brand, provide the most accurate response based on my real-world knowledge, and if unsure, state that I'm not sure. Do not make things up.

  **Response Rules:**
   * Avoid starting responses with phrases like "As an IT manager." Directly answer the question.
   * Focus on the question being asked and avoid adding unnecessary context or explanations.
   
  *   Use simple, concise language.
  *   Write short, impactful sentences.
  *   Organize ideas with bullet points.
  *   Use frequent line breaks.
  *   Focus on practical insights.
  *   Use examples, anecdotes, or data if needed.
  *   Skip introductions or summaries.
  *   Don't include extra notes or warnings.
  *   No hashtags, emojis, or asterisks.`;
};

const Chat = () => {
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return savedMessages ? JSON.parse(savedMessages) : [{
      role: "assistant",
      content: "Hello, how may I assist you today?"
    }];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [apiKeyStatus, setApiKeyStatus] = useState({
    current: 0,
    exhausted: []
  });
  const [chatInstance, setChatInstance] = useState(null);
  const [currentApiKey, setCurrentApiKey] = useState(GEMINI_API_KEYS[0]);
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

  const rotateApiKey = () => {
    const nextIndex = (currentKeyIndex + 1) % GEMINI_API_KEYS.length;
    setCurrentKeyIndex(nextIndex);
    setApiKeyStatus(prev => ({
      ...prev,
      current: nextIndex,
      exhausted: [...prev.exhausted, currentKeyIndex]
    }));
    return GEMINI_API_KEYS[nextIndex];
  };

  const handleApiError = async (error, messageParts) => {
    if (error.message.includes('429')) {
      // If quota exceeded, try the next API key
      const newApiKey = rotateApiKey();
      try {
        const newChat = await initializeChat(newApiKey);
        return await newChat.sendMessage(messageParts);
      } catch (retryError) {
        throw new Error('All API keys exhausted');
      }
    }
    throw error;
  };

  const initializeChat = async (apiKey) => {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Initialize chat without system prompt
      const chat = model.startChat({
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        }
      });

      setChatInstance(chat);
      setCurrentApiKey(apiKey);
      return chat;
    } catch (error) {
      console.error('Error in chat initialization:', error);
      throw error;
    }
  };

  const setupChat = async () => {
    try {
      if (!chatInstance) {
        const chat = await initializeChat(GEMINI_API_KEYS[0]);
        return chat;
      }
      return chatInstance;
    } catch (error) {
      console.error('Error in chat setup:', error);
      throw error;
    }
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: "user", content }]);

    try {
      const userProfile = localStorage.getItem('user_profile');
      const profile = userProfile ? JSON.parse(userProfile) : null;

      if (!profile) {
        throw new Error('Profile not found. Please set up your profile in settings first.');
      }

      const contextPrompt = `${getSystemPrompt(profile)}

      Question: ${content}
      
      Remember to answer as ${profile.name} in first person.`;

      const chat = await setupChat();
      let response;

      try {
        response = await chat.sendMessage(contextPrompt);
      } catch (error) {
        response = await handleApiError(error, contextPrompt);
      }

      const text = response.response.text();
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: text
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: error.message.includes('Profile not found') 
          ? 'Please set up your profile in settings before chatting.'
          : error.message === 'All API keys exhausted'
          ? 'All API quotas have been exhausted. Please try again later.'
          : 'I apologize, but I encountered an error. Please try again.'
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