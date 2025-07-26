import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from '../contexts/AuthContext';
import { FiEdit2, FiSave, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

// Re-export icons with fixed SVG attributes
const FixedFiEdit2 = (props) => (
  <FiEdit2 strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props} />
);

const FixedFiSave = (props) => (
  <FiSave strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props} />
);

const FixedFiMail = (props) => (
  <FiMail strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props} />
);

const FixedFiPhone = (props) => (
  <FiPhone strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props} />
);

const FixedFiMapPin = (props) => (
  <FiMapPin strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props} />
);

// Status colors for activity badges
const statusColors = {
  'Applied': 'bg-blue-100 text-blue-800',
  'Interviewing': 'bg-yellow-100 text-yellow-800',
  'Offer': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'default': 'bg-gray-100 text-gray-800'
};

// Animation variants for framer-motion
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

export default function Profile() {
  const { user, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Debug: Log user state
  useEffect(() => {
    console.log('Profile - User:', user);
    console.log('Profile - User UID:', user?.uid);
  }, [user]);
  
  // Initialize with user data or defaults
  const [profile, setProfile] = useState({
    name: user?.displayName || 'New User',
    title: user?.title || 'Job Seeker',
    email: user?.email || '',
    phone: user?.phone || user?.phoneNumber || '',
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
    recentActivities: []
  });

  // Load profile data from localStorage and sync with auth context
  useEffect(() => {
    if (!user?.uid) {
      console.log('No user UID available, skipping profile load');
      return;
    }
    
    console.log('Loading profile for user:', user.uid);
    
    try {
      const savedProfile = localStorage.getItem(`userProfile_${user.uid}`);
      
      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile);
        console.log('Loaded saved profile:', parsedProfile);
        
        setProfile(prev => ({
          ...prev,
          ...parsedProfile,
          // Ensure we don't overwrite with empty values on refresh
          email: parsedProfile.email || user.email || prev.email,
          phone: parsedProfile.phone || user.phoneNumber || prev.phone,
          location: parsedProfile.location || user.location || prev.location,
          // Ensure meta object exists
          meta: {
            ...prev.meta,
            ...(parsedProfile.meta || {})
          }
        }));
      } else {
        console.log('No saved profile found, initializing with user data');
        // Initialize with user data if no saved profile
        setProfile(prev => ({
          ...prev,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          phone: user.phoneNumber || prev.phone,
          location: user.location || prev.location
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, [user?.uid, user?.email, user?.phoneNumber, user?.location, user?.displayName]);

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

  const handleSave = async () => {
    try {
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }

      console.log('Saving profile for user:', user.uid);
      setIsSaving(true);
      
      // Prepare the updated profile data
      const updatedProfile = {
        ...profile,
        lastUpdated: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify(updatedProfile));
      
      // Update auth context with the new profile data
      const result = await updateUserProfile(updatedProfile);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }
      
      console.log('Profile saved successfully');
      setIsEditing(false);
      
      // Show success message or notification here
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(`Failed to save profile: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate match rate based on profile completeness
  const calculateMatchRate = () => {
    let score = 0;
    const maxScore = 8;
    if (profile.name) score++;
    if (profile.title) score++;
    if (profile.email) score++;
    if (profile.phone) score++;
    if (profile.location !== 'Location not set') score++;
    if (profile.meta.salaryMin > 0) score++;
    if (profile.meta.workType !== 'Not specified') score++;
    if (profile.meta.experienceLevel !== 'Not specified') score++;
    return Math.round((score / maxScore) * 100);
  };

  const matchRate = calculateMatchRate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Profile
            </h1>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FixedFiSave className="-ml-1 mr-2 h-5 w-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FixedFiEdit2 className="-ml-1 mr-2 h-5 w-5" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-2xl font-medium text-blue-600">
                        {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        profile.name
                      )}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      {isEditing ? (
                        <input
                          type="text"
                          name="title"
                          value={profile.title}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        profile.title
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center">
                    <FixedFiMail className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-600">
                      {profile.email || 'No email provided'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FixedFiPhone className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-600">
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={profile.phone}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add phone number"
                        />
                      ) : (
                        profile.phone || 'No phone number'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FixedFiMapPin className="h-5 w-5 text-gray-400" />
                    <span className="ml-3 text-sm text-gray-600">
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={profile.location}
                          onChange={handleInputChange}
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add location"
                        />
                      ) : (
                        profile.location
                      )}
                    </span>
                  </div>
                </div>

                {/* Match Rate */}
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-500">Profile Strength</h4>
                    <span className="text-sm font-medium text-gray-900">{matchRate}%</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${matchRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Job Preferences */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Job Preferences
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your job search preferences and requirements.
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Desired Salary Range
                    </label>
                    {isEditing ? (
                      <div className="mt-1 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-500">Min</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="salaryMin"
                              value={profile.meta.salaryMin || ''}
                              onChange={handleMetaChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500">Max</label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="salaryMax"
                              value={profile.meta.salaryMax || ''}
                              onChange={handleMetaChange}
                              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.meta.salaryMin > 0 || profile.meta.salaryMax > 0
                          ? `${formatCurrency(profile.meta.salaryMin)} - ${formatCurrency(profile.meta.salaryMax)}`
                          : 'Not specified'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Work Type
                    </label>
                    {isEditing ? (
                      <select
                        name="workType"
                        value={profile.meta.workType}
                        onChange={handleMetaChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option>Not specified</option>
                        <option>On-site</option>
                        <option>Hybrid</option>
                        <option>Remote</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.meta.workType}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Experience Level
                    </label>
                    {isEditing ? (
                      <select
                        name="experienceLevel"
                        value={profile.meta.experienceLevel}
                        onChange={handleMetaChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option>Not specified</option>
                        <option>Entry Level</option>
                        <option>Mid Level</option>
                        <option>Senior Level</option>
                        <option>Executive</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.meta.experienceLevel}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Employer Type
                    </label>
                    {isEditing ? (
                      <select
                        name="employerType"
                        value={profile.meta.employerType}
                        onChange={handleMetaChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option>Not specified</option>
                        <option>Startup</option>
                        <option>Midsize Company</option>
                        <option>Large Corporation</option>
                        <option>Non-profit</option>
                        <option>Government</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {profile.meta.employerType}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg"
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activities
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your recent job search activities.
                </p>
              </div>
              <div className="bg-white overflow-hidden">
                {profile.recentActivities && profile.recentActivities.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {profile.recentActivities.map((activity, index) => (
                      <li key={index} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {activity.title} at {activity.company}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusColors[activity.status] || statusColors.default
                            }`}>
                              {activity.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {activity.type} • {activity.location}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <span>Applied on {new Date(activity.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-sm text-gray-500">No recent activities to display.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
