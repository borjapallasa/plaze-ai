
import React, { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, ChevronDown, LogOut, Home, UserCircle, Users, Store, HelpCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CartDrawerTrigger } from "@/components/cart/CartDrawerTrigger";
import { useQuery } from "@tanstack/react-query";

export const MainHeader = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

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

  // Get expert UUID if user is an expert - using case insensitive email comparison
  const { data: expertData } = useQuery({
    queryKey: ['expert-by-email', user?.email],
    queryFn: async () => {
      if (!user?.email || !isExpert) return null;
      
      const { data, error } = await supabase
        .from('experts')
        .select('expert_uuid')
        .ilike('email', user.email) // Use ilike for case insensitive comparison
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching expert:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.email && isExpert,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [showSearchHistory, setShowSearchHistory] = useState(false);

  // Save search history to localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Initialize search query from URL if we're on the search page
  useEffect(() => {
    if (location.pathname === '/search') {
      const queryParam = searchParams.get('q');
      if (queryParam) {
        setSearchQuery(queryParam);
        setMobileSearchQuery(queryParam);
      }
    }
  }, [location.pathname, searchParams]);

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  const handleSearch = (e: FormEvent, isMobile: boolean) => {
    e.preventDefault();
    const query = isMobile ? mobileSearchQuery : searchQuery;

    if (!query.trim()) return;

    // Add to search history (avoid duplicates and limit to 5 items)
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 5);
      return newHistory;
    });

    // Hide search history dropdown
    setShowSearchHistory(false);

    // Navigate to search results page with query parameter
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  // Add click outside handler to close search history dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('input[type="search"]') && !target.closest('.search-history-dropdown')) {
        setShowSearchHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b">
      <div className="container mx-auto px-4 h-full">
        {/* Mobile Header */}
        <div className="flex md:hidden items-center justify-between h-full">
          {/* Menu on the left - with smaller width */}
          <div className="w-10 flex justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full px-2.5 py-1.5 h-8 border-[0.5px] border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors"
                >
                  <Menu className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <Link to="/">
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                </Link>
                {user ? (
                  <>
                    <Link to="/personal-area">
                      <DropdownMenuItem>
                        <UserCircle className="mr-2 h-4 w-4" />
                        Personal Area
                      </DropdownMenuItem>
                    </Link>
                    {isExpert && (
                      <Link to={expertData?.expert_uuid ? `/seller/${expertData.expert_uuid}` : "/sell"}>
                        <DropdownMenuItem>
                          <Store className="mr-2 h-4 w-4" />
                          Seller Area
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <Link to="/account/chats">
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chats
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <Link to="/sign-in">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </>
                )}
                <Link to="/affiliates">
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Affiliates
                  </DropdownMenuItem>
                </Link>
                {!isExpert && (
                  <Link to="/sell">
                    <DropdownMenuItem>
                      <Store className="mr-2 h-4 w-4" />
                      Sell on Plaze
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Center
                </DropdownMenuItem>
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search bar in the middle - with more space */}
          <div className="flex-1 px-3">
            <form onSubmit={(e) => handleSearch(e, true)} className={`flex items-center gap-1 px-3 ${isHomePage ? 'py-1.5' : 'py-1.5'} rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background`}>
              <div className="relative flex-1">
                <Input
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent ${isHomePage ? 'h-8 text-sm' : 'h-7 text-sm'} flex-1`}
                  placeholder={isHomePage ? "Search..." : "Search..."}
                  type="search"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                />

                {/* Search History Dropdown (Mobile) */}
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-10 search-history-dropdown">
                    <div className="p-1 text-xs text-muted-foreground border-b">Recent searches</div>
                    <ul>
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setMobileSearchQuery(item);
                            setShowSearchHistory(false);
                            navigate(`/search?q=${encodeURIComponent(item)}`);
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="p-1 text-xs text-primary hover:underline cursor-pointer text-center border-t"
                      onClick={() => {
                        setSearchHistory([]);
                        setShowSearchHistory(false);
                      }}
                    >
                      Clear history
                    </div>
                  </div>
                )}
              </div>
              <Button type="submit" size="icon" variant="default" className={`rounded-full bg-primary hover:bg-primary/90 ${isHomePage ? 'h-8 w-8' : 'h-7 w-7'}`}>
                <Search className={isHomePage ? "h-4 w-4" : "h-3.5 w-3.5"} />
              </Button>
            </form>
          </div>
          
          {/* Cart on the right - with smaller width */}
          <div className="w-10 flex justify-end">
            <CartDrawerTrigger />
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-full gap-4">
          <Link to="/" className="w-[140px] flex items-center">
            <img 
              src="/lovable-uploads/84b87a79-21ab-4d4e-b6fe-3af1f7e0464d.png" 
              alt="Plaze.ai" 
              className="h-6 w-auto"
            />
          </Link>

          <div className={`flex-1 ${isHomePage ? 'max-w-lg' : 'max-w-md'} mx-auto`}>
            <form onSubmit={(e) => handleSearch(e, false)} className={`flex items-center gap-1 px-3 py-1.5 rounded-full border shadow-sm hover:shadow-md transition-shadow bg-background`}>
              <div className="flex-1 relative">
                <Input
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-8 text-sm`}
                  placeholder={isHomePage ? "Search for products, experts, communities..." : "Search..."}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                />

                {/* Search History Dropdown */}
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-md z-10 search-history-dropdown">
                    <div className="p-1 text-xs text-muted-foreground border-b">Recent searches</div>
                    <ul>
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-muted cursor-pointer text-sm"
                          onClick={() => {
                            setSearchQuery(item);
                            setShowSearchHistory(false);
                            navigate(`/search?q=${encodeURIComponent(item)}`);
                          }}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div
                      className="p-1 text-xs text-primary hover:underline cursor-pointer text-center border-t"
                      onClick={() => {
                        setSearchHistory([]);
                        setShowSearchHistory(false);
                      }}
                    >
                      Clear history
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <Button type="submit" size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90 h-8 w-8">
                  <Search className="h-4 w-4" />
                </Button>
                {!isHomePage && (
                  <span className="text-xs text-muted-foreground hidden lg:inline-block ml-1">
                    <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px]">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 bg-muted rounded border border-border text-[10px] ml-1">K</kbd>
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="flex items-center gap-3 w-[140px] justify-end">
            <CartDrawerTrigger />
            
            {!user && !isExpert && (
              <Button
                variant="ghost"
                size="sm"
                className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10 h-8 hidden lg:flex"
                asChild
              >
                <Link to="/sell">
                  Sell on Plaze
                </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-full px-2.5 py-1.5 h-8 border-[0.5px] border-muted-foreground/30 hover:border-muted-foreground/50 transition-colors"
                >
                  <Menu className="h-3.5 w-3.5 mr-1.5" />
                  <User className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <Link to="/">
                  <DropdownMenuItem>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </DropdownMenuItem>
                </Link>
                {user ? (
                  <>
                    <Link to="/personal-area">
                      <DropdownMenuItem>
                        <UserCircle className="mr-2 h-4 w-4" />
                        Personal Area
                      </DropdownMenuItem>
                    </Link>
                    {isExpert && (
                      <Link to={expertData?.expert_uuid ? `/seller/${expertData.expert_uuid}` : "/sell"}>
                        <DropdownMenuItem>
                          <Store className="mr-2 h-4 w-4" />
                          Seller Area
                        </DropdownMenuItem>
                      </Link>
                    )}
                    <Link to="/account/chats">
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chats
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </>
                ) : (
                  <>
                    <Link to="/sign-in">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Sign In
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                  </>
                )}
                <Link to="/affiliates">
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    Affiliates
                  </DropdownMenuItem>
                </Link>
                {!isExpert && (
                  <Link to="/sell">
                    <DropdownMenuItem>
                      <Store className="mr-2 h-4 w-4" />
                      Sell on Plaze
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help Center
                </DropdownMenuItem>
                {user && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Pass children to allow additional content */}
      {children}
    </header>
  );
};
