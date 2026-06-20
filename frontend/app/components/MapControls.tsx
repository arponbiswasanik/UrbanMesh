"use client";

import { useMap } from 'react-leaflet';

export default function MapControls() {
  const map = useMap();

  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();
  const locate = () => map.locate({ setView: true, maxZoom: 16 });

  return (
    <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-3">
      {/* Zoom In */}
      <button 
        onClick={zoomIn} 
        className="w-12 h-12 bg-zinc-900/60 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-zinc-900/90 hover:border-blue-500/50 transition-all duration-300 group"
        title="Zoom In"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Zoom Out */}
      <button 
        onClick={zoomOut} 
        className="w-12 h-12 bg-zinc-900/60 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-zinc-900/90 hover:border-blue-500/50 transition-all duration-300 group"
        title="Zoom Out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      {/* Locate (Crosshair Icon) */}
      <button 
        onClick={locate} 
        className="w-12 h-12 bg-zinc-900/60 backdrop-blur-md border border-white/10 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-zinc-900/90 hover:border-blue-500/50 transition-all duration-300 group mt-2"
        title="Find My Location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/>
        </svg>
      </button>
    </div>
  );
}