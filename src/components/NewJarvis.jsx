import React from 'react';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';
import styled from 'styled-components';

const MessageText = styled.div`
  white-space: pre-wrap;
  line-height: 1.6;
  font-size: 1rem;
  color: ${props => props.$sender === 'jarvis' ? '#e5e7eb' : '#ffffff'};

  // Updated table styles for boxed look
  table {
    border-collapse: separate;
    border-spacing: 4px;
    width: 100%;
    margin: 10px 0;
  }

  tr {
    margin-bottom: 4px;
  }

  td {
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  // Style for the value after colon
  .response-value {
    color: #60a5fa;
    font-weight: 500;
  }
`;

const formatTableResponse = (text) => {
  if (!text.includes(':')) return text;

  const lines = text.split('\n');
  return lines.map(line => {
    if (line.includes(':')) {
      const [label, value] = line.split(':').map(part => part.trim());
      return `<tr>
        <td>${label}:</td>
        <td class="response-value">${value}</td>
      </tr>`;
    }
    return line;
  }).join('\n');
};

const NewJarvis = () => {
  const handleBack = () => {
    window.location.href = '/jarvis';
  };

  return (
    <div className="new-jarvis-container">
      <motion.button
        className="back-button"
        onClick={handleBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <IoArrowBack className="back-icon" />
        <span className="back-text">Back</span>
      </motion.button>
      
      {/* Content will be added later */}
      <div className="blank-content">
        {/* Placeholder for future content */}
      </div>
    </div>
  );
};

export default NewJarvis; 