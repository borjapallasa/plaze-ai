
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface Member {
  community_subscription_uuid: string;
  created_at: string;
  user_uuid: string;
  status: 'pending' | 'active' | 'cancelled' | 'rejected';
  users: {
    user_uuid: string;
    first_name: string;
    last_name: string;
    user_thumbnail: string | null;
  };
}

interface MemberRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  isOwner: boolean;
  communityId: string;
}

export function MemberRequestsDialog({ 
  open, 
  onOpenChange, 
  members = [], 
  isOwner,
  communityId
}: MemberRequestsDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleAcceptMember = async (memberUuid: string) => {
    try {
      const { error } = await supabase
        .from('community_subscriptions')
        .update({ status: 'active' })
        .eq('community_subscription_uuid', memberUuid);

      if (error) {
        console.error('Error accepting member:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to accept member. Please try again.",
        });
        return;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
      
      toast({
        title: "Member accepted",
        description: "The member has been accepted into the community.",
      });
    } catch (error) {
      console.error('Error accepting member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept member. Please try again.",
      });
    }
  };

  const handleRejectMember = async (memberUuid: string) => {
    try {
      const { error } = await supabase
        .from('community_subscriptions')
        .delete()
        .eq('community_subscription_uuid', memberUuid);

      if (error) {
        console.error('Error rejecting member:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to reject member. Please try again.",
        });
        return;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
      
      toast({
        title: "Member rejected",
        description: "The member request has been rejected.",
      });
    } catch (error) {
      console.error('Error rejecting member:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject member. Please try again.",
      });
    }
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Member Requests ({members.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No pending requests.</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.community_subscription_uuid}
                className="flex items-center justify-between p-6 rounded-xl border bg-card hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                      alt={`${member.users.first_name} ${member.users.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                      {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2 flex-1">
                    <p className="font-semibold text-lg">
                      {member.users.first_name} {member.users.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requested {new Date(member.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAcceptMember(member.community_subscription_uuid)}
                    className="h-12 w-12 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full"
                  >
                    <Check className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRejectMember(member.community_subscription_uuid)}
                    className="h-12 w-12 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
