
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCommunitySusbcriptionAccess } from "@/hooks/useCommunitySusbcriptionAccess";

interface CommunityAccessGuardProps {
  communityId: string;
  children: React.ReactNode;
}

export function CommunityAccessGuard({ communityId, children }: CommunityAccessGuardProps) {
  const { hasAccess, status, loading } = useCommunitySusbcriptionAccess(communityId);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 mt-16">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If user has no subscription at all
  if (!status) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl mt-16">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Access Required</h2>
            <p className="text-muted-foreground">
              You need to join this community to access its content.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/community/${communityId}/about`)}>
              Join Community
            </Button>
            <Button variant="outline" onClick={() => navigate('/communities')}>
              Browse Communities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If user has pending subscription
  if (status === 'pending') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl mt-16">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Membership Pending</h2>
            <p className="text-muted-foreground mb-4">
              Your request to join this community is being reviewed. You'll be notified when approved.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Request submitted and pending approval</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate('/account/communities')}>
              View My Communities
            </Button>
            <Button variant="outline" onClick={() => navigate('/communities')}>
              Browse Other Communities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // If user has inactive/cancelled subscription
  if (status !== 'active') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl mt-16">
        <Card className="p-8 text-center">
          <div className="mb-6">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Membership Inactive</h2>
            <p className="text-muted-foreground">
              Your membership to this community is currently inactive.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/community/${communityId}/about`)}>
              Rejoin Community
            </Button>
            <Button variant="outline" onClick={() => navigate('/communities')}>
              Browse Communities
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // User has active access, render children
  return <>{children}</>;
}
