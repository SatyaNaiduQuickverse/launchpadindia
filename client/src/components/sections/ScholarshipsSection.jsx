import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { GraduationCap, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const ScholarshipsSection = ({ scholarships = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  title: '', associatedWith: '', grantDate: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ title: '', associatedWith: '', grantDate: '', description: '' });
  setShowForm(false);
};

const examples = [
  { title: "Merit Scholarship", provider: "College Excellence Fund", amount: "₹50,000" },
  { title: "INSPIRE Scholarship", provider: "Government of India", amount: "₹80,000" },
  { title: "Need-based Financial Aid", provider: "University Welfare Fund", amount: "₹1,00,000" },
  { title: "Sports Excellence Scholarship", provider: "State Sports Council", amount: "₹25,000" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Scholarships</CardTitle>
            <p className="text-sm text-slate-600">Financial aid and merit scholarships</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Scholarship
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <div className="mb-6 p-4 bg-amber-50/60 rounded-lg border border-amber-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <h4 className="font-medium text-amber-800">Examples:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-amber-100">
              <p className="font-semibold text-sm text-slate-800">{example.title}</p>
              <p className="text-xs text-slate-600 mt-1">{example.provider}</p>
              <Badge variant="secondary" className="text-xs mt-2">{example.amount}</Badge>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Scholarship Title *</label>
              <Input placeholder="e.g., Merit Scholarship" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Associated With</label>
              <select className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full" value={formData.associatedWith} onChange={(e) => setFormData({...formData, associatedWith: e.target.value})}>
                <option value="">Select Provider</option>
                <option>Government Scholarship</option>
                <option>University/College</option>
                <option>Private Foundation</option>
                <option>Corporate Scholarship</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grant Date</label>
              <Input type="date" value={formData.grantDate} onChange={(e) => setFormData({...formData, grantDate: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <RichTextEditor placeholder="Describe the scholarship criteria, amount, duration, or selection process..." value={formData.description} onChange={(content) => setFormData({...formData, description: content})} />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Scholarships ({scholarships.length})</h4>
        {scholarships.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No scholarships added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scholarships.map((scholarship, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{scholarship.title}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      {scholarship.grantDate && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{scholarship.grantDate}</span>}
                      {scholarship.associatedWith && <Badge variant="secondary">{scholarship.associatedWith}</Badge>}
                    </div>
                    {scholarship.description && <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: scholarship.description }}></div>}
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
