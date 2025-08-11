import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GraduationCap, Plus, Edit3, Trash2, Lightbulb, X } from 'lucide-react';

export const EducationSection = ({ educationEntries = [], onAdd }) => {
const [activeTab, setActiveTab] = useState('higher');
const [showForm, setShowForm] = useState(false);
const [showBoardInput, setShowBoardInput] = useState(false);
const [showBranchInput, setShowBranchInput] = useState(false);
const [newBoard, setNewBoard] = useState('');
const [newBranch, setNewBranch] = useState('');
const [formData, setFormData] = useState({
  schoolName: '', program: '', board: '', branch: '', startYear: '', endYear: '', 
  educationType: '', scorePercentage: '', rollNumber: '', notes: '', category: 'higher'
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd({...formData, category: activeTab});
  setFormData({ 
    schoolName: '', program: '', board: '', branch: '', startYear: '', endYear: '', 
    educationType: '', scorePercentage: '', rollNumber: '', notes: '', category: activeTab 
  });
  setShowForm(false);
  setShowBoardInput(false);
  setShowBranchInput(false);
};

const addBoard = () => {
  if (newBoard.trim()) {
    setFormData({...formData, board: newBoard.trim()});
    setNewBoard('');
    setShowBoardInput(false);
  }
};

const addBranch = () => {
  if (newBranch.trim()) {
    setFormData({...formData, branch: newBranch.trim()});
    setNewBranch('');
    setShowBranchInput(false);
  }
};

const getFilteredEntries = (category) => educationEntries.filter(entry => entry.category === category);

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Education Details</CardTitle>
            <p className="text-sm text-slate-600">Academic background & qualifications</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      {/* Education Category Tabs */}
      <div className="flex mb-6 bg-white/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('higher')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'higher' ? 'bg-white shadow-sm text-green-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          Higher Education (Graduation & Above)
        </button>
        <button
          onClick={() => setActiveTab('school')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'school' ? 'bg-white shadow-sm text-green-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          School Education (10th & 12th)
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">School/Institution Name *</label>
              <Input 
                placeholder="e.g., Indian Institute of Technology, Mumbai" 
                value={formData.schoolName}
                onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Program/Degree/Certificate *</label>
              <select 
                className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full"
                value={formData.program}
                onChange={(e) => setFormData({...formData, program: e.target.value})}
              >
                <option value="">Select Program/Degree/Certificate</option>
                {activeTab === 'higher' ? (
                  <>
                    <option>Bachelor of Technology</option>
                    <option>Bachelor of Engineering</option>
                    <option>Bachelor of Science</option>
                    <option>Bachelor of Arts</option>
                    <option>Bachelor of Commerce</option>
                    <option>Master of Technology</option>
                    <option>Master of Science</option>
                    <option>Master of Business Administration</option>
                    <option>Diploma</option>
                    <option>Certificate Course</option>
                  </>
                ) : (
                  <>
                    <option>Class XII (12th)</option>
                    <option>Class X (10th)</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Board/University *</label>
              {!showBoardInput ? (
                <>
                  <select 
                    className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full"
                    value={formData.board}
                    onChange={(e) => setFormData({...formData, board: e.target.value})}
                  >
                    <option value="">Select Board/University</option>
                    {activeTab === 'school' ? (
                      <>
                        <option>CBSE</option>
                        <option>ICSE</option>
                        <option>Maharashtra State Board</option>
                        <option>State Board</option>
                      </>
                    ) : (
                      <>
                        <option>University of Mumbai</option>
                        <option>University of Delhi</option>
                        <option>Anna University</option>
                        <option>VTU</option>
                        <option>University of Pune</option>
                        <option>Shivaji University</option>
                      </>
                    )}
                  </select>
                  <Button type="button" variant="ghost" size="sm" className="mt-1 text-blue-600" onClick={() => setShowBoardInput(true)}>
                    <Plus className="w-3 h-3 mr-1" />
                    Add Board/University
                  </Button>
                </>
              ) : (
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Enter board/university name"
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={addBoard}>Add</Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => {setShowBoardInput(false); setNewBoard('');}}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            {activeTab === 'higher' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Branch/Specialization</label>
                {!showBranchInput ? (
                  <>
                    <select 
                      className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full"
                      value={formData.branch}
                      onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    >
                      <option value="">Select Branch/Specialization</option>
                      <option>Computer Science Engineering</option>
                      <option>Information Technology</option>
                      <option>Electronics & Communication</option>
                      <option>Mechanical Engineering</option>
                      <option>Civil Engineering</option>
                      <option>Electrical Engineering</option>
                      <option>Finance</option>
                      <option>Marketing</option>
                    </select>
                    <Button type="button" variant="ghost" size="sm" className="mt-1 text-blue-600" onClick={() => setShowBranchInput(true)}>
                      <Plus className="w-3 h-3 mr-1" />
                      Add Branch/Specialization
                    </Button>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Enter branch/specialization"
                      value={newBranch}
                      onChange={(e) => setNewBranch(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" size="sm" onClick={addBranch}>Add</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => {setShowBranchInput(false); setNewBranch('');}}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Year *</label>
              <Input 
                type="date"
                value={formData.startYear}
                onChange={(e) => setFormData({...formData, startYear: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Year *</label>
              <Input 
                type="date"
                value={formData.endYear}
                onChange={(e) => setFormData({...formData, endYear: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number</label>
              <Input 
                placeholder="e.g., 2021001, A123456"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Score *</label>
              <div className="flex">
                <Input 
                  placeholder="Enter score"
                  value={formData.scorePercentage}
                  onChange={(e) => setFormData({...formData, scorePercentage: e.target.value})}
                  className="rounded-r-none"
                />
                <select className="h-10 px-3 py-2 border-l-0 border rounded-l-none bg-white/80 text-sm">
                  <option>%</option>
                  <option>CGPA</option>
                  <option>GPA</option>
                </select>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes/Highlights</label>
            <textarea
              className="w-full px-4 py-3 rounded-md border bg-white/60 resize-none"
              rows={3}
              placeholder="Mention ranks, achievements, or other highlights"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
            />
          </div>
          
          <div className="flex space-x-3">
            <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}
      
      <div>
        <h4 className="font-medium text-slate-700 mb-3">
          {activeTab === 'higher' ? 'Higher Education' : 'School Education'} ({getFilteredEntries(activeTab).length})
        </h4>
        <div className="space-y-4">
          {getFilteredEntries(activeTab).map((entry, index) => (
            <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{entry.program}</h3>
                  {entry.branch && <p className="text-slate-600 font-medium">{entry.branch}</p>}
                  <p className="text-slate-600">{entry.schoolName}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {new Date(entry.startYear).getFullYear()} - {new Date(entry.endYear).getFullYear()}
                    </span>
                    {entry.scorePercentage && <Badge className="bg-green-100 text-green-800">{entry.scorePercentage}</Badge>}
                    {entry.rollNumber && <span className="text-sm text-slate-500">Roll: {entry.rollNumber}</span>}
                  </div>
                  {entry.notes && <p className="text-sm mt-3 text-slate-600">{entry.notes}</p>}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button size="sm" variant="outline"><Edit3 className="w-3 h-3" /></Button>
                  <Button size="sm" variant="destructive"><Trash2 className="w-3 h-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);
};
