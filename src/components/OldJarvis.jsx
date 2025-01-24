import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paper, Box, Typography, TextField, Button, IconButton, Tooltip, Snackbar, Alert, Dialog, DialogContent } from '@mui/material';
import styled from 'styled-components';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ImageIcon from '@mui/icons-material/Image';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GEMINI_API_KEYS from '../config/apiKeys'; // Importing Gemini API keys
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

const MESSAGES_STORAGE_KEY = 'jarvis_chat_messages';

// Initialize the Gemini AI model
const genAI = new GoogleGenerativeAI(GEMINI_API_KEYS[0]); // Use the first API key as default
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  position: relative;
  background: #1a1a1a;
  color: white;
  padding: 20px;
  box-sizing: border-box;
`;

const ArcReactorCore = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.$isExpanded ? '60px' : '40px'};
  height: ${props => props.$isExpanded ? '60px' : '40px'};
  background: radial-gradient(
    circle,
    rgba(30, 144, 255, 0.4) 0%,
    rgba(30, 144, 255, 0.2) 50%,
    transparent 70%
  );
  border-radius: 50%;
  box-shadow: 
    0 0 30px rgba(30, 144, 255, 0.4),
    inset 0 0 20px rgba(30, 144, 255, 0.4);
  z-index: 1;
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: ${props => props.$isExpanded ? '30px' : '20px'};
    height: ${props => props.$isExpanded ? '30px' : '20px'};
    background: rgba(30, 144, 255, 0.3);
    border-radius: 50%;
    box-shadow: 0 0 20px rgba(30, 144, 255, 0.5);
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  background: ${props => props.$sender === 'jarvis' ? '#374151' : '#2563eb'};
  margin-left: ${props => props.$sender === 'jarvis' ? '0' : 'auto'};
  margin-right: ${props => props.$sender === 'jarvis' ? 'auto' : '0'};
  
  img {
    max-width: 200px;
    border-radius: 0.5rem;
    margin-top: 0.5rem;
  }

  ul, ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.6;
  }

  p {
    margin: 0.75rem 0;
    line-height: 1.6;
  }

  strong, b {
    color: ${props => props.$sender === 'jarvis' ? '#60a5fa' : '#ffffff'};
    font-weight: 600;
  }

  h1, h2, h3, h4 {
    margin: 1.5rem 0 1rem 0;
    font-weight: 600;
    line-height: 1.4;
  }

  h1 { font-size: 1.5rem; }
  h2 { font-size: 1.25rem; }
  h3 { font-size: 1.1rem; }
  h4 { font-size: 1rem; }

  blockquote {
    border-left: 4px solid ${props => props.$sender === 'jarvis' ? '#60a5fa' : '#ffffff'};
    margin: 1rem 0;
    padding: 0.5rem 0 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.25rem;
  }

  code {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-family: monospace;
    font-size: 0.9em;
  }

  pre {
    background: rgba(255, 255, 255, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;
    margin: 1rem 0;
    
    code {
      background: none;
      padding: 0;
    }
  }
  
  ${props => props.$isLoading && `
    &::after {
      content: '';
      display: inline-block;
      width: 10px;
      margin-left: 4px;
      animation: ellipsis 1.5s infinite;
    }
  `}
`;

const InputContainer = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #2d2d2d;
  align-items: center;
  border-radius: 8px;
  margin-top: 1rem;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: none;
  background: #404040;
  color: white;
  font-size: 16px;
  
  &:focus {
    outline: none;
    background: #4a4a4a;
  }
`;

const SendButton = styled(motion.button)`
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  &:disabled {
    background: #404040;
    cursor: not-allowed;
  }
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.$sender === 'jarvis' ? 'rgba(230, 230, 250, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
  display: block;
  margin-top: 5px;
  text-align: ${props => props.$sender === 'jarvis' ? 'left' : 'right'};
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const EmptyStateImage = styled.img`
  max-width: 200px;
  height: auto;
  opacity: 0.8;
`;

