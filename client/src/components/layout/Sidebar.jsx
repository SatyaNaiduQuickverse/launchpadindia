import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { User, GraduationCap, Briefcase, Code } from 'lucide-react';

const sections = [
  { id: 'basic', name: 'Basic Details', icon: User },
  { id: 'education', name: 'Education', icon: GraduationCap },
  { id: 'experience', name: 'Experience', icon: Briefcase },
  { id: 'skills', name: 'Skills', icon: Code }
];

export const Sidebar = ({ activeSection, setActiveSection }) => (
  <Card className="bg-white/60 shadow-lg sticky top-8">
    <CardHeader>
      <CardTitle>Sections</CardTitle>
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
