
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Underline, Link as LinkIcon, List, Image, Video, MoreHorizontal, Code, Heading1, Heading2, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Ensure the editor has focus before executing commands
  const execCommand = (command: string, value: string = '') => {
    if (editorRef.current) {
      // Focus the editor first
      editorRef.current.focus();
      
      // Execute the command
      document.execCommand(command, false, value);
      
      // Save content after command execution
      saveContent();
    }
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
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('formatBlock', false, '<h1>');
                saveContent();
              }
            }}
            title="Heading 1"
            type="button"
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('formatBlock', false, '<h2>');
                saveContent();
              }
            }}
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
              if (editorRef.current) {
                editorRef.current.focus();
                const url = prompt('Enter URL');
                if (url) document.execCommand('createLink', false, url);
                saveContent();
              }
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
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('insertUnorderedList', false);
                saveContent();
              }
            }}
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
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('justifyLeft', false);
                saveContent();
              }
            }}
            title="Align Left"
            type="button"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('justifyCenter', false);
                saveContent();
              }
            }}
            title="Align Center"
            type="button"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => {
              if (editorRef.current) {
                editorRef.current.focus();
                document.execCommand('justifyRight', false);
                saveContent();
              }
            }}
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
              "px-3 py-2 focus:outline-none w-full [&_*]:text-left",
              isEmpty ? "text-muted-foreground" : ""
            )}
            contentEditable
            onInput={saveContent}
            onBlur={saveContent}
            onPaste={handlePaste}
            style={{ 
              minHeight,
              direction: 'ltr',
              unicodeBidi: 'normal'
            }}
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
