import React, { useState } from 'react';
import { User, Lock, ShieldCheck, GraduationCap, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export default function Login({ onLoginStudent, onLoginLecturer }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'lecturer'
  
  // Student state
  const [matricNo, setMatricNo] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [studentError, setStudentError] = useState('');

  // Lecturer state
  const [lecturerUsername, setLecturerUsername] = useState('');
  const [lecturerPassword, setLecturerPassword] = useState('');
  const [lecturerError, setLecturerError] = useState('');

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    setStudentError('');

    const cleanMatric = matricNo.trim();
    if (!cleanMatric) {
      setStudentError('Please enter your Matric Number.');
      return;
    }

    if (studentPassword !== '1234') {
      setStudentError('Incorrect password! Default password is 1234');
      return;
    }

    onLoginStudent(cleanMatric);
  };

  const handleLecturerSubmit = (e) => {
    e.preventDefault();
    setLecturerError('');

    const cleanUser = lecturerUsername.trim();
    if (cleanUser !== 'Lect1' || lecturerPassword !== '123izad') {
      setLecturerError('Invalid lecturer credentials. Check your username & password.');
      return;
    }

    onLoginLecturer(cleanUser);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        
        {/* Header Icon & Title */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3 shadow-inner">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">GradeSync Portal</h1>
          <p className="text-xs text-slate-400 mt-1">Select your role to access your marks</p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('student'); setStudentError(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'student'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Student Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('lecturer'); setLecturerError(''); }}
            className={`py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'lecturer'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Lecturer Login
          </button>
        </div>

        {/* Student Form */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            {studentError && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{studentError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Matric Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 252021399"
                  value={matricNo}
                  onChange={(e) => setMatricNo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Default: 1234"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 text-sm"
            >
              <span>View My Marks</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick autofill sample helper */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500">
                Test Matric: {' '}
                <button
                  type="button"
                  onClick={() => { setMatricNo('252021399'); setStudentPassword('1234'); }}
                  className="text-emerald-400 hover:underline font-mono"
                >
                  252021399
                </button>
                {' '}(Password: 1234)
              </span>
            </div>
          </form>
        )}

        {/* Lecturer Form */}
        {activeTab === 'lecturer' && (
          <form onSubmit={handleLecturerSubmit} className="space-y-4">
            {lecturerError && (
              <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{lecturerError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Lecturer Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. Lect1"
                  value={lecturerUsername}
                  onChange={(e) => setLecturerUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  placeholder="Lecturer password"
                  value={lecturerPassword}
                  onChange={(e) => setLecturerPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 bg-indigo-500 hover:bg-indigo-400 active:scale-[0.98] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition flex items-center justify-center gap-2 text-sm"
            >
              <span>Access Lecturer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick autofill helper */}
            <div className="pt-2 text-center">
              <span className="text-[11px] text-slate-500">
                Preset credentials:{' '}
                <button
                  type="button"
                  onClick={() => { setLecturerUsername('Lect1'); setLecturerPassword('123izad'); }}
                  className="text-indigo-400 hover:underline font-medium"
                >
                  Lect1 / 123izad
                </button>
              </span>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
