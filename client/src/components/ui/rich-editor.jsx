import React, { useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link } from 'lucide-react';
import { Button } from './button';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [content, setContent] = useState(value || '');

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
    onChange?.(newContent);
  };

  return (
    <div className="border rounded-lg bg-white/80">
      {/* Toolbar */}
      <div className="flex items-center space-x-1 p-2 border-b bg-slate-50/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <div className="w-px h-4 bg-slate-300 mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => applyFormat('insertOrderedList')}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Editor */}
      <div
        contentEditable
        onInput={handleChange}
        dangerouslySetInnerHTML={{ __html: content }}
        className="p-3 min-h-[100px] focus:outline-none"
        style={{ wordBreak: 'break-word' }}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export { RichTextEditor };
