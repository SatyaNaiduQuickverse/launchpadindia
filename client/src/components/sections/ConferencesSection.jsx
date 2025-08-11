import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RichTextEditor } from '../ui/rich-editor';
import { Presentation, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const ConferencesSection = ({ conferences = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  title: '', organizer: '', address: '', date: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ title: '', organizer: '', address: '', date: '', description: '' });
  setShowForm(false);
};

const examples = [
  { title: "International Conference on Machine Learning", organizer: "ICML Foundation", location: "Vienna, Austria" },
  { title: "React Developer Workshop", organizer: "Tech Academy", location: "Bangalore, India" },
  { title: "Digital Marketing Summit", organizer: "Marketing Hub", location: "Mumbai, India" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
            <Presentation className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Conferences & Workshops</CardTitle>
            <p className="text-sm text-slate-600">Events attended and presentations given</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Conference
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <div className="mb-6 p-4 bg-emerald-50/60 rounded-lg border border-emerald-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-emerald-600" />
          <h4 className="font-medium text-emerald-800">Examples:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-emerald-100">
              <p className="font-semibold text-sm text-slate-800">{example.title}</p>
              <p className="text-xs text-slate-600 mt-1">{example.organizer}</p>
              <p className="text-xs text-slate-500 mt-1">{example.location}</p>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
              <Input placeholder="e.g., International Conference on Machine Learning" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organizer</label>
              <Input placeholder="e.g., IEEE" value={formData.organizer} onChange={(e) => setFormData({...formData, organizer: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Date</label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Event Address</label>
              <Input placeholder="e.g., Vienna International Centre, Austria" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <RichTextEditor placeholder="Describe your participation, presentation topic, or key learnings..." value={formData.description} onChange={(content) => setFormData({...formData, description: content})} />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Conferences ({conferences.length})</h4>
        {conferences.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Presentation className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No conferences added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {conferences.map((conf, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{conf.title}</h3>
                    {conf.organizer && <p className="text-slate-600 font-medium">{conf.organizer}</p>}
                    <div className="flex items-center space-x-3 mt-2">
                      {conf.date && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{conf.date}</span>}
                      {conf.address && <span className="text-sm text-slate-500">📍 {conf.address}</span>}
                    </div>
                    {conf.description && <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: conf.description }}></div>}
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
