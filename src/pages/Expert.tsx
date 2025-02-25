
import { MainHeader } from "@/components/MainHeader";
import { ExpertHeader } from "@/components/expert/ExpertHeader";
import { ExpertContent } from "@/components/expert/layout/ExpertContent";
import { ExpertLoadingState } from "@/components/expert/layout/ExpertLoadingState";
import { ExpertNotFound } from "@/components/expert/layout/ExpertNotFound";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Expert, Service } from "@/components/expert/types";

const moreProducts = [
  {
    title: "Advanced UX Research Methods",
    price: "$89.99",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    seller: "John Doe",
    description: "Learn professional UX research techniques and methodologies.",
    tags: ["research", "ux"],
    category: "design"
  },
  {
    title: "UI Animation Masterclass",
    price: "$79.99",
    image: "https://images.unsplash.com/photo-1518770660439-440f080d1e12",
    seller: "John Doe",
    description: "Create engaging interface animations and micro-interactions.",
    tags: ["animation", "ui"],
    category: "design"
  },
  {
    title: "Design Systems Workshop",
    price: "$129.99",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    seller: "John Doe",
    description: "Build and maintain scalable design systems for large applications.",
    tags: ["systems", "workflow"],
    category: "design"
  },
  {
    title: "UX Writing Fundamentals",
    price: "$69.99",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    seller: "John Doe",
    description: "Master the art of writing clear and effective UX copy.",
    tags: ["writing", "content"],
    category: "design"
  },
  {
    title: "Mobile UX Design",
    price: "$94.99",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c",
    seller: "John Doe",
    description: "Create seamless mobile experiences that users love.",
    tags: ["mobile", "ux"],
    category: "design"
  },
  {
    title: "User Testing Mastery",
    price: "$109.99",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12",
    seller: "John Doe",
    description: "Learn effective user testing methods and analysis techniques.",
    tags: ["testing", "research"],
    category: "design"
  }
];

export default function Expert() {
  const { expert_uuid } = useParams();
  console.log("Expert UUID:", expert_uuid); // Debug log

  const { data: expert, isLoading: isLoadingExpert } = useQuery({
    queryKey: ['expert', expert_uuid],
    queryFn: async () => {
      console.log("Fetching expert with UUID:", expert_uuid); // Debug log
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('expert_uuid', expert_uuid)
        .single();

      if (error) {
        console.error("Supabase error:", error); // Debug log
        throw error;
      }
      
      console.log("Expert data:", data); // Debug log
      
      if (data && data.areas) {
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
      }
      
      return data as Expert;
    },
    enabled: !!expert_uuid
  });

  const { data: reviews } = useQuery({
    queryKey: ['expert-reviews', expert?.expert_uuid],
    queryFn: async () => {
      if (!expert?.expert_uuid) return [];

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('expert_uuid', expert.expert_uuid);

      if (error) throw error;
      
      return data.map(review => ({
        id: review.review_uuid,
        author: review.buyer_name || 'Anonymous',
        rating: review.rating || 0,
        content: review.title || '',
        description: review.comments || '',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        date: new Date(review.created_at).toLocaleDateString(),
        type: review.type
      }));
    },
    enabled: !!expert?.expert_uuid
  });

  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['expert-services', expert?.expert_uuid],
    queryFn: async () => {
      if (!expert?.expert_uuid) return [];

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('expert_uuid', expert.expert_uuid);

      if (error) throw error;
      
      return (data || []).map(service => ({
        ...service,
        features: service.features ? 
          (Array.isArray(service.features) ? service.features : JSON.parse(service.features as string)) 
          : []
      })) as Service[];
    },
    enabled: !!expert?.expert_uuid
  });

  const { data: randomCommunity } = useQuery({
    queryKey: ['expert-community', expert?.expert_uuid],
    queryFn: async () => {
      if (!expert?.expert_uuid) return null;

      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('expert_uuid', expert.expert_uuid);

      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      // Get a random community from the results
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex];
    },
    enabled: !!expert?.expert_uuid
  });

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
