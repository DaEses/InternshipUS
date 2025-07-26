import { Link } from 'react-router-dom';
import '../styles/PageNotFound.css';

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <div className="error-container">
        <div className="error-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-message">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="error-actions">
            <Link to="/" className="btn btn-primary">
              Go to Homepage
            </Link>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-outline"
            >
              Go Back
            </button>
          </div>
        </div>
        <div className="error-illustration">
          <svg 
            width="400" 
            height="300" 
            viewBox="0 0 400 300" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="400" height="300" fill="#F8FAFC" />
            <path 
              d="M200 100C155.8 100 120 135.8 120 180C120 224.2 155.8 260 200 260C244.2 260 280 224.2 280 180C280 135.8 244.2 100 200 100ZM200 240C166.9 240 140 213.1 140 180C140 146.9 166.9 120 200 120C233.1 120 260 146.9 260 180C260 213.1 233.1 240 200 240Z" 
              fill="#E2E8F0"
            />
            <path 
              d="M200 140C173.5 140 152 161.5 152 188C152 214.5 173.5 236 200 236C226.5 236 248 214.5 248 188C248 161.5 226.5 140 200 140ZM200 228C177.9 228 160 210.1 160 188C160 165.9 177.9 148 200 148C222.1 148 240 165.9 240 188C240 210.1 222.1 228 200 228Z" 
              fill="#CBD5E1"
            />
            <path 
              d="M200 180C195.6 180 192 176.4 192 172V108C192 103.6 195.6 100 200 100C204.4 100 208 103.6 208 108V172C208 176.4 204.4 180 200 180Z" 
              fill="#94A3B8"
            />
            <path 
              d="M200 200C195.6 200 192 196.4 192 192C192 187.6 195.6 184 200 184C204.4 184 208 187.6 208 192C208 196.4 204.4 200 200 200Z" 
              fill="#94A3B8"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
