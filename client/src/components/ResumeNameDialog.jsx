import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { X } from 'lucide-react';

export const ResumeNameDialog = ({ isOpen, onClose, onConfirm }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
      setName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-slate-800">Create New Resume</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-white/50">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Resume Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Software Engineer Resume"
                className="bg-white border-slate-300 text-slate-800 placeholder-slate-400"
                autoFocus
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Create Resume
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="border-slate-300 text-slate-600 hover:bg-slate-50">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
