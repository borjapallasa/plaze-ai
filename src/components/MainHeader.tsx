
import React, { useState, FormEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, User, ChevronDown, LogOut } from "lucide-react";
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

export const MainHeader = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

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
        <div className="flex md:hidden items-center justify-between h-full gap-3">
          <div className="flex-1">
            <form onSubmit={(e) => handleSearch(e, true)} className={`flex items-center gap-2 px-4 ${isHomePage ? 'py-3' : 'py-2'} rounded-full bg-muted/30 border-2 border-border/20 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 focus-within:border-primary/40 focus-within:shadow-md focus-within:bg-background`}>
              <div className="relative flex-1">
                <Input
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 bg-transparent ${isHomePage ? 'h-6 text-base placeholder:text-muted-foreground/60' : 'h-5 text-sm placeholder:text-muted-foreground/60'} flex-1`}
                  placeholder={isHomePage ? "Search for products, communities..." : "Search..."}
                  type="search"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                />

                {/* Search History Dropdown (Mobile) */}
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border/20 rounded-lg shadow-lg z-10 search-history-dropdown">
                    <div className="p-2 text-xs text-muted-foreground border-b border-border/20">Recent searches</div>
                    <ul>
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm transition-colors"
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
                      className="p-2 text-xs text-primary hover:underline cursor-pointer text-center border-t border-border/20"
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
              <Button type="submit" size="icon" variant="default" className={`rounded-full bg-primary hover:bg-primary/90 transition-colors ${isHomePage ? 'h-8 w-8' : 'h-6 w-6'}`}>
                <Search className={isHomePage ? "h-4 w-4" : "h-3 w-3"} />
              </Button>
            </form>
          </div>
          
          <CartDrawerTrigger className="mr-2" />
          
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
              <Link to="/sell">
                <DropdownMenuItem>Sell on Plaze</DropdownMenuItem>
              </Link>
              <DropdownMenuItem>Help Center</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-full gap-6">
          <Link to="/" className="text-lg font-semibold w-[140px]">
            Logo
          </Link>

          <div className={`flex-1 ${isHomePage ? 'max-w-4xl' : 'max-w-3xl'} mx-auto`}>
            <form onSubmit={(e) => handleSearch(e, false)} className={`flex items-center gap-3 px-5 py-3 rounded-full bg-muted/20 border-2 border-border/20 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 focus-within:border-primary/50 focus-within:shadow-lg focus-within:bg-background ${isHomePage ? 'py-4' : ''}`}>
              <div className="flex-1 relative">
                <Input
                  className={`border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 bg-transparent ${isHomePage ? 'h-6 text-lg placeholder:text-muted-foreground/60' : 'h-5 text-base placeholder:text-muted-foreground/60'}`}
                  placeholder={isHomePage ? "Search for products, communities..." : "Search..."}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchHistory.length > 0 && setShowSearchHistory(true)}
                  onBlur={() => setTimeout(() => setShowSearchHistory(false), 200)}
                />

                {/* Search History Dropdown */}
                {showSearchHistory && searchHistory.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border/20 rounded-lg shadow-xl z-10 search-history-dropdown">
                    <div className="p-2 text-xs text-muted-foreground border-b border-border/20">Recent searches</div>
                    <ul>
                      {searchHistory.map((item, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-muted/50 cursor-pointer text-sm transition-colors"
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
                      className="p-2 text-xs text-primary hover:underline cursor-pointer text-center border-t border-border/20"
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
              <div className="flex items-center gap-2">
                <Button type="submit" size="icon" variant="default" className={`rounded-full bg-primary hover:bg-primary/90 transition-colors shadow-sm ${isHomePage ? 'h-10 w-10' : 'h-8 w-8'}`}>
                  <Search className={isHomePage ? "h-5 w-5" : "h-4 w-4"} />
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
            <CartDrawerTrigger className="mr-2" />
            
            <Button
              variant="ghost"
              size="sm"
              className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10 h-8"
            >
              <Link to="/sell">
                Sell on Plaze
              </Link>
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
      
      {/* Pass children to allow additional content */}
      {children}
    </header>
  );
};
