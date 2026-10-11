import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import { supabase } from './lib/supabase';
import initialStudentsData from '../students.json';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('grade_sync_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isSupabaseConnected, setIsSupabaseConnected] = useState(Boolean(supabase));

  // Save session
  const saveSession = (userData) => {
    setUser(userData);
    sessionStorage.setItem('grade_sync_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('grade_sync_session');
  };

  const handleLoginStudent = (matricNo) => {
    saveSession({
      role: 'student',
      matricNo: matricNo,
    });
  };

  const handleLoginLecturer = (username) => {
    saveSession({
      role: 'lecturer',
      username: username,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {!user ? (
          <Login
            onLoginStudent={handleLoginStudent}
            onLoginLecturer={handleLoginLecturer}
          />
        ) : user.role === 'student' ? (
          <StudentDashboard
            matricNo={user.matricNo}
            fallbackStudents={initialStudentsData}
          />
        ) : (
          <LecturerDashboard
            initialStudents={initialStudentsData}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="py-4 border-t border-slate-900 text-center text-xs text-slate-500">
        GradePulse &bull; Real-time Marks Portal &bull; Hosted on Vercel & Supabase
      </footer>

    </div>
  );
}
