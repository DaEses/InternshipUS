import { useState, useEffect, useMemo, useCallback, useContext } from "react";
import { motion } from "framer-motion";
import OptimizedImage from '../components/OptimizedImage';
import { useAuth } from '../contexts/AuthContext';
import '../Home.css';

// Status colors to match JobTracking component
const getStatusColor = (status) => ({
  Applied: '#dbeafe',    // Light blue
  Interviewing: '#fef3c7', // Light yellow
  Offer: '#dcfce7',      // Light green
  Rejected: '#fee2e2',   // Light red
})[status] || '#e2e8f0'; // Default light gray

// Text colors that contrast well with the status backgrounds
const getStatusTextColor = (status) => ({
  Applied: '#1e40af',    // Dark blue
  Interviewing: '#92400e', // Dark yellow/brown
  Offer: '#166534',      // Dark green
  Rejected: '#991b1b',   // Dark red
})[status] || '#4b5563'; // Default dark gray

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.15, 
      duration: 0.7, 
      type: 'spring', 
      stiffness: 60 
    }
  })
};

export default function Profile() {
  // Get the current authenticated user from AuthContext
  const { user } = useAuth();
  
  // Initialize state for applications with empty array
  const [applications, setApplications] = useState([]);
  
  // Load applications for the current user
  useEffect(() => {
    if (user?.id) {
      const userAppsKey = `applications_${user.id}`;
      const savedApps = localStorage.getItem(userAppsKey);
      if (savedApps) {
        try {
          setApplications(JSON.parse(savedApps));
        } catch (error) {
          console.error('Error parsing applications:', error);
          setApplications([]);
        }
      } else {
        setApplications([]);
      }
    } else {
      setApplications([]);
    }
  }, [user?.id]);

  // Save applications when they change
  useEffect(() => {
    if (user?.id && applications.length > 0) {
      const userAppsKey = `applications_${user.id}`;
      localStorage.setItem(userAppsKey, JSON.stringify(applications));
    }
  }, [applications, user?.id]);
  
  // Default profile data
  const defaultProfile = {
    name: user?.name || 'New User',
    title: 'Job Seeker',
    email: user?.email || '',
    phone: user?.phone || '',
    location: 'Location not set',
    meta: {
      salaryMin: 0,
      salaryMax: 0,
      location: 'Not specified',
      workType: 'Not specified',
      employerType: 'Not specified',
      sector: 'Not specified'
    },
    skills: [],
    values: [],
    interests: [],
    workExperiences: [],
    education: [],
    resumes: [],
    dreamJobs: [],
    activeDreamJobId: null,
    stats: {
      resumesScanned: 0,
      jobsMatched: 0,
      applicationsSubmitted: 0,
      interviewsScheduled: 0
    }
  };

  // Initialize user profile state with authenticated user data or defaults
  const [userProfile, setUserProfile] = useState(() => {
    // If no user is logged in, return default profile
    if (!user?.id) return defaultProfile;
    
    try {
      const userKey = `userProfile_${user.id}`;
      const saved = localStorage.getItem(userKey);
      
      // If we have a saved profile for this user, use it
      if (saved) {
        const parsed = JSON.parse(saved);
        // Merge with any new user data from auth
        return {
          ...defaultProfile, // Start with defaults
          ...parsed,        // Override with saved data
          // Ensure these fields are always up to date from auth
          name: user.name || parsed.name || defaultProfile.name,
          email: user.email || parsed.email || defaultProfile.email,
          phone: user.phone || parsed.phone || defaultProfile.phone,
          location: user.location || parsed.location || defaultProfile.location,
          meta: {
            ...defaultProfile.meta,
            ...parsed.meta,  // Merge saved meta with defaults
            location: user.location || parsed.meta?.location || defaultProfile.meta.location
          }
        };
      }
      
      // If no saved profile, create a new one with user data
      return {
        ...defaultProfile,
        name: user.name || defaultProfile.name,
        email: user.email || defaultProfile.email,
        phone: user.phone || defaultProfile.phone,
        location: user.location || defaultProfile.location,
        meta: {
          ...defaultProfile.meta,
          location: user.location || defaultProfile.meta.location
        }
      };
    } catch (error) {
      console.error('Error loading profile:', error);
      // Return a fresh default profile on error
      return {
        ...defaultProfile,
        name: user.name || defaultProfile.name,
        email: user.email || defaultProfile.email,
        phone: user.phone || defaultProfile.phone,
        location: user.location || defaultProfile.location
      };
    }
  });

  // Save profile to localStorage when it changes or when user changes
  useEffect(() => {
    if (!user?.id) return;
    
    const userKey = `userProfile_${user.id}`;
    
    // Don't save if we're still initializing
    if (Object.keys(userProfile).length === 0) return;
    
    try {
      localStorage.setItem(userKey, JSON.stringify({
        ...userProfile,
        // Always keep these fields in sync with auth
        name: user.name || userProfile.name,
        email: user.email || userProfile.email,
        phone: user.phone || userProfile.phone,
        location: user.location || userProfile.location,
        meta: {
          ...userProfile.meta,
          location: user.location || userProfile.meta?.location || defaultProfile.meta.location
        }
      }));
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  }, [userProfile, user]);

  // Calculate match rate between job and profile
  const calculateMatchRate = (job, profile) => {
    if (!job || !profile) return 0;
    
    let score = 0;
    let maxScore = 0;
    
    // Skills match (50% weight)
    if (job.requiredSkills && profile.skills) {
      const matchedSkills = job.requiredSkills.filter(skill => 
        profile.skills.some(profileSkill => 
          profileSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(profileSkill.toLowerCase())
        )
      );
      score += (matchedSkills.length / Math.max(job.requiredSkills.length, 1)) * 50;
    }
    maxScore += 50;
    
    // Job title relevance (30% weight)
    if (job.title && profile.title) {
      const titleWords = job.title.toLowerCase().split(/\s+/);
      const profileTitleWords = profile.title.toLowerCase().split(/\s+/);
      const matchedWords = titleWords.filter(word => 
        profileTitleWords.some(profileWord => 
          profileWord.includes(word) || word.includes(profileWord)
        )
      );
      score += (matchedWords.length / Math.max(titleWords.length, 1)) * 30;
    }
    maxScore += 30;
    
    // Location match (10% weight)
    if (job.location && profile.location) {
      const jobLocation = job.location.toLowerCase();
      const profileLocation = profile.location.toLowerCase();
      if (jobLocation.includes(profileLocation) || profileLocation.includes(jobLocation)) {
        score += 10;
      }
    }
    maxScore += 10;
    
    // Employment type match (10% weight)
    if (job.employmentType && userProfile.meta?.workType) {
      if (job.employmentType === userProfile.meta.workType) {
        score += 10;
      }
    }
    maxScore += 10;
    
    // Calculate final percentage (0-100)
    const finalScore = Math.round((score / Math.max(maxScore, 1)) * 100);
    return Math.min(Math.max(finalScore, 0), 100); // Ensure between 0-100
  };

  // Load applications from localStorage
  const [recentActivities, setRecentActivities] = useState([]);
  
  // Load applications from localStorage on initial render
  useEffect(() => {
    const savedApps = localStorage.getItem('jobApplications');
    if (savedApps) {
      const parsedApps = JSON.parse(savedApps);
      setApplications(parsedApps);
    }
  }, []);
  
  // Update recent activities when applications or user profile changes
  useEffect(() => {
    if (applications.length === 0) return;
    
    // Create recent activities from applications
    const activities = applications.slice(0, 5).map(app => {
      const jobTitle = app.jobTitle || 'Job';
      const company = app.company || 'Company';
      return {
        id: app.id,
        title: jobTitle,
        company: company,
        description: `${jobTitle} at ${company}`,
        date: app.dateApplied || new Date().toISOString(),
        status: app.status || 'Applied',
        matchRate: calculateMatchRate(app, userProfile)
      };
    });
    
    setRecentActivities(activities);
  }, [applications, userProfile.skills, userProfile.title, userProfile.meta?.workType, userProfile.location]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => ({
    backgroundColor: getStatusColor(status),
    color: getStatusTextColor(status),
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center'
  });

  // Update profile stats when applications change
  useEffect(() => {
    if (applications.length > 0) {
      setUserProfile(prev => ({
        ...prev,
        stats: {
          resumesScanned: applications.length,
          jobsMatched: Math.floor(applications.length * 1.5),
          applicationsSubmitted: applications.length,
          interviewsScheduled: applications.filter(app => 
            app.status === 'Interviewing' || app.status === 'Offer'
          ).length
        }
      }));
    }
  }, [applications]);

  // Calculate match score based on job requirements and user profile
  const calculateMatchScore = (job, profile) => {
    // Get user's skills from their profile
    const userSkills = profile?.skills || [];
    const jobSkills = job.skillsRequired || [];
    
    // 1. Skills match (50% weight)
    const matchedSkills = jobSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill?.toLowerCase().includes(skill?.toLowerCase() || '') ||
        skill?.toLowerCase().includes(userSkill?.toLowerCase() || '')
      )
    );
    const skillsScore = jobSkills.length > 0 
      ? (matchedSkills.length / jobSkills.length) * 50 
      : 0;
    
    // 2. Job title relevance (30% weight)
    // Check if the job title contains any of the user's skills or vice versa
    const titleWords = job.position?.toLowerCase().split(/[^a-z]+/) || [];
    const titleRelevance = userSkills.some(skill => 
      titleWords.some(word => 
        skill?.toLowerCase().includes(word) || 
        word.includes(skill?.toLowerCase() || '')
      )
    ) ? 30 : 0;
    
    // 3. Location match (10% weight)
    const locationMatch = job.location && profile?.meta?.location
      ? (job.location.toLowerCase().includes(profile.meta.location.toLowerCase()) ||
         profile.meta.location.toLowerCase().includes(job.location.toLowerCase()))
        ? 10 : 0
      : 0;
    
    // 4. Employment type match (10% weight)
    const employmentTypeMatch = job.employmentType && profile?.meta?.workType
      ? (job.employmentType.toLowerCase() === profile.meta.workType.toLowerCase())
        ? 10 : 0
      : 0;
    
    // Calculate total score (0-100%)
    const totalScore = Math.min(
      Math.round(skillsScore + titleRelevance + locationMatch + employmentTypeMatch),
      100
    );
    
    return totalScore;
  };

  // Calculate recent activity from job applications
  const recentActivity = useMemo(() => {
    if (!applications?.length) return [];
    
    return applications
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
      .slice(0, 5)
      .map(app => ({
        id: app.id,
        action: `Applied to ${app.position}`,
        company: app.company,
        date: new Date(app.appliedDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        status: app.status,
        score: calculateMatchScore(app, userProfile)
      }));
  }, [applications, userProfile]);
  // Dream Job Section State
  const [dreamJobs, setDreamJobs] = useState([
    { id: 1, title: 'Lead AI Engineer', description: 'Work on cutting-edge AI products.' }
  ]);
  const [activeDreamJobId, setActiveDreamJobId] = useState(1);
  const [dreamOrgs, setDreamOrgs] = useState(['OpenAI', 'Google', 'Tesla']);
  const [webSources] = useState(['https://linkedin.com/jobs', 'https://indeed.com', 'https://openai.com/careers']);
  
  // Initialize meta state with default values
  const [meta, setMeta] = useState({
    salaryMin: 120000,
    salaryMax: 150000,
    location: 'San Francisco, CA',
    workType: 'Hybrid',
    employerType: 'Private',
    sector: 'Technology'
  });

  // Initialize resumes state
  const [resumes, setResumes] = useState([
    { 
      id: 1, 
      name: 'Software Engineer Resume', 
      lastUpdated: '2024-01-15', 
      score: 87, 
      status: 'Active', 
      keywords: ['React', 'Node.js', 'Python'] 
    },
    { 
      id: 2, 
      name: 'Product Manager Resume', 
      lastUpdated: '2024-01-10', 
      score: 92, 
      status: 'Active', 
      keywords: ['Product', 'Agile', 'Analytics'] 
    },
    { 
      id: 3, 
      name: 'Data Scientist Resume', 
      lastUpdated: '2023-12-20', 
      score: 78, 
      status: 'Draft', 
      keywords: ['Python', 'ML', 'SQL'] 
    }
  ]);

  // Recent activity is now dynamically generated from job applications
  const [newSkill, setNewSkill] = useState('');
  const [showDreamJobForm, setShowDreamJobForm] = useState(false);
  const [editingDreamJob, setEditingDreamJob] = useState(null);
  const [dreamJobForm, setDreamJobForm] = useState({ title: '', description: '' });
  
  // Skill management
  const addSkill = () => {
    if (newSkill.trim()) {
      setUserProfile({ ...userProfile, skills: [...userProfile.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };
  
  const removeSkill = (skill) => {
    setUserProfile({ ...userProfile, skills: userProfile.skills.filter(s => s !== skill) });
  };

  const handleResumeAction = (action, resumeId) => {
    console.log(`${action} resume ${resumeId}`);
    // In a real app, this would make an API call
  };

  // Add/Edit Dream Job
  const handleDreamJobFormChange = (e) => {
    setDreamJobForm({ ...dreamJobForm, [e.target.name]: e.target.value });
  };
  const openAddDreamJob = () => {
    setEditingDreamJob(null);
    setDreamJobForm({ title: '', description: '' });
    setShowDreamJobForm(true);
  };
  const openEditDreamJob = (job) => {
    setEditingDreamJob(job.id);
    setDreamJobForm({ title: job.title, description: job.description });
    setShowDreamJobForm(true);
  };
  const saveDreamJob = () => {
    if (dreamJobForm.title.trim() && dreamJobForm.description.trim()) {
      if (editingDreamJob) {
        setUserProfile({
          ...userProfile,
          dreamJobs: userProfile.dreamJobs.map(j =>
            j.id === editingDreamJob ? { ...j, ...dreamJobForm } : j
          )
        });
      } else {
        const newId = Math.max(0, ...userProfile.dreamJobs.map(j => j.id)) + 1;
        setUserProfile({
          ...userProfile,
          dreamJobs: [...userProfile.dreamJobs, { id: newId, ...dreamJobForm }]
        });
      }
      setShowDreamJobForm(false);
      setEditingDreamJob(null);
      setDreamJobForm({ title: '', description: '' });
    }
  };
  const deleteDreamJob = (id) => {
    setUserProfile({
      ...userProfile,
      dreamJobs: userProfile.dreamJobs.filter(j => j.id !== id),
      activeDreamJobId: userProfile.activeDreamJobId === id ? null : userProfile.activeDreamJobId
    });
  };
  const setActiveDreamJob = (id) => {
    setUserProfile({ ...userProfile, activeDreamJobId: id });
  };

  // Resume Section State
  const [showResumeForm, setShowResumeForm] = useState(false);
  const [editingResume, setEditingResume] = useState(null);
  const [resumeForm, setResumeForm] = useState({ name: '', keywords: '', status: 'Active' });
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  // Add this state for file upload
  const [resumeFile, setResumeFile] = useState(null);

  // Add/Update Resume
  const openAddResume = () => {
    setEditingResume(null);
    setResumeForm({ name: '', keywords: '', status: 'Active' });
    setShowResumeForm(true);
  };
  const openEditResume = (resume) => {
    setEditingResume(resume.id);
    setResumeForm({ name: resume.name, keywords: resume.keywords.join(', '), status: resume.status });
    setShowResumeForm(true);
  };
  const saveResume = () => {
    const keywordsArr = resumeForm.keywords.split(',').map(k => k.trim()).filter(Boolean);
    if (resumeForm.name.trim() && keywordsArr.length) {
      if (editingResume) {
        setUserProfile({
          ...userProfile,
          resumes: userProfile.resumes.map(r =>
            r.id === editingResume ? { ...r, name: resumeForm.name, keywords: keywordsArr, status: resumeForm.status, lastUpdated: new Date().toISOString().slice(0, 10) } : r
          )
        });
      } else {
        const newId = Math.max(0, ...userProfile.resumes.map(r => r.id)) + 1;
        setUserProfile({
          ...userProfile,
          resumes: [...userProfile.resumes, { id: newId, name: resumeForm.name, keywords: keywordsArr, status: resumeForm.status, lastUpdated: new Date().toISOString().slice(0, 10), score: 0 }]
        });
      }
      setShowResumeForm(false);
      setEditingResume(null);
      setResumeForm({ name: '', keywords: '', status: 'Active' });
    }
  };
  // Scan Resume
  const scanResume = (resume) => {
    // Simulate scan: random score, add a keyword
    const newScore = Math.floor(Math.random() * 21) + 80;
    const newKeywords = [...resume.keywords, 'ScannedSkill' + Math.floor(Math.random() * 100)];
    setUserProfile({
      ...userProfile,
      resumes: userProfile.resumes.map(r =>
        r.id === resume.id ? { ...r, score: newScore, keywords: newKeywords, lastUpdated: new Date().toISOString().slice(0, 10) } : r
      )
    });
    setScanResult({ name: resume.name, score: newScore, keywords: newKeywords });
    setShowScanModal(true);
  };

  // Delete Resume
  const deleteResume = (id) => {
    const updated = {
      ...userProfile,
      resumes: userProfile.resumes.filter(r => r.id !== id)
    };
    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
  };

  // Handle file upload and parsing
  const handleResumeFile = async (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
  };

  // Job Preferences Modal
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefsForm, setPrefsForm] = useState({ ...(userProfile?.meta || {}) });
  
  const openPrefs = () => {
    setPrefsForm({ ...(userProfile?.meta || {}) });
    setShowPrefs(true);
  };
  
  const savePrefs = () => {
    const updated = { 
      ...userProfile, 
      meta: { 
        ...userProfile?.meta, 
        ...prefsForm 
      } 
    };
    setUserProfile(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
    setShowPrefs(false);
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
            loading="eager" // Eager load hero images
          />
        </motion.div>
      </motion.section>
      <div className="js-profile-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Profile Sidebar */}
        <div className="js-profile-sidebar" style={{
          background: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0',
          position: 'sticky',
          top: '2rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: '#2563eb',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: '600',
              marginBottom: '1rem'
            }}>
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 style={{
              margin: '0.5rem 0 0.25rem',
              color: '#1a202c',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              {userProfile.name}
            </h2>
            <p style={{
              margin: 0,
              color: '#4b5563',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}>
              {userProfile.title}
            </p>
          </div>

          <div style={{
            padding: '1.5rem',
            background: '#f8fafc',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            marginTop: '1rem'
          }}>
            <h4 style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#1a202c',
              margin: '0 0 1rem 0',
              paddingBottom: '0.75rem',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#4b5563"/>
              </svg>
              Contact Information
            </h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              fontSize: '0.9rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                color: '#4b5563'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM19.6 8.25L12.53 12.67C12.21 12.87 11.79 12.87 11.47 12.67L4.4 8.25C4.15 8.09 4 7.82 4 7.53C4 6.86 4.73 6.46 5.3 6.81L12 11L18.7 6.81C19.27 6.46 20 6.86 20 7.53C20 7.82 19.85 8.09 19.6 8.25Z" fill="#4b5563"/>
                </svg>
                <span>{userProfile?.email || 'No email provided'}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#4b5563'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.23 15.26L16.69 14.97C16.08 14.9 15.48 15.11 15.05 15.54L13.21 17.38C10.38 15.94 8.06 13.63 6.62 10.79L8.47 8.94C8.9 8.52 9.1 7.91 9.04 7.3L8.74 4.78C8.63 3.77 7.78 3.01 6.76 3.01H5.03C3.9 3.01 3 3.91 3 5.04C3 14.53 9.47 21 18.96 21C20.09 21 20.99 20.1 20.99 18.97V17.24C21 16.22 20.24 15.37 19.23 15.26Z" fill="#4b5563"/>
                </svg>
                <span>{userProfile.phone || 'Not provided'}</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#4b5563'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 13.17 9.42 18.92 11.24 21.11C11.64 21.59 12.37 21.59 12.77 21.11C14.58 18.92 19 13.17 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#4b5563"/>
                </svg>
                <span>{userProfile.location || 'Location not set'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Main Content */}
        <div className="js-profile-main">
          {/* Skills */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 className="js-section-title">Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              {userProfile.skills.map(skill => (
                <span key={skill} className="js-job-tag">
                  {skill} <button onClick={() => removeSkill(skill)} style={{ marginLeft: 4, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
                </span>
              ))}
            </div>
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add skill" style={{ padding: '0.5rem', borderRadius: 6, border: '1px solid #e2e8f0', marginRight: 8 }} />
            <button className="js-action-button primary" onClick={addSkill}>Add</button>
          </div>

          {/* Resumes Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 className="js-section-title">Your Resumes</h3>
            {userProfile.resumes.map(resume => (
              <div key={resume.id} className="js-resume-item">
                <div className="js-resume-info">
                  <h4>{resume.name}</h4>
                  <p>Last updated: {resume.lastUpdated} • Score: {resume.score}/100 • Status: {resume.status}</p>
                  <div style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: 4 }}>Keywords: {resume.keywords.join(', ')}</div>
                </div>
                <div className="js-resume-actions">
                  <button 
                    className="js-action-button primary"
                    onClick={() => openEditResume(resume)}
                  >
                    Edit
                  </button>
                  <button 
                    className="js-action-button secondary"
                    onClick={() => scanResume(resume)}
                  >
                    Scan
                  </button>
                  <button 
                    className="js-action-button secondary"
                    onClick={() => downloadResume(resume)}
                  >
                    Download
                  </button>
                  <button 
                    className="js-action-button secondary"
                    style={{ color: '#dc2626', borderColor: '#dc2626' }}
                    onClick={() => deleteResume(resume.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button 
              className="js-action-button primary"
              style={{ marginTop: '1rem' }}
              onClick={openAddResume}
            >
              + Add New Resume
            </button>
            {/* Resume Modal/Form */}
            {showResumeForm && (
              <div style={{ background: '#fff', border: '2px solid #2563eb', borderRadius: 12, padding: 24, marginTop: 16, boxShadow: '0 4px 16px #2563eb22' }}>
                <h4 style={{ color: '#2563eb', marginBottom: 12 }}>{editingResume ? 'Edit Resume' : 'Add Resume'}</h4>
                {/* File upload for PDF/DOCX */}
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeFile} style={{ width: '100%', marginBottom: 12 }} />
                <input name="name" value={resumeForm.name} onChange={e => setResumeForm({ ...resumeForm, name: e.target.value })} placeholder="Resume Name" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <input name="keywords" value={resumeForm.keywords} onChange={e => setResumeForm({ ...resumeForm, keywords: e.target.value })} placeholder="Keywords (comma separated)" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <select name="status" value={resumeForm.status} onChange={e => setResumeForm({ ...resumeForm, status: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="js-action-button primary" onClick={saveResume}>{editingResume ? 'Save' : 'Add'}</button>
                  <button className="js-action-button secondary" onClick={() => { setShowResumeForm(false); setEditingResume(null); }}>Cancel</button>
                </div>
              </div>
            )}
            {/* Scan Modal */}
            {showScanModal && scanResult && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 8px 32px #0004' }}>
                  <h3 style={{ color: '#2563eb', marginBottom: 12 }}>Resume Scanned</h3>
                  <div style={{ marginBottom: 12 }}><b>Resume:</b> {scanResult.name}</div>
                  <div style={{ marginBottom: 12 }}><b>New Score:</b> {scanResult.score}/100</div>
                  <div style={{ marginBottom: 12 }}><b>Keywords:</b> {scanResult.keywords.join(', ')}</div>
                  <button className="js-action-button primary" onClick={() => setShowScanModal(false)}>Close</button>
                </div>
              </div>
            )}
          </div>

          {/* Recent Activity Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 className="js-section-title">Recent Activity</h3>
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className="js-resume-item">
                  <div className="js-resume-info">
                    <h4>{activity.description}</h4>
                    <p>{formatDate(activity.date)}</p>
                  </div>
                  <div className="js-resume-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                    {typeof activity.matchRate === 'number' && (
                      <span style={{ 
                        background: '#dcfce7', 
                        color: '#166534', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {activity.matchRate}% Match
                      </span>
                    )}
                    {activity.status && (
                      <span style={{ 
                        background: getStatusColor(activity.status),
                        color: getStatusTextColor(activity.status),
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.875rem', 
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        textTransform: 'capitalize'
                      }}>
                        {activity.status.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No recent activities found</p>
            )}
          </div>

          {/* Job Preferences Section */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 className="js-section-title">Job Preferences</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: 12 }}>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>Location</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{userProfile.meta.location}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>Work Type</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{userProfile.meta.workType}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>Salary Range</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>${userProfile.meta.salaryMin} - ${userProfile.meta.salaryMax}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>Employer Type</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{userProfile.meta.employerType}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontWeight: '600', color: '#1a202c', marginBottom: '0.5rem' }}>Sector</div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{userProfile.meta.sector}</div>
              </div>
            </div>
            <button className="js-action-button secondary" onClick={openPrefs} style={{ marginTop: 8 }}>
              Edit Preferences
            </button>
            {showPrefs && (
              <div style={{ background: '#fff', border: '2px solid #2563eb', borderRadius: 12, padding: 24, marginTop: 16, boxShadow: '0 4px 16px #2563eb22', maxWidth: 400 }}>
                <h4 style={{ color: '#2563eb', marginBottom: 12 }}>Edit Job Preferences</h4>
                <input value={prefsForm.location} onChange={e => setPrefsForm({ ...prefsForm, location: e.target.value })} placeholder="Location" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <select value={prefsForm.workType} onChange={e => setPrefsForm({ ...prefsForm, workType: e.target.value })} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }}>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="In-person">In-person</option>
                </select>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input type="number" value={prefsForm.salaryMin} onChange={e => setPrefsForm({ ...prefsForm, salaryMin: e.target.value })} placeholder="Min Salary" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                  <input type="number" value={prefsForm.salaryMax} onChange={e => setPrefsForm({ ...prefsForm, salaryMax: e.target.value })} placeholder="Max Salary" style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                </div>
                <input value={prefsForm.employerType} onChange={e => setPrefsForm({ ...prefsForm, employerType: e.target.value })} placeholder="Employer Type" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <input value={prefsForm.sector} onChange={e => setPrefsForm({ ...prefsForm, sector: e.target.value })} placeholder="Sector" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="js-action-button primary" onClick={savePrefs}>Save</button>
                  <button className="js-action-button secondary" onClick={() => setShowPrefs(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* DREAM JOB SECTION */}
          <div style={{ marginBottom: '2.5rem', background: '#f8fafc', borderRadius: 12, padding: '2rem', border: '2px solid #2563eb' }}>
            <h3 className="js-section-title" style={{ color: '#2563eb' }}>Dream Job</h3>
            {userProfile.dreamJobs.length === 0 && <div style={{ color: '#6b7280', marginBottom: 12 }}>No dream jobs added yet.</div>}
            {userProfile.dreamJobs.map(job => (
              <div key={job.id} style={{ marginBottom: 16, padding: 12, borderRadius: 8, background: userProfile.activeDreamJobId === job.id ? '#dbeafe' : '#fff', border: userProfile.activeDreamJobId === job.id ? '2px solid #2563eb' : '1px solid #e2e8f0', boxShadow: userProfile.activeDreamJobId === job.id ? '0 2px 8px #2563eb22' : 'none' }}>
                <div style={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a202c' }}>{job.title}</div>
                <div style={{ color: '#6b7280', margin: '8px 0' }}>{job.description}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button className="js-action-button primary" style={{ background: userProfile.activeDreamJobId === job.id ? '#2563eb' : undefined }} onClick={() => setActiveDreamJob(job.id)}>
                    {userProfile.activeDreamJobId === job.id ? 'Active Dream Job' : 'Set as Active'}
                  </button>
                  <button className="js-action-button secondary" onClick={() => openEditDreamJob(job)}>Edit</button>
                  <button className="js-action-button secondary" style={{ color: '#dc2626', borderColor: '#dc2626' }} onClick={() => deleteDreamJob(job.id)}>Delete</button>
                </div>
              </div>
            ))}
            <button className="js-action-button primary" style={{ marginTop: 8 }} onClick={openAddDreamJob}>+ Add Dream Job</button>
            {/* Dream Job Modal/Form */}
            {showDreamJobForm && (
              <div style={{ background: '#fff', border: '2px solid #2563eb', borderRadius: 12, padding: 24, marginTop: 16, boxShadow: '0 4px 16px #2563eb22' }}>
                <h4 style={{ color: '#2563eb', marginBottom: 12 }}>{editingDreamJob ? 'Edit Dream Job' : 'Add Dream Job'}</h4>
                <input name="title" value={dreamJobForm.title} onChange={handleDreamJobFormChange} placeholder="Dream Job Title" style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <textarea name="description" value={dreamJobForm.description} onChange={handleDreamJobFormChange} placeholder="Describe your dream job in detail..." style={{ width: '100%', minHeight: 80, marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #e2e8f0' }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="js-action-button primary" onClick={saveDreamJob}>{editingDreamJob ? 'Save' : 'Add'}</button>
                  <button className="js-action-button secondary" onClick={() => { setShowDreamJobForm(false); setEditingDreamJob(null); }}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}