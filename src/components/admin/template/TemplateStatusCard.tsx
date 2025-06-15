
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TemplateStatusCardProps {
  status: string;
  productUuid: string;
  isMobile?: boolean;
}

type StatusType = "active" | "inactive" | "draft";

export function TemplateStatusCard({ status, productUuid, isMobile = false }: TemplateStatusCardProps) {
  const [currentStatus, setCurrentStatus] = useState<StatusType>(status as StatusType);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  
  const cardClass = isMobile ? "md:hidden" : "hidden md:block";

  const handleStatusChange = (newStatus: StatusType) => {
    setCurrentStatus(newStatus);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: currentStatus })
        .eq('product_uuid', productUuid);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error",
          description: "Failed to update template status.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Template status updated successfully.",
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className={cardClass}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
