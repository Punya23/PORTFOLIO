import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Mail, Send, Check, Rocket, Hand } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons';
import { personalInfo } from '../../data/portfolio';
import './Contact.css';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just open mailto
    const subject = `Portfolio Contact from ${formData.name}`;
    const body = `Hi Punya,\n\n${formData.message}\n\nFrom: ${formData.name}\nEmail: ${formData.email}`;
    window.open(`mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const socials = [
    {
      name: 'GitHub',
      url: personalInfo.github,
      icon: <GithubIcon size={22} />,
    },
    {
      name: 'LinkedIn',
      url: personalInfo.linkedin,
      icon: <LinkedinIcon size={22} />,
    },
    {
      name: 'Email',
      url: `mailto:${personalInfo.email}`,
      icon: <Mail size={22} />,
    },
  ];

  return (
    <section id="contact" className="contact-section" ref={ref}>
      <motion.div
        className="section"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className="section-label" variants={itemVariants}>
          Contact
        </motion.div>

        <motion.h2 className="section-title" variants={itemVariants}>
          Let&apos;s build something{' '}
          <span className="gradient-text">amazing</span>
        </motion.h2>

        <motion.p className="section-subtitle" variants={itemVariants}>
          Got a project in mind? I&apos;d love to hear about it.
        </motion.p>

        <div className="contact-grid">
          {/* Chat simulation */}
          <motion.div className="contact-chat" variants={itemVariants}>
            <div className="chat-window glass-card">
              <div className="chat-header">
                <div className="chat-avatar">
                  <span>PS</span>
                </div>
                <div>
                  <span className="chat-name">Punya Surana</span>
                  <span className="chat-status">
                    <span className="status-dot" /> Online
                  </span>
                </div>
              </div>

              <div className="chat-messages">
                <motion.div
                  className="chat-bubble chat-received"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 }}
                >
                  Hey! <Hand size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Thanks for visiting my portfolio.
                </motion.div>
                <motion.div
                  className="chat-bubble chat-received"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 }}
                >
                  I&apos;m always open to discussing new projects, creative ideas, or opportunities.
                </motion.div>
                <motion.div
                  className="chat-bubble chat-sent"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1.1 }}
                >
                  Let&apos;s collaborate! <Rocket size={16} style={{ display: 'inline', verticalAlign: 'middle' }} />
                </motion.div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-socials">
              {socials.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-card glass-card"
                  variants={itemVariants}
                  whileHover={{ y: -4, scale: 1.03 }}
                  data-cursor-hover
                >
                  <span className="social-icon">{social.icon}</span>
                  <span className="social-name">{social.name}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="contact-form glass-card"
            onSubmit={handleSubmit}
            variants={itemVariants}
          >
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">Name</label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">Email</label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">Message</label>
              <textarea
                id="contact-message"
                className="form-input form-textarea"
                placeholder="Tell me about your project..."
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="form-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-cursor-hover
            >
              {submitted ? (
                <>
                  <Check size={18} />
                  Sent!
                </>
              ) : (
                <>
                  Send Message
                  <Send size={18} />
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  );
}