const MessageText = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 1rem;
  color: ${props => props.$sender === 'jarvis' ? '#e5e7eb' : '#ffffff'};

  // Add these new styles for table-like formatting
  table {
    border-collapse: collapse;
    width: 100%;
    margin: 10px 0;
  }

  tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  td {
    padding: 8px 4px;
  }

  // Style for the value after colon
  .response-value {
    color: #60a5fa;
    padding-left: 8px;
  }
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 8px;
  background-color: ${({ isUser }) => 
    isUser ? 'rgba(147, 112, 219, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${({ isUser }) => 
    isUser ? 'rgba(147, 112, 219, 0.3)' : 'rgba(255, 255, 255, 0.2)'};
  color: #E6E6FA;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ImagePreview = styled.img`
  max-width: 200px;
  max-height: 200px;
  margin: 10px 0;
  border-radius: 8px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const BoundingBox = styled.div`
  position: absolute;
  border: 2px solid #9370DB;
  background-color: rgba(147, 112, 219, 0.2);
  pointer-events: none;
`;

const ImageContainer = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 150px;
  height: auto;
  opacity: 0.8;
  transition: all 0.3s ease;
`;

const VersionText = styled.div`
  position: absolute;
  color: rgba(30, 144, 255, 0.8);
  font-weight: bold;
  font-size: ${props => props.$isExpanded ? '1.2rem' : '0.9rem'};
  top: 20px;
  left: 20px;
  transform: none;
  z-index: 10;
  text-shadow: 
    0 0 10px rgba(30, 144, 255, 0.4),
    0 0 20px rgba(30, 144, 255, 0.2);
  pointer-events: none;
  opacity: 1;
  user-select: none;
`;

const ImageUploadButton = styled(IconButton)`
  color: rgba(147, 112, 219, 0.8);
  padding: 8px;
  
  &:hover {
    color: #9370DB;
  }
`;

const ImagePreviewContainer = styled.div`
  position: fixed;
  bottom: 100px;
  left: 20px;
  max-width: 150px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 50;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const FloatingLetter = styled.span`
  position: absolute;
  color: #1E90FF;
  font-size: 1.5rem;
  pointer-events: none;
  position: fixed;
  z-index: 9999;
  text-shadow: 0 0 8px rgba(30, 144, 255, 0.8);
  opacity: 0.8;
  transition: all 1s ease;
  transform-origin: center;

  @keyframes floatToReactor {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(
        ${props => props.targetX}px,
        ${props => props.targetY}px
      ) scale(0.1);
      opacity: 0;
    }
  }

  animation: floatToReactor 1s forwards;
`;

const FloatingImage = styled.img`
  position: absolute;
  width: 50px;
  height: 50px;
  object-fit: cover;
  pointer-events: none;
  position: fixed;
  z-index: 9999;
  box-shadow: 0 0 8px rgba(30, 144, 255, 0.8);
  border-radius: 8px;
  animation: floatToReactor 1s forwards;

  @keyframes floatToReactor {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(
        ${props => props.targetX}px,
        ${props => props.targetY}px
      ) scale(0.1);
      opacity: 0;
    }
  }
`;

const DropZone = styled.div`
  border: 2px dashed rgba(147, 112, 219, 0.3);
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  background: rgba(75, 0, 130, 0.2);
  transition: all 0.3s ease;
  cursor: pointer;
  margin: 20px 0;
  
  ${props => props.$isDragActive && `
    border-color: rgba(147, 112, 219, 0.8);
    background: rgba(75, 0, 130, 0.4);
  `}

  &:hover {
    border-color: rgba(147, 112, 219, 0.6);
    background: rgba(75, 0, 130, 0.3);
  }
`;

const formatAIResponse = (text) => {
  return text
    .replace(/\*\*/g, '')
    .replace(/\n\*/g, '\n')
    .split('\n').map((line, index, array) => {
      if (line.trim().endsWith(':') && index < array.length - 1) {
        return line + '\n';
      }
      return line;
    }).join('\n');
};

const getApiKeys = () => {
  return GEMINI_API_KEYS;
};

