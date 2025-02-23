
import { MainHeader } from "@/components/MainHeader";
import { Card } from "@/components/ui/card";
import { 
  ArrowDownCircle,
  FileText,
  Users,
  CircleDollarSign,
  Camera,
  TrendingUp,
  MessageCircle,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";

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

const menuItems = [
  {
    icon: <ArrowDownCircle className="w-8 h-8" />,
    title: "All Templates",
    description: "Check all templates available in the platform by category, sales and seller. Request changes and make edits.",
    to: "/a/admin/templates"
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "Draft Templates",
    description: "Review all new templates, approve, edit and request changes if needed.",
    to: "/a/admin/draft-templates"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Users",
    description: "List of all users, check status, track activity and edit permissions of all users of NoCodeClick.",
    to: "/a/admin/users"
  },
  {
    icon: <CircleDollarSign className="w-8 h-8" />,
    title: "Transactions",
    description: "Check all transactions, status, templates included and all the information of any transaction.",
    to: "/a/admin/transactions"
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Creators",
    description: "Check all creators, new applications, changes, and all the information you need to know.",
    to: "/a/admin/creators"
  },
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: "Conversations",
    description: "Feature description",
    to: "/a/admin/conversations"
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: "KPIs",
    description: "NoCodeClick KPIs.",
    to: "/a/admin/kpis"
  },
  {
    icon: <Ticket className="w-8 h-8" />,
    title: "Tickets",
    description: "Answer NoCodeClick Tickets.",
    to: "/a/admin/tickets"
  }
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <div className="space-y-2 mb-8 text-center">
          <h1 className="text-4xl font-bold">Welcome to Admin Dashboard.</h1>
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
