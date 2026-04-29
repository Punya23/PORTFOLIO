import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { GraduationCap, Trophy, BookOpen, School, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { personalInfo, education, achievements } from '../../data/portfolio';
import './About.css';

const eduIcons = {
  graduation: GraduationCap,
  books: BookOpen,
  school: School,
};

function EduIcon({ icon }) {
  const Icon = eduIcons[icon] || GraduationCap;
  return (
    <div className="edu-icon">
      <Icon size={22} strokeWidth={1.5} />
    </div>
  );
}

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section id="about" className="about-section" ref={ref}>
      <motion.div
        className="section"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="section-label" variants={itemVariants}>
          About Me
        </motion.div>

        <motion.h2 className="section-title" variants={itemVariants}>
          A quick snapshot of{' '}
          <span className="gradient-text">my journey</span>
        </motion.h2>

        <motion.p className="section-subtitle" variants={itemVariants}>
          From where I started to where I am today.
        </motion.p>

        <div className="about-grid">
          {/* Bio Card */}
          <motion.div className="about-bio-card glass-card" variants={itemVariants}>
            <div className="about-bio-header">
              <div className="about-avatar">
                <span className="about-avatar-text">PS</span>
                <div className="about-avatar-ring" />
              </div>
              <div>
                <h3 className="about-name">{personalInfo.name}</h3>
                <p className="about-role">{personalInfo.role}</p>
              </div>
            </div>
            <p className="about-bio-text">{personalInfo.bio}</p>
            <div className="about-links">
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="about-link" data-cursor-hover>
                <GithubIcon size={18} />
                GitHub
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="about-link" data-cursor-hover>
                <LinkedinIcon size={18} />
                LinkedIn
              </a>
              <a href={`mailto:${personalInfo.email}`} className="about-link" data-cursor-hover>
                <Mail size={18} />
                Email
              </a>
            </div>
          </motion.div>

          {/* Education */}
          <motion.div className="about-education" variants={itemVariants}>
            <h3 className="about-section-heading">
              <GraduationCap size={20} className="heading-icon" /> Education
            </h3>
            <div className="education-list">
              {education.map((edu, i) => (
                <motion.div
                  key={i}
                  className="education-card glass-card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <EduIcon icon={edu.icon} />
                  <div className="edu-content">
                    <span className="edu-year">{edu.year}</span>
                    <h4 className="edu-degree">{edu.degree}</h4>
                    <p className="edu-institution">{edu.institution}</p>
                    <span className="edu-grade">{edu.grade}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div className="about-achievements" variants={itemVariants}>
            <h3 className="about-section-heading">
              <Trophy size={20} className="heading-icon" /> Achievements
            </h3>
            <div className="achievements-grid">
              {achievements.map((ach, i) => (
                <motion.div
                  key={i}
                  className="achievement-pill"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {ach}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