const getJarvisIdentity = () => {
  const userProfile = localStorage.getItem('user_profile');
  const profile = userProfile ? JSON.parse(userProfile) : null;
  
  if (!profile) return '';
  
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

// Add this helper function at the top of your file, outside the component
const safeLocalStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      // If quota exceeded, clear old messages and try again
      if (e.name === 'QuotaExceededError' || e.name === 'QUOTA_EXCEEDED_ERR') {
        localStorage.clear();
        try {
          localStorage.setItem(key, value);
        } catch (innerError) {
          console.error('Failed to save to localStorage even after clearing:', innerError);
        }
      }
    }
  },
  getItem: (key) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Failed to get from localStorage:', e);
      return null;
    }
  }
};

// Add this styled component for the image preview
const ImagePreviewCorner = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
`;

const PreviewImage = styled.img`
  max-width: 150px;
  max-height: 150px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(147, 112, 219, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
    border-color: rgba(147, 112, 219, 0.8);
  }
`;

const MessageContainer = styled.div`
  position: relative;
  padding: 12px 16px;
  border-radius: 8px;
  margin: 8px 0;
  max-width: 80%;
  background: ${props => props.$sender === 'Jarvis' ? 'rgba(75, 0, 130, 0.2)' : 'rgba(147, 112, 219, 0.2)'};
  
  &:hover .copy-button {
    opacity: 1;
  }
