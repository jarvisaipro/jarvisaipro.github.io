import React from 'react';
import { motion } from 'framer-motion';

const HolographicBackground = () => {
  return (
    <div className="holographic-container">
      <div className="holographic-grid">
        {[...Array(100)].map((_, index) => (
          <motion.div
            key={index}
            className="grid-item"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      <div className="holographic-overlay" />
    </div>
  );
};

export default HolographicBackground; 