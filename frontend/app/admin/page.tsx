"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Reveal from '../components/Reveal';
import IssueMapModal from '../components/IssueMapModal';

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<any | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user?.is_admin)) {
      router.push('/signin');
    } else if (user?.is_admin) {
      fetchIssues();
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchIssues = async () => {
    const token = localStorage.getItem('urbanmesh_token');
    try {
      const res = await fetch('http://127.0.0.1:8000/admin/issues', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (err) {
      console.error("Failed to fetch admin issues", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    const token = localStorage.getItem('urbanmesh_token');
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: newStatus } : i));

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) fetchIssues();
    } catch (err) {
      fetchIssues();
    }
  };

  if (isLoading || isFetching) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading Admin Dashboard...</div>; 
  }

  if (!user?.is_admin) {
    return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Access Denied. Admins only.</div>; 
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]';
      case 'In Progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]';
      case 'Under Review': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20 shadow-[0_0_10px_rgba(107,114,128,0.1)]';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      
      {/* Premium Dashboard Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xl font-bold tracking-tight">UrbanMesh <span className="text-blue-500 text-xs font-mono bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 ml-1">ADMIN</span></span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-sm text-white hover:text-blue-400 transition-colors">Dashboard</Link>
            <Link href="/map" className="text-sm text-gray-400 hover:text-white transition-colors">Open Map</Link>
            <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors">Profile</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-12 px-6 lg:px-8 max-w-7xl mx-auto" style={{ paddingTop: '8rem' }}>
        
        <Reveal>
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-bold mb-2 tracking-tight">City Reports Management</h1>
              <p className="text-gray-500">Review, track, and update the status of all infrastructure reports.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              System Operational
            </div>
          </div>
        </Reveal>

        {/* Premium List Layout */}
        <div className="flex flex-col gap-3">
          {issues.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-12 text-center text-gray-400">
              No reports found.
            </div>
          ) : (
            issues.map((issue, index) => (
              <Reveal key={issue.id} delay={index * 50}>
                <div 
                  className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center gap-4"
                  onClick={() => setSelectedIssue(issue)}
                >
                  {/* Report Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{issue.category}</span>
                      <span className="text-gray-700">•</span>
                      <span className="text-xs text-gray-500">{new Date(issue.created_at).toLocaleDateString()}</span>
                    </div>
                    <h3 className="font-semibold text-white text-lg truncate group-hover:text-blue-400 transition-colors">{issue.title}</h3>
                    <p className="text-sm text-gray-500 truncate">{issue.description}</p>
                  </div>

                  {/* Map Link & Status */}
                  <div className="flex items-center gap-4 md:gap-6 pl-0 md:pl-4 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0">
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      View Location
                    </div>
                    
                    <div className="relative" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                        className={`appearance-none pl-3 pr-8 py-2 text-xs rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer font-medium ${getStatusStyle(issue.status)}`}
                      >
                        <option value="Pending" className="bg-zinc-800 text-white">Pending</option>
                        <option value="Under Review" className="bg-zinc-800 text-white">Under Review</option>
                        <option value="In Progress" className="bg-zinc-800 text-white">In Progress</option>
                        <option value="Resolved" className="bg-zinc-800 text-white">Resolved</option>
                        <option value="Rejected" className="bg-zinc-800 text-white">Rejected</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </main>

      {/* Render Custom Map Modal */}
      {selectedIssue && (
        <IssueMapModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
        />
      )}
    </div>
  );
}