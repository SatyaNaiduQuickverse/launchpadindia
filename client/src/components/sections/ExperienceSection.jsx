import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Briefcase, Plus, Edit3, Trash2 } from 'lucide-react';

export const ExperienceSection = ({ experienceEntries = [], onAdd }) => {
 const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({
   position: '', company: '', location: '', startDate: '', endDate: '', description: ''
 });

 const handleSubmit = (e) => {
   e.preventDefault();
   onAdd(formData);
   setFormData({ position: '', company: '', location: '', startDate: '', endDate: '', description: '' });
   setShowForm(false);
 };

 return (
   <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
     <CardHeader className="bg-gradient-to-r from-purple-500/10 to-violet-500/10">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
             <Briefcase className="w-6 h-6 text-white" />
           </div>
           <div>
             <CardTitle>Experience</CardTitle>
             <p className="text-sm text-slate-600">Work & internships</p>
           </div>
         </div>
         <Button onClick={() => setShowForm(true)}>
           <Plus className="w-4 h-4 mr-2" />
           Add Experience
         </Button>
       </div>
     </CardHeader>
     <CardContent>
       {showForm && (
         <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white/60 rounded-lg space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <Input placeholder="Position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} required />
             <Input placeholder="Company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} required />
             <Input placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
             <Input type="date" placeholder="Start Date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
             <Input type="date" placeholder="End Date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
           </div>
           <textarea 
             placeholder="Job description..." 
             className="w-full p-3 border rounded-lg bg-white/60"
             rows={3}
             value={formData.description}
             onChange={(e) => setFormData({...formData, description: e.target.value})}
           />
           <div className="flex space-x-2">
             <Button type="submit">Save</Button>
             <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
           </div>
         </form>
       )}
       
       <div className="space-y-4">
         {experienceEntries.map((entry, index) => (
           <div key={index} className="p-4 bg-white/60 rounded-lg">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="font-semibold">{entry.position}</h3>
                 <p className="text-slate-600">{entry.company}</p>
                 <p className="text-sm text-slate-500">{entry.startDate} - {entry.endDate}</p>
                 <p className="text-sm mt-2">{entry.description}</p>
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
