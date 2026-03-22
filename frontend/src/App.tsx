// src/App.tsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import ProblemDetail from "./pages/ProblemDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rankings from "./pages/Rankings";
import Help from "./pages/Help";
import { AuthProvider } from "./components/AuthContext";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import Profile from "./pages/Profile";
import MySolutions from "./pages/MySolutions";
import Settings from "./pages/Settings";
import Arena from "./pages/Arena";
import LiveLessons from "./pages/LiveLessons";
import Practice from "./pages/Practice";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Problems from "./pages/problems";

function App() {
  const location = useLocation();

  // Footer yashirish uchun sahifalar
  const hideFooterPaths = [
    "/problem/",
    "/arena/",
    "/live/"
  ];

  const shouldHideFooter = hideFooterPaths.some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
        <Navbar />
        
        <main className="flex-grow">
          <Routes>
            {/* Ochiq sahifalar */}
            <Route path="/" element={<Home />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problem/:slug" element={<ProblemDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/help" element={<Help />} />
            
            {/* Himoyalangan sahifalar */}
            <Route path="/courses" element={
              // <ProtectedRoute>
                <Courses />
              // </ProtectedRoute>
            } />
            
            <Route path="/courses/:slug" element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/contests" element={
              <ProtectedRoute>
                <Contests />
              </ProtectedRoute>
            } />
            
            <Route path="/contest/:id" element={
              <ProtectedRoute>
                <ContestDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/my-solutions" element={
              <ProtectedRoute>
                <MySolutions />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            <Route path="/arena" element={
              <ProtectedRoute>
                <Arena />
              </ProtectedRoute>
            } />
            
            <Route path="/live" element={
              <ProtectedRoute>
                <LiveLessons />
              </ProtectedRoute>
            } />
            
            <Route path="/practice" element={
              <ProtectedRoute>
                <Practice />
              </ProtectedRoute>
            } />
            
            {/* 404 sahifasi */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {!shouldHideFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;