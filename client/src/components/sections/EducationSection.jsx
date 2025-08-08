import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { GraduationCap, Plus, Edit3, Trash2 } from 'lucide-react';

export const EducationSection = ({ educationEntries = [], onAdd, onEdit, onDelete }) => {
 const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({
   degree: '', institution: '', startYear: '', endYear: '', percentage: ''
 });

 const handleSubmit = (e) => {
   e.preventDefault();
   onAdd(formData);
   setFormData({ degree: '', institution: '', startYear: '', endYear: '', percentage: '' });
   setShowForm(false);
 };

 return (
   <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
     <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
             <GraduationCap className="w-6 h-6 text-white" />
           </div>
           <div>
             <CardTitle>Education</CardTitle>
             <p className="text-sm text-slate-600">Academic background</p>
           </div>
         </div>
         <Button onClick={() => setShowForm(true)}>
           <Plus className="w-4 h-4 mr-2" />
           Add Education
         </Button>
       </div>
     </CardHeader>
     <CardContent>
       {showForm && (
         <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white/60 rounded-lg space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <Input 
               placeholder="Degree/Course" 
               value={formData.degree}
               onChange={(e) => setFormData({...formData, degree: e.target.value})}
               required
             />
             <Input 
               placeholder="Institution" 
               value={formData.institution}
               onChange={(e) => setFormData({...formData, institution: e.target.value})}
               required
             />
             <Input 
               placeholder="Start Year" 
               type="number"
               value={formData.startYear}
               onChange={(e) => setFormData({...formData, startYear: e.target.value})}
             />
             <Input 
               placeholder="End Year" 
               type="number"
               value={formData.endYear}
               onChange={(e) => setFormData({...formData, endYear: e.target.value})}
             />
             <Input 
               placeholder="Percentage/CGPA" 
               value={formData.percentage}
               onChange={(e) => setFormData({...formData, percentage: e.target.value})}
             />
           </div>
           <div className="flex space-x-2">
             <Button type="submit">Save</Button>
             <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
           </div>
         </form>
       )}
       
       <div className="space-y-4">
         {educationEntries.map((entry, index) => (
           <div key={index} className="p-4 bg-white/60 rounded-lg">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-semibold">{entry.degree}</h3>
                 <p className="text-slate-600">{entry.institution}</p>
                 <div className="flex items-center space-x-2 mt-1">
                   <span className="text-sm text-slate-500">{entry.startYear} - {entry.endYear}</span>
                   {entry.percentage && <Badge>{entry.percentage}</Badge>}
                 </div>
               </div>
               <div className="flex space-x-2">
                 <Button size="sm" variant="outline"><Edit3 className="w-3 h-3" /></Button>
                 <Button size="sm" variant="destructive"><Trash2 className="w-3 h-3" /></Button>
               </div>
             </div>
           </div>
         ))}
       </div>
     </CardContent>
   </Card>
 );
};
