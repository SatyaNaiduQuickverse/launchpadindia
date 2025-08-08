import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '../components/ui/button';
import { BasicDetailsSection } from '../components/sections/BasicDetails';
import { Sidebar } from '../components/layout/Sidebar';
import { ArrowLeft, Save } from 'lucide-react';

export default function ResumeBuilder() {
  const navigate = useNavigate();
  const { register, formState: { errors } } = useForm();
  const [activeSection, setActiveSection] = useState('basic');

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="mb-8 bg-white/60 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-2xl font-bold text-violet-600">Resume Builder</h1>
            </div>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Save className="w-4 h-4 mr-2" />
              Save Resume
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
          <div className="lg:col-span-3">
            {activeSection === 'basic' && <BasicDetailsSection register={register} errors={errors} />}
            {activeSection === 'education' && <div>Education section coming soon</div>}
            {activeSection === 'experience' && <ExperienceSection experienceEntries={experienceEntries} onAdd={addExperience} />}
            {activeSection === 'skills' && <div>Skills section coming soon</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
