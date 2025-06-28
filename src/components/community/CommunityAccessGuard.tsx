
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
        <Card className="w-full max-w-lg p-10 text-center shadow-xl border-0 bg-white">
          <div className="mb-10">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Lock className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Access Required</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              You need to join this community to access its content and connect with other members.
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full h-14 text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
              onClick={() => navigate(`/community/${communityId}/about`)}
            >
              Join Community
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-gray-50 transition-all"
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
        <Card className="w-full max-w-lg p-10 text-center shadow-xl border-0 bg-white">
          <div className="mb-10">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Clock className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Membership Pending</h2>
            <p className="text-gray-600 leading-relaxed text-lg mb-8">
              Your request to join this community is being reviewed. You'll be notified when approved.
            </p>
            <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6">
              <div className="flex items-center justify-center gap-3 text-orange-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Request submitted and pending approval</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-gray-50 transition-all"
              onClick={() => navigate('/account/communities')}
            >
              View My Communities
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-gray-50 transition-all"
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
        <Card className="w-full max-w-lg p-10 text-center shadow-xl border-0 bg-white">
          <div className="mb-10">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Membership Inactive</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Your membership to this community is currently inactive. Rejoin to access all content and features.
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full h-14 text-base font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
              onClick={() => navigate(`/community/${communityId}/about`)}
            >
              Rejoin Community
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-gray-50 transition-all"
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
