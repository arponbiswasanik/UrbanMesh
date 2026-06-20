"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export default function Header() {
  const map = useMap();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Isolate from Map CSS
  useEffect(() => {
    if (headerRef.current) {
      L.DomEvent.disableClickPropagation(headerRef.current);
      L.DomEvent.disableScrollPropagation(headerRef.current);
    }
  }, []);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search debounce
  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }
    setIsLoading(true);
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=bd&limit=5`)
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelectResult = (result: SearchResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    map.flyTo([lat, lon], 15, { duration: 1.5 });
    setQuery(result.display_name.split(',')[0]);
    setShowResults(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    router.push('/signin');
  };

  return (
    <header 
      ref={headerRef} 
      className="absolute top-0 left-0 right-0 z-[1000] bg-black/60 backdrop-blur-md border-b border-white/10 text-white py-4 px-6 flex items-center justify-between shadow-lg cursor-default"
    >
      {/* Left: Branding */}
      <div className="flex items-center gap-2 w-1/4 cursor-pointer">
        <Link href="/" className="flex items-center gap-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="text-xl font-bold tracking-tight hidden sm:block text-white">UrbanMesh</span>
        </Link>
      </div>
      
      {/* Center: Search */}
      <div ref={searchRef} className="flex-1 max-w-md mx-4 relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            )}
          </div>
          <input
            type="text"
            placeholder="Search areas, roads, landmarks..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-400 cursor-text"
          />
        </div>

        {showResults && results.length > 0 && (
          <div className="absolute mt-2 w-full bg-[#434142] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp z-[1001]">
            {results.map((result) => (
              <button
                key={result.place_id}
                onClick={() => handleSelectResult(result)}
                className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 cursor-pointer"
              >
                <p className="text-sm text-white font-medium truncate">
                  {result.display_name.split(',').slice(0, 2).join(', ')}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {result.display_name.split(',').slice(2).join(',')}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Profile / Auth */}
      <div className="flex items-center gap-3 w-1/4 justify-end">
        {isAuthenticated ? (
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 bg-blue-600 border border-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg hover:scale-105 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.full_name.charAt(0).toUpperCase() || 'U'
              )}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#434142] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp z-[1001]">
                {/* User Info Header */}
                <div className="px-4 py-4 border-b border-white/10 cursor-default">
                  <p className="text-sm font-bold text-white truncate">{user?.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                </div>
                
                {/* Menu Links */}
                <Link 
                  href="/profile" 
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm border-b border-white/5 cursor-pointer" 
                  style={{ color: '#d1d5db' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  My Profile
                </Link>
                <Link 
                  href="/reports" 
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm border-b border-white/5 cursor-pointer" 
                  style={{ color: '#d1d5db' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  My Reports
                </Link>
                <Link 
                  href="/settings" 
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-sm border-b border-white/5 cursor-pointer" 
                  style={{ color: '#d1d5db' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                  Settings
                </Link>
                
                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-600/20 transition-colors text-sm text-red-400 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            href="/signin" 
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 text-sm whitespace-nowrap cursor-pointer"
            style={{ color: 'white' }}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}