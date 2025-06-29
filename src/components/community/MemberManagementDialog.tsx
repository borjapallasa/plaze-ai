
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserX, UserCheck, Clock, Users, Shield } from "lucide-react";
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

interface MemberManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  isOwner: boolean;
}

export function MemberManagementDialog({ 
  open, 
  onOpenChange, 
  members = [], 
  isOwner 
}: MemberManagementDialogProps) {
  const { toast } = useToast();

  const activeMembers = members.filter(member => member.status === 'active');
  const pendingMembers = members.filter(member => member.status === 'pending');

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

  const handleRemoveMember = async (memberUuid: string) => {
    // TODO: Implement API call to remove member
    toast({
      title: "Member removed",
      description: "The member has been removed from the community.",
    });
  };

  if (!isOwner) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Manage Community Members
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Members ({activeMembers.length})
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Requests ({pendingMembers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeMembers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No active members yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeMembers.map((member) => (
                  <div
                    key={member.community_subscription_uuid}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                          alt={`${member.users.first_name} ${member.users.last_name}`}
                        />
                        <AvatarFallback>
                          {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.users.first_name} {member.users.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Member since {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member.community_subscription_uuid)}
                        className="text-destructive hover:text-destructive"
                      >
                        <UserX className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pendingMembers.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingMembers.map((member) => (
                  <div
                    key={member.community_subscription_uuid}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={member.users.user_thumbnail || "https://github.com/shadcn.png"} 
                          alt={`${member.users.first_name} ${member.users.last_name}`}
                        />
                        <AvatarFallback>
                          {`${member.users.first_name?.charAt(0) || ''}${member.users.last_name?.charAt(0) || ''}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {member.users.first_name} {member.users.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Requested {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pending
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcceptMember(member.community_subscription_uuid)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectMember(member.community_subscription_uuid)}
                          className="text-destructive hover:text-destructive"
                        >
                          <UserX className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
