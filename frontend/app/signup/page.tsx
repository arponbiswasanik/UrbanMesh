"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Reveal from '../components/Reveal';
import { useAuth } from '../context/AuthContext';

export default function SignUpPage() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/map');
    }
  }, [isAuthenticated, router]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create account.");
      }

      login(data.access_token);
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push('/map');
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row overflow-hidden">
      
      {/* Left Side - Branding & Visuals */}
      <div className="relative hidden md:flex md:w-1/2 bg-zinc-900 flex-col justify-between p-12 border-r border-white/5 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>
        
        <Link href="/" className="relative z-10 flex items-center gap-2 group w-fit">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-2xl font-bold tracking-tight">UrbanMesh</span>
        </Link>

        <div className="relative z-10">
          <Reveal>
            <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
              Join the <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Urban Movement
              </span>
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-gray-400 text-lg max-w-md">
              Create an account to report issues, track community progress, and make your city a better place.
            </p>
          </Reveal>
        </div>

        <div className="relative z-10 text-sm text-gray-600">
          © 2024 UrbanMesh. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 group md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-xl font-bold tracking-tight">UrbanMesh</span>
        </Link>

        <div className="w-full max-w-md mt-10 md:mt-0">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Welcome to UrbanMesh!</h2>
              <p className="text-gray-400 text-center">Account created successfully. Redirecting to your map...</p>
            </div>
          ) : (
            <>
              <Reveal>
                <h1 className="text-3xl font-bold mb-2">Create Account</h1>
                <p className="text-gray-400 mb-8">Fill in your details to get started.</p>
              </Reveal>

              <Reveal delay={100}>
                <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                  {/* Full Name Input */}
                  <div className="relative">
                    <input 
                      type="text" 
                      id="fullName" 
                      placeholder=" " 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                      className="peer w-full bg-white/5 border border-white/10 rounded-lg px-4 pt-5 pb-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-shown:pt-3"
                    />
                    <label 
                      htmlFor="fullName" 
                      className="absolute left-4 top-3.5 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Full Name
                    </label>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <input 
                      type="email" 
                      id="email" 
                      placeholder=" " 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                      className="peer w-full bg-white/5 border border-white/10 rounded-lg px-4 pt-5 pb-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-shown:pt-3"
                    />
                    <label 
                      htmlFor="email" 
                      className="absolute left-4 top-3.5 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Email Address
                    </label>
                  </div>

                  {/* Password Input */}
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      placeholder=" " 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="peer w-full bg-white/5 border border-white/10 rounded-lg px-4 pt-5 pb-2 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-shown:pt-3"
                    />
                    <label 
                      htmlFor="password" 
                      className="absolute left-4 top-3.5 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Password
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </button>
                  </div>

                  {/* Confirm Password Input */}
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      id="confirmPassword" 
                      placeholder=" " 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      className="peer w-full bg-white/5 border border-white/10 rounded-lg px-4 pt-5 pb-2 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder-shown:pt-3"
                    />
                    <label 
                      htmlFor="confirmPassword" 
                      className="absolute left-4 top-3.5 text-gray-400 pointer-events-none transition-all duration-200 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-400 peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:text-xs"
                    >
                      Confirm Password
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg text-center animate-fadeInUp">
                      {error}
                    </div>
                  )}

                  {/* Sign Up Button */}
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold mt-2 transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Divider */}
                  <div className="flex items-center my-2">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="px-3 text-gray-500 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  {/* Google Button */}
                  <button 
                    type="button"
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </form>
              </Reveal>

              <Reveal delay={200}>
                <p className="text-center text-gray-400 text-sm mt-8">
                  Already have an account?{' '}
                  <Link href="/signin" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                    Sign In
                  </Link>
                </p>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </div>
  );
}