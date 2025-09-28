import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import SplashScreen from "./pages/SplashScreen";
import { Toaster } from "react-hot-toast";
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/authPage" element={<AuthPage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    </>
  );
};

export default App;
