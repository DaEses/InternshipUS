import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiSearch, FiBriefcase, FiMapPin, FiDollarSign, FiClock, 
  FiBookmark, FiSend, FiFilter, FiX, FiChevronDown
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Mock data
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: 150000,
    salaryRange: '$130k - $170k/year',
    description: 'We are looking for an experienced frontend developer to join our team. You will be responsible for building user interfaces and implementing features using React.',
    postedDate: '2 days ago',
    companyLogo: 'https://logo.clearbit.com/techcorp.com',
    skills: ['React', 'JavaScript', 'TypeScript', 'CSS']
  },
  {
    id: '2',
    title: 'UX/UI Designer',
    company: 'Adobe',
    location: 'Remote',
    type: 'Contract',
    salary: 95000,
    salaryRange: '$85k - $105k/year',
    description: 'Join our design team to create beautiful and intuitive user experiences. You will work closely with product managers and developers.',
    postedDate: '1 week ago',
    companyLogo: 'https://logo.clearbit.com/adobe.com',
    skills: ['Figma', 'UI/UX', 'Prototyping', 'User Research']
  },
  {
    id: '3',
    title: 'Backend Engineer',
    company: 'MongoDB',
    location: 'New York, NY',
    type: 'Full-time',
    salary: 160000,
    salaryRange: '$140k - $180k/year',
    description: 'Looking for a backend engineer to develop and maintain our server infrastructure and APIs.',
    postedDate: '3 days ago',
    companyLogo: 'https://logo.clearbit.com/mongodb.com',
    skills: ['Node.js', 'Python', 'SQL', 'AWS']
  },
  {
    id: '4',
    title: 'Product Manager',
    company: 'Atlassian',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: 140000,
    salaryRange: '$120k - $160k/year',
    description: 'Lead product development from conception to launch. Work with cross-functional teams to deliver amazing products.',
    postedDate: '5 days ago',
    companyLogo: 'https://logo.clearbit.com/atlassian.com',
    skills: ['Product Strategy', 'Agile', 'User Stories', 'Market Research']
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'Docker',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: 155000,
    salaryRange: '$140k - $170k/year',
    description: 'Help us build and maintain our cloud infrastructure and CI/CD pipelines.',
    postedDate: '1 day ago',
    companyLogo: 'https://logo.clearbit.com/docker.com',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform']
  },
  {
    id: '6',
    title: 'Data Scientist',
    company: 'Tableau',
    location: 'Boston, MA',
    type: 'Full-time',
    salary: 145000,
    salaryRange: '$130k - $160k/year',
    description: 'Use data to drive business decisions and build machine learning models to solve complex problems.',
    postedDate: '1 week ago',
    companyLogo: 'https://logo.clearbit.com/tableau.com',
    skills: ['Python', 'Machine Learning', 'Pandas', 'SQL']
  },
  {
    id: '7',
    title: 'Mobile App Developer',
    company: 'Uber',
    location: 'Chicago, IL',
    type: 'Full-time',
    salary: 135000,
    salaryRange: '$120k - $150k/year',
    description: 'Build and maintain our cross-platform mobile applications using React Native.',
    postedDate: '4 days ago',
    companyLogo: 'https://logo.clearbit.com/uber.com',
    skills: ['React Native', 'JavaScript', 'iOS', 'Android']
  },
  {
    id: '8',
    title: 'Cloud Solutions Architect',
    company: 'Microsoft',
    location: 'Redmond, WA',
    type: 'Full-time',
    salary: 190000,
    salaryRange: '$170k - $210k/year',
    description: 'Design and implement cloud solutions for enterprise clients on Azure.',
    postedDate: '1 week ago',
    companyLogo: 'https://logo.clearbit.com/microsoft.com',
    skills: ['Azure', 'Cloud Architecture', 'DevOps', 'Networking']
  }
];

