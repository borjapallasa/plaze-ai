
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { LoadingState } from "@/components/community/signin/LoadingState";
import { NotFoundState } from "@/components/community/signin/NotFoundState";
import { UnifiedAuthForm } from "@/components/auth/UnifiedAuthForm";

interface Community {
  community_uuid: string;
  name: string;
  description: string | null;
  expert_name: string | null;
  expert_thumbnail: string | null;
  community_thumbnail: string | null;
  member_count: number | null;
  paid_member_count: number | null;
  price: number | null;
}

export default function SignUpCommunity() {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) {
        setError("Community ID is required");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('communities')
          .select(`
            community_uuid,
            name,
            description,
            member_count,
            paid_member_count,
            price,
            expert:expert_uuid (
              first_name,
              last_name,
              user_thumbnail
            )
          `)
          .eq('community_uuid', id)
          .single();

        if (error) {
          console.error("Error fetching community:", error);
          setError("Failed to load community");
        } else if (data) {
          setCommunity({
            community_uuid: data.community_uuid,
            name: data.name,
            description: data.description,
            member_count: data.member_count,
            paid_member_count: data.paid_member_count,
            price: data.price,
            expert_name: data.expert 
              ? `${data.expert.first_name || ''} ${data.expert.last_name || ''}`.trim()
              : null,
            expert_thumbnail: data.expert?.user_thumbnail || null,
            community_thumbnail: null
          });
        } else {
          setError("Community not found");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !community) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Join {community.name}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {community.description || "Join this amazing community and start your journey."}
            </p>
          </div>

          {/* Main Content - Balanced Layout */}
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            {/* Left side - Community Info (3 columns) */}
            <div className="lg:col-span-3">
              <CommunityInfoPanel 
                community={community}
                className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg h-fit"
              />
            </div>

            {/* Right side - Sign Up Form (2 columns) */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 p-6 lg:p-8 sticky top-8">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Get Started
                  </h2>
                  <p className="text-sm text-gray-600">
                    Create your account to join the community
                  </p>
                </div>
                
                <UnifiedAuthForm 
                  defaultMode="signup"
                  redirectTo={`/community/${id}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
