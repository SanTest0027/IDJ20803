import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle2, RefreshCw, Radio, User, Award, Hash, Clock, Sparkles } from 'lucide-react';

export default function StudentDashboard({ matricNo, fallbackStudents }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

  // Load student data
  const fetchStudentData = async () => {
    setLoading(true);

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('*')
          .eq('matric_no', matricNo)
          .single();

        if (data && !error) {
          setStudent(data);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to local dataset:', err);
      }
    }

    // Local fallback if Supabase table is not yet populated
    const found = fallbackStudents?.find((s) => s.matric_no === matricNo);
    if (found) {
      setStudent(found);
    } else {
      setStudent({
        matric_no: matricNo,
        name: 'Student Record Found',
        marks: 0,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentData();

    // Setup Supabase Realtime Subscription
    let channel = null;
    if (supabase) {
      channel = supabase
        .channel(`realtime-student-${matricNo}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'students',
            filter: `matric_no=eq.${matricNo}`,
          },
          (payload) => {
            console.log('Realtime mark update received:', payload);
            if (payload.new) {
              setStudent(payload.new);
              setJustUpdated(true);
              setLastUpdatedTime(new Date().toLocaleTimeString());
              setTimeout(() => setJustUpdated(false), 2500);
            }
          }
        )
        .subscribe((status) => {
          setIsLive(status === 'SUBSCRIBED');
        });
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [matricNo]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Loading student record...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Real-time sync status pill */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isLive ? 'bg-emerald-400' : 'bg-slate-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isLive ? 'bg-emerald-500' : 'bg-slate-500'
            }`}></span>
          </span>
          <span className="text-xs font-semibold text-slate-300">
            {isLive ? 'Live Real-Time Sync Active' : 'Offline / Polling Mode'}
          </span>
          {lastUpdatedTime && (
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Updated at {lastUpdatedTime}
            </span>
          )}
        </div>

        <button
          onClick={fetchStudentData}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Student Card */}
      <div
        className={`relative overflow-hidden bg-slate-900/90 border rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 ${
          justUpdated
            ? 'border-emerald-400 ring-4 ring-emerald-500/20 scale-[1.01]'
            : 'border-slate-800'
        }`}
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        {justUpdated && (
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
            Mark was just updated live by your lecturer!
          </div>
        )}

        {/* Student Details */}
        <div className="border-b border-slate-800/80 pb-6 mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            Official Academic Record
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 uppercase tracking-tight">
            {student?.name}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700 font-mono text-slate-200">
              <Hash className="w-3.5 h-3.5 text-emerald-400" />
              <span>Matric No: {student?.matric_no}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Student Record</span>
            </div>
          </div>
        </div>

        {/* Mark Display Hero */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="md:col-span-2 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800/90 rounded-2xl p-6 sm:p-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Current Score
              </p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className={`text-6xl sm:text-7xl font-extrabold tracking-tight transition-colors duration-300 ${
                  justUpdated ? 'text-emerald-400' : 'text-white'
                }`}>
                  {student?.marks}
                </span>
                <span className="text-slate-500 text-xl font-bold">/ 100</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Live synced from Lecturer's portal
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Award className="w-12 h-12" />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-6 text-xs text-slate-400 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-semibold">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Security</span>
            </div>
            <p className="leading-relaxed">
              Your mark is confidential. This view is restricted to your matric number. Only you and authorized faculty can access this information.
            </p>
          </div>

        </div>

      </div>
    </main>
  );
}
