import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Add scroll event listener for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation and close on Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    // Focus trap for mobile menu
    const focusableElements = menuRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keydown', handleTabKey);

    // Focus first element when menu opens
    firstElement?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navItems = [
    { to: "/", label: "Home", isActive: location.pathname === '/' },
    { to: "/dashboard", label: "Dashboard", isActive: location.pathname === '/dashboard', show: !!currentUser },
    { to: "/tracking", label: "Job Tracking", isActive: location.pathname.startsWith('/tracking'), show: !!currentUser },
    { to: "/profile", label: "My Profile", isActive: location.pathname === '/profile', show: !!currentUser },
    { to: "/auth", label: "Log In", isActive: location.pathname === '/auth', show: !currentUser },
    { to: "/signup", label: "Sign Up", isActive: location.pathname === '/signup', show: !currentUser },
  ].filter(item => item.show !== false);

  // Check if mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <nav 
      className={`js-navbar ${isScrolled ? 'scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="js-nav-container">
        {/* Logo */}
        <Link 
          to="/" 
          className="js-nav-logo"
          aria-label="ResumeScan - Home"
          onClick={() => window.scrollTo(0, 0)}
        >
          ResumeScan
        </Link>

        {/* Mobile Menu Button */}
        <button 
          ref={menuButtonRef}
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-haspopup="true"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`} aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Desktop Navigation */}
        <ul className="js-nav-menu desktop-nav" role="menubar">
          {navItems.map((item) => (
            <li key={item.to} role="none">
              <Link
                to={item.to}
                className={`nav-link ${item.isActive ? 'active' : ''}`}
                role="menuitem"
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
          
          {currentUser && (
            <li className="desktop-cta" role="none">
              <button 
                onClick={handleLogout} 
                className="nav-link"
                role="menuitem"
              >
                Log Out
              </button>
            </li>
          )}
        </ul>

        {/* Mobile Menu Overlay */}
        <div 
          className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-hidden={!isMobileMenuOpen}
        >
          <div 
            ref={menuRef}
            className="mobile-menu-container" 
            onClick={e => e.stopPropagation()}
            role="document"
          >
            <button 
              className="mobile-close-button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              aria-label="Close menu"
            >
              Log Out
            </button>
          </li>
        )}
      </ul>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMobileMenuOpen}
      >
        <div 
          ref={menuRef}
          className="mobile-menu-container" 
          onClick={e => e.stopPropagation()}
          role="document"
        >
          <button 
            className="mobile-close-button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              menuButtonRef.current?.focus();
            }}
            aria-label="Close menu"
          >
            &times;
          </button>
          <nav aria-label="Mobile menu">
            <ul className="mobile-nav" role="menu">
              {navItems.map((item) => (
                <li key={item.to} role="none">
                  <Link
                    to={item.to}
                    className={`mobile-nav-link ${item.isActive ? 'active' : ''}`}
                    role="menuitem"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {currentUser && (
                <li className="mobile-cta" role="none">
                  <button 
                    onClick={handleLogout} 
                    className="mobile-nav-link"
                    role="menuitem"
                  >
                    Log Out
                  </button>
                </li>
              )}
              {!currentUser && (
                <li className="mobile-cta" role="none">
                  <Link 
                    to="/signup" 
                    className="mobile-nav-cta"
                    role="menuitem"
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                  >
                    Scan Resume
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
      </div>
    </nav>
  );
}