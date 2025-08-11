import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { RichTextEditor } from '../ui/rich-editor';
import { Shield, Plus, Edit3, Trash2, Lightbulb } from 'lucide-react';

export const PatentsSection = ({ patents = [], onAdd }) => {
 const [showForm, setShowForm] = useState(false);
 const [formData, setFormData] = useState({
   title: '', office: '', applicationNumber: '', status: 'Pending', filingDate: '', issueDate: '', description: ''
 });

 const handleSubmit = (e) => {
   e.preventDefault();
   onAdd(formData);
   setFormData({ title: '', office: '', applicationNumber: '', status: 'Pending', filingDate: '', issueDate: '', description: '' });
   setShowForm(false);
 };

 const examples = [
   { title: "IoT-based Smart Home Automation System", office: "Indian Patent Office", status: "Granted" },
   { title: "Machine Learning Algorithm for Fraud Detection", office: "USPTO", status: "Pending" },
   { title: "Sustainable Water Purification Method", office: "European Patent Office", status: "Published" }
 ];

 return (
   <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
     <CardHeader className="bg-gradient-to-r from-slate-500/10 to-gray-500/10">
       <div className="flex items-center justify-between">
         <div className="flex items-center space-x-3">
           <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-gray-500 rounded-xl flex items-center justify-center">
             <Shield className="w-6 h-6 text-white" />
           </div>
           <div>
             <CardTitle>Patents</CardTitle>
             <p className="text-sm text-slate-600">Intellectual property and inventions</p>
           </div>
         </div>
         <Button onClick={() => setShowForm(true)} className="bg-slate-600 hover:bg-slate-700">
           <Plus className="w-4 h-4 mr-2" />
           Add Patent
         </Button>
       </div>
     </CardHeader>
     <CardContent className="p-6">
       <div className="mb-6 p-4 bg-slate-50/60 rounded-lg border border-slate-200/50">
         <div className="flex items-center space-x-2 mb-3">
           <Lightbulb className="w-5 h-5 text-slate-600" />
           <h4 className="font-medium text-slate-800">Examples:</h4>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
           {examples.map((example, index) => (
             <div key={index} className="p-3 bg-white/80 rounded-md border border-slate-100">
               <p className="font-semibold text-sm text-slate-800">{example.title}</p>
               <p className="text-xs text-slate-600 mt-1">{example.office}</p>
               <Badge variant="secondary" className="text-xs mt-2">{example.status}</Badge>
             </div>
           ))}
         </div>
       </div>

       {showForm && (
         <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white/70 rounded-xl border shadow-sm space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
               <Input placeholder="e.g., IoT-based Smart Home Automation System" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Patent Office</label>
               <select className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full" value={formData.office} onChange={(e) => setFormData({...formData, office: e.target.value})}>
                 <option value="">Select Patent Office</option>
                 <option>Indian Patent Office</option>
                 <option>USPTO</option>
                 <option>European Patent Office</option>
                 <option>Other</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Application Number</label>
               <Input placeholder="e.g., IN202341012345" value={formData.applicationNumber} onChange={(e) => setFormData({...formData, applicationNumber: e.target.value})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
               <select className="h-10 px-3 py-2 border rounded-md bg-white/80 text-sm w-full" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                 <option>Pending</option>
                 <option>Published</option>
                 <option>Granted</option>
                 <option>Rejected</option>
               </select>
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Filing Date</label>
               <Input type="date" value={formData.filingDate} onChange={(e) => setFormData({...formData, filingDate: e.target.value})} />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Issue Date</label>
               <Input type="date" value={formData.issueDate} onChange={(e) => setFormData({...formData, issueDate: e.target.value})} />
             </div>
           </div>
           <div>
             <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
             <RichTextEditor placeholder="Describe the invention, its applications, and technical details..." value={formData.description} onChange={(content) => setFormData({...formData, description: content})} />
           </div>
           <div className="flex space-x-3">
             <Button type="submit" className="bg-slate-600 hover:bg-slate-700">Save</Button>
             <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
           </div>
         </form>
       )}

       <div>
         <h4 className="font-medium text-slate-700 mb-3">Your Patents ({patents.length})</h4>
         {patents.length === 0 ? (
           <div className="text-center py-8 text-slate-500">
             <Shield className="w-12 h-12 mx-auto mb-3 text-slate-300" />
             <p>No patents added yet.</p>
           </div>
         ) : (
           <div className="space-y-4">
             {patents.map((patent, index) => (
               <div key={index} className="p-5 bg-white/70 rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start">
                   <div className="flex-1">
                     <h3 className="font-bold text-lg text-slate-800">{patent.title}</h3>
                     {patent.office && <p className="text-slate-600 font-medium">{patent.office}</p>}
                     <div className="flex items-center space-x-3 mt-2">
                       <Badge className={`${patent.status === 'Granted' ? 'bg-green-100 text-green-800' : patent.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-slate-100 text-slate-800'}`}>
                         {patent.status}
                       </Badge>
                       {patent.applicationNumber && <span className="text-sm text-slate-500">{patent.applicationNumber}</span>}
                       {patent.filingDate && <span className="text-sm text-slate-500 bg-slate-100 px-2 py-1 rounded">Filed: {patent.filingDate}</span>}
                     </div>
                     {patent.description && <div className="text-sm mt-3 prose prose-sm" dangerouslySetInnerHTML={{ __html: patent.description }}></div>}
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
