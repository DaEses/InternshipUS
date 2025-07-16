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
      {/* Hero Section */}
      <motion.section className="teal-hero" initial="hidden" animate="visible" variants={fadeInUp}>
        <motion.div className="teal-hero-content" variants={fadeInUp} custom={1}>
          <motion.h1 variants={fadeInUp} custom={1}>Land Your Dream Job Faster</motion.h1>
          <motion.p variants={fadeInUp} custom={2}>Supercharge your resume, get personalized feedback, and stand out to recruiters with AI-powered tools.</motion.p>
          <motion.a href="/scan" className="teal-cta" variants={fadeInUp} custom={3} role="button" tabIndex={0}>Get Started Free</motion.a>
        </motion.div>
        <motion.div className="teal-hero-image" variants={fadeInUp} custom={2}>
          <img src="https://placehold.co/420x280?text=Resume+Mockup" alt="Resume mockup" />
        </motion.div>
      </motion.section>

      {/* Trusted By Section */}
      <motion.section className="teal-trusted" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
        <motion.h2 variants={fadeIn} custom={1}>Trusted by professionals from</motion.h2>
        <motion.div className="teal-logos-row" variants={fadeIn} custom={2}>
          {["Google","Meta","Amazon","Microsoft","Netflix"].map((name, i) => (
            <motion.img
              key={name}
              src={`https://placehold.co/100x40?text=${name}`}
              alt={name}
              variants={fadeIn}
              custom={i+1}
              whileHover={{ scale: 1.1 }}
            />
          ))}
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
              <img src={`https://placehold.co/80x80?text=${feature.img}`} alt={feature.img} />
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
              <img src={`https://placehold.co/320x220?text=${benefit.img}`} alt={benefit.img} />
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
              <img src={`https://placehold.co/64x64?text=${user.img}`} alt={user.name} className="teal-avatar" />
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
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}