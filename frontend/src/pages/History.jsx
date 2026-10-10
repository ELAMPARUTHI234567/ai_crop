import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderClock } from 'lucide-react';
import { API_URL } from '../config';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/diagnoses`)
      .then(res => {
        if(!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setHistory(data);
        setLoading(false);
      })
      .catch(() => {
        // Mock fallback if API is not running
        const mockData = [
          { id: 'offline', timestamp: new Date().toISOString(), crop: 'None', predicted_disease: 'System Offline', confidence: 0.0, image_path: null },
        ];
        setHistory(mockData);
        setLoading(false);
      });
  }, []);

  const getFallbackImage = (condition) => {
    if (!condition) return '/images/healthy-leaf.png';
    const c = condition.toLowerCase();
    if (c.includes('early blight')) return '/images/early-blight.png';
    if (c.includes('late blight')) return '/images/late-blight.png';
    if (c.includes('spot')) return '/images/leaf-spot.png';
    if (c.includes('healthy')) return '/images/healthy-leaf.png';
    return '/images/healthy-leaf.png';
  };

  if (loading) return <div className="text-center py-12">Loading records...</div>;

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-forest-600 rounded flex justify-center items-center text-white font-bold">
          <FolderClock className="w-5 h-5" />
          <p className="text-sm text-gray-500">View your previous diagnoses and track plant health over time</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Crop</th>
              <th className="py-4 px-6">Predicted Disease</th>
              <th className="py-4 px-6">Confidence</th>
              <th className="py-4 px-6">Image</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm font-semibold text-gray-800">
            {history.map((record, idx) => {
              const dateObj = new Date(record.timestamp);
              const isHealthy = record.predicted_disease.toLowerCase() === 'healthy';
              return (
                <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                  <td className="py-4 px-6">{dateObj.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                  <td className="py-4 px-6 font-medium">{record.crop}</td>
                  <td className={`py-4 px-6 font-bold ${isHealthy ? 'text-forest-600' : 'text-red-500'}`}>
                    {record.predicted_disease}
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold">
                      {Math.round(record.confidence * 100)}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <img 
                      src={record.image_path ? `${API_URL}/${record.image_path}` : getFallbackImage(record.predicted_disease)} 
                      alt="Thumbnail" 
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <Link 
                      to={`/result/${record.id || 'demo'}`} 
                      className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
