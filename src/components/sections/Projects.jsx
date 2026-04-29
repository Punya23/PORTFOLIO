import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Zap, Star, TrendingUp, ArrowUpRight } from 'lucide-react';
import { GithubIcon } from '../ui/BrandIcons';
import { projects } from '../../data/portfolio';
import './Projects.css';

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const trackRef = useRef(null);
  const marqueeRef = useRef(null);
  const isPausedRef = useRef(false);
  const scrollPosRef = useRef(0);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Drag state
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollStart = useRef(0);
  const velocityRef = useRef(0);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);

  // Dynamic semicircle arc — cards Y position depends on viewport center
  const updateArc = () => {
    const track = trackRef.current;
    const marquee = marqueeRef.current;
    if (!track || !marquee) return;

    const cards = track.children;
    const containerRect = marquee.getBoundingClientRect();
    const centerX = containerRect.left + containerRect.width / 2;
    const maxRadius = containerRect.width / 2;
    const arcDepth = 60; // max Y dip at edges in px

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;

      // Normalized distance from center: 0 = center, 1 = edge
      const dist = Math.min(Math.abs(cardCenterX - centerX) / maxRadius, 1);

      // Semicircle formula: y = arcDepth * (1 - sqrt(1 - dist^2)) → 0 at center, arcDepth at edge
      const yOffset = arcDepth * (1 - Math.sqrt(1 - dist * dist));

      // Also subtle scale: center = 1, edges = 0.92
      const scale = 1 - dist * 0.08;

      // Also subtle opacity: center = 1, edges = 0.7
      const opacity = 1 - dist * 0.3;

      card.style.transform = `translateY(${yOffset}px) scale(${scale})`;
      card.style.opacity = opacity;
    }
  };

  // Auto-scroll + momentum + arc
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId;
    const autoSpeed = 0.5;

    const animate = () => {
      const halfWidth = track.scrollWidth / 2;

      if (isDragging.current) {
        // While dragging, don't auto-scroll
      } else if (Math.abs(velocityRef.current) > 0.2) {
        // Momentum coast after drag release
        scrollPosRef.current += velocityRef.current;
        velocityRef.current *= 0.94;
      } else if (!isPausedRef.current) {
        velocityRef.current = 0;
        scrollPosRef.current += autoSpeed;
      }

      // Infinite loop wrap
      if (scrollPosRef.current >= halfWidth) {
        scrollPosRef.current -= halfWidth;
      }
      if (scrollPosRef.current < 0) {
        scrollPosRef.current += halfWidth;
      }

      track.style.transform = `translateX(-${scrollPosRef.current}px)`;

      // Update arc positions
      updateArc();

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragScrollStart.current = scrollPosRef.current;
    lastDragX.current = e.clientX;
    lastDragTime.current = Date.now();
    velocityRef.current = 0;
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    scrollPosRef.current = dragScrollStart.current - dx;

    const now = Date.now();
    const dt = now - lastDragTime.current;
    if (dt > 0) {
      velocityRef.current = -(e.clientX - lastDragX.current) / Math.max(dt, 1) * 16;
    }
    lastDragX.current = e.clientX;
    lastDragTime.current = now;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  };

  // Touch drag handlers
  const handleTouchStart = (e) => {
    isDragging.current = true;
    dragStartX.current = e.touches[0].clientX;
    dragScrollStart.current = scrollPosRef.current;
    lastDragX.current = e.touches[0].clientX;
    lastDragTime.current = Date.now();
    velocityRef.current = 0;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - dragStartX.current;
    scrollPosRef.current = dragScrollStart.current - dx;

    const now = Date.now();
    const dt = now - lastDragTime.current;
    if (dt > 0) {
      velocityRef.current = -(e.touches[0].clientX - lastDragX.current) / Math.max(dt, 1) * 16;
    }
    lastDragX.current = e.touches[0].clientX;
    lastDragTime.current = now;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  // Global mouseup
  useEffect(() => {
    const up = () => { isDragging.current = false; document.body.style.userSelect = ''; };
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mouseup', up);
      window.removeEventListener('touchend', up);
    };
  }, []);

  const handleMouseEnter = () => { isPausedRef.current = true; };
  const handleMouseLeave = () => {
    isPausedRef.current = false;
    isDragging.current = false;
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const duplicatedProjects = [...projects, ...projects];

  return (
    <section id="projects" className="projects-section" ref={ref}>
      <motion.div
        className="section"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="section-label" variants={itemVariants}>
          Projects
        </motion.div>

        <motion.h2 className="section-title" variants={itemVariants}>
          Things I&apos;ve{' '}
          <span className="gradient-text">built</span>
        </motion.h2>

        <motion.p className="section-subtitle" variants={itemVariants}>
          Practical AI systems solving real-world problems
        </motion.p>
      </motion.div>

      {/* Semicircle arc scrolling track with drag */}
      <motion.div
        className="projects-marquee"
        ref={marqueeRef}
        variants={itemVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="projects-track" ref={trackRef}>
          {duplicatedProjects.map((project, i) => (
            <div
              key={`${project.title}-${i}`}
              className="project-card"
              style={{ '--card-accent': project.color }}
              data-cursor-hover
            >
              {/* Top glow line */}
              <div className="project-card-glow-line" />

              {/* Ambient glow */}
              <div className="project-card-ambient" />

              <div className="project-card-inner">
                {/* Image Preview */}
                {project.image && (
                  <div className="project-card-preview">
                    <img src={project.image} alt={project.title} loading="lazy" />
                  </div>
                )}

                {/* Title & Subtitle */}
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-sub">{project.subtitle}</p>

                {/* Description */}
                <p className="project-card-desc">{project.description}</p>

                {/* Impact */}
                {project.impact && (
                  <div className="project-card-impact">
                    <TrendingUp size={14} />
                    <span>{project.impact}</span>
                  </div>
                )}

                {/* Tags */}
                <div className="project-card-tags">
                  {project.tags.map((tag, j) => (
                    <span key={j} className="pill">{tag}</span>
                  ))}
                </div>

                {/* Footer */}
                <div className="project-card-footer">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card-link"
                    data-cursor-hover
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GithubIcon size={15} />
                    View Code
                  </a>
                  <span
                    className="project-card-arrow"
                    data-cursor-hover
                    onClick={(e) => {
                      e.stopPropagation();
                      if (project.image) setLightboxImage({ src: project.image, title: project.title });
                    }}
                  >
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="marquee-fade marquee-fade-left" />
        <div className="marquee-fade marquee-fade-right" />

        {/* Drag hint */}
        <div className="drag-hint">
          drag to explore
        </div>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            className="project-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              className="project-lightbox-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={lightboxImage.src} alt={lightboxImage.title} />
              <p className="project-lightbox-title">{lightboxImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
