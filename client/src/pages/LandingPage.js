import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

export default function LaunchPadIndiaLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const heroRef = useRef(null);
  const processRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState(48 * 3600);
  useEffect(() => {
    const end = Date.now() + timeLeft * 1000;
    const timer = setInterval(() => {
      const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimeLeft(s);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [parallaxY, setParallaxY] = useState(0);
  useEffect(() => {
    const onScroll = () => setParallaxY(window.scrollY * 0.12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (ref) => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Enter a valid email.';
    if (!college.trim()) e.college = 'College / city helps us personalize.';
    if (!resumeFile) e.resumeFile = 'Please upload your resume (PDF recommended).';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  }

  const formatTime = (s) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (d > 0) return `${d}d ${h}h ${m}m`;
    return `${h}h ${m}m ${sec}s`;
  };

  const testimonials = [
    {
      name: 'Aarti K.',
      meta: 'COEP — Pune',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=60',
      text: 'Got 3 interview calls after LaunchPad curated my resume — clear, measurable bullets made the difference.'
    },
    {
      name: 'Vivek S.',
      meta: 'VIT — Mumbai',
      photo: 'https://images.unsplash.com/photo-1545996124-1b2d3f35b7fc?auto=format&fit=crop&w=400&q=60',
      text: 'Affordable and practical — the curated resume started getting recruiter replies.'
    },
    {
      name: 'Nisha R.',
      meta: 'Nagpur',
      photo: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=400&q=60',
      text: 'The reviewer highlighted keywords I missed — much clearer for internships.'
    }
  ];

  return (
    <div className="text-gray-900 antialiased bg-gradient-to-b from-white to-slate-50 min-h-screen">
      {/* Header */}
      <header className="fixed left-0 right-0 top-4 z-40 px-4 sm:px-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 text-white font-bold">LP</div>
            <div className="hidden sm:block">
              <Link to="/" className="font-semibold">LaunchPad India</Link>
              <div className="text-xs text-slate-600">Resume curation for everyone</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <button onClick={() => scrollTo(processRef)} className="text-sm hover:underline focus:outline-none">How it works</button>
            <button onClick={() => scrollTo(pricingRef)} className="text-sm hover:underline focus:outline-none">Pricing</button>
            <button onClick={() => scrollTo(faqRef)} className="text-sm hover:underline focus:outline-none">FAQ</button>

            {user ? (
              <Link to="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-sm font-medium shadow">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="text-sm px-3 py-2 rounded-md hover:bg-white/30">Login</Link>
                <Link to="/register" className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm shadow-lg hover:scale-105 transform transition">Register</Link>
              </>
            )}
          </div>

          <div className="sm:hidden">
            <button aria-label="Open menu" className="p-2 rounded-lg bg-white/30 backdrop-blur-md" onClick={() => navigate('/login')}>Menu</button>
          </div>
        </nav>
      </header>

      <main className="pt-28">
        {/* HERO */}
        <section ref={heroRef} className="relative overflow-hidden" aria-labelledby="hero-heading">
          <div className="absolute right-0 top-0 hidden lg:block w-1/2 h-full">
            <img src="https://images.unsplash.com/photo-1520975918882-5b2e5a8b3b8f?auto=format&fit=crop&w=1400&q=80" alt="students collaborating" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-l from-white/80 to-transparent" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <div className="bg-white/70 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg max-w-xl">
                  <h1 id="hero-heading" className="text-3xl sm:text-4xl font-extrabold leading-tight">Get your resume curated and reviewed by experts</h1>
                  <p className="mt-4 text-slate-700">Experts from COEP, NITs and IIM-aligned reviewers — we curate for clarity, keywords, and measurable impact. Fixed price ₹249 • 24-hour delivery.</p>

                  <div className="mt-6 flex gap-3 flex-wrap">
                    <Link to={user ? '/checkout' : '/login'} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transform transition">Get curated & reviewed — ₹249</Link>
                    <button onClick={() => scrollTo(processRef)} className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm hover:shadow transition">How it Works</button>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow">🎓</div>
                      <div>
                        <div className="font-semibold">2000+</div>
                        <div className="text-xs">People helped</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow">⏱️</div>
                      <div>
                        <div className="font-semibold">24-hr Delivery</div>
                        <div className="text-xs">Guaranteed</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-xs text-slate-500">Money-back guarantee • ATS-tested • Personalized curation</div>
                </div>
              </motion.div>

              <div className="hidden lg:block" />
            </div>
          </div>
        </section>

        {/* VALUE SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 -mt-6">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-6 rounded-2xl shadow-lg border border-white/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center p-4">
                <div className="text-sm font-semibold text-slate-600">ATS score comparison</div>
                <div className="mt-4 flex items-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center bg-red-50 ring-4 ring-red-100">
                      <div className="text-2xl font-extrabold text-red-600">23%</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Before</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-28 h-28 rounded-full flex items-center justify-center bg-green-50 ring-4 ring-green-100 animate-pulse">
                      <div className="text-2xl font-extrabold text-green-700">94%</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">After</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-700 text-center">We lift ATS pass rates by aligning keywords, reformatting headers and converting bullets to measurable impact.</p>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-indigo-50 text-center">
                    <div className="text-lg font-extrabold">3.2x</div>
                    <div className="text-xs text-slate-600">More interviews*</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 text-center">
                    <div className="text-lg font-extrabold">24h</div>
                    <div className="text-xs text-slate-600">Delivery</div>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 text-center">
                    <div className="text-lg font-extrabold">94%</div>
                    <div className="text-xs text-slate-600">ATS pass rate</div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-4">
                  <div className="text-sm font-semibold text-slate-700">What's included</div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-semibold">✓</span>
                      <span>ATS keyword optimization</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-semibold">✓</span>
                      <span>Recruiter-first formatting</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-semibold">✓</span>
                      <span>Bullet rewriting with metrics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 font-semibold">✓</span>
                      <span>One free revision & money-back guarantee</span>
                    </li>
                  </ul>

                  <div className="mt-4">
                    <Link to={user ? '/checkout' : '/login'} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transition">Get curated resume — ₹249</Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* PROBLEM SECTION */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
                <h2 className="text-2xl font-bold">Why so many resumes get ignored</h2>
                <p className="mt-3 text-slate-700">Many talented people struggle because their resumes are not found by ATS or they fail to highlight measurable impact. Generic templates, wrong keywords, and poor formatting cost interviews.</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Applicant Tracking Systems filter out resumes missing role-specific keywords.</li>
                  <li>• Recruiters spend <strong>7–8 seconds</strong> scanning a resume — formatting matters.</li>
                  <li>• Students often underrepresent projects using technical metrics.</li>
                </ul>
              </div>

              <aside className="bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-5 rounded-2xl shadow-lg">
                <div className="font-semibold">LaunchPad Impact</div>
                <div className="mt-3 text-sm">We optimize for ATS AND recruiter-first reads — resulting in more interview invites for people across India.</div>
                <div className="mt-4 text-xs opacity-90">2000+ people • 82% success rate (interview calls)</div>
              </aside>
            </div>
          </motion.div>
        </section>

        {/* TESTIMONIALS */}
        <section className="bg-slate-50 py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="text-xl font-bold">What people say</motion.h3>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i }} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition">
                  <div className="flex items-center gap-4">
                    <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.meta}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-amber-400">
                      {[...Array(3)].map((_, starIndex) => (
                        <svg key={starIndex} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 .587l3.668 7.431L23.53 9.75l-5.764 5.615L19.335 24 12 20.012 4.665 24l1.568-8.635L.47 9.75l7.862-1.732z"/>
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="mt-4 text-slate-700 leading-relaxed">"{t.text}"</p>

                  <div className="mt-4 text-xs text-slate-500">Trusted by students and early-career professionals across India.</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-600">Want your story here? Get started with ₹249 curation + review — 24-hour delivery and money-back guarantee.</div>
          </div>
        </section>

        {/* PROCESS */}
        <section ref={processRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-bold">Simple 3-step process</h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <motion.div whileHover={{ y: -6 }} className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">1</div>
                <h4 className="mt-3 font-semibold">Upload Resume</h4>
                <p className="mt-2 text-sm text-slate-600">Share your current resume and 2–3 role preferences.</p>
              </motion.div>

              <motion.div whileHover={{ y: -6 }} className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">2</div>
                <h4 className="mt-3 font-semibold">Expert Review</h4>
                <p className="mt-2 text-sm text-slate-600">Reviewed by Ex-COEP, NIT, IIM pros — ATS & recruiter optimizations.</p>
              </motion.div>

              <motion.div whileHover={{ y: -6 }} className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">3</div>
                <h4 className="mt-3 font-semibold">Download & Apply</h4>
                <p className="mt-2 text-sm text-slate-600">Receive polished resume with a short checklist for applications.</p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* PRICING */}
        <section ref={pricingRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-2xl font-bold">One clear plan — ₹249</h3>
              <p className="mt-2 text-slate-600">No upsells, no hidden fees. Fixed price. 24-hour delivery. Money-back if you don't see improvement in 7 days.</p>

              <ul className="mt-4 space-y-3 text-sm text-slate-700">
                <li>• ATS keyword optimization</li>
                <li>• Recruiter-first formatting</li>
                <li>• Bullet rewriting + metrics</li>
                <li>• 24-hour turnaround</li>
                <li>• One free revision</li>
              </ul>

              <div className="mt-6 flex items-center gap-3">
                <div className="rounded-full px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold">Limited offer</div>
                <div className="text-sm text-slate-600">Sale ends in <span className="font-medium">{formatTime(timeLeft)}</span></div>
              </div>

              <div className="mt-6">
                <Link to={user ? '/checkout' : '/login'} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transition">Start Now — ₹249</Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-white/30 shadow-lg">
              <div className="text-sm text-slate-500">Progress</div>
              <div className="mt-3 w-full bg-white rounded-full h-3 shadow-inner overflow-hidden">
                <div className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500" style={{ width: '65%' }} />
              </div>

              <div className="mt-4 text-sm text-slate-600">65% of people see interview calls within 30 days (typical outcome).</div>

              <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Price</div>
                    <div className="text-2xl font-bold">₹249</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">Secure payment • ₹0 setup</div>
                </div>

                <div className="mt-4">
                  <Link to={user ? '/checkout' : '/login'} className="w-full inline-flex justify-center items-center gap-3 px-4 py-3 rounded-lg bg-indigo-700 text-white font-medium shadow hover:scale-105 transition">Pay ₹249 & Upload</Link>
                </div>

                <div className="mt-4 text-xs text-slate-500">Includes one free revision • Refund within 7 days if not satisfied</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* LEAD FORM */}
        <section id="lead" className="bg-gradient-to-br from-indigo-50 to-pink-50 py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow">
            <h4 className="text-lg font-bold">Get your resume reviewed — ₹249</h4>
            <p className="mt-2 text-sm text-slate-600">24-hour delivery • Ex-COEP, NIT, IIM reviewers • Upload your resume and we'll take care of the rest.</p>

            <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Resume submission form">
              <div>
                <label className="text-xs font-medium">Full name</label>
                <input 
                  aria-label="Full name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200`} 
                />
                {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
              </div>

              <div>
                <label className="text-xs font-medium">Email</label>
                <input 
                  aria-label="Email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200`} 
                />
                {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="text-xs font-medium">College / City</label>
                <input 
                  aria-label="College or city" 
                  value={college} 
                  onChange={(e) => setCollege(e.target.value)} 
                  className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.college ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200`} 
                />
                {errors.college && <div className="text-xs text-red-500 mt-1">{errors.college}</div>}
              </div>

              <div>
                <label className="text-xs font-medium">Upload resume (PDF)</label>
                <input 
                  aria-label="Upload resume" 
                  type="file" 
                  accept=".pdf,.doc,.docx" 
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} 
                  className="mt-1 w-full text-sm" 
                />
                {errors.resumeFile && <div className="text-xs text-red-500 mt-1">{errors.resumeFile}</div>}
              </div>

              <div className="sm:col-span-2 flex items-center gap-3 mt-2">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-70"
                >
                  {loading ? 'Processing...' : 'Pay & Submit — ₹249'}
                </button>

                <div className="text-xs text-slate-600">Secure payment • 24-hr delivery • Money-back guarantee</div>
              </div>

              <div className="sm:col-span-2 mt-2 text-sm">
                Already have an account? <Link to="/login" className="font-medium text-indigo-600">Sign in</Link>
              </div>

              {submitted && (
                <div className="sm:col-span-2 mt-2 text-green-600 font-medium">Thanks! We've received your request. Expect a delivery within 24 hours.</div>
              )}
            </form>
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <h3 className="text-2xl font-bold">Frequently asked questions</h3>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <details className="bg-white p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold">How fast will I get my resume?</summary>
              <p className="mt-2 text-sm text-slate-600">We deliver within 24 hours. If we miss the deadline, you get a full refund.</p>
            </details>

            <details className="bg-white p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold">What if I am not satisfied?</summary>
              <p className="mt-2 text-sm text-slate-600">We offer one free revision. If you still don't see improvement, claim a refund within 7 days.</p>
            </details>

            <details className="bg-white p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold">Do you help with internship resumes?</summary>
              <p className="mt-2 text-sm text-slate-600">Yes — we tailor resumes for internships and placements across engineering streams.</p>
            </details>

            <details className="bg-white p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold">Who reviews my resume?</summary>
              <p className="mt-2 text-sm text-slate-600">Experienced professionals from COEP, NITs, and IIM-aligned hiring consultants.</p>
            </details>

            <details className="bg-white p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold">What formats do you accept?</summary>
              <p className="mt-2 text-sm text-slate-600">We accept PDF, DOC, and DOCX files. PDF is preferred for better formatting preservation.</p>
            </details>

            <details className="bg-white p-4 rounded-2xl shadow">
              <summary className="cursor-pointer font-semibold">Is my resume confidential?</summary>
              <p className="mt-2 text-sm text-slate-600">Absolutely. We use secure systems and never share your personal information or resume content.</p>
            </details>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gradient-to-t from-white to-slate-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold">LP</div>
                  <div>
                    <div className="font-semibold">LaunchPad India</div>
                    <div className="text-xs text-slate-500">Resume curation for everyone • ₹249 • 24-hr delivery</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">Trusted by students and professionals across India — Pune, Mumbai, Nagpur and many more. Money-back guarantee.</div>
                
                <div className="mt-4 flex items-center gap-4">
                  <Link to="/privacy" className="text-xs text-slate-500 hover:text-slate-700">Privacy Policy</Link>
                  <Link to="/terms" className="text-xs text-slate-500 hover:text-slate-700">Terms of Service</Link>
                  <Link to="/refund" className="text-xs text-slate-500 hover:text-slate-700">Refund Policy</Link>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="text-sm">
                  <div className="font-semibold">Trust</div>
                  <div className="text-xs text-slate-500 mt-1">2000+ people helped</div>
                  <div className="text-xs text-slate-500">82% success rate</div>
                  <div className="text-xs text-slate-500">24-hour delivery</div>
                </div>

                <div className="text-sm">
                  <div className="font-semibold">Contact</div>
                  <div className="text-xs text-slate-500 mt-1">hello@launchpadindia.in</div>
                  <div className="text-xs text-slate-500">Support: 9AM-6PM IST</div>
                  <div className="text-xs text-slate-500">WhatsApp support</div>
                </div>

                <div className="text-sm">
                  <div className="font-semibold">Services</div>
                  <div className="text-xs text-slate-500 mt-1">Resume Review</div>
                  <div className="text-xs text-slate-500">ATS Optimization</div>
                  <div className="text-xs text-slate-500">Career Consulting</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-400">
                  © {new Date().getFullYear()} LaunchPad India. All rights reserved. ATS-friendly resumes • Money-back guarantee.
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-slate-500">All systems operational</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-slate-500">Secure & confidential</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
