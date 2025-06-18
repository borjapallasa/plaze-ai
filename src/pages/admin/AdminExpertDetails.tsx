
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainHeader } from "@/components/MainHeader";
import { DefaultHeader } from "@/components/DefaultHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Mail, MapPin, User, Star, TrendingUp, CheckCircle, Globe } from "lucide-react";
import { Expert } from "@/types/expert";

export default function AdminExpertDetails() {
  const { id } = useParams();

  const { data: expert, isLoading, error } = useQuery({
    queryKey: ['admin-expert-details', id],
    queryFn: async () => {
      console.log('Fetching expert details for ID:', id);
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('expert_uuid', id)
        .single();

      if (error) {
        console.error('Error fetching expert:', error);
        throw error;
      }

      // Transform the data to ensure areas is properly parsed
      if (data.areas) {
        try {
          data.areas = typeof data.areas === 'string' 
            ? JSON.parse(data.areas) 
            : Array.isArray(data.areas) 
              ? data.areas 
              : [];
        } catch (e) {
          console.error('Error parsing areas:', e);
          data.areas = [];
        }
      } else {
        data.areas = [];
      }

      return data as Expert;
    },
    enabled: !!id
  });

  const getStatusBadge = (status: Expert["status"]) => {
    const badges = {
      active: <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>,
      inactive: <Badge variant="secondary" className="bg-red-100 text-red-800">Inactive</Badge>,
      "in review": <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">In review</Badge>,
      suspended: <Badge variant="secondary" className="bg-gray-100 text-gray-800">Suspended</Badge>
    };
    return badges[status || "active"];
  };

  if (isLoading) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !expert) {
    return (
      <>
        <MainHeader />
        <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Expert Not Found</h2>
            <p className="text-gray-600">The expert you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainHeader />
      <div className="container mx-auto px-4 py-8 max-w-[1400px] mt-16">
        <DefaultHeader 
          title={expert.name || 'Unnamed Expert'}
          subtitle={expert.title || 'No title provided'}
          backLink="/admin/experts"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Email:</span>
                  <span className="text-sm font-medium">{expert.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{expert.location || 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Slug:</span>
                  <span className="text-sm font-medium">{expert.slug || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm font-medium">{new Date(expert.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-sm text-gray-600">Status:</span>
                <div className="mt-1">
                  {getStatusBadge(expert.status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{expert.completed_projects || 0}</div>
                  <div className="text-xs text-gray-500">Completed Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{expert.client_satisfaction || 0}%</div>
                  <div className="text-xs text-gray-500">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{expert.response_rate || 0}%</div>
                  <div className="text-xs text-gray-500">Response Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">-</div>
                  <div className="text-xs text-gray-500">Sales Amount</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
                {expert.thumbnail ? (
                  <img
                    src={expert.thumbnail}
                    alt={expert.name || 'Expert'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-24 w-24 text-gray-400" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {expert.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {expert.info || 'No additional information provided.'}
              </p>
            </CardContent>
          </Card>

          {/* Areas of Expertise */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Areas of Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {expert.areas && expert.areas.length > 0 ? (
                  expert.areas.map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-500">No areas specified</span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
