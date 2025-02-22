
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MainHeader = ({ initialSearchCategory = "Products" }: { initialSearchCategory?: string }) => {
  const location = useLocation();
  
  const getInitialSearchCategory = () => {
    if (initialSearchCategory) {
      return initialSearchCategory;
    }
    if (location.pathname.includes('/community') || location.pathname.includes('/classroom')) {
      return "This Community";
    }
    if (location.pathname.includes('/expert')) {
      return "Experts";
    }
    if (location.pathname.includes('/jobs')) {
      return "Jobs";
    }
    if (location.pathname.includes('/blog')) {
      return "Products";
    }
    return "Products"; // default fallback
  };

  const [mobileSearchCategory, setMobileSearchCategory] = useState(getInitialSearchCategory());
  const [desktopSearchCategory, setDesktopSearchCategory] = useState(getInitialSearchCategory());

  const getPlaceholder = (category: string) => {
    switch(category) {
      case "This Community":
        return "Search in this community...";
      case "Products":
        return "Search products...";
      case "Experts":
        return "Search experts...";
      case "Communities":
        return "Search communities...";
      case "Jobs":
        return "Search jobs...";
      default:
        return "Search...";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b">
      <div className="container mx-auto px-4 h-full">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-full gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-transparent"
                      aria-label="Select search category"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {(location.pathname.includes('/community') || location.pathname.includes('/classroom')) && (
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
              </div>
              <Input
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                placeholder={getPlaceholder(mobileSearchCategory)}
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
              <Link to="/">
                <DropdownMenuItem>
                  Home
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Sign In</DropdownMenuItem>
              <DropdownMenuItem>Sign Up</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to="/affiliates">
                <DropdownMenuItem>Affiliates</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Sell on Plaze</DropdownMenuItem>
              <DropdownMenuItem>Help Center</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-full gap-4">
          <Link to="/" className="text-lg font-semibold w-[140px]">
            Logo
          </Link>

          <div className="flex-1 max-w-2xl mx-auto">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background mb-3">
              <div className="flex-1 flex items-center gap-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 p-0 hover:bg-transparent"
                      aria-label="Select search category"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    {(location.pathname.includes('/community') || location.pathname.includes('/classroom')) && (
                      <DropdownMenuItem onClick={() => setDesktopSearchCategory("This Community")}>
                        This Community
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => setDesktopSearchCategory("Products")}>
                      Products
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDesktopSearchCategory("Experts")}>
                      Experts
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDesktopSearchCategory("Communities")}>
                      Communities
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setDesktopSearchCategory("Jobs")}>
                      Jobs
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm"
                  placeholder={getPlaceholder(desktopSearchCategory)}
                  type="search"
                />
              </div>
              <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-[140px] justify-end">
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
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link to="/">
                  <DropdownMenuItem>
                    Home
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem>Sign In</DropdownMenuItem>
                <DropdownMenuItem>Sign Up</DropdownMenuItem>
                <DropdownMenuSeparator />
                <Link to="/affiliates">
                  <DropdownMenuItem>Affiliates</DropdownMenuItem>
                </Link>
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
