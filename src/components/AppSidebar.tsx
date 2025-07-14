import {
  GalleryVerticalEnd,
} from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "./ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { CartDrawerTrigger } from "./cart/CartDrawerTrigger";
import { useCart } from "@/hooks/use-cart";

export function AppSidebar() {
  const { user } = useAuth();
  const { cartData } = useCart();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Templates</span>
                  <span className="text-xs">Marketplace</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <CartDrawerTrigger itemCount={cartData.totalItems} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      {user ? (
        <>
          {/* Add more sidebar items here if needed */}
        </>
      ) : null}
    </Sidebar>
  );
}
