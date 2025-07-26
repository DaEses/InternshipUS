import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { FiEdit2, FiSave, FiBriefcase, FiMail, FiPhone, FiMapPin, FiDollarSign, FiClock, FiBriefcase as FiJobType, FiAward } from 'react-icons/fi';

// Animation variants for framer-motion
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Status colors for application status
const statusColors = {
  Applied: 'bg-blue-100 text-blue-800',
  Interviewing: 'bg-yellow-100 text-yellow-800',
  Offer: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800'
};

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Initialize with user data or defaults
  const [profile, setProfile] = useState({
    name: user?.displayName || 'New User',
    title: user?.title || 'Job Seeker',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || 'Location not set',
    meta: {
      salaryMin: 0,
      salaryMax: 0,
      workType: 'Not specified',
      experienceLevel: 'Not specified',
      preferredLocations: [],
      employerType: 'Not specified',
      sector: 'Not specified'
    },
    dreamJobs: [],
    activeDreamJobId: null,
    resumes: [],
    stats: {
      resumesScanned: 0,
      jobsMatched: 0,
      applicationsSubmitted: 0,
      interviewsScheduled: 0
    },
    recentActivities: []
  });

  // Load profile data from localStorage
  useEffect(() => {
    if (user?.uid) {
      const savedProfile = localStorage.getItem(`profile_${user.uid}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    }
  }, [user?.uid]);

  // Save profile data to localStorage when it changes
  useEffect(() => {
    if (user?.uid) {
      localStorage.setItem(`profile_${user.uid}`, JSON.stringify(profile));
    }
  }, [profile, user?.uid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMetaChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [name]: value
      }
    }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to your backend
    console.log('Profile saved:', profile);
  };

  // Load profile data from localStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  // Get user data from auth context
  const { user: currentUser } = useAuth?.() || {};

  // Update profile with auth data when user is available
  useEffect(() => {
    if (currentUser) {
      setUserProfile(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone
      }));
    }
  }, [currentUser]);

  // Job Preferences Modal
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefsForm, setPrefsForm] = useState({ ...(userProfile.meta || {}) });
  
  const openPrefs = () => {
    setPrefsForm({ ...(userProfile.meta || {}) });
    setShowPrefs(true);
  };
  
  const savePrefs = () => {
    const updated = { 
      ...userProfile, 
      meta: { 
        ...userProfile.meta, 
        ...prefsForm 
      } 
    };
    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
    setShowPrefs(false);
  };

  // Dream Job State
  const [showDreamJobForm, setShowDreamJobForm] = useState(false);
  const [editingDreamJob, setEditingDreamJob] = useState(null);
  const [dreamJobForm, setDreamJobForm] = useState({ title: '', description: '' });

  const openAddDreamJob = () => {
    setDreamJobForm({ title: '', description: '' });
    setEditingDreamJob(null);
    setShowDreamJobForm(true);
  };

  const openEditDreamJob = (job) => {
    setDreamJobForm({ title: job.title, description: job.description });
    setEditingDreamJob(job.id);
    setShowDreamJobForm(true);
  };

  const handleDreamJobFormChange = (e) => {
    const { name, value } = e.target;
    setDreamJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveDreamJob = () => {
    const updatedDreamJobs = [...(userProfile.dreamJobs || [])];
    
    if (editingDreamJob) {
      const index = updatedDreamJobs.findIndex(job => job.id === editingDreamJob);
      if (index !== -1) {
        updatedDreamJobs[index] = { ...updatedDreamJobs[index], ...dreamJobForm };
      }
    } else {
      const newDreamJob = {
        id: Date.now().toString(),
        ...dreamJobForm,
        createdAt: new Date().toISOString()
      };
      updatedDreamJobs.push(newDreamJob);
    }

    const updated = {
      ...userProfile,
      dreamJobs: updatedDreamJobs
    };

    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
    setShowDreamJobForm(false);
  };

  const deleteDreamJob = (id) => {
    const updatedDreamJobs = (userProfile.dreamJobs || []).filter(job => job.id !== id);
    const updated = {
      ...userProfile,
      dreamJobs: updatedDreamJobs,
      activeDreamJobId: userProfile.activeDreamJobId === id ? null : userProfile.activeDreamJobId
    };
    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  const setActiveDreamJob = (id) => {
    const updated = {
      ...userProfile,
      activeDreamJobId: userProfile.activeDreamJobId === id ? null : id
    };
    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  return (
    <div className="js-home teal-home">
      {/* Hero Section */}
      <motion.section className="teal-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <motion.div className="teal-hero-content" variants={fadeInUp} custom={1}>
          <motion.h1 variants={fadeInUp} custom={1}>Your Profile</motion.h1>
          <motion.p variants={fadeInUp} custom={2}>Manage your personal brand, preferences, and job search data.</motion.p>
        </motion.div>
        <motion.div className="teal-hero-image" variants={fadeInUp} custom={2}>
          <OptimizedImage 
            src="/images/profile-hero.jpg" 
            alt="Professional profile management" 
            className="hero-image"
            loading="eager"
          />
        </motion.div>
      </motion.section>

      <div className="js-profile-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Profile Sidebar */}
        <div className="js-profile-sidebar">
          <div className="js-profile-avatar">
            {userProfile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="js-profile-name">{userProfile.name}</div>
          <div className="js-profile-title">{userProfile.title}</div>
          
          <div className="js-profile-stats">
            {Object.entries(userProfile.stats || {}).map(([key, value]) => (
              <div key={key} className="js-stat-item">
                <div className="js-stat-number">{value}</div>
                <div className="js-stat-label">
                  {key.split(/(?=[A-Z])/).join(' ')}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1a202c', marginBottom: '1rem' }}>Contact Info</h4>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
              <div>📧 {userProfile.email}</div>
              <div>📱 {userProfile.phone}</div>
              <div>📍 {userProfile.location}</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="js-profile-content">
          {/* About Section */}
          <div className="js-profile-section">
            <div className="js-section-header">
              <h3>About Me</h3>
              <button 
                className="js-edit-button"
                onClick={openPrefs}
              >
                Edit Preferences
              </button>
            </div>
            <div className="js-section-content">
              <p>{userProfile.bio || 'No bio provided.'}</p>
            </div>
          </div>

          {/* Preferences Modal */}
          {showPrefs && (
            <div className="js-modal-overlay">
              <div className="js-modal">
                <h3>Edit Preferences</h3>
                <div className="js-form-group">
                  <label>Minimum Salary</label>
                  <input 
                    type="number" 
                    value={prefsForm.salaryMin || ''}
                    onChange={(e) => setPrefsForm({...prefsForm, salaryMin: e.target.value})}
                  />
                </div>
                <div className="js-form-actions">
                  <button onClick={savePrefs}>Save</button>
                  <button onClick={() => setShowPrefs(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
