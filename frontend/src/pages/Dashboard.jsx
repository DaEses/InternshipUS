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
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            icon={<FiBriefcase className="h-6 w-6" />}
            color="blue"
            loading={loading}
          />
          <StatCard
            title="Interviews"
            value={stats.interviews}
            icon={<FiCalendar className="h-6 w-6" />}
            color="green"
            loading={loading}
          />
          <StatCard
            title="Offers"
            value={stats.offers}
            icon={<FiCheckCircle className="h-6 w-6" />}
            color="purple"
            loading={loading}
          />
          <StatCard
            title="Saved Jobs"
            value={stats.savedJobs}
            icon={<FiBookmark className="h-6 w-6" />}
            color="yellow"
            loading={loading}
          />
        </div>

        {/* Recent Applications */}
        <div className="mt-10">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Recent Applications
          </h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <ul className="divide-y divide-gray-200">
              {[1, 2, 3].map((job) => (
                <JobCard
                  key={job}
                  title={`Software Engineer ${job}`}
                  company={`Tech Company ${job}`}
                  location="San Francisco, CA"
                  type="Full-time"
                  salary="$120,000 - $150,000"
                  match={85 + job * 5}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color, loading }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${colorClasses[color]}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dt className="text-sm font-medium text-gray-500 truncate">
              {title}
            </dt>
            {loading ? (
              <dd className="mt-1 text-2xl font-semibold text-gray-900 animate-pulse">
                --
              </dd>
            ) : (
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {value}
              </dd>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ title, company, location, type, salary, match }) => {
  return (
    <li>
      <div className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-600 truncate">
              {title}
            </p>
            <div className="ml-2 flex-shrink-0 flex">
              <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                {match}% Match
              </p>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="sm:flex">
              <p className="flex items-center text-sm text-gray-500">
                {company}
              </p>
              <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                {location}
              </p>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <p>
                {type} • {salary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

export default Dashboard;
