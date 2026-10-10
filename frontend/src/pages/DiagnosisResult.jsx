import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ChevronRight, AlertCircle, Info, Stethoscope, Droplet, ExternalLink, Leaf } from 'lucide-react';
import { API_URL } from '../config';

export default function DiagnosisResult() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [followUpFile, setFollowUpFile] = useState(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // In demo mode or if no backend, we mock data to show the specific design
    if (id === 'demo' || !id) {
        // Mock fallback if API is not running
        setData({
          diagnosis: { confidence: 0.0, predicted_disease: 'System Offline - API Blocked', crop: 'No Crop Detected', timestamp: new Date().toISOString(), image_path: null },
          evidence: [{title: "API Verification Error", publisher: "Local Fallback", url: "#", excerpt: "The FastAPI backend could not be reached via localhost:8000."}], 
          follow_ups: [], 
          top_3: []
        });
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/diagnoses/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Backend failed');
        return res.json();
      })
      .then(d => setData(d))
      .catch(err => {
        console.warn('Fallback to mock due to API error', err);
        // Fallback mock
        setData({
          diagnosis: { confidence: 0.0, predicted_disease: 'System Offline', crop: 'None', timestamp: new Date().toISOString(), image_path: null },
          evidence: [], follow_ups: [], top_3: []
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12 text-forest-600 font-bold">Loading results...</div>;
  if (!data) return null;

  const { diagnosis, evidence, follow_ups, top_3 } = data;
  const confidencePercent = Math.round(diagnosis.confidence * 100);
  const isHighConfidence = diagnosis.confidence >= 0.8;
  const isDemo = diagnosis.confidence === 0.0;

  const getFallbackImage = (condition) => {
    if (!condition) return '/images/healthy-leaf.png';
    const c = condition.toLowerCase();
    if (c.includes('early blight') || c.includes('initial')) return '/images/early-blight.png';
    if (c.includes('late blight')) return '/images/late-blight.png';
    if (c.includes('spot')) return '/images/leaf-spot.png';
    if (c.includes('healthy') || c.includes('latest')) return '/images/healthy-leaf.png';
    return '/images/healthy-leaf.png'; // default fallback
  };

  const mainImage = diagnosis.image_path ? `${API_URL}/${diagnosis.image_path}` : getFallbackImage(diagnosis.predicted_disease);

  return (
    <div className="w-full max-w-6xl auto mx-auto space-y-10 pt-4 pb-12">
      <Link to="/diagnose" className="inline-flex items-center text-sm font-semibold text-gray-500 hover:text-forest-700 transition">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Upload
      </Link>

      {/* Page 3: Disease Prediction Results */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <img 
            src={mainImage} 
            alt="Analyzed leaf" 
            className="w-full h-[400px] object-cover rounded-2xl shadow-sm border border-gray-200" 
          />
        </div>
        <div className="md:w-1/2 flex flex-col justify-center py-6 pr-6">
          <div className="inline-flex items-center px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold w-max mb-4">
            <AlertCircle className="w-3 h-3 mr-1" />
            Disease Detected
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{diagnosis.predicted_disease}</h1>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-500">Confidence Score</span>
              <span className="text-lg font-extrabold text-gray-900">{confidencePercent}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${isHighConfidence ? 'bg-forest-500' : 'bg-amber-400'}`} 
                style={{ width: `${confidencePercent}%` }}
              ></div>
            </div>
            {!isHighConfidence && !isDemo && (
              <p className="text-xs text-amber-600 mt-2 font-medium flex items-center">
                <Info className="w-3 h-3 mr-1" /> Uncertainty detected. Consult an agricultural expert.
              </p>
            )}
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-gray-900 mb-3">Top Predictions</h3>
            <div className="space-y-2">
              {(top_3 && top_3.length > 0 ? top_3 : [{class: diagnosis.predicted_disease, confidence: diagnosis.confidence}]).map((pred, i) => (
                <div key={i} className="flex justify-between items-center bg-[#f7faf8] px-4 py-3 rounded-xl border border-[#edf3ef]">
                  <div className="flex items-center text-sm font-semibold text-gray-800">
                    <span className="w-5 text-gray-400">{i + 1}.</span> {pred.class}
                  </div>
                  <span className="text-sm font-bold text-gray-600">{Math.round(pred.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page 4: Treatment Guidance */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-forest-600 rounded flex justify-center items-center text-white font-bold">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Treatment Advice</h2>
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* Actions */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center mb-6 space-x-6 border-b border-gray-100 pb-4">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Crop</p>
                <p className="font-bold text-gray-800 flex items-center"><Leaf className="w-4 h-4 mr-1 text-forest-500" /> {diagnosis.crop || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Disease</p>
                <p className="font-bold text-gray-800 flex items-center"><AlertCircle className="w-4 h-4 mr-1 text-red-500" /> {diagnosis.predicted_disease}</p>
              </div>
            </div>
            
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-forest-600" /> Recommended Actions
            </h3>
            <ul className="space-y-3 text-sm text-gray-700 font-medium">
              <li className="flex items-start"><span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 mr-3 flex-shrink-0"></span> Remove and destroy infected leaves</li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 mr-3 flex-shrink-0"></span> Maintain proper plant spacing</li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 mr-3 flex-shrink-0"></span> Use recommended fungicides (consult expert)</li>
              <li className="flex items-start"><span className="w-1.5 h-1.5 rounded-full bg-forest-500 mt-1.5 mr-3 flex-shrink-0"></span> Avoid overhead watering</li>
            </ul>
          </div>
          
          {/* Sources */}
          <div className="md:col-span-3 bg-[#f5f8f6] p-6 rounded-3xl border border-[#eaf2ed]">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2 text-forest-600" /> Sources
            </h3>
            <div className="space-y-4">
              {evidence.map((src, i) => (
                <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 flex items-start shadow-sm">
                  <div className="bg-red-50 p-2 rounded-lg text-red-600 mr-4">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{src.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{src.publisher}</p>
                    <a href={src.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 mt-1 inline-block hover:underline">{src.url}</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Page 6: Recovery Timeline */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-forest-600 rounded flex justify-center items-center text-white font-bold">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Crop Recovery Timeline</h2>
            <p className="text-sm text-gray-500">Track changes in plant health over time</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
          <div className="flex items-center min-w-max pb-4">
            
            {(follow_ups && follow_ups.length > 0 ? follow_ups : [
              { timestamp: new Date().toISOString(), notes: 'Initial', image_path: null, confidence: diagnosis.confidence }
            ]).map((fu, idx, arr) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center w-36">
                  <div className="border border-gray-200 rounded-2xl p-2 bg-white shadow-sm w-full">
                    <p className="text-xs font-bold text-center text-gray-900 mb-2">{new Date(fu.timestamp).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</p>
                    <img src={fu.image_path ? `${API_URL}/${fu.image_path}` : getFallbackImage(fu.notes)} alt="stage" className="w-full h-24 object-cover rounded-xl border border-gray-100" />
                    <p className={`text-xs font-bold text-center mt-2 ${idx === arr.length - 1 && fu.confidence < 0.2 ? 'text-forest-600' : 'text-red-600'}`}>
                      {fu.notes || 'Status'}
                    </p>
                    <p className="text-[10px] text-gray-400 text-center">Confidence: {Math.round(fu.confidence * 100)}%</p>
                  </div>
                </div>
                {idx < arr.length - 1 && (
                  <div className="w-12 flex justify-center">
                    <ChevronRight className="w-6 h-6 text-gray-300" />
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Add Node Button */}
            {follow_ups && follow_ups.length > 0 && (
              <>
                <div className="w-12 flex justify-center">
                  <ChevronRight className="w-6 h-6 text-gray-300" />
                </div>
                <div className="flex flex-col items-center w-36 justify-center h-40 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
                  <span className="text-xl font-bold text-gray-400">+</span>
                  <span className="text-xs font-bold text-gray-400 mt-1">Add Photo</span>
                </div>
              </>
            )}

          </div>

          <div className="mt-8 bg-[#f5f8f6] p-4 rounded-xl border border-[#eaf2ed] flex items-start">
            <div className="bg-white p-2 border border-gray-200 rounded-lg mr-3">
              <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 mb-1">Farmer Notes</p>
              <p className="text-sm text-gray-600">Applied recommended fungicide and improved spacing. Plant condition is improving.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
