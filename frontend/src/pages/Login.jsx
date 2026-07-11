import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Trophy, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-dark-950 px-4 py-12 overflow-hidden">
      {/* Decorative radial glows */}
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full glow-accent opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full glow-accent opacity-30 blur-3xl pointer-events-none" />

      {/* Form Container */}
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 to-violet-500 shadow-xl shadow-brand-500/20 mb-4 animate-float">
            <Trophy className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h2>
          <p className="mt-1.5 text-sm text-dark-400">Log in to track your technical interview readiness.</p>
        </div>

        <div className="glass-panel rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-dark-300">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 text-dark-500" size={18} />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl bg-dark-900/50 border border-dark-800 py-3 pl-11 pr-4 text-sm text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-dark-300">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-dark-500" size={18} />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-dark-900/50 border border-dark-800 py-3 pl-11 pr-4 text-sm text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 border border-brand-500/30 shadow-lg shadow-brand-600/10 hover:shadow-brand-500/20 focus:outline-none disabled:bg-brand-800/80 transition-all duration-200"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-dark-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition-colors">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
