import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const products = [
  {
    title: "Vintage Camera",
    price: "$299.99",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    seller: "Retro Collectibles"
  },
  {
    title: "Modern Laptop",
    price: "$1,299.99",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    seller: "Tech Haven"
  },
  {
    title: "Professional Setup",
    price: "$2,499.99",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    seller: "WorkSpace Solutions"
  },
  {
    title: "Home Office Bundle",
    price: "$899.99",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    seller: "Modern Essentials"
  }
];

const banners = [
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
    action: "Sign Up"
  },
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
    action: "Sign Up"
  },
  {
    title: "Special Offer",
    description: "Get 20% off on your first purchase when you sign up today.",
    action: "Sign Up"
  }
];

const Index = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10 w-full max-w-md"
                placeholder="Search products..."
                type="search"
              />
            </div>
          </div>
          <div className="p-6 border-b border-gray-200">
            {isMobile ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                      <div className="bg-accent rounded-lg p-4">
                        <h3 className="text-lg font-semibold mb-1">{banner.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{banner.description}</p>
                        <Button size="sm" variant="secondary">{banner.action}</Button>
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
                  <div key={index} className="bg-accent rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-1">{banner.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{banner.description}</p>
                    <Button size="sm" variant="secondary">{banner.action}</Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Marketplace</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;