`;

const CopyButton = styled(IconButton)`
  position: absolute;
  top: 8px;
  right: 8px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const BackButton = styled(motion.button)`
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 1000;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 16px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  background: rgba(147, 112, 219, 0.2);
  border: 1px solid rgba(147, 112, 219, 0.3);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #E6E6FA;
  font-size: 18px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(147, 112, 219, 0.4);
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

// Update the ClearChatButton styling with fixed positioning and better hover effects
const ClearChatButton = styled(motion.button)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  z-index: 1000;
  padding: 8px 16px;
  border-radius: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const RATE_LIMIT_DELAY = 1000; // 1 second

const rateLimitedSendMessage = async (chat, messageParts) => {
  await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  return chat.sendMessage(messageParts);
};

const formatTableResponse = (text) => {
  if (!text.includes(':')) return text;

  const lines = text.split('\n');
  return lines.map(line => {
    if (line.includes(':')) {
      const [label, value] = line.split(':').map(part => part.trim());
      return `<tr><td>${label}:</td><td class="response-value">${value}</td></tr>`;
    }
    return line;
  }).join('\n');
};

const formatNewContent = (request) => {
  // Check if request is an array
  if (!Array.isArray(request)) {
    console.error('Expected request to be an array, but got:', request);
    return []; // Return an empty array or handle the error as needed
  }

  // Proceed with the operation if request is an array
  return request.map(item => {
    // Your logic here
  });
};

const OldJarvis = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am JARVIS. How can I assist you today?'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [chatInstance, setChatInstance] = useState(null);
  const [currentApiKey, setCurrentApiKey] = useState(null);
  const [streamingText, setStreamingText] = useState('');
  const [boundingBoxes, setBoundingBoxes] = useState([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [currentImageData, setCurrentImageData] = useState(null);
  const [floatingLetters, setFloatingLetters] = useState([]);
  const [floatingImages, setFloatingImages] = useState([]);
  const letterCounter = useRef(0);
  const imageCounter = useRef(0);
  const inputRef = useRef(null);
  const arcReactorRef = useRef(null);

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const [chatHistory, setChatHistory] = useState([]);

  const [isGenerating, setIsGenerating] = useState(false);

  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);

  const [apiKeyStatus, setApiKeyStatus] = useState({
    current: 0,
    total: GEMINI_API_KEYS.length,
    exhausted: []
  });

  const [profile] = useState(() => {
    try {
      const saved = localStorage.getItem('user_profile');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading profile:', error);
      return null;
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(prev => !prev);
  };

  const generateSystemPrompt = () => {
    if (!profile) return '';

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

  useEffect(() => {
    const setupChat = async () => {
      const apiKeys = getApiKeys();
      
      for (const apiKey of apiKeys) {
        try {
          const chat = await initializeChat(apiKey);
          setChatInstance(chat);
          setCurrentApiKey(apiKey);
          console.log(`Successfully initialized with API key ending in ...${apiKey.slice(-4)}`);
          return;
        } catch (error) {
          continue;
        }
      }
      
      console.error('All API keys failed to initialize');
    };

    setupChat();
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const scrollContainer = messagesContainerRef.current;
      const scrollHeight = scrollContainer.scrollHeight;
      const height = scrollContainer.clientHeight;
      const maxScroll = scrollHeight - height;
      
      scrollContainer.scrollTo({
        top: maxScroll,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only image files (JPEG, PNG, WEBP, HEIC, HEIF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSelectedImage(file);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input value to allow the same file to be selected again
    event.target.value = '';
  };

  const fileToGenerativePart = async (file) => {
    const base64Data = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    return {
      inlineData: {
        data: base64Data,
        mimeType: file.type
      }
    };
  };

  const detectBoundingBoxes = async (image) => {
    try {
      const imagePart = await fileToGenerativePart(image);
      const result = await chatInstance.sendMessage([
        imagePart,
        "Return bounding box coordinates for all visible objects in the format: [object_name, ymin, xmin, ymax, xmax]. Only return the coordinates, no other text."
      ]);
      
      const response = result.response.text();
      const coordinates = response.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [name, ymin, xmin, ymax, xmax] = line.split(',').map(val => val.trim());
          return {
            name,
            coords: {
              top: parseFloat(ymin) * imageSize.height,
              left: parseFloat(xmin) * imageSize.width,
              height: (parseFloat(ymax) - parseFloat(ymin)) * imageSize.height,
              width: (parseFloat(xmax) - parseFloat(xmin)) * imageSize.width
            }
          };
        });
      
      setBoundingBoxes(coordinates);
    } catch (error) {
      console.error('Error detecting objects:', error);
      setBoundingBoxes([]); // Reset on error
    }
  };

  const handleImageLoad = (event) => {
    const newSize = {
      width: event.target.width,
      height: event.target.height
    };
    setImageSize(newSize);
    
    // If we have a current image, detect boxes after size is set
    if (currentImageData?.file) {
      detectBoundingBoxes(currentImageData.file);
    }
  };

  const streamResponse = async (messageParts) => {
    try {
        setStreamingText('');

        let messageToSend = messageParts.map(part => {
            if (part.text) return part.text;
            if (part.inlineData) return "[Image]";
             return "";
        }).join(" ");

        // Add delay if there was a recent API call
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay


        const result = await chatInstance.sendMessage(messageToSend);
         const responseText = result.response.text();

        const newMessage = {
            sender: 'Jarvis',
            text: responseText
        };
         setMessages(prev => [...prev, newMessage]);
        setStreamingText('');


    } catch (error) {
         console.error('Error in chat response:', error);
        if (error.message.includes('429')) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                return await streamResponse(messageParts);
            } catch (retryError) {
                setMessages(prev => [...prev, {
                    sender: 'Jarvis',
                    text: 'I apologize, but I am currently experiencing high traffic. Please try again in a moment.'
               }]);
            }
        } else {
            setMessages(prev => [...prev, {
                sender: 'Jarvis',
                text: 'I apologize, but I encountered an error. Please try again.'
            }]);
        }
   }
};

  const sendMessage = async () => {
    if ((!inputValue.trim() && !selectedImage) || isLoading) return;
    
    setIsLoading(true);
    setIsGenerating(true);
    
    try {
      // Get user profile
      const userProfile = localStorage.getItem('user_profile');
      const profile = userProfile ? JSON.parse(userProfile) : null;

      if (!profile) {
        throw new Error('Profile not found. Please set up your profile in settings first.');
      }

      // Format the profile context
      const childrenInfo = profile.children && profile.children.length > 0
        ? profile.children.map(child => 
            `${child.name} (${child.age}, ${child.gender})`
          ).join(', ')
        : 'no children';

      // Create the context message
      const contextPrompt = `You are ${profile.name}, a ${profile.age}-year-old ${profile.gender} ${profile.occupation} 
      living in ${profile.city}, ${profile.state}. You're married to ${profile.spouse} with ${childrenInfo}.
      
      Rules:
      1. ALWAYS respond in first person as ${profile.name}
      2. NEVER mention being an AI
      3. Give direct, personal answers
      4. Use natural language
      5. Keep responses concise
      
      Question: ${inputValue}
      
      Remember to answer as ${profile.name} in first person.`;

      // Add user message to chat history
      setMessages(prev => [...prev, {
        sender: 'You',
        content: inputValue,
        image: imagePreview
      }]);

      // Prepare message parts
      let messageParts = [{ text: contextPrompt }];
      
      if (selectedImage) {
        const imagePart = await fileToGenerativePart(selectedImage);
        messageParts.push(imagePart);
      }

      // Add loading message
      setMessages(prev => [...prev, {
        sender: 'jarvis',
        content: '...',
        isLoading: true
      }]);

      // Send message
      const result = await chatInstance.sendMessage(messageParts);
      const response = result.response.text();
      
      // Update messages
      setMessages(prev => prev.filter(msg => !msg.isLoading).concat({
        sender: 'jarvis',
        content: response
      }));

      // Clear input and image
      setInputValue('');
      setSelectedImage(null);
      setImagePreview(null);
      setStreamingText('');

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => prev.filter(msg => !msg.isLoading).concat({
        sender: 'jarvis',
        content: error.message.includes('Profile not found') 
          ? 'Please set up your profile in settings before chatting.'
          : 'I apologize, but I encountered an error. Please try again.'
      }));
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [chatRef]);

  // Auto-focus input when dialog opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Clear chat and reinitialize
  const clearMessages = async () => {
    setMessages([]);
    setChatHistory([]);
    setStreamingText('');
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    
    // Reinitialize chat with fresh context
    if (currentApiKey) {
      await initializeChat(currentApiKey);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length > inputValue.length && isExpanded) {
      const newLetter = value[value.length - 1];
      
      // Get the dialog container
      const dialogContainer = document.querySelector('.MuiDialog-paper');
      
      if (dialogContainer) {
        // Get dialog dimensions
        const dialogRect = dialogContainer.getBoundingClientRect();
        
        // Fixed start position at the input area, regardless of cursor position
        const startX = dialogRect.width / 2;  // Start from middle width
        const startY = dialogRect.height - 80; // Fixed position above input

        const newFloatingLetter = {
          id: letterCounter.current++,
          letter: newLetter,
          startX,
          startY,
          targetX: 0,  // No horizontal movement needed since starting from center
          targetY: -(dialogRect.height / 2) + 80  // Move up to center
        };

        setFloatingLetters(prev => [...prev, newFloatingLetter]);

        setTimeout(() => {
          setFloatingLetters(prev => 
            prev.filter(letter => letter.id !== newFloatingLetter.id)
          );
        }, 1000);
      }
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    if (file) {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload only image files (JPEG, PNG, GIF, WEBP)');
        return;
      }

      // Check file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setSelectedImage(file);
        setCurrentImageData({
          file: file,
          preview: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    noClick: true, // Prevents clicking on container to open file dialog
    noKeyboard: true // Disables keyboard interaction
  });

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Message copied to clipboard!'
    });
  };

  useEffect(() => {
    const initChat = async () => {
      if (!chatInstance && GEMINI_API_KEYS.length > 0) {
        await initializeChat(GEMINI_API_KEYS[0]);
      }
    };
    
    initChat();
  }, []); // Empty dependency array for initial load only

  useEffect(() => {
    if (messages.length > 0) {
      safeLocalStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  return (
    <ChatContainer 
      $isExpanded={isExpanded} 
      $isDragActive={isDragActive}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      
      {/* Image Preview Corner */}
      {imagePreview && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
        >
          <ImagePreviewCorner>
            <div style={{ position: 'relative' }}>
              <PreviewImage 
                src={imagePreview} 
                alt="Upload preview" 
              />
              <RemoveImageButton
                onClick={(e) => {
                  e.stopPropagation();
                  setImagePreview(null);
                  setSelectedImage(null);
                  setCurrentImageData(null);
                }}
              >
                ×
              </RemoveImageButton>
            </div>
          </ImagePreviewCorner>
        </motion.div>
      )}

      <VersionText $isExpanded={isExpanded}>Jarvis v4.0</VersionText>
      <ArcReactorCore 
        className="arc-reactor-core" 
        $isExpanded={isExpanded} 
        ref={arcReactorRef}
        onClick={toggleExpanded}
      />
      
      {/* Only render floating letters in expanded view */}
      {isExpanded && document.querySelector('.MuiDialog-paper') && floatingLetters.map(letter => (
        <FloatingLetter
          key={letter.id}
          targetX={letter.targetX}
          targetY={letter.targetY}
          style={{
            left: `${letter.startX}px`,
            top: `${letter.startY}px`,
          }}
        >
          {letter.letter}
        </FloatingLetter>
      ))}

      <MessagesContainer ref={messagesContainerRef}>
        {messages.map((message, index) => {
          const sender = message.sender?.toLowerCase() || (message.isUser ? 'user' : 'jarvis');
          return (
            <MessageBubble 
              key={index} 
              $sender={sender} 
              $isLoading={message.isLoading}
            >
              <MessageText $sender={sender}>
                {message.content}
              </MessageText>
              {/* Only show image in message if it's part of the chat history */}
              {message.image && message.sender && (
                <img 
                  src={message.image} 
                  alt="Uploaded content" 
                  style={{ maxWidth: '200px', borderRadius: '0.5rem', marginTop: '0.5rem' }}
                />
              )}
              <MessageTime $sender={sender}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </MessageTime>
            </MessageBubble>
          );
        })}
        {streamingText && (
          <MessageBubble $sender="jarvis">
            <div style={{ position: 'relative' }}>
              {streamingText}
              <Tooltip title="Copy message">
                <CopyButton 
                  className="copy-button"
                  onClick={() => handleCopy(streamingText)}
                  size="small"
                >
                  <ContentCopyIcon fontSize="small" />
                </CopyButton>
              </Tooltip>
            </div>
          </MessageBubble>
        )}
      </MessagesContainer>
      
      <InputContainer>
        <HiddenInput
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          key={selectedImage ? 'has-image' : 'no-image'}
        />
        <ImageUploadButton
          onClick={() => fileInputRef.current.click()}
          disabled={isLoading}
          title="Upload image"
        >
          <ImageIcon />
        </ImageUploadButton>
        <StyledInput
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        <SendButton onClick={sendMessage} disabled={isLoading}>
          <span>Send</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </SendButton>
      </InputContainer>
      {isExpanded && messages.length > 0 && (
        <ClearButton onClick={clearMessages}>
          Clear Chat
        </ClearButton>
      )}

      {isExpanded && document.querySelector('.MuiDialog-paper') && floatingImages.map(image => (
        <FloatingImage
          key={image.id}
          src={image.src}
          targetX={image.targetX}
          targetY={image.targetY}
          style={{
            left: `${image.startX}px`,
            top: `${image.startY}px`,
          }}
        />
      ))}

      {/* Add this for visual feedback during drag (optional) */}
      {isDragActive && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(147, 112, 219, 0.1)',
              zIndex: 10,
              pointerEvents: 'none'
            }}
          />
        </AnimatePresence>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity="success" 
          sx={{ 
            background: 'rgba(147, 112, 219, 0.9)',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ClearChatButton
        onClick={clearMessages}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <DeleteSweepIcon />
        <span>Clear Chat</span>
      </ClearChatButton>

      <BackButton
        onClick={() => window.location.href = '/'}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowBackIcon />
        <span>Back</span>
      </BackButton>
    </ChatContainer>
  );
};

export default OldJarvis;