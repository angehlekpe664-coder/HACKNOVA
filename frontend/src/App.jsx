import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import BrandGenerator from './pages/BrandGenerator';
import BrandResults from './pages/BrandResults';
import Landing from './pages/Landing';
import Login from './pages/Login';
import History from './pages/History';
import Settings from './pages/Settings';
import About from './pages/About';
import Help from './pages/Help'; 
import OtherFeatures from './pages/OtherFeatures';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard Layout (protégé) */}
        <Route path="/*" element={
          <ProtectedRoute>
            <div className="flex bg-[#F8FAFC] dark:bg-[#020617] min-h-screen relative overflow-x-hidden transition-colors duration-300 font-['Outfit']">
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen w-full transition-all duration-300 relative z-0 bg-[#F8FAFC] dark:bg-[#020617]">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 bg-[#F8FAFC] dark:bg-[#020617] p-6 lg:p-0 transition-colors duration-300">
                  <Routes>
                    <Route path="/generate" element={<BrandGenerator />} />
                    <Route path="/results" element={<BrandResults />} />
                    <Route path="/features" element={<OtherFeatures />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="*" element={<Navigate to="/generate" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
