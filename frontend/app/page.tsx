"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import Reveal from './components/Reveal';

const images = [
  "https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1444723121867-7a241cacace9?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1920&auto=format&fit=crop"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [hoveredLink, setHoveredLink] = useState({ left: 0, width: 0, opacity: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    setHoveredLink({ left: target.offsetLeft, width: target.offsetWidth, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setHoveredLink(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* PRELOADER */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center animate-preloaderFade">
        <div className="absolute inset-0 bg-white"></div>
        <div className="relative z-10 animate-logoPop">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-full bg-black animate-swipeUp"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-xl font-bold tracking-tight">UrbanMesh</span>
          </div>
          
          {/* Sliding Magic Underline Container */}
          <div 
            ref={navRef} 
            className="hidden md:flex items-center text-sm font-medium text-gray-300 relative" 
            onMouseLeave={handleMouseLeave}
          >
            {/* Static placeholder links - No navigation */}
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              onMouseEnter={handleMouseEnter} 
              className="hover:text-white transition-colors duration-300 py-2 mx-6 cursor-pointer"
            >
              Features
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()} 
              onMouseEnter={handleMouseEnter} 
              className="hover:text-white transition-colors duration-300 py-2 mx-6 cursor-pointer"
            >
              About
            </a>
            
            {/* The Sliding Magic Underline */}
            <span 
              className="absolute bottom-0 h-[2px] bg-white transition-all duration-300 ease-in-out"
              style={{ left: hoveredLink.left, width: hoveredLink.width, opacity: hoveredLink.opacity }}
            ></span>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/signin" className="hidden sm:block text-sm text-gray-300 hover:text-white transition-colors py-2 cursor-pointer">
              Sign In
            </Link>
            <Link href="/signup" className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Full Height) */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {images.map((img, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
            >
              <img 
                src={img} 
                alt="City background" 
                className="absolute inset-0 w-full h-full object-cover animate-kenburns"
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/40"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950/80 via-transparent to-zinc-950/80"></div>

        <div className="relative z-20 text-center px-6 max-w-5xl mx-auto flex flex-col items-center gap-8">
          <div 
            className="flex items-center gap-2 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-md animate-fadeInUp"
            style={{ animationDelay: '1.5s' }}
          >
            <span className="bg-green-400 w-2 h-2 rounded-full animate-pulse"></span>
            <span className="text-xs font-medium text-gray-100 tracking-wide">SYNCHRONIZING LIVE DATA</span>
          </div>

          <h1 
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1] drop-shadow-lg animate-fadeInUp"
            style={{ animationDelay: '1.7s' }}
          >
            Smart Infrastructure <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-teal-200 bg-clip-text text-transparent">
              for Smarter Cities
            </span>
          </h1>

          <p 
            className="text-lg md:text-xl text-gray-200 max-w-2xl leading-relaxed drop-shadow-md animate-fadeInUp"
            style={{ animationDelay: '1.9s' }}
          >
            UrbanMesh transforms citizen reports into actionable geospatial data. 
            Report potholes, broken streetlights, and infrastructure issues instantly.
          </p>

          <div 
            className="flex justify-center w-full sm:w-auto animate-fadeInUp"
            style={{ animationDelay: '2.1s' }}
          >
            <Link 
              href="/map" 
              className="group bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 hover:gap-3 hover:shadow-2xl hover:shadow-white/10 w-full sm:w-auto cursor-pointer"
            >
              Open Live Map
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-all">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section (Full Page Height with Scroll Animations) */}
      <section id="features" className="min-h-screen flex items-center justify-center py-24 px-6 lg:px-8 border-t border-white/5 bg-zinc-950 relative z-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Built for the Modern Web</h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">Modern design with a user-friendly experience.</p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Reveal delay={0}>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group h-full">
                <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Global Mapping</h3>
                <p className="text-gray-400 leading-relaxed text-sm">Interactive maps powered by Leaflet & OpenStreetMap. Pan, zoom, and locate issues anywhere on the planet.</p>
              </div>
            </Reveal>

            {/* Feature 2 */}
            <Reveal delay={200}>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group h-full">
                <div className="bg-cyan-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Clustering</h3>
                <p className="text-gray-400 leading-relaxed text-sm">No more map clutter. Our algorithm automatically groups overlapping reports into clean, numbered clusters.</p>
              </div>
            </Reveal>

            {/* Feature 3 */}
            <Reveal delay={400}>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 group h-full">
                <div className="bg-teal-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Reporting</h3>
                <p className="text-gray-400 leading-relaxed text-sm">Report issues in seconds. Data syncs instantly to our PostgreSQL backend, updating the map for everyone.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <Reveal>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>© 2026 UrbanMesh. All rights reserved.</span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex gap-6">
              {/* Static placeholder links - No navigation */}
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors cursor-pointer">Terms of Service</a>
              <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors cursor-pointer">Contact</a>
            </div>
          </Reveal>
        </div>
      </footer>

    </div>
  );
}