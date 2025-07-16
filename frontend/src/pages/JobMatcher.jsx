import { useState } from 'react';
import { motion } from 'framer-motion';
import '../Home.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, type: 'spring', stiffness: 60 }
  })
};

// Helper: extract keywords from text (simple split, remove stopwords, dedupe)
const stopwords = new Set(['the','and','a','an','to','of','in','on','for','with','by','at','is','are','as','be','from','that','this','it','our','we','you','your','us','will','must','have','has','was','were','or','but','if','then','so','not','can','should','may','do','does','did','using','used','into','out','about','over','under','more','less','than','such','these','those','their','which','who','what','when','where','how','why','all','any','each','other','some','most','many','much','very','just','also','too','both','either','neither','own','same','new','now','after','before','again','once']);
function extractKeywords(text) {
  if (!text) return [];
  return Array.from(new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w && !stopwords.has(w))
  ));
}

// Simulate fetching user profile (in real app, use context or props)
const getUserProfile = () => {
  return JSON.parse(localStorage.getItem('userProfile')) || {
    dreamJobs: [],
    activeDreamJobId: null,
    resumes: [
      { id: 1, name: 'Software Engineer Resume', score: 87, keywords: ['React', 'Node.js', 'Python'] },
      { id: 2, name: 'Product Manager Resume', score: 92, keywords: ['Product', 'Agile', 'Analytics'] },
      { id: 3, name: 'Data Scientist Resume', score: 78, keywords: ['Python', 'ML', 'SQL'] }
    ]
  };
};

// Simulated jobs (in real app, fetch from API based on dream job)
const JOBS = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120,000 - $150,000',
    description: 'Join our team building scalable web applications using React and Node.js. Experience with AWS and TypeScript is a plus.',
    tools: ['React', 'Node.js', 'AWS', 'TypeScript']
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$100,000 - $130,000',
    description: 'Drive innovation and user experience. Must have experience in Agile and analytics.',
    tools: ['Product Strategy', 'Agile', 'User Research', 'Analytics']
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataFlow Solutions',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$110,000 - $140,000',
    description: 'Build predictive models and data-driven solutions. Strong Python and ML background required.',
    tools: ['Python', 'Machine Learning', 'SQL', 'Statistics']
  }
];

export default function JobMatcher() {
  const [userProfile] = useState(getUserProfile());
  const activeDreamJob = userProfile.dreamJobs?.find(j => j.id === userProfile.activeDreamJobId);
  const resumes = userProfile.resumes || [];

  // Find best resume for a job (by keyword overlap)
  const getBestResume = (job) => {
    let best = null, bestScore = -1;
    for (const resume of resumes) {
      const overlap = resume.keywords.filter(k => job.tools.includes(k)).length;
      if (overlap > bestScore) {
        best = resume;
        bestScore = overlap;
      }
    }
    return best;
  };

  // Calculate match rate (title 30%, skills 60%, location 10%)
  const getMatchRate = (job, resume) => {
    if (!resume) return 0;
    // --- Job Title Match (30%) ---
    let titleScore = 0;
    const userDreamTitle = activeDreamJob && activeDreamJob.title ? activeDreamJob.title.toLowerCase() : '';
    const jobTitle = (job.title || '').toLowerCase();
    if (userDreamTitle && jobTitle) {
      if (jobTitle === userDreamTitle) {
        titleScore = 30;
      } else if (jobTitle.includes(userDreamTitle) || userDreamTitle.includes(jobTitle)) {
        titleScore = 20;
      } else {
        // Partial word overlap (at least one word in common)
        const userWords = userDreamTitle.split(/\s+/);
        const jobWords = jobTitle.split(/\s+/);
        if (userWords.some(w => jobWords.includes(w))) {
          titleScore = 10;
        }
      }
    }

    // --- Tools/Skills Match (60%) ---
    const found = job.tools.filter(tool => resume.keywords.includes(tool));
    const toolsScore = (found.length / job.tools.length) * 60;

    // --- Location Match (10%) ---
    let locationScore = 0;
    const userLoc = (userProfile.meta && userProfile.meta.location) ? userProfile.meta.location.toLowerCase() : '';
    const jobLoc = (job.location || '').toLowerCase();
    if (userLoc && jobLoc) {
      if (userLoc === jobLoc) {
        locationScore = 10;
      } else if (userLoc.split(',')[1] && jobLoc.split(',')[1] && userLoc.split(',')[1].trim() === jobLoc.split(',')[1].trim()) {
        // Same state/region
        locationScore = 5;
      }
    }

    // --- Final Weighted Score ---
    const total = Math.round(titleScore + toolsScore + locationScore);
    return total;
  };

  return (
    <div className="js-home teal-home">
      {/* Hero Section */}
      <motion.section className="teal-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <motion.div className="teal-hero-content" variants={fadeInUp} custom={1}>
          <motion.h1 variants={fadeInUp} custom={1}>Job Matcher</motion.h1>
          <motion.p variants={fadeInUp} custom={2}>See jobs that match your activated dream job and how well your resume fits each one.</motion.p>
        </motion.div>
        <motion.div className="teal-hero-image" variants={fadeInUp} custom={2}>
          <img src="https://placehold.co/400x260?text=Job+Matcher" alt="Job Matcher" />
        </motion.div>
      </motion.section>
      <div className="js-job-match-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1rem' }}>
        <div className="js-job-match-header">
          <h2>Dream Job Matches</h2>
          <p>
            {activeDreamJob
              ? <>Matching jobs based on your dream job: <b>{activeDreamJob.title}</b></>
              : <>Please add and activate a dream job in your profile to get personalized matches.</>}
          </p>
        </div>
        {!activeDreamJob ? (
          <div style={{ color: '#dc2626', background: '#fef2f2', padding: 16, borderRadius: 8, marginBottom: 24 }}>
            No active dream job set. Go to your profile and add/activate a dream job to use this feature.
          </div>
        ) : (
          <div className="js-jobs-grid">
            {JOBS.map(job => {
              const bestResume = getBestResume(job);
              const matchRate = getMatchRate(job, bestResume);
              return (
                <motion.div key={job.id} className="js-job-card teal-feature-card" variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={job.id}>
                  <div className="js-job-title" style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 4 }}>{job.title}</div>
                  <div className="js-job-company" style={{ color: '#319795', fontWeight: 600 }}>{job.company}</div>
                  <div className="js-job-location" style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 8 }}>{job.location} • {job.type}</div>
                  <div style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: 8 }}>{job.description}</div>
                  <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}><b>Required Tools:</b> {job.tools.map(tool => <span key={tool} className="js-job-tag" style={{ marginRight: 6, marginBottom: 6 }}>{tool}</span>)}</div>
                  <div className="js-job-match-score" style={{ marginBottom: 8 }}>
                    <span className="js-match-percentage" style={{ fontWeight: 700, color: matchRate > 70 ? '#38b2ac' : '#e53e3e' }}>{matchRate}% Match</span>
                  </div>
                  {bestResume && <div style={{ color: '#2563eb', fontSize: '0.95rem' }}><b>Best Resume:</b> {bestResume.name}</div>}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
