
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SignUpForm } from "@/components/community/signup/SignUpForm";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { LoadingState } from "@/components/community/signin/LoadingState";
import { NotFoundState } from "@/components/community/signin/NotFoundState";
import { toast } from "sonner";

export default function SignUpCommunityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('communities')
          .select(`
            *,
            experts (
              name,
              profile_picture,
              bio
            )
          `)
          .eq('community_uuid', id)
          .single();

        if (error) {
          console.error('Error fetching community:', error);
          return;
        }

        setCommunity(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  const handleSignUpSuccess = async (user: any) => {
    if (!community || !user) return;

    try {
      // Create community subscription with proper status type
      const { error: subscriptionError } = await supabase
        .from('community_subscriptions')
        .insert({
          user_uuid: user.id,
          community_uuid: community.community_uuid,
          expert_user_uuid: community.expert_uuid,
          email: user.email,
          status: 'pending' as const, // Explicitly cast to the expected type
          type: 'subscription',
          amount: community.price || 0,
        });

      if (subscriptionError) {
        console.error('Error creating community subscription:', subscriptionError);
        toast.error('Failed to join community');
        return;
      }

      toast.success('Successfully joined the community!');
      navigate(`/community/${community.community_uuid}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while joining the community');
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!community) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen flex">
      <CommunityInfoPanel community={community} />
      
      <div className="flex-1 bg-muted/40 p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <SignUpForm onSuccess={handleSignUpSuccess} />
          
          <div className="text-center mt-6">
            <span className="text-sm text-muted-foreground">Already have an account? </span>
            <Link 
              to={`/sign-in/community/${id}`} 
              className="text-sm text-primary hover:underline font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
