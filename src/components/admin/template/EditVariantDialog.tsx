
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { ProductVariant } from "@/types/Product";

interface EditVariantDialogProps {
  variant: ProductVariant | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (variantId: string, updatedData: Partial<ProductVariant>) => void;
}

export function EditVariantDialog({ variant, isOpen, onClose, onSave }: EditVariantDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    comparePrice: "",
    filesLink: "",
    additionalDetails: "",
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState("");

  // Reset form data when variant changes
  useEffect(() => {
    if (variant) {
      setFormData({
        name: variant.name || "",
        price: variant.price?.toString() || "",
        comparePrice: variant.comparePrice?.toString() || "",
        filesLink: variant.filesLink || "",
        additionalDetails: variant.additionalDetails || "",
        tags: variant.tags || []
      });
    }
  }, [variant]);

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = () => {
    if (!variant) return;

    const updatedData: Partial<ProductVariant> = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      comparePrice: parseFloat(formData.comparePrice) || 0,
      filesLink: formData.filesLink,
      additionalDetails: formData.additionalDetails,
      tags: formData.tags
    };

    onSave(variant.id, updatedData);
    onClose();
  };

  if (!variant) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Variant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter variant name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="comparePrice">Compare Price ($)</Label>
              <Input
                id="comparePrice"
                type="number"
                step="0.01"
                value={formData.comparePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, comparePrice: e.target.value }))}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="filesLink">Files Link</Label>
            <Input
              id="filesLink"
              value={formData.filesLink}
              onChange={(e) => setFormData(prev => ({ ...prev, filesLink: e.target.value }))}
              placeholder="Enter files link URL"
            />
          </div>

          <div>
            <Label htmlFor="additionalDetails">Additional Details</Label>
            <Textarea
              id="additionalDetails"
              value={formData.additionalDetails}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalDetails: e.target.value }))}
              placeholder="Enter additional details for the buyer..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>Tags</Label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} disabled={!newTag.trim()}>
                  Add Tag
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
