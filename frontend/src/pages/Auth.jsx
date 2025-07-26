import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import OptimizedImage from '../components/OptimizedImage';
import '../Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, type: 'spring', stiffness: 60 }
  })
};

export default function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    location: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    console.log('Auth: Form submitted');
    
    // Basic validation
    if (formData.email.trim() === '' || formData.password.trim() === '') {
      console.log('Auth: Validation failed - missing required fields');
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      console.log('Auth: Validation failed - passwords do not match');
      setError('Passwords do not match');
      return;
    }
    
    try {
      console.log('Auth: Starting authentication process');
      setIsSubmitting(true);
      
      // For demo purposes, we'll simulate a successful login
      const userData = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        phone: formData.phone || '',
        location: formData.location || '',
        // Add any other user data you want to store
      };
      
      console.log('Auth: Created user data:', userData);
      
      // Simulate API delay
      console.log('Auth: Simulating API delay...');
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Call the login function from our auth context with a dummy token
      console.log('Auth: Calling login function from auth context');
      login(userData, 'dummy-jwt-token');
      
      // No need to navigate here, it's handled in the login function
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="js-home teal-home">
      {/* Hero Section */}
      <motion.section className="teal-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <motion.div className="teal-hero-content" variants={fadeInUp} custom={1}>
          <motion.h1 variants={fadeInUp} custom={1}>
            {isLogin ? 'Log In' : 'Create an Account'}
          </motion.h1>
          <motion.p variants={fadeInUp} custom={2}>
            {isLogin 
              ? 'Sign in to access your personalized job search tools.' 
              : 'Join us to start your journey to the perfect job.'}
          </motion.p>
        </motion.div>
        <motion.div className="teal-hero-image" variants={fadeInUp} custom={2}>
          <OptimizedImage
            src="/images/login-hero.jpg"
            alt={isLogin ? 'Login' : 'Sign Up'}
            className="hero-image"
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            loading="eager" // Eager load hero images
          />
        </motion.div>
      </motion.section>

      {/* Auth Form */}
      <div className="js-auth-container" style={{ 
        maxWidth: 500, 
        margin: '0 auto', 
        padding: '2rem 1rem',
        width: '100%'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '2rem',
          width: '100%'
        }}>
          <div style={{
            display: 'flex',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setIsLogin(true)}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: isLogin ? 'var(--accent)' : 'transparent',
                color: isLogin ? 'white' : 'var(--text-main)',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderBottom: isLogin ? '2px solid var(--accent)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: !isLogin ? 'var(--accent)' : 'transparent',
                color: !isLogin ? 'white' : 'var(--text-main)',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                borderBottom: !isLogin ? '2px solid var(--accent)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#b91c1c',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-main)'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    required={!isLogin}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-main)'
                  }}>
                    Phone Number <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(123) 456-7890"
                    pattern="\([0-9]{3}\) [0-9]{3}-[0-9]{4}"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    required={!isLogin}
                  />
                  <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    Format: (123) 456-7890
                  </small>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: 'var(--text-main)'
                  }}>
                    Location <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.375rem',
                      fontSize: '1rem',
                      transition: 'border-color 0.2s',
                      outline: 'none'
                    }}
                    required={!isLogin}
                  />
                  <small style={{ display: 'block', marginTop: '0.25rem', color: '#6b7280', fontSize: '0.75rem' }}>
                    City, State or City, Country
                  </small>
                </div>
              </>
            )}

            <div style={{ marginBottom: '1rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-main)'
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem'
              }}>
                <label style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-main)'
                }}>
                  Password
                </label>
                {isLogin && (
                  <Link to="/forgot-password" style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}>
                    Forgot password?
                  </Link>
                )}
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s',
                  outline: 'none'
                }}
                required
              />
            </div>

            {!isLogin && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'var(--text-main)'
                }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.2s',
                    outline: 'none'
                  }}
                  required={!isLogin}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: isSubmitting ? '#a0aec0' : 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                marginBottom: '1.5rem',
                opacity: isSubmitting ? 0.8 : 1
              }}
              onMouseOver={(e) => !isSubmitting && (e.target.style.backgroundColor = 'var(--accent-dark)')}
              onMouseOut={(e) => !isSubmitting && (e.target.style.backgroundColor = 'var(--accent)')}
            >
              {isSubmitting 
                ? (isLogin ? 'Signing In...' : 'Creating Account...')
                : (isLogin ? 'Sign In' : 'Create Account')}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0.25rem 0.5rem',
                  marginLeft: '0.25rem',
                  borderRadius: '0.25rem',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px'
                }}
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
