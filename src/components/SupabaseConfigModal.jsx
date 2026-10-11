import React, { useState } from 'react';
import { Database, Key, CheckCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { getSupabaseConfig, setSupabaseConfig } from '../lib/supabase';

export default function SupabaseConfigModal({ isOpen, onClose }) {
  const currentConfig = getSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.supabaseUrl || '');
  const [key, setKey] = useState(currentConfig.supabaseAnonKey || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim().startsWith('https://')) {
      setError('Project URL must begin with https:// (e.g. https://xyz.supabase.co)');
      return;
    }
    if (!key.trim()) {
      setError('Please provide your Supabase anon/public key.');
      return;
    }
    setSupabaseConfig(url.trim(), key.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Connect Supabase Database</h2>
            <p className="text-xs text-slate-400">Required for real-time live synchronization</p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-3.5 mb-5 border border-slate-700 text-xs text-slate-300 space-y-1.5">
          <p className="font-semibold text-slate-200">Where to find these in Supabase:</p>
          <ol className="list-decimal list-inside space-y-1 text-slate-400">
            <li>Go to <span className="text-emerald-400 font-mono">supabase.com/dashboard</span> and open your project.</li>
            <li>Go to <span className="text-white font-medium">Project Settings &rarr; API</span>.</li>
            <li>Copy <span className="text-white font-medium">Project URL</span> and the <span className="text-white font-medium">anon / public key</span>.</li>
          </ol>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-xs font-medium text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Supabase Project URL
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="https://your-project-id.supabase.co"
                value={url}
                onChange={(e) => { setUrl(e.target.value); setError(''); }}
                className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Supabase Anon / Public API Key
            </label>
            <input
              type="text"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={key}
              onChange={(e) => { setKey(e.target.value); setError(''); }}
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition font-mono text-xs"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:scale-95 rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Save & Connect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
