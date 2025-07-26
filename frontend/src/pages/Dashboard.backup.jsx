import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiBriefcase, FiCalendar, FiCheckCircle, FiBookmark } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    offers: 0,
    savedJobs: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setStats({
        applications: 12,
        interviews: 3,
        offers: 1,
        savedJobs: 5,
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {currentUser.displayName || 'User'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Here's what's happening with your job search today
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Applications"
            value={stats.applications}
            icon="📄"
            color="blue"
            loading={loading}
          />
          <StatCard 
            title="Interviews"
            value={stats.interviews}
            icon="🎯"
            color="green"
            loading={loading}
          />
          <StatCard 
            title="Offers"
            value={stats.offers}
            icon="🏆"
            color="purple"
            loading={loading}
          />
          <StatCard 
            title="Saved Jobs"
            value={stats.savedJobs}
            icon="💼"
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Recent Activity */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="btn-text">View All</button>
          </div>
          <div className="activity-list">
            {loading ? (
              <div className="skeleton-activity" />
            ) : (
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-details">
                  <p>You applied for <strong>Frontend Developer</strong> at TechCorp</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Job Matches */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recommended Jobs</h2>
            <button className="btn-text">See All</button>
          </div>
          <div className="jobs-grid">
            {loading ? (
              <div className="skeleton-job-card" />
            ) : (
              <JobCard 
                title="Senior React Developer"
                company="WebTech Solutions"
                location="Remote"
                type="Full-time"
                salary="$90,000 - $120,000"
                match={85}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, loading }) => (
  <div className={`stat-card stat-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <h3>{loading ? '--' : value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

// Job Card Component
const JobCard = ({ title, company, location, type, salary, match }) => (
  <div className="job-card">
    <div className="job-header">
      <div className="company-logo">
        {company.charAt(0).toUpperCase()}
      </div>
      <div className="job-meta">
        <h3>{title}</h3>
        <p className="company-name">{company}</p>
        <div className="job-tags">
          <span className="tag">{location}</span>
          <span className="tag">{type}</span>
          <span className="tag">{salary}</span>
        </div>
      </div>
    </div>
    <div className="job-footer">
      <div className="match-badge">
        <span className="match-percent">{match}%</span> Match
      </div>
      <button className="btn btn-outline">View Details</button>
    </div>
  </div>
);

export default Dashboard;
