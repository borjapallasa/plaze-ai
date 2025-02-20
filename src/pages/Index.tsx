import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Search, 
  Globe, 
  Menu, 
  User,
  Star,
  Target,
  Building,
  DollarSign,
  ChartBar,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Typewriter from 'typewriter-effect';
import { Badge } from "@/components/ui/badge";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const typewriterStrings = [
  "Products To Scale",
  "Experts To Hire",
  "Jobs To Earn",
  "Communities To Learn"
];

const products = [
  // ... (same products array as in initial code)
];

const banners = [
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
  },
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
  },
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
  }
];

const badges = [
  { label: "Trending", icon: Star, category: null },
  { label: "Templates", icon: Star, category: "template" },
  { label: "Prompt", icon: Star, category: "prompt" },
  { label: "Communities", icon: User, category: "community" },
  { label: "Experts", icon: Target, category: "expert" }
];

const departments = [
  { name: "Business", icon: Building },
  { name: "Jobs", icon: User },
  { name: "Partners", icon: User },
  { name: "Finance", icon: DollarSign },
  { name: "Analytics", icon: ChartBar },
  { name: "Teams", icon: User },
  { name: "Logistics", icon: Star },
  { name: "Manufacturing", icon: Building },
  { name: "Payments", icon: DollarSign },
  { name: "Commerce", icon: ShoppingBag },
  { name: "Marketing", icon: Target },
  { name: "Settings", icon: Menu }
];

