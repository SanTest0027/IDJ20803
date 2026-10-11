import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Search, 
  Download, 
  Users, 
  TrendingUp, 
  Award, 
  Check, 
  Save, 
  RefreshCw, 
  SlidersHorizontal,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function LecturerDashboard({ initialStudents }) {
  const [students, setStudents] = useState(initialStudents || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('matric_no'); // 'matric_no' | 'name' | 'marks'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'
  const [savingStatus, setSavingStatus] = useState({}); // { [matric_no]: 'saving' | 'saved' | 'error' }
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Fetch from Supabase
  const fetchAllStudents = async () => {
    if (!supabase) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('matric_no', { ascending: true });

      if (data && !error && data.length > 0) {
        setStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStudents();

    // Subscribe to real-time changes
    let channel = null;
    if (supabase) {
      channel = supabase
        .channel('lecturer-all-students')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'students' },
          (payload) => {
            if (payload.eventType === 'UPDATE' && payload.new) {
              setStudents((prev) =>
                prev.map((s) => (s.matric_no === payload.new.matric_no ? payload.new : s))
              );
            }
          }
        )
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  // Handle Mark Change
  const handleMarkChange = (matricNo, newMark) => {
    const numeric = newMark === '' ? '' : Number(newMark);
    setStudents((prev) =>
      prev.map((s) => (s.matric_no === matricNo ? { ...s, marks: numeric } : s))
    );
  };

  // Save Mark to Supabase
  const saveMark = async (student) => {
    const matricNo = student.matric_no;
    const markValue = Number(student.marks) || 0;

    setSavingStatus((prev) => ({ ...prev, [matricNo]: 'saving' }));

    if (supabase) {
      try {
        const { error } = await supabase
          .from('students')
          .update({ marks: markValue, updated_at: new Date().toISOString() })
          .eq('matric_no', matricNo);

        if (error) throw error;

        setSavingStatus((prev) => ({ ...prev, [matricNo]: 'saved' }));
        setTimeout(() => {
          setSavingStatus((prev) => {
            const next = { ...prev };
            delete next[matricNo];
            return next;
          });
        }, 2000);
      } catch (err) {
        console.error('Error updating mark:', err);
        setSavingStatus((prev) => ({ ...prev, [matricNo]: 'error' }));
      }
    } else {
      // Local simulated save if Supabase not yet configured
      setTimeout(() => {
        setSavingStatus((prev) => ({ ...prev, [matricNo]: 'saved' }));
        setTimeout(() => {
          setSavingStatus((prev) => {
            const next = { ...prev };
            delete next[matricNo];
            return next;
          });
        }, 2000);
      }, 300);
    }
  };

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    let list = [...students];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          String(s.matric_no).toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'marks') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [students, searchTerm, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    if (!students.length) return { count: 0, avg: 0, max: 0, min: 0 };
    const markList = students.map((s) => Number(s.marks) || 0);
    const sum = markList.reduce((acc, curr) => acc + curr, 0);
    return {
      count: students.length,
      avg: (sum / markList.length).toFixed(1),
      max: Math.max(...markList),
      min: Math.min(...markList),
    };
  }, [students]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['MatricNo,StudentName,Marks'];
    const rows = students.map((s) => `"${s.matric_no}","${s.name.replace(/"/g, '""')}",${s.marks}`);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Student_Marks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Students</p>
            <p className="text-2xl font-black text-white mt-1">{stats.count}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Class Average</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{stats.avg}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Highest Mark</p>
            <p className="text-2xl font-black text-amber-400 mt-1">{stats.max}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lowest Mark</p>
            <p className="text-2xl font-black text-rose-400 mt-1">{stats.min}</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <Award className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Control Bar: Search, Filters, Refresh, Export */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-xl">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by student name or matric no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            onClick={fetchAllStudents}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
            title="Reload from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={exportToCSV}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md shadow-emerald-500/20 flex items-center gap-2 transition active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

      </div>

      {/* Students Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 sm:px-6 w-16 text-center">#</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => {
                    if (sortField === 'matric_no') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('matric_no'); setSortOrder('asc'); }
                  }}
                >
                  Matric No {sortField === 'matric_no' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition"
                  onClick={() => {
                    if (sortField === 'name') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('name'); setSortOrder('asc'); }
                  }}
                >
                  Student Name {sortField === 'name' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th 
                  className="py-3.5 px-4 w-44 cursor-pointer hover:text-white transition"
                  onClick={() => {
                    if (sortField === 'marks') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    else { setSortField('marks'); setSortOrder('desc'); }
                  }}
                >
                  Marks {sortField === 'marks' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="py-3.5 px-4 w-28 text-center">Live Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs sm:text-sm">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500">
                    No students match "{searchTerm}"
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s, idx) => {
                  const status = savingStatus[s.matric_no];
                  return (
                    <tr
                      key={s.matric_no}
                      className="hover:bg-slate-800/40 transition group"
                    >
                      <td className="py-3 px-4 sm:px-6 text-center text-slate-500 font-mono text-xs">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-emerald-300">
                        {s.matric_no}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200 uppercase">
                        {s.name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={s.marks}
                            onChange={(e) => handleMarkChange(s.matric_no, e.target.value)}
                            onBlur={() => saveMark(s)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveMark(s);
                            }}
                            className="w-20 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono font-bold text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition"
                          />
                          <button
                            onClick={() => saveMark(s)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
                            title="Save Mark"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {status === 'saving' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                            Syncing
                          </span>
                        )}
                        {status === 'saved' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium animate-fade-in">
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            Live
                          </span>
                        )}
                        {status === 'error' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Failed
                          </span>
                        )}
                        {!status && (
                          <span className="text-[11px] text-slate-600 font-mono">
                            Ready
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </main>
  );
}
