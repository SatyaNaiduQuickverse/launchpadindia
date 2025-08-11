import React, { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';

const RichTextEditor = ({ value = '', onChange, placeholder = "Start typing..." }) => {
 const [content, setContent] = useState(value);
 const [fontSize, setFontSize] = useState('3');
 const editorRef = useRef(null);

 useEffect(() => {
   if (value !== content) {
     setContent(value);
     if (editorRef.current && editorRef.current.innerHTML !== value) {
       editorRef.current.innerHTML = value;
     }
   }
 }, [value]);

 const execCommand = (command, value = null) => {
   editorRef.current?.focus();
   document.execCommand(command, false, value);
   setTimeout(handleChange, 10);
 };

 const handleChange = () => {
   if (editorRef.current) {
     const newContent = editorRef.current.innerHTML;
     setContent(newContent);
     onChange?.(newContent);
   }
 };

 const insertLink = () => {
   const url = prompt('Enter URL:', 'https://');
   if (url) {
     execCommand('createLink', url);
   }
 };

 const handleFontSizeChange = (e) => {
   const size = e.target.value;
   setFontSize(size);
   if (size && size >= 1 && size <= 7) {
     execCommand('fontSize', size);
   }
 };

 const toggleList = (listType) => {
   const selection = window.getSelection();
   if (selection.rangeCount > 0) {
     editorRef.current?.focus();
     
     // Remove existing lists first
     document.execCommand('insertUnorderedList', false, null);
     document.execCommand('insertOrderedList', false, null);
     
     // Then apply the desired list
     document.execCommand(listType, false, null);
     setTimeout(handleChange, 10);
   }
 };

 return (
   <div className="border rounded-lg bg-white/80 shadow-sm">
     {/* Toolbar */}
     <div className="flex items-center space-x-1 p-2 border-b bg-slate-50/50 rounded-t-lg">
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('bold')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Bold"
       >
         <Bold className="h-4 w-4" />
       </Button>
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('italic')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Italic"
       >
         <Italic className="h-4 w-4" />
       </Button>
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('underline')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Underline"
       >
         <Underline className="h-4 w-4" />
       </Button>

       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('strikeThrough')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Strikethrough"
       >
         <span className="text-sm font-bold line-through">S</span>
       </Button>
       
       <div className="w-px h-4 bg-slate-300 mx-1" />

       {/* Font Size */}
       <div className="flex items-center space-x-1">
         <span className="text-xs">Size:</span>
         <Input
           type="number"
           min="1"
           max="7"
           value={fontSize}
           onChange={handleFontSizeChange}
           className="w-12 h-8 text-xs"
         />
       </div>
       
       <div className="w-px h-4 bg-slate-300 mx-1" />
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => toggleList('insertUnorderedList')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Bullet List"
       >
         <List className="h-4 w-4" />
       </Button>
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => toggleList('insertOrderedList')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Numbered List"
       >
         <ListOrdered className="h-4 w-4" />
       </Button>
       
       <div className="w-px h-4 bg-slate-300 mx-1" />
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('justifyLeft')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Align Left"
       >
         <AlignLeft className="h-4 w-4" />
       </Button>
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('justifyCenter')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Align Center"
       >
         <AlignCenter className="h-4 w-4" />
       </Button>
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('justifyRight')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Align Right"
       >
         <AlignRight className="h-4 w-4" />
       </Button>

       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={() => execCommand('justifyFull')}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Justify"
       >
         <AlignJustify className="h-4 w-4" />
       </Button>
       
       <div className="w-px h-4 bg-slate-300 mx-1" />
       
       <Button
         type="button"
         variant="ghost"
         size="sm"
         onClick={insertLink}
         className="h-8 w-8 p-0 hover:bg-slate-200"
         title="Insert Link"
       >
         <Link className="h-4 w-4" />
       </Button>
     </div>
     
     {/* Editor */}
     <div
       ref={editorRef}
       contentEditable
       onInput={handleChange}
       onBlur={handleChange}
       className="p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-b-lg"
       style={{ wordBreak: 'break-word' }}
       data-placeholder={placeholder}
       suppressContentEditableWarning={true}
       dangerouslySetInnerHTML={{ __html: content }}
     />
     
     <style jsx>{`
       [contenteditable]:empty:before {
         content: attr(data-placeholder);
         color: #9ca3af;
         pointer-events: none;
       }
     `}</style>
   </div>
 );
};

export { RichTextEditor };
