export const requiredSections = {
 basic: { name: 'Basic Details', required: true },
 education: { name: 'Education', required: true, minEntries: 1 },
 experience: { name: 'Experience', required: false },
 skills: { name: 'Skills', required: true, minEntries: 3 }
};

export const validateSection = (sectionId, data) => {
 const section = requiredSections[sectionId];
 if (!section?.required) return { isValid: true };

 switch (sectionId) {
   case 'basic':
     return {
       isValid: !!(data.firstName && data.lastName && data.email),
       missing: ['firstName', 'lastName', 'email'].filter(field => !data[field])
     };
   case 'education':
     return {
       isValid: data.length >= (section.minEntries || 1),
       missing: data.length === 0 ? ['At least one education entry'] : []
     };
   case 'skills':
     return {
       isValid: data.length >= (section.minEntries || 3),
       missing: data.length < 3 ? [`At least ${section.minEntries} skills`] : []
     };
   default:
     return { isValid: true };
 }
};

export const getCompletionStats = (resumeData) => {
 const sections = Object.keys(requiredSections);
 const completed = sections.filter(id => 
   validateSection(id, resumeData[id] || {}).isValid
 );
 
 return {
   completed: completed.length,
   total: sections.length,
   percentage: Math.round((completed.length / sections.length) * 100),
   missing: sections.filter(id => 
     !validateSection(id, resumeData[id] || {}).isValid
   )
 };
};
