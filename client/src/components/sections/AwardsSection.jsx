import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { Award, Plus, Edit3, Trash2, Lightbulb, Trophy, Code, Users, Star } from 'lucide-react';

export const AwardsSection = ({ awards = [], onAdd }) => {
const [activeCategory, setActiveCategory] = useState('technical');
const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  title: '', organization: '', date: '', category: 'technical', description: ''
});

const handleSubmit = (e) => {
  e.preventDefault();
  onAdd({...formData, category: activeCategory});
  setFormData({ title: '', organization: '', date: '', category: activeCategory, description: '' });
  setShowForm(false);
};

const categories = [
  { id: 'technical', name: 'Technical', icon: Code, color: 'blue' },
  { id: 'sports', name: 'Sports', icon: Trophy, color: 'green' },
  { id: 'business', name: 'Business', icon: Users, color: 'purple' },
  { id: 'misc', name: 'Others', icon: Star, color: 'orange' }
];

const examples = {
  technical: ["Winner - Smart India Hackathon 2024", "Best Project - SAE Baja Competition", "1st Place - Coding Championship"],
  sports: ["Gold Medal - Inter-College Basketball", "Captain - University Cricket Team", "State Level Swimming Champion"],
  business: ["Winner - Business Plan Competition", "Best Startup Idea - E-Summit", "Case Study Champion - B-Plan Contest"],
  misc: ["Best Volunteer - NGO Drive", "Cultural Secretary - College", "Dean's List - Academic Excellence"]
};

const getFilteredAwards = () => awards.filter(award => award.category === activeCategory);

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-xl flex items-center justify-center">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle>Awards & Recognitions</CardTitle>
            <p className="text-sm text-slate-600">Achievements and competitions won</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Award
        </Button>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white/50 rounded-lg">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category.id 
                  ? 'bg-white shadow-sm text-slate-700' 
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Examples */}
      <div className="mb-6 p-4 bg-yellow-50/60 rounded-lg border border-yellow-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-yellow-800">
            {categories.find(c => c.id === activeCategory)?.name} Awards Examples:
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples[activeCategory]?.map((example, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-white/80">
              {example}
            </Badge>
          ))}
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Award Title *</label>
              <Input 
                placeholder="e.g., Winner - Smart India Hackathon 2024" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Organization/Event</label>
              <Input 
                placeholder="e.g., Government of India" 
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date Received</label>
              <Input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
            <RichTextEditor
              placeholder="Describe the competition, your role, team size, or what made this achievement special..."
              value={formData.description}
              onChange={(content) => setFormData({...formData, description: content})}
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">Save Award</Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </form>
      )}

      {/* Awards Display */}
      <div>
        <h4 className="font-medium text-slate-700 mb-3">
          {categories.find(c => c.id === activeCategory)?.name} Awards ({getFilteredAwards().length})
        </h4>
        {getFilteredAwards().length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p>No {categories.find(c => c.id === activeCategory)?.name.toLowerCase()} awards added yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredAwards().map((award, index) => (
              <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800">{award.title}</h3>
                    {award.organization && <p className="text-slate-600 font-medium">{award.organization}</p>}
                    {award.date && <p className="text-sm text-slate-500 mt-1">📅 {award.date}</p>}
                    {award.description && (
                      <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: award.description }}></div>
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
