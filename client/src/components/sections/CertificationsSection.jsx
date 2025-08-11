import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { Award, Plus, Edit3, Trash2, Lightbulb, ExternalLink } from 'lucide-react';

export const CertificationsSection = ({ certifications = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', url: '', description: '' });
  setShowForm(false);
};

const examples = [
  { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services", type: "Cloud" },
  { name: "Google Analytics Certified", issuer: "Google", type: "Marketing" },
  { name: "PMP Certification", issuer: "PMI", type: "Management" },
  { name: "Python for Data Science", issuer: "IBM", type: "Programming" },
  { name: "Digital Marketing", issuer: "HubSpot", type: "Marketing" },
  { name: "Six Sigma Green Belt", issuer: "ASQ", type: "Quality" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Certifications</CardTitle>
            <p className="text-sm text-slate-600">Professional certifications and courses</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      {/* Examples */}
      <div className="mb-6 p-4 bg-indigo-50/60 rounded-lg border border-indigo-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-indigo-600" />
          <h4 className="font-medium text-indigo-800">Popular Certifications:</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {examples.map((example, index) => (
            <div key={index} className="p-3 bg-white/80 rounded-md border border-indigo-100">
              <p className="font-semibold text-sm text-slate-800">{example.name}</p>
              <p className="text-xs text-slate-600 mt-1">{example.issuer}</p>
              <Badge variant="secondary" className="text-xs mt-2">{example.type}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Certification Name *</label>
              <Input 
                placeholder="e.g., AWS Certified Solutions Architect" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issuing Organization *</label>
              <Input 
                placeholder="e.g., Amazon Web Services" 
                value={formData.issuer}
                onChange={(e) => setFormData({...formData, issuer: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
              <Input 
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({...formData, issueDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date (if any)</label>
              <Input 
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Credential ID</label>
              <Input 
                placeholder="e.g., ABC123XYZ"
                value={formData.credentialId}
                onChange={(e) => setFormData({...formData, credentialId: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Credential URL</label>
              <Input 
                placeholder="https://verify.example.com/cert"
                value={formData.url}
                onChange={(e) => setFormData({...formData, url: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
            <RichTextEditor
              placeholder="Describe what you learned, skills gained, or projects completed..."
              value={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Save Certification</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Certifications Display */}
      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Certifications ({certifications.length})</h4>
        {certifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No certifications added yet. Add your professional certifications!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{cert.name}</h3>
                    <p className="text-slate-600 font-medium">{cert.issuer}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      {cert.issueDate && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">Issued: {cert.issueDate}</span>}
                      {cert.expiryDate && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">Expires: {cert.expiryDate}</span>}
                      {cert.credentialId && <Badge variant="secondary">ID: {cert.credentialId}</Badge>}
                    </div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 mt-2">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View Credential
                      </a>
                    )}
                    {cert.description && (
                      <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: cert.description }}></div>
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
