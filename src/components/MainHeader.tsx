
import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const getInitialSearchCategory = () => {
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
    return "Global Search"; // default fallback
  };

  const getInitialDesktopSearchCategory = () => {
    if (location.pathname.includes('/community') || location.pathname.includes('/classroom')) {
      return "ThisCommunity";
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
    return "GlobalSearch"; // default fallback
  };

  const [mobileSearchCategory, setMobileSearchCategory] = useState(getInitialSearchCategory());
  const [desktopSearchCategory, setDesktopSearchCategory] = useState(getInitialDesktopSearchCategory());
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const handleSearch = (e: FormEvent, isMobile: boolean) => {
    e.preventDefault();
    const query = isMobile ? mobileSearchQuery : searchQuery;
    
    if (!query.trim()) return;

    // Navigate to search results page with query parameter
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const getPlaceholder = (category: string) => {
    switch(category) {
      case "This Community":
      case "ThisCommunity":
        return "Search in this community...";
      case "Products":
        return "Search products...";
      case "Experts":
        return "Search experts...";
      case "Communities":
        return "Search communities...";
      case "Jobs":
        return "Search jobs...";
      case "Global Search":
      case "GlobalSearch":
        return "Search everything...";
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
            <form onSubmit={(e) => handleSearch(e, true)} className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <Input
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm flex-1"
                placeholder={getPlaceholder(mobileSearchCategory)}
                type="search"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
              />
              <Button type="submit" size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </form>
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
              {user ? (
                <>
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </>
              ) : (
                <>
                  <Link to="/sign-in">
                    <DropdownMenuItem>Sign In</DropdownMenuItem>
                  </Link>
                  <Link to="/sign-up">
                    <DropdownMenuItem>Sign Up</DropdownMenuItem>
                  </Link>
                </>
              )}
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
            <form onSubmit={(e) => handleSearch(e, false)} className="flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background">
              <div className="flex-1 flex items-center gap-1">
                <Input
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-7 text-sm"
                  placeholder={getPlaceholder(desktopSearchCategory)}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-7 w-7">
                <Search className="h-3.5 w-3.5" />
              </Button>
            </form>
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
                  <Menu className="h-3.5 w-3.5 mr-1.5" />
                  <User className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link to="/">
                  <DropdownMenuItem>
                    Home
                  </DropdownMenuItem>
                </Link>
                {user ? (
                  <>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <Link to="/sign-in">
                      <DropdownMenuItem>Sign In</DropdownMenuItem>
                    </Link>
                    <Link to="/sign-up">
                      <DropdownMenuItem>Sign Up</DropdownMenuItem>
                    </Link>
                  </>
                )}
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
