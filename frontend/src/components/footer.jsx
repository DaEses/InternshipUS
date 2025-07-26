import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">ResumeMatcher</Link>
            <p className="footer-tagline">
              Connecting talent with opportunity through intelligent job matching.
            </p>
            <div className="footer-social">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="footer-links">
            <div className="footer-links-column">
              <h4 className="footer-heading">Product</h4>
              <ul className="footer-links-list">
                <li><Link to="/">Features</Link></li>
                <li><Link to="/pricing">Pricing</Link></li>
                <li><Link to="/templates">Resume Templates</Link></li>
                <li><Link to="/job-board">Job Board</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-heading">Resources</h4>
              <ul className="footer-links-list">
                <li><Link to="/blog">Blog</Link></li>
                <li><Link to="/career-advice">Career Advice</Link></li>
                <li><Link to="/resume-tips">Resume Tips</Link></li>
                <li><Link to="/interview-tips">Interview Tips</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-heading">Company</h4>
              <ul className="footer-links-list">
                <li><Link to="/about">About Us</Link></li>
                <li><Link to="/careers">Careers</Link></li>
                <li><Link to="/contact">Contact</Link></li>
                <li><Link to="/press">Press</Link></li>
              </ul>
            </div>
            
            <div className="footer-links-column">
              <h4 className="footer-heading">Legal</h4>
              <ul className="footer-links-list">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/cookies">Cookie Policy</Link></li>
                <li><Link to="/gdpr">GDPR</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-copyright">
            &copy; {currentYear} ResumeMatcher. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <Link to="/privacy">Privacy</Link>
            <span className="footer-divider">•</span>
            <Link to="/terms">Terms</Link>
            <span className="footer-divider">•</span>
            <Link to="/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;