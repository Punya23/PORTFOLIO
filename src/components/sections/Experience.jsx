import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experience } from '../../data/portfolio';
import './Experience.css';

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const timelineRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const cardVariants = {
    hidden: (i) => ({
      opacity: 0,
      x: i % 2 === 0 ? -50 : 50,
      filter: 'blur(5px)',
    }),
    visible: {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section id="experience" className="experience-section" ref={ref}>
      <motion.div
        className="section"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div
          className="section-label"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          Experience
        </motion.div>

        <motion.h2
          className="section-title"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          Where I&apos;ve{' '}
          <span className="gradient-text">worked</span>
        </motion.h2>

        <div className="timeline" ref={timelineRef}>
          {/* Animated line */}
          <div className="timeline-track">
            <motion.div
              className="timeline-progress"
              style={{ height: lineHeight }}
            />
          </div>

          {experience.map((exp, i) => (
            <motion.div
              key={i}
              className={`timeline-item ${i % 2 === 0 ? 'timeline-left' : 'timeline-right'}`}
              custom={i}
              variants={cardVariants}
            >
              <div className="timeline-dot">
                <div className="timeline-dot-inner" />
              </div>

              <div className="timeline-card glass-card">
                <div className="timeline-card-header">
                  <span className={`exp-type-badge ${exp.type}`}>
                    {exp.type === 'work' ? <Briefcase size={13} /> : <GraduationCap size={13} />} {exp.type}
                  </span>
                  <span className="exp-period">{exp.period}</span>
                </div>

                <h3 className="exp-role">{exp.role}</h3>
                <p className="exp-company">{exp.company}</p>
                <p className="exp-description">{exp.description}</p>

                <div className="exp-tags">
                  {exp.tags.map((tag, j) => (
                    <span key={j} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
