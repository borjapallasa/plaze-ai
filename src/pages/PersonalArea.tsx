
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { 
  ArrowDownCircle,
  Star,
  ShoppingBag,
  Users,
  CircleDollarSign,
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

  // Fetch expert UUID for the authenticated user
  const { data: expertData } = useQuery({
    queryKey: ['expert-by-email', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .eq('email', user.email)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching expert:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.email,
  });

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
      to: "/community"
    },
    {
      icon: <CircleDollarSign className="w-8 h-8" />,
      title: "Manage Subscriptions",
      description: "Manage the subscriptions to communities.",
      to: "/manage-subscriptions"
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
      to: "/product"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Inbox",
      description: "Access to all messages and conversations.",
      to: "/inbox"
    },
    {
      icon: <UserCog className="w-8 h-8" />,
      title: "Account Settings",
      description: "Change account details and password.",
      to: "/settings"
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Seller Area",
      description: "Track all your sales and insights of your NCC sales.",
      to: expertData?.expert_uuid ? `/seller/${expertData.expert_uuid}` : "/sell"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
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
