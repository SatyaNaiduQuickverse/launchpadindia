import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

// LaunchPad India - Single-file React landing page
// Requirements fulfilled:
// - Tailwind CSS classes used for styling (ensure Tailwind is configured in your app)
// - Framer Motion for smooth animations
// - Functional component with hooks
// - Accessibility attributes, form validation, loading states
// - Glassmorphism, gradients, subtle parallax, mobile-first responsive
// - Strategic CTA placement, testimonials, urgency, money-back guarantee

// INSTALLATION NOTES (brief):
// 1. Ensure React + Tailwind are set up. For framer-motion: `npm i framer-motion`
// 2. Add this file to your src/components directory and import into App.jsx
// 3. Tailwind config should allow `backdrop-blur` and `bg-opacity` utilities.

export default function LaunchPadIndiaLanding() {
  // Refs for section scrolling
  const heroRef = useRef(null);
  const processRef = useRef(null);
  const pricingRef = useRef(null);
  const faqRef = useRef(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [college, setCollege] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Countdown urgency (48h limited-time from mount)
  const [timeLeft, setTimeLeft] = useState(48 * 3600);
  useEffect(() => {
    const end = Date.now() + timeLeft * 1000;
    const timer = setInterval(() => {
      const s = Math.max(0, Math.floor((end - Date.now()) / 1000));
      setTimeLeft(s);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parallax: subtle header background movement
  const [parallaxY, setParallaxY] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      setParallaxY(window.scrollY * 0.15);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Helpers
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
    setSubmitted(false);
    // Simulate upload + processing (24-hour delivery is our real offering)
    await new Promise((r) => setTimeout(r, 1400));
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

  // Sample testimonials (replace with real images & content)
  const testimonials = [
    {
      name: 'Aarti K., COEP',
      role: 'BTech - Mechanical, Pune',
      photo: 'https://i.pravatar.cc/100?img=12',
      text: 'Got 3 interview calls in 2 weeks after the resume revamp. The ATS tweaks actually worked.',
    },
    {
      name: 'Vivek S., VIT (Mumbai)',
      role: 'BTech - Computer Science',
      photo: 'https://i.pravatar.cc/100?img=5',
      text: 'Affordable and fast. Review came with real suggestions and was tailored to small-town struggles.',
    },
  ];

  return (
    <div className="text-gray-900 antialiased bg-gradient-to-b from-white to-slate-50 min-h-screen">
      {/* Sticky nav */}
      <header className="fixed left-0 right-0 top-4 z-40 px-4 sm:px-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 text-white font-bold">LP</div>
            <div className="hidden sm:block">
              <a href="#home" onClick={() => scrollTo(heroRef)} className="font-semibold">LaunchPad India</a>
              <div className="text-xs text-slate-600">Resume curation for engineers</div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <button onClick={() => scrollTo(processRef)} className="text-sm hover:underline focus:outline-none">How it works</button>
            <button onClick={() => scrollTo(pricingRef)} className="text-sm hover:underline focus:outline-none">Pricing</button>
            <button onClick={() => scrollTo(faqRef)} className="text-sm hover:underline focus:outline-none">FAQ</button>
            <a
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white text-sm shadow-lg hover:scale-105 transform transition"
              href="#lead"
              onClick={() => document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get Started — ₹249
            </a>
          </div>

          <div className="sm:hidden">
            <button
              aria-label="Open menu"
              className="p-2 rounded-lg bg-white/30 backdrop-blur-md"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-28">
        {/* HERO */}
        <section ref={heroRef} id="home" className="relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateY(${parallaxY * -0.2}px)` }}
            aria-hidden
          >
            <div className="w-full h-96 bg-gradient-to-br from-indigo-50 to-pink-50 opacity-70" />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                <div className="bg-white/60 backdrop-blur-md border border-white/30 p-6 rounded-2xl shadow-lg">
                  <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">LaunchPad India — Resume Curation for Engineers</h1>
                  <p className="mt-4 text-slate-700">Expert resume reviews from Ex-COEP, NIT & IIM professionals — ATS-optimized, interview-call focused. Fixed price ₹249 • 24-hour delivery.</p>

                  <div className="mt-6 flex gap-3 flex-wrap">
                    <a href="#lead" id="hero-cta" onClick={() => document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transform transition">
                      Get Resume Reviewed ₹249
                    </a>

                    <button className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm hover:shadow transition" onClick={() => scrollTo(processRef)}>
                      How it Works
                    </button>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white shadow">🎓</div>
                      <div>
                        <div className="font-semibold">2000+</div>
                        <div className="text-xs">Students placed</div>
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

                  <div className="mt-6 text-xs text-slate-500">Money-back guarantee • ATS-tested • Personalized suggestions</div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 }}>
                <div className="relative p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-white/30 shadow-2xl">
                  {/* Before / After showcase */}
                  <div className="flex gap-4 flex-col sm:flex-row">
                    <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                      <div className="text-xs font-semibold text-slate-500">Before</div>
                      <div className="mt-3 text-sm text-slate-700">Unstructured formatting • Missing keywords • Low ATS score</div>
                      <pre className="mt-4 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded">• Objective: Looking for internship
• Skills: C, C++, Java
• Projects: 1 small project</pre>
                    </div>

                    <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
                      <div className="text-xs font-semibold text-slate-500">After</div>
                      <div className="mt-3 text-sm text-slate-700">ATS-optimized header • Role-oriented keywords • Impact-focused bullets</div>
                      <pre className="mt-4 text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded">• Resume optimized for Software Internship
• Skills: Python, ROS, Embedded C — ATS keywords added
• Projects: Designed nav stack; reduced latency by 30%</pre>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3 items-center">
                    <a className="text-sm font-medium underline" href="#samples">View sample resumes</a>
                    <div className="ml-auto text-xs text-slate-500">Trusted by students from Pune • Mumbai • Nagpur</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="max-w-6xl mx-auto px-4 sm:px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow">
                <h2 className="text-2xl font-bold">Why so many engineering resumes get ignored</h2>
                <p className="mt-3 text-slate-700">Many talented students from smaller towns struggle because their resumes are not found by ATS or they fail to highlight measurable impact. Generic templates, wrong keywords, and poor formatting cost interviews.</p>

                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>• Applicant Tracking Systems filter out resumes missing role-specific keywords.</li>
                  <li>• Recruiters spend <strong>7–8 seconds</strong> scanning a resume — formatting matters.</li>
                  <li>• Small-town students often underrepresent projects using technical metrics.</li>
                </ul>
              </div>

              <aside className="bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-5 rounded-2xl shadow-lg">
                <div className="font-semibold">LaunchPad Impact</div>
                <div className="mt-3 text-sm">We optimize for ATS AND recruiter-first reads — resulting in more interview invites for students from Maharashtra.</div>
                <div className="mt-4 text-xs opacity-90">2000+ students • 82% success rate (interview calls)</div>
              </aside>
            </div>
          </motion.div>
        </section>

        {/* Success Stories */}
        <section className="bg-slate-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <motion.h3 initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="text-xl font-bold">Success stories — Real students from Maharashtra</motion.h3>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.blockquote key={i} whileHover={{ scale: 1.02 }} className="bg-white p-5 rounded-2xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <img src={t.photo} alt={`${t.name} photo`} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-slate-700 text-sm">"{t.text}"</p>
                </motion.blockquote>
              ))}
            </div>

            <div className="mt-6 text-sm text-slate-600">Want your story here? Start with our ₹249 review and get 24-hour delivery + money-back guarantee.</div>
          </div>
        </section>

        {/* 3-step process */}
        <section ref={processRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}>
            <h3 className="text-2xl font-bold">Simple 3-step process</h3>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">1</div>
                <h4 className="mt-3 font-semibold">Upload Resume</h4>
                <p className="mt-2 text-sm text-slate-600">Share your current resume and 2–3 role preferences.</p>
              </div>

              <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">2</div>
                <h4 className="mt-3 font-semibold">Expert Review</h4>
                <p className="mt-2 text-sm text-slate-600">Reviewed by Ex-COEP, NIT, IIM pros — ATS & recruiter optimizations.</p>
              </div>

              <div className="p-5 bg-white rounded-2xl shadow hover:shadow-lg transition">
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center font-bold">3</div>
                <h4 className="mt-3 font-semibold">Download & Apply</h4>
                <p className="mt-2 text-sm text-slate-600">Receive polished resume with a short checklist for applications.</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Pricing */}
        <section ref={pricingRef} className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow">
              <h3 className="text-2xl font-bold">One clear plan — ₹249</h3>
              <p className="mt-2 text-slate-600">No upsells, no hidden fees. Fixed price. 24-hour delivery. Money-back if you don’t see improvement in 7 days.</p>

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
                <a href="#lead" onClick={() => document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transition">
                  Start Now — ₹249
                </a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 8 }} whileInView={{ opacity: 1, x: 0 }} className="p-6 rounded-2xl bg-gradient-to-br from-white to-indigo-50 border border-white/30 shadow-lg">
              <div className="text-sm text-slate-500">Progress</div>
              <div className="mt-3 w-full bg-white rounded-full h-3 shadow-inner overflow-hidden">
                <div className="h-3 rounded-full bg-gradient-to-r from-indigo-600 to-pink-500" style={{ width: '65%' }} />
              </div>

              <div className="mt-4 text-sm text-slate-600">65% of students see interview calls within 30 days (typical outcome).</div>

              <div className="mt-6 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-500">Price</div>
                    <div className="text-2xl font-bold">₹249</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">Secure payment • ₹0 setup</div>
                </div>

                <div className="mt-4">
                  <a href="#lead" onClick={() => document.getElementById('lead')?.scrollIntoView({ behavior: 'smooth' })} className="w-full inline-flex justify-center items-center gap-3 px-4 py-3 rounded-lg bg-indigo-700 text-white font-medium shadow hover:scale-105 transition">
                    Pay ₹249 & Upload
                  </a>
                </div>

                <div className="mt-4 text-xs text-slate-500">Includes one free revision • Refund within 7 days if not satisfied</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Lead capture / Form */}
        <section id="lead" className="bg-gradient-to-br from-indigo-50 to-pink-50 py-10 px-4">
          <div className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-white/30 shadow">
            <h4 className="text-lg font-bold">Get your resume reviewed — ₹249</h4>
            <p className="mt-2 text-sm text-slate-600">24-hour delivery • Ex-COEP, NIT, IIM reviewers • Upload your resume and we’ll take care of the rest.</p>

            <form onSubmit={onSubmit} className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3" aria-label="Resume submission form">
              <div>
                <label className="text-xs font-medium">Full name</label>
                <input aria-label="Full name" value={name} onChange={(e) => setName(e.target.value)} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.name ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
              </div>

              <div>
                <label className="text-xs font-medium">Email</label>
                <input aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.email ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
              </div>

              <div>
                <label className="text-xs font-medium">College / City</label>
                <input aria-label="College or city" value={college} onChange={(e) => setCollege(e.target.value)} className={`mt-1 w-full px-3 py-2 rounded-lg border ${errors.college ? 'border-red-400' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-indigo-200`} />
                {errors.college && <div className="text-xs text-red-500 mt-1">{errors.college}</div>}
              </div>

              <div>
                <label className="text-xs font-medium">Upload resume (PDF)</label>
                <input aria-label="Upload resume" type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} className={`mt-1 w-full text-sm`} />
                {errors.resumeFile && <div className="text-xs text-red-500 mt-1">{errors.resumeFile}</div>}
              </div>

              <div className="sm:col-span-2 flex items-center gap-3 mt-2">
                <button type="submit" disabled={loading} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold shadow hover:scale-105 transition disabled:opacity-70">
                  {loading ? 'Processing...' : 'Pay & Submit — ₹249'}
                </button>

                <div className="text-xs text-slate-600">Secure payment • 24-hr delivery • Money-back guarantee</div>
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
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gradient-to-t from-white to-slate-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-pink-500 text-white flex items-center justify-center font-bold">LP</div>
                  <div>
                    <div className="font-semibold">LaunchPad India</div>
                    <div className="text-xs text-slate-500">Resume curation for engineers • ₹249 • 24-hr delivery</div>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">Trusted by students across Maharashtra — Pune, Mumbai, Nagpur and many more. Money-back guarantee.</div>
              </div>

              <div className="flex gap-4">
                <div className="text-sm">
                  <div className="font-semibold">Trust</div>
                  <div className="text-xs text-slate-500">2000+ students placed</div>
                </div>

                <div className="text-sm">
                  <div className="font-semibold">Contact</div>
                  <div className="text-xs text-slate-500">hello@launchpadindia.in</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-400">© {new Date().getFullYear()} LaunchPad India. All rights reserved. ATS-friendly resumes • Money-back guarantee.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
