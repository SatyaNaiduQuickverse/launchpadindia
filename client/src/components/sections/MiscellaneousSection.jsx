import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, Globe, BookOpen, Plus, X, Lightbulb } from 'lucide-react';

export const MiscellaneousSection = ({ miscData = { languages: [], subjects: [] }, onAdd }) => {
const [activeTab, setActiveTab] = useState('languages');
const [newItem, setNewItem] = useState({ name: '', level: 'Fluent' });

const handleAdd = () => {
  if (newItem.name) {
    onAdd(activeTab, newItem);
    setNewItem({ name: '', level: activeTab === 'languages' ? 'Fluent' : '' });
  }
};

const examples = {
  languages: ["English", "Hindi", "Marathi", "Tamil", "Bengali", "Gujarati", "Punjabi", "Telugu"],
  subjects: ["Data Structures & Algorithms", "Theory of Machines", "Digital Marketing", "Financial Accounting", 
            "Machine Learning", "Thermodynamics", "Operations Research", "Consumer Behavior"]
};

return (
  <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
    <CardHeader className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Star className="w-6 h-6 text-white" />
        </div>
        <div>
          <CardTitle>Languages & Subjects</CardTitle>
          <p className="text-sm text-slate-600">Language proficiency and favorite subjects</p>
        </div>
      </div>
    </CardHeader>
    <CardContent className="p-6">

      <div className="flex mb-6 bg-white/50 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('languages')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'languages' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 mr-2" />
          Languages
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'subjects' ? 'bg-white shadow-sm text-cyan-700' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Favorite Subjects
        </button>
      </div>

      <div className="mb-6 p-4 bg-teal-50/60 rounded-lg border border-teal-200/50">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="w-5 h-5 text-teal-600" />
          <h4 className="font-medium text-teal-800">Examples:</h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {examples[activeTab]?.map((example, index) => (
            <Badge key={index} variant="secondary" className="text-xs bg-white/80">
              {example}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 bg-white/70 rounded-xl border shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input 
              placeholder={activeTab === 'languages' ? 'e.g., English, Hindi' : 'e.g., Data Structures & Algorithms'}
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
            />
          </div>
          {activeTab === 'languages' && (
            <select 
              className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm"
              value={newItem.level}
              onChange={(e) => setNewItem({...newItem, level: e.target.value})}
            >
              <option>Native</option>
              <option>Fluent</option>
              <option>Conversational</option>
              <option>Basic</option>
            </select>
          )}
          <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-slate-700 mb-3">
          {activeTab === 'languages' 
            ? `Languages (${miscData.languages?.length || 0})`
            : `Favorite Subjects (${miscData.subjects?.length || 0})`
          }
        </h4>
        
        {(miscData[activeTab]?.length || 0) === 0 ? (
          <div className="text-center py-8 text-slate-500">
            {activeTab === 'languages' ? (
              <>
                <Globe className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No languages added yet. Add languages you can speak!</p>
              </>
            ) : (
              <>
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No subjects added yet. Add your favorite academic subjects!</p>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {(miscData[activeTab] || []).map((item, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="p-3 text-sm font-medium bg-slate-100 text-slate-800"
              >
                <span className="font-semibold">{item.name}</span>
                {activeTab === 'languages' && <span className="ml-2 text-xs opacity-75">({item.level})</span>}
                <button className="ml-2"><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
};
