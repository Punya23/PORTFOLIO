import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for fonts + a minimum display time
    const minDelay = new Promise((resolve) => setTimeout(resolve, 2200));
    const fontsReady = document.fonts?.ready || Promise.resolve();

    Promise.all([minDelay, fontsReady]).then(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="preloader"
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="preloader-content">
            {/* Animated logo */}
            <motion.div
              className="preloader-logo"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <span className="preloader-bracket">&lt;</span>
              <span className="preloader-name">Punya</span>
              <span className="preloader-bracket">/&gt;</span>
            </motion.div>

            {/* Animated loading bar */}
            <motion.div
              className="preloader-bar-track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.div
                className="preloader-bar-fill"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="preloader-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              initializing...
            </motion.p>
          </div>

          {/* Ambient glow */}
          <div className="preloader-glow" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
