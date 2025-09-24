import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      await forgotPassword(email);
      setMessage('Un email de réinitialisation a été envoyé à votre adresse email.');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">
              <div className="logo-icon">✓</div>
            </div>
            <h1 className="app-title">TaskFlow</h1>
            <p className="app-subtitle">Récupération de mot de passe</p>
          </div>

          <div className="auth-form-container">
            <h2 className="form-title">Mot de passe oublié</h2>
            <p className="form-subtitle">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

            {error && <div className="error-message">{error}</div>}
            {message && <div className="success-message">{message}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                <Link to="/login">Retour à la connexion</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;