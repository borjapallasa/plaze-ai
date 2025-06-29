
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserX, AlertTriangle } from "lucide-react";
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

interface MemberRejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: Member | null;
  communityId: string;
  isKick?: boolean; // true for kicking active members, false for rejecting pending members
}

export function MemberRejectDialog({ 
  open, 
  onOpenChange, 
  member,
  communityId,
  isKick = false
}: MemberRejectDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRejectOrKickMember = async () => {
    if (!member) return;
    
    setIsLoading(true);
    try {
      console.log(`${isKick ? 'Kicking' : 'Rejecting'} member:`, member.community_subscription_uuid);
      
      const { error } = await supabase
        .from('community_subscriptions')
        .delete()
        .eq('community_subscription_uuid', member.community_subscription_uuid);

      if (error) {
        console.error(`Error ${isKick ? 'kicking' : 'rejecting'} member:`, error);
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to ${isKick ? 'kick' : 'reject'} member. Please try again.`,
        });
        return;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
      
      toast({
        title: `Member ${isKick ? 'kicked' : 'rejected'}`,
        description: `${member.users.first_name} ${member.users.last_name} has been ${isKick ? 'removed from' : 'rejected from joining'} the community.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error(`Error ${isKick ? 'kicking' : 'rejecting'} member:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${isKick ? 'kick' : 'reject'} member. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="pb-6">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 rounded-full bg-red-100">
              <UserX className="h-5 w-5 text-red-600" />
            </div>
            {isKick ? 'Kick Member' : 'Reject Member'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 rounded-lg border bg-card">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                alt={`${member.users.first_name} ${member.users.last_name}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-semibold text-lg">
                {member.users.first_name} {member.users.last_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {isKick 
                  ? `Member since ${new Date(member.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}`
                  : `Requested ${new Date(member.created_at).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}`
                }
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-red-800">
                {isKick ? 'Remove this member?' : 'Reject this request?'}
              </p>
              <p className="text-sm text-red-700">
                {isKick 
                  ? 'This will permanently remove them from the community and delete their membership record.'
                  : 'This will permanently delete their membership request. This action cannot be undone.'
                }
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-6">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleRejectOrKickMember}
            disabled={isLoading}
          >
            {isLoading 
              ? `${isKick ? 'Kicking...' : 'Rejecting...'}` 
              : `${isKick ? 'Kick Member' : 'Reject Request'}`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
