import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { APP_COPY } from '../lib/copy';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // The onAuthStateChange listener in App.tsx handles the redirect
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        
        // If Supabase is configured to auto-confirm, they might be logged in immediately.
        // If not, we show the success state.
        if (data.user && data.session) {
           onLogin();
        } else {
           setIsSuccess(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-white">
        <div className="hidden lg:flex lg:w-1/2 bg-brand-400 p-12 flex-col justify-between">
            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center">
                <div className="h-4 w-4 bg-brand-400 rounded-sm"></div>
            </div>
            <div className="text-zinc-900 font-black uppercase tracking-widest text-[10px]">{APP_COPY.common.copyright}</div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24">
            <div className="max-w-md w-full mx-auto text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-20 w-20 bg-brand-50 rounded-full flex items-center justify-center text-brand-500">
                        <CheckCircle2 size={40} />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-zinc-900 mb-4 uppercase tracking-tighter">{APP_COPY.auth.verificationSentTitle}</h1>
                <p className="text-zinc-500 font-medium mb-10">
                    {APP_COPY.auth.verificationSentSubtitle(email)}
                </p>
                <div className="space-y-4">
                    <Button variant="brand" className="w-full" onClick={() => window.location.reload()}>
                        {APP_COPY.auth.proceedToLogin}
                    </Button>
                    <button 
                        onClick={() => setIsSuccess(false)}
                        className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 mx-auto transition-colors"
                    >
                        <ArrowLeft size={14} /> {APP_COPY.auth.backToSignUp}
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-400 relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
            <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center mb-6">
                <div className="h-4 w-4 bg-brand-400 rounded-sm"></div>
            </div>
            <h2 className="text-4xl font-bold text-zinc-900 max-w-md">
                {APP_COPY.auth.brandingText}
            </h2>
        </div>
        
        <div className="relative z-10 text-zinc-900 font-black uppercase tracking-widest text-[10px]">
            {APP_COPY.common.copyright}
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-300 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 lg:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-zinc-900 mb-2 uppercase tracking-tighter">
              {isLogin ? APP_COPY.auth.loginTitle : APP_COPY.auth.signUpTitle}
            </h1>
            <p className="text-zinc-500 font-medium">
              {isLogin ? APP_COPY.auth.loginSubtitle : APP_COPY.auth.signUpSubtitle}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label={APP_COPY.auth.emailLabel} 
              type="email" 
              placeholder={APP_COPY.auth.emailPlaceholder} 
              icon={<Mail className="h-4 w-4" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label={APP_COPY.auth.passwordLabel} 
              type="password" 
              placeholder={APP_COPY.auth.passwordPlaceholder} 
              icon={<Lock className="h-4 w-4" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {isLogin && (
              <div className="flex justify-end">
                <a href="#" className="text-[11px] font-black uppercase tracking-widest text-zinc-400 hover:text-brand-600 transition-colors">
                  {APP_COPY.auth.recoveryMode}
                </a>
              </div>
            )}

            <Button type="submit" variant="brand" className="w-full" size="lg" isLoading={isLoading}>
              {isLogin ? APP_COPY.auth.loginButton : APP_COPY.auth.signUpButton} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8 text-center text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-widest">
              {isLogin ? APP_COPY.auth.noAccess : APP_COPY.auth.existingOperator}
            </span>
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="font-black text-zinc-900 hover:text-brand-600 uppercase tracking-widest ml-1"
            >
              {isLogin ? APP_COPY.auth.signUpLink : APP_COPY.auth.loginLink}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};