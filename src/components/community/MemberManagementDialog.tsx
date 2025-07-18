import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserX, UserCheck, Clock, Users, Shield } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCommunityMembers } from "@/hooks/use-community-members";
import { MemberRejectDialog } from "./MemberRejectDialog";

interface MemberManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  communityId: string;
  isOwner: boolean;
}

export function MemberManagementDialog({ 
  open, 
  onOpenChange, 
  communityId,
  isOwner 
}: MemberManagementDialogProps) {
  const queryClient = useQueryClient();
  const { data: members = [], isLoading } = useCommunityMembers(communityId);
  const [memberToReject, setMemberToReject] = useState<any>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [isKickMode, setIsKickMode] = useState(false);

  console.log('All members:', members);
  console.log('Reject dialog open:', rejectDialogOpen);
  console.log('Member to reject:', memberToReject);

  const activeMembers = members.filter(member => member.status === 'active');
  const pendingMembers = members.filter(member => member.status === 'pending');
  const inactiveMembers = members.filter(member => member.status === 'inactive');
  const rejectedMembers = members.filter(member => member.status === 'rejected');

  console.log('Active members:', activeMembers);
  console.log('Pending members:', pendingMembers);
  console.log('Inactive members:', inactiveMembers);
  console.log('Rejected members:', rejectedMembers);

  const acceptMemberMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase
        .from('community_subscriptions')
        .update({ status: 'active' })
        .eq('community_subscription_uuid', membershipId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member accepted successfully!");
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
    },
    onError: (error) => {
      console.error('Failed to accept member:', error);
      toast.error("Failed to accept member. Please try again.");
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const { error } = await supabase
        .from('community_subscriptions')
        .update({ status: 'inactive' })
        .eq('community_subscription_uuid', membershipId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Member removed from community.");
      queryClient.invalidateQueries({ queryKey: ['community-members', communityId] });
    },
    onError: (error) => {
      console.error('Failed to remove member:', error);
      toast.error("Failed to remove member. Please try again.");
    },
  });

  const handleAcceptMember = (membershipId: string) => {
    acceptMemberMutation.mutate(membershipId);
  };

  const handleRejectMember = (member: any) => {
    console.log('Opening reject dialog for member:', member);
    setMemberToReject(member);
    setIsKickMode(false); // This is a rejection, not a kick
    setRejectDialogOpen(true);
  };

  const handleKickMember = (member: any) => {
    console.log('Opening kick dialog for member:', member);
    setMemberToReject(member);
    setIsKickMode(true); // This is a kick, not a rejection
    setRejectDialogOpen(true);
  };

  const handleRemoveMember = (membershipId: string) => {
    removeMemberMutation.mutate(membershipId);
  };

  const handleRejectDialogClose = () => {
    console.log('Closing reject dialog');
    setRejectDialogOpen(false);
    setMemberToReject(null);
    setIsKickMode(false);
  };

  if (!isOwner) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Manage Community Members
            </DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Active ({activeMembers.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Pending ({pendingMembers.length})
                </TabsTrigger>
                <TabsTrigger value="inactive" className="flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  Inactive ({inactiveMembers.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <UserX className="h-4 w-4" />
                  Rejected ({rejectedMembers.length})
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
                            onClick={() => handleKickMember(member)}
                            className="text-destructive hover:text-destructive"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Kick
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
                              disabled={acceptMemberMutation.isPending}
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectMember(member)}
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

              <TabsContent value="inactive" className="space-y-4">
                {inactiveMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No inactive members.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inactiveMembers.map((member) => (
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
                              Inactive since {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                            Inactive
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptMember(member.community_subscription_uuid)}
                            disabled={acceptMemberMutation.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Reactivate
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-4">
                {rejectedMembers.length === 0 ? (
                  <div className="text-center py-8">
                    <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No rejected members.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rejectedMembers.map((member) => (
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
                              Rejected {new Date(member.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            Rejected
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAcceptMember(member.community_subscription_uuid)}
                            disabled={acceptMemberMutation.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {memberToReject && (
        <MemberRejectDialog
          open={rejectDialogOpen}
          onOpenChange={handleRejectDialogClose}
          member={memberToReject}
          communityId={communityId}
          isKick={isKickMode}
        />
      )}
    </>
  );
}
