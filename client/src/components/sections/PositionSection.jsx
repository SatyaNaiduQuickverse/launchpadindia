import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RichTextEditor } from '../ui/rich-editor';
import { Users, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const PositionSection = ({ positions = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  title: '', organization: '', startDate: '', endDate: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ title: '', organization: '', startDate: '', endDate: '', description: '' });
  setShowForm(false);
};

const examples = [
  { title: "Class Representative", org: "Final Year Computer Engineering", desc: "Managing class activities and student-faculty coordination" },
  { title: "Technical Head", org: "Robotics Club", desc: "Leading technical projects and workshops" },
  { title: "Event Coordinator", org: "College Cultural Festival", desc: "Organizing events for 2000+ participants" },
  { title: "Sports Captain", org: "Basketball Team", desc: "Team leadership and tournament coordination" },
  { title: "President", org: "Entrepreneurship Cell", desc: "Building startup ecosystem in college" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Position of Responsibility</CardTitle>
            <p className="text-sm text-slate-600">Leadership roles and responsibilities</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-cyan-600 hover:bg-cyan-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Position
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      <div className="mb-6 p-4 bg-cyan-50/60 rounded-lg border border-cyan-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-cyan-600" />
          <h4 className="font-medium text-cyan-800">Examples:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-cyan-100">
              <p className="font-semibold text-sm text-slate-800">{example.title}</p>
              <p className="text-xs text-slate-600 mt-1">{example.org}</p>
              <p className="text-xs text-slate-500 mt-1">{example.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Position Title *</label>
              <Input 
                placeholder="e.g., Class Representative" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization/Committee *</label>
              <Input 
                placeholder="e.g., Student Council" 
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                required
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
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Responsibilities & Achievements</label>
            <RichTextEditor
              placeholder="• Led a team of 15 students
- Organized events with 500+ participants
- Improved communication between students and faculty"
              value={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700">Save Position</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Positions ({positions.length})</h4>
        {positions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No positions added yet. Add your leadership roles!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {positions.map((position, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{position.title}</h3>
                    <p className="text-slate-600 font-medium">{position.organization}</p>
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {position.startDate} - {position.endDate || 'Present'}
                    </span>
                    <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: position.description }}></div>
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
