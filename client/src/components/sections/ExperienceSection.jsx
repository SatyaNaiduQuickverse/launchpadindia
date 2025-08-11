import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { Briefcase, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const ExperienceSection = ({ experienceEntries = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  position: '', company: '', location: '', startDate: '', endDate: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ position: '', company: '', location: '', startDate: '', endDate: '', description: '' });
  setShowForm(false);
};

const examples = [
  { position: "Software Engineering Intern", company: "Google", location: "Bangalore", duration: "3 months", type: "Internship" },
  { position: "Data Analyst", company: "Flipkart", location: "Mumbai", duration: "1 year", type: "Full-time" },
  { position: "Frontend Developer", company: "Zomato", location: "Delhi", duration: "6 months", type: "Part-time" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Experience</CardTitle>
            <p className="text-sm text-slate-600">Work experience, internships & projects</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      
      {/* Examples Section */}
      <div className="mb-6 p-4 bg-purple-50/60 rounded-lg border border-purple-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          <h4 className="font-medium text-purple-800">Examples to get you started:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-purple-100">
              <p className="font-semibold text-sm text-slate-800">{example.position}</p>
              <p className="text-xs text-slate-600 mt-1">{example.company}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">{example.location}</span>
                <Badge variant="secondary" className="text-xs">{example.type}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position/Role *</label>
              <Input 
                placeholder="e.g., Software Engineering Intern" 
                value={formData.position} 
                onChange={(e) => setFormData({...formData, position: e.target.value})} 
                className="bg-white/80"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
              <Input 
                placeholder="e.g., Google" 
                value={formData.company} 
                onChange={(e) => setFormData({...formData, company: e.target.value})} 
                className="bg-white/80"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <Input 
                placeholder="e.g., Bangalore, India" 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                className="bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <Input 
                type="date" 
                value={formData.startDate} 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                className="bg-white/80"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <Input 
                type="date" 
                value={formData.endDate} 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                className="bg-white/80"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Description & Achievements</label>
            <RichTextEditor
              placeholder="• Led a team of 5 developers in building a mobile application
- Increased user engagement by 40% through UI/UX improvements  
- Implemented new features using React and Node.js
- Collaborated with cross-functional teams to deliver projects on time"
              value={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>
          <div className="flex space-x-3 pt-2">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Save Experience</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}
      
      <div className="space-y-4">
        {experienceEntries.map((entry, index) => (
          <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-slate-800">{entry.position}</h3>
                <p className="text-slate-600 font-medium">{entry.company}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{entry.startDate} - {entry.endDate}</span>
                  {entry.location && <span className="text-sm text-slate-500">📍 {entry.location}</span>}
                </div>
                <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: entry.description }}></div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="outline" className="hover:bg-blue-50"><Edit3 className="w-3 h-3" /></Button>
                <Button size="sm" variant="destructive" className="hover:bg-red-50"><Trash2 className="w-3 h-3" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);
};
