
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="h-10 w-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Access Required</h2>
            <p className="text-gray-600 leading-relaxed">
              You need to join this community to access its content and connect with other members.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-base font-medium"
              onClick={() => navigate(`/community/${communityId}/about`)}
            >
              Join Community
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base"
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Membership Pending</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Your request to join this community is being reviewed. You'll be notified when approved.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Request submitted and pending approval</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base"
              onClick={() => navigate('/account/communities')}
            >
              View My Communities
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base"
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Membership Inactive</h2>
            <p className="text-gray-600 leading-relaxed">
              Your membership to this community is currently inactive. Rejoin to access all content and features.
            </p>
          </div>
          <div className="space-y-3">
            <Button 
              className="w-full h-12 text-base font-medium"
              onClick={() => navigate(`/community/${communityId}/about`)}
            >
              Rejoin Community
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 text-base"
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
