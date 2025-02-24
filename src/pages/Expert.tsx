import { ExpertHeader } from "@/components/expert/ExpertHeader";
import { ExpertInfo } from "@/components/expert/ExpertInfo";
import { ExpertSkills } from "@/components/expert/ExpertSkills";
import { ExpertStats } from "@/components/expert/ExpertStats";
import { ExpertServices } from "@/components/expert/ExpertServices";
import { ExpertCommunity } from "@/components/expert/ExpertCommunity";
import { MoreFromSeller } from "@/components/product/MoreFromSeller";
import { ProductReviews } from "@/components/product/ProductReviews";
import { MainHeader } from "@/components/MainHeader";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
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

const reviews = [
  { 
    id: "1",
    author: "Sarah Johnson", 
    rating: 5, 
    content: "Outstanding UX expertise!",
    description: "Worked with this expert on our app redesign. Their insights and attention to detail transformed our user experience completely.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    date: "2 days ago",
    itemQuality: 5,
    shipping: 5,
    customerService: 5
  },
  { 
    id: "2",
    author: "Michael Chen", 
    rating: 5, 
    content: "Exceptional design thinking",
    description: "The expert provided invaluable feedback on our product's UX. Their systematic approach to problem-solving was impressive.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    date: "1 week ago",
    itemQuality: 5,
    shipping: 4,
    customerService: 5
  },
  { 
    id: "3",
    author: "Emily Rodriguez", 
    rating: 4, 
    content: "Great collaboration experience",
    description: "Very professional and knowledgeable. They helped us identify key pain points in our user journey and provided actionable solutions.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    date: "2 weeks ago",
    itemQuality: 4,
    shipping: 5,
    customerService: 4
  },
  { 
    id: "4",
    author: "David Kim", 
    rating: 5, 
    content: "Top-notch UX consultant",
    description: "Their expertise in user research and prototyping helped us create a much more intuitive interface. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    date: "3 weeks ago",
    itemQuality: 5,
    shipping: 5,
    customerService: 5
  }
];

export default function Expert() {
  const { id, slug } = useParams();

  // Fetch expert data
  const { data: expert, isLoading: isLoadingExpert } = useQuery({
    queryKey: ['expert', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experts')
        .select('*')
        .eq('id', Number(id))
        .single();

      if (error) throw error;
      
      // Parse the areas JSON if it exists and convert to string array
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
    }
  });

  // Fetch expert's services
  const { data: services, isLoading: isLoadingServices } = useQuery({
    queryKey: ['expert-services', expert?.expert_uuid],
    queryFn: async () => {
      if (!expert?.expert_uuid) return [];

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_uuid', expert.expert_uuid);

      if (error) throw error;
      
      // Parse features if they exist
      return (data || []).map(service => ({
        ...service,
        features: service.features ? 
          (Array.isArray(service.features) ? service.features : JSON.parse(service.features as string)) 
          : []
      })) as Service[];
    },
    enabled: !!expert?.expert_uuid
  });

  // Show loading state
  if (isLoadingExpert || isLoadingServices) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container mx-auto px-4 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Show error state if expert not found
  if (!expert) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16">
          <MainHeader />
          <div className="container mx-auto px-4 py-12">
            <p className="text-center text-muted-foreground">Expert not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16">
        <MainHeader />
        <div className="container mx-auto px-4">
          <ExpertHeader expert={expert} />
        </div>

        <div className="container mx-auto px-4">
          {/* Desktop Layout */}
          <div className="hidden lg:block space-y-8">
            <div className="grid grid-cols-5 gap-6">
              <ExpertInfo expert={expert} />
              <ExpertSkills expert={expert} />
            </div>

            <div className="grid grid-cols-5 gap-6">
              <ExpertStats expert={expert} />
              <ExpertServices services={services || []} />
            </div>

            <ExpertCommunity />

            <div className="space-y-8">
              <MoreFromSeller products={moreProducts} />
              <ProductReviews reviews={reviews} className="p-6 border-gray-100" />
            </div>
          </div>

          {/* Mobile Layout - Reordered */}
          <div className="lg:hidden space-y-8">
            <div>
              <ExpertSkills expert={expert} />
            </div>

            <div>
              <ExpertInfo expert={expert} />
            </div>

            <div>
              <ExpertServices services={services || []} />
            </div>

            <div>
              <ExpertStats expert={expert} />
            </div>

            <div>
              <ExpertCommunity />
            </div>

            <div>
              <MoreFromSeller products={moreProducts} />
            </div>

            <div>
              <ProductReviews reviews={reviews} className="p-6 border-gray-100" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
