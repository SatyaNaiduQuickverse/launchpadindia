import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { Target, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const TestScoresSection = ({ testScores = [], onAdd }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', score: '', totalScore: '', associatedWith: '', examDate: '', description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ title: '', score: '', totalScore: '', associatedWith: '', examDate: '', description: '' });
    setShowForm(false);
  };

  const examples = [
    { title: "IELTS", score: "7.5", total: "9.0", type: "Language" },
    { title: "GRE", score: "320", total: "340", type: "Graduate" },
    { title: "GATE", score: "785", total: "1000", type: "Engineering" },
    { title: "CAT", score: "95 percentile", total: "100", type: "Management" }
  ];

  return (
    <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-red-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Test Scores</CardTitle>
              <p className="text-sm text-slate-600">Standardized test results</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Test Score
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6 p-4 bg-red-50/60 rounded-lg border border-red-200/50">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-800">Examples:</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {examples.map((example, index) => (
              <div key={index} className="p-3 bg-white/80 rounded-md border border-red-100">
                <p className="font-semibold text-sm text-slate-800">{example.title}</p>
                <p className="text-xs text-slate-600 mt-1">Score: {example.score}/{example.total}</p>
                <Badge variant="secondary" className="text-xs mt-2">{example.type}</Badge>
              </div>
            ))}
          </div>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Test Title *</label>
                <Input placeholder="e.g., IELTS, GRE, GATE" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Associated With</label>
                <select className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full" value={formData.associatedWith} onChange={(e) => setFormData({...formData, associatedWith: e.target.value})}>
                  <option value="">Select Category</option>
                  <option>Language Proficiency</option>
                  <option>Graduate Entrance</option>
                  <option>Professional Certification</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Your Score</label>
                <Input placeholder="e.g., 7.5, 320, 95 percentile" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Score</label>
                <Input placeholder="e.g., 9.0, 340, 100" value={formData.totalScore} onChange={(e) => setFormData({...formData, totalScore: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Date</label>
                <Input type="date" value={formData.examDate} onChange={(e) => setFormData({...formData, examDate: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Additional Details</label>
              <RichTextEditor placeholder="Add percentile, section-wise scores, or other relevant details..." value={formData.description} onChange={(content) => setFormData({...formData, description: content})} />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">Save</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        )}
        <div>
          <h4 className="font-medium text-slate-700 mb-3">Your Test Scores ({testScores.length})</h4>
          {testScores.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Target className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No test scores added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {testScores.map((test, index) => (
                <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-800">{test.title}</h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge className="bg-red-100 text-red-800">Score: {test.score}/{test.totalScore}</Badge>
                        {test.examDate && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">{test.examDate}</span>}
                        {test.associatedWith && <span className="text-sm text-slate-500">{test.associatedWith}</span>}
                      </div>
                      {test.description && <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: test.description }}></div>}
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
