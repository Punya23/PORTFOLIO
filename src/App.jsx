import { useEffect } from 'react';
import { motion } from 'framer-motion';
import CustomCursor from './components/ui/CustomCursor';
import ParticleBackground from './components/ui/ParticleBackground';
import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import Terminal from './components/sections/Terminal';
import About from './components/sections/About';
import Experience from './components/sections/Experience';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Contact from './components/sections/Contact';
import Footer from './components/layout/Footer';

/* Smooth section entrance wrapper */
function SectionTransition({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

function App() {
  // Smooth scroll with Lenis
  useEffect(() => {
    let lenis;
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    };
    initLenis();

    return () => {
      if (lenis) lenis.destroy();
    };
  }, []);

  // Glass-card spotlight hover effect
  useEffect(() => {
    const onMouseMove = (e) => {
      const cards = document.querySelectorAll('.glass-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--spotlight-x', `${x}px`);
        card.style.setProperty('--spotlight-y', `${y}px`);
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <>
      {/* Background layers */}
      <div className="grid-bg" />
      <ParticleBackground />

      {/* Custom Cursor (desktop only) */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main>
        <Hero />

        <SectionTransition>
          <Terminal />
        </SectionTransition>

        <SectionTransition>
          <About />
        </SectionTransition>

        <SectionTransition>
          <Experience />
        </SectionTransition>

        <SectionTransition>
          <Projects />
        </SectionTransition>

        <SectionTransition>
          <Skills />
        </SectionTransition>

        <SectionTransition>
          <Contact />
        </SectionTransition>
      </main>

      {/* Footer */}
      <SectionTransition>
        <Footer />
      </SectionTransition>
    </>
  );
}

export default App;
