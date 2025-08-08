import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Code, Plus } from 'lucide-react';

export const SkillsSection = ({ skills = [], onAdd }) => {
 const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediate' });

 const handleAdd = () => {
   if (newSkill.name) {
     onAdd(newSkill);
     setNewSkill({ name: '', level: 'Intermediate' });
   }
 };

 return (
   <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
     <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
       <div className="flex items-center space-x-3">
         <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
           <Code className="w-6 h-6 text-white" />
         </div>
         <CardTitle>Skills</CardTitle>
       </div>
     </CardHeader>
     <CardContent>
       <div className="flex space-x-2 mb-4">
         <Input 
           placeholder="Skill name" 
           value={newSkill.name}
           onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
         />
         <select 
           className="px-3 py-2 border rounded-lg"
           value={newSkill.level}
           onChange={(e) => setNewSkill({...newSkill, level: e.target.value})}
         >
           <option>Beginner</option>
           <option>Intermediate</option>
           <option>Advanced</option>
           <option>Expert</option>
         </select>
         <Button onClick={handleAdd}>
           <Plus className="w-4 h-4" />
         </Button>
       </div>
       
       <div className="flex flex-wrap gap-2">
         {skills.map((skill, index) => (
           <Badge key={index} variant="secondary" className="p-2">
             {skill.name} - {skill.level}
           </Badge>
         ))}
       </div>
     </CardContent>
   </Card>
 );
};
