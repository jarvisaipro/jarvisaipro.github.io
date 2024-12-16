import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RiLockLine, RiShieldCheckLine, RiErrorWarningLine } from 'react-icons/ri';
import { FaFacebook } from 'react-icons/fa';

const errorThemes = [
  {
    message: "🚫 Access denied! Even my pet robot is laughing at this attempt!",
    background: "linear-gradient(45deg, #200122 0%, #6f0000 100%)",
    overlay: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWUxYjFiIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4YjAwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')",
    animation: "gradient"
  },
  {
    message: "💀 That password is scarier than a programmer without coffee!",
    background: "linear-gradient(135deg, #000000, #434343)",
    overlay: "repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)",
    animation: "matrix"
  },
  {
    message: "👻 BOO! Wrong password! Did I scare you? Because you scared me with that attempt!",
    background: "linear-gradient(to right, #000000, #434343)",
    overlay: "radial-gradient(circle, transparent 20%, #000 20%, #000 80%, transparent 80%, transparent)",
    animation: "ghost"
  },
  {
    message: "🎭 Plot twist: That's not the password! *dramatic thunder*",
    background: "linear-gradient(45deg, #3f0d12 0%, #a71d31 74%)",
    overlay: "linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)",
    animation: "thunder"
  },
  {
    message: "🌋 ALERT: Password so wrong it triggered a digital volcano!",
    background: "linear-gradient(45deg, #f85032, #e73827)",
    overlay: "repeating-radial-gradient(circle at 50% 50%, #000 0, #000 1px, transparent 1px, transparent 100%)",
    animation: "lava"
  },
  {
    message: "🕷️ Error 404: Password correct... just kidding! The spiders got you!",
    background: "linear-gradient(to bottom, #090909, #000000)",
    overlay: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDhMOCAwWk04IDhMMCAwWiIgc3Ryb2tlPSIjMjIyIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')",
    animation: "spiders"
  },
  {
    message: "🧟 BRAAAINS... I mean, WROOOONG! Try again, mortal!",
    background: "linear-gradient(45deg, #1a2a6c, #b21f1f, #fdbb2d)",
    overlay: "repeating-linear-gradient(45deg, #000 0, #000 2px, transparent 2px, transparent 4px)",
    animation: "zombie"
  },
  {
    message: "⚡ By the power of wrong passwords, I banish thee!",
    background: "linear-gradient(to right, #000046, #1cb5e0)",
    overlay: "radial-gradient(circle, #fff 1px, transparent 1px)",
    animation: "lightning"
  },
  {
    message: "🎪 Welcome to the Circus of Wrong Passwords - you're the star act!",
    background: "linear-gradient(45deg, #fc466b, #3f5efb)",
    overlay: "repeating-conic-gradient(from 0deg, #000 0deg 10deg, transparent 10deg 20deg)",
    animation: "circus"
  },
  {
    message: "🌑 Dark side rejected your application. Try another password!",
    background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
    overlay: "radial-gradient(circle at 50% 50%, #fff 1px, transparent 1px)",
    animation: "darkside"
  },
  {
    message: "🔮 The crystal ball says: 'Not even close!'",
    background: "linear-gradient(45deg, #654ea3, #eaafc8)",
    overlay: "radial-gradient(circle at 30% 30%, #fff 1px, transparent 1px)",
    animation: "crystal"
  },
  {
    message: "🎭 Your password performance gets two thumbs down!",
    background: "linear-gradient(to right, #870000, #190a05)",
    overlay: "repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 5px)",
    animation: "theater"
  },
  {
    message: "🌪️ A tornado of nope just swept through!",
    background: "linear-gradient(45deg, #000428, #004e92)",
    overlay: "conic-gradient(from 0deg at 50% 50%, #000 0deg, transparent 60deg, #000 120deg)",
    animation: "tornado"
  },
  {
    message: "🕯️ The ghost of rejected passwords haunts you!",
    background: "linear-gradient(to bottom, #232526, #414345)",
    overlay: "radial-gradient(circle at 50% 50%, #fff 1px, transparent 3px)",
    animation: "ghost"
  }
];

