"use client";

import { useMap } from 'react-leaflet';
import { MouseEvent } from 'react';

export default function LocateButton() {
  const map = useMap();

  const handleLocate = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); 
    map.locate({ setView: true, maxZoom: 16 });
  };

  return (
    <button 
      onClick={handleLocate} 
      className="absolute bottom-12 right-4 z-[1000] bg-white p-4 rounded-full shadow-lg hover:bg-gray-100 text-black text-2xl"
      title="Find my location"
    >
      📍
    </button>
  );
}