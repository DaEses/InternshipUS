import { motion } from 'framer-motion';
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

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { delay: i * 0.12, duration: 0.7 }
  })
};

export default function Home() {
  return (
    <div className="js-home teal-home">
      {/* Decorative splashes */}
      <span className="splash-dot splash-yellow"></span>
      <span className="splash-dot splash-blue"></span>
      {/* Hero Section */}
      <motion.section className="teal-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <motion.div className="teal-hero-content" variants={fadeInUp} custom={1}>
          <motion.h1 variants={fadeInUp} custom={1}>Land Your Dream Job Faster</motion.h1>
          <motion.p variants={fadeInUp} custom={2}>Supercharge your resume, get personalized feedback, and stand out to recruiters with AI-powered tools.</motion.p>
          <motion.a href="/scan" className="teal-cta" variants={fadeInUp} custom={3} role="button" tabIndex={0}>Get Started Free</motion.a>
        </motion.div>
        <motion.div className="teal-hero-image" variants={fadeInUp} custom={2}>
          {/* Modern SVG illustration for resume */}
          <svg viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="20" width="180" height="120" rx="18" fill="#d9e4ec"/>
            <rect x="40" y="40" width="140" height="80" rx="10" fill="#b7cfdc"/>
            <rect x="60" y="60" width="100" height="12" rx="6" fill="#e9eaec"/>
            <rect x="60" y="80" width="60" height="10" rx="5" fill="#b7cfdc"/>
            <circle cx="170" cy="110" r="12" fill="#b7cfdc"/>
            <path d="M165 110l5 5 10-10" stroke="#333652" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="60" cy="50" r="3" fill="#b7cfdc"/>
            <circle cx="80" cy="50" r="3" fill="#e9eaec"/>
            <circle cx="100" cy="50" r="3" fill="#b7cfdc"/>
            <g>
              <circle cx="200" cy="30" r="4" fill="#b7cfdc"/>
              <circle cx="30" cy="130" r="4" fill="#e9eaec"/>
            </g>
          </svg>
        </motion.div>
      </motion.section>

      {/* Trusted By Section */}
      <motion.section className="teal-trusted" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
        <motion.h2 variants={fadeIn} custom={1}>Trusted by professionals from</motion.h2>
        <motion.div className="teal-logos-row" variants={fadeIn} custom={2}>
          {/* Company logos: Amazon, Google, Meta, Microsoft, Netflix */}
          <OptimizedImage 
            src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" 
            alt="Amazon" 
            height={40} 
            style={{background:'white', borderRadius:'8px', padding:'4px 12px'}} 
            loading="lazy"
          />
          <OptimizedImage 
            src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
            alt="Google" 
            height={40} 
            style={{background:'white', borderRadius:'8px', padding:'4px 12px'}} 
            loading="lazy"
          />
          <OptimizedImage 
            src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" 
            alt="Meta" 
            height={40} 
            style={{background:'white', borderRadius:'8px', padding:'4px 12px'}} 
            loading="lazy"
          />
          <OptimizedImage 
            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
            alt="Microsoft" 
            height={40} 
            style={{background:'white', borderRadius:'8px', padding:'4px 12px'}} 
            loading="lazy"
          />
          <OptimizedImage 
            src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" 
            alt="Netflix" 
            height={40} 
            style={{background:'white', borderRadius:'8px', padding:'4px 12px'}} 
            loading="lazy"
          />
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section className="teal-how-it-works" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <motion.h2 variants={fadeInUp} custom={1}>How It Works</motion.h2>
        <div className="teal-steps">
          {[{
            icon: '1️⃣', title: 'Upload Your Resume', desc: 'Drag & drop or upload your resume in seconds.'
          },{
            icon: '2️⃣', title: 'Scan & Analyze', desc: 'Get instant feedback and actionable suggestions.'
          },{
            icon: '3️⃣', title: 'Tailor for Each Job', desc: 'Customize your resume for every application.'
          },{
            icon: '4️⃣', title: 'Track Your Progress', desc: 'See your improvements and job matches over time.'
          }].map((step, i) => (
            <motion.div className="teal-step" key={step.title} variants={fadeInUp} custom={i+1} whileHover={{ scale: 1.05 }}>
              <div className="teal-step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section className="teal-features" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <motion.h2 variants={fadeInUp} custom={1}>Powerful Features</motion.h2>
        <div className="teal-feature-cards">
          {[{
            img: 'ATS', title: 'ATS Compatibility', desc: 'Ensure your resume passes automated screeners used by top companies.'
          },{
            img: 'Score', title: 'Resume Scoring', desc: 'Get a detailed score and see exactly where to improve.'
          },{
            img: 'AI', title: 'AI Tailoring', desc: 'Receive personalized suggestions for every job you apply to.'
          },{
            img: 'Insights', title: 'Actionable Insights', desc: 'Track your job search and optimize your strategy with data.'
          }].map((feature, i) => (
            <motion.div className="teal-feature-card" key={feature.title} variants={fadeInUp} custom={i+1} whileHover={{ scale: 1.07 }}>
              {/* Feature SVG icons */}
              {feature.img === 'ATS' && (
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="56" height="56" rx="14" fill="#d9e4ec"/>
                  <path d="M18 28l8 8 12-14" stroke="#b7cfdc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="14" y="14" width="28" height="28" rx="8" stroke="#b7cfdc" strokeWidth="2"/>
                </svg>
              )}
              {feature.img === 'Score' && (
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="56" height="56" rx="14" fill="#b7cfdc"/>
                  <circle cx="28" cy="28" r="14" fill="#d9e4ec"/>
                  <path d="M28 14v14l10 10" stroke="#333652" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {feature.img === 'AI' && (
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="56" height="56" rx="14" fill="#d9e4ec"/>
                  <path d="M28 18l4 8h8l-6.5 5.5L36 42l-8-5-8 5 2.5-10.5L12 26h8l4-8z" fill="#b7cfdc" stroke="#333652" strokeWidth="2"/>
                </svg>
              )}
              {feature.img === 'Insights' && (
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="56" height="56" rx="14" fill="#b7cfdc"/>
                  <rect x="16" y="32" width="6" height="8" rx="2" fill="#d9e4ec"/>
                  <rect x="25" y="24" width="6" height="16" rx="2" fill="#333652"/>
                  <rect x="34" y="20" width="6" height="20" rx="2" fill="#d9e4ec"/>
                </svg>
              )}
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Benefits Section */}
      <section className="teal-benefits">
        {[{
          title: 'Get More Interviews',
          desc: 'Our users see a 3x increase in interview callbacks by optimizing their resumes with our tools.',
          img: 'Interviews',
          reverse: false
        },{
          title: 'Stand Out to Recruiters',
          desc: 'Highlight your strengths and get noticed by top employers with tailored suggestions.',
          img: 'Recruiters',
          reverse: true
        }].map((benefit, i) => (
          <motion.div
            className={`teal-benefit-row${benefit.reverse ? ' reverse' : ''}`}
            key={benefit.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            custom={i+1}
          >
            <motion.div className="teal-benefit-text" variants={fadeInUp} custom={1}>
              <h2>{benefit.title}</h2>
              <p>{benefit.desc}</p>
            </motion.div>
            <motion.div className="teal-benefit-image" variants={fadeInUp} custom={2}>
              {/* SVG illustrations for benefits */}
              {benefit.img === 'Interviews' && (
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="56" fill="#d9e4ec" stroke="#b7cfdc" strokeWidth="4"/>
                  <rect x="35" y="50" width="50" height="30" rx="10" fill="#b7cfdc"/>
                  <circle cx="60" cy="65" r="10" fill="#333652"/>
                  <rect x="50" y="80" width="20" height="8" rx="4" fill="#d9e4ec"/>
                  <path d="M60 40v10" stroke="#333652" strokeWidth="3" strokeLinecap="round"/>
                  <circle cx="60" cy="40" r="6" fill="#b7cfdc"/>
                </svg>
              )}
              {benefit.img === 'Recruiters' && (
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="60" r="56" fill="#b7cfdc" stroke="#d9e4ec" strokeWidth="4"/>
                  <rect x="40" y="60" width="40" height="20" rx="8" fill="#d9e4ec"/>
                  <circle cx="60" cy="60" r="12" fill="#333652"/>
                  <path d="M60 48l6 12h-12l6-12z" fill="#b7cfdc"/>
                  <rect x="54" y="80" width="12" height="8" rx="4" fill="#b7cfdc"/>
                </svg>
              )}
            </motion.div>
          </motion.div>
        ))}
      </section>

      {/* Testimonials Section */}
      <motion.section className="teal-testimonials" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <motion.h2 variants={fadeInUp} custom={1}>What Our Users Say</motion.h2>
        <div className="teal-testimonial-cards">
          {[{
            name: 'Sarah J.', quote: '“This platform helped me land my dream job in just 2 months!”', img: 'User1'
          },{
            name: 'Mike T.', quote: '“The resume feedback is spot on and super actionable.”', img: 'User2'
          },{
            name: 'Priya S.', quote: '“I love the clean design and how easy it is to use.”', img: 'User3'
          }].map((user, i) => (
            <motion.div className="teal-testimonial-card" key={user.name} variants={fadeInUp} custom={i+1} whileHover={{ scale: 1.05 }}>
              {/* SVG avatar for testimonials */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="32" fill={i % 2 === 0 ? '#d9e4ec' : '#b7cfdc'} />
                <circle cx="32" cy="28" r="12" fill="#333652"/>
                <ellipse cx="32" cy="48" rx="14" ry="8" fill="#b7cfdc"/>
                <ellipse cx="32" cy="48" rx="10" ry="5" fill="#d9e4ec"/>
              </svg>
              <blockquote>{user.quote}</blockquote>
              <div className="teal-user-name">{user.name}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section className="teal-cta-section" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <motion.h2 variants={fadeInUp} custom={1}>Ready to Get Started?</motion.h2>
        <motion.p variants={fadeInUp} custom={2}>Join thousands of job seekers optimizing their careers today.</motion.p>
        <motion.a href="/scan" className="teal-cta large" variants={fadeInUp} custom={3}>Start Free Resume Scan</motion.a>
      </motion.section>

      {/* FAQ Section */}
      <motion.section className="teal-faq" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
        <motion.h2 variants={fadeInUp} custom={1}>Frequently Asked Questions</motion.h2>
        <div className="teal-faq-list">
          {[{
            q: 'Is this really free?',
            a: 'Yes! You can scan and optimize your resume for free. Premium features are available for advanced users.'
          },{
            q: 'How does the resume scan work?',
            a: 'We use advanced AI and ATS algorithms to analyze your resume and provide actionable feedback.'
          },{
            q: 'Will my data be private?',
            a: 'Absolutely. Your data is encrypted and never shared with third parties.'
          },{
            q: 'Can I use this for any job?',
            a: 'Yes, our tools work for any industry and job type.'
          }].map((faq, i) => (
            <motion.div className="teal-faq-item" key={faq.q} variants={fadeInUp} custom={i+1}>
              {/* FAQ icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight: '8px', verticalAlign: 'middle'}} xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="12" fill={i % 2 === 0 ? '#d9e4ec' : '#b7cfdc'} />
                <text x="12" y="17" textAnchor="middle" fontSize="14" fill="#333652" fontFamily="Inter, Arial, sans-serif">?</text>
              </svg>
              <h3 style={{display: 'inline'}}>{faq.q}</h3>
              <p>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}