const Header = ({ isScrolled, searchCategory, setSearchCategory }) => {
  const isMobile = useIsMobile();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-200 ease-out bg-white border-b ${
        isScrolled ? 'h-[80px] bg-background/95 mt-[5px]' : 'bg-background'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="sm:hidden px-4 py-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-md bg-background">
            <div className="flex-1 flex items-center gap-2">
              <Select 
                defaultValue="Products" 
                onValueChange={setSearchCategory}
              >
                <SelectTrigger className="border-0 w-[120px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9">
                  <SelectValue className="pr-4" />
                </SelectTrigger>
                <SelectContent className="w-[150px]">
                  <SelectItem value="Products">Products</SelectItem>
                  <SelectItem value="Experts">Experts</SelectItem>
                  <SelectItem value="Communities">Communities</SelectItem>
                  <SelectItem value="Jobs">Jobs</SelectItem>
                </SelectContent>
              </Select>
              <Input
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-9"
                placeholder={`Search ${searchCategory.toLowerCase()}...`}
                type="search"
              />
            </div>
            <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="hidden sm:flex relative pb-[20px]">
          <div className="w-[20%] flex items-start">
            <h1 className="text-2xl font-semibold mt-[15px] ml-[15px]">Logo</h1>
          </div>

          <div className="w-[60%] flex flex-col items-center">
            <div 
              className={`transition-all duration-300 ease-out mt-[15px] ${
                isScrolled ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-[32px] mb-[20px]'
              }`}
            >
              <div className="text-[1.5rem] leading-relaxed font-bold whitespace-nowrap flex items-center justify-center">
                <span>The Best AI & Automation</span>
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

            <div 
              className={`flex justify-center transition-transform duration-300 ease-in-out ${
                isScrolled ? 'transform -translate-y-[10px]' : ''
              }`}
            >
              <div 
                className={`transition-all duration-200 ease-out ${
                  isScrolled ? 'w-[360px]' : 'w-[540px]'
                }`}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-md hover:shadow-lg transition-shadow bg-background">
                  <div className="flex-1 flex items-center gap-2">
                    <Select 
                      defaultValue="Products" 
                      onValueChange={setSearchCategory}
                    >
                      <SelectTrigger className="border-0 w-[120px] focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9">
                        <SelectValue className="pr-4" />
                      </SelectTrigger>
                      <SelectContent className="w-[150px]">
                        <SelectItem value="Products">Products</SelectItem>
                        <SelectItem value="Experts">Experts</SelectItem>
                        <SelectItem value="Communities">Communities</SelectItem>
                        <SelectItem value="Jobs">Jobs</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2 bg-transparent h-9"
                      placeholder={`Search ${searchCategory.toLowerCase()}...`}
                      type="search"
                    />
                  </div>
                  <Button size="icon" variant="default" className="rounded-full bg-primary hover:bg-primary/90">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[20%] flex items-start justify-end">
            <div className="flex items-center gap-2 mt-[15px] mr-[15px]">
              <Button variant="ghost" size="sm" className="font-medium">
                Add Product
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full p-1 h-10">
                    <Menu className="h-4 w-4 mr-2" />
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Sign up</DropdownMenuItem>
                  <DropdownMenuItem>Log in</DropdownMenuItem>
                  <DropdownMenuItem>List your product</DropdownMenuItem>
                  <DropdownMenuItem>Help</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const MemoizedHeader = React.memo(Header);

const Index = () => {
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchCategory, setSearchCategory] = useState("Products");
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
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

  useEffect(() => {
    if (!api) {
      return;
    }

    const onScroll = () => {
      setCanScrollPrev(api.canScrollPrev());
    };

    api.on("scroll", onScroll);
    api.on("reInit", onScroll);

    // Initial check
    onScroll();

    return () => {
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
    };
  }, [api]);

  const filteredProducts = useMemo(() => 
    selectedCategory
      ? products.filter(product => product.category === selectedCategory)
      : products,
    [selectedCategory]
  );

  const handleBadgeClick = (category: string | null) => {
    setSelectedCategory(prevCategory => 
      prevCategory === category ? null : category
    );
  };

  return (
    <div className="min-h-screen">
      <MemoizedHeader 
        isScrolled={isScrolled}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <div 
        className={`sticky bg-background border-b transition-[top] duration-300 ease-in-out ${
          isScrolled ? 'top-20 z-40' : 'top-[140px] z-30'
        }`}
      >
        <div className="container mx-auto px-4 py-4 relative">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {departments.map((dept, index) => {
                const Icon = dept.icon;
                return (
                  <CarouselItem key={index} className="pl-4 basis-[120px]">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Icon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {dept.name}
                      </span>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {canScrollPrev && (
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background via-background to-transparent z-10" />
            )}
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background via-background to-transparent z-10" />
            {canScrollPrev && (
              <CarouselPrevious 
                className="md:-left-12 left-2 bg-background/80 backdrop-blur-sm"
              />
            )}
            <CarouselNext 
              className="md:-right-12 right-2 bg-background/80 backdrop-blur-sm"
            />
          </Carousel>
        </div>
      </div>

      <main>
        <div className="container mx-auto px-4">
          <div 
            className={`space-y-6 py-6 transition-[margin] duration-300 ease-in-out ${
              isScrolled ? 'mt-24' : 'mt-32'
            }`}
          >
            {isMobile ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-accent rounded-lg p-3 relative group cursor-pointer hover:bg-accent/90 transition-colors">
                        <h3 className="text-lg font-semibold mb-1">{banner.title}</h3>
                        <p className="text-muted-foreground text-sm pr-6">{banner.description}</p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {banners.map((banner, index) => (
                  <div key={index} className="bg-accent rounded-lg p-3 relative group cursor-pointer hover:bg-accent/90 transition-colors">
                    <h3 className="text-lg font-semibold mb-1">{banner.title}</h3>
                    <p className="text-muted-foreground text-sm pr-6">{banner.description}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {badges.map((badge, index) => {
                const Icon = badge.icon;
                const isSelected = selectedCategory === badge.category;
                return (
                  <Badge
                    key={index}
                    variant={isSelected ? "default" : "secondary"}
                    className={`px-4 py-2 text-sm font-medium cursor-pointer hover:bg-secondary/80 transition-colors ${
                      isSelected ? 'bg-primary text-primary-foreground' : ''
                    }`}
                    onClick={() => handleBadgeClick(badge.category)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {badge.label}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
