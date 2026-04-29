import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';
import './Terminal.css';

const terminalLines = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: 'Punya Surana — AI/ML Engineer & Full-Stack Developer' },
  { type: 'command', text: 'cat skills.json | jq ".top"' },
  { type: 'output', text: '["Python", "React", "PyTorch", "TensorFlow", "FastAPI", "Docker"]' },
  { type: 'command', text: 'ls ~/projects --sort=impact' },
  { type: 'output', text: 'CYPHEX/  Quantisense/  RAHI/  FraudGuard/  LocalLoop/  CarbonSense/' },
  { type: 'command', text: 'echo $CURRENT_FOCUS' },
  { type: 'output', text: 'Building intelligent systems that solve real-world problems.' },
  { type: 'command', text: 'neofetch --minimal' },
  { type: 'output', text: '┌─ Punya Surana ─────────────────────┐' },
  { type: 'output', text: '│  OS      : macOS · VS Code         │' },
  { type: 'output', text: '│  Stack   : React · Node · Python   │' },
  { type: 'output', text: '│  Focus   : AI/ML · Cybersecurity   │' },
  { type: 'output', text: '│  CGPA    : 9.59 / 10 (Rank 3)     │' },
  { type: 'output', text: '└────────────────────────────────────┘' },
];

export default function Terminal() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [isRunning, setIsRunning] = useState(false);
  const [visibleLines, setVisibleLines] = useState([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef(null);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  const typeNextLine = useCallback(() => {
    const idx = lineIndexRef.current;
    if (idx >= terminalLines.length) {
      setCurrentTyping('');
      return;
    }

    const line = terminalLines[idx];

    if (line.type === 'command') {
      // Type character by character
      const char = charIndexRef.current;
      if (char <= line.text.length) {
        setCurrentTyping(line.text.substring(0, char));
        charIndexRef.current++;
        timeoutRef.current = setTimeout(typeNextLine, 35 + Math.random() * 25);
      } else {
        // Command done — add to visible lines, move to next
        setVisibleLines((prev) => [...prev, line]);
        setCurrentTyping('');
        charIndexRef.current = 0;
        lineIndexRef.current++;
        timeoutRef.current = setTimeout(typeNextLine, 200);
      }
    } else {
      // Output — show instantly
      setVisibleLines((prev) => [...prev, line]);
      charIndexRef.current = 0;
      lineIndexRef.current++;
      timeoutRef.current = setTimeout(typeNextLine, 80);
    }
  }, []);

  const startTerminal = () => {
    if (isRunning) return;
    setIsRunning(true);
    setVisibleLines([]);
    setCurrentTyping('');
    lineIndexRef.current = 0;
    charIndexRef.current = 0;
    timeoutRef.current = setTimeout(typeNextLine, 600);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="terminal-section" ref={ref}>
      <motion.div
        className="section"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* CTA to start */}
        {!isRunning && (
          <motion.div className="terminal-cta" variants={itemVariants}>
            <p className="terminal-hint">prefer the command line?</p>
            <motion.button
              className="terminal-trigger"
              onClick={startTerminal}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-cursor-hover
            >
              <TerminalIcon size={18} />
              <span>punya.init()</span>
            </motion.button>
          </motion.div>
        )}

        {/* Terminal window */}
        <motion.div
          className={`terminal-window ${isRunning ? 'terminal-active' : ''}`}
          variants={itemVariants}
        >
          {/* Title bar */}
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="terminal-title">
              <TerminalIcon size={13} />
              <span>punya@portfolio ~ zsh</span>
            </div>
            <div className="terminal-dots" style={{ visibility: 'hidden' }}>
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>

          {/* Terminal body */}
          <div className="terminal-body">
            {!isRunning && (
              <div className="terminal-placeholder">
                <span className="terminal-prompt">$</span>
                <span className="terminal-blink">_</span>
              </div>
            )}

            {visibleLines.map((line, i) => (
              <div key={i} className={`terminal-line terminal-${line.type}`}>
                {line.type === 'command' && (
                  <span className="terminal-prompt">
                    <ChevronRight size={14} />
                  </span>
                )}
                <span>{line.text}</span>
              </div>
            ))}

            {/* Currently typing */}
            {isRunning && currentTyping !== undefined && lineIndexRef.current < terminalLines.length && terminalLines[lineIndexRef.current]?.type === 'command' && (
              <div className="terminal-line terminal-command terminal-typing">
                <span className="terminal-prompt">
                  <ChevronRight size={14} />
                </span>
                <span>{currentTyping}</span>
                <span className={`terminal-cursor ${cursorVisible ? '' : 'terminal-cursor-hidden'}`}>▊</span>
              </div>
            )}

            {/* Final cursor after all done */}
            {isRunning && lineIndexRef.current >= terminalLines.length && (
              <div className="terminal-line terminal-command">
                <span className="terminal-prompt">
                  <ChevronRight size={14} />
                </span>
                <span className={`terminal-cursor ${cursorVisible ? '' : 'terminal-cursor-hidden'}`}>▊</span>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
