import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Hand, ArrowRight } from 'lucide-react';
import { personalInfo, impactMetrics } from '../../data/portfolio';
import { useCountUp } from '../../hooks/useCountUp';
import MagneticButton from '../ui/MagneticButton';
import './Hero.css';

function CountUpMetric({ metric, index }) {
  const { display, ref } = useCountUp(metric.value, 2000);

  return (
    <div ref={ref} className="hero-metric parallax-layer" data-speed={0.3 + index * 0.1}>
      <span className="metric-value">{display}</span>
      <span className="metric-label">{metric.label}</span>
    </div>
  );
}

export default function Hero() {
  const [greeting, setGreeting] = useState('');
  const [roleText, setRoleText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const containerRef = useRef(null);

  const roles = [
    'AI/ML Engineer',
    'Full-Stack Developer',
    'Cybersecurity Enthusiast',
    'Open Source Contributor',
  ];

  // Time-aware greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Typewriter effect
  useEffect(() => {
    let charIndex = 0;
    let isDeleting = false;
    let timeout;

    const type = () => {
      const current = roles[roleIndex];
      if (!isDeleting) {
        setRoleText(current.substring(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) {
          isDeleting = true;
          timeout = setTimeout(type, 2000);
          return;
        }
        timeout = setTimeout(type, 80);
      } else {
        setRoleText(current.substring(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          setRoleIndex((prev) => (prev + 1) % roles.length);
          timeout = setTimeout(type, 500);
          return;
        }
        timeout = setTimeout(type, 40);
      }
    };
    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, [roleIndex]);

  // Parallax on mouse move
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;

      container.querySelectorAll('.parallax-layer').forEach((el) => {
        const speed = parseFloat(el.dataset.speed || 1);
        el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero" ref={containerRef}>
      {/* Ambient glow */}
      <div className="hero-glow parallax-layer" data-speed="0.5" />
      <div className="hero-orb hero-orb-1 parallax-layer" data-speed="2" />
      <div className="hero-orb hero-orb-2 parallax-layer" data-speed="1.5" />

      <div className="hero-content">
        {/* Greeting */}
        <motion.p
          className="hero-greeting"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {greeting}! <Hand size={20} className="hero-wave-icon" />
        </motion.p>

        {/* Name */}
        <motion.h1
          className="hero-name"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          I&apos;m{' '}
          <span className="gradient-text">{personalInfo.name}</span>
        </motion.h1>

        {/* Typewriter Role */}
        <motion.div
          className="hero-role-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <span className="hero-role-prefix">&gt; </span>
          <span className="hero-role-text">{roleText}</span>
          <span className="hero-cursor">|</span>
        </motion.div>

        {/* Bio */}
        <motion.p
          className="hero-bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {personalInfo.tagline}
        </motion.p>

        {/* CTA Buttons with Magnetic effect */}
        <motion.div
          className="hero-ctas"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <MagneticButton strength={0.25}>
            <a href="#projects" className="hero-btn hero-btn-primary" data-cursor-hover onClick={(e) => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span>View Projects</span>
              <ArrowRight size={16} />
            </a>
          </MagneticButton>
          <MagneticButton strength={0.25}>
            <a href="#contact" className="hero-btn hero-btn-secondary" data-cursor-hover onClick={(e) => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <span>Let&apos;s Talk</span>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Impact Metrics with Counter Animation */}
        <motion.div
          className="hero-metrics"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          {impactMetrics.map((metric, i) => (
            <CountUpMetric key={i} metric={metric} index={i} />
          ))}
        </motion.div>

      </div>

      {/* Scroll indicator */}
      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={scrollToAbout}
        data-cursor-hover
      >
        <div className="scroll-mouse">
          <div className="scroll-wheel" />
        </div>
        <span>Scroll down</span>
      </motion.div>
    </section>
  );
}
