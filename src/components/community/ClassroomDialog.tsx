
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

interface ClassroomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityUuid: string;
  expertUuid?: string;
}

export function ClassroomDialog({ open, onOpenChange, communityUuid, expertUuid }: ClassroomDialogProps) {
  const [name, setName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"visible" | "not visible">("not visible");
  const [notify, setNotify] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUserExpertUuid, setCurrentUserExpertUuid] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch the expert_uuid for the current logged-in user
  useEffect(() => {
    const fetchUserExpertUuid = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('expert_uuid')
          .eq('user_uuid', user.id)
          .single();

        if (error) {
          console.error('Error fetching user expert_uuid:', error);
          return;
        }

        console.log('Fetched user expert_uuid:', data?.expert_uuid);
        setCurrentUserExpertUuid(data?.expert_uuid || null);
      } catch (error) {
        console.error('Error in fetchUserExpertUuid:', error);
      }
    };

    if (open && user?.id) {
      fetchUserExpertUuid();
    }
  }, [open, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Classroom name is required",
      });
      return;
    }

    if (!communityUuid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Community ID is required",
      });
      return;
    }

    // Use the fetched expert_uuid from the current user, fallback to prop if not available
    const expertUuidToUse = currentUserExpertUuid || expertUuid;

    if (!expertUuidToUse) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Expert ID is required. Please ensure you have an expert profile.",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      console.log('Creating classroom with data:', {
        name: name.trim(),
        video_url: videoUrl.trim() || null,
        summary: summary.trim() || null,
        description: description.trim() || null,
        community_uuid: communityUuid,
        expert_uuid: expertUuidToUse,
        status: status,
        notify: notify
      });

      const { data, error } = await supabase
        .from('classrooms')
        .insert({
          name: name.trim(),
          video_url: videoUrl.trim() || null,
          summary: summary.trim() || null,
          description: description.trim() || null,
          community_uuid: communityUuid,
          expert_uuid: expertUuidToUse,
          status: status,
          notify: notify
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating classroom:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to create classroom: ${error.message}`,
        });
        return;
      }

      console.log('Classroom created successfully:', data);
      
      toast({
        title: "Success",
        description: "Classroom created successfully",
      });
      
      // Reset form
      setName("");
      setVideoUrl("");
      setSummary("");
      setDescription("");
      setStatus("not visible");
      setNotify(false);
      
      // Close dialog
      onOpenChange(false);
      
      // Invalidate and refetch classrooms
      queryClient.invalidateQueries({ queryKey: ['community-classrooms', communityUuid] });
      
    } catch (error) {
      console.error('Error creating classroom:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create classroom. Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Classroom</DialogTitle>
          <DialogDescription>
            Add a new classroom to your community. Classrooms are where you can organize learning content and activities.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="classroom-name">Classroom Name *</Label>
            <Input
              id="classroom-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter classroom name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classroom-video">Video URL (Optional)</Label>
            <Input
              id="classroom-video"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classroom-summary">Summary (Optional)</Label>
            <Textarea
              id="classroom-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary of the classroom"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="classroom-description">Description (Optional)</Label>
            <Textarea
              id="classroom-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what this classroom is about"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="classroom-status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as "visible" | "not visible")}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="not visible">Not Visible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="classroom-notify"
              checked={notify}
              onChange={(e) => setNotify(e.target.checked)}
              className="rounded border border-input"
            />
            <Label htmlFor="classroom-notify">Send notifications for this classroom</Label>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Classroom"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
