"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Reveal from '../components/Reveal';

export default function SettingsPage() {
  const { isAuthenticated, isLoading, user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isProfileSuccess, setIsProfileSuccess] = useState(false);

  const [notifReports, setNotifReports] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    } else if (user) {
      setFullName(user.full_name);
      setEmail(user.email);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>; 
  }

  if (!user) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Error loading settings.</div>; 
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    const token = localStorage.getItem('urbanmesh_token');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ full_name: fullName, email })
      });
      if (res.ok) {
        const data = await res.json();
        updateUser(data);
        setIsProfileSuccess(true);
        setTimeout(() => setIsProfileSuccess(false), 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = () => {
    logout();
    router.push('/');
  };

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* Dashboard Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xl font-bold tracking-tight">UrbanMesh</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">Profile</Link>
            <Link href="/reports" className="text-sm text-gray-400 hover:text-white transition-colors">Reports</Link>
            <Link href="/settings" className="text-sm text-white hover:text-gray-300 transition-colors">Settings</Link>
            <Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">Open Map</Link>
          </div>
        </div>
      </nav>

      {/* Main Content - Vertical Layout */}
      <main className="pb-12 px-6 lg:px-8 max-w-3xl mx-auto" style={{ paddingTop: '8rem' }}>
        
        <Reveal>
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
        </Reveal>

        <div className="flex flex-col gap-8 w-full">
          
          {/* 1. Account Settings */}
          <Reveal>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl w-full">
              <h2 className="text-xl font-bold mb-6">Account Settings</h2>
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400 font-medium">Full Name</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400 font-medium">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isSavingProfile}
                  className={`w-full h-12 px-4 rounded-xl text-sm font-semibold text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 mt-2
                    ${isSavingProfile 
                      ? 'bg-blue-600/80 shadow-blue-500/20 cursor-wait' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer'
                    }`}
                >
                  {isSavingProfile ? 'Saving...' : isProfileSuccess ? 'Saved!' : 'Save Changes'}
                </button>
              </form>
            </div>
          </Reveal>

          {/* 2. Appearance */}
          <Reveal delay={100}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl w-full">
              <h2 className="text-xl font-bold mb-6">Appearance</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-2 opacity-50 cursor-not-allowed">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  </div>
                  <span className="text-sm font-medium">Light Mode</span>
                  <span className="text-xs text-gray-500">Coming Soon</span>
                </div>
                <div className="bg-white/5 border border-blue-500/50 rounded-xl p-4 flex flex-col items-center gap-2 cursor-pointer">
                  <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-blue-400 border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  </div>
                  <span className="text-sm font-medium">Dark Mode</span>
                  <span className="text-xs text-blue-400">Active</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 3. Notifications */}
          <Reveal delay={100}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl w-full">
              <h2 className="text-xl font-bold mb-6">Notifications</h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">Report Status Updates</h4>
                    <p className="text-xs text-gray-500">Get notified when your reports change status.</p>
                  </div>
                  <button 
                    onClick={() => setNotifReports(!notifReports)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifReports ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifReports ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <h4 className="font-medium text-sm">Email Notifications</h4>
                    <p className="text-xs text-gray-500">Receive updates via email.</p>
                  </div>
                  <button 
                    onClick={() => setNotifEmail(!notifEmail)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifEmail ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifEmail ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 4. Account Info & Logout */}
          <Reveal>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl w-full">
              <h2 className="text-xl font-bold mb-6">Account Information</h2>
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <span className="font-medium text-sm">{user.full_name}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-white/5">
                  <span className="text-gray-400 text-sm">Email</span>
                  <span className="font-medium text-sm">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Member Since</span>
                  <span className="font-medium text-sm">{joinDate}</span>
                </div>
              </div>
              <button 
                onClick={() => { logout(); router.push('/'); }}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Logout
              </button>
            </div>
          </Reveal>

          {/* 5. Danger Zone */}
          <Reveal delay={200}>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-8 backdrop-blur-xl w-full">
              <h2 className="text-xl font-bold mb-4 text-red-400">Danger Zone</h2>
              <p className="text-gray-400 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete Account
              </button>
            </div>
          </Reveal>

        </div>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp"
          onClick={() => setShowDeleteModal(false)}
        >
          <div 
            className="bg-zinc-900/90 border border-red-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Are you absolutely sure?</h3>
            <p className="text-gray-400 mb-8 text-sm">
              This action cannot be undone. This will permanently delete your account and remove your data from our servers.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                I understand, delete my account
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors mt-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}