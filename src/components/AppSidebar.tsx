import {
  Home,
  Heart,
  Users,
  BookOpen,
  Briefcase,
  Mail,
  HelpCircle,
  ShoppingCart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Favorites", icon: Heart, url: "#favorites" },
  { title: "Affiliates", icon: Users, url: "#affiliates" },
  { title: "Blog", icon: BookOpen, url: "#blog" },
  { title: "Careers", icon: Briefcase, url: "#careers" },
  { title: "Newsletter", icon: Mail, url: "#newsletter" },
  { title: "Help", icon: HelpCircle, url: "#help" },
  { title: "Cart", icon: ShoppingCart, url: "#cart" },
];

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <div className="flex items-center justify-end p-2">
          <SidebarTrigger />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}