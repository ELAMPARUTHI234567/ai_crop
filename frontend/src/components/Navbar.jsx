import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [langOpen, setLangOpen] = useState(false);

  const toggleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const navLinks = [
    { name: 'Dashboard', path: '/metrics' },
    { name: 'Diagnose', path: '/diagnose' },
    { name: 'History', path: '/history' },
    { name: 'Timeline', path: '/history' }, // Could make a separate route if needed, mapping to history for now
    { name: 'About', path: '/' }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 z-50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="w-8 h-8 text-forest-600" />
          <span className="text-2xl font-extrabold tracking-tight text-gray-900">{t('app_title', 'CropDoc AI')}</span>
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <Link 
              key={link.name}
              to={link.path} 
              className={`text-sm font-semibold transition ${
                location.pathname === link.path ? 'text-forest-600' : 'text-gray-600 hover:text-forest-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="relative">
            <button 
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <Globe className="w-4 h-4 text-forest-600" />
              <span>{i18n.language === 'en' ? 'English' : 'தமிழ்'}</span>
            </button>
            
            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden flex flex-col py-1">
                <button 
                  onClick={() => toggleLanguage('en')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Globe className="w-4 h-4 mr-2 text-forest-600" /> English
                </button>
                <button 
                  onClick={() => toggleLanguage('ta')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Globe className="w-4 h-4 mr-2 text-gray-400" /> தமிழ் (Tamil)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
