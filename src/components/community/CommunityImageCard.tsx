
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check } from "lucide-react";

interface CommunityImageCardProps {
  image: {
    id: number;
    url: string;
    storage_path: string;
    is_primary: boolean;
    file_name: string;
  };
  communityUuid: string;
  onEditClick: (image: any) => void;
  onRemoveClick: (id: number, storagePath: string) => void;
  onSetPrimaryClick?: (id: number, currentPrimaryId: number) => void;
  currentPrimaryId?: number;
}

export function CommunityImageCard({
  image,
  communityUuid,
  onEditClick,
  onRemoveClick,
  onSetPrimaryClick,
  currentPrimaryId
}: CommunityImageCardProps) {
  return (
    <Card key={image.id} className="relative group">
      <div className="aspect-square relative overflow-hidden">
        <img
          src={image.url}
          alt={image.file_name || 'Community image'}
          className="object-cover w-full h-full"
        />
        {communityUuid !== 'temp' && (
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            {!image.is_primary && onSetPrimaryClick && (
              <Button
                size="icon"
                variant="secondary"
                onClick={() => onSetPrimaryClick(image.id, currentPrimaryId || 0)}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEditClick(image)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onRemoveClick(image.id, image.storage_path)}
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {image.is_primary && (
        <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-0.5 rounded">
          Primary
        </div>
      )}
    </Card>
  );
}
