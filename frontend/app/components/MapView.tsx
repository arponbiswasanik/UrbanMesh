"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import L from 'leaflet';
import MapClickHandler from './MapClickHandler';
import MapControls from './MapControls';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

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

const categories = [
  'Road', 'Water', 'Streetlight', 'Trash', 'Drainage', 
  'Traffic', 'Public Safety', 'Environment', 'Infrastructure', 'Other'
];

export default function MapView() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [issues, setIssues] = useState<any[]>([]);
  const [newIssuePos, setNewIssuePos] = useState<{lat: number, lng: number} | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Road");
  const [otherCategory, setOtherCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Restore draft form data if it exists
    const draft = localStorage.getItem('urbanmesh_draft');
    if (draft) {
      const parsedDraft = JSON.parse(draft);
      setNewIssuePos(parsedDraft.newIssuePos);
      setTitle(parsedDraft.title);
      setDescription(parsedDraft.description);
      setCategory(parsedDraft.category);
      setOtherCategory(parsedDraft.otherCategory);
      localStorage.removeItem('urbanmesh_draft');
    }

    fetch('http://127.0.0.1:8000/issues/')
      .then(res => res.json())
      .then(data => setIssues(data));
  }, []);

  const handleMapClick = (lat: number, lng: number) => {
    setNewIssuePos({ lat, lng });
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIssuePos) return;

    // INTERCEPT SUBMIT: If not authenticated, save draft and show modal
    if (!isAuthenticated) {
      const draft = {
        newIssuePos,
        title,
        description,
        category,
        otherCategory
      };
      localStorage.setItem('urbanmesh_draft', JSON.stringify(draft));
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);
    const finalCategory = category === 'Other' ? otherCategory : category;

    // Get the token from local storage
    const token = localStorage.getItem('urbanmesh_token');

    const response = await fetch('http://127.0.0.1:8000/issues/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        description,
        category: finalCategory,
        latitude: newIssuePos.lat,
        longitude: newIssuePos.lng
      })
    });

    if (response.ok) {
      const savedIssue = await response.json();
      setIssues([...issues, savedIssue]);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setNewIssuePos(null);
        setTitle("");
        setDescription("");
        setOtherCategory("");
        setCategory("Road");
        setIsSuccess(false);
      }, 1500);
    } else {
      setIsSubmitting(false);
      console.error("Failed to submit report");
    }
  };

  return (
    <div className="relative">
      <MapContainer 
        center={[23.7806, 90.4193]} 
        zoom={11} 
        zoomControl={false} 
        style={{ height: '100vh', width: '100%' }}
      >
        <Header />
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler onMapClick={handleMapClick} />
        <MapControls />
        
        <MarkerClusterGroup>
          {issues.map((issue) => (
            <Marker key={issue.id} position={[issue.latitude, issue.longitude]}>
              <Popup>
                <strong>{issue.title}</strong>
                <br />
                {issue.description}
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {newIssuePos && (
          <Marker position={[newIssuePos.lat, newIssuePos.lng]} />
        )}
      </MapContainer>

      {newIssuePos && (
        <div className="absolute top-20 right-4 z-[1000] bg-zinc-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-[400px] max-w-[calc(100vw-2rem)] border border-white/10 text-white animate-fadeInUp max-h-[calc(100vh-6rem)] overflow-y-auto">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 animate-fadeInUp">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Report Submitted!</h3>
              <p className="text-gray-400 text-sm mt-1">Thank you for improving the city.</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl">Report New Issue</h3>
                <button 
                  type="button" 
                  onClick={() => setNewIssuePos(null)}
                  className="text-gray-400 hover:text-white text-2xl leading-none transition-colors"
                >
                  &times;
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Select Category</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                          category === cat 
                            ? 'bg-blue-600/30 border-blue-500 text-white scale-105 shadow-lg shadow-blue-500/20' 
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {category === 'Other' && (
                  <div className="animate-fadeInUp">
                    <input 
                      type="text" 
                      placeholder="Specify Issue Type (e.g., Noise Pollution)"
                      value={otherCategory}
                      onChange={(e) => setOtherCategory(e.target.value)}
                      required={category === 'Other'} 
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-500"
                    />
                  </div>
                )}

                <div>
                  <input 
                    type="text" 
                    placeholder="Issue Title (e.g., Pothole on Main St)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all placeholder:text-gray-500"
                  />
                </div>

                <div>
                  <textarea 
                    placeholder="Description (Provide details about the issue...)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none h-24 placeholder:text-gray-500"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 py-3 rounded-lg font-semibold mt-2 transition-all hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Report'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* AUTHENTICATION MODAL */}
      {showAuthModal && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp"
          onClick={() => setShowAuthModal(false)}
        >
          <div 
            className="bg-zinc-900/90 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Sign in Required</h3>
            <p className="text-gray-400 mb-8 text-sm">
              To maintain report quality and prevent spam, you need to sign in before submitting an issue report.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/signin')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30"
              >
                Sign In
              </button>
              <button 
                onClick={() => router.push('/signup')}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-3 rounded-lg font-semibold transition-all"
              >
                Create Account
              </button>
              <button 
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-400 hover:text-white text-sm py-2 transition-colors mt-2"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}