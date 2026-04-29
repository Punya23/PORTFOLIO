import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Keyboard, Brain, Server, Palette, Database, Wrench,
  Code2, Coffee, Brackets, Hash, FileCode, FileType,
  BarChart3, Flame, Cpu, Eye, Bot,
  FileText, Dna, Image,
  FlaskConical, Hexagon, Train, Zap,
  Atom, Triangle, Waves,
  Container, Leaf,
  GitBranch, Box, Cloud, Link, ShieldCheck,
  Plug, Upload, Lightbulb
} from 'lucide-react';
import { skills } from '../../data/portfolio';
import './Skills.css';

const categories = [
  { key: 'languages', label: 'Languages', Icon: Keyboard },
  { key: 'aiml', label: 'AI / ML', Icon: Brain },
  { key: 'backend', label: 'Backend', Icon: Server },
  { key: 'frontend', label: 'Frontend', Icon: Palette },
  { key: 'database', label: 'Database', Icon: Database },
  { key: 'tools', label: 'Tools & Infra', Icon: Wrench },
];

// Lucide icon mapping per skill
const skillIconMap = {
  Python: Code2,
  Java: Coffee,
  'C++': Brackets,
  C: Hash,
  JavaScript: FileCode,
  TypeScript: FileType,
  'Scikit-learn': BarChart3,
  PyTorch: Flame,
  TensorFlow: Cpu,
  OpenCV: Eye,
  Transformers: Bot,
  NLP: FileText,
  'Deep Learning': Dna,
  CNNs: Image,
  Flask: FlaskConical,
  'Node.js': Hexagon,
  Express: Train,
  FastAPI: Zap,
  React: Atom,
  'Next.js': Triangle,
  'Tailwind CSS': Waves,
  PostgreSQL: Database,
  MongoDB: Leaf,
  Git: GitBranch,
  Docker: Box,
  AWS: Cloud,
  'REST APIs': Link,
  JWT: ShieldCheck,
  WebSockets: Plug,
  Cloudinary: Upload,
};

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [activeCategory, setActiveCategory] = useState('languages');

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section id="skills" className="skills-section" ref={ref}>
      <motion.div
        className="section"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="section-label" variants={itemVariants}>
          Skills
        </motion.div>

        <motion.h2 className="section-title" variants={itemVariants}>
          My <span className="gradient-text">tech stack</span>
        </motion.h2>

        <motion.p className="section-subtitle" variants={itemVariants}>
          Technologies and tools I work with
        </motion.p>

        {/* Category Tabs */}
        <motion.div className="skills-tabs" variants={itemVariants}>
          {categories.map((cat) => {
            const CatIcon = cat.Icon;
            return (
              <button
                key={cat.key}
                className={`skills-tab ${activeCategory === cat.key ? 'skills-tab-active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
                data-cursor-hover
              >
                <CatIcon size={16} className="tab-icon" />
                <span className="tab-label">{cat.label}</span>
                {activeCategory === cat.key && (
                  <motion.div
                    className="tab-indicator"
                    layoutId="skills-tab-indicator"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* Skills Grid */}
        <div className="skills-grid-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="skills-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {skills[activeCategory]?.map((skill, i) => {
                const SkillIcon = skillIconMap[skill] || Lightbulb;
                return (
                  <motion.div
                    key={skill}
                    className="skill-card glass-card"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    data-cursor-hover
                  >
                    <span className="skill-icon">
                      <SkillIcon size={24} strokeWidth={1.5} />
                    </span>
                    <span className="skill-name">{skill}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Orbit visualization */}
        <motion.div className="skills-orbit" variants={itemVariants}>
          <div className="orbit-center">
            <Code2 size={26} color="white" strokeWidth={2} />
          </div>
          {[1, 2, 3].map((ring) => (
            <div key={ring} className={`orbit-ring orbit-ring-${ring}`}>
              {Object.values(skills)
                .flat()
                .slice((ring - 1) * 6, ring * 6)
                .map((skill, i) => (
                  <div
                    key={skill}
                    className="orbit-item"
                    style={{
                      '--orbit-radius': `${ring * 80 + 40}px`,
                      '--orbit-delay': `${i * -(20 / 6)}s`,
                      animationDuration: `${20 + ring * 5}s`,
                      animationDelay: `${i * -(20 / 6)}s`,
                    }}
                  >
                    <span className="orbit-label">{skill}</span>
                  </div>
                ))}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
