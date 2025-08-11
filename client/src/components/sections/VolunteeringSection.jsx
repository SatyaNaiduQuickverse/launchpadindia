import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { Heart, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const VolunteeringSection = ({ volunteering = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  role: '', organization: '', startDate: '', endDate: '', location: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ role: '', organization: '', startDate: '', endDate: '', location: '', description: '' });
  setShowForm(false);
};

const examples = [
  { role: "Teaching Volunteer", org: "Teach for India", activity: "Teaching underprivileged children on weekends" },
  { role: "NSS Volunteer", org: "National Service Scheme", activity: "Community service and rural development" },
  { role: "Event Coordinator", org: "CRY (Child Rights and You)", activity: "Organizing fundraising events" },
  { role: "Blood Donation Drive Lead", org: "Red Cross Society", activity: "Organizing blood donation camps" },
  { role: "Environmental Volunteer", org: "Greenpeace India", activity: "Tree plantation and awareness drives" },
  { role: "Mentor", org: "Smile Foundation", activity: "Career guidance for underprivileged students" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-pink-500/10 to-rose-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Volunteering & Social Work</CardTitle>
            <p className="text-sm text-slate-600">Community service and volunteer activities</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-pink-600 hover:bg-pink-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Volunteer Work
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      {/* Examples */}
      <div className="mb-6 p-4 bg-pink-50/60 rounded-lg border border-pink-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-pink-600" />
          <h4 className="font-medium text-pink-800">Volunteering Examples:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-pink-100">
              <p className="font-semibold text-sm text-slate-800">{example.role}</p>
              <p className="text-xs text-slate-600 mt-1">{example.org}</p>
              <p className="text-xs text-slate-500 mt-1">{example.activity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role/Position *</label>
              <Input 
                placeholder="e.g., Teaching Volunteer" 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization *</label>
              <Input 
                placeholder="e.g., Teach for India" 
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <Input 
                placeholder="e.g., Mumbai, Maharashtra"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Activities & Impact</label>
            <RichTextEditor
              placeholder="• Taught basic math and English to 30+ underprivileged children
- Organized educational activities and games for better learning
- Helped improve literacy rates in the local community
- Collaborated with other volunteers to create engaging lesson plans"
              value={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-pink-600 hover:bg-pink-700">Save Volunteer Work</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Volunteering Display */}
      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Volunteer Experience ({volunteering.length})</h4>
        {volunteering.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Heart className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No volunteer experience added yet. Add your community service activities!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {volunteering.map((item, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{item.role}</h3>
                    <p className="text-slate-600 font-medium">{item.organization}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        {item.startDate} - {item.endDate || 'Present'}
                      </span>
                      {item.location && <span className="text-sm text-slate-500">📍 {item.location}</span>}
                    </div>
                    <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: item.description }}></div>
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
