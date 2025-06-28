
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
      <div className="flex justify-center items-center py-16 mt-16">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  // If user has no subscription at all
  if (!status) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-16">
        <Card className="w-full max-w-md p-8 text-center border-2 border-gray-200 bg-white shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Access Required</h2>
            <p className="text-gray-600 text-sm">
              You need to join this community to access its content and connect with other members.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full h-10 text-sm font-medium"
              onClick={() => navigate(`/community/${communityId}/about`)}
            >
              Join Community
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10 text-sm font-medium border-2"
              onClick={() => navigate('/#communities')}
            >
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-16">
        <Card className="w-full max-w-md p-8 text-center border-2 border-gray-200 bg-white shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Membership Pending</h2>
            <p className="text-gray-600 text-sm mb-4">
              Your request to join this community is being reviewed. You'll be notified when approved.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <div className="flex items-center justify-center gap-2 text-orange-700 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Request submitted and pending approval</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-10 text-sm font-medium border-2"
              onClick={() => navigate('/account/communities')}
            >
              View My Communities
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10 text-sm font-medium border-2"
              onClick={() => navigate('/#communities')}
            >
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
      <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-16">
        <Card className="w-full max-w-md p-8 text-center border-2 border-gray-200 bg-white shadow-lg">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Membership Inactive</h2>
            <p className="text-gray-600 text-sm">
              Your membership to this community is currently inactive. Rejoin to access all content and features.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full h-10 text-sm font-medium"
              onClick={() => navigate(`/community/${communityId}/about`)}
            >
              Rejoin Community
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-10 text-sm font-medium border-2"
              onClick={() => navigate('/#communities')}
            >
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