const successThemes = [
  {
    message: "🎉 Woohoo! You've unlocked the digital treasure chest!",
    background: "linear-gradient(135deg, #00f260, #0575e6)",
    overlay: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)",
    animation: "celebrate"
  },
  {
    message: "🚀 Houston, we have access! Prepare for awesomeness!",
    background: "linear-gradient(45deg, #1f4037, #99f2c8)",
    overlay: "repeating-linear-gradient(45deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 2px, transparent 2px, transparent 4px)",
    animation: "launch"
  },
  {
    message: "🌟 Welcome aboard the AI Express! Next stop: Innovation Station!",
    background: "linear-gradient(to right, #4facfe, #00f2fe)",
    overlay: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 1px, transparent 1px)",
    animation: "sparkle"
  },
  {
    message: "🎯 Bullseye! You've cracked the code like a pro!",
    background: "linear-gradient(45deg, #2af598, #009efd)",
    overlay: "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(255,255,255,0.2) 360deg)",
    animation: "target"
  },
  {
    message: "🎨 Access granted! Time to paint the digital canvas!",
    background: "linear-gradient(to right, #00b4db, #0083b0)",
    overlay: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.1) 0deg 10deg, transparent 10deg 20deg)",
    animation: "paint"
  },
  {
    message: "🌈 Password perfect! Unleashing the rainbow of possibilities!",
    background: "linear-gradient(45deg, #ff0099, #00ff99)",
    overlay: "linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%)",
    animation: "rainbow"
  },
  {
    message: "⚡ Power unlocked! Your digital adventure awaits!",
    background: "linear-gradient(135deg, #0061ff, #60efff)",
    overlay: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 1px, transparent 2px)",
    animation: "power"
  },
  {
    message: "🎮 Game on! Level: AI Assistant unlocked!",
    background: "linear-gradient(45deg, #11998e, #38ef7d)",
    overlay: "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 5px)",
    animation: "game"
  },
  {
    message: "🔮 The crystal ball was right - you ARE the chosen one!",
    background: "linear-gradient(to right, #4776e6, #8e54e9)",
    overlay: "radial-gradient(circle at 70% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)",
    animation: "magic"
  },
  {
    message: "🎪 Welcome to the greatest show in AI town!",
    background: "linear-gradient(45deg, #00c6ff, #0072ff)",
    overlay: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.1) 0deg 15deg, transparent 15deg 30deg)",
    animation: "show"
  }
];