const JobTracker = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [filters, setFilters] = useState({
    jobTitle: '',
    employmentType: '',
    minSalary: ''
  });

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      jobTitle: '',
      employmentType: '',
      minSalary: ''
    });
    setSearchQuery('');
  };

  // Apply filters to jobs
  useEffect(() => {
    if (jobs.length === 0) return;

    let results = [...jobs];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters.jobTitle) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(filters.jobTitle.toLowerCase())
      );
    }
    
    if (filters.employmentType) {
      results = results.filter(job => 
        job.type.toLowerCase().includes(filters.employmentType.toLowerCase())
      );
    }
    
    if (filters.minSalary) {
      const minSalary = parseInt(filters.minSalary.replace(/\D/g, ''));
      if (!isNaN(minSalary)) {
        results = results.filter(job => job.salary >= minSalary);
      }
    }

    setFilteredJobs(results);
  }, [jobs, searchQuery, filters]);

  // Load jobs
  useEffect(() => {
    const timer = setTimeout(() => {
      setJobs(mockJobs);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveJob = (e, jobId) => {
    e.stopPropagation();
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };



  const JobCard = ({ job }) => {
    const [saved, setSaved] = useState(false);
    const companyInitial = job.company ? job.company.charAt(0).toUpperCase() : 'C';

    const toggleSave = (e) => {
      e.stopPropagation();
      setSaved(!saved);
    };

    return (
      <motion.div 
        className="job-card"
        whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      >
        <div className="job-card-content">
          <div className="job-header">
            <div className="company-logo">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.company} />
              ) : (
                <span style={{ fontSize: '1.2rem', fontWeight: 600, color: '#64748b' }}>
                  {companyInitial}
                </span>
              )}
            </div>
            <div className="job-title-company">
              <h3 className="job-title">{job.title}</h3>
              <p className="company-name">{job.company}</p>
            </div>
          </div>
          
          <div className="job-meta">
            <span className="job-location">
              <FiMapPin className="icon" /> {job.location}
            </span>
            <span className="job-salary">
              <FiDollarSign className="icon" /> {job.salary}
            </span>
            <span className="job-type">
              <FiBriefcase className="icon" /> {job.type}
            </span>
          </div>
          
          <div className="job-description">
            {job.description}
          </div>
          
          <div className="job-skills">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
            {job.skills.length > 3 && (
              <span className="skill-tag">+{job.skills.length - 3} more</span>
            )}
          </div>
          
          <div className="job-actions">
            <button className="apply-btn">
              Apply Now
            </button>
            <button 
              className={`save-btn ${saved ? 'saved' : ''}`}
              onClick={toggleSave}
              aria-label={saved ? 'Unsave job' : 'Save job'}
            >
              <FiBookmark className="save-icon" />
              <span className="save-text">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="job-tracker-container">
      <div className="main-content" style={{ width: '100%' }}>
        <header className="header">
          <h1>Find your dream job</h1>
          <p>Search through thousands of jobs and find the perfect match</p>
          
          <div className="search-container">
            <div className="search-bar">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for jobs, companies, or keywords"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="filter-fields">
                <div className="filter-field">
                  <input
                    type="text"
                    name="jobTitle"
                    placeholder="Job Title"
                    value={filters.jobTitle}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <div className="filter-field">
                  <select
                    name="employmentType"
                    value={filters.employmentType}
                    onChange={handleFilterChange}
                  >
                    <option value="">Employment Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                </div>
                
                <div className="filter-field">
                  <input
                    type="text"
                    name="minSalary"
                    placeholder="Min Salary"
                    value={filters.minSalary}
                    onChange={handleFilterChange}
                  />
                </div>
                
                <button className="clear-btn" onClick={clearFilters}>
                  Clear
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="job-listings">
          <h2 className="listings-header">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            {searchQuery && ` for "${searchQuery}"`}
          </h2>
          
          {isLoading ? (
            <div className="job-cards">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="job-card-skeleton">
                  <Skeleton height={24} width="60%" />
                  <Skeleton height={16} width="40%" style={{ marginTop: '0.5rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <Skeleton height={24} width={80} />
                    <Skeleton height={24} width={80} />
                    <Skeleton height={24} width={80} />
                  </div>
                  <Skeleton height={16} count={2} style={{ marginTop: '1rem' }} />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <Skeleton height={40} width={120} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="job-cards">
              {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="no-jobs">
              <h3>No jobs found</h3>
              <p>Try adjusting your search query or filters to find more jobs.</p>
            </div>
          )}
        </main>
      </div>
      
      <style jsx>{`
        .job-tracker-container {
          min-height: 100vh;
          background-color: #f8fafc;
          padding: 1rem 0;
          width: 100%;
          box-sizing: border-box;
          overflow-x: hidden;
        }
        
        .main-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0;
          width: 100%;
          box-sizing: border-box;
        }
        
        .header {
          margin-bottom: 2rem;
        }
        
        .header h1 {
          font-size: 2rem;
          color: #0f172a;
          margin: 0 0 0.5rem 0;
        }
        
        .job-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
          transition: color 0.2s ease;
        }
        
        .job-card:hover .job-title {
          color: #2563eb;
        }
        
        .header p {
          color: #64748b;
          margin: 0 0 2rem 0;
        }
        
        .search-container {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .search-bar {
          display: flex;
          align-items: center;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.5rem 1rem;
          width: 100%;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        
        .search-bar input {
          color: #334155;
          background: transparent;
          border: none;
          width: 100%;
          font-size: 1rem;
        }
        
        .search-bar input:focus {
          outline: none;
        }
        
        .search-bar input::placeholder {
          color: #94a3b8;
          opacity: 1;
        }
        
        .filter-fields {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 1rem;
        }
        
        .filter-field {
          flex: 1;
          min-width: 150px;
        }
        
        .filter-field input,
        .filter-field select {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 0.9rem;
          color: #334155;
          background-color: white;
        }
        
        .filter-field select {
          appearance: none;
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1em;
          padding-right: 2.5rem;
        }
        
        .clear-btn {
          padding: 0.6rem 1.25rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .clear-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        
        .job-cards {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin: 1.5rem 1rem;
          width: 95%;
          max-width: 1200px;
          box-sizing: border-box;
          padding: 0 0.5rem;
        }
        
        .job-card-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
        }
        
        .job-header {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1rem;
        }
        
        .company-logo {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 1rem;
          overflow: hidden;
          border: 1px solid #f1f5f9;
          flex-shrink: 0;
        }
        
        .company-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .company-logo img {
          width: 32px;
          height: 32px;
          object-fit: contain;
        }
        
        .job-title-company {
          flex: 1;
        }
        
        .job-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f1f5f9;
        }
        
        @media (max-width: 1000px) {
          .job-cards {
            grid-template-columns: 1fr;
            max-width: 600px;
            gap: 1.25rem;
            width: 95%;
          }
          
          .job-card {
            width: 100%;
          }
          
          .filter-fields {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          
          .filter-field {
            flex: 1 1 45%;
            min-width: 0;
          }
          
          .clear-btn {
            width: auto;
            margin-top: 0;
            flex: 1 1 100%;
          }
        }
        
        @media (max-width: 480px) {
          .job-cards {
            width: calc(100% - 1rem);
            padding: 0 0.5rem;
          }
          
          .filter-field {
            flex: 1 1 100%;
          }
        }
        
        .job-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          position: relative;
          border: 1px solid #f0f2f5;
          overflow: hidden;
        }
        
        .job-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .save-btn {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          color: #64748b;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          height: 40px;
          border-radius: 8px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          white-space: nowrap;
        }
        
        .save-btn:hover {
          background: #e2e8f0;
          color: #475569;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .save-btn.saved {
          color: #ef4444;
          background: #fee2e2;
          border-color: #fecaca;
        }
        
        .save-icon {
          font-size: 1.1em;
        }
        
        .save-text {
          font-size: 0.95em;
        }
        
        .save-btn.saved:hover {
          background: #fecaca;
        }
        
        .job-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
          color: #64748b;
          font-size: 0.85rem;
          width: 100%;
        }
        
        .job-description {
          color: #475569;
          margin-bottom: 0.8rem;
          flex-grow: 1;
          font-size: 0.8rem;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .job-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: auto;
          width: 100%;
        }
        
        .skill-tag {
          background: #f8fafc;
          color: #334155;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        
        .skill-tag:hover {
          background: #e0f2fe;
          border-color: #bae6fd;
          color: #0369a1;
        }
        
        .apply-btn {
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.6rem 1.25rem;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
        }
        
        .apply-btn:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
        }
        
        .job-card-skeleton {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default JobTracker;
