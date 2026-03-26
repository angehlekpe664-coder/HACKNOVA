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
            <div className="flex bg-[#F4F5F7] dark:bg-[#0F172A] min-h-screen relative overflow-x-hidden transition-colors duration-300">
              <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen w-full transition-all duration-300 relative z-0">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 bg-[#F4F5F7] dark:bg-[#0F172A] p-6 lg:p-0 transition-colors duration-300">
                  <Routes>
                    <Route path="/generate" element={<BrandGenerator />} />
                    <Route path="/results" element={<BrandResults />} />
                    <Route path="/history" element={<History />} />
                    <Route path="/settings" element={<Settings />} />
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
