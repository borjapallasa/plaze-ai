
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MainHeader = () => {
  const location = useLocation();
  const isCommunityPage = location.pathname.includes('/community') || location.pathname.includes('/classroom');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b">
      <div className="container mx-auto px-4 h-full">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-full gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              {isCommunityPage ? (
                <>
                  <Input
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                    placeholder="Search in this community..."
                    type="search"
                  />
                  <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </>
              ) : (
                <>
                  <Input
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                    placeholder="Search products..."
                    type="search"
                  />
                  <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                    <Search className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="rounded-full px-2.5 py-1.5 h-8 border-2 hover:border-primary/20 transition-colors"
              >
                <Menu className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>Sign In</DropdownMenuItem>
              <DropdownMenuItem>Sign Up</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sell on Plaze</DropdownMenuItem>
              <DropdownMenuItem>Help Center</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-full gap-4">
          <Link to="/" className="text-lg font-semibold">
            Logo
          </Link>

          <div className="flex-1 max-w-xl">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <div className="flex-1 flex items-center gap-1">
                <Select defaultValue={isCommunityPage ? "ThisCommunity" : "Products"}>
                  <SelectTrigger className="border-0 w-[140px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-[180px]">
                    {isCommunityPage && (
                      <SelectItem value="ThisCommunity">This Community</SelectItem>
                    )}
                    <SelectItem value="Products">Products</SelectItem>
                    <SelectItem value="Experts">Experts</SelectItem>
                    <SelectItem value="Communities">Communities</SelectItem>
                    <SelectItem value="Jobs">Jobs</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm"
                  placeholder={isCommunityPage ? "Search in this community..." : "Search products..."}
                  type="search"
                />
              </div>
              <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10 h-8"
            >
              Sell on Plaze
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="rounded-full px-2.5 py-1.5 h-8 border-2 hover:border-primary/20 transition-colors"
                >
                  <Menu className="h-3.5 w-3.5 mr-1.5" />
                  <User className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>Sign In</DropdownMenuItem>
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sell on Plaze</DropdownMenuItem>
                <DropdownMenuItem>Help Center</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
