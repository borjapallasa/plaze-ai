
import { MainHeader } from "@/components/MainHeader";
import { ExpertHeader } from "@/components/expert/ExpertHeader";
import { ExpertContent } from "@/components/expert/layout/ExpertContent";
import { ExpertLoadingState } from "@/components/expert/layout/ExpertLoadingState";
import { ExpertNotFound } from "@/components/expert/layout/ExpertNotFound";
import { useParams } from "react-router-dom";
import { useExpertQuery } from "@/hooks/expert/useExpertQuery";
import { useExpertReviews } from "@/hooks/expert/useExpertReviews";
import { useExpertServices } from "@/hooks/expert/useExpertServices";
import { useExpertCommunity } from "@/hooks/expert/useExpertCommunity";
import { moreProducts } from "@/data/moreProducts";

export default function Expert() {
  const { expert_uuid } = useParams();
  
  const { data: expert, isLoading: isLoadingExpert } = useExpertQuery(expert_uuid);
  const { data: reviews } = useExpertReviews(expert?.expert_uuid);
  const { data: services, isLoading: isLoadingServices } = useExpertServices(expert?.expert_uuid);
  const { data: randomCommunity } = useExpertCommunity(expert?.expert_uuid);

  if (isLoadingExpert || isLoadingServices) {
    return <ExpertLoadingState />;
  }

  if (!expert) {
    return <ExpertNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4">
          <ExpertHeader expert={expert} />
        </div>
        <ExpertContent 
          expert={expert} 
          services={services || []} 
          moreProducts={moreProducts}
          reviews={reviews || []}
          community={randomCommunity}
        />
      </div>
    </div>
  );
}
