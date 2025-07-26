import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

// Debug: Log when Navbar is rendered
console.log('Navbar component is rendering');

const NewNavbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuButtonRef = useRef(null);
  const menuRef = useRef(null);
  
  // Debug: Log auth state changes
  useEffect(() => {
    console.log('Navbar - Auth state updated:', { isAuthenticated, currentUser });
  }, [isAuthenticated, currentUser]);
  
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

  // Navigation items configuration
  const navItems = [
    // Always show
    { to: "/", label: "Home", isActive: location.pathname === '/' },
    
    // Protected routes - only show when authenticated
    { to: "/dashboard", label: "Dashboard", isActive: location.pathname === '/dashboard', show: isAuthenticated },
    { to: "/job-matcher", label: "Job Matcher", isActive: location.pathname.startsWith('/job-matcher'), show: isAuthenticated },
    { to: "/resume-scan", label: "Resume Scan", isActive: location.pathname.startsWith('/resume-scan'), show: isAuthenticated },
    { to: "/resume-optimizer", label: "Resume Optimizer", isActive: location.pathname.startsWith('/resume-optimizer'), show: isAuthenticated },
    { to: "/scanner", label: "Document Scanner", isActive: location.pathname.startsWith('/scanner'), show: isAuthenticated },
    { to: "/tracking", label: "Job Tracking", isActive: location.pathname.startsWith('/tracking'), show: isAuthenticated },
    { to: "/profile", label: "My Profile", isActive: location.pathname === '/profile', show: isAuthenticated },
    
    // Auth routes - only show when not authenticated
    { to: "/login", label: "Log In", isActive: location.pathname === '/login', show: !isAuthenticated }
  ].filter(item => item.show !== false);

  return (
    <nav 
      className={`navbar ${isScrolled ? 'scrolled' : ''}`}
      aria-label="Main navigation"
    >
      <div className="nav-container">
        {/* Logo */}
        <Link 
          to="/" 
          className="nav-logo"
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
        <ul className="desktop-nav" role="menubar">
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
          onClick={() => {
            setIsMobileMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
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
              <ul 
                id="mobile-menu" 
                className="mobile-nav" 
                role="menu" 
                aria-orientation="vertical"
                aria-labelledby="mobile-menu"
              >
                {navItems.map((item) => (
                  <li key={`mobile-${item.to}`} role="none">
                    <Link
                      to={item.to}
                      className={`mobile-nav-link ${item.isActive ? 'active' : ''}`}
                      role="menuitem"
                      tabIndex={isMobileMenuOpen ? 0 : -1}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                
                {isAuthenticated && (
                  <li role="none">
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="mobile-nav-link w-full text-left"
                      role="menuitem"
                      tabIndex={isMobileMenuOpen ? 0 : -1}
                    >
                      Log Out
                    </button>
                  </li>
                )}
                <li className="mobile-cta" role="none">
                  <Link 
                    to="/scan" 
                    className="nav-cta"
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
      </div>
    </nav>
  );
};

export default NewNavbar;
