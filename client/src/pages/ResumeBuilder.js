import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
  User, GraduationCap, Briefcase, Code, FolderOpen, Award, Save, ArrowLeft, Send, Plus, Calendar, MapPin, Mail, Phone, Globe, Camera, Sparkles, CheckCircle2, Edit3, Trash2, Building, Languages, Heart, X
} from 'lucide-react';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [educationEntries, setEducationEntries] = useState([]);
  const [experienceEntries, setExperienceEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const sections = [
    { id: 'basic', name: 'Basic Details', icon: User, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'education', name: 'Education', icon: GraduationCap, gradient: 'from-green-500 to-emerald-500' },
    { id: 'experience', name: 'Experience', icon: Briefcase, gradient: 'from-purple-500 to-violet-500' },
    { id: 'skills', name: 'Skills', icon: Code, gradient: 'from-orange-500 to-red-500' }
  ];

  const addEducationEntry = (entry) => {
    setEducationEntries(prev => [...prev, { ...entry, id: Date.now() }]);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8 backdrop-blur-xl bg-white/30 rounded-2xl p-6 border border-white/20 shadow-2xl animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  Professional Resume Builder
                </h1>
                <p className="text-slate-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                  Create your perfect resume
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700">
                <Save className="w-5 h-5 mr-2" />
                Save Resume
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-emerald-600">
                <Send className="w-5 h-5 mr-2" />
                Submit for Review
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  Resume Sections
                </CardTitle>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div className="bg-gradient-to-r from-violet-500 to-purple-600 h-3 rounded-full transition-all duration-500 w-1/4"></div>
                </div>
                <p className="text-xs text-slate-500">25% Complete</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-300 flex items-center space-x-3 transform hover:scale-102 ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-white to-white/80 shadow-lg scale-105'
                          : 'hover:bg-white/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${section.gradient} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium text-slate-700">{section.name}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'basic' && (
              <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl animate-slideIn">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>Personal Details</CardTitle>
                      <p className="text-sm text-slate-600">Your basic information</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  
                  {/* Profile Photo */}
                  <div className="mb-8 text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
                        <User className="w-16 h-16 text-white" />
                      </div>
                      <Button size="sm" className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0" type="button">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name *</label>
                      <div className="relative">
                        <Input placeholder="John" className="pl-10 bg-white/60" />
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name *</label>
                      <div className="relative">
                        <Input placeholder="Doe" className="pl-10 bg-white/60" />
                        <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email *</label>
                      <div className="relative">
                        <Input type="email" placeholder="john@example.com" className="pl-10 bg-white/60" />
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <div className="relative">
                        <Input placeholder="+1 234 567 8900" className="pl-10 bg-white/60" />
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date of Birth</label>
                      <div className="relative">
                        <Input type="date" className="pl-10 bg-white/60" />
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">LinkedIn</label>
                      <div className="relative">
                        <Input placeholder="https://linkedin.com/in/johndoe" className="pl-10 bg-white/60" />
                        <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium">Professional Summary</label>
                      <textarea
                        className="w-full px-4 py-3 rounded-md border bg-white/60 resize-none"
                        rows={4}
                        placeholder="Write a compelling summary..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {activeSection === 'education' && (
              <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl animate-slideIn">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>Education Details</CardTitle>
                        <p className="text-sm text-slate-600">Your academic background</p>
                      </div>
                    </div>
                    <Button onClick={() => setShowModal(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {educationEntries.length === 0 ? (
                    <div className="text-center py-12">
                      <GraduationCap className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No education entries yet</h3>
                      <p className="text-slate-500 mb-6">Add your academic achievements</p>
                      <Button onClick={() => setShowModal(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {educationEntries.map((entry) => (
                        <div key={entry.id} className="p-6 bg-white/60 rounded-lg">
                          <h3 className="font-semibold">{entry.degree}</h3>
                          <p className="text-slate-600">{entry.institution}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Other sections placeholder */}
            {(activeSection === 'experience' || activeSection === 'skills') && (
              <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl animate-slideIn">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
                  <p className="text-slate-600 mb-6">This section is being crafted with love ✨</p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add {sections.find(s => s.id === activeSection)?.name}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Add Education</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input placeholder="Degree/Course" />
              <Input placeholder="Institution" />
              <Input placeholder="Percentage/CGPA" />
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={() => addEducationEntry({degree: 'B.Tech', institution: 'COEP'})}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
