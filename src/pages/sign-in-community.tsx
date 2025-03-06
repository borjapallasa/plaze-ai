
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CommunityInfoPanel } from "@/components/community/signin/CommunityInfoPanel";
import { SignInForm } from "@/components/community/signin/SignInForm";
import { LoadingState } from "@/components/community/signin/LoadingState";
import { NotFoundState } from "@/components/community/signin/NotFoundState";

export default function SignInCommunity() {
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        
        if (!id) {
          toast.error("Community ID is missing");
          return;
        }

        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('community_uuid', id)
          .single();

        if (error) {
          console.error("Error fetching community:", error);
          toast.error("Failed to load community information");
          return;
        }

        if (!data) {
          toast.error("Community not found");
          navigate("/communities");
          return;
        }

        setCommunity(data);
      } catch (error) {
        console.error("Error fetching community:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, navigate]);

  if (loading) {
    return <LoadingState />;
  }

  if (!community) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-muted/40">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-start">
        <CommunityInfoPanel community={community} />
        <SignInForm />
      </div>
    </div>
  );
}
