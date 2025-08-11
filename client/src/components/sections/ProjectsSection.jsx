import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { FolderOpen, Plus, Edit3, Trash2, Lightbulb, Users, Calendar } from 'lucide-react';

export const ProjectsSection = ({ projects = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  title: '', domain: '', startDate: '', endDate: '', teamSize: '', organization: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ title: '', domain: '', startDate: '', endDate: '', teamSize: '', organization: '', description: '' });
  setShowForm(false);
};

const examples = [
  { title: "AI-Powered Medical Diagnosis System", domain: "Artificial Intelligence", team: "4 members", org: "Research Lab" },
  { title: "Blockchain-based Supply Chain Management", domain: "Distributed Systems", team: "5 members", org: "Industry Collaboration" },
  { title: "Quantum Computing Simulation Framework", domain: "Quantum Computing", team: "3 members", org: "Academic Research" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-rose-500/10 to-pink-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Projects</CardTitle>
            <p className="text-sm text-slate-600">Academic and research projects</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      
      <div className="mb-6 p-4 bg-rose-50/60 rounded-lg border border-rose-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-rose-600" />
          <h4 className="font-medium text-rose-800">Examples:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-rose-100">
              <p className="font-semibold text-sm text-slate-800">{example.title}</p>
              <p className="text-xs text-slate-600 mt-1">{example.domain}</p>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="secondary" className="text-xs">{example.team}</Badge>
                <span className="text-xs text-slate-500">{example.org}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Title *</label>
              <Input 
                placeholder="e.g., AI-Powered Medical Diagnosis System" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Project Domain *</label>
              <Input 
                placeholder="e.g., Machine Learning, Blockchain, IoT"
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Associated With</label>
              <Input 
                placeholder="e.g., Research Lab, Industry Partner, College"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <Input 
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <Input 
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
              <Input 
                type="number"
                min="1"
                placeholder="e.g., 3"
                value={formData.teamSize}
                onChange={(e) => setFormData({...formData, teamSize: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Project Description</label>
            <RichTextEditor
              placeholder="Describe the project objectives, methodologies, technologies, your role, and key outcomes..."
              value={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-rose-600 hover:bg-rose-700">Save Project</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Projects ({projects.length})</h4>
        {projects.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No projects added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{project.title}</h3>
                    <p className="text-slate-600 font-medium">{project.domain}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      {project.startDate && (
                        <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {project.startDate} - {project.endDate || 'Present'}
                        </span>
                      )}
                      {project.teamSize && (
                        <Badge variant="secondary" className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {project.teamSize} members
                        </Badge>
                      )}
                      {project.organization && <span className="text-sm text-slate-500">{project.organization}</span>}
                    </div>
                    {project.description && (
                      <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: project.description }}></div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <Button size="sm" variant="outline"><Edit3 className="w-3 h-3" /></Button>
                    <Button size="sm" variant="destructive"><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
};
