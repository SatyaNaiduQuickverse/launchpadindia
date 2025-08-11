import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from './card';

export const ValidationAlert = ({ missingFields, sectionName }) => {
 if (!missingFields?.length) return null;

 return (
   <Card className="border-orange-200 bg-orange-50 mb-4">
     <div className="p-4 flex items-start space-x-3">
       <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
       <div>
         <h4 className="font-medium text-orange-800">Complete this section</h4>
         <p className="text-sm text-orange-700 mt-1">
           Missing: {missingFields.join(', ')}
         </p>
       </div>
     </div>
   </Card>
 );
};

export const CompletionAlert = () => (
 <Card className="border-green-200 bg-green-50 mb-4">
   <div className="p-4 flex items-start space-x-3">
     <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
     <div>
       <h4 className="font-medium text-green-800">Section Complete</h4>
       <p className="text-sm text-green-700 mt-1">
         All required fields filled
       </p>
     </div>
   </div>
 </Card>
);
