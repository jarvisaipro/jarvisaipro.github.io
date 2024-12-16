import React from 'react';
import { motion } from 'framer-motion';
import { IoArrowBack } from 'react-icons/io5';

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