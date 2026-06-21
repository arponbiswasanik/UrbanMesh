"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

export default function IssueMapModal({ issue, onClose }: { issue: Issue, onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeInUp"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900/90 border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Side: Details */}
        <div className="p-8 flex flex-col gap-6 border-r border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">{issue.category}</span>
              <h3 className="text-2xl font-bold text-white mt-1">{issue.title}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none transition-colors">&times;</button>
          </div>
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Description</label>
              <p className="text-gray-300 text-sm mt-1 leading-relaxed">{issue.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Submitted</label>
                <p className="text-gray-300 text-sm mt-1">{new Date(issue.created_at).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Status</label>
                <p className="text-gray-300 text-sm mt-1">{issue.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Custom Map */}
        <div className="h-[300px] md:h-full bg-zinc-950 relative">
          <MapContainer 
            center={[issue.latitude, issue.longitude]} 
            zoom={15} 
            zoomControl={false} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[issue.latitude, issue.longitude]}>
              <Popup>{issue.title}</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}