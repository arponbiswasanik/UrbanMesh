"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Reveal from '../components/Reveal';

interface Issue {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  priority: string;
  created_at: string;
}

export default function ReportsPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin');
    } else if (isAuthenticated) {
      const token = localStorage.getItem('urbanmesh_token');
      fetch('http://127.0.0.1:8000/users/me/issues', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setIssues(data);
          setIsFetching(false);
        })
        .catch(err => {
          console.error("Failed to fetch issues", err);
          setIsFetching(false);
        });
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || (!isAuthenticated && !isLoading)) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>; 
  }

  // Calculate Stats
  const totalReports = issues.length;
  const pendingReports = issues.filter(i => i.status === 'Pending').length;
  const inProgressReports = issues.filter(i => i.status === 'In Progress').length;
  const resolvedReports = issues.filter(i => i.status === 'Resolved').length;

  const stats = [
    { label: 'Total Reports', value: totalReports, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Pending', value: pendingReports, color: 'text-gray-400', bg: 'bg-gray-500/10' },
    { label: 'In Progress', value: inProgressReports, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Resolved', value: resolvedReports, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'In Progress': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Pending': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

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
            <Link href="/reports" className="text-sm text-white hover:text-gray-300 transition-colors">Reports</Link>
            <Link href="/settings" className="text-sm text-gray-400 hover:text-white transition-colors">Settings</Link>
            <Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">Open Map</Link>
          </div>
        </div>
      </nav>

      {/* Main Content - Inline style guarantees no navbar overlap */}
      <main className="pb-12 px-6 lg:px-8 max-w-7xl mx-auto" style={{ paddingTop: '8rem' }}>
        
        {/* Header */}
        <Reveal>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Reports</h1>
            <p className="text-gray-400">Track the status of issues you've submitted in your community.</p>
          </div>
        </Reveal>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 100}>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <h3 className={`text-4xl font-bold ${stat.color} mb-1`}>{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Reports List / Empty State */}
        <Reveal delay={200}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6">Report History</h2>
            
            {isFetching ? (
              <div className="flex justify-center items-center py-10">
                <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : issues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No reports submitted yet</h3>
                <p className="text-gray-400 mb-6 max-w-sm">Be the change you want to see in your city. Report an issue on the map to get started.</p>
                <Link href="/map" className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Open Live Map
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {issues.map((issue, index) => (
                  <div key={issue.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 text-sm font-bold shrink-0 group-hover:scale-110 transition-transform">
                        {issue.category.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{issue.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                          <span>{issue.category}</span>
                          <span>•</span>
                          <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pl-16 md:pl-0">
                      <span className="text-xs text-gray-400 capitalize hidden sm:block">{issue.priority} Priority</span>
                      <span className={`text-xs px-3 py-1.5 rounded-full border ${getStatusStyle(issue.status)} capitalize`}>
                        {issue.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

      </main>
    </div>
  );
}