const PasswordProtection = ({ onAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validPasswords = ['trevuj123', 'towhid3d', 'mukut3d'];

  const getRandomErrorTheme = () => {
    return errorThemes[Math.floor(Math.random() * errorThemes.length)];
  };

  const getRandomSuccessTheme = () => {
    return successThemes[Math.floor(Math.random() * successThemes.length)];
  };

  const [currentErrorTheme, setCurrentErrorTheme] = useState(null);
  const [currentSuccessTheme, setCurrentSuccessTheme] = useState(null);

  const getRandomMessage = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (validPasswords.includes(password)) {
      const theme = getRandomSuccessTheme();
      setCurrentSuccessTheme(theme);
      setShowSuccess(true);
      setTimeout(() => {
        localStorage.setItem('isAuthenticated', 'true');
        onAuthenticated(true);
      }, 2000);
    } else {
      const theme = getRandomErrorTheme();
      setCurrentErrorTheme(theme);
      setError(theme.message);
      setIsChecking(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="password-protection"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: showSuccess ? currentSuccessTheme?.background : 
                    error ? currentErrorTheme?.background : 
                    'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
          backgroundSize: (showSuccess || error) ? '400% 400%' : '100% 100%',
          animation: showSuccess ? `${currentSuccessTheme?.animation} 15s ease infinite` :
                    error ? `${currentErrorTheme?.animation} 15s ease infinite` : 'none',
          transition: 'all 0.5s ease'
        }}
      >
        {(showSuccess || error) && (
          <motion.div
            className="theme-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ duration: 0.5, repeat: 3 }}
            style={{
              backgroundImage: showSuccess ? currentSuccessTheme?.overlay : currentErrorTheme?.overlay
            }}
          />
        )}
        
        <div className="password-container">
          <motion.div
            className="lock-icon-wrapper"
            animate={{
              scale: isChecking ? [1, 1.1, 1] : 1,
              rotate: isChecking ? [0, 360] : 0,
            }}
            transition={{ duration: 1, repeat: isChecking ? Infinity : 0 }}
          >
            {showSuccess ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <RiShieldCheckLine className="lock-icon success" />
              </motion.div>
            ) : error ? (
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <RiErrorWarningLine className="lock-icon error" />
              </motion.div>
            ) : (
              <RiLockLine className="lock-icon" />
            )}
          </motion.div>

          {showSuccess ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-message"
            >
              <h2>{currentSuccessTheme?.message}</h2>
              <p>Preparing your AI adventure... 🚀</p>
            </motion.div>
          ) : (
            <>
              <h2 className="security-title">Security Verification</h2>
              <p className="security-subtitle">Enter security key to access the AI Assistant</p>

              <motion.form 
                onSubmit={handleSubmit} 
                className="security-form"
                animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <div className="input-wrapper">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security key"
                    className={`password-input ${error ? 'error' : ''}`}
                    disabled={isChecking}
                  />
                  {error && (
                    <motion.div 
                      className="error-message"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isChecking}
                >
                  {isChecking ? 'Verifying...' : 'Verify Access'}
                </motion.button>
              </motion.form>
            </>
          )}

          <div className="contact-section">
            <p className="contact-text">
              Want your custom AI assistant? Contact us for personalized solutions.
            </p>
            <motion.a
              href="https://www.facebook.com/professorrehan"
              target="_blank"
              rel="noopener noreferrer"
              className="facebook-link"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaFacebook className="facebook-icon" />
              <span>Contact Professor Rehan</span>
            </motion.a>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const additionalStyles = `
  @keyframes gradient {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }

  @keyframes matrix {
    0% { transform: translateY(0) }
    100% { transform: translateY(-20px) }
  }

  @keyframes ghost {
    0% { opacity: 0.3 }
    50% { opacity: 0.7 }
    100% { opacity: 0.3 }
  }

  @keyframes thunder {
    0% { filter: brightness(1) }
    50% { filter: brightness(1.5) }
    100% { filter: brightness(1) }
  }

  @keyframes lava {
    0% { filter: hue-rotate(0deg) }
    100% { filter: hue-rotate(360deg) }
  }

  @keyframes spiders {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }

  @keyframes zombie {
    0% { filter: saturate(100%) }
    50% { filter: saturate(200%) }
    100% { filter: saturate(100%) }
  }

  @keyframes lightning {
    0% { filter: brightness(1) }
    50% { filter: brightness(2) }
    100% { filter: brightness(1) }
  }

  @keyframes circus {
    0% { transform: scale(1) }
    50% { transform: scale(1.1) }
    100% { transform: scale(1) }
  }

  @keyframes darkside {
    0% { filter: contrast(100%) }
    50% { filter: contrast(200%) }
    100% { filter: contrast(100%) }
  }

  @keyframes crystal {
    0% { filter: blur(0px) }
    50% { filter: blur(1px) }
    100% { filter: blur(0px) }
  }

  @keyframes theater {
    0% { transform: skewX(0deg) }
    50% { transform: skewX(2deg) }
    100% { transform: skewX(0deg) }
  }

  @keyframes tornado {
    0% { transform: rotate(0deg) }
    100% { transform: rotate(360deg) }
  }

  .scary-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjOWUxYjFiIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4YjAwMDAiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=');
    pointer-events: none;
    z-index: 1;
  }

  .error-message {
    color: #ff4b4b;
    text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
    animation: flicker 0.5s ease-in-out infinite alternate;
  }

  @keyframes flicker {
    0% { opacity: 0.8; }
    100% { opacity: 1; }
  }

  .password-input.error {
    border-color: #ff4b4b;
    box-shadow: 0 0 10px #ff0000;
    animation: shake 0.5s ease-in-out, glow 1s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      box-shadow: 0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000;
    }
    to {
      box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
    }
  }

  .lock-icon.error {
    color: #ff4b4b;
    text-shadow: 0 0 10px #ff0000;
    animation: pulse 1s ease-in-out infinite;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }

  @keyframes celebrate {
    0%, 100% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
  }

  @keyframes launch {
    0% { transform: translateY(0) }
    50% { transform: translateY(-10px) }
    100% { transform: translateY(0) }
  }

  @keyframes sparkle {
    0% { filter: brightness(1) }
    50% { filter: brightness(1.3) }
    100% { filter: brightness(1) }
  }

  @keyframes target {
    0% { transform: scale(1) rotate(0deg) }
    50% { transform: scale(1.1) rotate(180deg) }
    100% { transform: scale(1) rotate(360deg) }
  }

  @keyframes paint {
    0% { filter: hue-rotate(0deg) }
    100% { filter: hue-rotate(360deg) }
  }

  @keyframes rainbow {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }

  @keyframes power {
    0% { filter: brightness(1) contrast(1) }
    50% { filter: brightness(1.2) contrast(1.2) }
    100% { filter: brightness(1) contrast(1) }
  }

  @keyframes game {
    0% { transform: translateX(0) }
    25% { transform: translateX(-5px) }
    75% { transform: translateX(5px) }
    100% { transform: translateX(0) }
  }

  @keyframes magic {
    0% { filter: saturate(100%) }
    50% { filter: saturate(200%) }
    100% { filter: saturate(100%) }
  }

  @keyframes show {
    0% { transform: scale(1) }
    50% { transform: scale(1.05) }
    100% { transform: scale(1) }
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = additionalStyles;
document.head.appendChild(styleSheet);

export default PasswordProtection;