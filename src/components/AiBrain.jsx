import React from 'react';
import { motion } from 'framer-motion';

const AiBrain = () => {
  return (
    <div className="brain-background">
      <motion.div
        className="brain-animation"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#00ff88"
            d="M40.7,-62.9C51.9,-55.4,59.5,-42.7,65.7,-29.1C71.9,-15.5,76.7,-1.1,74.3,12.1C71.9,25.2,62.3,37.1,51.1,46.3C39.9,55.5,27.1,62.1,13.1,65.9C-0.9,69.7,-16.1,70.8,-29.4,66.1C-42.7,61.4,-54.1,50.9,-62.3,37.8C-70.5,24.7,-75.5,9,-73.2,-5.4C-70.8,-19.8,-61.1,-32.8,-49.7,-40.8C-38.3,-48.8,-25.2,-51.8,-12.3,-57.1C0.6,-62.5,13.5,-70.2,26.8,-71.1C40.2,-72,53.9,-66.1,40.7,-62.9Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default AiBrain; 