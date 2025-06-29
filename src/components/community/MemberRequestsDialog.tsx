
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserX, UserCheck, Clock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
}

export function MemberRequestsDialog({ 
  open, 
  onOpenChange, 
  members = [], 
  isOwner 
}: MemberRequestsDialogProps) {
  const { toast } = useToast();

  const handleAcceptMember = async (memberUuid: string) => {
    // TODO: Implement API call to accept member
    toast({
      title: "Member accepted",
      description: "The member has been accepted into the community.",
    });
  };

  const handleRejectMember = async (memberUuid: string) => {
    // TODO: Implement API call to reject member
    toast({
      title: "Member rejected",
      description: "The member request has been rejected.",
    });
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5" />
            Member Requests ({members.length})
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No pending requests.</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.community_subscription_uuid}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                      alt={`${member.users.first_name} ${member.users.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">
                      {member.users.first_name} {member.users.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Requested {new Date(member.created_at).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs px-2 py-1"
                  >
                    Pending
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAcceptMember(member.community_subscription_uuid)}
                      className="h-8 px-3 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRejectMember(member.community_subscription_uuid)}
                      className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
