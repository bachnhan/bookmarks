import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { Lock, Mail, KeyRound, Loader2 } from 'lucide-react';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({ text: 'Check your email for the confirmation link!', type: 'success' });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setMessage({ text: error.message, type: 'error' });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-[#091426]/10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-[1.25rem] bg-[#091426] dark:bg-white flex items-center justify-center shadow-xl shadow-slate-200 dark:shadow-slate-900/50">
            <Lock className="w-8 h-8 text-white dark:text-[#091426]" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-[#091426] dark:text-white mb-2">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            {isSignUp ? 'Sign up to manage your private bookmarks' : 'Sign in to access your private bookmarks'}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#091426] dark:focus:ring-white transition-all text-[15px]"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#091426] dark:focus:ring-white transition-all text-[15px]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl text-sm font-medium ${
                  message.type === 'error'
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-[1.25rem] shadow-sm text-[15px] font-medium text-white bg-[#091426] hover:bg-slate-800 dark:bg-white dark:text-[#091426] dark:hover:bg-slate-100 dark:hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#091426] dark:focus:ring-white dark:focus:ring-offset-slate-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage({ text: '', type: '' });
              }}
              className="text-sm font-medium text-slate-500 hover:text-[#091426] dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
