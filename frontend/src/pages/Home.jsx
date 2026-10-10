import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Languages, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-12 pb-12 w-full">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden mt-6 bg-[#f0f4ef] flex flex-col md:flex-row shadow-sm border border-[#e4ebe0]">
        
        {/* Left Content */}
        <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1f3f2d] leading-tight drop-shadow-sm">
            AI Powered<br />
            Plant Disease<br />
            Diagnosis Assistant
          </h1>
          <p className="text-lg text-gray-700 max-w-md font-medium">
            Upload a photo of a leaf and get instant disease detection with treatment advice in your language.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link 
              to="/diagnose" 
              className="inline-flex items-center px-6 py-3 bg-forest-700 text-white rounded-full font-bold shadow-md hover:bg-forest-800 transition"
            >
              Start Diagnosis
            </Link>
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 bg-white text-forest-700 border border-gray-200 rounded-full font-bold shadow-sm hover:bg-gray-50 transition"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 h-80 md:h-auto">
          <img 
            src="/images/hero-farmer.png" 
            alt="Farmer checking crop" 
            className="w-full h-full object-cover rounded-l-none md:rounded-l-3xl shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.1)]"
          />
        </div>
      </div>

      {/* Feature Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-[#e4efeb] text-forest-600 rounded-bl-xl rounded-tr-xl flex justify-center items-center">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">AI Diagnosis</h3>
            <p className="text-sm text-gray-500">High accuracy</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-[#e4efeb] text-forest-600 rounded-bl-xl rounded-tr-xl flex justify-center items-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Treatment Advice</h3>
            <p className="text-sm text-gray-500">with trusted sources</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-[#e4efeb] text-forest-600 rounded-bl-xl rounded-tr-xl flex justify-center items-center">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Multiple Languages</h3>
            <p className="text-sm text-gray-500">English & Tamil</p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 bg-[#e4efeb] text-forest-600 rounded-bl-xl rounded-tr-xl flex justify-center items-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Track Recovery</h3>
            <p className="text-sm text-gray-500">Over time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
