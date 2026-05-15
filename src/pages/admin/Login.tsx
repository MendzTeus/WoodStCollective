import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: loginError } = await login(email, password);

    if (loginError) {
      setError(loginError);
      setIsLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <div className="bg-surface-container border border-divider-subtle p-10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Subtle noise/gradient background */}
        <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay pointer-events-none"></div>

        <div className="text-center mb-10 relative z-10">
          <div className="label-caps mb-4 tracking-widest text-text-muted">System Access</div>
          <h1 className="font-display text-4xl font-black italic text-primary">Admin Control.</h1>
          
          {!supabase && (
             <div className="mt-8 p-4 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-lg text-left">
               <p className="font-bold mb-2 uppercase text-xs tracking-wider">Preview Mode Active</p>
               <p className="opacity-80">Supabase is not configured yet. Add the project credentials before signing in.</p>
             </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Identity</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 bg-background-dark/50 focus:bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-all duration-300 text-text-primary"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-text-muted mb-2 uppercase tracking-wider">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!!supabase}
              className="w-full p-4 bg-background-dark/50 focus:bg-background-dark border border-divider-subtle rounded-lg focus:border-primary focus:outline-none transition-all duration-300 text-text-primary"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all mt-4 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? 'Authenticating...' : 'Enter System'}
          </button>
        </form>
      </div>
    </div>
  );
}
