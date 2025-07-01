
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Link, MessageSquare, Calendar } from "lucide-react";
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paused':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {partnerships.map((partnership) => (
          <Card key={partnership.affiliate_partnership_uuid} className="border border-gray-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                    {partnership.name}
                  </CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="capitalize font-medium px-3 py-1">
                      {partnership.type}
                    </Badge>
                    <Badge className={`${getStatusColor(partnership.status)} font-medium px-3 py-1 border`}>
                      {partnership.status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Created</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    {new Date(partnership.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Revenue and Commission Split - Enhanced Layout */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Total Revenue</div>
                      <div className="text-2xl font-bold text-gray-900">${partnership.revenue.toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Expert Split</div>
                      <div className="text-2xl font-bold text-blue-600">{Math.round(partnership.expert_split * 100)}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600">Affiliate Split</div>
                      <div className="text-2xl font-bold text-purple-600">{Math.round(partnership.affiliate_split * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                {/* Affiliate Link */}
                {partnership.affiliate_link && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg mt-0.5">
                        <Link className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-blue-900 mb-2">Affiliate Link</div>
                        <div className="text-sm font-mono text-blue-700 bg-white border border-blue-200 rounded px-3 py-2 break-all">
                          {partnership.affiliate_link}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Partner Message */}
                {partnership.message && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
                        <MessageSquare className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-gray-900 mb-2">Partner Message</div>
                        <div className="text-sm text-gray-700 leading-relaxed">{partnership.message}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
