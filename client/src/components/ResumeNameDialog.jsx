import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Sparkles, FileText, Zap } from 'lucide-react';

export const ResumeNameDialog = ({ isOpen, onClose, onConfirm, loading }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
      setName('');
    }
  };

  const suggestions = [
    'Software Engineer Resume',
    'Data Analyst Resume', 
    'Marketing Specialist Resume',
    'Product Manager Resume',
    'Frontend Developer Resume'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
          >
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 p-6 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0">
                <motion.div 
                  className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl"
                  animate={{ 
                    x: [0, 20, 0],
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
              
              <div className="relative z-10 flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Create New Resume</h2>
                  </div>
                  <p className="text-purple-100 text-sm">Give your resume a memorable name</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose} 
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Resume Name
                  </label>
                  <div className="relative">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Software Engineer Resume"
                      className="pl-10 h-12 bg-white border-slate-300 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                      autoFocus
                      required
                    />
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {/* Quick suggestions */}
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-3">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setName(suggestion)}
                        className="px-3 py-1.5 text-xs bg-purple-50 text-purple-700 rounded-full border border-purple-200 hover:bg-purple-100 transition-colors"
                      >
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={loading || !name.trim()}
                    className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Creating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Zap className="w-5 h-5 mr-2" />
                        Create Resume
                      </div>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    className="px-6 h-12 border-slate-300 text-slate-600 hover:bg-slate-50 rounded-xl"
                  >
                    Cancel
                  </Button>
                </div>
              </form>

              {/* Footer tip */}
              <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <p className="text-xs text-slate-600 text-center">
                  💡 Tip: Use descriptive names like "Frontend Developer Resume" to easily identify your resumes later
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
