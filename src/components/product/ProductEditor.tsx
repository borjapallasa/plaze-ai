
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Link as LinkIcon, List, Image, Video, MoreHorizontal, Code, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function ProductEditor({ value, onChange, placeholder = "Write your product description...", minHeight = "200px" }: ProductEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    saveContent();
  };

  const saveContent = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Prevent direct paste to keep clean HTML
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Show placeholder only if there's no content
  const isEmpty = !value || value === "<p></p>" || value === "<br>" || value === "";
  
  return (
    <div className="rounded-md border">
      <div className="flex flex-wrap items-center gap-1 border-b p-2 bg-muted/20">
        <div className="flex items-center gap-1 mr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('bold')}
            title="Bold"
            type="button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('italic')}
            title="Italic"
            type="button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('underline')}
            title="Underline"
            type="button"
          >
            <Underline className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-border mx-1" />
        
        <div className="flex items-center gap-1 mr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('formatBlock', '<h1>')}
            title="Heading 1"
            type="button"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('formatBlock', '<h2>')}
            title="Heading 2"
            type="button"
          >
            <Heading2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-border mx-1" />
        
        <div className="flex items-center gap-1 mr-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => {
              const url = prompt('Enter URL');
              if (url) execCommand('createLink', url);
            }}
            title="Insert Link"
            type="button"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('insertUnorderedList')}
            title="Bullet List"
            type="button"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-4 w-px bg-border mx-1" />
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('justifyLeft')}
            title="Align Left"
            type="button"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('justifyCenter')}
            title="Align Center"
            type="button"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => execCommand('justifyRight')}
            title="Align Right"
            type="button"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 ml-auto" 
          title="More Options"
          type="button"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      <div className="relative">
        <div
          ref={editorRef}
          className={cn(
            "min-h-[200px] px-3 py-2 focus:outline-none",
            isEmpty ? "text-muted-foreground" : ""
          )}
          contentEditable
          onInput={saveContent}
          onBlur={saveContent}
          onPaste={handlePaste}
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: value || '' }}
        />
        {isEmpty && (
          <div className="absolute inset-0 pointer-events-none px-3 py-2 text-muted-foreground">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
