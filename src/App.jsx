import React, { useState, useEffect } from 'react';
import Chat from './components/Chat';
import OldJarvis from './components/OldJarvis';
import PasswordProtection from './components/PasswordProtection';
import { motion } from 'framer-motion';
import { RiRobot2Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { FaRobot, FaMoon, FaSun, FaTrash } from 'react-icons/fa';
import Settings from './components/Settings';
import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <PasswordProtection onAuthenticated={setIsAuthenticated} />;
  }

  if (currentPage === 'oldJarvis') {
    return <OldJarvis onBack={() => setCurrentPage('home')} />;
  }

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="floating-elements">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-element"
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <header className="top-header">
        <motion.div 
          className="logo-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <RiRobot2Line className="logo-icon" />
          <div className="title-container">
            <span className="logo-text">Jarvis</span>
            <span className="pro-badge">PRO</span>
          </div>
        </motion.div>
        
        <div className="header-buttons">
          <Settings />
          
          <motion.button
            className="old-jarvis-button"
            onClick={() => setCurrentPage('oldJarvis')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaRobot className="old-jarvis-icon" />
            <span>Old Jarvis</span>
          </motion.button>

          <motion.button
            className="old-jarvis-button"
            onClick={() => {
              const event = new CustomEvent('clearChat');
              window.dispatchEvent(event);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTrash size={16} />
            <span>Clear Chat</span>
          </motion.button>

          <motion.button
            className="dark-mode-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#fff',
              gap: '8px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              minWidth: '40px',
              height: '40px'
            }}
          >
            {isDarkMode ? 
              <FaSun size={20} /> :
              <FaMoon size={20} />
            }
          </motion.button>

          <motion.button
            className="logout-button"
            onClick={() => {
              localStorage.removeItem('isAuthenticated');
              setIsAuthenticated(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RiLogoutBoxRLine className="logout-icon" />
            <span className="logout-text">Logout</span>
          </motion.button>
        </div>
      </header>

      <main className="main-container">
        <Chat />
      </main>
    </div>
  );
};

export default App;