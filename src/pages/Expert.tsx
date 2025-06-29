
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainHeader } from "@/components/MainHeader";
import { ExpertLoadingState } from "@/components/expert/layout/ExpertLoadingState";
import { ExpertNotFound } from "@/components/expert/layout/ExpertNotFound";
import { ExpertContent } from "@/components/expert/layout/ExpertContent";
import { useExpertQuery } from "@/hooks/expert/useExpertQuery";
import { useExpertServices } from "@/hooks/expert/useExpertServices";

export default function Expert() {
  const { expert_uuid } = useParams();
  const { data: expert, isLoading: expertLoading, error: expertError } = useExpertQuery(expert_uuid);
  const { services, isLoading: servicesLoading } = useExpertServices(expert?.expert_uuid);

  if (expertLoading) {
    return <ExpertLoadingState />;
  }

  if (expertError || !expert) {
    return <ExpertNotFound />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-0 left-0 right-0 z-50 bg-background">
        <MainHeader />
      </div>

      <main className="pt-24">
        <ExpertContent 
          expert={expert} 
          services={services}
          servicesLoading={servicesLoading}
        />
      </main>
    </div>
  );
}
