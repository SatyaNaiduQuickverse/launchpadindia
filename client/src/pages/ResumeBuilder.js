import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// UI Components
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';

// Section Components
import { Sidebar } from '../components/layout/Sidebar';
import { BasicDetailsSection } from '../components/sections/BasicDetails';
import { EducationSection } from '../components/sections/EducationSection';
import { ExperienceSection } from '../components/sections/ExperienceSection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { SkillsSection } from '../components/sections/SkillsSection';
import { PositionSection } from '../components/sections/PositionSection';
import { AwardsSection } from '../components/sections/AwardsSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { VolunteeringSection } from '../components/sections/VolunteeringSection';
import { ConferencesSection } from '../components/sections/ConferencesSection';
import { PublicationsSection } from '../components/sections/PublicationsSection';
import { PatentsSection } from '../components/sections/PatentsSection';
import { TestScoresSection } from '../components/sections/TestScoresSection';
import { ScholarshipsSection } from '../components/sections/ScholarshipsSection';
import { GuardianSection } from '../components/sections/GuardianSection';
import { MiscellaneousSection } from '../components/sections/MiscellaneousSection';
import { CheckoutModal } from '../components/CheckoutModal';

// Icons
import { Save, ArrowLeft, Send, Sparkles } from 'lucide-react';

const ResumeBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('basic');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [resumeData, setResumeData] = useState({
    basic: {},
    education: [],
    experience: [],
    projects: [],
    skills: [],
    positions: [],
    awards: [],
    certifications: [],
    volunteering: [],
    conferences: [],
    publications: [],
    patents: [],
    testScores: [],
    scholarships: [],
    guardians: [],
    misc: { languages: [], subjects: [] }
  });

  // Load resume data if editing existing resume
  useEffect(() => {
    if (id && id !== 'new') {
      loadResumeData();
    }
  }, [id]);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/resumes/${id}`);
      const data = response.data;
      
      setResumeData({
        basic: data.personal_info || {},
        education: data.education || [],
        experience: data.experience || [],
        projects: data.projects || [],
        skills: data.skills || [],
        positions: data.positions || [],
        awards: data.awards || [],
        certifications: data.certifications || [],
        volunteering: data.volunteering || [],
        conferences: data.conferences || [],
        publications: data.publications || [],
        patents: data.patents || [],
        testScores: data.test_scores || [],
        scholarships: data.scholarships || [],
        guardians: data.guardians || [],
        misc: { 
          languages: data.languages || [], 
          subjects: data.subjects || [] 
        }
      });
    } catch (error) {
      toast.error('Failed to load resume data');
      console.error('Error loading resume:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save resume data
  const saveResumeData = async () => {
    try {
      setSaving(true);
      const payload = {
        personalInfo: resumeData.basic,
        education: resumeData.education,
        experience: resumeData.experience,
        projects: resumeData.projects,
        skills: resumeData.skills,
        positions: resumeData.positions,
        awards: resumeData.awards,
        certifications: resumeData.certifications,
        volunteering: resumeData.volunteering,
        conferences: resumeData.conferences,
        publications: resumeData.publications,
        patents: resumeData.patents,
        testScores: resumeData.testScores,
        scholarships: resumeData.scholarships,
        guardians: resumeData.guardians,
        languages: resumeData.misc.languages,
        subjects: resumeData.misc.subjects
      };

      if (id && id !== 'new') {
        await axios.put(`/api/resumes/${id}`, payload);
        toast.success('Resume saved successfully!');
      } else {
        const response = await axios.post('/api/resumes', {
          title: 'My Resume',
          ...payload
        });
        toast.success('Resume created successfully!');
        navigate(`/resume/${response.data.id}`);
      }
    } catch (error) {
      toast.error('Failed to save resume');
      console.error('Error saving resume:', error);
    } finally {
      setSaving(false);
    }
  };

  // Section data handlers
  const updateBasicData = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      basic: { ...prev.basic, [field]: value }
    }));
  };

  const addToSection = (section, data) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], { ...data, id: Date.now() }]
    }));
  };

  const updateMiscData = (type, data) => {
    setResumeData(prev => ({
      ...prev,
      misc: {
        ...prev.misc,
        [type]: [...prev.misc[type], data]
      }
    }));
  };

  // Section handlers for each component
  const addEducation = (data) => addToSection('education', data);
  const addExperience = (data) => addToSection('experience', data);
  const addProject = (data) => addToSection('projects', data);
  const addSkill = (data) => addToSection('skills', data);
  const addPosition = (data) => addToSection('positions', data);
  const addAward = (data) => addToSection('awards', data);
  const addCertification = (data) => addToSection('certifications', data);
  const addVolunteering = (data) => addToSection('volunteering', data);
  const addConference = (data) => addToSection('conferences', data);
  const addPublication = (data) => addToSection('publications', data);
  const addPatent = (data) => addToSection('patents', data);
  const addTestScore = (data) => addToSection('testScores', data);
  const addScholarship = (data) => addToSection('scholarships', data);
  const addGuardian = (data) => addToSection('guardians', data);
  const addMisc = (type, data) => updateMiscData(type, data);

  // Render current section
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'basic':
        return (
          <BasicDetailsSection 
            register={register}
            errors={errors}
            data={resumeData.basic}
            onChange={updateBasicData}
          />
        );
      case 'education':
        return (
          <EducationSection 
            educationEntries={resumeData.education}
            onAdd={addEducation}
          />
        );
      case 'experience':
        return (
          <ExperienceSection 
            experienceEntries={resumeData.experience}
            onAdd={addExperience}
          />
        );
      case 'projects':
        return (
          <ProjectsSection 
            projects={resumeData.projects}
            onAdd={addProject}
          />
        );
      case 'skills':
        return (
          <SkillsSection 
            skills={resumeData.skills}
            onAdd={addSkill}
          />
        );
      case 'positions':
        return (
          <PositionSection 
            positions={resumeData.positions}
            onAdd={addPosition}
          />
        );
      case 'awards':
        return (
          <AwardsSection 
            awards={resumeData.awards}
            onAdd={addAward}
          />
        );
      case 'certifications':
        return (
          <CertificationsSection 
            certifications={resumeData.certifications}
            onAdd={addCertification}
          />
        );
      case 'volunteering':
        return (
          <VolunteeringSection 
            volunteering={resumeData.volunteering}
            onAdd={addVolunteering}
          />
        );
      case 'conferences':
        return (
          <ConferencesSection 
            conferences={resumeData.conferences}
            onAdd={addConference}
          />
        );
      case 'publications':
        return (
          <PublicationsSection 
            publications={resumeData.publications}
            onAdd={addPublication}
          />
        );
      case 'patents':
        return (
          <PatentsSection 
            patents={resumeData.patents}
            onAdd={addPatent}
          />
        );
      case 'testScores':
        return (
          <TestScoresSection 
            testScores={resumeData.testScores}
            onAdd={addTestScore}
          />
        );
      case 'scholarships':
        return (
          <ScholarshipsSection 
            scholarships={resumeData.scholarships}
            onAdd={addScholarship}
          />
        );
      case 'guardians':
        return (
          <GuardianSection 
            guardians={resumeData.guardians}
            onAdd={addGuardian}
          />
        );
      case 'misc':
        return (
          <MiscellaneousSection 
            miscData={resumeData.misc}
            onAdd={addMisc}
          />
        );
      default:
        return <div>Section not found</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your resume...</p>
        </div>
      </div>
    );
  }

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
                  {id && id !== 'new' ? `Edit Resume #${id}` : 'Create New Resume'}
                  {resumeData.basic?.title && <span className="text-lg font-normal"> - {resumeData.basic.title}</span>}
                </h1>
                <p className="text-slate-600 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
                  Create your perfect resume
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                size="lg" 
                onClick={saveResumeData}
                disabled={saving}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                <Save className="w-5 h-5 mr-2" />
                {saving ? 'Saving...' : 'Save Resume'}
              </Button>
              <Button 
                size="lg" 
                onClick={() => setShowCheckoutModal(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Send className="w-5 h-5 mr-2" />
                Submit for Review - ₹249
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar 
              activeSection={activeSection} 
              setActiveSection={setActiveSection}
              resumeData={resumeData}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderActiveSection()}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        resumeId={id}
        resumeTitle={resumeData.basic?.firstName ? `${resumeData.basic.firstName}'s Resume` : 'My Resume'}
      />
    </div>
  );
};

export default ResumeBuilder;
