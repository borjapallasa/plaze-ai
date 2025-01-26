import {
  Home,
  Heart,
  Users,
  BookOpen,
  Briefcase,
  Mail,
  HelpCircle,
  ShoppingCart,
  LogIn,
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

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
  const { state } = useSidebar();
  const isExpanded = state === "expanded";

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
                    <a 
                      href={item.url} 
                      className="flex items-center gap-2 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
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
      <SidebarFooter className="p-4 border-t border-sidebar-border mb-4">
        {isExpanded ? (
          <div className="flex flex-col gap-2">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-6 text-base font-semibold rounded-md"
              asChild
            >
              <a href="/signup">
                Sign up
              </a>
            </Button>
            <a 
              href="/login" 
              className="text-sm text-center text-sidebar-foreground hover:text-sidebar-accent-foreground underline underline-offset-4"
            >
              Already a user? Log in
            </a>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            className="w-full flex justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            asChild
          >
            <a href="/signup">
              <LogIn className="h-5 w-5" />
            </a>
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}