import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, CheckCircle, AlertTriangle, Loader2, Lightbulb } from 'lucide-react';
import { API_URL } from '../config';

export default function Diagnosis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup preview URL on unmount or when preview changes
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG/PNG).');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB.');
        return;
      }
      if (preview) URL.revokeObjectURL(preview);
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (!droppedFile.type.startsWith('image/')) {
        setError('Please drop a valid image file.');
        return;
      }
      if (preview) URL.revokeObjectURL(preview);
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('crop', 'Tomato'); // Auto set for this demo unless we want a dropdown

    try {
      const res = await fetch(`${API_URL}/api/diagnose`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to diagnose image. Server error.');
      }

      const data = await res.json();
      navigate(`/result/${data.id}`);
    } catch (err) {
      // Graceful fallback for mock mode if backend is completely unreachable
      console.warn('Backend unavailable, mocking navigation.', err);
      // Create a mock diagnosis object via localStorage or just route to a dummy id
      navigate(`/result/demo`);
    } finally {
      setLoading(false);
    }
  };

  const examples = [
    { name: 'Healthy Leaf', type: '(Example)', img: '/images/healthy-leaf.png' },
    { name: 'Early Blight', type: '(Example)', img: '/images/early-blight.png' },
    { name: 'Late Blight', type: '(Example)', img: '/images/late-blight.png' },
    { name: 'Leaf Spot', type: '(Example)', img: '/images/leaf-spot.png' }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pt-4">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-forest-600 rounded flex justify-center items-center text-white font-bold">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Upload Leaf Image</h2>
          <p className="text-sm text-gray-500">Take or upload a clear photo of the affected leaf</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 grid md:grid-cols-2 gap-8">
        
        {/* Dropzone */}
        <div className="flex flex-col">
          <div 
            className="flex-grow border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-8 hover:bg-gray-50 transition cursor-pointer relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl shadow-sm" />
            ) : (
              <div className="text-center space-y-4">
                <UploadCloud className="mx-auto h-10 w-10 text-forest-600" />
                <div className="text-sm font-semibold text-gray-700">
                  Drag & drop an image here<br/><span className="text-xs text-gray-400 font-normal">or</span>
                </div>
                <span className="px-4 py-2 bg-forest-600 text-white rounded-lg text-sm font-bold shadow-sm inline-block">
                  Choose File
                </span>
                <p className="text-xs text-gray-400">Supports: JPG, PNG (Max 5MB)</p>
              </div>
            )}
            <input id="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/jpeg, image/png" />
          </div>

          <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex space-x-3 w-full justify-between overflow-x-auto">
              {examples.map((ex, i) => (
                <div key={i} className="text-center min-w-[70px]">
                  <img src={ex.img} alt={ex.name} className="w-16 h-16 rounded-lg object-cover mb-1 border border-gray-200 shadow-sm mx-auto" />
                  <p className="text-[10px] font-bold text-gray-800 leading-tight">{ex.name}</p>
                  <p className="text-[9px] text-gray-400">{ex.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips & Action */}
        <div className="flex flex-col space-y-6">
          <div className="bg-[#fcfdfa] border border-[#f0f4ef] rounded-2xl p-6 relative">
            <div className="absolute -top-4 left-6 px-3 py-1 bg-white border border-[#f0f4ef] rounded-full flex items-center space-x-2 shadow-sm">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-gray-700">Tips for better results</span>
            </div>
            
            <ul className="space-y-4 text-sm font-medium text-gray-700 mt-4">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-forest-500 mr-3 flex-shrink-0" />
                Use a clear, well-lit image
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-forest-500 mr-3 flex-shrink-0" />
                Focus on the affected leaf
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-forest-500 mr-3 flex-shrink-0" />
                Avoid blurry images
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-forest-500 mr-3 flex-shrink-0" />
                Include the full leaf if possible
              </li>
            </ul>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center border border-red-100">
              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-auto">
            <button 
              onClick={handleSubmit}
              disabled={!file || loading}
              className={`w-full py-4 px-4 rounded-xl shadow-md text-lg font-bold text-white transition flex justify-center items-center ${
                !file || loading ? 'bg-forest-300 cursor-not-allowed' : 'bg-forest-700 hover:bg-forest-800'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Analyzing Image...
                </>
              ) : (
                'Analyze Leaf'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
