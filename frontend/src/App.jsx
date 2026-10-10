import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Diagnosis from './pages/Diagnosis';
import DiagnosisResult from './pages/DiagnosisResult';
import History from './pages/History';
import Metrics from './pages/Metrics';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/diagnose" element={<Diagnosis />} />
            <Route path="/result/:id" element={<DiagnosisResult />} />
            <Route path="/history" element={<History />} />
            <Route path="/metrics" element={<Metrics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
