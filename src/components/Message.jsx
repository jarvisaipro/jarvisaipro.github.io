import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import DOMPurify from 'dompurify';

const Message = ({ message }) => {
  const formatMessageContent = (content) => {
    const formattedContent = content
      .replace(/\n/g, "<br />")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>");

    return DOMPurify.sanitize(formattedContent);
  };

  return (
    <motion.div
      className={`message-box ${message.role}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`message-avatar ${message.role}-avatar`}>
        {message.role === 'user' ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatMessageContent(message.content) }}
        />
      </div>
    </motion.div>
  );
};

Message.propTypes = {
  message: PropTypes.shape({
    role: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired
};

export default Message; 