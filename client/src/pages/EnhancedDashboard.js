import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ResumeNameDialog } from '../components/ResumeNameDialog';

import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  TrendingUp,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Sparkles
} from 'lucide-react';

const PAGE_SIZE = 6;

export default function EnhancedDashboard() {
  const { user } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [creating, setCreating] = useState(false);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sort, setSort] = useState('updated_desc');
  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/resumes');
      const data = Array.isArray(res.data) ? res.data : [];
      const normalized = data.map((r) => ({ ...r, updated_at: r.updated_at ? new Date(r.updated_at) : new Date() }));
      setResumes(normalized);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(t);
  }, [query]);

  const filtered = useMemo(() => {
    let list = resumes.slice();
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((r) => (r.title || '').toLowerCase().includes(q) || (`${r.id}`).includes(q));
    }

    if (sort === 'updated_desc') list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    if (sort === 'updated_asc') list.sort((a, b) => new Date(a.updated_at) - new Date(b.updated_at));
    if (sort === 'completion_desc') list.sort((a, b) => (b.completion_percentage || 0) - (a.completion_percentage || 0));

    return list;
  }, [resumes, debouncedQuery, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  useEffect(() => { 
    if (page > totalPages) setPage(1); 
  }, [filtered.length, totalPages, page]);
  
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const createNewResume = async (title) => {
    try {
      setCreating(true);
      const res = await axios.post('/api/resumes', { title });
      setResumes((p) => [res.data, ...p]);
      toast.success('Resume created');
      setShowNameDialog(false);
      setPage(1);
    } catch (err) {
      console.error(err);
      toast.error('Could not create resume');
    } finally {
      setCreating(false);
    }
  };

  const openConfirmDelete = (resume) => {
    setConfirmTarget(resume);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    const target = confirmTarget;
    if (!target) return setConfirmOpen(false);
    setConfirmOpen(false);

    const prev = resumes;
    setResumes(prevList => prevList.filter(r => r.id !== target.id));

    toast((t) => (
      <div className="flex items-start gap-3">
        <div>
          <div className="font-semibold">Deleted</div>
          <div className="text-xs text-slate-500">{target.title}</div>
          <div className="mt-2">
            <button className="px-3 py-1 rounded bg-slate-100 text-sm" onClick={() => { setResumes(prev); toast.dismiss(t.id); }}>Undo</button>
          </div>
        </div>
      </div>
    ), { duration: 4000 });

    try {
      await axios.delete(`/api/resumes/${target.id}`);
      toast.success('Resume deleted');
    } catch (err) {
      console.error(err);
      setResumes(prev);
      toast.error('Delete failed — restored');
    }
  };

  const handleDownload = async (resume) => {
    try {
      const resp = await axios.get(`/api/resumes/${resume.id}/download`, { responseType: 'blob' });
      const blob = new Blob([resp.data], { type: resp.headers['content-type'] || 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(resume.title || 'resume')}-${resume.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success('Download started');
    } catch (err) {
      console.error(err);
      toast.error('Download failed');
    }
  };

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <div key={i} className="p-4 bg-white/60 rounded-2xl shadow animate-pulse h-40" />
      ))}
    </div>
  );

  const Counter = ({ value, label, icon: Icon, color = 'text-purple-600' }) => (
    <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">{label}</p>
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl font-bold">{value}</motion.div>
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50"> 
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 shadow-lg relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-0 left-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{ 
              x: [0, 50, 0],
              y: [0, -20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-0 right-1/3 w-24 h-24 bg-white/5 rounded-full blur-2xl"
            animate={{ 
              x: [0, -30, 0],
              y: [0, 15, 0],
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Brand */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold shadow-lg border border-white/30"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <span className="text-lg">LP</span>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white">LaunchPad India</h1>
                <p className="text-purple-200 text-sm">AI-Powered Resume Builder</p>
              </div>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-6">
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/dashboard" className="text-white/90 hover:text-white transition-colors font-medium">
                  Dashboard
                </Link>
              </nav>

              <div className="flex items-center gap-3">
                <span className="text-white/90 hidden sm:inline">Hi, {user?.firstName || 'Saikishore'}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 hover:text-white border-white/30"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        {/* Floating geometric shapes */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-32 right-20 w-32 h-32 bg-gradient-to-br from-indigo-300/20 to-purple-300/20 rounded-full blur-2xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-32 w-16 h-16 bg-gradient-to-br from-pink-300/40 to-rose-300/40 rounded-full blur-lg"
          animate={{ 
            x: [0, 70, 0],
            y: [0, -40, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ 
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-purple-300" />
          </svg>
        </div>
        
        {/* Animated dots */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900">Welcome{user?.firstName ? `, ${user.firstName}` : ''}</h1>
                <p className="text-slate-600">Manage resumes — curated by experts, polished for recruiters.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                placeholder="Search resumes, ID..." 
                className="pl-10 pr-4 py-2 w-72 rounded-lg border border-white/30 bg-white/60 backdrop-blur-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-200" 
              />
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)} 
              className="rounded-lg border border-white/30 bg-white/60 backdrop-blur-md px-3 py-2 hidden sm:block focus:outline-none focus:ring-2 focus:ring-purple-200"
            >
              <option value="updated_desc">Newest</option>
              <option value="updated_asc">Oldest</option>
              <option value="completion_desc">Most complete</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Counter value={resumes.length} label="Total Resumes" icon={FileText} />
          <Counter value={resumes.filter(r => (r.completion_percentage || 0) > 80).length} label="Completed" icon={CheckCircle} color="text-green-600" />
          <Counter value={resumes.length > 0 ? new Date(Math.max(...resumes.map(r => new Date(r.updated_at)))).toLocaleDateString() : '—'} label="Last Updated" icon={TrendingUp} color="text-amber-600" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8 max-w-md mx-auto">
          <motion.div 
            whileHover={{ y: -6, scale: 1.02 }} 
            className="backdrop-blur-xl bg-white/40 border-white/20 shadow-xl p-6 rounded-2xl cursor-pointer group" 
            onClick={() => setShowNameDialog(true)}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-purple-600" />
              </div>
              <div className="font-medium">Create New Resume</div>
              <div className="text-sm text-slate-500 mt-1">Curated & recruiter-ready</div>
            </div>
          </motion.div>
        </div>

        {/* Resumes List */}
        <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle>Your Resumes</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <SkeletonGrid />
            ) : (
              <>
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first curated resume — quick, affordable, effective.</p>
                    <Button onClick={() => setShowNameDialog(true)} className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600">
                      <Plus className="w-4 h-4 mr-2" /> Create Your First Resume
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4">
                      {pageItems.map((resume) => (
                        <motion.div 
                          key={resume.id} 
                          whileHover={{ scale: 1.01 }} 
                          className="flex items-center justify-between p-4 border border-white/20 rounded-lg hover:shadow-md transition bg-white/60 backdrop-blur-md"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5 text-purple-600" />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-3">
                                <h3 className="font-medium truncate">{resume.title}</h3>
                                <Badge variant="secondary">{resume.completion_percentage ?? 0}%</Badge>
                                <span className="text-xs text-slate-400 ml-auto hidden sm:inline">ID: #{resume.id}</span>
                              </div>

                              <div className="mt-1 text-xs text-slate-500 flex gap-3 flex-wrap">
                                <span>Updated: {resume.updated_at ? new Date(resume.updated_at).toLocaleString() : '—'}</span>
                                <span>•</span>
                                <span>{resume.sections?.length ?? 0} sections</span>
                              </div>

                              <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden w-full max-w-xs">
                                <div className="h-2 bg-gradient-to-r from-purple-600 to-pink-500" style={{ width: `${resume.completion_percentage ?? 0}%` }} />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="ghost" onClick={() => handleDownload(resume)} aria-label={`Download ${resume.title}`}>
                              <Download className="w-4 h-4" />
                            </Button>

                            <Button asChild size="sm" variant="outline">
                              <Link to={`/resume/${resume.id}`}>
                                <Edit3 className="w-4 h-4 mr-2" /> Edit
                              </Link>
                            </Button>

                            <Button size="sm" variant="destructive" onClick={() => openConfirmDelete(resume)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Showing <span className="font-medium">{(page - 1) * PAGE_SIZE + 1}</span> - <span className="font-medium">{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-white/30 bg-white/60 backdrop-blur-md">
                          <span className="text-sm">{page}</span>
                          <span className="text-xs text-slate-400">/ {totalPages}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <ResumeNameDialog isOpen={showNameDialog} onClose={() => setShowNameDialog(false)} onConfirm={createNewResume} loading={creating} />

        {/* Confirm Dialog */}
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmOpen(false)} />
            <div role="dialog" aria-modal className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-xl max-w-md w-full p-6 border border-white/20">
              <h3 className="text-lg font-semibold">Delete resume?</h3>
              <p className="mt-2 text-sm text-slate-600">This will permanently delete "{confirmTarget?.title}". You will be able to undo immediately after deletion.</p>
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
