import { Heart, Coffee } from 'lucide-react';
import { personalInfo } from '../../data/portfolio';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">
              <span className="logo-bracket">&lt;</span>
              <span className="logo-name">{personalInfo.firstName}</span>
              <span className="logo-bracket">/&gt;</span>
            </span>
            <p className="footer-tagline">
              Building intelligent systems that make a difference.
            </p>
          </div>

          <div className="footer-links">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" data-cursor-hover>
              GitHub
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" data-cursor-hover>
              LinkedIn
            </a>
            <a href={`mailto:${personalInfo.email}`} data-cursor-hover>
              Email
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {personalInfo.name}. Crafted with <Heart size={14} className="footer-icon" /> and a lot of <Coffee size={14} className="footer-icon" />
          </p>
          <p className="footer-tech">
            Built with React + Framer Motion + GSAP
          </p>
        </div>
      </div>
    </footer>
  );
}
