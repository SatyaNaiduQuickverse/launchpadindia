import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const ResumeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    if (id) {
      fetchResume();
    }
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await axios.get(`/api/resumes/${id}`);
      const resumeData = response.data;
      
      setValue('title', resumeData.title);
      if (resumeData.personal_info) {
        Object.keys(resumeData.personal_info).forEach(key => {
          setValue(`personalInfo.${key}`, resumeData.personal_info[key]);
        });
      }
    } catch (error) {
      toast.error('Failed to load resume');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        title: data.title,
        personalInfo: {
          firstName: data.personalInfo?.firstName || '',
          lastName: data.personalInfo?.lastName || '',
          email: data.personalInfo?.email || '',
          phone: data.personalInfo?.phone || '',
          address: data.personalInfo?.address || '',
          city: data.personalInfo?.city || '',
          state: data.personalInfo?.state || '',
          zipCode: data.personalInfo?.zipCode || '',
          summary: data.personalInfo?.summary || '',
          linkedIn: data.personalInfo?.linkedIn || '',
          portfolio: data.personalInfo?.portfolio || ''
        }
      };

      if (id) {
        await axios.put(`/api/resumes/${id}`, payload);
        toast.success('Resume updated successfully');
      } else {
        const response = await axios.post('/api/resumes', payload);
        toast.success('Resume created successfully');
        navigate(`/resume/${response.data.id}`);
      }
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const submitForReview = async () => {
    if (!id) {
      toast.error('Please save the resume first');
      return;
    }

    try {
      await axios.post(`/api/resumes/${id}/submit`);
      toast.success('Resume submitted for review');
    } catch (error) {
      toast.error('Failed to submit resume');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'experience', name: 'Experience', icon: '💼' },
    { id: 'skills', name: 'Skills', icon: '🔧' },
    { id: 'projects', name: 'Projects', icon: '🚀' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {id ? 'Edit Resume' : 'Create New Resume'}
            </h1>
            <p className="text-gray-600 mt-2">Fill in your information to create a professional resume</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </button>
            {id && (
              <button
                onClick={submitForReview}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Submit for Review
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume Title</label>
                  <input
                    {...register('title', { required: 'Resume title is required' })}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="My Professional Resume"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                </div>

                {activeSection === 'personal' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                        <input
                          {...register('personalInfo.firstName', { required: 'First name is required' })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John"
                        />
                        {errors.personalInfo?.firstName && <p className="mt-1 text-sm text-red-600">{errors.personalInfo.firstName.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                        <input
                          {...register('personalInfo.lastName', { required: 'Last name is required' })}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Doe"
                        />
                        {errors.personalInfo?.lastName && <p className="mt-1 text-sm text-red-600">{errors.personalInfo.lastName.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          {...register('personalInfo.email', { 
                            required: 'Email is required',
                            pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email' }
                          })}
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="john@example.com"
                        />
                        {errors.personalInfo?.email && <p className="mt-1 text-sm text-red-600">{errors.personalInfo.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          {...register('personalInfo.phone')}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                          {...register('personalInfo.address')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          {...register('personalInfo.city')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="New York"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          {...register('personalInfo.state')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="NY"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                        <input
                          {...register('personalInfo.zipCode')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="10001"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                        <input
                          {...register('personalInfo.linkedIn')}
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://linkedin.com/in/johndoe"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio/Website</label>
                        <input
                          {...register('personalInfo.portfolio')}
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="https://johndoe.com"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                        <textarea
                          {...register('personalInfo.summary')}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Brief professional summary highlighting your key achievements and goals..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'education' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                    <p className="text-gray-600">Education section coming soon...</p>
                  </div>
                )}

                {activeSection === 'experience' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h3>
                    <p className="text-gray-600">Experience section coming soon...</p>
                  </div>
                )}

                {activeSection === 'skills' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
                    <p className="text-gray-600">Skills section coming soon...</p>
                  </div>
                )}

                {activeSection === 'projects' && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects</h3>
                    <p className="text-gray-600">Projects section coming soon...</p>
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Resume'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeForm;
