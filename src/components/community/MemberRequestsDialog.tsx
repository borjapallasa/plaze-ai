
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserX, UserCheck, Clock } from "lucide-react";
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            Member Requests ({members.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">No pending requests.</p>
            </div>
          ) : (
            members.map((member) => (
              <div
                key={member.community_subscription_uuid}
                className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-all duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12 ring-2 ring-background">
                    <AvatarImage 
                      src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                      alt={`${member.users.first_name} ${member.users.last_name}`}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-semibold text-base">
                      {member.users.first_name} {member.users.last_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Requested {new Date(member.created_at).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 font-medium"
                  >
                    Pending
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcceptMember(member.community_subscription_uuid)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 px-4 py-2 font-medium"
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      Accept
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectMember(member.community_subscription_uuid)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 px-4 py-2 font-medium"
                    >
                      <UserX className="h-4 w-4 mr-2" />
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
