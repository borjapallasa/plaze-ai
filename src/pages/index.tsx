
import React, { useState, useEffect, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Typewriter from 'typewriter-effect';
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CategoryHeader } from "@/components/CategoryHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const typewriterStrings = [
  "Products To Scale",
  "Experts To Hire",
  "Jobs To Earn",
  "Communities To Learn"
];

const Header = ({ isScrolled, searchCategory, setSearchCategory }) => {
  const isMobile = useIsMobile();

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm transition-all duration-200 ease-out bg-white border-b ${
        isScrolled ? 'h-[80px] bg-[#FFFFFF] mt-[5px]' : 'bg-background'
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
            <div className="flex items-center gap-3 mt-[15px] mr-[15px]">
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
                    className="rounded-full px-3 py-2 h-10 border-2 hover:border-primary/20 transition-colors"
                  >
                    <Menu className="h-4 w-4 mr-2" />
                    <User className="h-4 w-4" />
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

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data;
    }
  });

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

  const filteredProducts = useMemo(() => 
    selectedCategory && products
      ? products.filter(product => product.type === selectedCategory)
      : products,
    [selectedCategory, products]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen pt-[180px] md:pt-[200px] flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[180px] md:pt-[200px]">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-500">
            Error loading products. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <MemoizedHeader 
        isScrolled={isScrolled}
        searchCategory={searchCategory}
        setSearchCategory={setSearchCategory}
      />

      <main className="pt-[180px] md:pt-[200px]">
        <CategoryHeader 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {filteredProducts?.map((product) => (
              <ProductCard
                key={product.product_uuid}
                id={product.product_uuid}
                slug={product.slug}
                title={product.name}
                price="Free"
                image="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                seller={product.user_uuid}
                description={product.description}
                tags={product.tech_stack ? product.tech_stack.split(',') : []}
                category={product.type}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
