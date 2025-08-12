import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { RichTextEditor } from '../ui/rich-editor';
import { User, Camera, Mail, Phone, Calendar, Globe, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const BasicDetailsSection = ({ register, errors, data = {}, onChange }) => {
 const [photoPreview, setPhotoPreview] = useState(data.profilePhoto || null);
 const [uploadingPhoto, setUploadingPhoto] = useState(false);
 const fileInputRef = useRef(null);

 const handlePhotoUpload = async (event) => {
   const file = event.target.files[0];
   if (!file) return;

   // Validate file type
   if (!file.type.startsWith('image/')) {
     toast.error('Please select a valid image file');
     return;
   }

   // Validate file size (max 2MB)
   if (file.size > 2 * 1024 * 1024) {
     toast.error('Image size should be less than 2MB');
     return;
   }

   setUploadingPhoto(true);

   try {
     // Convert to base64
     const reader = new FileReader();
     reader.onload = (e) => {
       const base64String = e.target.result;
       setPhotoPreview(base64String);
       onChange('profilePhoto', base64String);
       toast.success('Photo uploaded successfully!');
       setUploadingPhoto(false);
     };
     reader.onerror = () => {
       toast.error('Failed to upload photo');
       setUploadingPhoto(false);
     };
     reader.readAsDataURL(file);
   } catch (error) {
     toast.error('Failed to upload photo');
     setUploadingPhoto(false);
   }
 };

 const removePhoto = () => {
   setPhotoPreview(null);
   onChange('profilePhoto', null);
   if (fileInputRef.current) {
     fileInputRef.current.value = '';
   }
   toast.success('Photo removed');
 };

 const triggerFileInput = () => {
   fileInputRef.current?.click();
 };

 return (
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

       {/* Profile Photo Section */}
       <div className="mb-8 text-center">
         <div className="relative inline-block">
           <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl border-4 border-white/50">
             {photoPreview ? (
               <img 
                 src={photoPreview} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
               />
             ) : (
               <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                 <User className="w-16 h-16 text-white" />
               </div>
             )}
           </div>
           
           {/* Photo Actions */}
           <div className="absolute -bottom-2 -right-2 flex space-x-1">
             <Button 
               size="sm" 
               onClick={triggerFileInput}
               disabled={uploadingPhoto}
               className="rounded-full w-10 h-10 p-0 bg-blue-600 hover:bg-blue-700 shadow-lg"
               type="button"
             >
               {uploadingPhoto ? (
                 <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
               ) : (
                 <Camera className="w-4 h-4" />
               )}
             </Button>
             
             {photoPreview && (
               <Button 
                 size="sm" 
                 onClick={removePhoto}
                 className="rounded-full w-10 h-10 p-0 bg-red-600 hover:bg-red-700 shadow-lg"
                 type="button"
               >
                 <X className="w-4 h-4" />
               </Button>
             )}
           </div>
         </div>
         
         {/* Hidden file input */}
         <input
           ref={fileInputRef}
           type="file"
           accept="image/*"
           onChange={handlePhotoUpload}
           className="hidden"
         />
         
         {/* Upload instructions */}
         <div className="mt-4">
           <p className="text-sm text-slate-600">
             Click the camera icon to upload your photo
           </p>
           <p className="text-xs text-slate-500">
             Recommended: 300x300px, max 2MB (JPG, PNG)
           </p>
         </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700">First Name</label>
           <div className="relative">
             <Input 
               {...register('firstName')} 
               placeholder="John"
               value={data.firstName || ''}
               onChange={(e) => onChange('firstName', e.target.value)}
               className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
             />
             <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
           </div>
         </div>

         <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700">Last Name</label>
           <div className="relative">
             <Input 
               {...register('lastName')} 
               placeholder="Doe"
               value={data.lastName || ''}
               onChange={(e) => onChange('lastName', e.target.value)}
               className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
             />
             <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
           </div>
         </div>

         <div className="space-y-2">
           <label className="text-sm font-medium text-slate-700">Email</label>
           <div className="relative">
             <Input 
               {...register('email')} 
               type="email"
               placeholder="john@example.com"
               value={data.email || ''}
               onChange={(e) => onChange('email', e.target.value)}
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
               value={data.phone || ''}
               onChange={(e) => onChange('phone', e.target.value)}
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
               value={data.dateOfBirth || ''}
               onChange={(e) => onChange('dateOfBirth', e.target.value)}
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
               value={data.linkedin || ''}
               onChange={(e) => onChange('linkedin', e.target.value)}
               className="pl-10 bg-white/60 border-white/30 focus:bg-white/80"
             />
             <Globe className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
           </div>
         </div>

         <div className="md:col-span-2 space-y-2">
           <label className="text-sm font-medium text-slate-700">Professional Summary</label>
           <RichTextEditor
             placeholder="Write a compelling professional summary with rich formatting..."
             value={data.summary || ''}
             onChange={(content) => onChange('summary', content)}
           />
         </div>
       </div>
     </CardContent>
   </Card>
 );
};
