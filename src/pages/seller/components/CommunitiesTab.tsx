
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Eye, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommunitiesTabProps {
  seller: any;
  mode?: 'seller' | 'admin';
}

export function CommunitiesTab({ seller, mode = 'seller' }: CommunitiesTabProps) {
  const navigate = useNavigate();
  
  // Mock data for communities - replace with actual hook when available
  const communities = [];
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Communities ({communities?.length || 0})</h2>
        {mode === 'seller' && (
          <Button onClick={() => navigate('/seller/communities/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Community
          </Button>
        )}
      </div>

      {!communities || communities.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No communities found</p>
          {mode === 'seller' && (
            <Button onClick={() => navigate('/seller/communities/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Community
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community: any) => (
            <Card key={community.community_uuid} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-2">{community.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">
                    {community.member_count || 0} members
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {community.description || "No description available"}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-green-600">
                    {community.price ? `$${community.price}/month` : "Free"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/community/${community.community_uuid}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {mode === 'seller' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/community/${community.community_uuid}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
