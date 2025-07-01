
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Link, MessageSquare } from "lucide-react";
import { useExpertPartnerships } from "@/hooks/expert/useExpertPartnerships";

interface PartnershipsTabProps {
  expertUuid?: string;
}

export function PartnershipsTab({ expertUuid }: PartnershipsTabProps) {
  const { data: partnerships = [], isLoading } = useExpertPartnerships(expertUuid);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (partnerships.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No partnerships yet</h3>
        <p className="text-gray-500">
          No affiliate partnerships have been created for this expert yet.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {partnerships.map((partnership) => (
          <Card key={partnership.affiliate_partnership_uuid} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    {partnership.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {partnership.type}
                    </Badge>
                    <Badge className={getStatusColor(partnership.status)}>
                      {partnership.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Created</div>
                  <div className="text-sm font-medium">
                    {new Date(partnership.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Revenue and Commission Split */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-500">Revenue</div>
                    <div className="font-semibold">${partnership.revenue.toFixed(2)}</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Expert Split</div>
                  <div className="font-semibold">{Math.round(partnership.expert_split * 100)}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Affiliate Split</div>
                  <div className="font-semibold">{Math.round(partnership.affiliate_split * 100)}%</div>
                </div>
              </div>

              {/* Affiliate Link */}
              {partnership.affiliate_link && (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <Link className="h-4 w-4 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-500">Affiliate Link</div>
                    <div className="text-sm font-mono text-blue-600 truncate">
                      {partnership.affiliate_link}
                    </div>
                  </div>
                </div>
              )}

              {/* Message */}
              {partnership.message && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Partner Message</div>
                    <div className="text-sm text-gray-700">{partnership.message}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
