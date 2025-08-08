import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { User, Camera, Mail, Phone, Calendar, Globe } from 'lucide-react';

export const BasicDetailsSection = ({ register, errors }) => (
 <Card className="backdrop-blur-xl bg-white/40 border-white/20 shadow-2xl">
   <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
     <div className="flex items-center space-x-3">
       <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
         <User className="w-6 h-6 text-white" />
       </div>
       <div>
         <CardTitle>Personal Details</CardTitle>
         <p className="text-sm text-slate-600">Your basic information</p>
       </div>
     </div>
   </CardHeader>
   <CardContent className="p-8">
     
     {/* Profile Photo */}
     <div className="mb-8 text-center">
       <div className="relative inline-block">
         <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-2xl">
           <User className="w-16 h-16 text-white" />
         </div>
         <Button size="sm" className="absolute bottom-2 right-2 rounded-full w-10 h-10 p-0" type="button">
           <Camera className="w-4 h-4" />
         </Button>
       </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">First Name *</label>
         <div className="relative">
           <Input 
             {...register('firstName', {required: true})} 
             placeholder="John"
             className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
           />
           <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
       </div>

       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">Last Name *</label>
         <div className="relative">
           <Input 
             {...register('lastName', {required: true})} 
             placeholder="Doe"
             className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
           />
           <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
       </div>

       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">Email *</label>
         <div className="relative">
           <Input 
             {...register('email', {required: true})} 
             type="email"
             placeholder="john@example.com"
             className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
           />
           <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
       </div>

       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">Phone</label>
         <div className="relative">
           <Input 
             {...register('phone')}
             placeholder="+1 234 567 8900"
             className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
           />
           <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
       </div>

       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">Date of Birth</label>
         <div className="relative">
           <Input 
             {...register('dateOfBirth')}
             type="date"
             className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
           />
           <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
       </div>

       <div className="space-y-2">
         <label className="text-sm font-medium text-slate-700">LinkedIn</label>
         <div className="relative">
           <Input 
             {...register('linkedin')}
             placeholder="https://linkedin.com/in/johndoe"
             className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
           />
           <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
         </div>
       </div>

       <div className="md:col-span-2 space-y-2">
         <label className="text-sm font-medium text-slate-700">Professional Summary</label>
         <textarea
           {...register('summary')}
           rows={4}
           className="w-full px-4 py-3 rounded-md border bg-white/60 border-white/30 focus:bg-white/80 resize-none"
           placeholder="Write a compelling professional summary..."
         />
       </div>
     </div>
   </CardContent>
 </Card>
);
