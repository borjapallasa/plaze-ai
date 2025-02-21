import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, ChevronDown } from "lucide-react";
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
  const [mobileSearchCategory, setMobileSearchCategory] = useState(isCommunityPage ? "This Community" : "Products");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b">
      <div className="container mx-auto px-4 h-full">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-full gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 hover:bg-transparent"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[200px]">
                  {isCommunityPage && (
                    <DropdownMenuItem onClick={() => setMobileSearchCategory("This Community")}>
                      This Community
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setMobileSearchCategory("Products")}>
                    Products
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMobileSearchCategory("Experts")}>
                    Experts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMobileSearchCategory("Communities")}>
                    Communities
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setMobileSearchCategory("Jobs")}>
                    Jobs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                placeholder={`Search ${mobileSearchCategory.toLowerCase()}...`}
                type="search"
              />
              <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                <Search className="h-3.5 w-3.5" />
              </Button>
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
                  <SelectTrigger className="border-0 w-[200px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-7 text-sm [&>span]:whitespace-nowrap [&>span]:overflow-visible">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-[240px]">
                    {isCommunityPage && (
                      <SelectItem value="ThisCommunity" className="whitespace-nowrap">This Community</SelectItem>
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
