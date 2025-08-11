import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RichTextEditor } from '../ui/rich-editor';
import { BookOpen, Plus, Edit3, Trash2, Lightbulb, ExternalLink } from 'lucide-react';

export const PublicationsSection = ({ publications = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  title: '', publisher: '', url: '', date: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ title: '', publisher: '', url: '', date: '', description: '' });
  setShowForm(false);
};

const examples = [
  { title: "Machine Learning Applications in Healthcare", publisher: "IEEE Transactions", type: "Journal" },
  { title: "Sustainable Energy Solutions for Smart Cities", publisher: "Nature Energy", type: "Research Paper" },
  { title: "Digital Marketing Strategies in E-commerce", publisher: "Harvard Business Review", type: "Article" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Publications</CardTitle>
            <p className="text-sm text-slate-600">Research papers and articles</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Publication
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">
      <div className="mb-6 p-4 bg-blue-50/60 rounded-lg border border-blue-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-blue-600" />
          <h4 className="font-medium text-blue-800">Examples:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-blue-100">
              <p className="font-semibold text-sm text-slate-800">{example.title}</p>
              <p className="text-xs text-slate-600 mt-1">{example.publisher}</p>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
              <Input placeholder="e.g., Machine Learning Applications in Healthcare" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication/Publisher *</label>
              <Input placeholder="e.g., IEEE Transactions" value={formData.publisher} onChange={(e) => setFormData({...formData, publisher: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication Date</label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Publication URL</label>
              <Input placeholder="https://doi.org/..." value={formData.url} onChange={(e) => setFormData({...formData, url: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <RichTextEditor placeholder="Describe the research, methodology, key findings, or your contribution..." value={formData.description} onChange={(content) => setFormData({...formData, description: content})} />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Publications ({publications.length})</h4>
        {publications.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No publications added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {publications.map((pub, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{pub.title}</h3>
                    <p className="text-slate-600 font-medium">{pub.publisher}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      {pub.date && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{pub.date}</span>}
                      {pub.url && (
                        <a href={pub.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Publication
                        </a>
                      )}
                    </div>
                    {pub.description && <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: pub.description }}></div>}
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
