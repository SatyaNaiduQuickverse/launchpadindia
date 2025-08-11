import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, GraduationCap, Briefcase, Code, Award, FileCheck, Heart, Users, Star, Presentation, BookOpen, Shield, Target, UserCheck, FolderOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { validateSection } from '../../utils/validation';

const sections = [
  { id: 'basic', name: 'Basic Details', icon: User, required: true },
  { id: 'education', name: 'Education', icon: GraduationCap, required: true },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'projects', name: 'Projects', icon: FolderOpen },
  { id: 'skills', name: 'Skills', icon: Code, required: true },
  { id: 'positions', name: 'Positions', icon: Users },
  { id: 'awards', name: 'Awards', icon: Award },
  { id: 'certifications', name: 'Certifications', icon: FileCheck },
  { id: 'volunteering', name: 'Volunteering', icon: Heart },
  { id: 'conferences', name: 'Conferences', icon: Presentation },
  { id: 'publications', name: 'Publications', icon: BookOpen },
  { id: 'patents', name: 'Patents', icon: Shield },
  { id: 'testScores', name: 'Test Scores', icon: Target },
  { id: 'scholarships', name: 'Scholarships', icon: GraduationCap },
  { id: 'guardians', name: 'Guardians', icon: UserCheck },
  { id: 'misc', name: 'Languages & Subjects', icon: Star }
];

export const Sidebar = ({ activeSection, setActiveSection, resumeData = {} }) => {
  const getValidationStatus = (section) => {
    if (!section.required) return null;
    return validateSection(section.id, resumeData[section.id] || {});
  };

  const completedRequired = sections.filter(s => {
    if (!s.required) return false;
    const validation = getValidationStatus(s);
    return validation?.isValid;
  }).length;

  const totalRequired = sections.filter(s => s.required).length;

  return (
    <Card className="bg-white/60 shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle>Resume Sections</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {completedRequired}/{totalRequired} required completed
          </span>
          <Badge variant={completedRequired === totalRequired ? "default" : "secondary"}>
            {Math.round((completedRequired / totalRequired) * 100)}%
          </Badge>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedRequired / totalRequired) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          const validation = getValidationStatus(section);
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-3 rounded-lg flex items-center justify-between transition-colors ${
                activeSection === section.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{section.name}</span>
                {section.required && (
                  <span className="text-red-500 text-xs">*</span>
                )}
              </div>
              {validation && (
                validation.isValid ? 
                  <CheckCircle className="w-4 h-4 text-green-600" /> :
                  <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
