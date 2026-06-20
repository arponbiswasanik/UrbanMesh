"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Reveal from '../components/Reveal';

export default function ProfilePage() {
  const { isAuthenticated, isLoading, user, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Error loading profile.</div>; 
  }

  // Handle Image Upload & Save to Database
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const token = localStorage.getItem('urbanmesh_token');
        
        try {
          const res = await fetch('http://127.0.0.1:8000/users/me', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ avatar: base64Image })
          });

          if (res.ok) {
            const data = await res.json();
            updateUser({ avatar: data.avatar }); // Sync global context (Navbar updates instantly!)
          }
        } catch (err) {
          console.error("Failed to upload avatar", err);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Image Deletion
  const handleDeleteAvatar = async () => {
    const token = localStorage.getItem('urbanmesh_token');
    try {
      const res = await fetch('http://127.0.0.1:8000/users/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar: "" }) // Empty string clears the image
      });

      if (res.ok) {
        const data = await res.json();
        updateUser({ avatar: "" }); // Sync global context
      }
    } catch (err) {
      console.error("Failed to delete avatar", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('urbanmesh_token');
    
    try {
      const res = await fetch('http://127.0.0.1:8000/users/me', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ full_name: fullName, email })
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data); 
        setIsSaving(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsEditing(false);
          setIsSuccess(false);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setIsSaving(false);
    }
  };

  const joinDate = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const stats = [
    { label: 'Total Reports', value: '12', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
    { label: 'Resolved', value: '5', color: 'text-green-400', bg: 'bg-green-500/10', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> },
    { label: 'In Progress', value: '4', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
    { label: 'Contribution', value: '850', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> }
  ];

  const recentActivity = [
    { title: 'Pothole on Main St', status: 'In Progress', date: '2 days ago', type: 'Road' },
    { title: 'Broken Streetlight', status: 'Resolved', date: '1 week ago', type: 'Streetlight' },
    { title: 'Water Leak near Park', status: 'Pending', date: '2 weeks ago', type: 'Water' }
  ];

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
            <Link href="/profile" className="text-sm text-white hover:text-gray-300 transition-colors">Profile</Link>
            <Link href="/reports" className="text-sm text-gray-400 hover:text-white transition-colors">Reports</Link>
            <Link href="/settings" className="text-sm text-gray-400 hover:text-white transition-colors">Settings</Link>
            <Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">Open Map</Link>
          </div>
        </div>
      </nav>

      {/* Main Content - Inline style guarantees no navbar overlap */}
      <main className="pb-12 px-6 lg:px-8 max-w-7xl mx-auto" style={{ paddingTop: '8rem' }}>
        
        {/* Profile Header / Edit Form */}
        <Reveal>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8 backdrop-blur-xl">
            
            {/* GitHub-Style Fixed-Size Avatar */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div 
                className="relative group cursor-pointer" 
                style={{ width: '128px', height: '128px' }} 
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                  accept="image/*"
                />
                <div 
                  className="w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-lg shadow-blue-500/30 flex items-center justify-center bg-blue-600"
                >
                  {isUploading ? (
                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full" 
                      style={{ objectFit: 'cover' }} // Forces 1:1 crop without distortion
                    />
                  ) : (
                    <span className="text-5xl font-bold text-white">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {/* Animated Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 border-4 border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span className="text-white text-sm font-bold mt-2">Upload Photo</span>
                </div>
              </div>
              {/* Delete Avatar Button */}
              {user.avatar && (
                <button 
                  onClick={handleDeleteAvatar} 
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  Remove
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="flex-1 w-full flex flex-col gap-4">
                <h2 className="text-2xl font-bold mb-2">Edit Profile</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Email Address</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                    {isSaving ? 'Saving...' : isSuccess ? 'Saved!' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.full_name}</h1>
                  <span className="bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Verified
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{user.email}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Member since {joinDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            )}
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer">
                Edit Profile
              </button>
            )}
          </div>
        </Reveal>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100}>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  {stat.icon}
                </div>
                <h3 className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Recent Activity */}
        <Reveal delay={200}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Recent Activity
            </h2>
            <div className="flex flex-col gap-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold">
                      {activity.type.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{activity.title}</h4>
                      <p className="text-xs text-gray-500">{activity.date}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${
                    activity.status === 'Resolved' ? 'bg-green-500/20 text-green-400' :
                    activity.status === 'In Progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

      </main>
    </div>
  );
}