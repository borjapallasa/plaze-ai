
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { 
  ArrowDownCircle,
  Star,
  ShoppingBag,
  Users,
  MessageCircle,
  UserCog,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  to: string;
}

const MenuItem = ({ icon, title, description, to }: MenuItemProps) => (
  <Link to={to}>
    <Card className="p-6 h-full hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer border border-border/50">
      <div className="space-y-4">
        <div className="text-primary">{icon}</div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
    </Card>
  </Link>
);

export default function PersonalArea() {
  const { user } = useAuth();

  // Query to check if user is an expert
  const { data: userData } = useQuery({
    queryKey: ['user-data', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('is_expert')
        .eq('user_uuid', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id
  });

  const isExpert = userData?.is_expert || false;

  // Fetch expert UUID for the authenticated user
  const { data: expertData } = useQuery({
    queryKey: ['expert-by-email', user?.email],
    queryFn: async () => {
      if (!user?.email || !isExpert) return null;
      
      console.log('Looking for expert with email:', user.email);
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching expert:', error);
        return null;
      }
      
      console.log('Expert data found:', data);
      return data;
    },
    enabled: !!user?.email && isExpert,
  });

  // Determine seller area link
  const getSellerAreaLink = () => {
    if (!user) return "/sell";
    
    if (isExpert && expertData?.expert_uuid) {
      return `/seller/${expertData.expert_uuid}`;
    }
    
    // If user is marked as expert but no expert profile found, still go to sell page
    return "/sell";
  };

  const menuItems = [
    {
      icon: <ArrowDownCircle className="w-8 h-8" />,
      title: "Browse All Templates",
      description: "Check all templates available in the platform!",
      to: "/#products"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Explore Communities",
      description: "Explore and join all communities of NoCodeClick!",
      to: "/#communities"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "My Communities",
      description: "See all the communities that you're part of.",
      to: "/account/communities"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Affiliate Program",
      description: "Track the performance of your affiliates.",
      to: "/affiliates"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "My Purchases",
      description: "The area where you can access all your purchased templates.",
      to: "/account/transactions"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Inbox",
      description: "Access to all messages and conversations.",
      to: "/account/chats"
    },
    {
      icon: <UserCog className="w-8 h-8" />,
      title: "Account Settings",
      description: "Change account details and password.",
      to: "/account/settings"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Seller Area",
      description: "Track all your sales and insights of your NCC sales.",
      to: getSellerAreaLink()
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-[1400px]">
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl font-bold">Welcome back <span className="text-primary">Borja</span>!</h1>
          <p className="text-muted-foreground text-lg">What do you want today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <MenuItem key={index} {...item} />
          ))}
        </div>
      </main>
    </div>
  );
}
