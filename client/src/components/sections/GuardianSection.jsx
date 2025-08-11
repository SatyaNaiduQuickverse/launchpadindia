import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { UserCheck, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const GuardianSection = ({ guardians = [], onAdd }) => {
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  name: '', relationship: 'Guardian', dateOfBirth: '', email: '', mobile: '', 
  occupation: '', designation: '', organization: '', notes: '', enableCommunication: true
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd(formData);
  setFormData({ 
    name: '', relationship: 'Guardian', dateOfBirth: '', email: '', mobile: '', 
    occupation: '', designation: '', organization: '', notes: '', enableCommunication: true 
  });
  setShowForm(false);
};

const examples = [
  { name: "Rajesh Kumar", relationship: "Father", occupation: "Engineer" },
  { name: "Priya Sharma", relationship: "Mother", occupation: "Teacher" },
  { name: "Amit Patel", relationship: "Uncle", occupation: "Doctor" }
];

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Guardians</CardTitle>
            <p className="text-sm text-slate-600">Family members and emergency contacts</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Guardian
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
              <p className="font-semibold text-sm text-slate-800">{example.name}</p>
              <p className="text-xs text-slate-600 mt-1">{example.relationship}</p>
              <p className="text-xs text-slate-500 mt-1">{example.occupation}</p>
            </div>
          ))}
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guardian's Name *</label>
              <Input 
                placeholder="Enter full name" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Relationship with Student *</label>
              <select 
                className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full"
                value={formData.relationship}
                onChange={(e) => setFormData({...formData, relationship: e.target.value})}
              >
                <option>Guardian</option>
                <option>Father</option>
                <option>Mother</option>
                <option>Uncle</option>
                <option>Aunt</option>
                <option>Grandfather</option>
                <option>Grandmother</option>
                <option>Brother</option>
                <option>Sister</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
              <Input 
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guardian's Email Address *</label>
              <Input 
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Guardian's Mobile Number</label>
              <div className="flex">
                <select className="h-10 px-3 py-2 border rounded-l-md bg-white/80 text-sm">
                  <option>🇮🇳 +91</option>
                </select>
                <Input 
                  placeholder="Mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="rounded-l-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
              <Input 
                placeholder="e.g., Engineer, Teacher"
                value={formData.occupation}
                onChange={(e) => setFormData({...formData, occupation: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
              <Input 
                placeholder="e.g., Senior Manager"
                value={formData.designation}
                onChange={(e) => setFormData({...formData, designation: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization</label>
              <Input 
                placeholder="e.g., TCS, Government School"
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="enableComm"
              checked={formData.enableCommunication}
              onChange={(e) => setFormData({...formData, enableCommunication: e.target.checked})}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="enableComm" className="text-sm text-slate-700">Enable Communication</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              className="w-full px-4 py-3 rounded-md border bg-white/60 border-white/30 focus:bg-white/80 resize-none"
              rows={3}
              placeholder="Additional notes about the guardian..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      <div>
        <h4 className="font-medium text-slate-700 mb-3">Your Guardians ({guardians.length})</h4>
        {guardians.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <UserCheck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No guardians added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {guardians.map((guardian, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{guardian.name}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <Badge variant="secondary">{guardian.relationship}</Badge>
                      {guardian.occupation && <span className="text-sm text-slate-500">{guardian.occupation}</span>}
                      {guardian.enableCommunication && <Badge className="bg-green-100 text-green-800">Communication Enabled</Badge>}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      <p>📧 {guardian.email}</p>
                      {guardian.mobile && <p>📱 +91 {guardian.mobile}</p>}
                      {guardian.organization && <p>🏢 {guardian.organization}</p>}
                    </div>
                    {guardian.notes && <p className="text-sm mt-3 text-slate-600">{guardian.notes}</p>}
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
