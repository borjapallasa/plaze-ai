
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Link as LinkIcon, List, Image, Video, MoreHorizontal, Code, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
}

export function ProductEditor({ 
  value, 
  onChange, 
  placeholder = "Write your product description...", 
  minHeight = "150px",
  maxHeight = "300px" 
}: ProductEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (value) {
        editorRef.current.innerHTML = value;
      }
      
      // Ensure editor always has proper text direction
      editorRef.current.setAttribute('dir', 'ltr');
      
      // Apply text-align left to all direct child elements
      Array.from(editorRef.current.children).forEach(child => {
        if (child instanceof HTMLElement) {
          child.style.textAlign = 'left';
          child.setAttribute('dir', 'ltr');
        }
      });
    }
  }, [value]);

  // Ensure the editor has focus and selection is preserved
  const execCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      // Store the current selection
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      
      // Focus the editor
      editorRef.current.focus();
      
      // Restore the selection if it exists
      if (selection && range) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      
      // Execute the command
      document.execCommand(command, false, value);
      
      // Save content
      saveContent();
      
      // Maintain focus
      editorRef.current.focus();
    }
  };

  const saveContent = () => {
    if (editorRef.current && onChange) {
      // Ensure all elements have proper direction before saving
      Array.from(editorRef.current.children).forEach(child => {
        if (child instanceof HTMLElement) {
          child.style.textAlign = 'left';
          child.setAttribute('dir', 'ltr');
        }
      });
      
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  // Show placeholder only if there's no content
  const isEmpty = !value || value === "<p></p>" || value === "<br>" || value === "";
  
  return (
    <div className="rounded-md border" dir="ltr">
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
      <div style={{ height: maxHeight, overflow: 'auto' }}>
        <div className="relative">
          <div
            ref={editorRef}
            className={cn(
              "px-3 py-2 focus:outline-none w-full text-left",
              isEmpty ? "text-muted-foreground" : ""
            )}
            contentEditable
            onInput={saveContent}
            onBlur={saveContent}
            onPaste={handlePaste}
            style={{ 
              minHeight,
              direction: "ltr",
              textAlign: "left",
              unicodeBidi: "isolate"
            }}
            dir="ltr"
            dangerouslySetInnerHTML={{ __html: value || '' }}
          />
          {isEmpty && (
            <div className="absolute inset-0 pointer-events-none px-3 py-2 text-muted-foreground">
              {placeholder}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-end p-1 border-t bg-muted/10">
        <div className="text-xs text-muted-foreground">
          {isEmpty ? "0 characters" : `${(value || "").length} characters`}
        </div>
      </div>
    </div>
  );
}
