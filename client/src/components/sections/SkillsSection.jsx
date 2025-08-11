import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Code, Heart, Plus, Lightbulb, X } from 'lucide-react';

export const SkillsSection = ({ skills = [], onAdd }) => {
const [activeTab, setActiveTab] = useState('technical');
const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate', type: 'technical' });

const handleAdd = () => {
  if (newSkill.name) {
    onAdd({...newSkill, type: activeTab});
    setNewSkill({ name: '', level: 'Intermediate', type: activeTab });
  }
};

const technicalSkills = [
  { category: "Programming", skills: ["JavaScript", "Python", "Java", "C++", "SQL", "HTML/CSS"] },
  { category: "Design", skills: ["Figma", "Adobe XD", "Photoshop", "Canva", "Sketch"] },
  { category: "Data & Analytics", skills: ["Excel", "Power BI", "Tableau", "R", "SPSS", "Google Analytics"] },
  { category: "Business Tools", skills: ["SAP", "Salesforce", "QuickBooks", "Tally", "MS Office"] },
  { category: "Marketing", skills: ["Google Ads", "Facebook Ads", "SEO", "Content Writing", "Social Media"] }
];

const softSkills = [
  { category: "Leadership", skills: ["Team Management", "Project Management", "Mentoring", "Decision Making"] },
  { category: "Communication", skills: ["Public Speaking", "Presentation", "Writing", "Negotiation"] },
  { category: "Problem Solving", skills: ["Critical Thinking", "Research", "Innovation", "Troubleshooting"] },
  { category: "Interpersonal", skills: ["Teamwork", "Collaboration", "Empathy", "Networking"] }
];

const technicalSkillsList = skills.filter(skill => skill.type === 'technical');
const softSkillsList = skills.filter(skill => skill.type === 'soft');

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Code className="w-6 h-6 text-white" />
        </div>
        <div>
          <CardTitle>Skills & Competencies</CardTitle>
          <p className="text-sm text-slate-600">Technical expertise and soft skills</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      <div className="flex mb-6 bg-white/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('technical')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'technical' ? 'bg-white shadow-sm text-orange-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Code className="w-4 h-4 mr-2" />
          Technical Skills
        </button>
        <button
          onClick={() => setActiveTab('soft')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'soft' ? 'bg-white shadow-sm text-red-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4 mr-2" />
          Soft Skills
        </button>
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-orange-50/60 to-red-50/60 rounded-lg border border-orange-200/50">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-5 h-5 text-orange-600" />
          <h4 className="font-medium text-orange-800">
            {activeTab === 'technical' ? 'Technical Skills Examples:' : 'Soft Skills Examples:'}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === 'technical' ? technicalSkills : softSkills).map((category, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-orange-100">
              <h5 className="font-semibold text-sm text-slate-800 mb-2">{category.category}</h5>
              <div className="flex flex-wrap gap-1">
                {category.skills.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-white/70 rounded-xl border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {activeTab === 'technical' ? 'Technical Skill' : 'Soft Skill'}
            </label>
            <Input 
              placeholder={activeTab === 'technical' ? 'e.g., Python, Excel, Figma' : 'e.g., Leadership, Communication'} 
              value={newSkill.name}
              onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
              className="bg-white/80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Proficiency Level</label>
            <select 
              className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm"
              value={newSkill.level}
              onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={handleAdd} className={`${activeTab === 'technical' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-red-600 hover:bg-red-700'}`}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-slate-700">
            {activeTab === 'technical' 
              ? `Technical Skills (${technicalSkillsList.length})`
              : `Soft Skills (${softSkillsList.length})`
            }
          </h4>
        </div>
        
        {(activeTab === 'technical' ? technicalSkillsList : softSkillsList).length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {activeTab === 'technical' ? (
              <>
                <Code className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No technical skills added yet. Add programming languages, tools, or software you know!</p>
              </>
            ) : (
              <>
                <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No soft skills added yet. Add leadership, communication, or interpersonal skills!</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {(activeTab === 'technical' ? technicalSkillsList : softSkillsList).map((skill, index) => (
              <div key={index} className="group relative">
                <Badge 
                  variant="secondary" 
                  className={`p-3 text-sm font-medium ${
                    skill.level === 'Expert' ? 'bg-green-100 text-green-800 border-green-200' :
                    skill.level === 'Advanced' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    skill.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }`}
                >
                  <span className="font-semibold">{skill.name}</span>
                  <span className="ml-2 text-xs opacity-75">({skill.level})</span>
                  <button className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
};
