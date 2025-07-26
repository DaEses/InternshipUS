import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get('oobCode');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      setMessage('');
      setError('');
      setLoading(true);
      
      // In a real app, you would verify the oobCode and update the password
      // This is a simplified version
      await updatePassword(oobCode, password);
      
      setMessage('Password updated successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err) {
      setError('Failed to reset password: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Your Password</h2>
        <p className="auth-subtitle">Enter your new password below</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter new password"
              minLength="6"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm New Password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm new password"
              minLength="6"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading || !oobCode}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
        
        <div className="auth-footer">
          Remembered your password?{' '}
          <Link to="/login" className="text-primary font-medium">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
