import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiSearch, FiFilter, FiBriefcase, FiMapPin, FiDollarSign, FiSave, FiCheckCircle, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const JobTracker = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [interviewedJobs, setInterviewedJobs] = useState([]);

  // Mock job data
  const mockJobs = [
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      description: 'We are looking for a skilled Frontend Developer to join our team.',
      requirements: ['3+ years of React', 'JavaScript/TypeScript', 'Redux'],
      postedDate: '2023-05-15',
      companyLogo: 'https://via.placeholder.com/50'
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Contract',
      salary: '$70 - $90 per hour',
      description: 'Create beautiful and intuitive user experiences.',
      requirements: ['5+ years of UX/UI design', 'Figma/Sketch', 'Portfolio'],
      postedDate: '2023-05-20',
      companyLogo: 'https://via.placeholder.com/50/0000FF/FFFFFF?text=DH'
    }
  ];

  // Load user data
  useEffect(() => {
    if (currentUser?.id) {
      const userData = JSON.parse(localStorage.getItem(`jobTracking_${currentUser.id}`) || '{}');
      setSavedJobs(userData.savedJobs || []);
      setAppliedJobs(userData.appliedJobs || []);
      setInterviewedJobs(userData.interviewedJobs || []);
    }
  }, [currentUser?.id]);

  // Save data
  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem(`jobTracking_${currentUser.id}`, JSON.stringify({
        savedJobs,
        appliedJobs,
        interviewedJobs,
        lastUpdated: new Date().toISOString()
      }));
    }
  }, [savedJobs, appliedJobs, interviewedJobs, currentUser?.id]);

  // Load jobs
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(mockJobs);
      setFilteredJobs(mockJobs);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredJobs(jobs);
      return;
    }
    const query = searchQuery.toLowerCase();
    const results = jobs.filter(job => 
      job.title.toLowerCase().includes(query) || 
      job.company.toLowerCase().includes(query)
    );
    setFilteredJobs(results);
  }, [searchQuery, jobs]);

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleApplyJob = (jobId) => {
    setAppliedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const handleInterviewed = (jobId) => {
    setInterviewedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const JobCard = ({ job }) => (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-logo">
          <img src={job.companyLogo} alt={`${job.company} logo`} />
        </div>
        <div>
          <h3>{job.title}</h3>
          <p>{job.company} • {job.location}</p>
          <p>{job.type} • {job.salary}</p>
        </div>
      </div>
      <p>{job.description}</p>
      <div className="job-actions">
        <button 
          onClick={() => handleSaveJob(job.id)}
          className={savedJobs.includes(job.id) ? 'saved' : ''}
        >
          <FiSave /> {savedJobs.includes(job.id) ? 'Saved' : 'Save'}
        </button>
        <button 
          onClick={() => handleApplyJob(job.id)}
          className={appliedJobs.includes(job.id) ? 'applied' : 'primary'}
        >
          {appliedJobs.includes(job.id) ? 'Applied' : 'Apply'}
        </button>
        <button 
          onClick={() => handleInterviewed(job.id)}
          className={interviewedJobs.includes(job.id) ? 'interviewed' : ''}
          title="Mark as interviewed"
        >
          <FiCheckCircle />
        </button>
        <button onClick={() => setSelectedJob(job)}>
          Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="job-tracker">
      <div className="search-bar">
        <FiSearch />
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="job-listings">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="job-card-skeleton">
              <Skeleton height={24} width="70%" />
              <Skeleton height={16} width="50%" style={{ marginTop: '0.5rem' }} />
              <Skeleton height={14} count={2} style={{ marginTop: '1rem' }} />
            </div>
          ))
        ) : (
          filteredJobs.map(job => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))
        )}
      </div>

      <style jsx>{`
        .job-tracker {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .search-bar input {
          flex: 1;
          border: none;
          padding: 0.5rem;
          font-size: 1rem;
          outline: none;
        }
        .job-card {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .job-card-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .company-logo {
          width: 50px;
          height: 50px;
          border-radius: 6px;
          overflow: hidden;
          background: #f5f5f5;
        }
        .job-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .job-actions button {
          padding: 0.5rem 1rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .job-actions button.primary {
          background: #3182ce;
          color: white;
          border-color: #3182ce;
        }
        .job-actions button.saved {
          background: #e6fffa;
          color: #2c7a7b;
          border-color: #81e6d9;
        }
        .job-actions button.applied {
          background: #ebf8ff;
          color: #2b6cb0;
          border-color: #90cdf4;
        }
        .job-actions button.interviewed {
          background: #f0fff4;
          color: #2f855a;
          border-color: #9ae6b4;
        }
        .job-card-skeleton {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default JobTracker;
