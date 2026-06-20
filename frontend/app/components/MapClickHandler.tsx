"use client";

import { useMapEvents } from 'react-leaflet';

export default function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      const target = e.originalEvent.target as HTMLElement;
      if (target.closest('button')) {
        return; // Stop here if they clicked a button
      }
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  
  return null;
}