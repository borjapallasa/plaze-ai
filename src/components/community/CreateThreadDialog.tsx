
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface CreateThreadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  expertUuid?: string;
  threadsTags?: string[];
}

export function CreateThreadDialog({ open, onOpenChange, communityId, expertUuid, threadsTags = [] }: CreateThreadDialogProps) {
  const [title, setTitle] = useState("");
  const [initialMessage, setInitialMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createThreadMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id || !communityId) {
        throw new Error('User not authenticated or community ID missing');
      }

      // Get user's first name
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('first_name')
        .eq('user_uuid', user.id)
        .maybeSingle();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }

      // Map the selected tag to valid enum values or set to null
      let validTag: "general" | "support" | "off topic" | "anouncements" | null = null;
      if (selectedTag) {
        const tagLower = selectedTag.toLowerCase();
        if (tagLower === "general") validTag = "general";
        else if (tagLower === "support") validTag = "support";
        else if (tagLower === "off topic" || tagLower === "off-topic") validTag = "off topic";
        else if (tagLower === "announcements" || tagLower === "anouncements") validTag = "anouncements";
      }

      const { data, error } = await supabase
        .from('threads')
        .insert({
          title,
          initial_message: initialMessage,
          status: 'open' as const,
          user_uuid: user.id,
          user_name: userData?.first_name || 'Anonymous',
          community_uuid: communityId,
          expert_uuid: expertUuid,
          tag: validTag,
          number_messages: 0,
          upvote_count: 0,
          last_message_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Thread created successfully!");
      queryClient.invalidateQueries({ queryKey: ['community-threads', communityId] });
      setTitle("");
      setInitialMessage("");
      setSelectedTag("");
      onOpenChange(false);
    },
    onError: (error) => {
      console.error('Failed to create thread:', error);
      toast.error("Failed to create thread. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !initialMessage.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createThreadMutation.mutate();
  };

  // Filter tags to only show valid enum values
  const validTags = threadsTags.filter(tag => {
    const tagLower = tag.toLowerCase();
    return tagLower === "general" || 
           tagLower === "support" || 
           tagLower === "off topic" || 
           tagLower === "off-topic" ||
           tagLower === "announcements" ||
           tagLower === "anouncements";
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Thread</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter thread title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Initial Message</Label>
            <Textarea
              id="message"
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="Start the conversation..."
              rows={4}
              required
            />
          </div>
          {validTags.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="tag">Tag (Optional)</Label>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a tag" />
                </SelectTrigger>
                <SelectContent>
                  {validTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createThreadMutation.isPending}
            >
              {createThreadMutation.isPending ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
