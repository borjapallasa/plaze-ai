
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import Typewriter from "typewriter-effect";
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

const typewriterStrings = [
  "Products to Scale",
  "Communities to Learn",
  "Experts to Hire",
  "Jobs to Earn"
];

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

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileSearchCategory, setMobileSearchCategory] = useState(getInitialSearchCategory());
  const [desktopSearchCategory, setDesktopSearchCategory] = useState(getInitialSearchCategory());

  React.useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 10);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-200 ease-out bg-background/95 ${
      isScrolled ? 'bg-background' : ''
    }`}>
      <div className="container mx-auto px-4 pb-[10px]">
        <div className="hidden sm:flex relative py-2">
          <div className="w-[20%] flex items-start">
            <h1 className="text-2xl font-semibold mt-[12px] ml-[15px]">Logo</h1>
          </div>

          <div className="w-[60%] flex flex-col items-center">
            <div className={`transition-all duration-300 ease-out mt-[12px] ${
              isScrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-[32px] mb-[16px]'
            }`}>
              <div className="text-[1.5rem] leading-relaxed font-bold whitespace-nowrap flex items-center justify-center">
                <span>The Best AI & Automations</span>
                <span className="text-muted-foreground ml-1">
                  <Typewriter
                    options={{
                      strings: typewriterStrings,
                      autoStart: true,
                      loop: true,
                      delay: 50,
                      deleteSpeed: 30,
                    }}
                  />
                </span>
              </div>
            </div>

            <div className={`transition-all duration-200 ease-out ${
              isScrolled ? 'w-[360px]' : 'w-[540px]'
            }`}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-md hover:shadow-lg transition-shadow bg-background">
                <div className="flex-1 flex items-center gap-2">
                  <Select 
                    defaultValue={desktopSearchCategory}
                    onValueChange={setDesktopSearchCategory}
                  >
                    <SelectTrigger className="border-0 w-[140px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9">
                      <SelectValue className="pr-4" />
                    </SelectTrigger>
                    <SelectContent className="w-[180px]">
                      <SelectItem value="Products">Products</SelectItem>
                      <SelectItem value="Experts">Experts</SelectItem>
                      <SelectItem value="Communities">Communities</SelectItem>
                      <SelectItem value="Jobs">Jobs</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-9"
                    placeholder={getPlaceholder(desktopSearchCategory)}
                    type="search"
                  />
                </div>
                <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="w-[20%] flex items-start justify-end">
            <div className="flex items-center gap-3 mt-[12px] mr-[15px]">
              <Button 
                variant="ghost" 
                size="sm" 
                className="font-medium text-primary hover:text-primary/90 hover:bg-primary/10"
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

        {/* Mobile Header */}
        <div className="sm:hidden py-2">
          <div className="flex items-center justify-between gap-3">
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
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-border" />
    </header>
  );
};
