
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, List } from "lucide-react";

interface ProductCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectFromScratch: () => void;
  onSelectFromTemplate: () => void;
}

export function ProductCreationDialog({
  open,
  onOpenChange,
  onSelectFromScratch,
  onSelectFromTemplate,
}: ProductCreationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How would you like to create your product?</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <Card 
            className="cursor-pointer hover:bg-accent transition-colors group"
            onClick={onSelectFromScratch}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 p-4 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Create from Scratch</h3>
              <p className="text-sm text-muted-foreground">
                Start with a blank product and build it from the ground up
              </p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:bg-accent transition-colors group"
            onClick={onSelectFromTemplate}
          >
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 p-4 rounded-full bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                <List className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Select from List</h3>
              <p className="text-sm text-muted-foreground">
                Choose from your existing products as a starting point
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
