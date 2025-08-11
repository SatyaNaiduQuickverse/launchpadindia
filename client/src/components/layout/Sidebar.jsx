import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { User, GraduationCap, Briefcase, Code, Award, FileCheck, Heart, Users, Star, Presentation, BookOpen, Shield, Target, UserCheck, FolderOpen } from 'lucide-react';

const sections = [
  { id: 'basic', name: 'Basic Details', icon: User },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'projects', name: 'Projects', icon: FolderOpen },
  { id: 'skills', name: 'Skills', icon: Code },
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
  const completedSections = sections.filter(section => {
    const data = resumeData[section.id];
    if (Array.isArray(data)) {
      return data.length > 0;
    }
    return data && Object.keys(data).length > 0;
  }).length;

  return (
    <Card className="bg-white/60 shadow-lg sticky top-8">
      <CardHeader>
        <CardTitle>Resume Sections</CardTitle>
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">
            {completedSections}/{sections.length} sections completed
          </span>
          <Badge variant="default">
            {Math.round((completedSections / sections.length) * 100)}%
          </Badge>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedSections / sections.length) * 100}%` }}
          ></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                activeSection === section.id ? 'bg-blue-100' : 'hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{section.name}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
};
